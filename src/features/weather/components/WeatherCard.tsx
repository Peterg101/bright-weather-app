import React from "react";
import { Card, CardContent, Typography, Divider, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { WeatherCardProps } from "../../../app/types";
import { COUNTRIES } from "../../../app/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { updateCity} from "../slices/weatherSlice";
import { useWeatherService } from "../services/weatherService";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";
import { RootState } from "../../../app/store";
import RefreshIcon from "@mui/icons-material/Refresh"
import { useToast } from "../../../app/context/ToastContext";


export const WeatherCard: React.FC<WeatherCardProps> = ({
  uuid,
  city,
  temp,
  feelsLike,
  tempMax,
  tempMin,
  humidity,
  windSpeed,
  rainLastHour,
  country,
}) => {

  const countryInfo = COUNTRIES.find(c => c.code === country);
  const {showToast} = useToast()
  const {deleteCity, refreshCity} = useWeatherService()
  const dispatch = useDispatch()
  const [trigger] = useLazyGetWeatherByCityQuery()

  const handleDelete = (uuid: string, city: string) =>deleteCity(uuid, city);

  const handleRefresh = () => {
  refreshCity(uuid, city, country);
};

  const lastUpdated = useSelector((state: RootState) => 
    state.weather.items.find(c => c.id === uuid)?.lastUpdated
  );

  return (
    <Card sx={{ mt: 3, minWidth: 300, maxWidth: 400, boxShadow: 6, borderRadius: 3 }}>
      <CardContent>
       <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h5">{city}</Typography>
          {countryInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {countryInfo.flag}
            </Box>
          )}
          <IconButton onClick={handleRefresh} color="primary" aria-label="refresh">
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(uuid, city)}  color="error" sx={{ ml: "auto" }} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Box>

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
        {lastUpdated && (
          <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
            Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};