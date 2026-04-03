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
      const displayName = userData.name || session.login;
      const avatarInitials = displayName.charAt(0).toUpperCase();
      const isCompany = session.role === 2;
      const fallbackIcon = isCompany ? '🏢' : avatarInitials;
      
      userLi.innerHTML = `
        <div class="user-avatar" style="color:'white'" onclick="toggleUserDropdown(event)" title="${displayName}">
          ${userData.avatar_url ? 
            `<img src="${userData.avatar_url}" alt="${isCompany ? 'Company Logo' : 'Profile'}">` : 
            fallbackIcon
          }
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

// Get user data (photo/logo, name) - supports both students/companies
async function getUserData(userId) {
  const session = getCurrentSession();
  if (!session) return { name: null, avatar_url: null };
  
  try {
    if (typeof supabaseClient === 'undefined') throw new Error('No Supabase');
    
    let profile = null;
    let name = null;
    let avatar_url = null;
    
    if (session.role === 2) {
      // Company: fetch from Companies table
      const { data } = await supabaseClient
        .from('Companies')
        .select('company_name, logo_url')
        .eq('user_id', userId)
        .single();
      profile = data;
      name = profile?.company_name || null;
      avatar_url = profile?.logo_url || null;
    } else {
      // Student: fetch from student_profiles
      const { data } = await supabaseClient
        .from('student_profiles')
        .select('first_name, last_name, photo_url')
        .eq('user_id', userId)
        .single();
      profile = data;
      name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || null : null;
      avatar_url = profile?.photo_url || null;
    }
    
    return { name, avatar_url };
  } catch {
    return { name: null, avatar_url: null };
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

// Search/Filter functionality - now handled by attachFilterListeners on internships page

function filterJobs() {
  const searchText = searchInput ? searchInput.value.toLowerCase() : '';
  const categoryFilter = document.getElementById('filterCategory') ? document.getElementById('filterCategory').value : '';
  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach(card => {
    const title = card.querySelector('.job-title').textContent.toLowerCase();
    const company = card.querySelector('.job-company').textContent.toLowerCase();
    const category = card.querySelector('.badge:last-child').textContent.toLowerCase();

    const matchesSearch = title.includes(searchText) || company.includes(searchText);
    const matchesCategory = !categoryFilter || category.includes(categoryFilter.toLowerCase());

    if (matchesSearch && matchesCategory) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Clear form errors on input
document.addEventListener('input', function(e) {
  if (e.target.matches('input, textarea, select')) {
    if (e.target.value.trim() !== '') {
      e.target.style.borderColor = '';
    }
  }
});

// ==========================================
// LOAD CATEGORIES FOR FILTER
// ==========================================
async function loadCategoriesForFilter() {
  const filterCategory = document.getElementById('filterCategory');
  if (!filterCategory) return;

  try {
    const { data: categories, error } = await supabaseClient
      .from('job_categories')
      .select('category_id, title')
      .order('title');

    if (error) throw error;

    // Clear existing options except "All Categories"
    filterCategory.innerHTML = '<option value="">All Categories</option>';

    // Add category options
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.title;
      option.textContent = cat.title;
      filterCategory.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading categories:', err);
  }
}

// ==========================================
// LOAD INTERNSHIPS
// ==========================================
async function loadInternships() {
  const jobsList = document.getElementById('jobsList');
  const noResults = document.getElementById('noResults');
  if (!jobsList) return;

  try {
    // Load categories for filter
    await loadCategoriesForFilter();

    // Fetch all active positions
    const { data: positions, error } = await supabaseClient
      .from('positions')
      .select(`
        position_id,
        title,
        description,
        requirements,
        period_start,
        period_end,
        is_open_ended,
        status,
        company_id,
        category_id
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase positions query error:', error);
      throw error;
    }

    // Load company and category names for the list (less relational dependency)
    const companyIds = [...new Set((positions || []).map(p => p.company_id).filter(Boolean))];
    let companyMap = {};
    if (companyIds.length > 0) {
      const { data: companies, error: companyError } = await supabaseClient
        .from('Companies')
        .select('company_id, company_name, city')
        .in('company_id', companyIds);

      if (companyError) {
        console.error('Supabase companies query error:', companyError);
        throw companyError;
      }
      companyMap = (companies || []).reduce((acc, comp) => ({ ...acc, [comp.company_id]: comp }), {});
    }

    const categoryIds = [...new Set((positions || []).map(p => p.category_id).filter(Boolean))];
    let categoryMap = {};
    if (categoryIds.length > 0) {
      const { data: categories, error: categoryError } = await supabaseClient
        .from('job_categories')
        .select('category_id, title')
        .in('category_id', categoryIds);

      if (categoryError) {
        console.error('Supabase job_categories query error:', categoryError);
        throw categoryError;
      }
      categoryMap = (categories || []).reduce((acc, cat) => ({ ...acc, [cat.category_id]: cat.title }), {});
    }

    if (!positions || positions.length === 0) {
      jobsList.innerHTML = '';
      if (noResults) noResults.style.display = 'block';
      return;
    }

    // Hide no results message
    if (noResults) noResults.style.display = 'none';

    // Generate job cards
    jobsList.innerHTML = positions.map(pos => {
      const company = companyMap[pos.company_id] || {};
      const companyName = company.company_name || 'Unknown Company';
      const location = company.city || 'Remote';
      const category = categoryMap[pos.category_id] || 'General';

      // Format period
      let periodText = 'Flexible';
      if (pos.period_start && pos.period_end) {
        const start = new Date(pos.period_start).toLocaleDateString();
        const end = new Date(pos.period_end).toLocaleDateString();
        periodText = `${start} - ${end}`;
      } else if (pos.is_open_ended) {
        periodText = 'Open-ended';
      }

      return `
        <div class="job-card" data-job-id="${pos.position_id}">
          <div class="job-meta" style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <h3 class="job-title">${pos.title}</h3>
              <p class="job-company">${companyName}</p>
            </div>
            <button class="favorite-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">🤍</button>
          </div>
          
          <div class="job-meta">
            <span class="badge badge-primary">${location}</span>
            <span class="badge badge-secondary">${periodText}</span>
            <span class="badge">${category}</span>
          </div>

          <p class="job-description">
            ${pos.description ? pos.description.substring(0, 150) + (pos.description.length > 150 ? '...' : '') : 'No description available.'}
          </p>

          <div class="job-footer">
            <a href="internship-detail.html?id=${pos.position_id}" class="btn btn-small btn-primary">View Details</a>
          </div>
        </div>
      `;
    }).join('');

    // Re-attach event listeners for job cards
    attachJobCardListeners();

  } catch (err) {
    console.error('Error loading internships:', err);
    jobsList.innerHTML = '<p class="text-center text-muted">Error loading internships. Please try again later.</p>';
  }
}

// ==========================================
// ATTACH JOB CARD LISTENERS
// ==========================================
function attachJobCardListeners() {
  // Job Card Navigation
  const jobCards = document.querySelectorAll('.job-card');
  jobCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't navigate if clicking favorite button
      if (e.target.classList.contains('favorite-btn')) return;
      
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
}

// ==========================================
// ATTACH FILTER LISTENERS
// ==========================================
function attachFilterListeners() {
  const searchInput = document.getElementById('searchInput');
  const filterBtn = document.getElementById('filterBtn');
  const filterCategory = document.getElementById('filterCategory');

  if (searchInput) {
    searchInput.addEventListener('keyup', filterJobs);
  }
  if (filterBtn) {
    filterBtn.addEventListener('click', filterJobs);
  }
  if (filterCategory) {
    filterCategory.addEventListener('change', filterJobs);
  }
}

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

  // Load internships if on that page
  if (window.location.pathname.includes('internships.html')) {
    loadInternships();
    attachFilterListeners();
  }
});
