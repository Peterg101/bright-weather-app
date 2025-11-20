// src/features/weather/__tests__/Weather.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

import weatherReducer from "../slices/weatherSlice";
import { Weather } from "../components/Weather";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";

// Mock RTK Query hook
jest.mock("../api/weatherApi");
const mockedUseLazyGetWeatherByCityQuery = useLazyGetWeatherByCityQuery as jest.Mock;

describe("Weather component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { weather: weatherReducer } });

    // Default safe mock for all tests so destructuring [trigger, { isFetching }] works
    mockedUseLazyGetWeatherByCityQuery.mockImplementation(() => [jest.fn(), { isFetching: false }]);
  });

  it("renders title and input fields", () => {
    render(
      <Provider store={store}>
        <Weather />
      </Provider>
    );

    expect(screen.getByText(/Bright Weather App/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Get Weather/i })).toBeInTheDocument();
  });

  it("shows warning toast when city input is empty", async () => {
    render(
      <Provider store={store}>
        <Weather />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Get Weather/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a city/i)).toBeInTheDocument();
    });
  });

  it("adds a city successfully", async () => {
    // Mock API trigger to resolve with a city
    const mockTrigger = jest.fn().mockResolvedValue({
      unwrap: jest.fn().mockResolvedValue({
        name: "London",
        main: { temp: 25, feels_like: 23, temp_max: 27, temp_min: 20, humidity: 60 },
        wind: { speed: 10 },
        rain: { "1h": 2 },
        sys: { country: "GB" },
      }),
    });

    mockedUseLazyGetWeatherByCityQuery.mockReturnValue([mockTrigger, { isFetching: false }]);

    render(
      <Provider store={store}>
        <Weather />
      </Provider>
    );

    const cityInput = screen.getByLabelText(/City/i);
    const getWeatherButton = screen.getByRole("button", { name: /Get Weather/i });

    fireEvent.change(cityInput, { target: { value: "London" } });
    fireEvent.click(getWeatherButton);

    await waitFor(() => {
      expect(mockTrigger).toHaveBeenCalledWith({ city: "London", country: "GB" });
      expect(screen.getByText(/Added\/Updated London/i)).toBeInTheDocument();
    });

    // Redux store should contain the city
    expect(store.getState().weather.items[0].name).toBe("London");

    // WeatherCard should render the correct values
    expect(screen.getByText("25°C")).toBeInTheDocument();
    expect(screen.getByText("2 mm")).toBeInTheDocument();
  });

  it("shows error toast when API call fails", async () => {
    const mockTrigger = jest.fn().mockResolvedValue({
      unwrap: jest.fn().mockRejectedValue(new Error("City not found")),
    });

    mockedUseLazyGetWeatherByCityQuery.mockReturnValue([mockTrigger, { isFetching: false }]);

    render(
      <Provider store={store}>
        <Weather />
      </Provider>
    );

    const cityInput = screen.getByLabelText(/City/i);
    const getWeatherButton = screen.getByRole("button", { name: /Get Weather/i });

    fireEvent.change(cityInput, { target: { value: "InvalidCity" } });
    fireEvent.click(getWeatherButton);

    await waitFor(() => {
      expect(screen.getByText(/City not found in selected country/i)).toBeInTheDocument();
    });

    // Redux store should remain empty
    expect(store.getState().weather.items).toHaveLength(0);
  });

  it("renders WeatherCard for cities in the store", () => {
    const preloadedState = {
      weather: {
        items: [
          {
            id: "1",
            name: "London",
            main: {
              temp: 20,
              feels_like: 19,
              temp_max: 21,
              temp_min: 18,
              humidity: 50,
            },
            wind: { speed: 5 },
            rain: { "1h": 0 },
            sys: { country: "GB" },
          },
        ],
      },
    };

    render(
      <Provider store={configureStore({ reducer: { weather: weatherReducer }, preloadedState })}>
        <Weather />
      </Provider>
    );

    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("20°C")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("removes a city when delete button is clicked", async () => {
    const preloadedState = {
      weather: {
        items: [
          {
            id: "1",
            name: "London",
            main: {
              temp: 20,
              feels_like: 19,
              temp_max: 21,
              temp_min: 18,
              humidity: 50,
            },
            wind: { speed: 5 },
            rain: { "1h": 0 },
            sys: { country: "GB" },
          },
        ],
      },
    };

    render(
      <Provider store={configureStore({ reducer: { weather: weatherReducer }, preloadedState })}>
        <Weather />
      </Provider>
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("London")).not.toBeInTheDocument();
    });

    expect(store.getState().weather.items).toHaveLength(0);
  });
});
