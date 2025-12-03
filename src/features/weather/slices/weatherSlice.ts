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
    addCity: (state, action: PayloadAction<Omit<CityWeather, "id">>) => {
      const cityWithId = {
        ...action.payload,
        id: uuidv4(),
        lastUpdated: Date.now(),
      };
      
      state.items.push(cityWithId);
      return state;
    },
    
    updateCity: (state, action: PayloadAction<{id: string, data: Omit<CityWeather, "id">}>) => {
      const { id, data } = action.payload;
      
      state.items = state.items.map((city) => 
        city.id === id 
          ? { ...data, id, lastUpdated: Date.now() } 
          : city
      );
      
      return state;
    },
    
    removeCity: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
    
    clearCities: (state) => {
      state.items = [];
    },
  },
});

export const { addCity, updateCity, removeCity, clearCities } = weatherSlice.actions;

export default weatherSlice.reducer;