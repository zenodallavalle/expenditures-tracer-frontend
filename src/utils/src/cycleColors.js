export const colors = ['warning', 'success', 'info', 'danger', 'dark'];

const hexToRGB = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
};

let _number = 0;
const assigned = {};
let lastColorGiven = null;
let i = 0;
const getColor = (id) => colors[id % colors.length];

export const getColorFor = ({ type, id } = {}) => {
  const tag = `${type}_${id}`;
  if (type === undefined && id === undefined) {
    // no info supplied, cycle colors
    return colors[_number++ % colors.length];
  } else {
    if (!assigned[tag]) {
      let color = getColor(id + i);
      while (color === lastColorGiven) {
        i++;
        color = getColor(id + i);
      }
      assigned[tag] = color;
      lastColorGiven = color;
    }
    return assigned[tag];
  }
};

export const convertBootstrapColorToRGBA = (color, alpha = 1) => {
  switch (color) {
    case 'primary':
      return `rgba(${hexToRGB('#0d6efd').join(',')}, ${alpha})`;
    case 'secondary':
      return `rgba(${hexToRGB('#6c757d').join(',')}, ${alpha})`;
    case 'success':
      return `rgba(${hexToRGB('#198754').join(',')}, ${alpha})`;
    case 'info':
      return `rgba(${hexToRGB('#0dcaf0').join(',')}, ${alpha})`;
    case 'warning':
      return `rgba(${hexToRGB('#ffc107').join(',')}, ${alpha})`;
    case 'danger':
      return `rgba(${hexToRGB('#dc3545').join(',')}, ${alpha})`;
    case 'light':
      return `rgba(${hexToRGB('#f8f9fa').join(',')}, ${alpha})`;
    case 'dark':
      return `rgba(${hexToRGB('#212529').join(',')}, ${alpha})`;
    default:
      throw new Error(`Unknown color ${color}`);
  }
};
