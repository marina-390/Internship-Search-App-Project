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

function checkCompanyAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');

    if (isLoggedIn === 'true') {
        if (userRole === '2') {
            window.location.href = 'company-profile.html';
        } else {
            alert("You are logged in as a Student. Please use a Company account if you want to post internships.");
        }
    } else {
 
        window.location.href = 'auth.html?mode=login';
    }
}
function initUserMenu() {
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;

  const session = getCurrentSession();
  
  const existingMenus = navMenu.querySelectorAll('.user-menu');
  existingMenus.forEach(menu => menu.remove());

  const loginLi = Array.from(navMenu.children).find(li => 
    li.querySelector('a[href="auth.html"], .nav-link[href*="auth.html"]')
  );

  if (session) {
    if (loginLi) loginLi.style.display = 'none';

    const userLi = document.createElement('li');
    userLi.className = 'nav-item user-menu';

    getUserData(session.userId).then(userData => {
      const avatarInitials = userData.name ? 
        userData.name.charAt(0).toUpperCase() : 
        session.login.charAt(0).toUpperCase();
      
      userLi.innerHTML = `
        <div class="user-avatar" onclick="toggleUserDropdown(event)" title="${userData.name || session.login}">
          ${userData.photo_url ? `<img src="${userData.photo_url}" alt="Profile">` : avatarInitials}
        </div>
        <ul class="user-dropdown" id="userDropdown">
          <li><a href="${getProfileUrl(session.role)}">Profile</a></li>
          <li><a href="#" onclick="logout(event)">Logout</a></li>
        </ul>
      `;
      navMenu.appendChild(userLi);
    });
  } else {
    if (loginLi) loginLi.style.display = 'block';

    
    // Remove user menu
    const existingUserMenu = navMenu.querySelector('.user-menu');
    if (existingUserMenu) existingUserMenu.remove();
  }
}

function toggleUserDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById('userDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Close dropdown on outside click
document.addEventListener('click', function(event) {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.querySelector('.user-dropdown');
  if (dropdown && !userMenu.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});

// Get profile URL based on role
function getProfileUrl(role) {
  return role === 2 ? 'company-profile.html' : 'student-profile.html';
}

// Get user data (photo, name) - sync fallback to local
async function getUserData(userId) {
  try {
    if (typeof supabaseClient === 'undefined') throw new Error('No Supabase');
    
    const { data: profile } = await supabaseClient
      .from('student_profiles')
      .select('first_name, last_name, photo_url')
      .eq('user_id', userId)
      .single();

    return {
      name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null : null,
      photo_url: profile?.photo_url || null
    };
  } catch {
    return { name: null, photo_url: null };
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

  if (isLoggedIn()) {
    initUserMenu();
  }

  // Load student profile if on that page
  if (window.location.pathname.includes('student-profile.html')) {
    loadStudentProfile();
  }
});
