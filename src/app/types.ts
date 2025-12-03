export interface WeatherCardProps {
    uuid: string;
    city: string;
    temp: number;
    feelsLike: number;
    tempMax: number;
    tempMin: number;
    humidity: number;
    windSpeed: number;
    rainLastHour: number;
    country: string
}

export interface CountryOption {
  code: string;
  label: string;
  flag: React.ReactNode;
}

export interface CityWeather {
  id:string
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
  sys:{
    country: string;
  };
  rain?: {
    "1h"?: number;
  };
}

export interface WeatherState {
  items: (CityWeather & { lastUpdated: number })[];
}

