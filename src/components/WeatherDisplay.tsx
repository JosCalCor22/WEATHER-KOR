interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface Props {
  weatherData: WeatherData;
}

const WeatherDisplay = ({ weatherData }: Props) => {
  return (
    <div className="weather-data">
      <div className="current-weather">
        <div className="details">
          <h2>{weatherData.name}</h2>
          <h6>Temperature: {Math.round(weatherData.main.temp)}°C</h6>
          <h6>Wind: {weatherData.wind.speed} M/S</h6>
          <h6>Humidity: {weatherData.main.humidity}%</h6>
        </div>
        <div className="icon">
          <img 
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={weatherData.weather[0].description}
          />
          <h6>{weatherData.weather[0].description}</h6>
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay 