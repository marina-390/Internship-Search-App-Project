/* ==========================================================
   script.js — Global navigation, UI utilities & internship listing
   Globaali navigaatio, UI-apuvälineet ja harjoittelulistaus
   ========================================================== */

/**
 * EN: Appends a red asterisk (*) to every label that corresponds to a required
 *     input/select/textarea within the given root element.
 *     Called once on DOMContentLoaded so required fields are always visually marked.
 * FI: Lisää punaisen asteriskin (*) jokaiseen pakollista kenttää vastaavaan
 *     label-elementtiin annetussa juuri-elementissä.
 *     Kutsutaan kerran DOMContentLoaded-tapahtumassa, jotta pakolliset kentät
 *     ovat aina visuaalisesti merkittyjä.
 * @param {Document|Element} root - EN: scope to search in / FI: hakualue
 */
function markRequiredFields(root = document) {
  root.querySelectorAll('input[required], select[required], textarea[required]').forEach(input => {
    const label = input.id
      ? root.querySelector(`label[for="${input.id}"]`)
      : input.closest('.form-group, .form-field, div')?.querySelector('label');
    if (label && !label.querySelector('.req-star')) {
      const star = document.createElement('span');
      star.className = 'req-star';
      star.textContent = ' *';
      label.appendChild(star);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => markRequiredFields());

/**
 * EN: Displays a stacking toast notification at the bottom of the viewport.
 *     Creates a shared #toast-container on first use so multiple toasts can
 *     queue without overlapping. Each toast auto-removes after 4 seconds.
 *     Defined in script.js (globally) so every page loaded with this script
 *     can call showToast() without needing its own implementation.
 * FI: Näyttää pinoavan ponnahdusviesti-ilmoituksen näkymän alareunassa.
 *     Luo jaetun #toast-container-elementin ensimmäisellä käytöllä, jotta
 *     useita toasteja voidaan asettaa jonoon ilman päällekkäisyyttä.
 *     Jokainen toast poistuu automaattisesti 4 sekunnin kuluttua.
 *     Määritelty script.js:ssä (globaalisti), joten jokainen tällä skriptillä
 *     ladattu sivu voi kutsua showToast()-funktiota omatta toteutuksetta.
 * @param {string} message - EN: text to display / FI: näytettävä teksti
 * @param {'info'|'success'|'error'|'warning'} type - EN: severity level / FI: vakavuustaso
 */
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

/* ----------------------------------------------------------
   HAMBURGER NAVIGATION — mobile menu open/close
   Hamburger-navigointi — mobiilivalikon avaus/sulkeminen
   ---------------------------------------------------------- */
// EN: Toggle the mobile nav menu when the hamburger icon is clicked.
//     Clicking any nav link also closes the menu so users aren't left with
//     an open overlay after navigating.
// FI: Vaihdetaan mobiilinavigointivalikon tila, kun hamburger-kuvaketta klikataan.
//     Navigointilinkin klikkaus sulkee myös valikon, jotta käyttäjille ei jää
//     avoin peite navigoinnin jälkeen.
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

/**
 * EN: Guards the "Post Internship" button on pages that include script.js
 *     (index, internships list, etc.). Duplicate of the version in auth.js
 *     but reads role as a string from localStorage (auth.js parses to int).
 * FI: Suojaa "Julkaise harjoittelu" -painikkeen sivuilla, jotka lataavat script.js:n.
 *     Sama logiikka kuin auth.js:ssä, mutta lukee roolin merkkijonona localStorage:sta.
 */
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
/**
 * EN: Builds and injects the user-avatar dropdown into the navigation bar.
 *     If no session exists, the plain "Login" link is shown instead.
 *     The user name/avatar are fetched asynchronously to avoid blocking the
 *     initial render; stale menus are cleaned up before and after the fetch
 *     to prevent the "empty flash" of a menu without a name.
 * FI: Rakentaa ja lisää käyttäjän avatar-pudotusvalikon navigointipalkkiin.
 *     Jos istuntoa ei ole, sen sijaan näytetään tavallinen "Kirjaudu"-linkki.
 *     Käyttäjänimi/avatar haetaan asynkronisesti, jotta alkuperäinen renderöinti
 *     ei estyisi; vanhentuneet valikot siivotaan ennen hakua ja sen jälkeen,
 *     jotta vältetään "tyhjä välähdys" ilman nimeä olevasta valikosta.
 */
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

    // EN: Build the nav item only after data resolves, then append it.
    //     This prevents an empty-name flash that would appear if we inserted
    //     the element before the async fetch completed.
    // FI: Rakennetaan nav-elementti vasta datan latauduttua ja lisätään se.
    //     Tämä estää tyhjän nimen välähdyksen, joka ilmenisi, jos elementti
    //     lisättäisiin ennen asynkronisen haun valmistumista.
    // Build nav item AFTER data loads, then append — prevents empty flash
    getUserData(session.userId).then(userData => {
      // Remove any stale menu that crept in during the async wait
      navMenu.querySelectorAll('.user-menu').forEach(m => m.remove());

      const displayName = userData.name || session.login;
      const avatarInitials = displayName.charAt(0).toUpperCase();
      const isCompany = session.role === 2;
      const fallbackIcon = isCompany ? '🏢' : avatarInitials;
      const isAdmin = session.role === 0;
      const tFn = (typeof t === 'function') ? t : (k) => k;
      const adminLink = isAdmin ? `<li><a href="admin.html">🛡 ${tFn('nav.adminPanel')}</a></li>` : '';
      const profileLabel = isAdmin ? 'My Account' : tFn('nav.profile');

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
          <li><a href="#" onclick="logout(event)">${tFn('nav.logout')}</a></li>
        </ul>
      `;
      navMenu.appendChild(userLi);
    }).catch(err => {
      // Even if getUserData fails, show a minimal nav with initials
      console.warn('getUserData error, using fallback nav:', err);
      navMenu.querySelectorAll('.user-menu').forEach(m => m.remove());
      const tFn2 = (typeof t === 'function') ? t : (k) => k;
      const isAdmin = session.role === 0;
      const adminLink = isAdmin ? `<li><a href="admin.html">🛡 ${tFn2('nav.adminPanel')}</a></li>` : '';
      const profileLabel = isAdmin ? 'My Account' : tFn2('nav.profile');
      const userLi = document.createElement('li');
      userLi.className = 'nav-item user-menu';
      userLi.innerHTML = `
        <div class="user-avatar" onclick="toggleUserDropdown(event)">
          ${session.login ? session.login.charAt(0).toUpperCase() : '?'}
        </div>
        <ul class="user-dropdown" id="userDropdown">
          ${adminLink}
          <li><a href="${getProfileUrl(session.role)}">${profileLabel}</a></li>
          <li><a href="#" onclick="logout(event)">${tFn2('nav.logout')}</a></li>
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

/**
 * EN: Toggles the user dropdown menu open/closed. stopPropagation prevents
 *     the global document click listener from immediately closing it.
 * FI: Avaa/sulkee käyttäjän pudotusvalikon. stopPropagation estää globaalin
 *     document-klikkikuuntelijan sulkemasta sitä välittömästi.
 * @param {MouseEvent} event - EN: click event on the avatar / FI: klikkaustapahtuma avatarissa
 */
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

/**
 * EN: Returns the correct profile page URL for the given role, taking into
 *     account whether the current page lives inside the /footer_info/ subfolder
 *     (which requires a "../" prefix to navigate back to the root).
 * FI: Palauttaa oikean profiilisivun URL:n annetulle roolille ottaen huomioon,
 *     onko nykyinen sivu /footer_info/-alikansiossa (joka vaatii "../"-etuliitteen
 *     juureen navigoimiseksi).
 * @param {number} role - EN: user role number / FI: käyttäjän roolinumero
 * @returns {string} EN: relative URL / FI: suhteellinen URL
 */
// Get profile URL based on role
function getProfileUrl(role) {
  // Detect if we're in footer_info subfolder
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const isFooterPage = pathSegments.includes('footer_info');
  
  if (role === 0) return isFooterPage ? '../admin.html' : 'admin.html';
  if (role === 2) return isFooterPage ? '../company-profile.html' : 'company-profile.html';
  return isFooterPage ? '../student-profile.html' : 'student-profile.html';
}

/**
 * EN: Fetches the display name and avatar URL for the current user from
 *     the appropriate Supabase table (student_profiles or Companies).
 *     Admins use their login email as the display name and have no avatar.
 *     Returns safe fallbacks so the UI never breaks on a failed fetch.
 * FI: Hakee nykyisen käyttäjän näyttönimen ja avatar-URL:n sopivasta
 *     Supabase-taulukosta (student_profiles tai Companies).
 *     Ylläpitäjät käyttävät kirjautumissähköpostiaan näyttönimenä eikä heillä ole avataria.
 *     Palauttaa turvalliset varavaihtoehdot, jotta UI ei hajoa epäonnistuneen haun vuoksi.
 * @param {number} userId - EN: app-level user ID / FI: sovellustason käyttäjä-ID
 * @returns {{name: string|null, avatar_url: string|null}}
 */
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
/**
 * EN: Highlights the nav link that matches the current page filename.
 *     Compares the last segment of the pathname to each link's href attribute.
 *     Falls back to 'index.html' for the root path ('/') so the Home link
 *     is always highlighted on the landing page.
 * FI: Korostaa navigointilinkin, joka vastaa nykyisen sivun tiedostonimeä.
 *     Vertaa polun viimeistä osaa kunkin linkin href-attribuuttiin.
 *     Käyttää 'index.html'-oletusta juuripolulle ('/'), jotta Etusivu-linkki
 *     on aina korostettu aloitussivulla.
 */
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

/**
 * EN: Generic client-side form validator. Highlights empty required fields
 *     in red, validates email format, and checks minimum password length.
 *     Returns false to prevent form submission when validation fails.
 * FI: Yleinen asiakaspuolen lomakevalidaattori. Korostaa tyhjät pakolliset
 *     kentät punaisella, validoi sähköpostimuodon ja tarkistaa salasanan
 *     vähimmäispituuden. Palauttaa false estääkseen lomakkeen lähetyksen
 *     validoinnin epäonnistuessa.
 * @param {string} formId - EN: ID of the form element to validate / FI: validoitavan lomake-elementin ID
 * @returns {boolean} EN: true if all checks pass / FI: true jos kaikki tarkistukset läpäistään
 */
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

/**
 * EN: Reads a single query-string parameter by name from the current URL.
 *     Handles URL-encoding and + → space conversion.
 * FI: Lukee yksittäisen kyselymerkkijono-parametrin nimeltä nykyisestä URL:sta.
 *     Käsittelee URL-koodauksen ja + → välilyönti -muunnoksen.
 * @param {string} name - EN: parameter name / FI: parametrin nimi
 * @returns {string} EN: decoded value or empty string / FI: dekoodattu arvo tai tyhjä merkkijono
 */
// Get URL Parameters
function getUrlParameter(name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * EN: Formats an ISO date string into European DD.MM.YYYY format used
 *     throughout the Finnish UI. Returns 'N/A' for falsy input.
 * FI: Muotoilee ISO-päivämäärämerkkijonon eurooppalaiseen DD.MM.YYYY-muotoon,
 *     jota käytetään koko suomalaisessa käyttöliittymässä. Palauttaa 'N/A' tyhjälle syötteelle.
 * @param {string} dateString - EN: ISO date string / FI: ISO-päivämäärämerkkijono
 * @returns {string}
 */
// Format date to European format DD.MM.YYYY
function formatDateEuropean(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/* ----------------------------------------------------------
   FILTERING & SORTING — internships listing page
   Suodatus ja lajittelu — harjoittelusivun listaus
   ---------------------------------------------------------- */

/**
 * EN: Filters the visible job cards based on all active filter inputs simultaneously.
 *     Reads search text, location, category, date range, and favorites-only toggle,
 *     then shows/hides each .job-card accordingly. Displays the #noResults message
 *     when no cards survive the combined filters.
 * FI: Suodattaa näkyvät työkortit kaikkien aktiivisten suodatinsyötteiden perusteella samanaikaisesti.
 *     Lukee hakutekstin, sijainnin, kategorian, päivämäärävälin ja vain-suosikit-valitsimen,
 *     sitten näyttää/piilottaa jokaisen .job-card-elementin vastaavasti.
 *     Näyttää #noResults-viestin, kun yksikään kortti ei läpäise yhdistettyjä suodattimia.
 */
// Search/Filter functionality - now handled by attachFilterListeners on internships page

function filterJobs() {
  const searchText = document.getElementById('searchInput')?.value?.toLowerCase() || '';
  const locationText = document.getElementById('filterLocation')?.value?.toLowerCase() || '';
  const categoryId = document.getElementById('filterCategory')?.value || '';
  const favoritesFilter = document.getElementById('favoritesFilter')?.value || 'all';
  const dateStartLimit = document.getElementById('filterDateStart')?.value || '';
  const dateEndLimit = document.getElementById('filterDateEnd')?.value || '';

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

/**
 * EN: Re-orders job cards in the DOM by their data-created-at attribute.
 *     Uses appendChild to move nodes — this is non-destructive (no innerHTML wipe)
 *     so event listeners attached to the cards are preserved.
 * FI: Järjestää työkortit DOM:ssa uudelleen data-created-at-attribuutin mukaan.
 *     Käyttää appendChild-metodia solmujen siirtämiseen — tämä on ei-tuhoava
 *     (ei innerHTML-tyhjennystä), joten kortteihin liitetyt tapahtumakuuntelijat säilyvät.
 */
// ==========================================
// SORT JOBS
// ==========================================
function sortJobs() {
  const sortOrder = document.getElementById('sortOrder')?.value || 'newest';
  const jobsList = document.getElementById('jobsList');
  if (!jobsList) return;

  const cards = Array.from(jobsList.querySelectorAll('.job-card'));
  cards.sort((a, b) => {
    const dateA = new Date(a.getAttribute('data-created-at') || 0);
    const dateB = new Date(b.getAttribute('data-created-at') || 0);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  cards.forEach(card => jobsList.appendChild(card));
}

/**
 * EN: Fetches all job categories (joined with their parent group title) from
 *     Supabase and populates the #filterCategory select element.
 *     Uses a JOIN so the option labels read "Group: Category" for clarity.
 * FI: Hakee kaikki työkategoriat (yhdistettynä emoryhmän otsikkoon) Supabasesta
 *     ja täyttää #filterCategory-valintaelementin.
 *     Käyttää JOIN-kyselyä, joten vaihtoehtojen nimet ovat "Ryhmä: Kategoria" selkeyden vuoksi.
 */
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

/**
 * EN: Main data-loading function for the internships listing page.
 *     Orchestrates three parallel Supabase queries (positions, companies, categories)
 *     to avoid N+1 queries, builds company/category lookup maps, then renders all
 *     job cards into #jobsList. Also initialises filters and favorites state.
 * FI: Pääasiallinen datan latausfunktio harjoittelusivuston listaussivulle.
 *     Järjestää kolme rinnakkaista Supabase-kyselyä (positiot, yritykset, kategoriat)
 *     N+1-kyselyjen välttämiseksi, rakentaa yritys/kategoria-hakukartat, sitten
 *     renderöi kaikki työkortit #jobsList-elementtiin.
 *     Alustaa myös suodattimet ja suosikkitilan.
 */
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

    // EN: Collect unique company and category IDs from positions so we can
    //     fetch their details in two bulk queries instead of one per position.
    //     Building in-memory maps (companyMap, categoryMap) avoids O(n²) lookups
    //     when rendering each card.
    // FI: Kerätään ainutlaatuiset yritys- ja kategoria-ID:t positioista, jotta
    //     niiden tiedot voidaan hakea kahdella bulk-kyselyllä yhden position kohti sijaan.
    //     Muistinsisäisten karttojen (companyMap, categoryMap) rakentaminen välttää
    //     O(n²)-hakuja jokaista korttia renderöitäessä.
    // Load company and category names for the list (less relational dependency)
    const companyIds = [...new Set((positions || []).map(p => p.company_id).filter(Boolean))];
    let companyMap = {};
    if (companyIds.length > 0) {
      const { data: companies, error: companyError } = await supabaseClient
        .from('Companies')
        .select('company_id, company_name, city, logo_url')
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
      const companyLogo = company.logo_url || null;
      const location = company.city || 'Remote';
      const category = categoryMap[pos.category_id] || 'General';
      const companyInitial = companyName.charAt(0).toUpperCase();

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
             
          <div class="job-card-header">
            <div class="company-logo-wrap">
              ${companyLogo
                ? `<img src="${companyLogo}" alt="${companyName}" class="company-logo-small" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
                : ''}
              <div class="company-logo-placeholder" style="display: ${companyLogo ? 'none' : 'flex'};">${companyInitial}</div>
            </div>
            <div class="job-card-title-wrap">
              <h3 class="job-title">${pos.title}</h3>
              <p class="job-company">${companyName}</p>
            </div>
            <button class="favorite-btn" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; margin-left: auto;">🤍</button>
          </div>
          
          <div class="job-meta">
            <span class="badge badge-primary">${location}</span>
            <span class="badge badge-secondary">${periodText}</span>
            <span class="badge">${category}</span>
          </div>

          <p class="job-description">
            ${pos.description ? pos.description.substring(0, 150) + (pos.description.length > 150 ? '...' : '') : 'No description available.'}
          </p>

              <span class="badge date-published" title="Published on ${formatDateEuropean(pos.created_at)}">Published: ${formatDateEuropean(pos.created_at)}</span>

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
    updateFavoriteStates();
    if (typeof highlightSavedFavorites === 'function') {
      highlightSavedFavorites();
    }

  } catch (err) {
    console.error('Error loading internships:', err);
    jobsList.innerHTML = '<p class="text-center text-muted">Error loading internships. Please try again later.</p>';
  }
}

/**
 * EN: Attaches click listeners to all job cards after they are rendered.
 *     Clicking anywhere on a card navigates to the detail page, EXCEPT when
 *     clicking the heart (.favorite-btn) which only toggles the favorite state.
 *     Must be called after loadInternships() re-renders the card HTML.
 * FI: Liittää klikkikuuntelijat kaikkiin työkortteihin niiden renderöinnin jälkeen.
 *     Kortin mille tahansa kohdalle klikkaaminen navigoi yksityiskohtasivulle,
 *     PAITSI sydän-painikkeelle (.favorite-btn) klikkaaminen, joka vaihtaa vain suosikkitilan.
 *     Täytyy kutsua loadInternships()-funktion jälkeen, joka uudelleen renderöi korttien HTML:n.
 */
// ==========================================
// ATTACH JOB CARD LISTENERS
// ==========================================
function attachJobCardListeners() {
  // Job Card Navigation + Favorites
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

    const favBtn = card.querySelector('.favorite-btn');
    if (favBtn) {
      favBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const jobId = card.getAttribute('data-job-id');
        toggleFavoriteBtn(jobId, this);
      });
    }
  });
}

/**
 * EN: Persists the favorites array to localStorage. Guards against non-array
 *     input to prevent corrupted JSON from breaking getFavorites().
 * FI: Tallentaa suosikki-taulukon localStorageen. Suojaa ei-taulukko-syötteeltä
 *     estääkseen vioittuneen JSON:n rikkimastamasta getFavorites()-funktiota.
 * @param {string[]} favorites - EN: array of position ID strings / FI: positio-ID-merkkijonotaulukko
 */
function saveFavorites(favorites) {
  if (!Array.isArray(favorites)) {
    favorites = [];
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

/**
 * EN: Returns the current favorites list from localStorage as an array of
 *     ID strings. Handles JSON parse errors gracefully by clearing the key
 *     and returning [] so the rest of the UI degrades cleanly.
 *     The authoritative list is in Supabase; this cache makes heart-icon
 *     state available synchronously without an async DB call on every render.
 * FI: Palauttaa nykyisen suosikkilistan localStoragesta ID-merkkijonotaulukkona.
 *     Käsittelee JSON-jäsennysvirheet tyylikkäästi tyhjentämällä avaimen
 *     ja palauttamalla [], jotta muu UI hajoaa siististi.
 *     Auktoritatiivinen lista on Supabasessa; tämä välimuisti tekee sydänkuvakkeen
 *     tilan saataville synkronisesti ilman asynkronista DB-kutsua jokaisella renderöinnillä.
 * @returns {string[]}
 */
// ── FAVORITES (localStorage only — syncs with Supabase via favorites.js) ──
function getFavorites() {
  const raw = localStorage.getItem('favorites');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(item => item?.toString?.() ?? '') : [];
  } catch (err) {
    localStorage.removeItem('favorites');
    return [];
  }
}

/**
 * EN: Synchronises all heart buttons on the page with the current localStorage
 *     favorites list. Works on both the listing page (buttons inside .job-card)
 *     and the detail page (button inside #favBtnContainer via window.currentPosition).
 * FI: Synkronoi kaikki sydänpainikkeet sivulla nykyisen localStorage-suosikkilistan kanssa.
 *     Toimii sekä listaussivulla (painikkeet .job-card-elementin sisällä)
 *     että yksityiskohtasivulla (painike #favBtnContainer-elementin sisällä window.currentPosition-muuttujan kautta).
 */
function updateFavoriteStates() {
  const favorites = getFavorites();
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const jobContainer = btn.closest('[data-job-id]');
    const jobId = jobContainer
      ? jobContainer.getAttribute('data-job-id')
      : window.currentPosition?.position_id;
    if (jobId) {
      btn.innerHTML = favorites.includes(jobId.toString()) ? '❤️' : '🤍';
    }
  });
}

/**
 * EN: Adds or removes a job ID from the localStorage favorites list and
 *     updates the heart icon emoji immediately. Also fires a custom
 *     'favoritesUpdated' window event so other UI components (profile panel,
 *     etc.) can react without polling. Delegates the Supabase write to
 *     syncFavoriteToSupabase() if favorites.js is loaded.
 * FI: Lisää tai poistaa työ-ID:n localStorage-suosikkilistasta ja päivittää
 *     sydänkuvakeemoijin välittömästi. Laukaisee myös mukautetun
 *     'favoritesUpdated'-ikkunatapahtuman, jotta muut UI-komponentit voivat
 *     reagoida ilman kyselyä. Delegoi Supabase-kirjoituksen
 *     syncFavoriteToSupabase()-funktiolle, jos favorites.js on ladattu.
 * @param {string|number} jobId - EN: position ID / FI: position ID
 * @param {HTMLButtonElement} btn - EN: the heart button element / FI: sydänpainikeelemetti
 */
function toggleFavoriteBtn(jobId, btn) {
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
  localStorage.setItem('favorites', JSON.stringify(favorites));

  // EN: Supabase sync is optional — favorites.js may not be loaded on every page.
  //     The localStorage write above is the immediate source of truth for the UI.
  // FI: Supabase-synkronointi on valinnainen — favorites.js ei välttämättä ole ladattu jokaisella sivulla.
  //     Yllä oleva localStorage-kirjoitus on UI:n välitön totuuden lähde.
  // Also sync to Supabase if favorites.js is loaded
  if (typeof syncFavoriteToSupabase === 'function') {
    syncFavoriteToSupabase(jobIdStr, btn.innerHTML === '❤️');
  }

  // Notify any favorites UI listeners in this tab
  if (typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { internshipId: jobIdStr, isFavorite: btn.innerHTML === '❤️' }
    }));
  }

  if (typeof filterJobs === 'function' && document.getElementById('searchInput')) filterJobs();
}

// Wire up favorite buttons on job cards
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.job-card .favorite-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const jobId = this.closest('.job-card').getAttribute('data-job-id');
      toggleFavoriteBtn(jobId, this);
    });
  });
  updateFavoriteStates();
});



// Make sure these are globally accessible
window.getFavorites = getFavorites;
window.toggleFavorite = toggleFavorite;
window.updateFavoriteStates = updateFavoriteStates;

async function toggleFavorite(internshipId, btn) {
  if (!internshipId || !btn) return false;
  toggleFavoriteBtn(internshipId, btn);
  return getFavorites().includes(internshipId.toString());
}

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

async function handleFavClick(btn, id, title, company, location) {
  const internshipId = window.currentPosition?.position_id?.toString() || id;
  if (!internshipId) return;
  const added = await toggleFavorite(internshipId, btn);
  btn.textContent = added ? '❤️' : '🤍';
}

// On page load — highlight already-saved ones
async function highlightSavedFavorites() {
  if (typeof supabaseClient === 'undefined') return;
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;
  const { data } = await supabaseClient.from('favorites').select('internship_id').eq('user_id', user.id);
  if (!data) return;
  const savedIds = new Set(data.map(f => f.internship_id));
  document.querySelectorAll('.favorite-btn[data-job-id]').forEach(btn => {
    if (savedIds.has(btn.dataset.jobId)) btn.textContent = '❤️';
  });
}
document.addEventListener('DOMContentLoaded', highlightSavedFavorites);

/**
 * EN: Wires up all filter controls on the internships listing page.
 *     Keyup on the search field triggers immediate filtering for responsive feel.
 *     Category and date changes also re-filter. Sort order change re-sorts in-place.
 * FI: Yhdistää kaikki suodatinsäätimet harjoittelulistaussivulle.
 *     Keyup-tapahtuma hakukentässä käynnistää välittömän suodatuksen reagoivan tunteen vuoksi.
 *     Kategoria- ja päivämäärämuutokset myös suodattavat uudelleen.
 *     Lajittelujärjestyksen muutos lajittelee paikallaan.
 */
// ==========================================
// ATTACH FILTER LISTENERS
// ==========================================
function attachFilterListeners() {
  const searchInput = document.getElementById('searchInput');
  const filterBtn = document.getElementById('filterBtn');
  const filterCategory = document.getElementById('filterCategory');
  const sortOrder = document.getElementById('sortOrder');

  if (searchInput) {
    searchInput.addEventListener('keyup', filterJobs);
  }
  if (filterBtn) {
    filterBtn.addEventListener('click', filterJobs);
  }
  if (filterCategory) {
    filterCategory.addEventListener('change', filterJobs);
  }
  if (sortOrder) {
    sortOrder.addEventListener('change', function() {
      sortJobs();
    });
  }
}

/* ----------------------------------------------------------
   INITIALIZATION — runs on every page that loads script.js
   Alustus — suoritetaan jokaisella sivulla, joka lataa script.js:n
   ---------------------------------------------------------- */

/**
 * EN: Global DOMContentLoaded handler. Runs on every page that includes
 *     script.js. Sets the active nav link, builds the user menu if logged in,
 *     hides the CTA section for authenticated users, and triggers page-specific
 *     loaders (student profile, internships list) based on the current pathname.
 * FI: Globaali DOMContentLoaded-käsittelijä. Suoritetaan jokaisella sivulla,
 *     joka sisältää script.js:n. Asettaa aktiivisen navigointilinkin, rakentaa
 *     käyttäjävalikon kirjautuneille käyttäjille, piilottaa CTA-osion todennetuille
 *     käyttäjille ja käynnistää sivukohtaiset lataajat (opiskelijan profiili,
 *     harjoittelulistaus) nykyisen polun perusteella.
 */
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

    /* ── Hide CTA when logged in ──
       EN: Second DOMContentLoaded listener — kept separate from the main one
           above because it was added independently for the landing page hero.
       FI: Toinen DOMContentLoaded-kuuntelija — pidetään erillään yllä olevasta
           pääkuuntelijasta, koska se lisättiin erikseen aloitussivun hero-osiolle. ── */
    document.addEventListener('DOMContentLoaded', function () {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId');
      if (loggedIn) {
        const cta = document.getElementById('cta-section');
        if (cta) cta.style.display = 'none';
      }
    });

    /* ── Hero parallax on scroll ──
       EN: Uses requestAnimationFrame + ticking flag to throttle scroll events.
           Without throttling, the transform calculations would fire dozens of times
           per scroll frame, causing noticeable jank on low-end devices.
       FI: Käyttää requestAnimationFrame + ticking-lippua scroll-tapahtumien rajoittamiseen.
           Ilman rajoittamista transform-laskut käynnistyisivät kymmeniä kertoja
           per scroll-ruutu, aiheuttaen havaittavaa nykimistä heikotehoisilla laitteilla. ── */
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

    /* ── Carousel ──
       EN: Simple index-based carousel with autoplay. goToSlide wraps the index
           modulo totalSlides so next/prev always stay in bounds. Touch events
           are used for swipe support on mobile — a 40px threshold prevents
           accidental swipes during normal scrolling.
       FI: Yksinkertainen indeksipohjainen karuselli autosoitolla. goToSlide
           käyttää indeksin modulo-laskua totalSlides:llä, joten seuraava/edellinen
           pysyy aina rajoissa. Kosketustapahtumia käytetään pyyhkäisytukeen
           mobiilissa — 40 px kynnys estää vahingolliset pyyhkäisyt normaalin
           vierittämisen aikana. ── */
    let currentSlide = 0;
    const totalSlides = 3;
    let autoplayTimer;

    function goToSlide(index) {
      const slides = document.querySelectorAll('.carousel-slide');
      const dots   = document.querySelectorAll('.carousel-dot');
      if (!slides.length || !dots.length || !slides[currentSlide] || !dots[currentSlide]) return;
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = (index + totalSlides) % totalSlides;
      if (!slides[currentSlide] || !dots[currentSlide]) return;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    }
    function nextSlide() { goToSlide(currentSlide + 1); resetAutoplay(); }
    function prevSlide() { goToSlide(currentSlide - 1); resetAutoplay(); }
    function resetAutoplay() {
      clearInterval(autoplayTimer);
      const slides = document.querySelectorAll('.carousel-slide');
      if (!slides.length) return;
      autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 4000);
    }

    document.addEventListener('DOMContentLoaded', function () {
      const track = document.getElementById('carouselTrack');
      if (!track) return;
      resetAutoplay();
      let startX = 0;
      track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      track.addEventListener('touchend',   e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? nextSlide() : prevSlide();
      }, { passive: true });
    });

/**
 * EN: Programmatic confirmation dialog that returns a Promise<boolean>.
 *     Replaces the native window.confirm() which is blocked in some browsers
 *     and cannot be styled. The overlay is removed from the DOM on any close
 *     action (confirm, cancel, or backdrop click) to keep the DOM clean.
 * FI: Ohjelmallinen vahvistusikkuna, joka palauttaa Promise<boolean>-arvon.
 *     Korvaa natiivin window.confirm()-funktion, joka on estetty joissakin
 *     selaimissa eikä sitä voi tyylitellä. Peite poistetaan DOM:sta
 *     missä tahansa sulkemistoiminnossa (vahvista, peruuta tai taustan klikkaus)
 *     DOM:n pitämiseksi siistinä.
 * @param {string} message - EN: confirmation question / FI: vahvistuskysymys
 * @param {string} confirmText - EN: confirm button label / FI: vahvistuspainikkeen teksti
 * @param {string} cancelText - EN: cancel button label / FI: peruutuspainikkeen teksti
 * @returns {Promise<boolean>}
 */
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
