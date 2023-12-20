//*Event listener for search button on Enter City form//
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city-input').value;
    getGeoLocation(city);
});
//Saving searched cities to local storage and displaying them (only the last 5 so it's not overwhelming)
function saveToLocalStorage(cityName) {
    let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        localStorage.setItem('searchedCities', JSON.stringify(cities));
    }
}
//Adding the last 5 searched cities as buttons that can be clicked to show their weather data and forecasts again
function loadFromLocalStorage() {
    let cities = JSON.parse(localStorage.getItem('searchedCities')) || [];
    let historyContainer = document.getElementById('search-history');
    historyContainer.innerHTML = ''; 

    cities.forEach(city => {
        let cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.classList.add('btn', 'btn-secondary', 'city-button');
        cityButton.onclick = function() {
            getGeoLocation(city); 
        };
        historyContainer.appendChild(cityButton);
    });
}

// Display search history when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
});


//*converting the location into lat and lon so it can work with the city location
function getGeoLocation(cityName) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37';
    var geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(geoApiUrl)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            getWeather(lat, lon, cityName);
            getForecast(lat, lon);
            saveToLocalStorage(cityName); // Save the city to local storage
        } else {
            console.error('Geolocation not found for the city:', cityName);
        }
    })
    .catch(error => {
        console.error('Error fetching location:', error);
    });
}

//*getting weather data for the lat and lon of the city
function getWeather(latitude, longitude, cityName) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37';
    var weatherApiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    var airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetch(weatherApiURL)
    .then(response => response.json())
    .then(weatherData => {
        if(weatherData.cod === 200) {
            return fetch(airQualityUrl)
            .then(response => response.json())
            .then(aqData => {
                displayCurrentWeather(weatherData, cityName, aqData);
            });
        } else {
            console.error('Error fetching weather:', weatherData.message);
        }
    })
    .catch(error => {
        console.error('Error fetching weather or air quality:', error);
    });
}

function displayCurrentWeather(weatherData, cityName, aqData) {
    var weatherCard = document.getElementById('current-weather-card');
    var currentTemp = weatherData.main.temp; 
    var windSpeed = weatherData.wind.speed;
    var humidity = weatherData.main.humidity;
    var iconCode = weatherData.weather[0].icon;
    var iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
    var aqi = aqData.list[0].main.aqi; 
    var currentDate = new Date();
    var dateString = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    weatherCard.querySelector('.card-title').textContent = `Current Weather in ${cityName} on ${dateString}`;
    weatherCard.querySelector('.card-text').innerHTML = `
        <img src="${iconUrl}" alt="Weather icon">
        <p><strong>Temperature:</strong> ${currentTemp}°F</p>
        <p><strong>Wind:</strong> ${windSpeed} MPH</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Air Quality Index (AQI):</strong> ${aqi}</p> <!-- Added AQI -->
    `;
}


//5 Day Forecast//
function getForecast(latitude, longitude) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37'; 
    var forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
    fetch(forecastApiUrl)
    .then(response => response.json())
    .then(data => {
        display5DayForecast(data);
    })
    .catch(error => {
        console.error('Error fetching 5-day forecast:', error);
 });
}
//Displaying forecast for 5 days
function display5DayForecast(forecastData) {
    var forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast cards

    const dailyForecasts = forecastData.list.filter((reading) => reading.dt_txt.includes('12:00:00'));
    dailyForecasts.slice(0, 5).forEach((dailyData) => {
        const date = new Date(dailyData.dt_txt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const iconCode = dailyData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        const cardHtml = `
            <div class="col">
                <div class="card">
                    <div class="card-header date-header">${formattedDate}</div>
                    <div class="card-body">
                        <img src="${iconUrl}" alt="Weather icon">
                        <p class="card-text"><strong>Temp:</strong> ${dailyData.main.temp}°F</p>
                        <p class="card-text"><strong>Wind:</strong> ${dailyData.wind.speed} MPH</p>
                        <p class="card-text"><strong>Humidity:</strong> ${dailyData.main.humidity}%</p>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.innerHTML += cardHtml;
    });
}
    
//Setting the current weather card to have a prompt prior to entering a city so that it doesnt show a blank card with no weather
function setDefaultWeatherCardText() {
    var weatherCard = document.getElementById('current-weather-card');
    weatherCard.querySelector('.card-title').textContent = "Current Weather";
    weatherCard.querySelector('.card-text').textContent = "Enter a city to see the weather and forecast!";
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', setDefaultWeatherCardText);
