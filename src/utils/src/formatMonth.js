import dateFormat from 'dateformat';

const formatMonth = (month) => {
  //console.log(month);
  const splitted = month.split('-').map((c) => parseInt(c));
  const d = new Date(splitted[1], splitted[0] - 1, 1, 0, 0, 0);
  //console.log(d);
  const format = 'yyyy - mmm';
  const ret = dateFormat(d, format);
  return ret;
};

export default formatMonth;
