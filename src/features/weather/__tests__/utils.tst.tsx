import { findExistingCity } from "../utils/utils";
import { CityWeather } from "../../../app/types";

describe("findExistingCity", () => {
  const cities: CityWeather[] = [
    {
      id: "1",
      name: "London",
      sys: { country: "GB" },
      main: { temp: 20, feels_like: 18, temp_max: 22, temp_min: 16, humidity: 50 },
      wind: { speed: 5 },
      rain: { "1h": 1 },
    },
    {
      id: "2",
      name: "Paris",
      sys: { country: "FR" },
      main: { temp: 25, feels_like: 24, temp_max: 27, temp_min: 23, humidity: 60 },
      wind: { speed: 6 },
      rain: { "1h": 0 },
    },
  ];

  it("should find a city by name and country (case-insensitive)", () => {
    const result = findExistingCity("london", "GB", cities);
    expect(result).toEqual(cities[0]);
  });

  it("should return undefined if the city does not exist", () => {
    const result = findExistingCity("Berlin", "DE", cities);
    expect(result).toBeUndefined();
  });

  it("should return undefined if the country does not match", () => {
    const result = findExistingCity("London", "FR", cities);
    expect(result).toBeUndefined();
  });
});