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
    for(let i = 0; i<data.fiveday.length; i++){
        let mainContainer = document.getElementById("hourCard");
        let div = document.createElement("div");
        div.innerHTML = `
            <div class="col">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <table>
                            <tr>
                                <td>${data.fiveday[i].day}</td>
                                <td>High of ${data.fiveday[i].temphigh}°F</td>
                                <td>Low of ${data.fiveday[i].templow}°F</td>
                                <td>Precipitation Chance: ${data.fiveday[i].precip}%</td>
                                <td>Weather: ${data.fiveday[i].weather}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `;
        mainContainer.appendChild(div);
    };
}


