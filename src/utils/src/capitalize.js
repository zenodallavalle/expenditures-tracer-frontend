const capitalize = (x) => {
  if (x === undefined || x === null) return '';
  else if (x.constructor !== String || typeof x !== 'string') {
    x = String(x);
  }
  return `${x.charAt(0).toUpperCase()}${x.slice(1)}`;
};

export default capitalize;
