export interface WeatherCardProps {
    city: string;
    temp: number;
    feelsLike: number;
    tempMax: number;
    tempMin: number;
    humidity: number;
    windSpeed: number;
    rainLastHour: number;  
}

export interface CountryOption {
  code: string;
  label: string;
  flag: string;
}

export interface CityWeather {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  rain?: {
    "1h"?: number;
  };
}