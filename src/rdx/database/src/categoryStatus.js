export const getStatus = () => {
  const payload = localStorage.getItem('categoriesViewStatus');
  if (!payload) {
    return {};
  }
  try {
    return JSON.parse(payload);
  } catch (e) {
    return {};
  }
};

export const saveStatus = (id, state) => {
  const status = getStatus();
  status[id] = state;
  localStorage.setItem('categoriesViewStatus', JSON.stringify(status));
};
