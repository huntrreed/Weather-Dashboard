
//*Event listener for search button on Enter City form//
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city-input').value;
    getGeoLocation(city);
});
/*saving seatched cities*/
function saveSearchHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(cityName)) {
        history.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}

//*converting the location into lat and lon so it can work with the city location
function getGeoLocation(cityName) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37'
    var geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;


    fetch(geoApiUrl)
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            getWeather(lat, lon);
        } else {
            console.error('Geolocation not found for the city of:', cityName);
        }
    })
    .catch(error => {
        console.error('Error fetching location:', error);
    });
    saveSearchHistory(cityName);
}
//*getting weather data for the lat and lon of the city
function getWeather(latitude, longitude) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37'
    var weatherapiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    fetch(weatherapiURL)
    .then(response =>response.json())
    .then(data => {
        displayCurrentWeather(data);
    })
    .catch(error => {
        console.error('Error fetching weather: ', error);
    });
    getForecast(lat, lon);
}
//*display current weather for the city in the current weather box//
function displayCurrentWeather(weatherData) {
    console.log(weatherData);
    var weatherCard = document.getElementById('current-weather-card')
    weatherCard.querySelector('.card-title').textContent = `Current Weather in ${weatherData.name}`;
    weatherCard.querySelector('.card-text').textContent = `Temperature: ${weatherData.main.temp}°F`;
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
function display5DayForecast(forecastData) {
    for (let i = 0; i < 5; i++) {
        const dailyData = forecastData.list.filter((reading) => reading.dt_txt.includes(`12:00:00`));
        const dayCard = document.getElementById(`day${i+1}`);
        dayCard.querySelector('.card-title').textContent = `Day ${i+1}`;
        dayCard.querySelector('.card-temp').textContent = `Temp: High of ${dailyData[i].main.temp_max}°F / Low of ${dailyData[i].main.temp_min}°F`;
        dayCard.querySelector('.card-wind').textContent = `Wind: ${dailyData[i].wind.speed} mph`;
        dayCard.querySelector('.card-humidity').textContent = `Humidity: ${dailyData[i].main.humidity}%`;
    }
}


//WORKING ON THIS STILL ***********
// function loadSearchHistory() {
//     let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
//     let historyContainer = document.getElementById('search-history'); // Make sure this ID exists in your HTML
//     historyContainer.innerHTML = ''; // Clear existing content

//     history.forEach(city => {
//         let cityElement = document.createElement('button');
//         cityElement.textContent = city;
//         cityElement.classList.add('list-group-item', 'list-group-item-action');
//         cityElement.onclick = function() {
//             getGeoLocation(city); // Fetch weather data for the clicked city
//         };
//         historyContainer.appendChild(cityElement);
//     });
// window.onload = function() {
//     loadSearchHistory();
//  };
// }

