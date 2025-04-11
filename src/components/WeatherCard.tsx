import { useState, useEffect } from 'react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface Props {
  weatherData: WeatherData;
}

const getBackgroundColor = (weatherMain: string, temp: number): string => {
  if (weatherMain.toLowerCase().includes('clear') && temp > 20) {
    return 'bg-gradient-to-b from-orange-400 to-orange-600';
  }
  if (weatherMain.toLowerCase().includes('rain')) {
    return 'bg-gradient-to-b from-gray-400 to-gray-600';
  }
  if (weatherMain.toLowerCase().includes('snow')) {
    return 'bg-gradient-to-b from-cyan-400 to-cyan-600';
  }
  if (weatherMain.toLowerCase().includes('clouds')) {
    return 'bg-gradient-to-b from-gray-300 to-gray-500';
  }
  return 'bg-gradient-to-b from-blue-400 to-blue-600';
};

const getWeatherIcon = (weatherMain: string): string => {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'rain':
    case 'drizzle':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'clouds':
      return '☁️';
    default:
      return '🌤️';
  }
};

const WeatherCard = ({ weatherData }: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const weatherMain = weatherData.weather[0].main;
  const bgColor = getBackgroundColor(weatherMain, weatherData.main.temp);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getHourlyForecast = () => {
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

  const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(currentTime.getDate() + i);
      days.push(getDayName(date));
    }
    return days;
  };

  return (
    <div className={`rounded-3xl p-6 text-white min-h-[600px] w-[340px] ${bgColor}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">{weatherData.name}</h1>
          <p className="text-lg">{weatherData.weather[0].description}</p>
        </div>

        {/* Weather Icon */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">
            {getWeatherIcon(weatherMain)}
          </div>
          <div className="flex justify-center items-center gap-4">
            <span className="text-sm">min. {Math.round(weatherData.main.temp_min)}°</span>
            <span className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°</span>
            <span className="text-sm">max. {Math.round(weatherData.main.temp_max)}°</span>
          </div>
        </div>

        {/* Date */}
        <div className="text-center mb-8">
          <p>{currentTime.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}</p>
        </div>

        {/* Week days */}
        <div className="flex justify-between mb-8">
          {getWeekDays().map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl mb-1">{getWeatherIcon(weatherMain)}</div>
              <div className="text-xs">{day}</div>
            </div>
          ))}
        </div>

        {/* Hourly forecast */}
        <div className="space-y-2">
          {getHourlyForecast().map((hour, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{hour.time}</span>
              <span className="flex items-center gap-2">
                {getWeatherIcon(weatherMain)} {hour.temp}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard; 