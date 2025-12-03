const STORAGE_KEY = "fitcrmClients";
const EDIT_ID_KEY = "fitcrmEditClientId";

function loadClients() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}
function saveClients(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function showError(field, msg) {
  const el = document.querySelector(`[data-error-for="${field}"]`);
  if (el) el.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("clientForm");
  const fullName = document.getElementById("fullName");
  const age = document.getElementById("age");
  const gender = document.getElementById("gender");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const goal = document.getElementById("goal");
  const startDate = document.getElementById("startDate");
  const history = document.getElementById("history");
  const title = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");

  let clients = loadClients();
  let editId = localStorage.getItem(EDIT_ID_KEY);
  let editing = clients.find(c => c.id === editId);

  if (editing) {
    fullName.value = editing.name;
    age.value = editing.age || "";
    gender.value = editing.gender || "";
    email.value = editing.email;
    phone.value = editing.phone;
    goal.value = editing.goal;
    startDate.value = editing.startDate;
    history.value = editing.trainingHistory || "";

    title.textContent = "Edit Client";
    submitBtn.textContent = "Save Changes";
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    clearErrors();

    let error = false;

    if (!fullName.value.trim()) {
      showError("fullName", "Full name is required.");
      error = true;
    }
    if (!email.value.trim()) {
      showError("email", "Email is required.");
      error = true;
    } else if (!validEmail(email.value)) {
      showError("email", "Invalid email format.");
      error = true;
    }
    if (!phone.value.trim()) {
      showError("phone", "Phone is required.");
      error = true;
    }
    if (!goal.value.trim()) {
      showError("goal", "Fitness goal is required.");
      error = true;
    }
    if (!startDate.value.trim()) {
      showError("startDate", "Start date is required.");
      error = true;
    }

    if (error) return;

    const clientData = {
      id: editId || ("c" + Date.now()),
      name: fullName.value.trim(),
      age: age.value || null,
      gender: gender.value || "",
      email: email.value.trim(),
      phone: phone.value.trim(),
      goal: goal.value.trim(),
      startDate: startDate.value.trim(),
      trainingHistory: history.value.trim()
    };

    if (editId) {
      const index = clients.findIndex(c => c.id === editId);
      clients[index] = clientData;
    } else {
      clients.push(clientData);
    }

    saveClients(clients);
    localStorage.removeItem(EDIT_ID_KEY);
    window.location.href = "clients.html";
  });
});
