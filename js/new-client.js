const STORAGE_KEY = "fitcrmClients";
const EDIT_ID_KEY = "fitcrmEditClientId";

function loadClients() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveClients(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function showError(id, message) {
  document.querySelector(`[data-error-for="${id}"]`).textContent = message;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("clientForm");

  const id = localStorage.getItem(EDIT_ID_KEY);
  let clients = loadClients();
  let editing = clients.find(c => c.id === id);

  if (editing) {
    document.getElementById("formTitle").textContent = "Edit Client";
    document.getElementById("submitBtn").textContent = "Save Changes";

    fullName.value = editing.name;
    email.value = editing.email;
    phone.value = editing.phone;
    goal.value = editing.goal;
    startDate.value = editing.startDate;
    history.value = editing.trainingHistory;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    document.querySelectorAll("small").forEach(s => s.textContent = "");

    if (!fullName.value.trim()) return showError("fullName", "Required");
    if (!email.value.trim()) return showError("email", "Required");
    if (!phone.value.trim()) return showError("phone", "Required");
    if (!goal.value.trim()) return showError("goal", "Required");
    if (!startDate.value.trim()) return showError("startDate", "Required");

    const data = {
      id: editing ? editing.id : Date.now().toString(),
      name: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      goal: goal.value.trim(),
      startDate: startDate.value,
      trainingHistory: history.value.trim()
    };

    if (editing) {
      const index = clients.findIndex(c => c.id === editing.id);
      clients[index] = data;
    } else {
      clients.push(data);
    }

    saveClients(clients);
    localStorage.removeItem(EDIT_ID_KEY);
    window.location.href = "clients.html";
  });
});
