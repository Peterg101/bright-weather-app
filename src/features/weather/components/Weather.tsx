import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Autocomplete,
} from "@mui/material";
import { WeatherCard } from "./WeatherCard";
import { useSelector} from "react-redux";
import { RootState } from "../../../app/store";
import { CountryOption } from "../../../app/types";
import { COUNTRIES } from "../../../app/utils/utils";
import { useWeatherService } from "../services/weatherService";

export const Weather: React.FC = () => {
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState<CountryOption>(COUNTRIES[0]);
  const { fetchCity, autoRefreshCities, isFetching } = useWeatherService();
  const cities = useSelector((state: RootState) => state.weather.items);

  useEffect(() => {
  const cleanup = autoRefreshCities();
  return cleanup; 
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [cities]);

  const handleFetch = () => {
  fetchCity(cityInput, countryInput.code);
  setCityInput("");
};

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Bright Weather App
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <TextField label="City" value={cityInput} onChange={(e) => setCityInput(e.target.value)} />

        <Autocomplete
        sx={{ width: 200 }}
        options={COUNTRIES}
        autoHighlight
        value={countryInput}
        onChange={(e, val) => val && setCountryInput(val)}
        getOptionLabel={(option) => option.label}
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {option.flag} {option.label}
          </Box>
        )}
        renderInput={(params) => (
          <TextField 
            {...params} 
            label="Country" 
            InputProps={{
              ...params.InputProps,
              startAdornment: countryInput ? (
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  {countryInput.flag}
                </Box>
              ) : null
            }}
          />
        )}
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
          {cities.map((cityData) => {
            return (
              <Grid key={cityData.id} component="div">
                <WeatherCard
                  uuid={cityData.id}
                  city={cityData.name}
                  temp={cityData.main.temp}
                  feelsLike={cityData.main.feels_like}
                  tempMax={cityData.main.temp_max}
                  tempMin={cityData.main.temp_min}
                  humidity={cityData.main.humidity}
                  windSpeed={cityData.wind.speed}
                  rainLastHour={cityData.rain?.["1h"] ?? 0}
                  country={cityData.sys?.country}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};