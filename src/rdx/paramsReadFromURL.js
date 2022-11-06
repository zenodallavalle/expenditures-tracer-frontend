import { getCurrentMonth } from 'utils';

export const readFromURLParams = ['workingMonth', 'panel'];

export const readFromURLParamsDefault = {
  workingMonth: getCurrentMonth(),
  panel: 'prospect',
};

const readValueFromQueryString = (param) => {
  const url = new URL(window.location);
  const value = url.searchParams.get(param);
  if (value !== null) return value;
  return;
};

const parameterValueOrDefault = (value, defaultValue) =>
  value !== undefined ? value : defaultValue;

export const loadInitialParametersReadFromURL = () => {
  const initialParams = Object.fromEntries(
    readFromURLParams.map((param) => [param, readValueFromQueryString(param)])
  );
  return Object.fromEntries(
    readFromURLParams.map((k) => [
      k,
      parameterValueOrDefault(initialParams[k], readFromURLParamsDefault[k]),
    ])
  );
};
