var 
var
//*Event listener for search button on Enter City form//
document.GetElementbyID('search-form').addEventListener('sumbit', function(event){
    event.preventDefault();
    var city = document.getElementbyID('InputCity').value;
    getLocation(city);
});

function getLocation(cityName) {
    var apiKey = '91ce4240cdd8015ed3ef68dc83c67b37'
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        if(data && data.length > ) {
            const { lat, lon} = data[0];
            getWeather(lat, lon);
        }else {
            console.error('Geolocation not found for the city of: ', cityName);
        }
    })
    .catch(error => {
        console.error('Error fetching location', error);
    });
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