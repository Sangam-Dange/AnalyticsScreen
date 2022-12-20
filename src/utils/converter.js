export const converter = (val) => {
  let str = val?.toString();

  switch (true) {
    case str.length > 6 && str.length < 10:
      return (val / Math.pow(10, 6)).toFixed(2) + "M";

    case str.length <= 6 && str.length > 3:
      return (val / Math.pow(10, 3)).toFixed(2) + "K";

    default:
      break;
  }

  return str;
};
