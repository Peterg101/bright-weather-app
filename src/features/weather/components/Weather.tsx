import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Grid } from "@mui/material";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";
import { WeatherCard } from "./WeatherCard";

interface CityWeather {
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

export const Weather: React.FC = () => {
  const [cityInput, setCityInput] = useState("");
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [trigger, { isFetching }] = useLazyGetWeatherByCityQuery();

  const handleFetch = async () => {
    if (!cityInput.trim()) return;

    try {
      const result = await trigger(cityInput).unwrap();
      
      setCities((prev) => {
        // Replace city if it already exists, otherwise add
        const exists = prev.find((c) => c.name.toLowerCase() === result.name.toLowerCase());
        if (exists) {
          return prev.map((c) =>
            c.name.toLowerCase() === result.name.toLowerCase() ? result : c
          );
        }
        return [...prev, result];
      });

      setCityInput(""); // clear input
    } catch {
      console.error("Error fetching weather data");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Bright Weather App
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 4 }}>
        <TextField
          label="City"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
        />
        <Button variant="contained" onClick={handleFetch}>
          Get Weather
        </Button>
      </Box>

      {isFetching && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {cities.length > 0 && (
        <Grid container spacing={2} justifyContent="center">
          {cities.map((cityData) => (
            <Grid key={cityData.name} component="div">
              <WeatherCard
                city={cityData.name}
                temp={cityData.main.temp}
                feelsLike={cityData.main.feels_like}
                tempMax={cityData.main.temp_max}
                tempMin={cityData.main.temp_min}
                humidity={cityData.main.humidity}
                windSpeed={cityData.wind.speed}
                rainLastHour={cityData.rain?.["1h"] ?? 0}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
