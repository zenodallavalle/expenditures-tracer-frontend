const dateToLocaleISOString = (date = new Date()) => {
  const utcMilliseconds = date.getTime();
  const localMilliseconds =
    utcMilliseconds - date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(localMilliseconds);
  return localDate.toISOString().slice(0, -8);
};

export default dateToLocaleISOString;
