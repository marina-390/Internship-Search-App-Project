const DIGITRANSIT_API_KEY = '4346b471f4ea41cb923eb2b40556c495';
/* ==========================================
   STUDENT PROFILE (Supabase)
   ========================================== */

// Format date to European format DD.MM.YYYY
function formatDateEuropean(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

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
    await loadPracticeRequests(profile.id);
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
    showToast("Position updated!", 'success');
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
  setField('dBirthDate', formatDateEuropean(profile.birth_date));
  setField('dPhone', profile.phone);
  setField('dCity', profile.city);
  setField('dEducation', profile.type_education);
  setField('dAbout', profile.about);
  setField('dPracticeStart', formatDateEuropean(profile.practice_start));
  setField('dPracticeEnd', formatDateEuropean(profile.practice_end));

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
        showToast("Name and Job Title are required.", 'warning');
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
            showToast("Member updated successfully!", 'success');
        } else {
            // --- MODE: INSERT ---
            const { data, error } = await supabaseClient
                .from('company_team')
                .insert([memberData])
                .select();

            if (error) throw error;

            currentTeam.push(data[0]);
            showToast("Member added successfully!", 'success');
        }

        // Refresh UI and close form
        fillTeamDisplay();
        hideAddMemberForm();

    } catch (err) {
        console.error("Database Error:", err.message);
        showToast("Error: " + err.message, 'error');
    }
}

/**
 * Deletes member from DB and UI
 */
async function deleteTeamMember(id) {
    if (!await showConfirm("Are you sure you want to remove this member?", "Remove")) return;

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
      // Auto-populate email if missing from Users.user_login
if (!profile.contact_email) {
        const { data: userData } = await supabaseClient
          .from('Users')
          .select('user_login')
          .eq('user_id', session.userId)
          .single();
        
        if (userData && userData.user_login) {
          const emailValue = userData.user_login;
          if (emailValue !== profile.contact_email) {
            const { error: updateError } = await supabaseClient
              .from('Companies')
              .update({ contact_email: emailValue, updated_at: new Date().toISOString() })
              .eq('company_id', profile.company_id);
            
            if (!updateError) {
              profile.contact_email = emailValue;
              console.log('Auto-set company email from Users.user_login:', profile.contact_email);
            } else {
              console.warn('Failed to auto-set email:', updateError.message);
            }
          }
        }
      }
      
      currentProfile = profile; 
      fillCompanyDisplay(profile, session);
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
function fillCompanyDisplay(profile, session) {
    if(document.getElementById('dCompanyName')) 
        document.getElementById('dCompanyName').innerText = profile.company_name || '';
    
    if(document.getElementById('dCompanyEmail')) 
        document.getElementById('dCompanyEmail').innerText = profile.contact_email || session.login || 'Not set';
    
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
        showToast("You must be logged in to save.", 'warning');
        return;
    }

    const saveBtn = document.getElementById('saveCompanyBtn');
    const emailInput = document.getElementById('eCompanyEmail');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = 'Saving...';
    }

    try {
        const updates = {
            company_name: document.getElementById('eCompanyName').value.trim(),
            contact_email: emailInput ? emailInput.value.trim() : session.login,
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
        document.getElementById('dCompanyEmail').innerText = updates.contact_email;
        document.getElementById('dCompanyDesc').innerText = updates.description;
        document.getElementById('dHeadquarters').innerText = updates.city;
        document.getElementById('dTeamSize').innerText = updates.y_tunnus;
        if(document.getElementById('dYTunnus'))
            document.getElementById('dYTunnus').innerText = updates.y_tunnus;
        document.getElementById('dWebsite').innerText = updates.website;

        // Update local cache so toggleCompanyEdit pre-fills correctly next time
        Object.assign(currentProfile, updates);
        toggleCompanyEdit(false);
        showToast("Profile updated successfully!", 'success');

    } catch (err) {
        console.error("Full Save Error:", err);
        showToast("Save failed: " + (err.message || "Unknown error"), 'error');
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
      document.getElementById('pRespon').value = data.responsibilities || "";
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
      showToast("Error loading data: " + err.message, 'error');
  }
}

