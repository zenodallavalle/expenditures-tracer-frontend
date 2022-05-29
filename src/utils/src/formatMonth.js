import dateFormat from './dateFormatI18n';
import getDateFromMonthString from './getDateFromMonthString';

const formatMonth = (month) => {
  const d = getDateFromMonthString(month);
  const format = 'yyyy - mmm';
  const ret = dateFormat(d, format);
  return ret;
};

export default formatMonth;
