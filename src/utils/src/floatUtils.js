export const parseFloat = (value) => {
  const floated = window.parseFloat(String(value).replace(',', '.').trim());
  if (isNaN(floated)) return undefined;
  return floated;
};

export const formatFloat = (value) => {
  const floated = parseFloat(value);
  if (floated === undefined) return undefined;
  return floated.toFixed(floated >= 1000 ? 0 : 2);
};
