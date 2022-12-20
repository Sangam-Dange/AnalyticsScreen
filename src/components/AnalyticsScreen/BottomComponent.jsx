import React, { useEffect, useState } from "react";
import "./BtmComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import appLogo from "../../assets/images/appLogo.png";
import { filterData } from "../../redux/actions/analytics";
import MultiRangeSlider from "./MultiRangeSlider.jsx";

const BottomComponent = ({
  dimensions,
  data,
  appMapping,
  dragItem,
  dragOverItem,
  paramsColumns,
  appName,
}) => {
  // app name searching filter
  const [searchText, setSearchText] = useState({ app_id: "", app_name: "" });
  const [toggleSearchText, setToggleSearchText] = useState(false);
  const dispatch = useDispatch();

  const handleFilterIconClick = (val) => {
    if (val === "App") {
      setToggleSearchText(!toggleSearchText);
      dispatch({ type: "ResettingData" });
    }
  };

  const applySearchAppFiltering = (val) => {
    setToggleSearchText(false);
    dispatch(filterData(data, searchText.app_id, "search_app"));
    setSearchText({ app_id: "", app_name: "" });
  };

  // range filter
  const [range, setRange] = useState({ min: 0, max: Number.POSITIVE_INFINITY });
  const [currMaxMin, setCurrMaxMin] = useState({
    min: 0,
    max: 0,
  });

  const [resetRange, setResetRange] = useState(false);
  const [rangeToggler, setRangeToggler] = useState(false);

  const [currentRange, setCurrRange] = useState({
    name: "clicks",
    ind: 0,
    range: 0,
  });

  const handleResetClick = () => {
    setResetRange(true);

    setTimeout(() => {
      setResetRange(false);
    }, 0.1);
  };

  const handleRangeFilter = () => {
    setRangeToggler(false);
    dispatch(
      filterData(
        data,
        searchText.app_id,
        "range",
        currentRange.name.toLowerCase(),
        range.max,
        range.min
      )
    );
  };

  useEffect(() => {
    if (currentRange.range !== 0) {
      setRangeToggler(true);
    }

    handleResetClick();

    if (
      currentRange.name !== "CTR" &&
      currentRange.name !== "Fill Rate" &&
      currentRange.range !== 0
    ) {
      currentRange?.range?.then(({ max, min }) => setCurrMaxMin({ max, min }));
    } else {
      setCurrMaxMin({
        min: currentRange?.range?.min,
        max: currentRange?.range?.max,
      });
    }
  }, [currentRange.name, currentRange.range]);

  return (
    <div
      className={`table__wrapper   ${
        rangeToggler ? "toggle__scroll-x-h" : "toggle__scroll-x-s"
      } `}
    >
      <table>
        <thead>
          <tr>
            {dimensions?.map(({ name, val, range }, i) => {
              return (
                <th
                  className="th__hide"
                  key={i}
                  style={{ display: !paramsColumns.includes(name) && "none" }}
                >
                  <div className="dimension__header">
                    <FontAwesomeIcon
                      icon={faFilter}
                      color="#707070"
                      className="filter__icon"
                      onClick={() => {
                        handleFilterIconClick(name);
                        setCurrRange({ name, ind: i, range });
                        setRangeToggler(!rangeToggler);
                      }}
                    />
                    <h4>{name}</h4>
                    <h2>{val}</h2>
                  </div>

                  {/* filtering component */}
                  {name === "App" && toggleSearchText && (
                    <div className="search__filter__div">
                      <h4>Select App</h4>
                      <input
                        type="text"
                        placeholder="search"
                        value={searchText.app_name}
                        onChange={(e) =>
                          setSearchText({ app_name: e.target.value })
                        }
                      />
                      <div className="all__apps">
                        {appName?.data
                          ?.filter((x) =>
                            x.app_name
                              .toLowerCase()
                              .includes(searchText.app_name.toLowerCase())
                          )
                          .map(({ app_id, app_name }, i) => {
                            return (
                              <div
                                key={app_id}
                                onClick={() =>
                                  setSearchText({ app_id, app_name })
                                }
                              >
                                <h5> {app_name}</h5>
                                <p>{app_id}</p>
                              </div>
                            );
                          })}
                      </div>

                      <button
                        onClick={applySearchAppFiltering}
                        disabled={false}
                        className="apply__button"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {name === currentRange.name &&
                    currentRange.name !== "App" &&
                    currentRange.name !== "Date" &&
                    rangeToggler && (
                      <div className={`range__filter__div`}>
                        <h4>{currentRange.name}</h4>
                        {!resetRange ? (
                          <MultiRangeSlider
                            min={currMaxMin.min}
                            max={currMaxMin.max}
                            onChange={({ min, max }) => {
                              setRange({ min, max });
                            }}
                          />
                        ) : (
                          <div className="temp__div"></div>
                        )}
                        <div className="range__btn__div">
                          <button
                            onClick={() => {
                              handleResetClick();
                              dispatch({ type: "ResettingData" });
                            }}
                            className="reset__button"
                          >
                            Reset
                          </button>
                          <button
                            className="apply__button"
                            onClick={handleRangeFilter}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.data?.map(
            (
              {
                date,
                app_id,
                clicks,
                impressions,
                requests,
                responses,
                revenue,
                fillrate,
                ctr,
              },
              i
            ) => {
              const dt = new Date(date).toDateString();
              const finDate =
                dt.substring(8, 10) +
                " " +
                dt.substring(4, 7) +
                " " +
                dt.substring(10);

              return (
                <tr key={i}>
                  <td>{finDate}</td>
                  <td>
                    <img src={appLogo} alt="logo" className="logo" />
                    {appMapping[app_id]?.length > 10
                      ? appMapping[app_id]?.substring(0, 10) + "..."
                      : appMapping[app_id]}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("Clicks") && "none",
                    }}
                  >
                    {clicks?.toLocaleString()}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("Requests") && "none",
                    }}
                  >
                    {requests?.toLocaleString()}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("Responses") && "none",
                    }}
                  >
                    {responses?.toLocaleString()}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("Impressions") && "none",
                    }}
                  >
                    {impressions?.toLocaleString()}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("Revenue") && "none",
                    }}
                  >
                    {"$" + revenue?.toFixed(2)}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("Fill Rate") && "none",
                    }}
                  >
                    {fillrate?.toFixed(2) + "%"}
                  </td>
                  <td
                    style={{
                      display: !paramsColumns.includes("CTR") && "none",
                    }}
                  >
                    {ctr?.toFixed(2) + "%"}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BottomComponent;
