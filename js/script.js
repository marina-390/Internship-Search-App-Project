/* ==========================================
   INTERNSHIP SEARCH APP - NAVIGATION & UI
   ========================================== */

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}


// Add Logout Button and Hide Login/Register buttons
function addLogoutButton() {
  const navMenu = document.querySelector('.nav-menu');
  const session = isLoggedIn(); 

  if (navMenu) {
    const loginBtn = document.querySelector('a[href="auth.html"], .login-link');
    const registerBtn = document.querySelector('a[href="register.html"], .register-link');

    if (session) {
      
      // Hide Login/Register 
      if (loginBtn) loginBtn.parentElement.style.display = 'none';
      if (registerBtn) registerBtn.parentElement.style.display = 'none';

      // Add Logout button if it's not already there
      const existingLogout = document.querySelector('.logout-link');
      if (!existingLogout) {
        const logoutLi = document.createElement('li');
        logoutLi.className = 'nav-item';
        logoutLi.innerHTML = '<a href="#" class="nav-link logout-link" onclick="logout(event)">Logout</a>';
        navMenu.appendChild(logoutLi);
      }
    } else {
      if (loginBtn) loginBtn.parentElement.style.display = 'block';
      if (registerBtn) registerBtn.parentElement.style.display = 'block';
    }
  }
}
// Set Active Nav Link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Form Validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  let isValid = true;
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  const emailInputs = form.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (input.value && !emailRegex.test(input.value)) {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  const passwordInputs = form.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    if (input.value && input.value.length < 6) {
      input.style.borderColor = '#ef4444';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

// Get URL Parameters
function getUrlParameter(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Search/Filter functionality
const searchInput = document.getElementById('searchInput');
const filterBtn = document.getElementById('filterBtn');

if (searchInput && filterBtn) {
  searchInput.addEventListener('keyup', filterJobs);
  filterBtn.addEventListener('click', filterJobs);
}

function filterJobs() {
  const searchText = searchInput ? searchInput.value.toLowerCase() : '';
  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach(card => {
    const title = card.querySelector('.job-title').textContent.toLowerCase();
    const company = card.querySelector('.job-company').textContent.toLowerCase();

    if (title.includes(searchText) || company.includes(searchText)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Job Card Navigation
const jobCards = document.querySelectorAll('.job-card');
jobCards.forEach(card => {
  card.addEventListener('click', function() {
    const jobId = this.getAttribute('data-job-id');
    if (jobId) {
      window.location.href = `internship-detail.html?id=${jobId}`;
    }
  });
});

// Add to Favorites (Demo)
const favoriteButtons = document.querySelectorAll('.job-card .favorite-btn');
favoriteButtons.forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    const jobTitle = this.closest('.job-card').querySelector('.job-title').textContent;
    if (this.classList.contains('active')) {
      alert(`Added "${jobTitle}" to favorites!`);
    } else {
      alert(`Removed "${jobTitle}" from favorites!`);
    }
  });
});

// Clear form errors on input
document.addEventListener('input', function(e) {
  if (e.target.matches('input, textarea, select')) {
    if (e.target.value.trim() !== '') {
      e.target.style.borderColor = '';
    }
  }
});

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  setActiveNavLink();

  // Show logout button on all pages if logged in
  if (isLoggedIn()) {
    addLogoutButton();
  }

  // Load student profile if on that page
  if (window.location.pathname.includes('student-profile.html')) {
    loadStudentProfile();
  }
});
