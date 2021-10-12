import { createSlice } from '@reduxjs/toolkit';

let alertCounter = 1;

const getDefaultTimeout = (variant) => {
  switch (variant) {
    case 'success':
      return process.env.REACT_APP_ALERT_DEFAULT_DURATION;
    case 'danger':
      return process.env.REACT_APP_ALERT_ERROR_DURATION;
    case 'warning':
      return process.env.REACT_APP_ALERT_ERROR_DURATION;
    default:
      return process.env.REACT_APP_ALERT_DEFAULT_DURATION;
  }
};
const initialState = { alerts: [] };
const slice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    dismissed: (state, action) => {
      const { id } = action.payload;
      state.alerts = state.alerts.map((a) =>
        a.id !== id ? a : { ...a, dismissed: true }
      );
    },
    added: (state, action) => {
      const {
        variant,
        message,
        timeout = getDefaultTimeout(variant),
      } = action.payload;
      if (!variant || !message)
        throw Error('Alerts must have variant and message properties.');
      const alert = { variant, message, timeout, id: alertCounter };
      alertCounter++;
      state.alerts.push(alert);
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
