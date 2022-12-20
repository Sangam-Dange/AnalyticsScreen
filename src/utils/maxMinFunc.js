export const maxMinFunc = async (data, val, maxOrMin) => {
  try {
    await data;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    var tmp;

    for (var i = 0; i < data?.length; i++) {
      tmp = data[i][val];

      if (tmp < min) min = tmp;
      if (tmp > max) max = tmp;
    }
    min = Math.floor(min);
    max = Math.round(max+1);

    return { max, min };
  } catch (error) {
    console.log(error);
  }
};
