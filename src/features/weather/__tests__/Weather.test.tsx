import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";

import weatherReducer from "../slices/weatherSlice";
import { Weather } from "../components/Weather";
import { useLazyGetWeatherByCityQuery } from "../api/weatherApi";

jest.mock("../api/weatherApi");
const mockedUseLazyGetWeatherByCityQuery = useLazyGetWeatherByCityQuery as jest.Mock;

describe("Weather component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({ reducer: { weather: weatherReducer } });
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
    const mockUnwrap = jest.fn().mockResolvedValue({
      name: "London",
      main: { temp: 25, feels_like: 23, temp_max: 27, temp_min: 20, humidity: 60 },
      wind: { speed: 10 },
      rain: { "1h": 2 },
      sys: { country: "GB" },
    });
    const mockTrigger = jest.fn(() => ({ unwrap: mockUnwrap }));
    mockedUseLazyGetWeatherByCityQuery.mockReturnValue([mockTrigger, { isFetching: false }]);

    render(
      <Provider store={store}>
        <Weather />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "London" } });
    fireEvent.click(screen.getByRole("button", { name: /Get Weather/i }));

    await waitFor(() => {
      expect(mockTrigger).toHaveBeenCalledWith({ city: "London", country: "GB" });
      expect(screen.getByText(/Added London/i)).toBeInTheDocument();
    });

    expect(store.getState().weather.items[0].name).toBe("London");
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

    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "InvalidCity" } });
    fireEvent.click(screen.getByRole("button", { name: /Get Weather/i }));

    await waitFor(() => {
      expect(screen.getByText(/City not found in selected country/i)).toBeInTheDocument();
    });

    expect(store.getState().weather.items).toHaveLength(0);
  });

  it("renders WeatherCard for cities in the store", () => {
    const preloadedState = {
      weather: {
        items: [
          {
            id: "1",
            name: "London",
            main: { temp: 20, feels_like: 19, temp_max: 21, temp_min: 18, humidity: 50 },
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
            main: { temp: 20, feels_like: 19, temp_max: 21, temp_min: 18, humidity: 50 },
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

    userEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.queryByText("London")).not.toBeInTheDocument();
    });

    expect(store.getState().weather.items).toHaveLength(0);
  });

  it("refreshes a city's weather when refresh button is clicked", async () => {
    const preloadedState = {
      weather: {
        items: [
          {
            id: "1",
            name: "London",
            main: { temp: 20, feels_like: 19, temp_max: 21, temp_min: 18, humidity: 50 },
            wind: { speed: 5 },
            rain: { "1h": 0 },
            sys: { country: "GB" },
            lastUpdated: 1000,
          },
        ],
      },
    };

    const mockUnwrap = jest.fn().mockResolvedValue({
      name: "London",
      main: { temp: 22, feels_like: 20, temp_max: 23, temp_min: 19, humidity: 55 },
      wind: { speed: 6 },
      rain: { "1h": 1 },
      sys: { country: "GB" },
    });

    const mockTrigger = jest.fn(() => ({ unwrap: mockUnwrap }));
    mockedUseLazyGetWeatherByCityQuery.mockReturnValue([mockTrigger, { isFetching: false }]);

    const store = configureStore({ reducer: { weather: weatherReducer }, preloadedState });

    render(
      <Provider store={store}>
        <Weather />
      </Provider>
    );

    userEvent.click(screen.getByRole("button", { name: /refresh/i }));

    await waitFor(() => {
      expect(mockTrigger).toHaveBeenCalledWith({ city: "London", country: "GB" });
      expect(store.getState().weather.items).toHaveLength(1);
      expect(store.getState().weather.items[0].lastUpdated).toBeGreaterThan(1000);
      expect(screen.getByText("22°C")).toBeInTheDocument();
      expect(screen.getByText("1 mm")).toBeInTheDocument();
    });
  });  
});
