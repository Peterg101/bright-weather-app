import { useDispatch } from "react-redux";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";
import { removeCity, updateCity, addCity } from "../slices/weatherSlice"
import { useToast } from "../../../app/context/ToastContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { CityWeather } from "../../../app/types";
import { findExistingCity } from "../utils/utils";


export function useWeatherService() {
  const dispatch = useDispatch();
  const [trigger, {isFetching}] = useLazyGetWeatherByCityQuery();
  const { showToast } = useToast();
  const cities = useSelector((state: RootState) => state.weather.items);
  const deleteCity = (uuid: string, city: string) => {
    dispatch(removeCity(uuid));
    showToast(`Removed ${city} from your cities`, "info");
  };

  const refreshCity = async (
    uuid: string,
    city: string,
    country: string
  ) => {
    try {
      const result = await trigger({ city, country }).unwrap();

      dispatch(
        updateCity({
          id: uuid,
          data: {
            ...result,
            sys: { country },
          },
        })
      );

      showToast(`Updated weather for ${result.name}`, "info");
    } catch (err) {
      console.error("Failed to refresh city data", err);
      showToast("Failed to refresh city data", "error");
    }
  };

  const fetchCity = async (
    cityInput: string,
    countryCode: string
  ) => {
    if (!cityInput.trim()) {
      showToast("Please enter a city", "warning");
      return;
    }
    try {
      const result = await trigger({
        city: cityInput,
        country: countryCode
      }).unwrap();

      const cityData: Omit<CityWeather, "id"> = {
        ...result,
        sys: { country: countryCode }
      };

      const existing = findExistingCity(cityInput, countryCode, cities)

      if (existing) {
        dispatch(updateCity({
          id: existing.id,
          data: cityData
        }));
        showToast(`Updated weather for ${result.name}`, "info");
      } else {
        dispatch(addCity(cityData));
        showToast(`Added ${result.name} to your cities`, "success");
      }

    } catch {
      showToast("City not found in selected country", "error");
    }
  };

  const autoRefreshCities = () => {
  if (cities.length === 0) return;

  const interval = setInterval(() => {
    cities.forEach((cityData) => {
      refreshCity(cityData.id, cityData.name, cityData.sys.country);
    });
  }, 10 * 60 * 1000);

  return () => clearInterval(interval);
};

  return {
    deleteCity,
    refreshCity,
    fetchCity,
    isFetching,
    autoRefreshCities
  };
}

