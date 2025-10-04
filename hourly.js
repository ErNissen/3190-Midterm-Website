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

function appendData(data){
    for(let i = 0; i<data.hourly.length; i++){
        let mainContainer = document.getElementById("hourCard");
        let div = document.createElement("div");
        div.innerHTML = `
            <div class="col">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <table>
                            <tr>
                                <td>${data.hourly[i].hour}</td>
                                <td>Temperature: ${data.hourly[i].temperature}°F</td>
                                <td>Precipitation Chance: ${data.hourly[i].precip}%</td>
                                <td>Weather: ${data.hourly[i].weather}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
        mainContainer.appendChild(div);
    };
}


