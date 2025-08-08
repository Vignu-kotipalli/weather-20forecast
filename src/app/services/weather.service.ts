import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  WeatherResponse,
  ForecastResponse,
  DailyForecast,
  ForecastItem,
} from "../models/weather.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  private readonly API_KEY = environment.openWeatherMapApiKey;
  private readonly BASE_URL = "https://api.openweathermap.org/data/2.5";

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherResponse> {
    this.setLoading(true);
    this.clearError();

    const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;

    return this.http.get<WeatherResponse>(url).pipe(
      map((response) => {
        this.setLoading(false);
        return response;
      }),
      catchError((error) => {
        this.setLoading(false);
        return this.handleError(error);
      }),
    );
  }

  getForecast(city: string): Observable<DailyForecast[]> {
    this.setLoading(true);
    this.clearError();

    const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`;

    return this.http.get<ForecastResponse>(url).pipe(
      map((response) => {
        this.setLoading(false);
        return this.processForecastData(response.list);
      }),
      catchError((error) => {
        this.setLoading(false);
        return this.handleError(error);
      }),
    );
  }

  private processForecastData(forecastList: ForecastItem[]): DailyForecast[] {
    const dailyData: { [key: string]: ForecastItem[] } = {};

    // Group forecasts by date
    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Convert to DailyForecast format (next 5 days)
    return Object.keys(dailyData)
      .slice(0, 5)
      .map((dateKey) => {
        const dayItems = dailyData[dateKey];
        const temps = dayItems.map((item) => item.main.temp);
        const minTemp = Math.min(...dayItems.map((item) => item.main.temp_min));
        const maxTemp = Math.max(...dayItems.map((item) => item.main.temp_max));

        // Use midday forecast for weather condition (around 12:00)
        const middayForecast =
          dayItems.find((item) => {
            const hour = new Date(item.dt * 1000).getHours();
            return hour >= 11 && hour <= 14;
          }) || dayItems[0];

        return {
          date: new Date(dateKey),
          temp_min: minTemp,
          temp_max: maxTemp,
          weather: middayForecast.weather[0],
          humidity: middayForecast.main.humidity,
          wind_speed: middayForecast.wind.speed,
        };
      });
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWeatherBackground(weatherMain: string): string {
    switch (weatherMain.toLowerCase()) {
      case "clear":
        return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
      case "clouds":
        return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
      case "rain":
      case "drizzle":
        return "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800";
      case "thunderstorm":
        return "bg-gradient-to-br from-gray-800 via-gray-900 to-black";
      case "snow":
        return "bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300";
      case "mist":
      case "fog":
      case "haze":
        return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500";
      default:
        return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600";
    }
  }

  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  private clearError(): void {
    this.errorSubject.next(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = "An error occurred while fetching weather data.";

    if (error.status === 404) {
      errorMessage = "City not found. Please check the spelling and try again.";
    } else if (error.status === 401) {
      errorMessage =
        "Invalid API key. Please configure a valid OpenWeatherMap API key.";
    } else if (error.status === 0) {
      errorMessage = "Network error. Please check your internet connection.";
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    }

    this.errorSubject.next(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
