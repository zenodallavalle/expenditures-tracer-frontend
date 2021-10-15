import getCurrentMonth from './getCurrentMonth';

const getWorkingMonth = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('month') || getCurrentMonth();
};

export default getWorkingMonth;
