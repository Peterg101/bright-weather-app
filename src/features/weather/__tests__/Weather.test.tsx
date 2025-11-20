import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import { Weather } from "../components/Weather";
import { setupServer } from "msw/node";
import { rest } from "msw";

// Mock server
const server = setupServer(
  rest.get("https://api.openweathermap.org/data/2.5/weather", (req, res, ctx) => {
    const city = req.url.searchParams.get("q");
    const country = req.url.searchParams.get("country");

    if (country !== "GB") {
      return res(ctx.status(404));
    }

    return res(
      ctx.status(200),
      ctx.json({
        name: city,
        main: { temp: 25, feels_like: 24, temp_max: 26, temp_min: 23, humidity: 50 },
        wind: { speed: 10 },
        sys: { country },
        rain: { "1h": 2 },
      })
    );
  })
);

// Setup MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Utility to render with Redux provider
const renderWithRedux = (ui: React.ReactElement) => {
  return render(<Provider store={store}>{ui}</Provider>);
};

// Example tests
describe("Weather Component", () => {
  test("renders correctly", () => {
    renderWithRedux(<Weather />);
    expect(screen.getByText(/Bright Weather App/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Get Weather/i })).toBeInTheDocument();
  });

  test("shows warning toast if city input is empty", async () => {
    renderWithRedux(<Weather />);
    fireEvent.click(screen.getByRole("button", { name: /Get Weather/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a city/i)).toBeInTheDocument();
    });
  });

  test("adds a city successfully", async () => {
    renderWithRedux(<Weather />);
    
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "London" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "United Kingdom" } });
    fireEvent.click(screen.getByRole("button", { name: /Get Weather/i }));

    await waitFor(() => {
      expect(screen.getByText(/London/i)).toBeInTheDocument();
      expect(screen.getByText(/25°C/)).toBeInTheDocument();
      expect(screen.getByText(/2 mm/)).toBeInTheDocument();
      expect(screen.getByText(/Added\/Updated London/i)).toBeInTheDocument();
    });
  });

  test("fails to add a city outside selected country", async () => {
    renderWithRedux(<Weather />);
    
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Paris" } });
    fireEvent.click(screen.getByRole("button", { name: /Get Weather/i }));

    await waitFor(() => {
      expect(screen.getByText(/City not found in selected country/i)).toBeInTheDocument();
    });
  });
});
