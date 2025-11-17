import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "../features/weather/api/weatherApi";

export const store = configureStore({
  reducer: {
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(weatherApi.middleware),
});