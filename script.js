
//*Event listener for search button on Enter City form//
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var city = document.getElementById('city-input').value;
    getGeoLocation(city);
});

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
}
//*getting weather data for the lat and lon of the city
function getWeather(latitude, longitude) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37'
    var weatherapiURL = 'https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${91ce4240cdd8015ed3ef68dc83c67b37}&units=imperial';

    fetch(weatherapiURL)
    .then(response =>response.json())
    .then(data => {
        displayCurrentWeather(data);
    })
    .catch(error => {
        console.error('Error fetching weather: ', error);
    });
}

function displayCurrentWeather(weatherData) {
    var weatherCard = document.getElementById('current-weather-card')
    weatherCard.querySelector('.card-title').textContent = 'Weather in ${weatherData.name}';
    weatherCard.querySelector('.card-text').textContent = 'Temperature: ${weatherData.main.temp}°F';
}
/*var getWeather = function (CityName) {
    var apiURL = api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key};

    fetch(apiURL)
    .then(function(response){
        if (response.ok){
            response.json().then(function (data)) {
                displayWeather(data,cityName);
            });
            } else {
            alert('Error:' + response.StatusText)
            }

        .catch(function (error){
            alert('Unable to get weather data');
        });
*/