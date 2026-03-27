const DIGITRANSIT_API_KEY = '4346b471f4ea41cb923eb2b40556c495';
/* ==========================================
   STUDENT PROFILE (Supabase)
   ========================================== */

// Current profile data & categories & links
let currentProfile = null;
let currentTeam = [];
let allCategories = [];
let selectedCategoryIds = [];
let currentLinks = [];
let editingMemberId = null;

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
  } catch (err) {
    console.error('Error loading profile:', err);
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
// COMPANY PROFILE LOGIC
// ==========================================

async function loadCompanyTeam() {
  if (!currentProfile) return;

  const { data: team, error } = await supabaseClient
    .from('company_team')
    .select('*')
.eq('company_id', parseInt(currentProfile.company_id))

    .order('created_at');
  if (error) console.error('Load team error:', error);
  else currentTeam = team || [];
}

/**
 * Fills both the Edit Mode list and the Public Display card
 */
function fillTeamDisplay() {
    const editContainer = document.getElementById('teamMembersList');
    const displayContainer = document.getElementById('displayTeamList');
    
    // Helper to generate the HTML for each member
    const generateHTML = (member, isEditMode) => `
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <p style="margin: 0; font-weight: 600; font-size: 1.1rem;">${member.name}</p>
                    <p style="margin: 0.2rem 0; color: var(--primary-color); font-weight: 500;">${member.job_title}</p>
                    ${member.email ? `<p style="margin: 0; font-size: 0.85rem; color: var(--text-light);">📧 ${member.email}</p>` : ''}
                    ${member.phone ? `<p style="margin: 0; font-size: 0.85rem; color: var(--text-light);">📞 ${member.phone}</p>` : ''}
                </div>
                ${isEditMode ? `
                <div style="display: flex; gap: 5px;">
                    <button onclick="editTeamMember('${member.id}')" class="btn-small" style="background: var(--secondary-color); color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Edit</button>
                    <button onclick="deleteTeamMember('${member.id}')" class="btn-small" style="background:#ef4444; color:white; border:none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    if (editContainer) {
        editContainer.innerHTML = currentTeam.length ? currentTeam.map(m => generateHTML(m, true)).join('') : '<p>No members yet.</p>';
    }

    if (displayContainer) {
        displayContainer.innerHTML = currentTeam.length ? currentTeam.map(m => generateHTML(m, false)).join('') : '<p>No members listed.</p>';
    }
}

/* ==========================================
   TEAM MANAGEMENT LOGIC
   ========================================== */


/**
 * Shows the inline form and hides the "Add" button
 */
function showAddMemberForm() {
    document.getElementById('newMemberForm').style.display = 'block';
    document.getElementById('addMemberToggleBtn').style.display = 'none';
}

/**
 * Hides the form, clears inputs, and resets the "Edit" state
 */
function hideAddMemberForm() {
    document.getElementById('newMemberForm').style.display = 'none';
    document.getElementById('addMemberToggleBtn').style.display = 'inline-block';
    
    // Reset state
    editingMemberId = null;
    
    // Reset button text
    const confirmBtn = document.querySelector('#newMemberForm button[onclick="saveNewTeamMember()"]');
    if (confirmBtn) confirmBtn.innerText = "Confirm Add";

    // Clear all inputs
    ['nmName', 'nmTitle', 'nmEmail', 'nmPhone'].forEach(id => {
        document.getElementById(id).value = '';
    });
}

/**
 * Populates the form with existing data to Edit
 */
function editTeamMember(memberId) {
    const member = currentTeam.find(m => m.id === memberId);
    if (!member) return;

    // 1. Set the ID we are editing
    editingMemberId = memberId;

    // 2. Open the form
    showAddMemberForm();

    // 3. Fill the inputs with current data
    document.getElementById('nmName').value = member.name || '';
    document.getElementById('nmTitle').value = member.job_title || '';
    document.getElementById('nmEmail').value = member.email || '';
    document.getElementById('nmPhone').value = member.phone || '';

    // 4. Change button text to "Update"
    const confirmBtn = document.querySelector('#newMemberForm button[onclick="saveNewTeamMember()"]');
    if (confirmBtn) confirmBtn.innerText = "Update Member";
    
    // Optional: Scroll to the form
    document.getElementById('newMemberForm').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Saves either a NEW member or UPDATES an existing one
 */
async function saveNewTeamMember() {
    const name = document.getElementById('nmName').value.trim();
    const title = document.getElementById('nmTitle').value.trim();
    const email = document.getElementById('nmEmail').value.trim();
    const phone = document.getElementById('nmPhone').value.trim();

    if (!name || !title) {
        alert("Name and Job Title are required.");
        return;
    }

    const memberData = {
        company_id: parseInt(currentProfile.company_id),
        name: name,
        job_title: title,
        email: email,
        phone: phone
    };

    try {
        if (editingMemberId) {
            // --- MODE: UPDATE ---
            const { data, error } = await supabaseClient
                .from('company_team')
                .update(memberData)
                .eq('id', editingMemberId)
                .select();

            if (error) throw error;

            // Update the local list
            const index = currentTeam.findIndex(m => m.id === editingMemberId);
            currentTeam[index] = data[0];
            alert("Member updated successfully!");
        } else {
            // --- MODE: INSERT ---
            const { data, error } = await supabaseClient
                .from('company_team')
                .insert([memberData])
                .select();

            if (error) throw error;

            currentTeam.push(data[0]);
            alert("Member added successfully!");
        }

        // Refresh UI and close form
        fillTeamDisplay();
        hideAddMemberForm();

    } catch (err) {
        console.error("Database Error:", err.message);
        alert("Error: " + err.message);
    }
}

/**
 * Deletes member from DB and UI
 */
async function deleteTeamMember(id) {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
        const { error } = await supabaseClient
            .from('company_team')
            .delete()
            .eq('id', id);

        if (error) throw error;

        currentTeam = currentTeam.filter(m => m.id !== id);
        fillTeamDisplay();
    } catch (err) {
        console.error("Delete Error:", err);
    }
}

