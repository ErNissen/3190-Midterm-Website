// Show today's date
const today = new Date();
document.getElementById("todays_date").innerText = today.toDateString();

// Example facts TODO change to json
const facts = {
  "10/2": "October 2 is World Farm Animals Day 🐄",
  "12/25": "December 25 is Christmas 🎄",
  "7/4": "July 4 is Independence Day 🇺🇸"
};
const key = `${today.getMonth() + 1}/${today.getDate()}`;
document.getElementById("dayFact").innerText = facts[key] || "Nothing special today (yet)!";

// Add Event Button Logic
const addEventBtn = document.getElementById("addEventBtn");
const newEventInput = document.getElementById("newEventInput");
const eventList = document.getElementById("eventList");

addEventBtn.addEventListener("click", () => {
  const newEventText = newEventInput.value.trim();
  if (newEventText !== "") {    
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.textContent = newEventText;

    eventList.appendChild(li);

    newEventInput.value = "";
  }
});

/* DOES NOT WORK with web browser privacy services active
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(
                `clatitude: ${latitudde}, longitude: ${longitude}`,
                "color: green"
            )
            getEndpoints(latitude, longitude)
        },
        (error) => {
            console.error(`%cError getting location: ${error.message}`,
                "color: red",
            )
        }
    )
}
else{
    console.error(
        "%cGeolocation is not supported by this browser.",
        "color: red"
    )
}*/

//Ames, IA coordinates
getEndpoints(42.026798, -93.620178)

async function getEndpoints(latitude, longitude){
    try{
        const response = await fetch(
            `https://api.weather.gov/points/${latitude},${longitude}`
        )

        if(!response.ok){
            throw new Error(
                `Fetching endpoints failed. Network response ${response.status}`
            )
        }

        const data = await response.json();

        const office = data.properties.gridId;
        const gridX = data.properties.gridX;
        const gridY = data.properties.gridY;

        getForecast(office, gridX, gridY);
    }
    catch(error){
        console.error(`%c${error.message}`, "color: red")
    }
}

async function getForecast(office, gridX, gridY){
    try{
        const response = await fetch(
            `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`
        )
        
        if(!response.ok){
            `Fetching forecast failed. Network response: ${response.status}`
        }
        
        const data = await response.json()

        //view weather information in console
        console.log(data)
    }
    catch (error){
        console.error(`%c${error.message}`, "color: red");
    }
}