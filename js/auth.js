/* ==========================================
   AUTH HELPERS
   ========================================== */

  // Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('userId');
}

// Get current user session info from localStorage
function getCurrentSession() {
  if (!isLoggedIn()) return null;
  return {
    userId: parseInt(localStorage.getItem('userId')),
    role:   parseInt(localStorage.getItem('userRole')),
    login:  localStorage.getItem('userLogin')
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

function logout(event) {
  event.preventDefault();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userLogin');
  window.location.href = 'index.html';
}

function checkCompanyAuth() {
  const session = getCurrentSession();
  if (!session) {
    window.location.href = 'auth.html?mode=login';
  } else if (session.role === 2) {
    window.location.href = 'company-profile.html';
  } else {
    alert('Only employer accounts can post internships.');
  }
}

/* ----------------------------------------------------------
   TAB SWITCHING
   ---------------------------------------------------------- */
function switchTab(tab) {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs         = document.querySelectorAll('.form-tab');

  if (!loginForm || !registerForm) return;

  if (tab === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    if (tabs[0]) tabs[0].classList.add('active');
    if (tabs[1]) tabs[1].classList.remove('active');
  } else {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    if (tabs[0]) tabs[0].classList.remove('active');
    if (tabs[1]) tabs[1].classList.add('active');
  }
}

/* ----------------------------------------------------------
   ROLE FIELD TOGGLE
   Shows student fields (university) OR company fields,
   never both at the same time.
   ---------------------------------------------------------- */
function toggleRoleFields() {
  const roleInput     = document.querySelector('input[name="role"]:checked');
  const studentFields = document.getElementById('studentFields');
  const companyFields = document.getElementById('companyFields');

  if (!roleInput || !studentFields || !companyFields) return;

  if (roleInput.value === 'student') {
    studentFields.style.display = 'block';
    companyFields.style.display = 'none';
  } else {
    studentFields.style.display = 'none';
    companyFields.style.display = 'block';
  }
}

/* ----------------------------------------------------------
   ON PAGE LOAD
   - Switch to correct tab based on URL param
   - Show correct role fields based on selected radio
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  switchTab(params.get('mode') === 'register' ? 'register' : 'login');
  toggleRoleFields(); // ensure correct fields shown on first load
});
