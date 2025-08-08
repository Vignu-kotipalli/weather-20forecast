import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyForecast } from '../models/weather.interface';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-forecast-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slide-up"
      [style.animation-delay]="(index * 100) + 'ms'"
    >
      <div class="text-white/80 text-sm font-medium mb-2">
        {{ getDayName() }}
      </div>
      <div class="text-white/60 text-xs mb-3">
        {{ getFormattedDate() }}
      </div>
      <img 
        [src]="weatherService.getWeatherIconUrl(forecast.weather.icon)"
        [alt]="forecast.weather.description"
        class="w-12 h-12 mx-auto mb-2"
      />
      <div class="text-white text-sm capitalize mb-3">
        {{ forecast.weather.description }}
      </div>
      <div class="flex justify-between items-center text-white">
        <span class="text-lg font-bold">{{ Math.round(forecast.temp_max) }}°</span>
        <span class="text-sm text-white/60">{{ Math.round(forecast.temp_min) }}°</span>
      </div>
      <div class="flex justify-between items-center text-xs text-white/60 mt-2">
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 16a4 4 0 11-.02-7.01 6 6 0 119.4 0A4 4 0 017 16z"/>
          </svg>
          {{ forecast.humidity }}%
        </div>
        <div class="flex items-center">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v3M7 4H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1h-2"/>
          </svg>
          {{ Math.round(forecast.wind_speed) }}m/s
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-slide-up {
      animation: slide-up 0.6s ease-out both;
    }
  `]
})
export class ForecastCardComponent {
  @Input() forecast!: DailyForecast;
  @Input() index: number = 0;
  
  // Math for template
  Math = Math;

  constructor(public weatherService: WeatherService) {}

  getDayName(): string {
    const today = new Date();
    const forecastDate = this.forecast.date;
    
    if (forecastDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (forecastDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  getFormattedDate(): string {
    return this.forecast.date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
