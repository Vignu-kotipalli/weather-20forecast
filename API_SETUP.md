# Weather App - API Setup Instructions

## OpenWeatherMap API Configuration

To use this weather app with real data, you need to configure your OpenWeatherMap API key.

### Step 1: Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key (it may take a few hours to activate)

### Step 2: Configure the API Key

Replace the `demo_key` in `src/app/services/weather.service.ts`:

```typescript
private readonly API_KEY = 'your_actual_api_key_here';
```

### Step 3: Environment Variables (Recommended)

For production, use environment variables:

1. Create environment files:
   - `src/environments/environment.ts`
   - `src/environments/environment.prod.ts`

2. Add your API key:
```typescript
export const environment = {
  production: false,
  openWeatherMapApiKey: 'your_api_key_here'
};
```

3. Update the service to use environment:
```typescript
import { environment } from '../../environments/environment';

private readonly API_KEY = environment.openWeatherMapApiKey;
```

### API Endpoints Used

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- **Weather Icons**: `https://openweathermap.org/img/wn/{icon}@2x.png`

### Features

✅ Current weather conditions
✅ 5-day weather forecast
✅ City search functionality
✅ Dynamic backgrounds based on weather
✅ Responsive design (mobile, tablet, desktop)
✅ Loading indicators
✅ Error handling
✅ Smooth animations and transitions
✅ Real-time data from OpenWeatherMap API

### Demo Mode

The app includes a demo mode that will show a message about configuring the API key. Replace the `demo_key` with your actual API key to enable full functionality.
