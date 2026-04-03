const DIGITRANSIT_API_KEY = '4346b471f4ea41cb923eb2b40556c495';
/* ==========================================
   STUDENT PROFILE (Supabase)
   ========================================== */

// Current profile data & categories & links
let currentProfile = null;
let currentTeam = []; 
let editingMemberId = null;
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
      console.warn('Profile not found, creating new empty student profile');
      const { data: newProfile, error: createError } = await supabaseClient
        .from('student_profiles')
        .insert({ user_id: session.userId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .select('*')
        .single();

      if (createError) {
        console.error('Failed to create student profile:', createError);
        return;
      }

      profile = newProfile;
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

  if (profile.education_history) {
    updateEducationDisplay(profile.education_history);
} else if (profile.type_education) {
    // Fallback if you only have the old single string
    updateEducationDisplay([{ name: profile.type_education, year: '' }]);
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

// Function to add a new education input row
function addEducationRow(data = { type: '', name: '', year: '' }) {
  const container = document.getElementById('eEducationContainer');
  const row = document.createElement('div');
  row.className = 'edu-edit-row';
  
  row.innerHTML = `
      <select class="edit-select edu-type">
          <option value="University" ${data.type === 'University' ? 'selected' : ''}>University</option>
          <option value="Vocational" ${data.type === 'Vocational' ? 'selected' : ''}>Vocational</option>
          <option value="High School" ${data.type === 'High School' ? 'selected' : ''}>High School</option>
          <option value="Other" ${data.type === 'Other' ? 'selected' : ''}>Other</option>
      </select>
      <input type="text" class="edit-input edu-name" placeholder="Institution Name" value="${data.name}" />
      <input type="number" class="edit-input edu-year" placeholder="Year" value="${data.year}" min="1900" max="2099" />
      <button type="button" class="link-remove-btn" onclick="this.parentElement.remove()">✕</button>
  `;
  
  container.appendChild(row);
}

// Update your saveProfile function to collect this data
function getEducationData() {
  const rows = document.querySelectorAll('.edu-edit-row');
  const educationEntries = [];
  
  rows.forEach(row => {
      const type = row.querySelector('.edu-type').value;
      const name = row.querySelector('.edu-name').value;
      const year = row.querySelector('.edu-year').value;
      
      if (name) {
          educationEntries.push({ type, name, year });
      }
  });
  
  return educationEntries;
}

// Update your display function to show the list
function updateEducationDisplay(eduData) {
  const displayContainer = document.getElementById('dEducationList');
  if (!displayContainer) return;

  if (!eduData || eduData.length === 0) {
      displayContainer.innerHTML = '<span class="profile-field-value empty">No education added</span>';
      return;
  }

  displayContainer.innerHTML = eduData.map(edu => `
      <div class="edu-display-item" style="margin-bottom: 10px;">
          <div style="font-weight: 600; color: var(--primary-color);">${edu.name}</div>
          <div style="font-size: 0.9rem; color: #666;">${edu.type} ${edu.year ? '• ' + edu.year : ''}</div>
      </div>
  `).join('');
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
  console.log("Editing member with ID:", memberId); // Debugging
  
  // Convert both to strings to ensure they match
  const member = currentTeam.find(m => String(m.id) === String(memberId));
  
  if (!member) {
      console.error("Member not found in currentTeam array. Check if currentTeam is populated.");
      return;
  }

  // The rest of your code...
  editingMemberId = memberId;
  showAddMemberForm();

  document.getElementById('nmName').value = member.name || '';
  document.getElementById('nmTitle').value = member.job_title || '';
  document.getElementById('nmEmail').value = member.email || '';
  document.getElementById('nmPhone').value = member.phone || '';

  const confirmBtn = document.querySelector('#newMemberForm button[onclick="saveNewTeamMember()"]');
  if (confirmBtn) confirmBtn.innerText = "Update Member";
  
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
      fillCompanyCvInfo();
      await loadCompanyTeam();
      await loadCompanyPostings();
      await loadCompanyApplications();
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

    if(document.getElementById('dTeamSize'))
        document.getElementById('dTeamSize').innerText = profile.y_tunnus || 'Not set';
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

        // Update local cache so toggleCompanyEdit pre-fills correctly next time
        Object.assign(currentProfile, updates);
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

// Opens the modal for a NEW position
function openPostModal() {
  const modal = document.getElementById('postJobModal');
  const titleHeader = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitPostBtn');

  if (titleHeader) titleHeader.innerText = "Create New Internship";
  if (submitBtn) submitBtn.innerText = "Post Position";
  document.getElementById('editPositionId').value = ""; // Clear ID

  // Clear form
  document.getElementById('pTitle').value = "";
  document.getElementById('pDesc').value = "";
  document.getElementById('pReqs').value = "";
  document.getElementById('pCategory').value = "";
  
  loadCategoriesIntoSelect();

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Opens the modal to EDIT an existing position
async function openEditModal(id) {
  const modal = document.getElementById('postJobModal');
  const titleHeader = document.getElementById('modalTitle');
  const submitBtn = document.getElementById('submitPostBtn');

  if (titleHeader) titleHeader.innerText = "Edit Internship";
  if (submitBtn) submitBtn.innerText = "Update Position";
  document.getElementById('editPositionId').value = id;

  try {
      const { data, error } = await supabaseClient
          .from('positions')
          .select('*')
          .eq('position_id', id)
          .single();

      if (error) throw error;

      // Fill fields
      document.getElementById('pTitle').value = data.title || "";
      document.getElementById('pDesc').value = data.description || "";
      document.getElementById('pReqs').value = data.requirements || "";
      document.getElementById('pStatus').value = data.status || "active";
      document.getElementById('pStart').value = data.period_start || "";
      document.getElementById('pEnd').value = data.period_end || "";
      document.getElementById('pOpenEnded').checked = data.is_open_ended;

      // Load categories and then set the selected one
      await loadCategoriesIntoSelect();
      setTimeout(() => {
          document.getElementById('pCategory').value = data.category_id || "";
      }, 100);

      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
  } catch (err) {
      alert("Error loading data: " + err.message);
  }
}

// Handles both INSERT and UPDATE
async function submitPosition() {
  const editId = document.getElementById('editPositionId').value;
  const submitBtn = document.getElementById('submitPostBtn');
  
  if (!currentProfile) return alert("Profile not loaded.");

  const postData = {
      company_id: currentProfile.company_id,
      title: document.getElementById('pTitle').value.trim(),
      description: document.getElementById('pDesc').value,
      requirements: document.getElementById('pReqs').value,
      status: document.getElementById('pStatus').value,
      category_id: document.getElementById('pCategory').value ? parseInt(document.getElementById('pCategory').value) : null,
      period_start: document.getElementById('pStart').value || null,
      period_end: document.getElementById('pEnd').value || null,
      is_open_ended: document.getElementById('pOpenEnded').checked
  };

  submitBtn.disabled = true;
  submitBtn.innerText = "Saving...";

  try {
      let error;
      if (editId) {
          const { error: err } = await supabaseClient.from('positions').update(postData).eq('position_id', editId);
          error = err;
      } else {
          const { error: err } = await supabaseClient.from('positions').insert([postData]);
          error = err;
      }

      if (error) throw error;

      alert(editId ? "Updated!" : "Posted!");
      closePostModal();
      loadCompanyPostings();
  } catch (err) {
      alert("Error: " + err.message);
  } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = editId ? "Update Position" : "Post Position";
  }
}

function closePostModal() {
  const modal = document.getElementById('postJobModal');
  modal.style.display = 'none';
  document.body.style.overflow = ''; // Restore scrolling
  
  // Reset error messages
  const err = document.getElementById('postError');
  if (err) err.style.display = 'none';
}

// Close modal if user clicks the dark background
window.onclick = function(event) {
  const modal = document.getElementById('postJobModal');
  if (event.target == modal) {
      closePostModal();
  }
}

async function loadCategoriesIntoSelect() {
  const select = document.getElementById('pCategory');
  if (!select) return;

  try {
      // Fetch categories and their parent group titles
      const { data, error } = await supabaseClient
          .from('job_groups')
          .select(`
              group_id,
              title,
              job_categories (
                  category_id,
                  title
              )
          `)
          .order('title');

      if (error) throw error;

      // Start with a clean select
      select.innerHTML = '<option value="">Select a category...</option>';

      data.forEach(group => {
          // Create a non-clickable group header (e.g., IT, Design)
          const optGroup = document.createElement('optgroup');
          optGroup.label = group.title;

          // Add the specific categories (e.g., Frontend Developer)
          group.job_categories.forEach(cat => {
              const option = document.createElement('option');
              option.value = cat.category_id;
              option.textContent = cat.title;
              optGroup.appendChild(option);
          });

          select.appendChild(optGroup);
      });
  } catch (err) {
      console.error("Error loading categories:", err.message);
      select.innerHTML = '<option value="">Error loading categories</option>';
  }
}

async function deletePosition(id) {
  if (!confirm("Are you sure you want to delete this posting?")) return;

  try {
      const { error } = await supabaseClient
          .from('positions')
          .delete()
          .eq('position_id', id);

      if (error) throw error;
      loadCompanyPostings(); // Refresh the list
  } catch (err) {
      alert(err.message);
  }
}

// --- Load and Display Postings ---
async function loadCompanyPostings() {
  const container = document.getElementById('companyPostingsList');
  if (!container || !currentProfile) return;

  try {
      // Fetch positions for this company
      const { data: positions, error } = await supabaseClient
          .from('positions')
          .select('position_id, title, status')
          .eq('company_id', currentProfile.company_id)
          .order('created_at', { ascending: false });

      if (error) throw error;

      if (positions.length === 0) {
          container.innerHTML = '<p style="text-align:center; color:gray;">No active postings.</p>';
          return;
      }

      // Generate the HTML for each item
      container.innerHTML = positions.map(pos => `
          <div class="posting-item" id="posting-${pos.position_id}">
              <div id="view-mode-${pos.position_id}">
                  <h4 id="title-${pos.position_id}">${pos.title}</h4>
                  <p class="applications">📊 0 Applications</p>
                  <p style="font-size: 0.875rem; margin: 0.5rem 0 0 0;">
                      <a href="internship-detail.html?id=${pos.position_id}" class="text-primary">View Posting</a> | 
                      <a href="javascript:void(0)" onclick="openEditModal(${pos.position_id})" class="text-primary">Edit</a>| 
                      <a href="javascript:void(0)" onclick="deletePosition(${pos.position_id})" class="text-primary" style="color:red;">Delete</a>
                  </p>
              </div>
              
              <div id="edit-mode-${pos.position_id}" style="display: none; margin-top: 10px;">
                  <input type="text" id="input-title-${pos.position_id}" class="form-control" value="${pos.title}" style="margin-bottom: 5px;">
                  <button type="button" onclick="updatePositionTitle(${pos.position_id})" class="btn-small btn-primary">Update</button>
                  <button class="btn-cancel" onclick="togglePostEdit(${pos.position_id}, false)" style="background: #ccc; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Cancel</button>
              </div>
          </div>
      `).join('');

  } catch (err) {
      console.error("Error loading postings:", err);
  }
}

async function loadCompanyApplications() {
  const container = document.getElementById('companyApplicationsContainer');
  if (!container || !currentProfile) return;

  try {
    const { data: positions, error: posErr } = await supabaseClient
      .from('positions')
      .select('position_id, title')
      .eq('company_id', currentProfile.company_id);

    if (posErr) throw posErr;

    const positionIds = (positions || []).map(p => p.position_id);
    if (!positionIds.length) {
      container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No applications yet.</p>';
      return;
    }

    const { data: apps, error: appErr } = await supabaseClient
      .from('applications')
      .select('application_id, position_id, student_id, status, applied_at, positions(title)')
      .in('position_id', positionIds)
      .order('applied_at', { ascending: false });

    if (appErr) throw appErr;

    if (!apps || !apps.length) {
      container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No applications yet.</p>';
      return;
    }

    container.innerHTML = apps.map(app => `
      <div class="application-item">
        <p style="margin:0; font-weight:600;">${app.positions?.title || 'Position'}</p>
        <span class="status-badge status-${app.status}">${app.status}</span>
        <p style="margin:0.25rem 0 0; font-size:0.8rem; color:var(--text-light);">${new Date(app.applied_at).toLocaleDateString()}</p>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error loading company applications:', err);
    container.innerHTML = '<p style="color: var(--text-light); text-align: center;">Unable to load applications.</p>';
  }
}

// --- Toggle Edit for a specific job row ---
function togglePostEdit(id, show) {
  document.getElementById(`view-mode-${id}`).style.display = show ? 'none' : 'block';
  document.getElementById(`edit-mode-${id}`).style.display = show ? 'block' : 'none';
}

async function handleFormSubmit() {
  const editId = document.getElementById('editPositionId').value;
  const submitBtn = document.getElementById('submitPostBtn');
  
  const postData = {
      company_id: currentProfile.company_id,
      title: document.getElementById('pTitle').value.trim(),
      description: document.getElementById('pDesc').value,
      status: document.getElementById('pStatus').value,
      category_id: document.getElementById('pCategory').value ? parseInt(document.getElementById('pCategory').value) : null,
      period_start: document.getElementById('pStart').value || null,
      period_end: document.getElementById('pEnd').value || null,
      is_open_ended: document.getElementById('pOpenEnded').checked
  };

  submitBtn.disabled = true;

  try {
      let result;
      if (editId) {
          // UPDATE existing row
          result = await supabaseClient
              .from('positions')
              .update(postData)
              .eq('position_id', editId);
      } else {
          // INSERT new row
          result = await supabaseClient
              .from('positions')
              .insert([postData]);
      }

      if (result.error) throw result.error;

      alert(editId ? "Updated!" : "Posted!");
      closePostModal();
      loadCompanyPostings(); // Refresh the list

  } catch (err) {
      alert("Error: " + err.message);
  } finally {
      submitBtn.disabled = false;
  }
}

function updateNavLogo(url) {
  const navLogo = document.getElementById('navCompanyLogo'); // Ensure this ID is in your header
  if (navLogo) {
      // Add a timestamp to the URL to force a refresh
      navLogo.src = `${url}?t=${new Date().getTime()}`;
      navLogo.style.display = 'block';
  }
}

function fillCompanyLogo(profile) {
  const avatarImg = document.getElementById('avatarImg');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');
  const companyLogoDiv = document.getElementById('companyLogoDiv');
  const companyLogoPlaceholder = document.getElementById('companyLogoPlaceholder');

  if (profile && profile.logo_url) {
    const freshUrl = `${profile.logo_url.split('?')[0]}?t=${new Date().getTime()}`;

    if (avatarImg) {
      avatarImg.src = freshUrl;
      avatarImg.style.display = 'block';
      avatarImg.style.objectFit = 'cover';
    }
    if (avatarPlaceholder) {
      avatarPlaceholder.style.display = 'none';
    }

    if (companyLogoDiv) {
      companyLogoDiv.style.backgroundImage = `url('${freshUrl}')`;
      companyLogoDiv.style.backgroundSize = 'cover';
      companyLogoDiv.style.backgroundPosition = 'center';
      companyLogoDiv.textContent = '';
    }
    if (companyLogoPlaceholder) {
      companyLogoPlaceholder.style.display = 'none';
    }

    if (typeof initUserMenu === 'function') {
      initUserMenu();
    }
    return;
  }

  // If profile has no logo, show placeholders
  if (companyLogoDiv) {
    companyLogoDiv.style.backgroundImage = '';
    companyLogoDiv.textContent = '🏢';
  }
  if (companyLogoPlaceholder) {
    companyLogoPlaceholder.style.display = '';
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
    const datalist = document.getElementById('citySuggestions');
    if (!datalist) return;

    // 1. CLEAR list immediately if query is too short
    if (!query || query.length < 2) {
        datalist.innerHTML = ''; 
        return;
    }

    try {
        // Broad search for speed, we filter the "city" part manually below
        const url = `https://api.digitransit.fi/geocoding/v1/autocomplete?text=${encodeURIComponent(query)}&boundary.country=FIN&size=20`;

        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'digitransit-subscription-key': DIGITRANSIT_API_KEY 
            }
        });

        if (!response.ok) return;

        const data = await response.json();
        const uniqueCities = new Set();
        
        // 2. Clear previous options before adding new ones
        datalist.innerHTML = ''; 

        if (data.features) {
            data.features.forEach(feature => {
                const props = feature.properties;
                
                // 3. PRIORITY: Take the 'locality' (this is the actual City name)
                const cityName = props.locality || props.name;

                // 4. FILTER: If it has a number or a street ending, SKIP IT
                const hasNumber = /\d/.test(cityName);
                const isStreet = cityName.toLowerCase().endsWith('tie') || 
                                 cityName.toLowerCase().endsWith('katu') || 
                                 cityName.toLowerCase().endsWith('kuja');

                if (!hasNumber && !isStreet && !uniqueCities.has(cityName)) {
                    uniqueCities.add(cityName);
                    
                    const option = document.createElement('option');
                    option.value = cityName;
                    datalist.appendChild(option);
                }
            });
        }
    } catch (err) {
        console.error('City Search Error:', err);
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
  document.getElementById('eAbout').value = currentProfile.about || '';
  document.getElementById('ePracticeStart').value = currentProfile.practice_start || '';
  document.getElementById('ePracticeEnd').value = currentProfile.practice_end || '';
  document.getElementById('eOpenToOffers').checked = currentProfile.is_open_to_offers;

  const container = document.getElementById('eEducationContainer');
  if (container) {
    container.innerHTML = ''; 
    if (currentProfile.education_history && currentProfile.education_history.length > 0) {
      currentProfile.education_history.forEach(edu => {
        addEducationRow(edu); 
      });
    } else {
      addEducationRow(); 
    }
  }
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
  const saveBtn = document.getElementById('saveProfileBtn');
  const session = getCurrentSession();
  if (!session || !currentProfile) return;

  
  saveBtn.disabled = true;
  saveBtn.textContent = 'Saving...';

  try {

    const educationEntries = getEducationData();

    const updates = {
      first_name: document.getElementById('eFirstName').value.trim() || null,
      last_name: document.getElementById('eLastName').value.trim() || null,
      birth_date: document.getElementById('eBirthDate').value || null,
      phone: document.getElementById('ePhone').value.trim() || null,
      city: document.getElementById('eCity').value.trim() || null,
      education_history: educationEntries,
      type_education: educationEntries.length > 0 ? educationEntries[0].name : null,
      about: document.getElementById('eAbout').value.trim() || null,
      practice_start: document.getElementById('ePracticeStart').value || null,
      practice_end: document.getElementById('ePracticeEnd').value || null,
      is_open_to_offers: document.getElementById('eOpenToOffers').checked,
      updated_at: new Date().toISOString()
    };

    // Update profile
    const { error: updateError } = await supabaseClient
      .from('student_profiles')
      .update(updates)
      .eq('id', currentProfile.id);

    if (updateError) {
      throw new Error('Error saving profile: ' + updateError.message);
    }

    // Update categories: delete old, insert new
    const { error: categoryDeleteError } = await supabaseClient
      .from('student_categories')
      .delete()
      .eq('student_id', currentProfile.id);

    if (categoryDeleteError) throw new Error('Category cleanup failed: ' + categoryDeleteError.message);

    // 2. Save Categories (Optional/Safety check)
    if (typeof selectedCategoryIds !== 'undefined') {
        if (selectedCategoryIds.length > 0) {
            const catRows = selectedCategoryIds.map(catId => ({ student_id: currentProfile.id, category_id: catId }));
            const { error: categoryInsertError } = await supabaseClient.from('student_categories').insert(catRows);
            if (categoryInsertError) throw new Error('Category insert failed: ' + categoryInsertError.message);
        }
    }

    // 3. Save links
    await saveLinks();

    // 4. UPDATE LOCAL STATE AND REFRESH UI
    Object.assign(currentProfile, updates);

    fillDisplayMode(currentProfile, session);
    updateEducationDisplay(educationEntries);
    cancelEditMode();
    alert('Profile saved successfully!');

  } catch (err) {
    console.error('Save error:', err);
    alert(err.message || 'An error occurred while saving.');
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

async function uploadLogo(input) {
  const file = input.files[0];
  
  // 1. Basic checks (Must have file and profile loaded)
  if (!file || !currentProfile) return;

  // 2. Check Session (Must be logged in)
  const session = getCurrentSession();
  if (!session) {
    alert("Please log in to upload a logo.");
    return;
  }

  // 3. Size Validation (Max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('Logo must be under 2 MB.');
    return;
  }

  const ext = file.name.split('.').pop();
  // Using company_id to keep folder organized
  const filePath = `company_${currentProfile.company_id}/logo.${ext}`;

  try {
    // 4. Upload to 'fotot' bucket (upsert: true overwrites existing file)
    const { error: uploadError } = await supabaseClient.storage
      .from('foto')
      .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600' 
      });

    if (uploadError) {
      alert('Upload error: ' + uploadError.message);
      return;
    }

    // 5. Get Public URL
    const { data: urlData } = supabaseClient.storage
      .from('foto')
      .getPublicUrl(filePath);

    const logoUrl = urlData.publicUrl;

    // 6. Save URL to 'Companies' table
    // Adding a timestamp to the URL (logoUrl?t=...) trick the browser into 
    // showing the new image immediately instead of the old cached one
    const finalUrl = `${logoUrl}?t=${new Date().getTime()}`;

    const { error: updateError } = await supabaseClient
      .from('Companies')
      .update({ 
          logo_url: finalUrl, 
          updated_at: new Date().toISOString() 
      })
      .eq('company_id', currentProfile.company_id);

    if (updateError) throw updateError;

    currentProfile.logo_url = finalUrl;
    
    // Ensure this matches your UI update function name
    if (typeof fillCompanyLogo === 'function') {
        fillCompanyLogo(currentProfile);
    } else {
        // Fallback: manually update the elements
        const logoImg = document.getElementById('avatarImg');
        const placeholder = document.getElementById('avatarPlaceholder');
        if (logoImg) {
            logoImg.src = finalUrl;
            logoImg.style.display = 'block';
        }
        if (placeholder) placeholder.style.display = 'none';
    }

    alert('Logo updated successfully!');

  } catch (err) {
    console.error('Logo upload error:', err);
    alert('Failed to upload logo.');
  }
}
// ==========================================
// CV FILE (Supabase Storage: practice-files)
// ==========================================
// 1. THE UPLOAD FUNCTION
async function uploadCV(input) {
  const file = input.files[0];
  if (!file || !currentProfile) return;

  const BUCKET_NAME = 'practice-files'; 
  
  const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const filePath = `user_${currentProfile.id}/${Date.now()}_${safeName}`;

  try {
    const infoDiv = document.getElementById('cvFileInfo');
    if (infoDiv) infoDiv.innerHTML = '<p class="text-muted">Uploading...</p>';


    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseClient.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    const { error: dbError } = await supabaseClient
      .from('student_profiles')
      .update({ 
        cv_url: urlData.publicUrl,
        cv_original_name: file.name
      })
      .eq('id', currentProfile.id);

    if (dbError) throw dbError;


    currentProfile.cv_url = urlData.publicUrl;
    currentProfile.cv_original_name = file.name;

    renderCVList(); 
    alert('CV Uploaded successfully!');

  } catch (err) {
    console.error('Upload Error:', err);
    alert('Note: ' + err.message);
    renderCVList(); 
  }
}

// 3. THE DELETE FUNCTION
async function deleteCV() {
  if (!confirm("Are you sure you want to remove this CV?")) return;

  try {
    const { error } = await supabaseClient
      .from('student_profiles')
      .update({ 
        cv_url: null, 
        cv_original_name: null 
      })
      .eq('id', currentProfile.id);

    if (error) throw error;

    currentProfile.cv_url = null;
    currentProfile.cv_original_name = null;
    
    renderCVList();
    alert("CV removed from profile.");
    
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete: " + err.message);
  }
}

// 4. ALIAS FOR COMPATIBILITY
function fillCvInfo() {
    renderCVList();
}

function fillCompanyCvInfo() {
    renderCompanyCvList();
}

function renderCVList() {
  const container = document.getElementById('cvFileInfo');
  if (!container || !currentProfile || !currentProfile.cv_url) {
    if (container) container.innerHTML = '<p class="text-muted">No CV uploaded yet.</p>';
    return;
  }

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; background: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px solid #dee2e6;">
      <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
        <span>📄</span>
        <span style="font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
          ${currentProfile.cv_original_name || 'Resume.pdf'}
        </span>
      </div>
      <div style="display: flex; gap: 6px;">
        <a href="${currentProfile.cv_url}" target="_blank" 
           style="background: #007bff; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 0.8rem;">
           Download
        </a>
        <button onclick="deleteCV()" 
           style="background: #dc3545; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
           ✕
        </button>
      </div>
    </div>
  `;
}


function renderCompanyCvList() {
  const container = document.getElementById('companyCvFileInfo');
  if (!container || !currentProfile || !currentProfile.company_cv_url) {
    if (container) container.innerHTML = '<p class="text-muted">No document uploaded yet.</p>';
    return;
  }

  container.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; background: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px solid #dee2e6;">
      <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
        <span>📄</span>
        <span style="font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
          ${currentProfile.company_cv_original_name || 'CompanyProfile.pdf'}
        </span>
      </div>
      <div style="display: flex; gap: 6px;">
        <a href="${currentProfile.company_cv_url}" target="_blank" style="background: #007bff; color: white; padding: 4px 10px; border-radius: 4px; text-decoration: none; font-size: 0.8rem;">Download</a>
      </div>
    </div>`;
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