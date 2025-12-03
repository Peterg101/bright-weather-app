import weatherReducer, { addCity, updateCity, removeCity, clearCities } from "../slices/weatherSlice";
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

    const state = weatherReducer(initialState, addCity(actionPayload));
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

  it("should update an existing city's weather data", () => {
    const cityId = "test-uuid-123";
    const initialStateWithCity = {
      items: [
        {
          id: cityId,
          name: "London",
          main: { temp: 20, feels_like: 18, temp_max: 22, temp_min: 16, humidity: 60 },
          wind: { speed: 5 },
          rain: { "1h": 2 },
          sys: { country: "GB" },
          lastUpdated: 1000,
        },
      ],
    };

    const updatedData = {
      name: "London",
      main: { temp: 22, feels_like: 20, temp_max: 24, temp_min: 18, humidity: 65 },
      wind: { speed: 6 },
      rain: { "1h": 0 },
      sys: { country: "GB" },
    };

    const state = weatherReducer(
      initialStateWithCity,
      updateCity({ id: cityId, data: updatedData })
    );

    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe(cityId);
    expect(state.items[0].name).toBe("London");
    expect(state.items[0].main.temp).toBe(22);
    expect(state.items[0].main.humidity).toBe(65);
    expect(state.items[0].wind.speed).toBe(6);
    expect(state.items[0].rain["1h"]).toBe(0);
    
    expect(state.items[0].lastUpdated).toBeGreaterThan(1000);
  });

  it("should not modify state if updating a non-existent city", () => {
    const initialStateWithCity = {
      items: [
        {
          id: "existing-city",
          name: "London",
          main: { temp: 20, feels_like: 18, temp_max: 22, temp_min: 16, humidity: 60 },
          wind: { speed: 5 },
          rain: { "1h": 2 },
          sys: { country: "GB" },
          lastUpdated: 1000,
        },
      ],
    };

    const updatedData = {
      name: "Paris",
      main: { temp: 25, feels_like: 23, temp_max: 27, temp_min: 21, humidity: 55 },
      wind: { speed: 4 },
      rain: { "1h": 1 },
      sys: { country: "FR" },
    };
    const state = weatherReducer(
      initialStateWithCity,
      updateCity({ id: "non-existent-id", data: updatedData })
    );

    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe("existing-city");
    expect(state.items[0].name).toBe("London");
    expect(state.items[0].main.temp).toBe(20);
    expect(state.items[0].lastUpdated).toBe(1000);
  });
});
