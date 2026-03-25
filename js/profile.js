const DIGITRANSIT_API_KEY = '4346b471f4ea41cb923eb2b40556c495';
/* ==========================================
   STUDENT PROFILE (Supabase)
   ========================================== */

// Current profile data & categories & links
let currentProfile = null;
let allCategories = [];
let selectedCategoryIds = [];
let currentLinks = [];

// ==========================================
// LOAD PROFILE
// ==========================================
async function loadStudentProfile() {
  const session = requireAuth();
  if (!session) return;

  try {
    // Load profile, categories, and applications in parallel
    const [profileRes, categoriesRes, studentCatsRes, applicationsRes] = await Promise.all([
      supabaseClient
        .from('student_profiles')
        .select('*')
        .eq('user_id', session.userId)
        .single(),
      supabaseClient
        .from('job_categories')
        .select('category_id, title, group_id, job_groups(title)')
        .order('group_id'),
      supabaseClient
        .from('student_categories')
        .select('category_id')
        .eq('student_id', 0), // placeholder, updated below
      supabaseClient
        .from('applications')
        .select('*, positions(title, Companies:company_id(company_name))')
        .eq('student_id', 0) // placeholder, updated below
    ]);

    const profile = profileRes.data;
    allCategories = categoriesRes.data || [];

    if (!profile) {
      console.error('Profile not found');
      return;
    }

    currentProfile = profile;

    // Load student categories with real student_id
    const { data: studentCats } = await supabaseClient
      .from('student_categories')
      .select('category_id')
      .eq('student_id', profile.id);

    selectedCategoryIds = (studentCats || []).map(sc => sc.category_id);

    // Load applications with real student_id
    const { data: applications } = await supabaseClient
      .from('applications')
      .select('*, positions(title)')
      .eq('student_id', profile.id);

    // Load links
    const { data: links } = await supabaseClient
      .from('Student_links')
      .select('*')
      .eq('student_id', profile.id)
      .order('created_at');

    currentLinks = links || [];

    // Fill display mode
    fillDisplayMode(profile, session);
    fillAvatar(profile);
    fillCvInfo(profile);
    fillLinks();
    fillApplications(applications || []);
    addLogoutButton();
  } catch (err) {
    console.error('Error loading profile:', err);
  }
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

function togglePostEdit(postId, isEditing) {
    const viewDiv = document.getElementById(`view-mode-${postId}`);
    const editDiv = document.getElementById(`edit-mode-${postId}`);
    const inputField = document.getElementById(`input-title-${postId}`);
    const currentTitle = document.getElementById(`title-${postId}`).innerText;

    if (isEditing) {
        viewDiv.style.display = 'none';
        editDiv.style.display = 'block';
        inputField.value = currentTitle; 
    } else {

        viewDiv.style.display = 'block';
        editDiv.style.display = 'none';
    }
}

async function savePost(postId) {
    const newTitle = document.getElementById(`input-title-${postId}`).value;
    
    document.getElementById(`title-${postId}`).innerText = newTitle;
    
    togglePostEdit(postId, false);
    alert("Position updated!");
}

// ==========================================
// FILL DISPLAY MODE
// ==========================================
function fillDisplayMode(profile, session) {
  // Header
  const fullName = [(profile.first_name || ''), (profile.last_name || '')].filter(Boolean).join(' ');
  setText('profileName', fullName || session.login);
  setText('profileEmail', session.login);
  setText('profilePhone', profile.phone || '');
  setText('profileCity', profile.city || '');

  // Fields
  setField('dFirstName', profile.first_name);
  setField('dLastName', profile.last_name);
  setField('dBirthDate', profile.birth_date);
  setField('dPhone', profile.phone);
  setField('dCity', profile.city);
  setField('dEducation', profile.type_education);
  setField('dAbout', profile.about);
  setField('dPracticeStart', profile.practice_start);
  setField('dPracticeEnd', profile.practice_end);

  const openEl = document.getElementById('dOpenToOffers');
  if (openEl) {
    openEl.textContent = profile.is_open_to_offers ? 'Yes' : 'No';
    openEl.className = 'profile-field-value';
  }

  // Categories
  const catContainer = document.getElementById('dCategories');
  if (catContainer) {
    if (selectedCategoryIds.length === 0) {
      catContainer.innerHTML = '<span class="profile-field-value empty">No categories selected</span>';
    } else {
      catContainer.innerHTML = selectedCategoryIds.map(id => {
        const cat = allCategories.find(c => c.category_id === id);
        return cat ? `<span class="category-tag">${cat.title}</span>` : '';
      }).join('');
    }
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '';
}

function setField(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  if (value) {
    el.textContent = value;
    el.className = 'profile-field-value';
  } else {
    el.textContent = 'Not specified';
    el.className = 'profile-field-value empty';
  }
}

// ==========================================
// FILL APPLICATIONS
// ==========================================
function fillApplications(applications) {
  const container = document.getElementById('applicationsContainer');
  if (!container) return;

  if (applications.length === 0) {
    container.innerHTML = '<p class="text-muted">No applications yet.</p>';
    return;
  }

  container.innerHTML = applications.map(app => {
    const title = app.positions?.title || 'Position';
    const statusClass = 'status-' + app.status;
    return `
      <div class="application-item">
        <p style="margin:0; font-weight:600;">${title}</p>
        <span class="status-badge ${statusClass}">${app.status}</span>
        <p style="margin:0.25rem 0 0; font-size:0.8rem; color:var(--text-light);">
          ${new Date(app.applied_at).toLocaleDateString()}
        </p>
      </div>
    `;
  }).join('');
}
async function handleCityInput(query) {
    console.log("Typing detected:", query);
    const datalist = document.getElementById('citySuggestions');
    if (!datalist) return;

    if (!query || query.length < 2) {
        datalist.innerHTML = ''; 
        return;
    }

    // FIX 1: Define the Set at the very beginning
    const uniqueCities = new Set();

    try {
        // FIX 2: Using a more stable version of the URL
        // We removed 'layers' for a moment to see if that's causing the 400 error
        const url = `https://api.digitransit.fi/geocoding/v1/autocomplete?text=${encodeURIComponent(query)}&boundary.country=FIN&size=15`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'digitransit-subscription-key': DIGITRANSIT_API_KEY 
            }
        });

        // If the API returns 400, let's see why
        if (!response.ok) {
            console.error("API Error Status:", response.status);
            return;
        }

        const data = await response.json();
        console.log("API Response:", data);

        datalist.innerHTML = '';

        if (data.features && data.features.length > 0) {
            data.features.forEach(feature => {
                const props = feature.properties;
                
                // FIX 3: Filter out anything with numbers (street addresses)
                // This keeps only names like "Kokkola" and skips "Kokkolantie 5"
                const hasNumber = /\d/.test(props.name);
                
                if (!hasNumber) {
                    const cityName = props.name;
                    if (!uniqueCities.has(cityName)) {
                        uniqueCities.add(cityName);
                        const option = document.createElement('option');
                        option.value = cityName;
                        datalist.appendChild(option);
                    }
                }
            });
            console.log("Filtered Results:", Array.from(uniqueCities));
        }
    } catch (err) {
        console.error('Script Error:', err);
    }
}
// ==========================================
// EDIT MODE
// ==========================================
function enterEditMode() {
  if (!currentProfile) return;

  document.getElementById('displayMode').style.display = 'none';
  document.getElementById('editMode').style.display = 'block';
  document.getElementById('editProfileBtn').style.display = 'none';
  document.getElementById('saveProfileBtn').style.display = 'inline-block';
  document.getElementById('cancelEditBtn').style.display = 'inline-block';

  // Fill form fields
  document.getElementById('eFirstName').value = currentProfile.first_name || '';
  document.getElementById('eLastName').value = currentProfile.last_name || '';
  document.getElementById('eBirthDate').value = currentProfile.birth_date || '';
  document.getElementById('ePhone').value = currentProfile.phone || '';
  document.getElementById('eCity').value = currentProfile.city || '';
  document.getElementById('eEducation').value = currentProfile.type_education || '';
  document.getElementById('eAbout').value = currentProfile.about || '';
  document.getElementById('ePracticeStart').value = currentProfile.practice_start || '';
  document.getElementById('ePracticeEnd').value = currentProfile.practice_end || '';
  document.getElementById('eOpenToOffers').checked = currentProfile.is_open_to_offers;

  // Render selected categories
  renderSelectedCategories();
  buildCategoryDropdown();

  // Render links
  fillEditLinks();
}

