const getLastDateForMonth = (date) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  let day = 0;
  while (day < 32) {
    if (new Date(year, month, day + 1).getMonth() === month) {
      day++;
    } else {
      break;
    }
  }
  return new Date(year, month, day);
};

export default getLastDateForMonth;
