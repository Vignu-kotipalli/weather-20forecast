import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../services/weather.service';
import { WeatherResponse, DailyForecast } from '../models/weather.interface';
import { ForecastCardComponent } from './forecast-card.component';
import { DEMO_WEATHER, DEMO_FORECAST } from '../data/demo-weather.data';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule, ForecastCardComponent],
  template: `
    <div [class]="backgroundClass()" class="min-h-screen transition-all duration-1000 ease-in-out">
      <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
            Weather App
          </h1>
          <p class="text-white/80 text-lg md:text-xl">Get current weather and 5-day forecast</p>
        </div>

        <!-- Search Bar -->
        <div class="max-w-md mx-auto mb-8">
          <div class="relative">
            <input
              [(ngModel)]="searchCity"
              (keydown.enter)="searchWeather()"
              type="text"
              placeholder="Enter city name..."
              class="w-full px-4 py-3 pl-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
            />
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <button
            (click)="searchWeather()"
            [disabled]="loading() || !searchCity.trim()"
            class="w-full mt-4 bg-white/20 hover:bg-white/30 disabled:bg-white/10 backdrop-blur-md text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span *ngIf="!loading()">Search Weather</span>
            <span *ngIf="loading()" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          </button>
        </div>

        <!-- Error Message -->
        <div *ngIf="error()" class="max-w-md mx-auto mb-8">
          <div class="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white px-4 py-3 rounded-lg animate-slide-in">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              <span>{{ error() }}</span>
            </div>
          </div>
        </div>

        <!-- Current Weather -->
        <div *ngIf="currentWeather()" class="max-w-4xl mx-auto">
          <div class="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 mb-8 border border-white/20 animate-slide-up">
            <div class="text-center">
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
                {{ currentWeather()?.name }}, {{ currentWeather()?.sys?.country }}
              </h2>
              <p class="text-white/80 mb-6">{{ getCurrentDateTime() }}</p>

              <div class="flex flex-col md:flex-row items-center justify-center gap-8">
                <div class="flex items-center">
                  <img
                    [src]="currentWeather()?.weather?.[0]?.icon ? weatherService.getWeatherIconUrl(currentWeather()!.weather[0].icon) : ''"
                    [alt]="currentWeather()?.weather?.[0]?.description || ''"
                    class="w-24 h-24 md:w-32 md:h-32 animate-bounce-slow"
                  />
                  <div class="ml-4">
                    <div class="text-5xl md:text-7xl font-bold text-white">
                      {{ currentWeather()?.main?.temp ? Math.round(currentWeather()!.main.temp) : 0 }}°C
                    </div>
                    <div class="text-white/80 text-lg capitalize">
                      {{ currentWeather()?.weather?.[0]?.description || '' }}
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4 text-center">
                  <div class="bg-white/10 rounded-xl p-4">
                    <div class="text-white/60 text-sm">Feels like</div>
                    <div class="text-white text-xl font-semibold">{{ currentWeather()?.main?.feels_like ? Math.round(currentWeather()!.main.feels_like) : 0 }}°C</div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4">
                    <div class="text-white/60 text-sm">Humidity</div>
                    <div class="text-white text-xl font-semibold">{{ currentWeather()?.main?.humidity || 0 }}%</div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4">
                    <div class="text-white/60 text-sm">Wind Speed</div>
                    <div class="text-white text-xl font-semibold">{{ currentWeather()?.wind?.speed ? Math.round(currentWeather()!.wind.speed) : 0 }} m/s</div>
                  </div>
                  <div class="bg-white/10 rounded-xl p-4">
                    <div class="text-white/60 text-sm">Pressure</div>
                    <div class="text-white text-xl font-semibold">{{ currentWeather()?.main?.pressure || 0 }} hPa</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5-Day Forecast -->
          <div *ngIf="forecast().length > 0" class="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 animate-slide-up">
            <h3 class="text-2xl font-bold text-white mb-6 text-center">5-Day Forecast</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <app-forecast-card 
                *ngFor="let day of forecast(); let i = index" 
                [forecast]="day"
                [index]="i"
              />
            </div>
          </div>
        </div>

        <!-- Welcome Message -->
        <div *ngIf="!currentWeather() && !loading() && !error()" class="max-w-md mx-auto text-center">
          <div class="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 animate-fade-in">
            <svg class="w-16 h-16 text-white/60 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
            </svg>
            <h3 class="text-xl font-semibold text-white mb-2">Welcome to Weather App</h3>
            <p class="text-white/80">Enter a city name to get started with current weather and forecast information.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.6s ease-out;
    }
    
    .animate-slide-in {
      animation: slide-in 0.4s ease-out;
    }
    
    .animate-slide-up {
      animation: slide-up 0.6s ease-out;
    }
    
    .animate-bounce-slow {
      animation: bounce-slow 3s ease-in-out infinite;
    }
  `]
})
export class WeatherComponent implements OnInit {
  searchCity = '';
  currentWeather = signal<WeatherResponse | null>(null);
  forecast = signal<DailyForecast[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Math for template
  Math = Math;

  backgroundClass = computed(() => {
    const weather = this.currentWeather();
    if (!weather) {
      return 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600';
    }
    return this.weatherService.getWeatherBackground(weather.weather[0].main);
  });

  constructor(public weatherService: WeatherService) {}

  ngOnInit() {
    // Subscribe to loading and error states
    this.weatherService.loading$.subscribe(loading => this.loading.set(loading));
    this.weatherService.error$.subscribe(error => this.error.set(error));

    // Load demo data initially
    this.searchCity = 'London';
    this.currentWeather.set(DEMO_WEATHER);
    this.forecast.set(DEMO_FORECAST);
    this.error.set('Demo mode - Configure your OpenWeatherMap API key for live data');
  }

  searchWeather() {
    if (!this.searchCity.trim()) return;

    this.error.set(null);

    this.weatherService.getCurrentWeather(this.searchCity).subscribe({
      next: (weather) => {
        this.currentWeather.set(weather);
        this.loadForecast();
      },
      error: (error) => {
        // Use demo data when API fails (for demo purposes)
        console.log('API failed, using demo data:', error.message);
        this.currentWeather.set(DEMO_WEATHER);
        this.forecast.set(DEMO_FORECAST);
        this.loading.set(false);
        this.error.set('Using demo data - Configure your OpenWeatherMap API key for live data');
      }
    });
  }

  private loadForecast() {
    this.weatherService.getForecast(this.searchCity).subscribe({
      next: (forecast) => {
        this.forecast.set(forecast);
      },
      error: (error) => {
        console.error('Forecast error:', error);
      }
    });
  }

  getCurrentDateTime(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
