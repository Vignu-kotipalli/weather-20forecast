import { WeatherResponse, DailyForecast } from '../models/weather.interface';

export const DEMO_WEATHER: WeatherResponse = {
  coord: { lon: -0.13, lat: 51.51 },
  weather: [{
    id: 800,
    main: 'Clear',
    description: 'clear sky',
    icon: '01d'
  }],
  base: 'stations',
  main: {
    temp: 22.5,
    feels_like: 24.1,
    temp_min: 20.2,
    temp_max: 25.8,
    pressure: 1013,
    humidity: 65
  },
  visibility: 10000,
  wind: {
    speed: 3.6,
    deg: 230
  },
  clouds: {
    all: 20
  },
  dt: Date.now() / 1000,
  sys: {
    country: 'GB',
    sunrise: 1632720000,
    sunset: 1632763200
  },
  timezone: 3600,
  id: 2643743,
  name: 'London',
  cod: 200
};

export const DEMO_FORECAST: DailyForecast[] = [
  {
    date: new Date(),
    temp_min: 18,
    temp_max: 25,
    weather: {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    },
    humidity: 65,
    wind_speed: 3.6
  },
  {
    date: new Date(Date.now() + 86400000),
    temp_min: 16,
    temp_max: 22,
    weather: {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04d'
    },
    humidity: 70,
    wind_speed: 4.2
  },
  {
    date: new Date(Date.now() + 2 * 86400000),
    temp_min: 19,
    temp_max: 26,
    weather: {
      id: 500,
      main: 'Rain',
      description: 'light rain',
      icon: '10d'
    },
    humidity: 80,
    wind_speed: 5.1
  },
  {
    date: new Date(Date.now() + 3 * 86400000),
    temp_min: 21,
    temp_max: 28,
    weather: {
      id: 800,
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    },
    humidity: 60,
    wind_speed: 2.8
  },
  {
    date: new Date(Date.now() + 4 * 86400000),
    temp_min: 17,
    temp_max: 23,
    weather: {
      id: 802,
      main: 'Clouds',
      description: 'scattered clouds',
      icon: '03d'
    },
    humidity: 75,
    wind_speed: 3.9
  }
];
