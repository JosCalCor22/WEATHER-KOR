import { useState, useEffect } from 'react'
import WeatherCard from './components/WeatherCard'
import WeatherChat from './components/WeatherChat'
import { API_KEY } from './env/const'

import axios from 'axios'
import './styles/index.css'

const getBackgroundColor = (weatherMain?: string, temp?: number): string => {
  if (!weatherMain) return 'from-indigo-600 via-blue-700 to-slate-900';
  const main = weatherMain.toLowerCase();

  if (main.includes('clear')) {
    return temp! > 25
      ? 'from-amber-400 via-orange-500 to-rose-600'
      : 'from-sky-400 via-blue-500 to-indigo-600';
  }

  if (main.includes('rain') || main.includes('drizzle') || main.includes('thunderstorm')) {
    return 'from-slate-700 via-gray-800 to-zinc-950';
  }

  if (main.includes('snow')) {
    return 'from-blue-100 via-sky-300 to-blue-400';
  }

  if (main.includes('cloud')) {
    return 'from-stone-400 via-gray-500 to-slate-600';
  }

  return 'from-indigo-500 via-purple-600 to-blue-700';
};

function App() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [forecastData, setForecastData] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Geolocation effect
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Optional: fallback to a default city if desired
        }
      );
    }
  }, []);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'es' }
        }
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'es' }
        }
      );

      setWeatherData(weatherResponse.data);
      setForecastData(forecastResponse.data);
      setError('');
    } catch (err) {
      setError('Could not fetch weather for your location.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return
    setLoading(true)

    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: searchTerm,
            appid: API_KEY,
            units: 'metric',
            lang: 'es'
          }
        }
      )

      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            q: searchTerm,
            appid: API_KEY,
            units: 'metric',
            lang: 'es'
          }
        }
      )

      setWeatherData(weatherResponse.data)
      setForecastData(forecastResponse.data)
      setError('')
    } catch (err) {
      setError('City not found!')
      setWeatherData(null)
      setForecastData(null)
    } finally {
      setLoading(false)
    }
  }

  const weatherMain = weatherData?.weather[0]?.main;
  const temp = weatherData?.main?.temp;
  const bgGradient = getBackgroundColor(weatherMain, temp);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-all duration-1000 ease-in-out bg-gradient-to-br ${bgGradient}`}>
      <div className="flex flex-col xl:flex-row items-center justify-center gap-8 md:gap-12 max-w-7xl w-full">
        <div className="w-full flex justify-center">
          <WeatherCard
            weatherData={weatherData}
            handleSearch={handleSearch}
            error={error}
            loading={loading}
          />
        </div>

        {/* Vertical Divider */}
        <div className="hidden xl:block w-[1px] h-[500px] bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

        <div className="w-full flex justify-center">
          <WeatherChat weatherData={weatherData} forecastData={forecastData} />
        </div>
      </div>
    </div>
  )
}

export default App