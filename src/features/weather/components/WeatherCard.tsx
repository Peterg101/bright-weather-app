import React from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";
import { WeatherCardProps } from "../../../app/types";

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temp,
  feelsLike,
  tempMax,
  tempMin,
  humidity,
  windSpeed,
  rainLastHour,
  country
}) => {
  return (
    <Card sx={{ mt: 3, minWidth: 300, maxWidth: 400, boxShadow: 6, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {city}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Current:</Typography>
          <Typography>{temp}°C</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Feels Like:</Typography>
          <Typography>{feelsLike}°C</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Max / Min:</Typography>
          <Typography>
            {tempMax}°C / {tempMin}°C
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Humidity:</Typography>
          <Typography>{humidity}%</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>Wind:</Typography>
          <Typography>{windSpeed} mph</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Rain (1h):</Typography>
          <Typography>{rainLastHour} mm</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};