export const syncedWithLocalSessionParams = [
  'authToken',
  'workingDBId',
  'categoriesViewStatus',
  'categoriesViewOrder',
  'balanceChartPeriod',
  'balanceChartType',
  'selectBalanceChartPercentage',
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
  balanceChartPeriod: '1Y',
  balanceChartType: 'complex',
  selectBalanceChartPercentage: false,
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
