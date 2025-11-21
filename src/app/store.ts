import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "../features/weather/api/weatherApi";
import weatherReducer from "../features/weather/slices/weatherSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;