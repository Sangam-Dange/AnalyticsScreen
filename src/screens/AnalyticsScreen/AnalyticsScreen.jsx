import React, { useEffect, useRef, useState } from "react";
import "./AnalyticsScreen.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faGears,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import BottomComponent from "../../components/AnalyticsScreen/BottomComponent";
import { fetchDataHook } from "../../hooks/fetchDataHook";
import { converter } from "../../utils/converter";
import { useSelector } from "react-redux";
import ErrorPage from "../../components/ErrorPage/ErrorPage";
import { useDispatch } from "react-redux";
import { fetchData } from "../../redux/actions/analytics";
import { useParams, useNavigate } from "react-router-dom";
import { maxMinFunc } from "../../utils/maxMinFunc";

// custom hook
const useFetchAndCalCulateDimensions = (data, error) => {
  const fetchingDataAndCal = [
    { id: 1, name: "Date", val: data?.data ? data?.data.length : 0 },
    { id: 2, name: "App", val: data?.data ? data?.data.length : 0 },
    {
      id: 3,
      name: "Clicks",
      val: data?.data
        ? converter(data.data.reduce((data, num) => data + num.clicks, 0))
        : 0,
      range: maxMinFunc(data?.data, "clicks"),
    },
    {
      id: 4,
      name: "Requests",
      val: data?.data
        ? converter(data?.data.reduce((data, num) => data + num.requests, 0))
        : 0,
      range: maxMinFunc(data?.data, "requests"),
    },
    {
      id: 5,
      name: "Responses",
      val: data?.data
        ? converter(data?.data.reduce((data, num) => data + num.responses, 0))
        : 0,
      range: maxMinFunc(data?.data, "responses"),
    },
    {
      id: 6,
      name: "Impressions",
      val: data?.data
        ? converter(data?.data.reduce((data, num) => data + num.impressions, 0))
        : 0,
      range: maxMinFunc(data?.data, "impressions"),
    },
    {
      id: 7,
      name: "Revenue",
      val: data?.data
        ? "$" +
          Math.round(
            data?.data?.reduce((data, num) => data + num.revenue, 0)
          )?.toLocaleString()
        : 0,

      range: maxMinFunc(data?.data, "revenue"),
    },
    {
      id: 8,
      name: "Fill Rate",
      val: data?.data
        ? (
            data?.data.reduce(
              (data, num) => data + (num.requests / num.responses) * 100,
              0
            ) / data?.data.length
          )?.toFixed(2) + "%"
        : 0,
      range: { max: 100, min: 0 },
    },
    {
      id: 9,
      name: "CTR",
      val: data?.data
        ? (
            data?.data.reduce(
              (data, num) => data + (num.clicks / num.impressions) * 100,
              0
            ) / data?.data.length
          )?.toFixed(2) + "%"
        : 0,
      range: { max: 100, min: 0 },
    },
  ];

  const [dimensions, setDimensions] = useState(fetchingDataAndCal);

  useEffect(() => {
    setDimensions(fetchingDataAndCal);
    // eslint-disable-next-line
  }, [data]);

  return [dimensions, setDimensions];
};