async function loadCompanyProfile() {
  const session = getCurrentSession();
  if (!session) return;

  try {
    const { data: profile, error } = await supabaseClient
      .from('Companies') 
      .select('*')
      .eq('user_id', session.userId)
      .single();

    if (error) throw error;
    if (profile) {
      currentProfile = profile; 
      fillCompanyDisplay(profile);
      fillCompanyLogo(profile);
      await loadCompanyTeam();
      fillTeamDisplay();
    }
  } catch (err) {
    console.error('Error loading company:', err.message);
  }
}
let prhSearchTimeout;

async function handlePRHSearch(query) {
    const datalist = document.getElementById('prhSuggestions');
    const status = document.getElementById('prhStatus');
    const cleanQuery = query.trim();

    if (!cleanQuery || cleanQuery.length < 3) {
        if (datalist) datalist.innerHTML = '';
        return;
    }

    clearTimeout(prhSearchTimeout);

    prhSearchTimeout = setTimeout(async () => {
        try {
            if (status) status.textContent = "Searching Registry...";

            const isNumeric = /^\d+$/.test(cleanQuery.replace('-', ''));
            const param = isNumeric ? `businessId=${cleanQuery}` : `name=${encodeURIComponent(cleanQuery)}`;
            const targetUrl = `https://avoindata.prh.fi/bis/v1?${param}&maxResults=10`;
            
            // Use a stable proxy
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
            
            const response = await fetch(proxyUrl);
            const proxyData = await response.json();
            const data = JSON.parse(proxyData.contents); // AllOrigins wraps the result in 'contents'

            if (datalist) datalist.innerHTML = ''; 

            if (data.results && data.results.length > 0) {
                data.results.forEach(company => {
                    const option = document.createElement('option');
                    option.value = company.businessId; 
                    option.textContent = company.name; 
                    datalist.appendChild(option);
                });
                if (status) status.textContent = `Found ${data.results.length} matches`;
            } else {
                if (status) status.textContent = "No matches found.";
            }
        } catch (err) {
            console.error("PRH API Error:", err);
            if (status) status.textContent = "Search Error. Use manual entry.";
        }
    }, 400);
}
async function saveCompanyProfile() {
    const session = getCurrentSession();
    if (!session || !currentProfile) return;

    const saveBtn = document.querySelector('[onclick="saveCompanyProfile()"]');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    // Map your UI inputs to your DB columns exactly as they are in the image
    const updates = {
        company_name: document.getElementById('eCompanyName').value.trim(),
        description: document.getElementById('eCompanyDesc').value.trim(),
        website: document.getElementById('eWebsite').value.trim(),
        city: document.getElementById('eHeadquarters').value.trim(), 
        y_tunnus: document.getElementById('eTeamSize').value.trim(),
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await supabaseClient
            .from('Companies')
            .update(updates)
            .eq('company_id', currentProfile.company_id); // Use company_id PK from image

        if (error) throw error;

        // Update local data and UI
        Object.assign(currentProfile, updates);
        fillCompanyDisplay(currentProfile);
        toggleCompanyEdit(false);
        alert("Changes saved successfully!");
    } catch (err) {
        console.error("Save error:", err);
        alert("Failed to save: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
    }
}

// Helper to fill the display text
function fillCompanyDisplay(profile) {
    if(document.getElementById('dCompanyName')) 
        document.getElementById('dCompanyName').innerText = profile.company_name || '';
    
    if(document.getElementById('dCompanyDesc')) 
        document.getElementById('dCompanyDesc').innerText = profile.description || '';
    
    if(document.getElementById('dWebsite')) 
        document.getElementById('dWebsite').innerText = profile.website || '';
    
    if(document.getElementById('dHeadquarters')) 
        document.getElementById('dHeadquarters').innerText = profile.city || '';

    // FIX THIS LINE: Use dYTunnus if that is what is in your HTML
    const teamSizeEl = document.getElementById('dTeamSize');
}

async function uploadCompanyLogo(input) {
    const file = input.files[0];
    if (!file || !currentProfile) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `logos/${currentProfile.company_id}.${fileExt}`;

    try {
        const { error: uploadError } = await supabaseClient.storage
            .from('LOGO')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabaseClient.storage
            .from('LOGO')
            .getPublicUrl(filePath);

        const publicUrl = data.publicUrl;

        const { error: dbError } = await supabaseClient
            .from('Companies')
            .update({ logo_url: publicUrl })
            .eq('company_id', currentProfile.company_id);

        if (dbError) throw dbError;

        currentProfile.logo_url = publicUrl;
        fillCompanyLogo(currentProfile);
        alert('Logo updated!');
    } catch (err) {
        console.error('Logo Error:', err.message);
    }
}

function toggleCompanyEdit(isEditing) {
    const editBtn = document.getElementById('editCompanyBtn');
    const actionBtns = document.getElementById('editActionButtons');
    const displayAbout = document.getElementById('companyDisplayAbout');
    const editMode = document.getElementById('companyEditMode');

    if (isEditing) {
        document.getElementById('eCompanyName').value = document.getElementById('dCompanyName').innerText;
        document.getElementById('eCompanyDesc').value = document.getElementById('dCompanyDesc').innerText;
        
        document.getElementById('eHeadquarters').value = document.getElementById('dHeadquarters').innerText;
        document.getElementById('eTeamSize').value = document.getElementById('dTeamSize').innerText;
        document.getElementById('eWebsite').value = document.getElementById('dWebsite').innerText;

        editBtn.style.display = 'none';
        actionBtns.style.display = 'flex';
        displayAbout.style.display = 'none';
        editMode.style.display = 'block';
    } else {
        editBtn.style.display = 'inline-block';
        actionBtns.style.display = 'none';
        displayAbout.style.display = 'block';
        editMode.style.display = 'none';
    }
}

async function saveCompanyProfile() {
    const session = getCurrentSession(); 
    if (!session) {
        alert("You must be logged in to save.");
        return;
    }

    const saveBtn = document.getElementById('saveCompanyBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = 'Saving...';
    }

    try {
        const updates = {
            company_name: document.getElementById('eCompanyName').value.trim(),
            description: document.getElementById('eCompanyDesc').value.trim(),
            website: document.getElementById('eWebsite').value.trim(),
            city: document.getElementById('eHeadquarters').value.trim(),
            y_tunnus: document.getElementById('eTeamSize').value.trim(),
            updated_at: new Date().toISOString()
        };

        const { error } = await supabaseClient
            .from('Companies') 
            .update(updates)
            .eq('user_id', session.userId); 

        if (error) throw error;

        document.getElementById('dCompanyName').innerText = updates.company_name;
        document.getElementById('dCompanyDesc').innerText = updates.description;
        document.getElementById('dHeadquarters').innerText = updates.city;
        document.getElementById('dTeamSize').innerText = updates.y_tunnus;
        document.getElementById('dWebsite').innerText = updates.website;

        toggleCompanyEdit(false);
        alert("Profile updated successfully!");

    } catch (err) {
        console.error("Full Save Error:", err);
        alert("Save failed: " + (err.message || "Unknown error"));
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerText = 'Save';
        }
    }
}

