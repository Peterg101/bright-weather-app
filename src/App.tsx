import { Box } from "@mui/material";
import { useEffect } from "react";
import { useLazyGetWeatherByCityQuery } from "./features/weather/api/weatherApi";

function App() {
  const [fetchWeather, { data, error, isFetching }] =
    useLazyGetWeatherByCityQuery();

  useEffect(() => {
    // Trigger a test fetch on mount
    fetchWeather("London");
  }, [fetchWeather]);

  useEffect(() => {
    if (data) {
      console.log("Weather data:", data);
    }
    if (error) {
      console.error("Weather API error:", error);
    }
  }, [data, error]);

  return (
    <Box>
      <p>Bright Weather App</p>
      {isFetching && <p>Loading weather…</p>}
    </Box>
  );
}

export default App;