// component
const DimensionContainer = ({
  dragItem,
  dragOverItem,
  dimensions,
  setDimensions,
  id,
  name,
  paramsColumns,
  setParamsColumns,
}) => {
  const [toggleSelect, setToggleSelect] = useState(false);

  const swap = () => {
    if (
      dragItem?.current > 1 &&
      dragOverItem?.current > 1 &&
      paramsColumns.length === 9
    ) {
      const rows = document.querySelectorAll("table > tbody > tr");
      for (const row of rows) {
        var temp = row.children[dragItem?.current].innerHTML;

        row.children[dragItem?.current].innerHTML =
          row.children[dragOverItem?.current].innerHTML;
        row.children[dragOverItem?.current].innerHTML = temp;
      }
    }
  };

  const handleSort = () => {
    if (
      dragItem?.current > 1 &&
      dragOverItem?.current > 1 &&
      paramsColumns.length === 9
    ) {
      // making a duplicate of dimensions array for manipulation
      let _dimensions = [...dimensions];

      // splicing only one element after selecting particular item which is going to be dragged
      // it means we are grabbing the dragged element
      // let draggedItemContent = _dimensions.splice(dragItem.current, 1)[0];

      // console.log(draggedItemContent);

      //replacing it with the dragover element
      var temp = _dimensions[dragOverItem.current];
      _dimensions[dragOverItem.current] = _dimensions[dragItem.current];
      _dimensions[dragItem.current] = temp;
      // _dimensions.splice(dragOverItem.current, 0, draggedItemContent);

      swap();
      // setting the value to null of useRefs
      dragItem.current = null;
      dragOverItem.current = null;

      //setting the duplicated to original
      setDimensions(_dimensions);
    }
  };

  useEffect(() => {
    if (!paramsColumns.includes(name)) {
      setToggleSelect(true);
    } else {
      setToggleSelect(false);
    }
  }, [paramsColumns]);

  const handleRemoveAdd = () => {
    if (!toggleSelect) {
      setParamsColumns(paramsColumns.filter((x) => x !== name));
      setToggleSelect(true);
    } else {
      setToggleSelect(false);
      setParamsColumns([...paramsColumns, name]);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => (dragItem.current = id)}
      onDragEnter={(e) => (dragOverItem.current = id)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={handleSort}
      className={`dimension ${toggleSelect && "toggle__div"}`}
      key={id}
    >
      <p className={toggleSelect ? "toggle__p" : ""}>{name}</p>

      {id > 1 && (
        <FontAwesomeIcon
          icon={toggleSelect ? faPlus : faMinus}
          color={!toggleSelect ? "grey" : "#136fed"}
          onClick={handleRemoveAdd}
          className="toggle__icon"
        />
      )}
    </div>
  );
};

const AnalyticsScreen = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // working on date
  const todaysDate = new Date().toDateString();
  var todayTempDate = new Date().toLocaleDateString("en-CA");
  const [settingToggler, setSettingToggler] = useState(false);
  const [startDate, setStartDate] = useState(
    params?.start ? params?.start : todayTempDate
  );
  const [d1, setD1] = useState(false);

  const [endDate, setEndDate] = useState(
    params?.end ? params?.end : todayTempDate
  );
  const [d2, setD2] = useState(false);

  const fetchAllReportsUri = `http://go-dev.greedygame.com/v3/dummy/report?startDate=${startDate}&endDate=${endDate}`;

  useEffect(() => {
    dispatch(fetchData(fetchAllReportsUri));
  }, [dispatch, fetchAllReportsUri, startDate, endDate]);

  // fetching data and calculating header values
  const { data, error } = useSelector((state) => state.analyticsData);
  const [dimensions, setDimensions] = useFetchAndCalCulateDimensions(
    data,
    error
  );

  useEffect(() => {
    if (error) {
      dispatch({ type: "ClearErrors" });
    }
    // eslint-disable-next-line
  }, [startDate, endDate]);

  // fetching all apps and mapping
  const fetchAllApps = `http://go-dev.greedygame.com/v3/dummy/apps`;
  const [{ data: appName }] = fetchDataHook({}, fetchAllApps);

  var [appMapping] = useState({});

  // mapping the app names to their respective values
  const setMapping = async () => {
    try {
      await appName;
      appName?.data.forEach(({ app_id, app_name }) => {
        appMapping[app_id] = app_name;
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMapping();
    // eslint-disable-next-line
  }, [appName]);

  // dragging functionality
  const dragItem = useRef();
  const dragOverItem = useRef();

  // handling routing params (columns)
  const [paramsColumns, setParamsColumns] = useState(
    params.dimensions
      ? params.dimensions.split(",")
      : [
          "Date",
          "App",
          "Clicks",
          "Requests",
          "Responses",
          "Impressions",
          "Revenue",
          "Fill Rate",
          "CTR",
        ]
  );

  const handleApplyChanges = () => {
    if ((startDate || endDate) && paramsColumns.length === 9) {
      navigate(`/analytics/from=${startDate}&to=${endDate}`);
    } else if ((startDate || endDate) && paramsColumns.length < 9) {
      let includedDimensions = "";
      const len = paramsColumns.length;

      for (let i = 0; i < len; i++) {
        includedDimensions += paramsColumns[i];
        if (i !== len - 1) includedDimensions += ",";
      }

      navigate(
        `/analytics/from=${startDate}&to=${endDate}&columns=${includedDimensions}`
      );
    }
    setSettingToggler(false);
  };

  return (
    <div className="wrapper">
      <h1>Analytics</h1>
      <div className="header">
        <div className={`date__picker block__style ${d1 && d2  && "toggle__date__display"}`}>
          <FontAwesomeIcon icon={faCalendarDays} size={"1x"} color="#116FED" />
          <h4 onClick={() => setD1(!d1)}>
            {startDate
              ? new Date(startDate).toDateString().substring(4, 10)
              : todaysDate.substring(4, 10)}{" "}
            -
          </h4>
          {d1 && (
            <input
              type="date"
              name="start"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="calender"
            />
          )}

          <h4 onClick={() => setD2(!d2)}>
            {endDate
              ? new Date(endDate).toDateString().substring(4, 10) +
                " , " +
                new Date(endDate).toDateString().substring(10, 15)
              : todaysDate.substring(4, 10) +
                " , " +
                todaysDate.substring(10, 15)}
          </h4>

          {d2 && (
            <input
              type="date"
              name="start"
              id="startDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="calender"
            />
          )}
        </div>

        <div
          className="settings block__style"
          onClick={() => setSettingToggler(true)}
        >
          <FontAwesomeIcon icon={faGears} size={"1x"} color="#136FED" />
          <h4>Settings</h4>
        </div>
      </div>

      {settingToggler && (
        <div className="dimensions__cnt ">
          <h4>Dimensions and Metrics</h4>

          <div className="dimensions">
            {dimensions?.map(({ id, name, val }, i) => {
              return (
                <DimensionContainer
                  name={name}
                  key={i}
                  id={i}
                  dragItem={dragItem}
                  dragOverItem={dragOverItem}
                  dimensions={dimensions}
                  setDimensions={setDimensions}
                  paramsColumns={paramsColumns}
                  setParamsColumns={setParamsColumns}
                />
              );
            })}
          </div>

          <div className="buttons">
            <button className="bt1" onClick={() => setSettingToggler(false)}>
              Close
            </button>
            <button className="bt2" onClick={handleApplyChanges}>
              Apply Changes
            </button>
          </div>
        </div>
      )}

      {!error && data && (
        <BottomComponent
          dimensions={dimensions}
          data={data}
          appMapping={appMapping}
          dragItem={dragItem}
          dragOverItem={dragOverItem}
          settingToggler={settingToggler}
          paramsColumns={paramsColumns}
          appName={appName}
        />
      )}

      {error && <ErrorPage />}
    </div>
  );
};

export default AnalyticsScreen;