function fillCompanyLogo(profile) {
    const logoImg = document.getElementById('companyLogoImg');
    const logoEmoji = document.getElementById('logoEmoji');
    
    if (profile.logo_url) {
        if (logoImg) {
            logoImg.src = profile.logo_url;
            logoImg.style.display = 'block';
        }
        if (logoEmoji) logoEmoji.style.display = 'none';
    } else {
        if (logoImg) logoImg.style.display = 'none';
        if (logoEmoji) logoEmoji.style.display = 'block';
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

    // This function runs whenever you select an item from the datalist
document.getElementById('eTeamSize').addEventListener('change', async function() {
    const selectedId = this.value.trim();

    // Only run if it looks like a real Y-tunnus (e.g., 1234567-8)
    if (!/^\d{7}-\d$/.test(selectedId)) return;

    try {
        const status = document.getElementById('prhStatus');
        if (status) status.textContent = "Fetching company details...";

        // Robust proxy with fallback
        const targetUrl = `https://avoindata.prh.fi/bis/v1/${selectedId}`;
        const proxies = [
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
            `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`
        ];
        let lastError;
        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const proxyData = await response.json();
                const data = JSON.parse( (proxyData.contents || proxyData) );
                break; // Success, use data
            } catch (err) {
                lastError = err;
                continue;
            }
        }
        if (lastError) throw lastError;

        if (data.results && data.results[0]) {
            const company = data.results[0];

            // AUTO-FILL THE OTHER VARIABLES
            document.getElementById('eCompanyName').value = company.name || '';
            
            // regOffice is usually the City in the PRH API
            if (company.regOffice) {
                document.getElementById('eHeadquarters').value = company.regOffice;
            }

            if (status) status.textContent = "✅ Details loaded for " + company.name;
        }
    } catch (err) {
        console.error("Auto-fill error:", err);
        if (status) status.textContent = `Auto-fill failed: ${err.message}`;
    }
});

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
