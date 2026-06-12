// DOM Elements
const btnUsers = document.getElementById('users');
const btnUser1 = document.getElementById('user1');
const btnUser2 = document.getElementById('user2');
const btnUser3 = document.getElementById('user3');
const statusEl = document.getElementById('status');
const outputEl = document.getElementById('output');

const url = "myriad-clones.vercel.app"

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

// Event Listeners for Buttons
btnUsers.addEventListener('click', () => queryApi('/users'));
btnUser1.addEventListener('click', () => queryApi('/users/1'));
btnUser2.addEventListener('click', () => queryApi('/users/2'));
btnUser3.addEventListener('click', () => queryApi('/users/3'));
