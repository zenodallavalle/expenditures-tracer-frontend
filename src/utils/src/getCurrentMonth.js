const getCurrentMonth = () => {
  const n = new Date();
  const month = n.getMonth() + 1;
  const year = n.getFullYear();
  const monthString = String('0' + month).slice(-2);
  return `${monthString}-${year}`;
};

export default getCurrentMonth;
