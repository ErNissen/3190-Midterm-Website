function getWeather(){
    const apiKey= '2249fbbe6fb49e3aabdbee25442e1d57';
    const city = document.getElementById('city').value;

    if (!city){
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data)
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });
}

function displayWeather(data){
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    //clear previous content for new city entries
    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    }
    else{
        const temperature = Math.round((data.main.temp - 273.15) * (9 / 5) + 32);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°F</p>
        `;

        const weatherHtml = `
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function showImage(){
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}