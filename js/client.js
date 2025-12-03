const STORAGE_KEY = "fitcrmClients";
const VIEW_ID_KEY = "fitcrmSelectedClientId";

function loadClients() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

async function fetchExercises() {
  try {
    const r = await fetch("https://wger.de/api/v2/exercise/?limit=5&language=2");
    const d = await r.json();
    return d.results.map(e => e.name);
  } catch {
    return ["Could not load exercises"];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem(VIEW_ID_KEY);
  const clients = loadClients();
  const client = clients.find(c => c.id === id);

  const details = document.getElementById("clientDetails");
  const exerciseList = document.getElementById("exerciseList");

  if (!client) {
    details.innerHTML = "<p>Client not found.</p>";
    return;
  }

  details.innerHTML = `
    <p><strong>Name:</strong> ${client.name}</p>
    <p><strong>Email:</strong> ${client.email}</p>
    <p><strong>Phone:</strong> ${client.phone}</p>
    <p><strong>Goal:</strong> ${client.goal}</p>
    <p><strong>Start Date:</strong> ${client.startDate}</p>
    <p><strong>Training History:</strong> ${client.trainingHistory || "None"}</p>
  `;

  const exercises = await fetchExercises();
  exerciseList.innerHTML = exercises.map(ex => `<li>${ex}</li>`).join("");
});