function cancelEditMode() {
  document.getElementById('displayMode').style.display = 'block';
  document.getElementById('editMode').style.display = 'none';
  document.getElementById('editProfileBtn').style.display = 'inline-block';
  document.getElementById('saveProfileBtn').style.display = 'none';
  document.getElementById('cancelEditBtn').style.display = 'none';
}

// This function opens and closes the edit boxes
function toggleCompanyEdit(isEditing) {
    const editBtn = document.getElementById('editCompanyBtn');
    const actionBtns = document.getElementById('editActionButtons');
    const displayAbout = document.getElementById('companyDisplayAbout');
    const editMode = document.getElementById('companyEditMode');
    const displayHeader = document.querySelector('.company-info');

    if (isEditing) {
        // 1. Copy current text INTO the input boxes so you can edit them
        document.getElementById('eCompanyName').value = document.getElementById('dCompanyName').innerText;
        document.getElementById('eCompanyDesc').value = document.getElementById('dCompanyDesc').innerText;
        document.getElementById('eHeadquarters').value = document.getElementById('dHeadquarters').innerText;
        document.getElementById('eTeamSize').value = document.getElementById('dTeamSize').innerText;
        document.getElementById('eWebsite').value = document.getElementById('dWebsite').innerText;

        // 2. Show the Edit form, hide the display text
        editBtn.style.display = 'none';
        actionBtns.style.display = 'flex';
        displayAbout.style.display = 'none';
        editMode.style.display = 'block';
        if(displayHeader) displayHeader.style.opacity = '0.5';
    } else {
        // 3. Switch back to normal view
        editBtn.style.display = 'inline-block';
        actionBtns.style.display = 'none';
        displayAbout.style.display = 'block';
        editMode.style.display = 'none';
        if(displayHeader) displayHeader.style.opacity = '1';
    }
}

