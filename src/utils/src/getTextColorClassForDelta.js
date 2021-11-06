const getTextColorClassForDelta = (value) => {
  if (!value) {
  } else if (value > 0) {
    return 'text-success';
  } else if (value < 0) {
    return 'text-danger';
  }
  return 'text-dark';
};

export default getTextColorClassForDelta;
