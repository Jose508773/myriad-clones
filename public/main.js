// DOM Elements
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
const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');

const url = "myriad-clones.vercel.app"
const usersid = [];

// Helper to query the backend API endpoints
async function queryApi(endpoint) {
  statusEl.innerText = 'Loading...';
  statusEl.className = 'status-badge loading';
  outputEl.innerText = '// Fetching data...';

  try {
    const response = await fetch(`https://${url}${endpoint}`);
    const data = await response.json();

    statusEl.innerText = `HTTP ${response.status}`;
    if (response.ok) {
      statusEl.className = 'status-badge success';
    } else {
      statusEl.className = 'status-badge error';
    }

    outputEl.innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    statusEl.innerText = 'Error';
    statusEl.className = 'status-badge error';
    outputEl.innerText = `// Connection failed:\n${error.message}`;
  }
}

async function sendUsers() {
  const name = nameInput.value;
  const age = ageInput.value;

  statusEl.innerText = 'Loading...';
  statusEl.className = 'status-badge loading';
  outputEl.innerText = '// Sending user data...';

  try {
    const response = await fetch(`https://${url}/addUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        age: parseInt(age, 10) || 0
      })
    });

    const data = await response.json();

    statusEl.innerText = `HTTP ${response.status}`;
    if (response.ok) {
      statusEl.className = 'status-badge success';
    } else {
      statusEl.className = 'status-badge error';
    }

    outputEl.innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    statusEl.innerText = 'Error';
    statusEl.className = 'status-badge error';
    outputEl.innerText = `// Connection failed:\n${error.message}`;
  }
}

async function specialId() {
  const name = userIdInput.value;
  const age = userAgeInput.value;

  if (!name || !age) {
    statusEl.innerText = 'Validation Error';
    statusEl.className = 'status-badge error';
    outputEl.innerText = '// Please provide both name and age.';
    return;
  }

  if (usersid.length >= 1000) {
    statusEl.innerText = 'Validation Error';
    statusEl.className = 'status-badge error';
    outputEl.innerText = '// All IDs from 1 to 1000 have been used.';
    return;
  }

  let randomId;
  do {
    randomId = Math.floor(Math.random() * 1000) + 1;
  } while (usersid.includes(randomId));

  usersid.push(randomId);

  try {
    statusEl.innerText = 'Loading...';
    statusEl.className = 'status-badge loading';
    outputEl.innerText = '// Sending special user data...';

    let response = await fetch(`https://${url}/randomUserId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        age: parseInt(age, 10) || 0,
        id: randomId
      })
    });
    const data = await response.json();

    statusEl.innerText = `HTTP ${response.status}`;
    if (response.ok) {
      statusEl.className = 'status-badge success';
    } else {
      statusEl.className = 'status-badge error';
    }
    outputEl.innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    statusEl.innerText = 'Error';
    statusEl.className = 'status-badge error';
    outputEl.innerText = `// Connection failed:\n${error.message}`;
  }
}

// Event Listeners for Buttons
btnUsers.addEventListener('click', () => queryApi('/users'));
btnUser1.addEventListener('click', () => queryApi('/users/1'));
btnUser2.addEventListener('click', () => queryApi('/users/2'));
btnUser3.addEventListener('click', () => queryApi('/users/3'));
btnSendUsers.addEventListener('click', sendUsers);
btnSendSpecialIdUsers.addEventListener('click', specialId);
