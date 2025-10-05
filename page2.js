// ----------------------------
// 📅 FULL MONTH CALENDAR + DAILY WEATHER
// ----------------------------

// DOM references
const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");

// Track current date
let currentDate = new Date();
const apiKey = "2249fbbe6fb49e3aabdbee25442e1d57";

// ----------------------------
// 🌦️ WEATHER ICON MAP
// ----------------------------
function getWeatherIcon(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("clear")) return "assets/images/clear-day.png";
  if (c.includes("sunny")) return "assets/images/clear-day.png";
  if (c.includes("cloud")) return "assets/images/clouds.png";
  if (c.includes("rain")) return "assets/images/rain.png";
  if (c.includes("thunder")) return "assets/images/thunderstorm.png";
  if (c.includes("drizzle")) return "assets/images/drizzle.png";
  if (c.includes("snow")) return "assets/images/snow.png";
  if (c.includes("mist") || c.includes("fog") || c.includes("haze"))
    return "assets/images/mist.png";
  return "assets/images/clear-day.png";
}

// ----------------------------
// 🗓️ UTILITIES
// ----------------------------
function keyForDate(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

// ----------------------------
// 🌍 LOCATION HELPERS
// ----------------------------
function getCoords() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null) // denied
      );
    } else resolve(null);
  });
}

// ----------------------------
// 🌦️ FETCH WEATHER DATA
// ----------------------------
async function fetchDailyForecast() {
  try {
    const coords = await getCoords();

    if (!coords) throw new Error("No coordinates available");

    const { lat, lon } = coords;
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");

    const data = await res.json();

    // Map daily forecast
    const forecastMap = {};
    data.daily.forEach((d) => {
      const dt = new Date(d.dt * 1000);
      const k = keyForDate(dt);
      const temp = Math.round(d.temp.day);
      const desc = (d.weather && d.weather[0] && d.weather[0].description) || "";
      forecastMap[k] = { temp, desc, icon: getWeatherIcon(desc) };
    });

    console.log("✅ Using live weather data");
    return forecastMap;
  } catch (err) {
    console.warn("⚠️ Falling back to mock data:", err.message);
    return fetchMockForecast();
  }
}

// ----------------------------
// 🧩 FALLBACK: MOCK DATA JSON
// ----------------------------
async function fetchMockForecast() {
  try {
    const res = await fetch("mockOctForcast.json");
    const data = await res.json();
    const map = {};

    for (const [key, value] of Object.entries(data.forecast)) {
      // Convert "10/5" → "2025-10-5"
      const parts = key.split("/");
      const formatted = `${data.year}-${parts[0]}-${parts[1]}`;
      map[formatted] = {
        temp: value.temp,
        desc: value.desc,
        icon: getWeatherIcon(value.desc),
      };
    }

    console.log("✅ Using mockForecast.json");
    return map;
  } catch (err) {
    console.error("❌ Could not load mock forecast:", err);
    return {};
  }
}

// ----------------------------
// 🧱 CALENDAR RENDERING
// ----------------------------
function renderCalendar(date, forecastMap = {}) {
  calendarDays.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const monthName = date.toLocaleString("default", { month: "long" });
  monthYear.textContent = `${monthName} ${year}`;

  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  let row;

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDay + 1;
    const cell = document.createElement("div");
    cell.classList.add("col", "border", "calendar-cell", "g-0");

    if (i % 7 === 0) {
      row = document.createElement("div");
      row.classList.add("row", "g-0");
      calendarDays.appendChild(row);
    }

    if (dayNum > 0 && dayNum <= daysInMonth) {
      const cellDate = new Date(year, month, dayNum);
      const today = new Date();
      const isToday =
        dayNum === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Day number
      const num = document.createElement("div");
      num.classList.add("day-num");
      num.textContent = dayNum;
      if (isToday) num.classList.add("today");

      // Forecast info
      const weatherWrap = document.createElement("div");
      weatherWrap.classList.add("day-forecast");

      const k = keyForDate(cellDate);
      const fc = forecastMap[k];

      if (fc) {
        weatherWrap.innerHTML = `
          <img src="${fc.icon}" alt="${fc.desc}" class="weather-icon" />
          <div class="temp-small">${fc.temp}°C</div>
        `;
      } else {
        // no forecast
        weatherWrap.innerHTML = `<div class="temp-small text-muted" style="opacity:0.3;">N/A</div>`;
      }

      cell.appendChild(num);
      cell.appendChild(weatherWrap);
      if (isToday) cell.classList.add("bg-primary", "text-white");
    } else {
      cell.classList.add("bg-light");
    }

    row.appendChild(cell);
  }
}

// ----------------------------
// 🔄 MONTH NAVIGATION
// ----------------------------
prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate, lastForecastMap);
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate, lastForecastMap);
});

// ----------------------------
// 🚀 INITIAL LOAD
// ----------------------------
let lastForecastMap = {};
(async () => {
  lastForecastMap = await fetchDailyForecast();
  renderCalendar(currentDate, lastForecastMap);
})();
