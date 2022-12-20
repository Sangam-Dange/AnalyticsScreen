import { createReducer } from "@reduxjs/toolkit";

const initialState = {};
export const analyticsReducer = createReducer(initialState, {
  RequestData: (state) => {
    state.loading = true;
  },
  RequestDataSuccess: (state, action) => {
    state.loading = false;
    state.data = action.payload;
  },
  RequestDataFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },

  
  SaveDataCopy: (state, action) => {
    state._data = action.payload;
  },

  ResettingData: (state) => {
    state.data = state._data;
  },

  FilterData: (state) => {
    state.loading = true;
  },
  FilterDataSuccess: (state, action) => {
    state.loading = false;
    state.data = action.payload;
  },
  FilterDataFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  ClearErrors: (state) => {
    state.error = null;
  },
});
