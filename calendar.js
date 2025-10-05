// ----------------------------
// 🗓️ DATE + FACT OF THE DAY
// ----------------------------
const today = new Date();
document.getElementById("todays_date").innerText = today.toDateString();

// Get today's key (e.g., "10/2")
const key = `${today.getMonth() + 1}/${today.getDate()}`;

// Load dayEvents.json for holidays / observances
fetch("dayEvents.json")
  .then((res) => res.json())
  .then((dayFacts) => {
    const fact = dayFacts[key];
    document.getElementById("dayFact").innerText =
      Array.isArray(fact)
        ? fact.join(" • ")
        : fact || "Nothing special today (yet)!";
  })
  .catch((err) => {
    console.error("Error loading dayEvents.json:", err);
    document.getElementById("dayFact").innerText =
      "Unable to load today's event.";
  });

// ----------------------------
// ✅ EVENT MANAGEMENT
// ----------------------------

// DOM references
const addEventBtn = document.getElementById("addEventBtn");
const newEventInput = document.getElementById("newEventInput");
const eventList = document.getElementById("eventList");
const showCompletedBtn = document.getElementById("showCompletedBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");

// Default daily events
const defaultEvents = [
  { text: "Brush Teeth", completed: false, isDefault: true },
  { text: "Shower", completed: false, isDefault: true },
  { text: "Eat", completed: false, isDefault: true },
];

// Load user events from localStorage
let userEvents = JSON.parse(localStorage.getItem("userEvents")) || [];

// Save events to localStorage
function saveEvents() {
  localStorage.setItem("userEvents", JSON.stringify(userEvents));
}

// Render all events (default + user)
function renderEvents() {
  eventList.innerHTML = "";
  const allEvents = [...defaultEvents, ...userEvents];

  allEvents.forEach((event, index) => {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    if (event.completed) {
      li.classList.add("text-muted");
      li.style.fontStyle = "italic";
    } else {
      li.classList.remove("text-muted");
      li.style.fontStyle = "normal";
    }

    const span = document.createElement("span");
    span.textContent = event.text;

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    // ✅ Complete button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = event.completed ? "[✔]" : "[]";
    completeBtn.classList.add("btn", "btn-sm", "btn-outline-success");
    completeBtn.onclick = () => {
      event.completed = !event.completed;
      saveEvents();
      renderEvents();
    };
    btnGroup.appendChild(completeBtn);

    // ❌ Delete button
    if (!event.isDefault) {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.classList.add("btn", "btn-sm", "btn-outline-danger");
      deleteBtn.onclick = () => {
        userEvents.splice(index - defaultEvents.length, 1);
        saveEvents();
        renderEvents();
      };
      btnGroup.appendChild(deleteBtn);
    }

    li.appendChild(span);
    li.appendChild(btnGroup);
    eventList.appendChild(li);
  });
}

// Add new event
addEventBtn.addEventListener("click", () => {
  const newEventText = newEventInput.value.trim();
  if (newEventText !== "") {
    userEvents.push({
      text: newEventText,
      completed: false,
      isDefault: false,
    });
    saveEvents();
    renderEvents();
    newEventInput.value = "";
  }
});

// Toggle show/hide completed
let showCompleted = true;
showCompletedBtn.addEventListener("click", () => {
  showCompleted = !showCompleted;
  showCompletedBtn.textContent = showCompleted
    ? "Hide Completed"
    : "Show Completed";
  renderEvents();
  if (!showCompleted) {
    const items = document.querySelectorAll(".text-muted");
    items.forEach((el) => (el.style.display = "none"));
  }
});

// Clear all completed user events
clearCompletedBtn.addEventListener("click", () => {
  userEvents = userEvents.filter((event) => !event.completed);
  saveEvents();
  renderEvents();
});

renderEvents();

// ----------------------------
// 🌦 WEATHER FETCH SECTION
// ----------------------------

// Your OpenWeatherMap API key
const apiKey = "2249fbbe6fb49e3aabdbee25442e1d57";

// DOM element to display weather info
const weatherElement = document.getElementById("weather");

// Function to map weather conditions → your local image files
function getWeatherIcon(condition) {
  const c = condition.toLowerCase();

  if (c.includes("clear")) return "assets/images/clear-day.png";
  if (c.includes("cloud")) return "assets/images/clouds.png";
  if (c.includes("rain")) return "assets/images/rain.png";
  if (c.includes("thunder")) return "assets/images/thunderstorm.png";
  if (c.includes("drizzle")) return "assets/images/drizzle.png";
  if (c.includes("snow")) return "assets/images/snow.png";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze"))
    return "assets/images/mist.png";

  return "assets/images/clear-day.png"; // fallback if unknown
}

// Display the weather data
function displayWeather(data) {
  const city = data.name;
  const temp = Math.round(data.main.temp);
  const desc = data.weather[0].description;
  const iconPath = getWeatherIcon(desc);

  // Build HTML for weather display
  weatherElement.innerHTML = `
    <div class="text-center">
      <h4>${city}</h4>
      <img src="${iconPath}" alt="${desc}" class="weather-icon" style="width:100px;height:100px;" />
      <p class="mb-0 text-capitalize">${desc}</p>
      <h3>${temp}°C</h3>
    </div>
  `;
}

// Fetch weather by coordinates
function getWeatherByCoords(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => displayWeather(data))
    .catch((err) => {
      console.error("Error fetching weather:", err);
      weatherElement.innerHTML = "Unable to load weather data 🌧️";
    });
}

// Fetch weather by city (fallback)
function getWeatherByCity(city = "Ames") {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => displayWeather(data))
    .catch((err) => {
      console.error("Error fetching weather:", err);
      weatherElement.innerHTML = "Unable to load weather data 🌧️";
    });
}

// Try to get user location
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    },
    (error) => {
      console.warn("Geolocation denied, using default city:", error);
      getWeatherByCity(); // Default fallback
    }
  );
} else {
  // Geolocation not supported
  getWeatherByCity();
}
