function getWeather(){
    //Api key from ErNissen's openweathermap account
    const apiKey= '2249fbbe6fb49e3aabdbee25442e1d57';
    //Grabs what is written to the "city" element in current.html
    const city = document.getElementById('city').value;

    //If a parsable word is not written, tell the user to enter a city again
    if (!city){
        alert('Please enter a city');
        return;
    }

    //Access to the OWM current weather api
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    //Grabs the data from API
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            //Runs function using the API data
            displayWeather(data)
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

//Ultimately populates the HTML elements with the current weather information
function displayWeather(data){
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    //clear previous content for new city entries
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    //Check for error with API service
    if (data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    }
    else{
        //Convert Kelvin to Fahrenheit
        //Todo: Allow user to change to Celsius, maybe automatically based on region?
        const temperature = Math.round((data.main.temp - 273.15) * (9 / 5) + 32);
        
        //Weather condition
        const description = data.weather[0].description;

        //Associated icon to weather condition
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;


        const temperatureHTML = `
            <p>${temperature}°F</p>
        `;

        const weatherHtml = `
            <p>${description}</p>
        `;

        //Writes to the respective div element in current.html
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

//Shows the image from OWM
function showImage(){
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}