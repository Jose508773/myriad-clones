// ---- Grab all elements from the HTML by their id ----
const btnUsers = document.getElementById('users');
const btnUser1 = document.getElementById('user1');
const btnUser2 = document.getElementById('user2');
const btnUser3 = document.getElementById('user3');
const nameInput = document.getElementById('nameInput');
const ageInput = document.getElementById('ageInput');
const btnSendUsers = document.getElementById('sendUsers');
const userIdInput = document.getElementById('userIdInput');
const userAgeInput = document.getElementById('userAgeInput');
const btnSendSpecialIdUsers = document.getElementById('sendSpecialIdUsers');
const searchIdInput = document.getElementById('searchIdInput');
const btnSearchById = document.getElementById('btnSearchById');
const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');

// ---- Config ----
const url = "myriad-clones.vercel.app";
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
    const response = await fetch(`https://${url}${endpoint}`);
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
    const response = await fetch(`https://${url}/addUser`, {
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
    const response = await fetch(`https://${url}/randomUserId`, {
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

// ---- Wire up all the buttons ----
btnUsers.addEventListener('click', () => queryApi('/users'));
btnUser1.addEventListener('click', () => queryApi('/users/1'));
btnUser2.addEventListener('click', () => queryApi('/users/2'));
btnUser3.addEventListener('click', () => queryApi('/users/3'));
btnSendUsers.addEventListener('click', sendUsers);
btnSendSpecialIdUsers.addEventListener('click', specialId);
btnSearchById.addEventListener('click', searchById);
