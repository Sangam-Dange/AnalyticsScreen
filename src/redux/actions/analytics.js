import axios from "axios";

export const fetchData = (uri) => async (dispatch) => {
  try {
    dispatch({
      type: "RequestData",
    });

    const { data } = await axios.get(uri);
    if (!data.data) {
      throw Error("Invalid date range provided");
    }

    data?.data?.forEach((element) => {
      let fillRate = (element["requests"] / element["responses"]) * 100;
      let CTR = (element["clicks"] / element["impressions"]) * 100;
      element["fillrate"] = Math.floor(fillRate);
      element["ctr"] = Math.floor(CTR);
    });

    dispatch({
      type: "SaveDataCopy",
      payload: data,
    });
    dispatch({
      type: "RequestDataSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "RequestDataFailure",
      payload: error,
    });
  }
};

export const filterData =
  (filteringData, app_id, filterType, name, max, min) => async (dispatch) => {
    try {
      dispatch({
        type: "FilterData",
      });
      const { cache_time, data } = filteringData;
      let filteredData;
      if (filterType === "search_app") {
        filteredData = await data?.filter((x) => x.app_id === app_id);
      }

      if (filterType === "range") {
        filteredData = await data?.filter(
          (x) => x[name] <= max && x[name] >= min
        );
      }

      dispatch({
        type: "FilterDataSuccess",
        payload: { cache_time, data: filteredData },
      });
    } catch (error) {
      dispatch({
        type: "FilterDataFailure",
        payload: error,
      });
    }
  };
