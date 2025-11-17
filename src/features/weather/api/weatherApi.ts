import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.openweathermap.org/data/2.5/",
  }),
  endpoints: (builder) => ({
    getWeatherByCity: builder.query({
      query: (city: string) => ({
        url: "weather",
        params: {
          q: city,
          appid: process.env.REACT_APP_OPENWEATHER_KEY,
          units: "metric",
        },
      }),
    }),
  }),
});

export const {
  useLazyGetWeatherByCityQuery,
  useGetWeatherByCityQuery,
} = weatherApi;