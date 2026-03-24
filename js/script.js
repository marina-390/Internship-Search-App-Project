/* ==========================================
   INTERNSHIP SEARCH APP - JAVASCRIPT
   ========================================== */

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
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

// Call on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

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

  // Email validation
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

  // Password validation (min 6 characters)
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
// AUTH HELPERS (work with Supabase data)
// ==========================================

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

// Load student profile from Supabase
async function loadStudentProfile() {
  const session = requireAuth();
  if (!session) return;

  try {
    const { data: profile, error } = await supabaseClient
      .from('student_profiles')
      .select('*')
      .eq('user_id', session.userId)
      .single();

    if (error || !profile) {
      console.error('Error loading profile:', error);
      return;
    }

    // Update profile header
    const profileName = document.querySelector('.profile-info h2');
    const profileEmail = document.querySelectorAll('.profile-info p')[0];
    const profileUniversity = document.querySelectorAll('.profile-info p')[1];
    const profileLocation = document.querySelectorAll('.profile-info p')[2];

    if (profileName) profileName.textContent = (profile.first_name || '') + ' ' + (profile.last_name || '');
    if (profileEmail) profileEmail.textContent = session.login;
    if (profileUniversity) profileUniversity.innerHTML = profile.type_education || '';
    if (profileLocation) profileLocation.innerHTML = profile.city || '';

    // Update About Section
    const aboutDisplay = document.getElementById('aboutDisplay');
    if (aboutDisplay) aboutDisplay.textContent = profile.about || '';

    // Add Logout button
    addLogoutButton();
  } catch (err) {
    console.error('Error loading profile:', err);
  }
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

// Download CV
async function downloadCV() {
  const session = requireAuth();
  if (!session) return;

  try {
    const { data: profile } = await supabaseClient
      .from('student_profiles')
      .select('*')
      .eq('user_id', session.userId)
      .single();

    if (!profile) return;

    const fullName = (profile.first_name || '') + ' ' + (profile.last_name || '');

    const cvContent = `
═══════════════════════════════════════════════════════════
                      CURRICULUM VITAE
═══════════════════════════════════════════════════════════

NAME: ${fullName}
EMAIL: ${session.login}
LOCATION: ${profile.city || ''}

───────────────────────────────────────────────────────────
EDUCATION
───────────────────────────────────────────────────────────
${profile.type_education || ''}

───────────────────────────────────────────────────────────
ABOUT
───────────────────────────────────────────────────────────
${profile.about || ''}

═══════════════════════════════════════════════════════════
Downloaded on: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvContent));
    element.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_CV.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } catch (err) {
    console.error('Error downloading CV:', err);
  }
}

// Initialize profile page on load
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('student-profile.html')) {
    loadStudentProfile();
  }

  // Show logout button on all pages if logged in
  if (isLoggedIn()) {
    addLogoutButton();
  }

  setActiveNavLink();
});
