export const colors = ['warning', 'success', 'info', 'danger', 'dark'];

let _number = 0;

const assigned = {};

export const getColorFor = ({ type, id } = {}) => {
  const tag = `${type}_${id}`;
  if (type === undefined && id === undefined) {
    // no info supplied, cycle colors
    return colors[_number++ % colors.length];
  } else {
    if (!assigned[tag]) {
      assigned[tag] = colors[id % colors.length];
    }
    return assigned[tag];
  }
};
