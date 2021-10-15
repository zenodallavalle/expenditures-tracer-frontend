const getCurrentMonth = () => {
  const n = new Date();
  const month = n.getMonth() + 1;
  const year = n.getFullYear();
  return `${month}-${year}`;
};

export default getCurrentMonth;
