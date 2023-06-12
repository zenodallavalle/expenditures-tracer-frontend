const getTextForPercentage = (num, den) => {
  if (!num) return null;
  if (!den) return null;
  const frac = num / den;
  if (isNaN(frac)) return null;
  if (frac <= 1) return `${Math.round(frac * 100)}%`;
  return `${parseFloat(frac).toFixed(2)}x`;
};

export default getTextForPercentage;
