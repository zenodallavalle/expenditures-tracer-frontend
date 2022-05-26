export const colors = ['success', 'info', 'warning', 'danger', 'dark'];

const getColorFor = (number = 0) => colors[number % colors.length];

export default getColorFor;
