import axios from "axios";
import { useEffect, useState } from "react";

const fetchData = async (setData, uri) => {
  try {
    const data = await axios.get(uri);

    setData(data);
  } catch (error) {
    console.log(error);
  }
};

export const fetchDataHook = (initialValue, uri) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [data, setData] = useState(initialValue);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchData(setData, uri);
  }, [uri]);

  return [data, setData];
};
