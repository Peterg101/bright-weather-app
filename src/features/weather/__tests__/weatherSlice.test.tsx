import weatherReducer, { addOrUpdateCity, removeCity, clearCities } from "../slices/weatherSlice";
import { CityWeather } from "../../../app/types";

describe("weatherSlice", () => {
  let initialState = { items: [] as CityWeather[] };

  beforeEach(() => {
    initialState = { items: [] };
  });

  it("should handle initial state", () => {
    expect(weatherReducer(undefined, { type: "unknown" })).toEqual({ items: [] });
  });

  it("should add a new city with a uuid", () => {
    const actionPayload: Omit<CityWeather, "id"> = {
      name: "London",
      main: { temp: 20, feels_like: 18, temp_max: 22, temp_min: 16, humidity: 60 },
      wind: { speed: 5 },
      rain: { "1h": 2 },
      sys: { country: "GB" },
    };

    const state = weatherReducer(initialState, addOrUpdateCity(actionPayload));
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBeDefined();
    expect(state.items[0].name).toBe("London");
  });

  it("should remove a city by id", () => {
    const existingState = { items: [{ id: "abc", name: "Paris", main: { temp: 20, feels_like: 18, temp_max: 22, temp_min: 16, humidity: 60 }, wind: { speed: 5 }, rain: { "1h": 1 }, sys: { country: "FR" } }] };

    const state = weatherReducer(existingState, removeCity("abc"));
    expect(state.items.length).toBe(0);
  });

  it("should clear all cities", () => {
    const existingState = { items: [
      { id: "1", name: "Paris", main: { temp: 20, feels_like: 18, temp_max: 22, temp_min: 16, humidity: 60 }, wind: { speed: 5 }, rain: { "1h": 1 }, sys: { country: "FR" } },
      { id: "2", name: "London", main: { temp: 15, feels_like: 13, temp_max: 17, temp_min: 12, humidity: 70 }, wind: { speed: 3 }, rain: { "1h": 0 }, sys: { country: "GB" } },
    ]};

    const state = weatherReducer(existingState, clearCities());
    expect(state.items.length).toBe(0);
  });
});
