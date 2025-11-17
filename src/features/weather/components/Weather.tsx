import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";
import { WeatherCard } from "./WeatherCard";

export const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [trigger, { data, error, isFetching }] = useLazyGetWeatherByCityQuery();

  const handleFetch = () => {
    if (city.trim()) {
      trigger(city);
    }
  };

  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Typography variant="h4">Bright Weather App</Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button variant="contained" onClick={handleFetch}>
          Get Weather
        </Button>
      </Box>

      {isFetching && <CircularProgress />}

      {error && <Typography color="error">Error fetching weather data</Typography>}

      {data && (
        <WeatherCard
          city={data.name}
          temp={data.main.temp}
          feelsLike={data.main.feels_like}
          tempMax={data.main.temp_max}
          tempMin={data.main.temp_min}
          humidity={data.main.humidity}
          windSpeed={data.wind.speed}
          rainLastHour={data.rain?.["1h"] ?? 0}
        />
      )}
    </Box>
  );
};