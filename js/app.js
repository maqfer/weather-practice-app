const apiKey = CONFIG.API_KEY;

// Временный тестовый ключ для проверки проекта
// В реальном проекте необходимо получить свой ключ на openweathermap.org

const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const errorMessage = document.getElementById('errorMessage');
const weatherCards = document.getElementById('weatherCards');

const addedCities = new Set();


form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const city = cityInput.value.trim();
  
  if (!city) {
    showError('Пожалуйста, введите название города');
    return;
  }

  const cityLower = city.toLowerCase();
  
  if (addedCities.has(cityLower)) {
    showError(`Город "${city}" уже добавлен в список`);
    cityInput.value = '';
    return;
  }

  fetchWeather(city);
});

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.cod === '404' || data.cod === 404) {
      showError(`Город "${city}" не найден. Проверьте название`);
      return;
    }
    
    if (data.cod !== 200) {
      showError(data.message || 'Произошла ошибка при получении данных');
      return;
    }
    
    displayWeather(data);
    addedCities.add(city.toLowerCase());
    cityInput.value = '';
    errorMessage.textContent = '';
    
  } catch (error) {
    console.error('Ошибка:', error);
    showError('Ошибка соединения. Проверьте интернет');
  }
}

function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;
  
  const card = document.createElement('div');
  card.className = 'weather-card';
  
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  
  card.innerHTML = `
    <h2 class="weather-card__city">${name}</h2>
    <span class="weather-card__country">${sys.country}</span>
    <div class="weather-card__temp">${Math.round(main.temp)}°C</div>
    <div class="weather-card__icon">
      <img src="${iconUrl}" alt="${weather[0].description}">
    </div>
    <div class="weather-card__description">${weather[0].description}</div>
    <div class="weather-card__details">
      <div class="weather-card__detail">
        <div class="weather-card__detail-label">Ощущается как</div>
        <div class="weather-card__detail-value">${Math.round(main.feels_like)}°C</div>
      </div>
      <div class="weather-card__detail">
        <div class="weather-card__detail-label">Влажность</div>
        <div class="weather-card__detail-value">${main.humidity}%</div>
      </div>
      <div class="weather-card__detail">
        <div class="weather-card__detail-label">Ветер</div>
        <div class="weather-card__detail-value">${Math.round(wind.speed)} м/с</div>
      </div>
    </div>
  `;
  
  weatherCards.appendChild(card);
}

function showError(message) {
  errorMessage.textContent = message;
  setTimeout(() => {
    errorMessage.textContent = '';
  }, 3000);
}

cityInput.addEventListener('input', () => {
  errorMessage.textContent = '';
});