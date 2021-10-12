import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  panel: { current: 'loading', previous: null },
  currentMonth: null,
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