// Handles both INSERT and UPDATE
async function submitPosition() {
  const editId = document.getElementById('editPositionId').value;
  const submitBtn = document.getElementById('submitPostBtn');
  
  if (!currentProfile) { showToast("Profile not loaded.", 'warning'); return; }

  const postData = {
      company_id: currentProfile.company_id,
      title: document.getElementById('pTitle').value.trim(),
      description: document.getElementById('pDesc').value,
      responsibilities: document.getElementById('pRespon').value,
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

      showToast(editId ? "Updated!" : "Posted!", 'success');
      closePostModal();
      loadCompanyPostings();
  } catch (err) {
      showToast("Error: " + err.message, 'error');
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
  if (!await showConfirm("Are you sure you want to delete this posting?", "Delete")) return;

  try {
      const { error } = await supabaseClient
          .from('positions')
          .delete()
          .eq('position_id', id);

      if (error) throw error;
      loadCompanyPostings(); // Refresh the list
  } catch (err) {
      showToast(err.message, 'error');
  }
}

function toggleReqText(id) {
  const shortEl = document.getElementById('req-short-' + id);
  const fullEl  = document.getElementById('req-full-'  + id);
  const btn     = document.getElementById('req-btn-'   + id);
  const isExpanded = fullEl.style.display !== 'none';
  shortEl.style.display = isExpanded ? 'inline' : 'none';
  fullEl.style.display  = isExpanded ? 'none'   : 'inline';
  btn.textContent       = isExpanded ? 'Show more' : 'Show less';
}

// --- Load and Display Postings ---
async function loadCompanyPostings() {
  const container = document.getElementById('companyPostingsList');
  if (!container || !currentProfile) return;

  try {
      // Fetch positions with application counts in one query
      const { data: positions, error } = await supabaseClient
          .from('positions')
          .select('position_id, title, status, requirements, applications(count)')
          .eq('company_id', currentProfile.company_id)
          .order('created_at', { ascending: false });

      if (error) throw error;

      if (!positions || positions.length === 0) {
          container.innerHTML = '<p style="text-align:center; color:var(--text-light); font-size:0.85rem;">No postings yet.</p>';
          return;
      }

      const statusColors = {
        active: 'background:#d1fae5;color:#065f46;',
        draft:  'background:#f3f4f6;color:#374151;',
        closed: 'background:#fee2e2;color:#991b1b;'
      };

      container.innerHTML = positions.map(pos => {
          const appCount = pos.applications?.[0]?.count ?? 0;
          const sc = statusColors[pos.status] || '';
          return `
          <div class="position-card" id="posting-${pos.position_id}">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="flex:1;">
                  <h4>${pos.title}</h4>
                  <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.25rem;">
                    <span class="status-badge" style="${sc}">${pos.status}</span>
                    <span style="font-size:0.78rem; color:var(--text-light);">👥 ${appCount} application${appCount !== 1 ? 's' : ''}</span>
                  </div>
                  ${pos.requirements ? `
                  <p id="req-${pos.position_id}" style="font-size:0.82rem;color:var(--text-light);margin:0.35rem 0 0.1rem;line-height:1.4;">
                    <span id="req-short-${pos.position_id}">${pos.requirements.length > 120 ? pos.requirements.slice(0, 120) + '…' : pos.requirements}</span>
                    ${pos.requirements.length > 120 ? `
                    <span id="req-full-${pos.position_id}" style="display:none;">${pos.requirements}</span>
                    <a href="javascript:void(0)" id="req-btn-${pos.position_id}" onclick="toggleReqText(${pos.position_id})" style="font-size:0.78rem;margin-left:0.25rem;">Show more</a>` : ''}
                  </p>` : ''}
                  <div class="pos-actions">
                      <a href="internship-detail.html?id=${pos.position_id}" class="text-primary">View</a>
                      <a href="javascript:void(0)" onclick="openEditModal(${pos.position_id})" class="text-primary">Edit</a>
                      <a href="javascript:void(0)" onclick="deletePosition(${pos.position_id})" style="color:#dc3545;">Delete</a>
                  </div>
                  ${appCount > 0 ? `
                  <div style="margin-top:0.75rem; border-top:1px solid #f0f0f0; padding-top:0.5rem;">
                    <button id="pos-apps-btn-${pos.position_id}" onclick="togglePositionApplicants(${pos.position_id}, ${appCount})"
                      style="background:none; border:none; cursor:pointer; color:#6366f1; font-size:0.85rem; font-weight:600; padding:0; display:flex; align-items:center; gap:0.3rem;">
                      <span id="pos-apps-arrow-${pos.position_id}">▼</span> Applications (${appCount})
                    </button>
                    <div id="pos-apps-${pos.position_id}" style="display:none; margin-top:0.75rem;"></div>
                  </div>` : ''}
                </div>
              </div>
          </div>`;
      }).join('');

  } catch (err) {
      console.error("Error loading postings:", err);
      container.innerHTML = '<p style="color:red; font-size:0.85rem;">Error loading postings.</p>';
  }
}

async function togglePositionApplicants(positionId, appCount) {
  const container = document.getElementById(`pos-apps-${positionId}`);
  const arrow     = document.getElementById(`pos-apps-arrow-${positionId}`);
  if (!container) return;

  const isOpen = container.dataset.open === 'true';
  if (isOpen) {
    container.style.display = 'none';
    container.dataset.open = 'false';
    arrow.textContent = '▼';
    return;
  }

  container.style.display = 'block';
  container.dataset.open = 'true';
  arrow.textContent = '▲';

  if (container.dataset.loaded) return;

  container.innerHTML = '<p style="color:#888; font-size:0.85rem; padding:0.5rem 0;">Loading...</p>';

  try {
    const { data: apps, error } = await supabaseClient
      .from('applications')
      .select('*, interview_date, positions(title), student_profiles(*, Users(user_login))')
      .eq('position_id', positionId)
      .order('applied_at', { ascending: false });

    if (error) throw error;

    if (!apps || apps.length === 0) {
      container.innerHTML = '<p style="color:#888; font-size:0.85rem;">No applications yet.</p>';
      container.dataset.loaded = 'true';
      return;
    }

    container.innerHTML = apps.map(app => {
      const status       = app.status || 'pending';
      const studentName  = app.student_profiles ? `${app.student_profiles.first_name || ''} ${app.student_profiles.last_name || ''}`.trim() || 'Applicant' : 'Applicant';
      const studentEmail = app.student_profiles?.contact_email || app.student_profiles?.Users?.user_login || '';
      const appliedDate  = formatDateEuropean(app.applied_at);
      const existingDate = app.interview_date || '';
      const interviewDate = app.interview_date
        ? `<p style="margin:0.3rem 0 0; font-size:0.82rem; color:#059669;">📅 ${formatDateEuropean(app.interview_date)} ${new Date(app.interview_date).toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'})}</p>`
        : '';
      const interviewBtn = app.interview_date
        ? `<button class="btn btn-small" style="font-size:0.78rem; background:#d1fae5; color:#065f46;" onclick="scheduleInterviewProfile('${studentName}', '${studentEmail}', '${app.positions?.title || ''}', ${app.application_id}, '${existingDate}')">✅ Scheduled</button>`
        : `<button class="btn btn-small btn-primary" style="font-size:0.78rem;" onclick="scheduleInterviewProfile('${studentName}', '${studentEmail}', '${app.positions?.title || ''}', ${app.application_id}, '')">📅 Schedule Interview</button>`;
      return `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; padding:0.75rem 0; border-top:1px solid #f3f4f6;">
          <div style="flex:1; min-width:0;">
            <p style="margin:0; font-weight:600; color:#374151;">${studentName}</p>
            <p style="margin:0.15rem 0 0; font-size:0.85rem; color:#6b7280;">${studentEmail}</p>
            <p style="margin:0.25rem 0 0; font-size:0.82rem; color:#9ca3af;">Applied: ${appliedDate}</p>
            <p style="margin:0.25rem 0 0; font-size:0.82rem;">Status: <span class="status-badge status-${status}">${status.replace('_', ' ')}</span></p>
            ${interviewDate}
          </div>
          <div style="display:flex; gap:0.4rem; flex-shrink:0; flex-wrap:wrap;">
            <button class="btn btn-small btn-view" onclick="openCompanyAppModal(${JSON.stringify(app).replace(/"/g, '&quot;')})">View</button>
            ${interviewBtn}
          </div>
        </div>`;
    }).join('');

    container.dataset.loaded = 'true';
  } catch (err) {
    container.innerHTML = `<p style="color:red; font-size:0.85rem;">Error: ${err.message}</p>`;
  }
}

async function loadCompanyApplications() {
  const container = document.getElementById('companyApplicationsContainer');
  if (!container || !currentProfile) return;

  try {
    const { data: positions, error: posErr } = await supabaseClient
      .from('positions')
      .select('position_id')
      .eq('company_id', currentProfile.company_id);

    if (posErr) throw posErr;

    const positionIds = (positions || []).map(p => p.position_id);
    if (!positionIds.length) {
      container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No applications yet.</p>';
      return;
    }

    const { data: apps, error: appErr } = await supabaseClient
      .from('applications')     
      .select('*, positions(title), student_profiles(*, Users(user_login))')     
      .in('position_id', positionIds)
      .order('applied_at', { ascending: false });

    if (appErr) throw appErr;

    fillCompanyApplications(apps || []);
  } catch (err) {
    console.error('Error loading company applications:', err);
    container.innerHTML = '<p style="color: var(--text-light); text-align: center;">Unable to load applications.</p>';
  }
}

function fillCompanyApplications(applications) {
  const container = document.getElementById('companyApplicationsContainer');
  if (!container) return;

  if (!applications || applications.length === 0) {
    container.innerHTML = '<p style="color: var(--text-light); text-align: center;">No applications yet.</p>';
    return;
  }

  container.innerHTML = applications.map(app => {
    const appData = JSON.stringify(app).replace(/"/g, '&quot;');
    const status = app.status || 'pending';
    const responseSnippet = app.company_response ? `<div style="margin-top:0.5rem; color:#555;"><strong>Response:</strong> ${app.company_response}</div>` : '';

    const studentFullName = app.student_profiles ? `${app.student_profiles.first_name || ''} ${app.student_profiles.last_name || ''}`.trim() || 'Applicant' : 'Applicant';
    const studentEmail = app.student_profiles?.contact_email || app.student_profiles?.Users?.user_login || '';
    const positionTitle = app.positions?.title || 'Position';
    const interviewDate = app.interview_date
      ? `<p style="margin:0.4rem 0 0; font-size:0.85rem; color:#059669;">📅 Interview: ${formatDateEuropean(app.interview_date)} ${new Date(app.interview_date).toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'})}</p>`
      : '';
    const existingDate = app.interview_date ? app.interview_date : '';
    const interviewBtn = app.interview_date
      ? `<button class="btn btn-small" style="font-size:0.78rem; background:#d1fae5; color:#065f46;" onclick="scheduleInterviewProfile('${studentFullName}', '${studentEmail}', '${positionTitle}', ${app.application_id}, '${existingDate}')">✅ Scheduled</button>`
      : `<button class="btn btn-small btn-primary" style="font-size:0.78rem;" onclick="scheduleInterviewProfile('${studentFullName}', '${studentEmail}', '${positionTitle}', ${app.application_id}, '')">📅 Schedule Interview</button>`;
    return `
      <div class="application-card" id="company-app-${app.application_id}" style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap;">
        <div style="min-width:0; flex:1;">
          <h5 style="margin:0 0 0.5rem 0; font-size:1rem;">${positionTitle}</h5>
          <p style="margin:0; color:#374151; font-weight:600;">${studentFullName}</p>
          <p style="margin:0.25rem 0 0; font-size:0.9rem; color:#6b7280;">${studentEmail}${app.student_profiles?.phone ? ' · ' + app.student_profiles.phone : ''}</p>
          <p style="margin:0.75rem 0 0; font-size:0.85rem; color:#6b7280;">Applied: ${formatDateEuropean(app.applied_at)}</p>
          <p style="margin:0.4rem 0 0; font-size:0.85rem;">Status: <span class="status-badge status-${status}">${status}</span></p>
          ${interviewDate}
          ${responseSnippet}
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button class="btn btn-view" onclick="openCompanyAppModal(${appData})">View</button>
          ${interviewBtn}
        </div>
      </div>
    `;
  }).join('');
}

function toLocalInputValue(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function scheduleInterviewProfile(fullName, email, positionTitle, applicationId, existingDate) {
  let modal = document.getElementById('interviewDateModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'interviewDateModal';
    modal.style.cssText = 'position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div style="background:white;padding:2rem;border-radius:12px;width:90%;max-width:400px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
        <h3 id="interviewModalTitle" style="margin-top:0;">Schedule Interview</h3>
        <p id="interviewModalDesc" style="color:#6b7280;margin-bottom:1rem;"></p>
        <div class="form-group">
          <label>Date &amp; Time</label>
          <input type="datetime-local" id="interviewDateInput" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:6px;">
        </div>
        <div style="display:flex;gap:0.5rem;margin-top:1.5rem;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="confirmInterviewSchedule()">Confirm &amp; Open Calendar</button>
          <button id="cancelInterviewBtn" class="btn btn-outline" style="color:#dc2626;border-color:#dc2626;display:none;" onclick="cancelInterviewProfile()">Cancel Interview</button>
          <button class="btn btn-outline" onclick="document.getElementById('interviewDateModal').style.display='none'">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal._data = { fullName, email, positionTitle, applicationId };
  document.getElementById('interviewModalDesc').textContent = `${fullName} — ${positionTitle}`;
  document.getElementById('interviewModalTitle').textContent = existingDate ? 'Reschedule Interview' : 'Schedule Interview';
  document.getElementById('cancelInterviewBtn').style.display = existingDate ? 'inline-block' : 'none';

  const input = document.getElementById('interviewDateInput');
  if (existingDate) {
    input.value = toLocalInputValue(new Date(existingDate));
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    input.value = toLocalInputValue(tomorrow);
  }

  modal.style.display = 'flex';
}

async function cancelInterviewProfile() {
  const modal = document.getElementById('interviewDateModal');
  const { applicationId } = modal._data;
  modal.style.display = 'none';
  try {
    const { error } = await supabaseClient
      .from('applications')
      .update({ interview_date: null, status: 'pending' })
      .eq('application_id', applicationId);
    if (error) throw error;
    showToast('Interview cancelled.', 'info');
    await loadCompanyApplications();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function confirmInterviewSchedule() {
  const modal = document.getElementById('interviewDateModal');
  const { fullName, email, positionTitle, applicationId } = modal._data;
  const dateValue = document.getElementById('interviewDateInput').value;

  if (!dateValue) { showToast('Please select a date and time.', 'error'); return; }

  modal.style.display = 'none';

  const date    = new Date(dateValue);
  const endDate = new Date(date.getTime() + 60 * 60 * 1000);

  try {
    const { error } = await supabaseClient
      .from('applications')
      .update({ interview_date: date.toISOString(), status: 'interview_scheduled' })
      .eq('application_id', applicationId);
    if (error) throw error;
    showToast('Interview scheduled!', 'success');
    await loadCompanyApplications();
  } catch (err) {
    showToast('Error saving: ' + err.message, 'error');
  }

  const fmt     = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const title   = encodeURIComponent(`Internship Interview - ${fullName}`);
  const details = encodeURIComponent(`Interview with ${fullName} for ${positionTitle}`);
  const guest   = encodeURIComponent(email);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${fmt(date)}/${fmt(endDate)}&add=${guest}`;
  window.open(url, '_blank');
}

function openCompanyAppModal(app) {
  const modal = document.getElementById('companyAppModal');
  if (!modal) return;

  document.getElementById('companyAppId').value = app.application_id;

  // Store student_id so "View Student Profile" button can use it
  const studentIdEl = document.getElementById('companyAppStudentId');
  if (studentIdEl) studentIdEl.value = app.student_id || '';

  document.getElementById('companyAppPosition').textContent = app.positions?.title || 'Position';
  document.getElementById('companyAppName').textContent = app.full_name || 'Applicant';
  document.getElementById('companyAppEmail').textContent = app.email || 'No email provided';
  document.getElementById('companyAppPhone').textContent = app.phone || 'No phone provided';
  document.getElementById('companyAppStatus').textContent = app.status || 'pending';
  document.getElementById('companyAppCoverLetter').textContent = app.cover_letter || 'No cover letter provided.';

  const cvLink = document.getElementById('companyAppCvLink');
  if (cvLink) {
    cvLink.innerHTML = app.cv_url
      ? `<a href="${app.cv_url}" target="_blank" rel="noreferrer noopener">Download CV</a>`
      : 'No CV uploaded.';
  }

  document.getElementById('companyAppResponse').value = app.company_response || '';
  modal.style.display = 'block';
}

// ==========================================
// STUDENT PROFILE MODAL (read-only, for company reviewers)
// ==========================================
async function openStudentProfileModal(studentId) {
  if (!studentId) { showToast('No student ID available.', 'warning'); return; }

  const modal   = document.getElementById('studentProfileModal');
  const loading = document.getElementById('spLoading');
  const content = document.getElementById('spContent');
  const errorEl = document.getElementById('spError');
  if (!modal) return;

  // Reset to loading state
  modal.style.display = 'block';
  loading.style.display = 'block';
  content.style.display = 'none';
  errorEl.style.display  = 'none';

  try {
    // Fetch profile, categories and links in parallel
    const [profileRes, catsRes, linksRes] = await Promise.all([
      supabaseClient.from('student_profiles').select('*').eq('id', studentId).single(),
      supabaseClient.from('student_categories')
        .select('category_id, job_categories(title)')
        .eq('student_id', studentId),
      supabaseClient.from('Student_links')
        .select('*').eq('student_id', studentId).order('created_at')
    ]);

    if (profileRes.error || !profileRes.data) throw new Error('Profile not found');

    const p     = profileRes.data;
    const cats  = catsRes.data  || [];
    const links = linksRes.data || [];

    // --- Avatar ---
    const avatarEl = document.getElementById('spAvatar');
    if (p.photo_url) {
      avatarEl.innerHTML = `<img src="${p.photo_url}" style="width:100%;height:100%;object-fit:cover;" />`;
    } else {
      const initials = [(p.first_name || ''), (p.last_name || '')]
        .map(n => n.charAt(0).toUpperCase()).join('') || '👤';
      avatarEl.textContent = initials;
    }

    // --- Name / city / phone ---
    document.getElementById('spFullName').textContent =
      `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown Applicant';
    document.getElementById('spCity').textContent  = p.city  ? `📍 ${p.city}`  : '';
    document.getElementById('spPhone').textContent = p.phone ? `📞 ${p.phone}` : '';

    // --- About ---
    const aboutWrap = document.getElementById('spAboutWrap');
    document.getElementById('spAbout').textContent = p.about || 'No description provided.';
    aboutWrap.style.display = p.about ? '' : 'none';

    // --- Education ---
    const eduEl   = document.getElementById('spEdu');
    const eduWrap = document.getElementById('spEduWrap');
    const eduData = p.education_history;
    if (Array.isArray(eduData) && eduData.length > 0) {
      eduEl.innerHTML = eduData.map(e => `
        <div style="padding:0.35rem 0; border-bottom:1px solid #f3f4f6; display:flex; gap:0.5rem; align-items:baseline;">
          <span style="font-weight:600; color:#1f2937;">${e.name}</span>
          <span style="font-size:0.82rem; color:#6b7280;">${e.type || ''}${e.year ? ' · ' + e.year : ''}</span>
        </div>`).join('');
    } else if (p.type_education) {
      eduEl.innerHTML = `<span style="color:#374151;">${p.type_education}</span>`;
    } else {
      eduWrap.style.display = 'none';
    }

    // --- Practice period ---
    document.getElementById('spPractice').textContent =
      (p.practice_start || p.practice_end)
        ? `${formatDateEuropean(p.practice_start)} – ${formatDateEuropean(p.practice_end)}`
        : 'Not specified';
    document.getElementById('spOpen').innerHTML = p.is_open_to_offers
      ? '<span style="color:#059669; font-weight:600;">✅ Open to offers</span>'
      : '<span style="color:#6b7280;">Not currently open to offers</span>';

    // --- Categories ---
    const catsEl   = document.getElementById('spCats');
    const catsWrap = document.getElementById('spCatsWrap');
    if (cats.length > 0) {
      catsEl.innerHTML = cats.map(c =>
        `<span style="background:#eef2ff; color:#4f46e5; padding:0.25rem 0.65rem; border-radius:2rem; font-size:0.82rem; font-weight:600;">${c.job_categories?.title || ''}</span>`
      ).join('');
    } else {
      catsWrap.style.display = 'none';
    }

    // --- Links ---
    const linksEl   = document.getElementById('spLinks');
    const linksWrap = document.getElementById('spLinksWrap');
    const LINK_ICONS_SP = { github:'🔗', linkedin:'👤', portfolio:'🌐', other:'🔗' };
    if (links.length > 0) {
      linksEl.innerHTML = links.map(l =>
        `<div style="margin-bottom:0.3rem;">${LINK_ICONS_SP[l.link_type] || '🔗'} <a href="${l.url}" target="_blank" rel="noopener" style="color:#4f46e5;">${l.label || l.link_type}</a></div>`
      ).join('');
    } else {
      linksWrap.style.display = 'none';
    }

    // --- CV ---
    const cvEl   = document.getElementById('spCv');
    const cvWrap = document.getElementById('spCvWrap');
    if (p.cv_url) {
      cvEl.innerHTML = `<a href="${p.cv_url}" target="_blank" class="btn btn-small btn-primary">⬇ Download CV (${p.cv_original_name || 'Resume.pdf'})</a>`;
    } else {
      cvEl.textContent = 'No CV uploaded.';
      cvWrap.style.background = '#f9fafb';
      cvWrap.style.borderColor = '#e5e7eb';
    }

    // Show content
    loading.style.display = 'none';
    content.style.display = 'block';

  } catch (err) {
    console.error('openStudentProfileModal error:', err);
    loading.style.display = 'none';
    errorEl.style.display  = 'block';
  }
}

async function saveCompanyApplicationStatus(newStatus) {
  const appId = document.getElementById('companyAppId').value;
  const response = document.getElementById('companyAppResponse').value;
  const modal = document.getElementById('companyAppModal');

  if (!appId) return;

  try {
    const updatedData = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (response !== undefined) {
      updatedData.company_response = response;
    }

    const { error } = await supabaseClient
      .from('applications')
      .update(updatedData)
      .eq('application_id', parseInt(appId, 10));

    if (error) {
      console.error('Company application update error:', error);
      showToast('Failed to update application: ' + error.message, 'error');
      return;
    }

    showToast(newStatus === 'accepted' ? 'Application accepted.' : newStatus === 'rejected' ? 'Application declined.' : 'Application updated.', newStatus === 'accepted' ? 'success' : newStatus === 'rejected' ? 'success' : 'info');
    if (modal) modal.style.display = 'none';
    await loadCompanyApplications();
  } catch (err) {
    console.error('Error saving company application status:', err);
    showToast('Error: ' + err.message, 'error');
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

      showToast(editId ? "Updated!" : "Posted!", 'success');
      closePostModal();
      loadCompanyPostings(); // Refresh the list

  } catch (err) {
      showToast("Error: " + err.message, 'error');
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
// ==========================================
// APPLICATIONS MANAGEMENT
// ==========================================

function fillApplications(applications) {
  const container = document.getElementById('applicationsContainer');
  if (!container) return;

  if (!applications || applications.length === 0) {
      container.innerHTML = '<p>No applications yet.</p>';
      return;
  }

  container.innerHTML = applications.map(app => {
      const jobTitle = app.positions?.title || 'Unknown Position';
      
      // Convert the app object to a string so it can be passed into the function
      const appData = JSON.stringify(app).replace(/"/g, '&quot;');

      return `
          <div class="application-card" id="app-${app.application_id}">
              <div class="app-info">
                  <h5>${jobTitle}</h5>
                  <p>Status: <span class="status-badge status-${(app.status || 'pending').toLowerCase()}">${app.status || 'Pending'}</span></p>
              </div>
              <div class="app-actions" style="display: flex; gap: 8px; margin-top: 10px;">
                  <button class="btn-view" onclick="viewApplication(${app.position_id})">View</button>
                  
                  <button class="btn-view" style="background:#f3f4f6; color:#374151;" onclick="openEditAppModal(${appData})">Edit</button>
                  
                  <button class="btn-delete" onclick="deleteApplication(${app.application_id})">Delete</button>
              </div>
          </div>
      `;
  }).join('');
}


// Function to open the modal and fill it with current data
function openEditAppModal(app) {
  document.getElementById('editAppId').value = app.application_id;
  document.getElementById('editAppName').value = app.full_name || '';
  document.getElementById('editAppEmail').value = app.email || '';
  document.getElementById('editAppPhone').value = app.phone || '';
  document.getElementById('editAppLetter').value = app.cover_letter || '';
  
  // Store current CV state in global variables or data attributes
  renderCvEditSection(app.cv_original_name, app.cv_url);

  document.getElementById('editAppModal').style.display = 'block';
}

function renderCvEditSection(fileName, fileUrl) {
  const container = document.getElementById('editCvContainer');
  
  if (fileName && fileUrl) {
      // CASE: File exists - show name and 'X' button
      container.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; background: white; padding: 8px 12px; border-radius: 6px; border: 1px solid #ddd;">
              <span style="font-size: 0.9rem; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;">
                  ✅ ${fileName}
              </span>
              <button type="button" onclick="removeCvFromEdit()" style="background: #fee2e2; color: #ef4444; border: none; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-weight: bold;">✕</button>
          </div>
      `;
  } else {
      // CASE: No file - show upload button
      container.innerHTML = `
          <label for="editCvUpload" class="btn btn-secondary" style="width:100%; display:block; text-align:center; cursor:pointer; padding: 8px 0; background:#6366f1; color:white; border-radius:6px;">
              Upload CV (PDF)
          </label>
      `;
  }
}

// Variable to track if the user deleted their CV during this edit session
let isCvDeleted = false;

async function removeCvFromEdit() {
    if(await showConfirm("Remove this CV? You will need to upload a new one before saving.", "Remove")) {
        isCvDeleted = true;
        // Reset the file input value
        document.getElementById('editCvUpload').value = "";
        // Re-render to show the upload button
        renderCvEditSection(null, null);
    }
}

function handleEditCVSelection(input) {
    if (input.files && input.files[0]) {
        isCvDeleted = false; // They uploaded a new one
        renderCvEditSection(input.files[0].name, "pending-upload");
    }
}

// Function to save the updated data
async function updateApplication() {
  const appId = document.getElementById('editAppId').value;
  const saveBtn = document.querySelector('#editAppModal .btn-primary');

  const updatedData = {
      full_name: document.getElementById('editAppName').value,
      email: document.getElementById('editAppEmail').value,
      phone: document.getElementById('editAppPhone').value,
      cover_letter: document.getElementById('editAppLetter').value,
      updated_at: new Date().toISOString()
  };

  // If user clicked 'X' and didn't upload a new one, set fields to null
  if (isCvDeleted) {
      updatedData.cv_url = null;
      updatedData.cv_original_name = null;
  }

  try {
      saveBtn.disabled = true;
      
      const cvInput = document.getElementById('editCvUpload');
      if (cvInput.files && cvInput.files[0]) {
          // ... (Same upload logic as before) ...
          const file = cvInput.files[0];
          const filePath = `resumes/${Date.now()}_${file.name}`;
          await supabaseClient.storage.from('resumes').upload(filePath, file);
          const { data: urlData } = supabaseClient.storage.from('resumes').getPublicUrl(filePath);
          
          updatedData.cv_url = urlData.publicUrl;
          updatedData.cv_original_name = file.name;
      }

      const { error } = await supabaseClient
          .from('applications')
          .update(updatedData)
          .eq('application_id', appId);

      if (error) throw error;

      showToast("Update successful!", 'success');
      isCvDeleted = false; // reset
      document.getElementById('editAppModal').style.display = 'none';
      loadStudentProfile();

  } catch (err) {
      showToast("Error: " + err.message, 'error');
  } finally {
      saveBtn.disabled = false;
  }
}

/**
* Redirects user to the internship detail page
*/
function viewApplication(positionId) {
  window.location.href = `internship-detail.html?id=${positionId}`;
}

async function deleteApplication(applicationId) {
  if (!await showConfirm("Withdraw this application?", "Withdraw")) return;

  try {
      const { error } = await supabaseClient
          .from('applications')
          .delete()
          .eq('application_id', applicationId);

      if (error) throw error;
      showToast("Application withdrawn.", 'success');
      loadStudentProfile();
  } catch (err) {
      showToast("Delete failed: " + err.message, 'error');
  }
}
/**
 * Fetches city suggestions from Digitransit API
 * @param {string} query - The city name being typed
 */
async function handleCityInput(query) {
  const datalist = document.getElementById('citySuggestions');
  const cleanQuery = query.trim();

  // Only search if 2 or more characters are typed
  if (!cleanQuery || cleanQuery.length < 2) {
      if (datalist) datalist.innerHTML = '';
      return;
  }

  try {
      const url = `https://api.digitransit.fi/geocoding/v1/autocomplete?text=${encodeURIComponent(cleanQuery)}&sources=oa,osm&layers=address,locality&digitransit-subscription-key=${DIGITRANSIT_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (datalist) {
          datalist.innerHTML = ''; // Clear previous suggestions

          if (data.features && data.features.length > 0) {
              // Filter and display unique city/locality names
              const uniqueCities = new Set();
              
              data.features.forEach(feature => {
                  const cityName = feature.properties.locality || feature.properties.name;
                  if (cityName && !uniqueCities.has(cityName)) {
                      uniqueCities.add(cityName);
                      const option = document.createElement('option');
                      option.value = cityName;
                      datalist.appendChild(option);
                  }
              });
          }
      }
  } catch (err) {
      console.error("City Search Error:", err);
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
        document.getElementById('eCompanyEmail').value = currentProfile?.contact_email || getCurrentSession()?.login || '';
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
    showToast('Profile saved successfully!', 'success');

  } catch (err) {
    console.error('Save error:', err);
    showToast(err.message || 'An error occurred while saving.', 'error');
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

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  const search = document.querySelector('.category-search');
  const dropdown = document.getElementById('categoryDropdown');
  if (dropdown && search && !search.contains(e.target)) {
    dropdown.classList.remove('show');
  }

  const reqSearch = document.getElementById('reqCategorySearch');
  const reqDropdown = document.getElementById('reqCategoryDropdown');
  if (reqDropdown && reqSearch && !reqSearch.contains(e.target) && !reqDropdown.contains(e.target)) {
    reqDropdown.classList.remove('show');
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
    showToast('Photo must be under 2 MB.', 'warning');
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
      showToast('Upload error: ' + uploadError.message, 'error');
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
    showToast('Failed to upload photo.', 'error');
  }
}

async function uploadLogo(input) {
  const file = input.files[0];
  
  // 1. Basic checks (Must have file and profile loaded)
  if (!file || !currentProfile) return;

  // 2. Check Session (Must be logged in)
  const session = getCurrentSession();
  if (!session) {
    showToast("Please log in to upload a logo.", 'warning');
    return;
  }

  // 3. Size Validation (Max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast('Logo must be under 2 MB.', 'warning');
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
      showToast('Upload error: ' + uploadError.message, 'error');
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

    showToast('Logo updated successfully!', 'success');

  } catch (err) {
    console.error('Logo upload error:', err);
    showToast('Failed to upload logo.', 'error');
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
    showToast('CV uploaded successfully!', 'success');

  } catch (err) {
    console.error('Upload Error:', err);
    showToast('Note: ' + err.message, 'info');
    renderCVList(); 
  }
}

// 3. THE DELETE FUNCTION
async function deleteCV() {
  if (!await showConfirm("Are you sure you want to remove this CV?", "Remove")) return;

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
    showToast("CV removed from profile.", 'success');
    
  } catch (err) {
    console.error("Delete error:", err);
    showToast("Failed to delete: " + err.message, 'error');
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
    showToast('No CV uploaded yet.', 'warning');
    return;
  }
  window.open(currentProfile.cv_url, '_blank');
}

// ==========================================
// PRACTICE REQUESTS
// ==========================================

let practiceRequests = [];
let showAllRequests = false;
let reqSelectedCategoryIds = [];

async function loadPracticeRequests(studentId) {
  const { data, error } = await supabaseClient
    .from('student_practice_requests')
    .select('*, student_request_categories(category_id, job_categories(title)), Companies:found_company_id(company_name)')
    .eq('student_id', studentId)
    .order('period_start', { ascending: false });

  if (error) { console.error('Error loading practice requests:', error); return; }
  practiceRequests = data || [];
  fillPracticeRequests();
}

function fillPracticeRequests() {
  const container = document.getElementById('dPracticeRequests');
  const showAllWrap = document.getElementById('showAllRequestsWrap');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const active = practiceRequests.filter(r => new Date(r.period_end) >= today);
  const archived = practiceRequests.filter(r => new Date(r.period_end) < today);
  const toShow = showAllRequests ? practiceRequests : active;

  if (practiceRequests.length === 0) {
    container.innerHTML = '<span class="profile-field-value empty">No internship requests added</span>';
    if (showAllWrap) showAllWrap.style.display = 'none';
    return;
  }

  container.innerHTML = toShow.length > 0
    ? toShow.map(r => renderRequestCard(r, today)).join('')
    : '<span class="profile-field-value empty">No active requests</span>';

  if (showAllWrap) {
    if (archived.length > 0) {
      showAllWrap.style.display = 'block';
      const btn = document.getElementById('showAllRequestsBtn');
      if (btn) btn.textContent = showAllRequests
        ? 'Show active only'
        : `Show all (${practiceRequests.length})`;
    } else {
      showAllWrap.style.display = 'none';
    }
  }
}

function renderRequestCard(r, today) {
  const isExpired = new Date(r.period_end) < today;
  const cats = (r.student_request_categories || [])
    .map(sc => `<span class="category-tag" style="font-size:0.75rem; padding:0.2rem 0.5rem;">${sc.job_categories?.title || ''}</span>`)
    .join('');

  const statusLabel = r.status === 'found' ? 'Found' : 'Searching';
  const statusClass = r.status === 'found' ? 'status-found' : 'status-searching';
  const nextStatus = r.status === 'found' ? 'searching' : 'found';
  const nextLabel = r.status === 'found' ? 'Back to Searching' : 'Mark as Found';
  const companyName = r.Companies?.company_name || r.found_company_name || null;

  return `
    <div class="practice-request-card${isExpired ? ' expired' : ''}">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
        <div>
          <span style="font-weight:600;">${formatDateEuropean(r.period_start)} — ${formatDateEuropean(r.period_end)}</span>
          ${isExpired ? '<span class="status-badge" style="background:#f3f4f6; color:#6b7280; margin-left:0.5rem;">Expired</span>' : ''}
        </div>
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
      ${cats ? `<div class="selected-categories" style="margin-top:0.5rem; gap:0.35rem;">${cats}</div>` : ''}
      ${companyName ? `<p style="margin:0.5rem 0 0; font-size:0.85rem;"><span style="color:var(--text-light);">Company:</span> <strong>${companyName}</strong></p>` : ''}
      ${r.notes ? `<p style="margin:0.4rem 0 0; font-size:0.85rem; color:var(--text-light);">${r.notes}</p>` : ''}
      <div style="display:flex; gap:0.5rem; margin-top:0.75rem; flex-wrap:wrap;">
        <button style="background:#eef2ff; color:var(--primary-color); border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem; font-weight:600;"
          onclick="${nextStatus === 'found' ? `openFoundCompanyModal(${r.request_id})` : `togglePracticeRequestStatus(${r.request_id}, 'searching')`}">${nextLabel}</button>
        <button style="background:#fef2f2; color:#ef4444; border:none; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:0.8rem; font-weight:600;"
          onclick="deletePracticeRequest(${r.request_id})">Delete</button>
      </div>
    </div>
  `;
}

async function togglePracticeRequestStatus(requestId, newStatus) {
  const updates = { status: newStatus, updated_at: new Date().toISOString() };
  if (newStatus === 'searching') {
    updates.found_company_id = null;
    updates.found_company_name = null;
  }

  const { error } = await supabaseClient
    .from('student_practice_requests')
    .update(updates)
    .eq('request_id', requestId);

  if (error) { showToast('Error updating status: ' + error.message, 'error'); return; }

  await loadPracticeRequests(currentProfile.id);
}

async function deletePracticeRequest(requestId) {
  if (!await showConfirm('Delete this internship request?', 'Delete')) return;

  const { error } = await supabaseClient
    .from('student_practice_requests')
    .delete()
    .eq('request_id', requestId);

  if (error) { showToast('Error: ' + error.message, 'error'); return; }

  practiceRequests = practiceRequests.filter(r => r.request_id !== requestId);
  fillPracticeRequests();
}

function toggleShowAllRequests() {
  showAllRequests = !showAllRequests;
  fillPracticeRequests();
}

// --- Add Request Modal ---

function openAddRequestModal() {
  reqSelectedCategoryIds = [];
  document.getElementById('reqPeriodStart').value = '';
  document.getElementById('reqPeriodEnd').value = '';
  document.getElementById('reqNotes').value = '';
  renderReqSelectedCategories();
  buildReqCategoryDropdown('');
  document.getElementById('addRequestModal').style.display = 'block';
}

function closeAddRequestModal() {
  document.getElementById('addRequestModal').style.display = 'none';
}

async function savePracticeRequest() {
  const periodStart = document.getElementById('reqPeriodStart').value;
  const periodEnd = document.getElementById('reqPeriodEnd').value;
  const notes = document.getElementById('reqNotes').value.trim();

  if (!periodStart || !periodEnd) { showToast('Please set both start and end dates.', 'warning'); return; }
  if (periodEnd < periodStart) { showToast('End date must be after start date.', 'warning'); return; }

  try {
    const { data: newReq, error } = await supabaseClient
      .from('student_practice_requests')
      .insert({
        student_id: currentProfile.id,
        period_start: periodStart,
        period_end: periodEnd,
        status: 'searching',
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;

    if (reqSelectedCategoryIds.length > 0) {
      const catRows = reqSelectedCategoryIds.map(catId => ({
        request_id: newReq.request_id,
        category_id: catId
      }));
      const { error: catError } = await supabaseClient
        .from('student_request_categories')
        .insert(catRows);
      if (catError) throw catError;
    }

    await loadPracticeRequests(currentProfile.id);
    closeAddRequestModal();
  } catch (err) {
    console.error('Error saving request:', err);
    showToast('Error saving request: ' + err.message, 'error');
  }
}

// --- Category selector for request modal ---

function buildReqCategoryDropdown(query) {
  const dropdown = document.getElementById('reqCategoryDropdown');
  if (!dropdown) return;

  const q = (query || '').toLowerCase();
  const groups = {};
  allCategories.forEach(cat => {
    if (q && !cat.title.toLowerCase().includes(q)) return;
    const groupTitle = cat.job_groups?.title || 'Other';
    if (!groups[groupTitle]) groups[groupTitle] = [];
    groups[groupTitle].push(cat);
  });

  dropdown.innerHTML = Object.entries(groups).map(([groupTitle, cats]) => `
    <div class="category-group-title">${groupTitle}</div>
    ${cats.map(cat => `
      <div class="category-option${reqSelectedCategoryIds.includes(cat.category_id) ? ' selected' : ''}"
           onclick="toggleReqCategory(${cat.category_id})"
           data-cat-title="${cat.title}">
        ${cat.title}
      </div>
    `).join('')}
  `).join('');
}

function showReqCategoryDropdown() {
  buildReqCategoryDropdown(document.getElementById('reqCategorySearch').value);
  document.getElementById('reqCategoryDropdown').classList.add('show');
}

function filterReqCategories() {
  const query = document.getElementById('reqCategorySearch').value;
  buildReqCategoryDropdown(query);
  document.getElementById('reqCategoryDropdown').classList.add('show');
}

function toggleReqCategory(categoryId) {
  if (reqSelectedCategoryIds.includes(categoryId)) {
    reqSelectedCategoryIds = reqSelectedCategoryIds.filter(id => id !== categoryId);
  } else {
    reqSelectedCategoryIds.push(categoryId);
  }
  renderReqSelectedCategories();
  buildReqCategoryDropdown(document.getElementById('reqCategorySearch').value);
}

function renderReqSelectedCategories() {
  const container = document.getElementById('reqSelectedCategories');
  if (!container) return;
  container.innerHTML = reqSelectedCategoryIds.map(id => {
    const cat = allCategories.find(c => c.category_id === id);
    return cat ? `
      <span class="category-tag">
        ${cat.title}
        <button onclick="toggleReqCategory(${id})" type="button">×</button>
      </span>
    ` : '';
  }).join('');
}

// ==========================================
// FOUND COMPANY MODAL
// ==========================================

let pendingFoundRequestId = null;
let foundCompanyId = null;
let allCompanies = [];

async function openFoundCompanyModal(requestId) {
  pendingFoundRequestId = requestId;
  foundCompanyId = null;
  document.getElementById('foundCompanyInput').value = '';
  document.getElementById('foundCompanyDropdown').innerHTML = '';
  document.getElementById('foundCompanyDropdown').classList.remove('show');
  document.getElementById('foundCompanyChip').style.display = 'none';
  document.getElementById('foundCompanyChip').innerHTML = '';

  // Load companies once per modal open
  if (allCompanies.length === 0) {
    const { data } = await supabaseClient
      .from('Companies')
      .select('company_id, company_name')
      .order('company_name');
    allCompanies = data || [];
  }

  document.getElementById('foundCompanyModal').style.display = 'block';
}

function closeFoundCompanyModal() {
  document.getElementById('foundCompanyModal').style.display = 'none';
  pendingFoundRequestId = null;
  foundCompanyId = null;
}

function showFoundCompanyDropdown() {
  renderFoundCompanyDropdown(document.getElementById('foundCompanyInput').value);
}

function searchFoundCompany(query) {
  if (foundCompanyId) {
    foundCompanyId = null;
    document.getElementById('foundCompanyChip').style.display = 'none';
  }
  renderFoundCompanyDropdown(query);
}

function renderFoundCompanyDropdown(query) {
  const dropdown = document.getElementById('foundCompanyDropdown');
  const q = (query || '').toLowerCase().trim();

  const filtered = q
    ? allCompanies.filter(c => c.company_name.toLowerCase().includes(q))
    : allCompanies;

  if (filtered.length === 0) {
    dropdown.classList.remove('show');
    return;
  }

  dropdown.innerHTML = filtered.map(c => `
    <div class="category-option" onclick="selectFoundCompany(${c.company_id}, '${c.company_name.replace(/'/g, "\\'")}')">
      ${c.company_name}
    </div>
  `).join('');
  dropdown.classList.add('show');
}

function selectFoundCompany(companyId, companyName) {
  foundCompanyId = companyId;
  document.getElementById('foundCompanyInput').value = companyName;
  document.getElementById('foundCompanyDropdown').classList.remove('show');

  const chip = document.getElementById('foundCompanyChip');
  chip.style.display = 'block';
  chip.innerHTML = `
    <span class="category-tag" style="font-size:0.85rem;">
      ${companyName}
      <button type="button" onclick="clearFoundCompany()">×</button>
    </span>
  `;
}

function clearFoundCompany() {
  foundCompanyId = null;
  document.getElementById('foundCompanyInput').value = '';
  document.getElementById('foundCompanyChip').style.display = 'none';
}

async function confirmMarkAsFound() {
  if (!pendingFoundRequestId) return;

  const input = document.getElementById('foundCompanyInput').value.trim();
  const updates = {
    status: 'found',
    updated_at: new Date().toISOString(),
    found_company_id: foundCompanyId || null,
    found_company_name: !foundCompanyId && input ? input : null
  };

  const { error } = await supabaseClient
    .from('student_practice_requests')
    .update(updates)
    .eq('request_id', pendingFoundRequestId);

  if (error) { showToast('Error: ' + error.message, 'error'); return; }

  await loadPracticeRequests(currentProfile.id);
  closeFoundCompanyModal();
}

// Close found-company dropdown when clicking outside
document.addEventListener('click', function(e) {
  const input = document.getElementById('foundCompanyInput');
  const dropdown = document.getElementById('foundCompanyDropdown');
  if (dropdown && input && !input.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('show');
  }
});

// ==========================================
// DELETE ACCOUNT (GDPR Art. 17)
// ==========================================

function openDeleteAccountModal() {
  document.getElementById('deleteConfirmInput').value = '';
  document.getElementById('deleteAccountError').style.display = 'none';
  document.getElementById('deleteAccountModal').style.display = 'block';
}

function closeDeleteAccountModal() {
  document.getElementById('deleteAccountModal').style.display = 'none';
}

async function confirmDeleteAccount() {
  const input = document.getElementById('deleteConfirmInput').value.trim();
  const errorEl = document.getElementById('deleteAccountError');

  if (input !== 'DELETE') {
    errorEl.textContent = 'Please type DELETE exactly to confirm.';
    errorEl.style.display = 'block';
    return;
  }

  errorEl.style.display = 'none';

  const session = getCurrentSession();
  if (!session) {
    errorEl.textContent = 'Session not found. Please log in again.';
    errorEl.style.display = 'block';
    return;
  }

  if (!currentProfile) {
    const { data: profile } = await supabaseClient
      .from('student_profiles')
      .select('*')
      .eq('user_id', session.userId)
      .single();
    if (profile) currentProfile = profile;
  }

  const deleteBtn = document.getElementById('confirmDeleteBtn');
  if (deleteBtn) { deleteBtn.disabled = true; deleteBtn.textContent = 'Deleting...'; }

  try {
    // 1. Delete CV file from storage
    if (currentProfile.cv_url) {
      const cvPath = currentProfile.cv_url.split('/practice-files/')[1]?.split('?')[0];
      if (cvPath) {
        await supabaseClient.storage.from('practice-files').remove([decodeURIComponent(cvPath)]);
      }
    }

    // 2. Delete avatar from storage
    if (currentProfile.photo_url) {
      const photoPath = currentProfile.photo_url.split('/foto/')[1]?.split('?')[0];
      if (photoPath) {
        await supabaseClient.storage.from('foto').remove([decodeURIComponent(photoPath)]);
      }
    }

    // 3. Delete CV files from resumes bucket (uploaded with applications)
    const { data: apps } = await supabaseClient
      .from('applications')
      .select('cv_url')
      .eq('student_id', currentProfile.id);
    if (apps?.length) {
      const paths = apps
        .map(a => a.cv_url?.split('/resumes/')[1]?.split('?')[0])
        .filter(Boolean)
        .map(p => decodeURIComponent(p));
      if (paths.length) await supabaseClient.storage.from('resumes').remove(paths);
    }

    // 4. Delete user record — cascades to student_profiles, applications,
    //    student_categories, Student_links, student_practice_requests, etc.
    const { error } = await supabaseClient
      .from('Users')
      .delete()
      .eq('user_id', session.userId);

    if (error) throw error;

    // 5. Delete from Supabase Auth by email
    const { error: rpcError } = await supabaseClient.rpc('delete_auth_user_by_email', { p_email: session.login });
    if (rpcError) console.error('[DeleteAccount] RPC error:', rpcError.message);

    // 6. Clear session and redirect
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userLogin');
    localStorage.removeItem('isLoggedIn');

    window.location.href = 'index.html';

  } catch (err) {
    console.error('Delete account error:', err);
    errorEl.textContent = 'Error: ' + err.message;
    errorEl.style.display = 'block';
    if (deleteBtn) { deleteBtn.disabled = false; deleteBtn.textContent = 'Delete permanently'; }
  }
}