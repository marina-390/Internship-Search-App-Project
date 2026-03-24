/* ==========================================
   AUTH HELPERS (work with Supabase data)
   ========================================== */

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId');
}

// Get current user session info from localStorage
function getCurrentSession() {
  if (!isLoggedIn()) return null;
  return {
    userId: parseInt(localStorage.getItem('userId')),
    role: parseInt(localStorage.getItem('userRole')),
    login: localStorage.getItem('userLogin')
  };
}

// Check auth and redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'auth.html';
    return null;
  }
  return getCurrentSession();
}

// Add Logout Button to Navigation
function addLogoutButton() {
  const navMenu = document.querySelector('.nav-menu');
  const existingLogout = document.querySelector('.logout-link');

  if (navMenu && !existingLogout) {
    const logoutLi = document.createElement('li');
    logoutLi.className = 'nav-item';
    logoutLi.innerHTML = '<a href="#" class="nav-link logout-link" onclick="logout(event)">Logout</a>';
    navMenu.appendChild(logoutLi);
  }
}

// Logout
function logout(event) {
  event.preventDefault();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userLogin');
  window.location.href = 'index.html';
}
