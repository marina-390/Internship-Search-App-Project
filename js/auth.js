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

function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const formTabs = document.querySelectorAll('.form-tab');

    if (tab === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        
        formTabs[0].classList.add('active');
        formTabs[1].classList.remove('active');
    } else {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        
        formTabs[0].classList.remove('active');
        formTabs[1].classList.add('active');
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

window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'register') {
        switchTab('register');
    } else {
        switchTab('login'); 
    }
});
