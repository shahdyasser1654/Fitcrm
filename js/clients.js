const STORAGE_KEY = "fitcrmClients";
const EDIT_ID_KEY = "fitcrmEditClientId";
const VIEW_ID_KEY = "fitcrmSelectedClientId";

let allClients = [];

function loadClients() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveClients(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function seed() {
  const existing = loadClients();
  if (existing.length > 0) { allClients = existing; return; }

  allClients = [
    { id: "1", name: "Amira Khaled", email: "amira@example.com", phone: "01001110001", goal: "Weight Loss", startDate: "2025-01-10", trainingHistory: "" },
    { id: "2", name: "Omar Hassan", email: "omar@example.com", phone: "01001110002", goal: "Muscle Gain", startDate: "2025-02-01", trainingHistory: "" }
  ];
  saveClients(allClients);
}

function render(list) {
  const tbody = document.getElementById("clientTableBody");
  tbody.innerHTML = "";

  list.forEach(client => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>${client.goal}</td>
      <td>${client.startDate}</td>
      <td>
        <button class="btn small editBtn">Edit</button>
        <button class="btn small ghost deleteBtn">Delete</button>
      </td>
    `;

    tr.addEventListener("click", e => {
      if (e.target.classList.contains("editBtn") || e.target.classList.contains("deleteBtn")) return;
      localStorage.setItem(VIEW_ID_KEY, client.id);
      window.location.href = "client.html";
    });

    tr.querySelector(".editBtn").addEventListener("click", e => {
      e.stopPropagation();
      localStorage.setItem(EDIT_ID_KEY, client.id);
      window.location.href = "new-client.html";
    });

    tr.querySelector(".deleteBtn").addEventListener("click", e => {
      e.stopPropagation();
      if (!confirm("Delete this client?")) return;
      allClients = allClients.filter(c => c.id !== client.id);
      saveClients(allClients);
      render(allClients);
    });

    tbody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  seed();
  allClients = loadClients();
  render(allClients);

  document.getElementById("search").addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = allClients.filter(c => c.name.toLowerCase().includes(term));
    render(filtered);
  });
});
