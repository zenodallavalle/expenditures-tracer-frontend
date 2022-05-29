import getDateFromMonthString from './getDateFromMonthString';
import getLastDateForMonth from './getLastDateForMonth';

const adaptDateForCurrentMonth = (date, month) => {
  const refDate = getDateFromMonthString(month);
  let adapted_date = new Date(
    refDate.getFullYear(),
    refDate.getMonth(),
    date.getDate(),
    8,
    0,
    0
  );
  if (adapted_date.getMonth() !== refDate.getMonth()) {
    adapted_date = new Date(
      refDate.getFullYear(),
      refDate.getMonth(),
      getLastDateForMonth(refDate),
      8,
      0,
      0
    );
  }
  return adapted_date;
};
export default adaptDateForCurrentMonth;
