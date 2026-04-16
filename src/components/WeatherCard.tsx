import { useState, useEffect } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  sys: {
    country: string;
  };
  weather: Array<{
    main: string;
    icon: string;
  }>;
}

interface Props {
  weatherData: WeatherData | null;
  handleSearch: (city: string) => void;
  error: string;
  loading: boolean;
}

const getWeatherIcon = (weatherMain: string): string => {
  switch (weatherMain.toLowerCase()) {
    case 'clear': return '☀️';
    case 'rain':
    case 'drizzle': return '🌧️';
    case 'snow': return '❄️';
    case 'clouds': return '☁️';
    default: return '🌤️';
  }
};

const WeatherCard = ({ weatherData, handleSearch, error, loading }: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getHourlyForecast = () => {
    if (!weatherData) return [];
    const hours = [];
    const currentHour = currentTime.getHours();
    for (let i = 0; i < 5; i++) {
      const hour = (currentHour + i) % 24;
      hours.push({
        time: `${hour}:00`,
        temp: Math.round(weatherData.main.temp + (Math.random() * 2 - 1))
      });
    }
    return hours;
  };

  const getDayName = (date: Date): string => date.toLocaleDateString('en-US', { weekday: 'short' });

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(currentTime.getDate() + i);
      days.push(getDayName(date));
    }
    return days;
  };

  const onSearchSubmit = () => {
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className={`flex flex-col gap-5 p-8 text-white min-h-[600px] w-full max-w-[400px] transition-all duration-500 animate-fade-in`}>
      <div className="flex flex-col h-full justify-between gap-10">
        {/* Search Input inside the card */}
        <div className="flex w-full">
          <div className="flex gap-2 w-full">
            <input
              type="text"
              name='search-input'
              id='search-input'
              placeholder="Search city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              className="search-input w-full bg-white/20 border border-white/30 backdrop-blur-sm rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all"
            />
            <button
              onClick={onSearchSubmit}
              disabled={loading}
              className="search-btn border-2 border-white/10 hover:bg-white/10 disabled:opacity-50 rounded-lg cursor-pointer transition-all"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className='font-bold'>Search</span>
              )}
            </button>

            {/* Handle Error */}
            {error && <p className="text-red-300 text-xs mt-2 ml-2 animate-bounce">{error}</p>}
          </div>

        </div>

        {!weatherData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-slide-up">
            <div className="text-7xl mb-6 opacity-80">🌍</div>
            <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
            <p className="opacity-70">Enter a city to see the weather magic</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-3xl font-bold mb-1">{weatherData.sys.country} - {weatherData.name}</h1>
              <p className="text-lg opacity-80 capitalize">{weatherData.weather[0].main}</p>
            </div>

            {/* Weather Icon */}
            <div className="text-center flex items-center justify-between mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-9xl mb-4 drop-shadow-lg">
                {getWeatherIcon(weatherData.weather[0].main)}
              </div>
              <div className="flex justify-center items-end gap-2">
                <span className="text-6xl font-black">{Math.round(weatherData.main.temp)}°</span>
                <div className="flex flex-col text-sm opacity-80 pb-2">
                  <span>Max: {Math.round(weatherData.main.temp_max)}°</span>
                  <span>Min: {Math.round(weatherData.main.temp_min)}°</span>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="text-center mb-10 opacity-80 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-lg">
                {currentTime.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>

            {/* Week days */}
            <div className="flex justify-between mb-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {getWeekDays().map((day, index) => (
                <div key={index} className="text-center group transition-transform hover:scale-110">
                  <div className="text-2xl mb-1">{getWeatherIcon(weatherData.weather[0].main)}</div>
                  <div className="text-xs opacity-70 group-hover:opacity-100">{day}</div>
                </div>
              ))}
            </div>

            {/* Hourly forecast */}
            <div className="flex flex-col gap-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <h3 className="text-lg font-semibold opacity-60 uppercase tracking-widest text-center">Hourly Forecast</h3>
              <div className='forecast-container flex justify-between bg-white/5 rounded-lg'>
                {getHourlyForecast().map((hour, index) => (
                  <div key={index} className="flex flex-col w-full gap-2 items-center px-4 py-2 hover:bg-white/10 transition-colors">
                    <span className="font-medium">{hour.time}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-bold">{hour.temp}°</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard; 