import { createSlice } from '@reduxjs/toolkit';
import { getCurrentMonth } from 'utils';

const currentMonth = getCurrentMonth();

const initialState = {
  panel: { current: 'prospect', previous: null },
  workingMonth: currentMonth,
};

const slice = createSlice({
  name: 'localInfo',
  initialState,
  reducers: {
    panelChanged: (state, action) => {
      state.panel.previous = state.panel.current;
      state.panel.current = action.payload;
    },
    setWorkingMonth: (state, action) => {
      state.workingMonth = action.payload;
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
