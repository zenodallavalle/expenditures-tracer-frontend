const getDateFromMonthString = (month) => {
  const splitted = month.split('-').map((c) => parseInt(c));
  const d = new Date(splitted[1], splitted[0] - 1, 1, 0, 0, 0);
  return d;
};

export default getDateFromMonthString;
