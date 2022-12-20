import { useEffect } from "react";

export const useConsoleLogger = (value) => {
  useEffect(() => {
    console.log(value);
  }, [value]);
};
