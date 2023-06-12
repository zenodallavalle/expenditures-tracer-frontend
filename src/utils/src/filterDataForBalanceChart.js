import { getDateTimeFromMonthString, getCurrentMonth } from './DateTimeUtils';

const calculateDiffInMonths = (dt1, dt2) => {
  const m1 = dt1.getFullYear() * 12 + dt1.getMonth();
  const m2 = dt2.getFullYear() * 12 + dt2.getMonth();
  return m2 - m1;
};

const getFilterMonthFn =
  (period) =>
  ({ month: name, ...month }) => {
    const monthDT = getDateTimeFromMonthString(name);
    const currentMonthDT = getDateTimeFromMonthString(getCurrentMonth());
    if (period === 'YTD') return true;
    else if (period === 'CY')
      return monthDT.getFullYear() === currentMonthDT.getFullYear();
    else if (period === '6M')
      return calculateDiffInMonths(monthDT, currentMonthDT) < 6;

    const periodInYears = parseInt(period.replace('Y', ''));
    if (isNaN(periodInYears)) throw new Error('Invalid period');

    return calculateDiffInMonths(monthDT, currentMonthDT) < periodInYears * 12;
  };

export const filterDataForBalanceChart = (months, period, sort = true) => {
  const filterMonthFn = getFilterMonthFn(period);
  const ret = months.filter(filterMonthFn);
  if (sort)
    return ret.sort((a, b) =>
      getDateTimeFromMonthString(a.month) > getDateTimeFromMonthString(b.month)
        ? 1
        : -1
    );
  return ret;
};
