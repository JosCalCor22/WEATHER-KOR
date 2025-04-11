import { useState } from 'react'
import WeatherCard from './components/WeatherCard'

import './styles/index.css'

function App() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!city) return
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      )
      
      if (!response.ok) {
        throw new Error('City not found')
      }

      const data = await response.json()
      setWeatherData(data)
      setError('')
    } catch (err) {
      setError('City not found!')
      setWeatherData(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="w-full max-w-md px-4 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Weather App</h1>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter city name" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      {weatherData && (
        <div className="flex flex-wrap justify-center gap-6">
          <WeatherCard weatherData={weatherData} />
        </div>
      )}
    </div>
  )
}

export default App 