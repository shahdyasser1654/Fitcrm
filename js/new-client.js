// js/new-client.js

const STORAGE_KEY = "fitcrmClients";
const EDIT_ID_KEY = "fitcrmEditClientId";

// ---- Helpers for localStorage ----

function loadClientsFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
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

// ---- Validation helpers ----

function clearErrors() {
  const errorEls = document.querySelectorAll(".field-error");
  errorEls.forEach((el) => {
    el.textContent = "";
  });
}

function showError(fieldName, message) {
  const errorEl = document.querySelector(
    `.field-error[data-error-for="${fieldName}"]`
  );
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function isValidEmail(email) {
  if (!email) return false;
  // simple email regex is enough for this assignment
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// ---- Main logic ----

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("clientForm");
  const titleEl = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");

  const fullNameInput = document.getElementById("fullName");
  const ageInput = document.getElementById("age");
  const genderInput = document.getElementById("gender");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const goalInput = document.getElementById("goal");
  const startDateInput = document.getElementById("startDate");
  const historyInput = document.getElementById("history");

  let clients = loadClientsFromStorage();

  // Check if we're in "edit mode"
  let editingClientId = localStorage.getItem(EDIT_ID_KEY);
  let editingClient = null;

  if (editingClientId) {
    editingClient = clients.find((c) => c.id === editingClientId);

    if (editingClient) {
      // Update title + button text
      if (titleEl) titleEl.textContent = "Edit Client";
      if (submitBtn) submitBtn.textContent = "Save Changes";

      // Repopulate form with existing data
      fullNameInput.value = editingClient.name || "";
      ageInput.value = editingClient.age || "";
      genderInput.value = editingClient.gender || "";
      emailInput.value = editingClient.email || "";
      phoneInput.value = editingClient.phone || "";
      goalInput.value = editingClient.goal || "";
      startDateInput.value = editingClient.startDate || "";
      historyInput.value = editingClient.trainingHistory || "";
    } else {
      // If client not found, clear the edit id so we don't get stuck
      localStorage.removeItem(EDIT_ID_KEY);
      editingClientId = null;
    }
  }

  // Handle form submit
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const name = fullNameInput.value.trim();
    const age = ageInput.value ? parseInt(ageInput.value, 10) : null;
    const gender = genderInput.value;
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const goal = goalInput.value.trim();
    const startDate = startDateInput.value;
    const trainingHistory = historyInput.value.trim();

    let hasError = false;

    // Required: name
    if (!name) {
      showError("fullName", "Full name is required.");
      hasError = true;
    }

    // Required: email
    if (!email) {
      showError("email", "Email is required.");
      hasError = true;
    } else if (!isValidEmail(email)) {
      showError("email", "Please enter a valid email address.");
      hasError = true;
    }

    // Required: phone
    if (!phone) {
      showError("phone", "Phone number is required.");
      hasError = true;
    }

    // Required: goal
    if (!goal) {
      showError("goal", "Please enter a fitness goal.");
      hasError = true;
    }

    // Required: start date
    if (!startDate) {
      showError("startDate", "Please select a start date.");
      hasError = true;
    }

    // Age basic validation (only if provided)
    if (ageInput.value && (age < 10 || age > 100)) {
      showError("age", "Age should be between 10 and 100.");
      hasError = true;
    }

    if (hasError) {
      return; // don't submit if there are validation errors
    }

    // Build client object
    let clientId = editingClientId;
    if (!clientId) {
      clientId = "c" + Date.now(); // simple unique id
    }

    const clientData = {
      id: clientId,
      name,
      age,
      gender,
      email,
      phone,
      goal,
      startDate,
      trainingHistory
    };

    // If editing, update existing client; otherwise, add new one
    const existingIndex = clients.findIndex((c) => c.id === clientId);
    if (existingIndex !== -1) {
      clients[existingIndex] = clientData;
    } else {
      clients.push(clientData);
    }

    saveClientsToStorage(clients);

    // Clear edit id and redirect back to client list
    localStorage.removeItem(EDIT_ID_KEY);
    window.location.href = "clients.html";
  });
});
