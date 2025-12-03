const STORAGE_KEY = "fitcrmClients";
const EDIT_ID_KEY = "fitcrmEditClientId";
const VIEW_ID_KEY = "fitcrmSelectedClientId";

let allClients = [];

// Load from localStorage
function loadClients() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error parsing storage:", e);
    return [];
  }
}

// Save to localStorage
function saveClients(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Seed demo clients only if none exist
function seedIfNeeded() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    // localStorage has data, load it
    allClients = loadClients();
    return;
  }

  // localStorage is empty, seed demo clients
  allClients = [
    { id: "c1", name: "Amira Khaled", email: "amira.k@example.com", phone: "+20 100 111 0001", goal: "Weight Loss", startDate: "2025-01-10", trainingHistory: "" },
    { id: "c2", name: "Omar Hassan", email: "omar.h@example.com", phone: "+20 100 111 0002", goal: "Muscle Gain", startDate: "2025-02-01", trainingHistory: "" },
    { id: "c3", name: "Leila Samir", email: "leila.s@example.com", phone: "+20 100 111 0003", goal: "General Fitness", startDate: "2024-09-15", trainingHistory: "" },
    { id: "c4", name: "Karim Nabil", email: "karim.n@example.com", phone: "+20 100 111 0004", goal: "Muscle Gain", startDate: "2025-03-20", trainingHistory: "" },
    { id: "c5", name: "Nora Adel", email: "nora.a@example.com", phone: "+20 100 111 0005", goal: "Weight Loss", startDate: "2024-12-05", trainingHistory: "" },
    { id: "c6", name: "Youssef Emad", email: "youssef.e@example.com", phone: "+20 100 111 0006", goal: "Cardio Endurance", startDate: "2025-04-02", trainingHistory: "" },
    { id: "c7", name: "Sara Mostafa", email: "sara.m@example.com", phone: "+20 100 111 0007", goal: "Flexibility", startDate: "2024-11-12", trainingHistory: "" },
    { id: "c8", name: "Mahmoud Farag", email: "mahmoud.f@example.com", phone: "+20 100 111 0008", goal: "Weight Loss", startDate: "2025-05-18", trainingHistory: "" },
    { id: "c9", name: "Dina Gamal", email: "dina.g@example.com", phone: "+20 100 111 0009", goal: "Muscle Gain", startDate: "2024-10-03", trainingHistory: "" },
    { id: "c10", name: "Rami Saad", email: "rami.s@example.com", phone: "+20 100 111 0010", goal: "General Fitness", startDate: "2025-06-01", trainingHistory: "" }
  ];

  saveClients(allClients);
}

// Render the table
function render(list) {
  const tbody = document.getElementById("clientTableBody");
  tbody.innerHTML = "";

  if (!list || list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="muted">No clients found.</td></tr>`;
    return;
  }

  list.forEach((client) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>${client.goal}</td>
      <td>${client.startDate}</td>
      <td class="actions">
        <button class="btn small editBtn">Edit</button>
        <button class="btn small ghost deleteBtn">Delete</button>
      </td>
    `;

    // View client
    tr.addEventListener("click", (e) => {
      if (e.target.classList.contains("editBtn") || e.target.classList.contains("deleteBtn")) return;
      localStorage.setItem(VIEW_ID_KEY, client.id);
      window.location.href = "client.html";
    });

    // Edit client
    tr.querySelector(".editBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      localStorage.setItem(EDIT_ID_KEY, client.id);
      window.location.href = "new-client.html";
    });

    // Delete client
    tr.querySelector(".deleteBtn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (!confirm(`Delete "${client.name}"?`)) return;
      allClients = allClients.filter((c) => c.id !== client.id);
      saveClients(allClients);
      applySearch();
    });

    tbody.appendChild(tr);
  });
}

// Search by name
function applySearch() {
  const term = document.getElementById("search").value.trim().toLowerCase();
  if (!term) {
    render(allClients);
    return;
  }
  const filtered = allClients.filter((c) => c.name.toLowerCase().includes(term));
  render(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("clients.js loaded");
  seedIfNeeded();
  allClients = loadClients();
  render(allClients);

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", applySearch);
  }
});
