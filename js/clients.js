// js/clients.js

// ----- Constants -----
const STORAGE_KEY = "fitcrmClients";
const EDIT_ID_KEY = "fitcrmEditClientId";
const VIEW_ID_KEY = "fitcrmSelectedClientId";

let allClients = [];

// ----- LocalStorage helpers -----

function loadClientsFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error parsing clients from localStorage:", err);
    return [];
  }
}

function saveClientsToStorage(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

// ----- Seed sample data if empty (so the table is not blank) -----

function seedSampleClientsIfEmpty() {
  const existing = loadClientsFromStorage();
  if (existing && existing.length > 0) {
    allClients = existing;
    return;
  }

  allClients = [
    {
      id: "c1",
      name: "Amira Khaled",
      email: "amira.k@example.com",
      phone: "+20 100 111 0001",
      goal: "Weight Loss",
      startDate: "2025-01-10",
      trainingHistory: "3x/week cardio and strength sessions."
    },
    {
      id: "c2",
      name: "Omar Hassan",
      email: "omar.h@example.com",
      phone: "+20 100 111 0002",
      goal: "Muscle Gain",
      startDate: "2025-02-01",
      trainingHistory: "Focused on hypertrophy and compound lifts."
    },
    {
      id: "c3",
      name: "Leila Samir",
      email: "leila.s@example.com",
      phone: "+20 100 111 0003",
      goal: "General Fitness",
      startDate: "2024-09-15",
      trainingHistory: "Mixed HIIT, mobility, and light strength work."
    },
    {
      id: "c4",
      name: "Karim Nabil",
      email: "karim.n@example.com",
      phone: "+20 100 111 0004",
      goal: "Muscle Gain",
      startDate: "2025-03-20",
      trainingHistory: "Upper/lower split, progressive overload."
    },
    {
      id: "c5",
      name: "Nora Adel",
      email: "nora.a@example.com",
      phone: "+20 100 111 0005",
      goal: "Weight Loss",
      startDate: "2024-12-05",
      trainingHistory: "Cardio and calorie control."
    },
    {
      id: "c6",
      name: "Youssef Emad",
      email: "youssef.e@example.com",
      phone: "+20 100 111 0006",
      goal: "Cardio Endurance",
      startDate: "2025-04-02",
      trainingHistory: "Interval running plan, gradual volume increases."
    },
    {
      id: "c7",
      name: "Sara Mostafa",
      email: "sara.m@example.com",
      phone: "+20 100 111 0007",
      goal: "Flexibility",
      startDate: "2024-11-12",
      trainingHistory: "Yoga and stretching 3x/week."
    },
    {
      id: "c8",
      name: "Mahmoud Farag",
      email: "mahmoud.f@example.com",
      phone: "+20 100 111 0008",
      goal: "Weight Loss",
      startDate: "2025-05-18",
      trainingHistory: "Full-body workouts + daily steps."
    },
    {
      id: "c9",
      name: "Dina Gamal",
      email: "dina.g@example.com",
      phone: "+20 100 111 0009",
      goal: "Muscle Gain",
      startDate: "2024-10-03",
      trainingHistory: "Push/pull/legs with progressive overload."
    },
    {
      id: "c10",
      name: "Rami Saad",
      email: "rami.s@example.com",
      phone: "+20 100 111 0010",
      goal: "General Fitness",
      startDate: "2025-06-01",
      trainingHistory: "Combo of cardio, weights, and sports."
    }
  ];

  saveClientsToStorage(allClients);
}

// ----- Rendering -----

function renderClients(clientsToRender) {
  const tbody = document.getElementById("clientTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!clientsToRender || clientsToRender.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No clients found.";
    td.classList.add("muted");
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  clientsToRender.forEach((client) => {
    const tr = document.createElement("tr");
    tr.dataset.id = client.id;

    // Name
    const nameTd = document.createElement("td");
    nameTd.textContent = client.name || "";
    tr.appendChild(nameTd);

    // Email
    const emailTd = document.createElement("td");
    emailTd.textContent = client.email || "";
    tr.appendChild(emailTd);

    // Phone
    const phoneTd = document.createElement("td");
    phoneTd.textContent = client.phone || "";
    tr.appendChild(phoneTd);

    // Fitness Goal
    const goalTd = document.createElement("td");
    goalTd.textContent = client.goal || "";
    tr.appendChild(goalTd);

    // Start Date
    const startTd = document.createElement("td");
    startTd.textContent = client.startDate || "";
    tr.appendChild(startTd);

    // Actions
    const actionsTd = document.createElement("td");
    actionsTd.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.className = "btn small";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn small ghost";
    deleteBtn.textContent = "Delete";

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    // ----- Event listeners -----

    // Row click = View client (Page 3: client.html)
    tr.addEventListener("click", function (e) {
      // Avoid triggering when clicking the buttons
      if (e.target === editBtn || e.target === deleteBtn) return;

      localStorage.setItem(VIEW_ID_KEY, client.id);
      window.location.href = "client.html"; // your "Client View" page
    });

    // Edit button
    editBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // don't trigger row click
      localStorage.setItem(EDIT_ID_KEY, client.id);
      window.location.href = "new-client.html"; // your "New/Edit Client" page
    });

    // Delete button
    deleteBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      const confirmed = window.confirm(
        `Are you sure you want to delete "${client.name}"?`
      );
      if (!confirmed) return;

      allClients = allClients.filter((c) => c.id !== client.id);
      saveClientsToStorage(allClients);
      applyFilterAndRender(); // keep search filter if any
    });

    tbody.appendChild(tr);
  });
}

// ----- Search -----

function applyFilterAndRender() {
  const searchInput = document.getElementById("search");
  const term = searchInput ? searchInput.value.trim().toLowerCase() : "";

  if (!term) {
    renderClients(allClients);
    return;
  }

  const filtered = allClients.filter((client) =>
    (client.name || "").toLowerCase().includes(term)
  );
  renderClients(filtered);
}

function setupSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    applyFilterAndRender();
  });
}

// ----- Init -----

document.addEventListener("DOMContentLoaded", function () {
  // Load or seed data
  seedSampleClientsIfEmpty();
  // If there was already data, seedSampleClientsIfEmpty() put it into allClients
  // but if storage already had data, we need to ensure allClients is loaded:
  if (allClients.length === 0) {
    allClients = loadClientsFromStorage();
  }

  renderClients(allClients);
  setupSearch();
});
