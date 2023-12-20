//*Event listener for search button on Enter City form//
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city-input').value;
    getGeoLocation(city);
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
            getWeather(lat, lon);
            getForecast(lat, lon);
        } else {
            console.error('Geolocation not found for the city of:', cityName);
        }
    })
    .catch(error => {
        console.error('Error fetching location:', error);
    });


}
//*getting weather data for the lat and lon of the city
function getWeather(latitude, longitude) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37'; 
    var weatherApiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(weatherApiURL)
    .then(response => response.json())
    .then(data => {
        if(data.cod === 200) {
            displayCurrentWeather(data);
        } else {
            console.error('Error fetching weather:', data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching weather:', error);
    });
}

function displayCurrentWeather(weatherData) {
    if (weatherData) {
        var weatherCard = document.getElementById('current-weather-card');
        var currentTemp = weatherData.main.temp;
        var windSpeed = weatherData.wind.speed;
        var humidity = weatherData.main.humidity;

        weatherCard.querySelector('.card-title').textContent = `Current Weather in ${weatherData.name}`;
        weatherCard.querySelector('.card-text').innerHTML = `
            <p>Temperature: ${currentTemp}°F</p>
            <p>Wind: ${windSpeed} MPH</p>
            <p>Humidity: ${humidity}%</p>
        `;
    }
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
///////
function display5DayForecast(forecastData) {
    var forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast cards

    // Filter out the forecasts for 12 PM each day
    const dailyForecasts = forecastData.list.filter((reading) => reading.dt_txt.includes('12:00:00'));
    
    // Take the first 5 forecasts from the filtered array to give only 5 days of forecast
    dailyForecasts.slice(0, 5).forEach((dailyData, index) => {
        // Convert the date text to a Date object and format it as MM/DD/YYYY
        const date = new Date(dailyData.dt_txt);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

        // Create the card dynamically so it doesn't have to be done in HTML
        const cardHtml = `
            <div class="col">
                <div class="card text-white bg-primary">
                    <div class="card-header">${formattedDate}</div>
                    <div class="card-body">
                        <p class="card-text">Temp: ${dailyData.main.temp}°F</p>
                        <p class="card-text">Wind: ${dailyData.wind.speed} MPH</p>
                        <p class="card-text">Humidity: ${dailyData.main.humidity}%</p>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.innerHTML += cardHtml;
    });
}