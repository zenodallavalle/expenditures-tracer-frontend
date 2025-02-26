export const getApiVersion = async () => {
  const result = await fetch(`${process.env.REACT_APP_API_ROOT}version/`);
  try {
    const json = await result.json();
    return json;
  } catch (e) {
    console.error(`Error while retrieving API version: ${e}`);
  }
};
