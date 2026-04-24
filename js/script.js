/* ==========================================
   INTERNSHIP SEARCH APP - NAVIGATION & UI
   ========================================== */

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-message">${message}</span><button class="toast-close" onclick="this.parentElement.remove()">×</button>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

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
            showToast("You are logged in as a Student. Please use a Company account to post internships.", 'warning');
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

    // Build nav item AFTER data loads, then append — prevents empty flash
    getUserData(session.userId).then(userData => {
      // Remove any stale menu that crept in during the async wait
      navMenu.querySelectorAll('.user-menu').forEach(m => m.remove());

      const displayName = userData.name || session.login;
      const avatarInitials = displayName.charAt(0).toUpperCase();
      const isCompany = session.role === 2;
      const fallbackIcon = isCompany ? '🏢' : avatarInitials;
      const isAdmin = session.role === 0;
      const adminLink = isAdmin ? `<li><a href="admin.html">🛡 Admin Panel</a></li>` : '';
      const profileLabel = isAdmin ? 'My Account' : 'Profile';

      const userLi = document.createElement('li');
      userLi.className = 'nav-item user-menu';
      userLi.innerHTML = `
        <div class="user-avatar" onclick="toggleUserDropdown(event)" title="${displayName}">
          ${userData.avatar_url ?
            `<img src="${userData.avatar_url}" alt="${isCompany ? 'Company Logo' : 'Profile'}">` :
            fallbackIcon
          }
        </div>
        <ul class="user-dropdown" id="userDropdown">
          ${adminLink}
          <li><a href="${getProfileUrl(session.role)}">${profileLabel}</a></li>
          <li><a href="#" onclick="logout(event)">Logout</a></li>
        </ul>
      `;
      navMenu.appendChild(userLi);
    }).catch(err => {
      // Even if getUserData fails, show a minimal nav with initials
      console.warn('getUserData error, using fallback nav:', err);
      navMenu.querySelectorAll('.user-menu').forEach(m => m.remove());
      const isAdmin = session.role === 0;
      const adminLink = isAdmin ? `<li><a href="admin.html">🛡 Admin Panel</a></li>` : '';
      const profileLabel = isAdmin ? 'My Account' : 'Profile';
      const userLi = document.createElement('li');
      userLi.className = 'nav-item user-menu';
      userLi.innerHTML = `
        <div class="user-avatar" onclick="toggleUserDropdown(event)">
          ${session.login ? session.login.charAt(0).toUpperCase() : '?'}
        </div>
        <ul class="user-dropdown" id="userDropdown">
          ${adminLink}
          <li><a href="${getProfileUrl(session.role)}">${profileLabel}</a></li>
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
  // Detect if we're in footer_info subfolder
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const isFooterPage = pathSegments.includes('footer_info');
  
  if (role === 0) return isFooterPage ? '../admin.html' : 'admin.html';
  if (role === 2) return isFooterPage ? '../company-profile.html' : 'company-profile.html';
  return isFooterPage ? '../student-profile.html' : 'student-profile.html';
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
    
    if (session.role === 0) {
      // Admin: use login email directly
      return { name: session.login || 'Admin', avatar_url: null };
    } else if (session.role === 2) {
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

// Format date to European format DD.MM.YYYY
function formatDateEuropean(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Search/Filter functionality - now handled by attachFilterListeners on internships page

function filterJobs() {
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  const locationText = document.getElementById('filterLocation').value.toLowerCase();
  const categoryId = document.getElementById('filterCategory').value;
  const favoritesFilter = document.getElementById('favoritesFilter')?.value || 'all';
  const dateStartLimit = document.getElementById('filterDateStart').value;
  const dateEndLimit = document.getElementById('filterDateEnd').value;

  const jobCards = document.querySelectorAll('.job-card');
  let visibleCount = 0;

  jobCards.forEach(card => {
    const title = card.querySelector('.job-title').textContent.toLowerCase();
    const company = card.querySelector('.job-company').textContent.toLowerCase();
    const location = card.querySelector('.badge-primary').textContent.toLowerCase();
    const cardCategoryId = card.getAttribute('data-category-id');
    const jobId = card.getAttribute('data-job-id');
    const jobStart = card.getAttribute('data-start');
    const jobEnd = card.getAttribute('data-end');

    const matchesSearch = !searchText || title.includes(searchText) || company.includes(searchText);
    const matchesLocation = !locationText || location.includes(locationText);
    const matchesCategory = !categoryId || cardCategoryId === categoryId;
    const matchesStart = !dateStartLimit || (jobStart && jobStart >= dateStartLimit);
    const matchesEnd = !dateEndLimit || (jobEnd && jobEnd <= dateEndLimit);

    const favoritesOnly = document.getElementById('favoritesOnly')?.checked || false;

    if (favoritesOnly) {
      matchesFavorites = getFavorites().includes(jobId);
    } else {
      matchesFavorites = true;
    }

    if (matchesSearch && matchesLocation && matchesCategory && matchesStart && matchesEnd && matchesFavorites) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

// ==========================================
// LOAD CATEGORIES FOR FILTER
// ==========================================
async function loadCategoriesForFilter() {
  const filterCategory = document.getElementById('filterCategory');
  if (!filterCategory) return;

  try {
    // Joining with job_groups to show group context
    const { data: categories, error } = await supabaseClient
      .from('job_categories')
      .select(`
        category_id, 
        title, 
        job_groups (title)
      `)
      .order('title');

    if (error) throw error;

    filterCategory.innerHTML = '<option value="">All Categories</option>';

    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.category_id; // Using ID for strictly accurate filtering
      const groupTitle = cat.job_groups ? `${cat.job_groups.title}: ` : '';
      option.textContent = `${groupTitle}${cat.title}`;
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

    // Fetch all active positions with application count
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
        category_id,
        created_at,
        applications(count)
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

    // Generate job cards with data-created-at
    jobsList.innerHTML = positions.map((pos, index) => {
      const company = companyMap[pos.company_id] || {};
      const companyName = company.company_name || 'Unknown Company';
      const location = company.city || 'Remote';
      const category = categoryMap[pos.category_id] || 'General';

      // Format period for display
      let periodText = 'Flexible';
      if (pos.period_start && pos.period_end) {
        const start = formatDateEuropean(pos.period_start);
        const end = formatDateEuropean(pos.period_end);
        periodText = `${start} - ${end}`;
      } else if (pos.is_open_ended) {
        periodText = 'Open-ended';
      }

      return `
        <div class="job-card" 
             data-job-id="${pos.position_id}" 
             data-category-id="${pos.category_id}" 
             data-start="${pos.period_start || ''}" 
             data-end="${pos.period_end || ''}"
             data-created-at="${pos.created_at}">
             
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
            <span style="font-size:0.8rem; color:var(--text-light);">
              👥 ${pos.applications?.[0]?.count ?? 0} applied
            </span>
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

// --- IMPROVED FAVORITE SYSTEM ---

function getFavorites() {
  const raw = localStorage.getItem('favorites');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(item => item?.toString?.() ?? '') : [];
  } catch (err) {
    console.warn('Clearing invalid favorites data from localStorage:', err);
    localStorage.removeItem('favorites');
    return [];
  }
}

function saveFavorites(favorites) {
  if (!Array.isArray(favorites)) {
    favorites = [];
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(jobId, btn) {
  if (!jobId) return;
  const favorites = getFavorites();
  const jobIdStr = jobId.toString();
  const index = favorites.indexOf(jobIdStr);
  
  if (index > -1) {
      favorites.splice(index, 1);
      btn.innerHTML = '🤍';
  } else {
      favorites.push(jobIdStr);
      btn.innerHTML = '❤️';
  }
  
  saveFavorites(favorites);
  
  // If we are on the search page, refresh the list
  if (typeof filterJobs === 'function') {
      filterJobs();
  }
}

function updateFavoriteStates() {  
  const favorites = getFavorites();  
  
  document.querySelectorAll('.favorite-btn').forEach(btn => {    
      // 1. Try to get ID from a parent container (like the job-card or favBtnContainer)
      const jobContainer = btn.closest('[data-job-id]'); 
      // 2. Or check if we are on the detail page and it's stored in the window
      const jobId = jobContainer ? jobContainer.getAttribute('data-job-id') : window.currentPosition?.position_id;    

      if (jobId && favorites.includes(jobId.toString())) {      
          btn.innerHTML = '❤️';    
      } else {
          btn.innerHTML = '🤍';
      }
  });
}

// Make sure these are globally accessible
window.getFavorites = getFavorites;
window.toggleFavorite = toggleFavorite;
window.updateFavoriteStates = updateFavoriteStates;

// Real Favorites Toggle
  const favoriteButtons = document.querySelectorAll('.job-card .favorite-btn');
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const jobId = this.closest('.job-card').getAttribute('data-job-id');
      toggleFavorite(jobId, this);
    });
  });

  updateFavoriteStates();
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
    // Hide CTA for logged-in users
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.style.display = 'none';
    }
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

    /* ── Hide CTA when logged in ── */
    document.addEventListener('DOMContentLoaded', function () {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId');
      if (loggedIn) {
        const cta = document.getElementById('cta-section');
        if (cta) cta.style.display = 'none';
      }
    });

    /* ── Hero parallax on scroll ── */
    const heroEl      = document.getElementById('heroSection');
    const heroWaves   = document.getElementById('heroWaves');
    const heroContent = document.getElementById('heroContent');
    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const sy = window.scrollY;
          // Waves lift up faster than scroll — gives floating depth
          if (heroWaves)   heroWaves.style.transform   = `translateY(${sy * 0.4}px)`;
          // Content rises slightly — classic parallax
          if (heroContent) heroContent.style.transform = `translateY(${sy * 0.18}px)`;
          // Shift background gradient position for depth on hero bg
          if (heroEl)      heroEl.style.backgroundPositionY = `${sy * 0.35}px`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* ── Carousel ── */
    let currentSlide = 0;
    const totalSlides = 3;
    let autoplayTimer;

    function goToSlide(index) {
      const slides = document.querySelectorAll('.carousel-slide');
      const dots   = document.querySelectorAll('.carousel-dot');
      if (!slides.length) return;
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (index + totalSlides) % totalSlides;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    function nextSlide() { goToSlide(currentSlide + 1); resetAutoplay(); }
    function prevSlide() { goToSlide(currentSlide - 1); resetAutoplay(); }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
    }

    document.addEventListener('DOMContentLoaded', function () {
      resetAutoplay();
      const track = document.getElementById('carouselTrack');
      if (track) {
        let startX = 0;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend',   e => {
          const diff = startX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
        }, { passive: true });

      }
    });

function showConfirm(message, confirmText = 'Confirm', cancelText = 'Cancel') {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';

    overlay.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:2rem;max-width:400px;width:90%;box-shadow:0 10px 30px rgba(0,0,0,0.2);">
        <p style="margin:0 0 1.5rem;font-size:1rem;color:#374151;line-height:1.5;">${message}</p>
        <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <button id="confirmCancel" class="btn btn-secondary" style="padding:0.6rem 1.2rem;">${cancelText}</button>
          <button id="confirmOk" class="btn btn-danger" style="padding:0.6rem 1.2rem;">${confirmText}</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector('#confirmOk').onclick = () => { document.body.removeChild(overlay); resolve(true); };
    overlay.querySelector('#confirmCancel').onclick = () => { document.body.removeChild(overlay); resolve(false); };
    overlay.onclick = e => { if (e.target === overlay) { document.body.removeChild(overlay); resolve(false); } };
  });
}