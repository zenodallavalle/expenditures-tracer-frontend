import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  panel: { current: 'prospect', previous: null },
};

const slice = createSlice({
  name: 'localInfo',
  initialState,
  reducers: {
    panelChanged: (state, action) => {
      state.panel.previous = state.panel.current;
      state.panel.current = action.payload;
    },
  },
});

export const { actions } = slice;

export default slice.reducer;
