import { useState } from 'react'
import WeatherCard from './components/WeatherCard'
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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm) return
    setLoading(true)

    try {
      const response = await axios.get(
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

      setWeatherData(response.data)
      setError('')
    } catch (err) {
      setError('City not found!')
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const weatherMain = weatherData?.weather[0]?.main;
  const temp = weatherData?.main?.temp;
  const bgGradient = getBackgroundColor(weatherMain, temp);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-all duration-1000 ease-in-out bg-gradient-to-br ${bgGradient}`}>
      <WeatherCard
        weatherData={weatherData}
        handleSearch={handleSearch}
        error={error}
        loading={loading}
      />
    </div>
  )
}

export default App 