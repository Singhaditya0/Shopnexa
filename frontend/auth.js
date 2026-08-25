// auth.js — har page pe include karo, login/register/logout ka common logic
const AUTH_API = "https://shopnexa-khaki.vercel.app/api/auth";

// window. lagane se ye functions globally available ho jayenge
window.getToken = function() {
  return localStorage.getItem("sc_token");
};

window.getUser = function() {
  try { return JSON.parse(localStorage.getItem("sc_user") || "null"); }
  catch { return null; }
};

window.saveAuth = function(token, user) {
  localStorage.setItem("sc_token", token);
  localStorage.setItem("sc_user", JSON.stringify(user));
};

window.logout = function() {
  localStorage.removeItem("sc_token");
  localStorage.removeItem("sc_user");
  window.location.href = "index.html";
};

window.registerUser = async function(name, email, password) {
  const res = await fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

window.loginUser = async function(email, password) {
  const res = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

window.authHeader = function() {
  const token = window.getToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

// Nav mein Login button ya "Hi, Naam" dikhana
function renderAuthNav() {
  const slot = document.getElementById("authSlot");
  if (!slot) return;

  const user = window.getUser();
  if (user) {
    slot.innerHTML = `
      <span style="font-size:12.5px;color:var(--text-muted);margin-right:2px;">Hi, ${user.name.split(" ")[0]}</span>
      <button class="icon-btn" id="logoutBtn" title="Logout">⎋</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", window.logout);
  } else {
    slot.innerHTML = `<a href="login.html" class="btn btn-ghost" style="padding:8px 14px;font-size:12.5px;">Login</a>`;
  }
}

// Ye event listener internal hai, isko global karne ki zaroorat nahi
document.addEventListener("DOMContentLoaded", renderAuthNav);