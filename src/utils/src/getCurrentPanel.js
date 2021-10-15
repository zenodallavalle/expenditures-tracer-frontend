const getCurrentPanel = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('panel') || 'prospect';
};

export default getCurrentPanel;
