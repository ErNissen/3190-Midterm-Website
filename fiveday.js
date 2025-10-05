function fetchData(){
    fetch("forecast.json")
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            appendData(data);
        })
        .catch(function (err){
            console.log('error: ' + err);
        });
}
    
function appendData(data){
    for(let i = 0; i<data.fiveday.length; i++){
        let mainContainer = document.getElementById("hourCard");
        let div = document.createElement("div");

        let icon;

        switch(data.fiveday[i].weather){
            case "Sunny":
                icon = "assets/images/clear-day.png";
                break;
            case "Rain":
                icon = "assets/images/rain.png";
                break;
            case "Partly Cloudy":
                icon = "assets/images/partly-cloudy-day.png"
                break;
        }

        div.innerHTML = ` 
            <div class="accordion" id="weatherCard">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${i}">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                            <strong>${data.fiveday[i].day}, ${data.fiveday[i].date}</strong>
                        </button>
                    </h2>
                    <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#weatherCard">
                        <div class="accordion-body">
                            <table>
                                <tr>
                                    <td>High of ${data.fiveday[i].temphigh}°F</td>
                                    <td>Low of ${data.fiveday[i].templow}°F</td>
                                    <td>Precipitation: ${data.fiveday[i].precip}%</td>
                                    <td>Weather: ${data.fiveday[i].weather}</td>
                                    <td><img src="${icon}" alt="Weather Icon" height=75px width=75px></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
        mainContainer.appendChild(div);
        document.getElementById("getWeather").disabled = true;
    };
}
