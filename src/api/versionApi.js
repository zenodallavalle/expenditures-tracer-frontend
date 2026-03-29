export const getApiVersion = async () => {
  console.log('fetching', `${import.meta.env.VITE_API_ROOT}version/`);
  const result = await fetch(`${import.meta.env.VITE_API_ROOT}version/`);
  try {
    const json = await result.json();
    return json;
  } catch (e) {
    console.error(`Error while retrieving API version: ${e}`);
  }
};
