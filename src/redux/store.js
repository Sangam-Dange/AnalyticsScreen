import { configureStore } from "@reduxjs/toolkit";

import {analyticsReducer} from "../redux/reducers/analytics"

const store = configureStore({
  reducer: {
    analyticsData: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;
