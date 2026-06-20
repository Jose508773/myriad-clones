// ---- Grab all elements from the HTML by their id ----

// Local Users elements
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const btnSendUsers = document.getElementById('sendUsers');
const userIdInput = document.getElementById('userIdInput');
const userAgeInput = document.getElementById('userAgeInput');
const btnSendSpecialIdUsers = document.getElementById('sendSpecialIdUsers');
const searchIdInput = document.getElementById('searchIdInput');
const btnSearchById = document.getElementById('btnSearchById');

// Workers elements
const btnGetWorkers = document.getElementById('btnGetWorkers');
const workerName = document.getElementById('workerName');
const workerAge = document.getElementById('workerAge');
const workerSalary = document.getElementById('workerSalary');
const workerPosition = document.getElementById('workerPosition');
const btnAddWorker = document.getElementById('btnAddWorker');

const workerId = document.getElementById('workerId');
const editWorkerName = document.getElementById('editWorkerName');
const editWorkerAge = document.getElementById('editWorkerAge');
const editWorkerSalary = document.getElementById('editWorkerSalary');
const editWorkerPosition = document.getElementById('editWorkerPosition');

const btnGetWorker = document.getElementById('btnGetWorker');
const btnUpdateWorker = document.getElementById('btnUpdateWorker');
const btnDeleteWorker = document.getElementById('btnDeleteWorker');

// Shared elements
const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');

// ---- Config ----
// Dynamically determine protocol and host so it works both locally (e.g. http://localhost:8000) and deployed on Vercel
const apiBase = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? `${window.location.protocol}//${window.location.host}`
  : "https://myriad-clones.vercel.app";

const usedIds = []; // keeps track of all random IDs we've generated

// ---- Helper: shows the result on screen ----
function showResult(response, data) {
  statusEl.innerText = `HTTP ${response.status}`;
  statusEl.className = response.ok ? 'status-badge success' : 'status-badge error';
  outputEl.innerText = JSON.stringify(data, null, 2);
}

function showError(error) {
  statusEl.innerText = 'Error';
  statusEl.className = 'status-badge error';
  outputEl.innerText = `// Connection failed:\n${error.message}`;
}

function showLoading(msg) {
  statusEl.innerText = 'Loading...';
  statusEl.className = 'status-badge loading';
  outputEl.innerText = `// ${msg}`;
}

// ---- 1) GET request — fetch data from the backend ----
async function queryApi(endpoint) {
  showLoading('Fetching data...');
  try {
    const response = await fetch(`${apiBase}${endpoint}`);
    const data = await response.json();
    showResult(response, data);
  } catch (error) {
    showError(error);
  }
}

// ---- 2) POST — add a simple user (name + age) ----
async function sendUsers() {
  showLoading('Sending user data...');
  try {
    const response = await fetch(`${apiBase}/addUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value,
        age: parseInt(ageInput.value) || 0
      })
    });
    const data = await response.json();
    showResult(response, data);
  } catch (error) {
    showError(error);
  }
}

// ---- 3) POST — add a user with a random ID (1–1000) ----
async function specialId() {
  const name = userIdInput.value;
  const age = userAgeInput.value;

  // make a random id and save it so we know it was used
  const randomId = Math.floor(Math.random() * 1000) + 1;
  usedIds.push(randomId);

  showLoading('Sending special user data...');
  try {
    const response = await fetch(`${apiBase}/randomUserId`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        age: parseInt(age) || 0,
        id: randomId
      })
    });
    const data = await response.json();
    showResult(response, data);

    // tell the user what their id is
    if (response.ok) {
      alert(`Your User ID is: ${randomId}`);
    }
  } catch (error) {
    showError(error);
  }
}

// ---- 4) GET — search for a user by their ID ----
async function searchById() {
  const id = searchIdInput.value;
  if (!id) {
    outputEl.innerText = '// Please enter a User ID.';
    return;
  }
  await queryApi(`/users/${id}`);
}

// ─────────────────────────────────────────────
// Workers Handlers (Supabase DB)
// ─────────────────────────────────────────────

// Add a Worker
async function addWorker() {
  showLoading('Creating worker in Supabase...');
  try {
    const response = await fetch(`${apiBase}/workers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: workerName.value,
        age: parseInt(workerAge.value) || 0,
        salary: parseFloat(workerSalary.value) || 0.0,
        position: workerPosition.value
      })
    });
    const data = await response.json();
    showResult(response, data);
  } catch (error) {
    showError(error);
  }
}

// Get Worker by ID
async function getWorkerById() {
  const id = workerId.value;
  if (!id) {
    outputEl.innerText = '// Please enter a Worker UUID.';
    return;
  }
  await queryApi(`/workers/${id}`);
}

// Update Worker by ID
async function updateWorkerById() {
  const id = workerId.value;
  if (!id) {
    outputEl.innerText = '// Please enter a Worker UUID.';
    return;
  }
  showLoading(`Updating worker ${id} in Supabase...`);
  try {
    const response = await fetch(`${apiBase}/workers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editWorkerName.value,
        age: parseInt(editWorkerAge.value) || 0,
        salary: parseFloat(editWorkerSalary.value) || 0.0,
        position: editWorkerPosition.value
      })
    });
    const data = await response.json();
    showResult(response, data);
  } catch (error) {
    showError(error);
  }
}

// Delete Worker by ID
async function deleteWorkerById() {
  const id = workerId.value;
  if (!id) {
    outputEl.innerText = '// Please enter a Worker UUID.';
    return;
  }
  showLoading(`Deleting worker ${id} from Supabase...`);
  try {
    const response = await fetch(`${apiBase}/workers/${id}`, {
      method: "DELETE"
    });
    const data = await response.json();
    showResult(response, data);
  } catch (error) {
    showError(error);
  }
}

// ---- Wire up all the buttons ----
btnSendUsers.addEventListener('click', sendUsers);
btnSendSpecialIdUsers.addEventListener('click', specialId);
btnSearchById.addEventListener('click', searchById);

// Workers event listeners
btnGetWorkers.addEventListener('click', () => queryApi('/workers'));
btnAddWorker.addEventListener('click', addWorker);
btnGetWorker.addEventListener('click', getWorkerById);
btnUpdateWorker.addEventListener('click', updateWorkerById);
btnDeleteWorker.addEventListener('click', deleteWorkerById);
