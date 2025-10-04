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