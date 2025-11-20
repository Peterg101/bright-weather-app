import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { CityWeather, WeatherState } from "../../../app/types";

const initialState: WeatherState = {
  items: [],
};

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addOrUpdateCity: (state, action: PayloadAction<Omit<CityWeather, "id">>) => {
      const exists = state.items.find(
        (c) => c.name.toLowerCase() === action.payload.name.toLowerCase()
      );
      const cityWithId = { ...action.payload, id: exists?.id ?? uuidv4() };

      if (exists) {
        state.items = state.items.map((c) =>
          c.name.toLowerCase() === action.payload.name.toLowerCase()
            ? cityWithId
            : c
        );
      } else {
        state.items.push(cityWithId);
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    clearCities: (state) => {
      state.items = [];
    },
  },
});

export const { addOrUpdateCity, removeCity, clearCities } = weatherSlice.actions;

export default weatherSlice.reducer;