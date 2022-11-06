import dateFormat from './dateFormatI18n';

export const adaptDateForMonth = (date, month) => {
  const refDate = getDateTimeFromMonthString(month);
  let adapted_date = new Date(
    refDate.getFullYear(),
    refDate.getMonth(),
    date.getDate(),
    8,
    0,
    0
  );
  if (adapted_date.getMonth() === refDate.getMonth()) return adapted_date;
  return new Date(
    refDate.getFullYear(),
    refDate.getMonth(),
    getLastDateForMonth(refDate),
    8,
    0,
    0
  );
};

export const dateToLocaleISOString = (date) => {
  const dt = new Date(date);
  const utcMilliseconds = dt.getTime();
  const localMilliseconds =
    utcMilliseconds - dt.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(localMilliseconds);
  return localDate.toISOString().slice(0, -8);
};

export const getCurrentMonth = () => {
  const n = new Date();
  const month = n.getMonth() + 1;
  const year = n.getFullYear();
  const monthString = String('0' + month).slice(-2);
  return `${monthString}-${year}`;
};

export const getDateTimeFromMonthString = (month) => {
  const splitted = month.split('-').map((c) => parseInt(c));
  return new Date(splitted[1], splitted[0] - 1, 1, 0, 0, 0);
};

export const getFirstDateForPreviousMonth = () => {
  const date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth();

  if (month === 0) {
    month = 11;
    year--;
  } else {
    month--;
  }

  return new Date(year, month, 1);
};

export const getLastDateForMonth = (date) => {
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

export const formatMonth = (month) => {
  const date = getDateTimeFromMonthString(month);
  const format = 'yyyy - mmm';
  const ret = dateFormat(date, format);
  return ret;
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const current_d = new Date();
  let format = 'dddd, mmm dS, yyyy, H:MM';
  if (d.getFullYear() === current_d.getFullYear()) {
    format = 'dddd, mmm dS, H:MM';
  }
  const ret = dateFormat(d, format);
  return ret;
};
