import { CityWeather } from "../../../app/types";

export const findExistingCity = (cityName: string, country: string, cities: CityWeather[]) =>
  cities.find(
    city => city.name.toLowerCase() === cityName.toLowerCase() &&
            city.sys.country === country
  );