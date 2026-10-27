const STORAGE_KEY = "codealphaFitnessActivities";
const form = document.getElementById("activityForm");
const activityList = document.getElementById("activityList");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");
let activities = loadActivities();

document.getElementById("todayDate").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "short", month: "short", day: "numeric"
});

function loadActivities() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveActivities() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

function safeNumber(id) {
  return Math.max(0, Number(document.getElementById(id).value) || 0);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const minutes = safeNumber("activityMinutes");
  const calories = safeNumber("activityCalories");
  const steps = safeNumber("activitySteps");

  if (minutes < 1) {
    formMessage.textContent = "Please enter a duration of at least 1 minute.";
    return;
  }

  activities.unshift({
    id: Date.now(),
    type: document.getElementById("activityType").value,
    minutes,
    calories,
    steps,
    date: new Date().toISOString()
  });

  saveActivities();
  form.reset();
  formMessage.textContent = "Activity added and saved on this device!";
  render();
});

function removeActivity(id) {
  activities = activities.filter((activity) => activity.id !== id);
  saveActivities();
  render();
}

document.getElementById("clearBtn").addEventListener("click", () => {
  if (!activities.length) return;
  if (confirm("Clear all activity history? This cannot be undone.")) {
    activities = [];
    saveActivities();
    render();
    formMessage.textContent = "Activity history cleared.";
  }
});

function percentage(value, goal) {
  return Math.min(100, Math.round((value / goal) * 100));
}

function render() {
  const totals = activities.reduce((sum, item) => {
    sum.steps += item.steps;
    sum.calories += item.calories;
    sum.minutes += item.minutes;
    return sum;
  }, { steps: 0, calories: 0, minutes: 0 });

  document.getElementById("stepsValue").textContent = totals.steps.toLocaleString();
  document.getElementById("caloriesValue").textContent = totals.calories.toLocaleString();
  document.getElementById("minutesValue").textContent = totals.minutes.toLocaleString();

  const stepsPct = percentage(totals.steps, 8000);
  const caloriesPct = percentage(totals.calories, 500);
  const minutesPct = percentage(totals.minutes, 30);
  document.getElementById("stepsProgress").style.width = `${stepsPct}%`;
  document.getElementById("caloriesProgress").style.width = `${caloriesPct}%`;
  document.getElementById("minutesProgress").style.width = `${minutesPct}%`;
  document.getElementById("stepsGoalText").textContent = `${stepsPct}%`;
  document.getElementById("caloriesGoalText").textContent = `${caloriesPct}%`;
  document.getElementById("minutesGoalText").textContent = `${minutesPct}%`;

  const averagePct = Math.round((stepsPct + caloriesPct + minutesPct) / 3);
  document.getElementById("goalPercent").textContent = `${averagePct}%`;
  document.getElementById("progressRing").style.background =
    `conic-gradient(var(--purple) ${averagePct * 3.6}deg, #eceafc ${averagePct * 3.6}deg)`;

  activityList.innerHTML = "";
  emptyState.hidden = activities.length > 0;

  activities.forEach((activity) => {
    const row = document.createElement("tr");
    const values = [
      { text: activity.type, className: "activity-name" },
      { text: `${activity.minutes} min` },
      { text: `${activity.calories.toLocaleString()} kcal` },
      { text: activity.steps.toLocaleString() }
    ];
    values.forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value.text;
      if (value.className) cell.className = value.className;
      row.appendChild(cell);
    });

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${activity.type} activity`);
    deleteButton.addEventListener("click", () => removeActivity(activity.id));
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);
    activityList.appendChild(row);
  });
}

render();
