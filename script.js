let inputCountry = document.querySelector('#inputText');
let inputSeach = document.querySelector('#buttonSearch');
let country = document.querySelector('#country');
let content = null || document.querySelector('#content');

inputSeach.addEventListener('click', () => {
  let nameCountry = inputCountry;
  country.innerHTML = nameCountry.value;
  const URL = `https://weatherapi-com.p.rapidapi.com/current.json?q=${nameCountry.value}`;
  console.log(URL);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '0133c3b32emshde21c1cfb852731p1c07f6jsnd35c78bfada8',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };
  
  async function fetchData(urlApi){
    const response = await fetch(urlApi, options);
    const data = await response.json();
    return data;
  }
  
  (async () => {
    try {
      const cardWeather = await fetchData(URL);
      console.log(cardWeather);
      const deployCard = `
      <div class="info__country--weather-api">
        <span id="apiLocalTime">${cardWeather.location.localtime}</span>
        <span id="apiCity">${cardWeather.location.name}</span>
        <span id="apiLat">${cardWeather.location.lat}</span>
        <span id="apiLon">${cardWeather.location.lon}</span>
        <span id="apiHum">${cardWeather.current.humidity}</span>
        <span id="apiTemp">${cardWeather.current.temp_c}</span>
        <span id="apiSpeed">${cardWeather.current.wind_kph}</span>
      </div>
      `;
      content.innerHTML = deployCard;
    } catch (error) {
      console.log(error);
      alert('Algo salió mal');
    }
  })();
})
