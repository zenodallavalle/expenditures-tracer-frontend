export const syncedWithLocalSessionParams = [
  'authToken',
  'workingDBId',
  'categoriesViewStatus',
  'categoriesViewOrder',
];

const safeJSONParse = (serialized) => {
  try {
    return JSON.parse(serialized);
  } catch (e) {
    return undefined;
  }
};

const defaultValues = {
  authToken: null,
  workingDBId: null,
  categoriesViewStatus: {},
  categoriesViewOrder: {},
};

const parameterValueOrDefault = (cachedV, defaultV) =>
  cachedV !== undefined ? cachedV : defaultV;

export const loadInitialParametersSyncWithLocalStorage = () => {
  const cacheParams = safeJSONParse(localStorage.getItem('params')) || {};
  return Object.fromEntries(
    syncedWithLocalSessionParams.map((k) => [
      k,
      parameterValueOrDefault(cacheParams[k], defaultValues[k]),
    ])
  );
};

export const saveParamsInLocalStorage = (params) => {
  localStorage.setItem('params', JSON.stringify(params));
};
