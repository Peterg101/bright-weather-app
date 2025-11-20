import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";
import { WeatherCard } from "./WeatherCard";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../app/store";
import { addOrUpdateCity, removeCity } from "../slices/weatherSlice";
import { CityWeather } from "../../../app/types";
import { CountryOption } from "../../../app/types";

import { COUNTRIES } from "../../../app/utils/utils";

export const Weather: React.FC = () => {
  const [cityInput, setCityInput] = useState("");
  const [countryInput, setCountryInput] = useState<CountryOption>(COUNTRIES[0]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const dispatch = useDispatch<AppDispatch>();
  const cities = useSelector((state: RootState) => state.weather.items);
  const [trigger, { isFetching }] = useLazyGetWeatherByCityQuery();

  const showToast = (msg: string, severity: typeof toastSeverity) => {
    setToastMessage(msg);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleFetch = async () => {
    if (!cityInput.trim()) {
      showToast("Please enter a city", "warning");
      return;
    }

    try {
      const result = await trigger({ city: cityInput, country: countryInput.code }).unwrap();

      const cityData: Omit<CityWeather, "id"> = { ...result, sys: { country: countryInput.code } };

      dispatch(addOrUpdateCity(cityData));

      showToast(`Added/Updated ${result.name}`, "success");
      setCityInput("");
    } catch {
      showToast("City not found in selected country", "error");
    }
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
          getOptionLabel={(option) => `${option.flag} ${option.label}`}
          value={countryInput}
          onChange={(e, val) => val && setCountryInput(val)}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>{option.flag}</span> {option.label}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} label="Country" />}
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

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};