async function saveCompanyProfile() {
    const session = getCurrentSession(); 
    const client = typeof supabaseClient !== 'undefined' ? supabaseClient : window.supabase;
    
    if (!session || !session.userId) {
        alert("Session not found. Please log in again.");
        return;
    }

    try {
        const updatedData = {
            company_name: document.getElementById('eCompanyName').value,
            description: document.getElementById('eCompanyDesc').value,
            website: document.getElementById('eWebsite').value,
            updated_at: new Date().toISOString()
        };

        // 2. Save using the userId from your session
        const { error } = await client
            .from('Companies') 
            .update(updatedData)
            .eq('user_id', session.userId); 

        if (error) throw error;

        document.getElementById('dCompanyName').innerText = updatedData.company_name;
        document.getElementById('dCompanyDesc').innerText = updatedData.description;
        document.getElementById('dWebsite').innerText = updatedData.website;
        
        if(document.getElementById('dHeadquarters')) {
            document.getElementById('dHeadquarters').innerText = document.getElementById('eHeadquarters').value;
        }

        toggleCompanyEdit(false);
        alert("Company profile saved successfully!");

    } catch (err) {
        console.error("Save error:", err);
        alert("Save failed: " + err.message);
    }
}

// ==========================================
// SAVE PROFILE
// ==========================================
async function saveProfile() {
  const session = getCurrentSession();
  if (!session || !currentProfile) return;

  const saveBtn = document.getElementById('saveProfileBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  try {
    const updates = {
      first_name: document.getElementById('eFirstName').value.trim() || null,
      last_name: document.getElementById('eLastName').value.trim() || null,
      birth_date: document.getElementById('eBirthDate').value || null,
      phone: document.getElementById('ePhone').value.trim() || null,
      city: document.getElementById('eCity').value.trim() || null,
      type_education: document.getElementById('eEducation').value.trim() || null,
      about: document.getElementById('eAbout').value.trim() || null,
      practice_start: document.getElementById('ePracticeStart').value || null,
      practice_end: document.getElementById('ePracticeEnd').value || null,
      is_open_to_offers: document.getElementById('eOpenToOffers').checked,
      updated_at: new Date().toISOString()
    };

    // Update profile
    const { error: profileError } = await supabaseClient
      .from('student_profiles')
      .update(updates)
      .eq('id', currentProfile.id);

    if (profileError) {
      alert('Error saving profile: ' + profileError.message);
      return;
    }

    // Update categories: delete old, insert new
    await supabaseClient
      .from('student_categories')
      .delete()
      .eq('student_id', currentProfile.id);

    if (selectedCategoryIds.length > 0) {
      const rows = selectedCategoryIds.map(catId => ({
        student_id: currentProfile.id,
        category_id: catId
      }));
      await supabaseClient
        .from('student_categories')
        .insert(rows);
    }

    // Save links
    await saveLinks();

    // Update local data
    Object.assign(currentProfile, updates);

    // Refresh display
    fillDisplayMode(currentProfile, session);
    cancelEditMode();
  } catch (err) {
    console.error('Save error:', err);
    alert('An error occurred while saving.');
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
}

// ==========================================
// CATEGORY SEARCH & SELECTION
// ==========================================
function buildCategoryDropdown() {
  const dropdown = document.getElementById('categoryDropdown');
  if (!dropdown) return;

  // Group categories by job_group
  const groups = {};
  allCategories.forEach(cat => {
    const groupTitle = cat.job_groups?.title || 'Other';
    if (!groups[groupTitle]) groups[groupTitle] = [];
    groups[groupTitle].push(cat);
  });

  let html = '';
  for (const [groupTitle, cats] of Object.entries(groups)) {
    html += `<div class="category-group-title">${groupTitle}</div>`;
    cats.forEach(cat => {
      const isSelected = selectedCategoryIds.includes(cat.category_id);
      html += `<div class="category-option ${isSelected ? 'selected' : ''}"
                    data-id="${cat.category_id}"
                    onclick="toggleCategory(${cat.category_id})">
                ${cat.title}
              </div>`;
    });
  }

  dropdown.innerHTML = html;
}

function filterCategories() {
  const search = document.getElementById('categorySearchInput').value.toLowerCase();
  const dropdown = document.getElementById('categoryDropdown');
  dropdown.classList.add('show');

  const options = dropdown.querySelectorAll('.category-option');
  const groupTitles = dropdown.querySelectorAll('.category-group-title');

  // Hide all group titles first
  groupTitles.forEach(g => g.style.display = 'none');

  options.forEach(opt => {
    const text = opt.textContent.toLowerCase();
    if (text.includes(search)) {
      opt.style.display = '';
      // Show parent group title
      let prev = opt.previousElementSibling;
      while (prev && !prev.classList.contains('category-group-title')) {
        prev = prev.previousElementSibling;
      }
      if (prev) prev.style.display = '';
    } else {
      opt.style.display = 'none';
    }
  });
}

function showCategoryDropdown() {
  const dropdown = document.getElementById('categoryDropdown');
  if (dropdown) {
    dropdown.classList.add('show');
    // Show all when opening
    dropdown.querySelectorAll('.category-option, .category-group-title').forEach(el => {
      el.style.display = '';
    });
  }
}

function toggleCategory(categoryId) {
  const idx = selectedCategoryIds.indexOf(categoryId);
  if (idx === -1) {
    selectedCategoryIds.push(categoryId);
  } else {
    selectedCategoryIds.splice(idx, 1);
  }
  renderSelectedCategories();
  buildCategoryDropdown();
}

function removeCategory(categoryId) {
  selectedCategoryIds = selectedCategoryIds.filter(id => id !== categoryId);
  renderSelectedCategories();
  buildCategoryDropdown();
}

function renderSelectedCategories() {
  const container = document.getElementById('eSelectedCategories');
  if (!container) return;

  if (selectedCategoryIds.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = selectedCategoryIds.map(id => {
    const cat = allCategories.find(c => c.category_id === id);
    if (!cat) return '';
    return `<span class="category-tag">
              ${cat.title}
              <button onclick="removeCategory(${id})">&times;</button>
            </span>`;
  }).join('');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const search = document.querySelector('.category-search');
  const dropdown = document.getElementById('categoryDropdown');
  if (dropdown && search && !search.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// ==========================================
// LINKS (Student_links table)
// ==========================================
const LINK_ICONS = {
  github: '&#128736;',
  linkedin: '&#128100;',
  portfolio: '&#127760;',
  other: '&#128279;'
};

function fillLinks() {
  const container = document.getElementById('dLinks');
  if (!container) return;

  if (currentLinks.length === 0) {
    container.innerHTML = '<span class="profile-field-value empty">No links added</span>';
    return;
  }

  container.innerHTML = currentLinks.map(link => {
    const icon = LINK_ICONS[link.link_type] || LINK_ICONS.other;
    const label = link.label || link.link_type;
    return `<div class="link-item">
              <span class="link-icon">${icon}</span>
              <a href="${link.url}" target="_blank" rel="noopener">${label}</a>
            </div>`;
  }).join('');
}

function fillEditLinks() {
  const container = document.getElementById('eLinksContainer');
  if (!container) return;

  container.innerHTML = '';
  currentLinks.forEach((link, index) => {
    addLinkRowHtml(container, link.link_type, link.label || '', link.url, link.link_id);
  });
}

function addLinkRow() {
  const container = document.getElementById('eLinksContainer');
  if (!container) return;
  addLinkRowHtml(container, 'github', '', '', null);
}

function addLinkRowHtml(container, type, label, url, linkId) {
  const row = document.createElement('div');
  row.className = 'link-edit-row';
  row.dataset.linkId = linkId || '';
  row.innerHTML = `
    <select class="link-type-select">
      <option value="github" ${type === 'github' ? 'selected' : ''}>GitHub</option>
      <option value="linkedin" ${type === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
      <option value="portfolio" ${type === 'portfolio' ? 'selected' : ''}>Portfolio</option>
      <option value="other" ${type === 'other' ? 'selected' : ''}>Other</option>
    </select>
    <input type="text" class="link-label-input" placeholder="Label" value="${label}" />
    <input type="url" class="link-url-input" placeholder="https://..." value="${url}" />
    <button type="button" class="link-remove-btn" onclick="this.parentElement.remove()">&times;</button>
  `;
  container.appendChild(row);
}

async function saveLinks() {
  if (!currentProfile) return;

  const container = document.getElementById('eLinksContainer');
  if (!container) return;

  const rows = container.querySelectorAll('.link-edit-row');
  const newLinks = [];

  rows.forEach(row => {
    const url = row.querySelector('.link-url-input').value.trim();
    if (!url) return; // skip empty
    newLinks.push({
      student_id: currentProfile.id,
      link_type: row.querySelector('.link-type-select').value,
      label: row.querySelector('.link-label-input').value.trim() || null,
      url: url
    });
  });

  // Delete old links
  await supabaseClient
    .from('Student_links')
    .delete()
    .eq('student_id', currentProfile.id);

  // Insert new
  if (newLinks.length > 0) {
    const { error } = await supabaseClient
      .from('Student_links')
      .insert(newLinks);

    if (error) {
      console.error('Error saving links:', error);
      return;
    }
  }

  // Reload links
  const { data } = await supabaseClient
    .from('Student_links')
    .select('*')
    .eq('student_id', currentProfile.id)
    .order('created_at');

  currentLinks = data || [];
  fillLinks();
}

// ==========================================
// AVATAR (Supabase Storage: foto)
// ==========================================
function fillAvatar(profile) {
  const img = document.getElementById('avatarImg');
  const placeholder = document.getElementById('avatarPlaceholder');
  if (!img || !placeholder) return;

  if (profile.photo_url) {
    img.src = profile.photo_url;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = '';
  }
}

async function uploadAvatar(input) {
  const file = input.files[0];
  if (!file || !currentProfile) return;

  const session = getCurrentSession();
  if (!session) return;

  // Max 2MB
  if (file.size > 2 * 1024 * 1024) {
    alert('Photo must be under 2 MB.');
    return;
  }

  const ext = file.name.split('.').pop();
  const filePath = `user_${session.userId}/avatar.${ext}`;

  try {
    // Upload to Supabase Storage (overwrite if exists)
    const { error: uploadError } = await supabaseClient.storage
      .from('foto')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      return;
    }

    // Get public URL
    const { data } = supabaseClient.storage
      .from('foto')
      .getPublicUrl(filePath);

    const photoUrl = data.publicUrl;

    // Save URL to profile
    await supabaseClient
      .from('student_profiles')
      .update({ photo_url: photoUrl, updated_at: new Date().toISOString() })
      .eq('id', currentProfile.id);

    currentProfile.photo_url = photoUrl;
    fillAvatar(currentProfile);
  } catch (err) {
    console.error('Avatar upload error:', err);
    alert('Failed to upload photo.');
  }
}

// ==========================================
// CV FILE (Supabase Storage: practice-files)
// ==========================================
function fillCvInfo(profile) {
  const container = document.getElementById('cvFileInfo');
  const downloadBtn = document.getElementById('downloadCvBtn');
  if (!container) return;

  if (profile.cv_url && profile.cv_original_name) {
    container.innerHTML = `<p style="font-weight:600;">${profile.cv_original_name}</p>`;
    if (downloadBtn) downloadBtn.disabled = false;
  } else {
    container.innerHTML = '<p class="text-muted">No CV uploaded yet.</p>';
    if (downloadBtn) downloadBtn.disabled = true;
  }
}

async function uploadCV(input) {
  const file = input.files[0];
  if (!file || !currentProfile) return;

  const session = getCurrentSession();
  if (!session) return;

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    alert('CV must be under 10 MB.');
    return;
  }

  const ext = file.name.split('.').pop();
  const filePath = `user_${session.userId}/cv.${ext}`;

  try {
    const { error: uploadError } = await supabaseClient.storage
      .from('practice-files')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      return;
    }

    const { data } = supabaseClient.storage
      .from('practice-files')
      .getPublicUrl(filePath);

    const cvUrl = data.publicUrl;

    await supabaseClient
      .from('student_profiles')
      .update({
        cv_url: cvUrl,
        cv_original_name: file.name,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProfile.id);

    currentProfile.cv_url = cvUrl;
    currentProfile.cv_original_name = file.name;
    fillCvInfo(currentProfile);
    alert('CV uploaded successfully!');
  } catch (err) {
    console.error('CV upload error:', err);
    alert('Failed to upload CV.');
  }
}

// ==========================================
// DOWNLOAD CV
// ==========================================
function downloadCV() {
  if (!currentProfile || !currentProfile.cv_url) {
    alert('No CV uploaded yet.');
    return;
  }
  window.open(currentProfile.cv_url, '_blank');
}
