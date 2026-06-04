// DOM Elements
const usersListEl = document.getElementById('users-list');
const refreshUsersBtn = document.getElementById('refresh-users-btn');
const inspectForm = document.getElementById('inspect-form');
const userIdInput = document.getElementById('user-id-input');
const responseStatusBadge = document.getElementById('response-status-badge');
const responseLatencyEl = document.getElementById('response-latency');
const responseOutputEl = document.getElementById('response-output');
const consoleLogsEl = document.getElementById('console-logs');
const clearLogsBtn = document.getElementById('clear-logs-btn');

// State
let usersData = [];

// Helper: Get timestamp for console logs
function getTimestamp() {
  const now = new Date();
  return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
}

// Log message to virtual console
function logToConsole(message, type = 'system') {
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.innerText = `[${getTimestamp()}] ${message}`;
  consoleLogsEl.appendChild(line);
  consoleLogsEl.scrollTop = consoleLogsEl.scrollHeight;
}

// Format JSON with indentation
function formatJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

// Fetch directory from /users
async function fetchUsers() {
  const startTime = performance.now();
  logToConsole('GET /users - Initiating request...', 'request');
  
  usersListEl.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <span>Fetching users...</span>
    </div>
  `;

  try {
    const response = await fetch('/users');
    const latency = Math.round(performance.now() - startTime);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    usersData = data.users || [];
    
    logToConsole(`GET /users - Completed in ${latency}ms (Status: ${response.status})`, 'response-ok');
    renderUsersList(usersData);
  } catch (error) {
    logToConsole(`GET /users - Failed: ${error.message}`, 'response-fail');
    usersListEl.innerHTML = `
      <div class="loading-state" style="color: var(--error);">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 0.5rem;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>Error fetching users list</span>
      </div>
    `;
  }
}

// Render users into the DOM list
function renderUsersList(users) {
  if (users.length === 0) {
    usersListEl.innerHTML = '<p class="description" style="text-align: center; margin: 2rem 0;">No users found</p>';
    return;
  }

  usersListEl.innerHTML = '';
  users.forEach((name, index) => {
    const id = index + 1; // map names to simple ids: Alice=1, Bob=2, etc.
    const userItem = document.createElement('div');
    userItem.className = 'user-item fade-in';
    userItem.style.animationDelay = `${index * 0.05}s`;
    userItem.innerHTML = `
      <div class="user-info">
        <div class="user-avatar">${name.charAt(0)}</div>
        <span class="user-name">${name}</span>
      </div>
      <div class="arrow-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    `;
    
    // Clicking a user selects them and triggers the detail inspection
    userItem.addEventListener('click', () => {
      userIdInput.value = id;
      fetchUserDetails(id);
    });
    
    usersListEl.appendChild(userItem);
  });
}

// Fetch single user details
async function fetchUserDetails(id) {
  const startTime = performance.now();
  logToConsole(`GET /users/${id} - Initiating request...`, 'request');
  
  responseStatusBadge.innerText = 'Fetching...';
  responseStatusBadge.className = 'response-status';
  responseLatencyEl.innerText = '- ms';
  responseOutputEl.innerText = '// Fetching data from API...';

  try {
    const response = await fetch(`/users/${id}`);
    const latency = Math.round(performance.now() - startTime);
    
    responseLatencyEl.innerText = `${latency} ms`;
    
    const data = await response.json();
    
    if (response.ok) {
      responseStatusBadge.innerText = `HTTP ${response.status} OK`;
      responseStatusBadge.className = 'response-status success';
      responseOutputEl.innerText = formatJSON(data);
      logToConsole(`GET /users/${id} - Completed in ${latency}ms (Status: ${response.status})`, 'response-ok');
    } else {
      responseStatusBadge.innerText = `HTTP ${response.status}`;
      responseStatusBadge.className = 'response-status error';
      responseOutputEl.innerText = formatJSON(data);
      logToConsole(`GET /users/${id} - Server returned status ${response.status}`, 'response-fail');
    }
  } catch (error) {
    const latency = Math.round(performance.now() - startTime);
    responseStatusBadge.innerText = 'Failed';
    responseStatusBadge.className = 'response-status error';
    responseLatencyEl.innerText = `${latency} ms`;
    responseOutputEl.innerText = `// Connection error:\n${error.message}`;
    logToConsole(`GET /users/${id} - Request failed: ${error.message}`, 'response-fail');
  }
}

// Event Listeners
refreshUsersBtn.addEventListener('click', fetchUsers);

inspectForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = parseInt(userIdInput.value, 10);
  if (!isNaN(id)) {
    fetchUserDetails(id);
  }
});

clearLogsBtn.addEventListener('click', () => {
  consoleLogsEl.innerHTML = '';
  logToConsole('Console cleared.', 'system');
});

// Initial Setup on Page Load
document.addEventListener('DOMContentLoaded', () => {
  logToConsole('Application dashboard loaded. Reading API endpoints.', 'system');
  fetchUsers();
});
