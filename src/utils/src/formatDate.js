import dateFormat from 'dateformat';

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
