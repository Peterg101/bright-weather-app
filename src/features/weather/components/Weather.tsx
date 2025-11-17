import React, { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";

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
        <Card sx={{ mt: 2, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">{data.name}</Typography>
            <Typography>Current Temperature: {data.main.temp}°C</Typography>
            <Typography>Feels Like: {data.main.feels_like}°C</Typography>
            <Typography>Humidity: {data.main.humidity}%</Typography>
            <Typography>Maximum Temperature: {data.main.temp_max}°C</Typography>
            <Typography>Minimum Temperature: {data.main.temp_min}°C</Typography>
            <Typography>Wind Speed: {data.wind.speed} mph</Typography>
            <Typography>
              Rain Volume (last 1h): {data.rain?.["1h"] ?? 0} mm
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};