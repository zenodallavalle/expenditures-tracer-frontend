import dateFormat from 'dateformat';

export const formatMonth = (month) => {
  //console.log(month);
  const splitted = month.split('-').map((c) => parseInt(c));
  const d = new Date(splitted[1], splitted[0] - 1, 1, 0, 0, 0);
  //console.log(d);
  const format = 'yyyy - mmm';
  const ret = dateFormat(d, format);
  return ret;
};

const formatDate = (date) => {
  //console.log(date, typeof date);
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

export default formatDate;
