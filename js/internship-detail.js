function buildExpandable(text, key) {
  const LIMIT = 200;
  if (text.length <= LIMIT) return text;
  return `<span id="exp-short-${key}">${text.slice(0, LIMIT)}… <a href="javascript:void(0)" onclick="toggleExpand('${key}')">Show more</a></span>` +
         `<span id="exp-full-${key}" style="display:none;">${text} <a href="javascript:void(0)" onclick="toggleExpand('${key}')">Show less</a></span>`;
}

function toggleExpand(key) {
  const s = document.getElementById('exp-short-' + key);
  const f = document.getElementById('exp-full-'  + key);
  const expanded = f.style.display !== 'none';
  s.style.display = expanded ? 'inline' : 'none';
  f.style.display = expanded ? 'none'   : 'inline';
}

async function loadInternshipDetail(positionId) {
    try {
        const normalizedPositionId = /^\d+$/.test(String(positionId))
            ? parseInt(positionId, 10)
            : positionId;

        const { data: position, error: posError } = await supabaseClient
            .from('positions')
            .select('*')
            .eq('position_id', normalizedPositionId)
            .single();
  
        if (posError || !position) throw new Error("Position not found");
  
        const companyResult = await supabaseClient
            .from('Companies')
            .select('*')
            .eq('company_id', position.company_id)
            .single();

        let company = companyResult.data;
        if (companyResult.error || !company) {
            console.warn('Company not found for position:', positionId, companyResult.error);
            company = { company_name: 'Unknown Company' };
        }

        document.querySelector('.card-title').textContent = position.title;
        const companyNameEl = document.querySelector('.card-header .text-muted');
        if (companyNameEl) companyNameEl.textContent = company?.company_name || 'Unknown Company';

        // Load and show application count on the detail page (non-fatal if it fails)
        try {
            const { count: appCount, error: appError } = await supabaseClient
                .from('applications')
                .select('*', { count: 'exact', head: true })
                .eq('position_id', normalizedPositionId);

            if (appError) throw appError;

            const countBadge = document.getElementById('applicationCountBadge');
            if (countBadge) countBadge.textContent = `👥 ${appCount ?? 0} applied`;
        } catch (appCountErr) {
            console.warn('Unable to load application count:', appCountErr);
            const countBadge = document.getElementById('applicationCountBadge');
            if (countBadge) countBadge.textContent = '👥 N/A';
        }

        const bLocation = document.getElementById('badgeLocation');
        if (bLocation) {
            bLocation.textContent = position.location || company?.city || 'Remote';
        }
  
        const bDuration = document.getElementById('badgeDuration');
        if (bDuration) {
            const startDate = position.period_start ? formatDateEuropean(position.period_start) : 'TBD';
            const endDate = position.period_end ? formatDateEuropean(position.period_end) : 'Open';
            bDuration.textContent = `${startDate} - ${endDate}`;
        }
  
        const salaryEl = document.getElementById('displaySalary');
        if (salaryEl) {
            const salaryValue = position.salary != null ? String(position.salary).trim() : '';
            salaryEl.textContent = salaryValue !== '' ? salaryValue : 'Negotiable';
        }
        
                const durationEl = document.getElementById('displayDuration');
                if (durationEl) {
                    if (position.period_start && position.period_end) {
                        durationEl.textContent = `${formatDateEuropean(position.period_start)} - ${formatDateEuropean(position.period_end)}`;
                    } else {
                        durationEl.textContent = position.duration || 'Not specified';
                    }
                }
        
                const locationEl = document.getElementById('displayLocation');
                if (locationEl) {
                    locationEl.textContent = position.location || company?.city || 'Remote';
                }
        
        // About Us 
        const aboutUs = document.getElementById('pDesc');
        if (aboutUs) aboutUs.textContent = company?.description || 'No description provided.';

        // Company Profile 
        const displayDesc = document.getElementById('dCompanyDesc');
        if (displayDesc) displayDesc.textContent = company?.description || 'No description.';

        const displayEmail = document.getElementById('dCompanyEmail');
displayEmail.innerHTML = company?.contact_email ? `<a href="mailto:${company.contact_email}">${company.contact_email}</a>` : 'No contact email provided.';

        const displayWebsite = document.getElementById('dWebsite');
        if (displayWebsite) displayWebsite.textContent = company?.website || 'N/A';

        const displayCity = document.getElementById('dHeadquarters');
        if (displayCity) displayCity.textContent = company?.city || 'N/A';

        const displayY = document.getElementById('dYTunnus');
        if (displayY) displayY.textContent = company?.y_tunnus || 'N/A';
  
        const descSection = document.getElementById('descriptionSection');
        const descEl = document.getElementById('displayDescription');
        if (descEl) {
            const descValue = position.description != null ? String(position.description).trim() : '';
            if (descValue !== '') {
                descEl.innerHTML = buildExpandable(descValue, 'desc');
            } else if (descSection) {
                descSection.style.display = 'none';
            }
        }

        const responsibilitiesEl = document.getElementById('displayResponsibilities');
        if (responsibilitiesEl) {
            const respValue = position.responsibilities != null ? String(position.responsibilities).trim() : '';
            if (respValue !== '') {
                responsibilitiesEl.innerHTML = buildExpandable(respValue, 'resp');
            } else {
                responsibilitiesEl.closest('.card-content').style.display = 'none';
            }
        }

        const reqsElement = document.getElementById('pReqs');
        if (reqsElement) {
            const reqs = position.requirements != null ? String(position.requirements).trim() : '';
            reqsElement.innerHTML = reqs ? buildExpandable(reqs, 'reqs') : '';
        }

        // 5. COMPANY CARD
        if (document.getElementById('dCompanyDesc')) document.getElementById('dCompanyDesc').textContent = company?.description || '';
        if (document.getElementById('dWebsite')) document.getElementById('dWebsite').textContent = company?.website || 'N/A';
        if (document.getElementById('dHeadquarters')) document.getElementById('dHeadquarters').textContent = company?.city || 'N/A';
        if (document.getElementById('dYTunnus')) document.getElementById('dYTunnus').textContent = company?.y_tunnus || 'N/A';

        // --- 4. FAVORITES LOGIC ---
        // --- 4. FAVORITES LOGIC ---
        const favContainer = document.getElementById('favBtnContainer');
        if (favContainer) {
            // Force the ID onto the container so the button can find it
            favContainer.setAttribute('data-job-id', position.position_id);
        }

        window.currentPosition = position;
        window.currentCompany = company;

        // Set the heart color immediately if the helper exists
        if (typeof updateFavoriteStates === 'function') {
            updateFavoriteStates();
        }

        // Attach listener specifically to the heart on the detail page
        const detailFavBtn = document.querySelector('#favBtnContainer .favorite-btn');
        if (detailFavBtn) {
            const newBtn = detailFavBtn.cloneNode(true);
            detailFavBtn.parentNode.replaceChild(newBtn, detailFavBtn);
            newBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFavorite(position.position_id, this);
            });
        }

        // Re-attach favorite button listeners safely
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const clonedBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(clonedBtn, btn);
            clonedBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const jobId = position.position_id;
                if (jobId && typeof toggleFavorite === 'function') {
                    toggleFavorite(jobId.toString(), this);
                }
            });
        });

        // Show the application sidebar only if the current user is the company owner
        let isOwner = false;
        if (position.company_id) {
            try {
                isOwner = await updateSidebarVisibility(position.company_id);
            } catch (visibilityErr) {
                console.warn('Sidebar visibility check failed:', visibilityErr);
            }
        }

        // Try owner-specific loading, but don’t fail the whole page if it cannot complete
        if (position.company_id && isOwner) {
            try {
                await checkOwnerAndLoadApplicants(position.company_id, position.position_id);
            } catch (ownerErr) {
                console.warn('Could not load owner/applicant data:', ownerErr);
            }
        }

    } catch (err) {
        console.error('Error loading detail:', err);
        const message = err?.message || err?.toString() || 'Unknown error';
        showToast("Could not load details: " + message, 'error');
    }
}

  // --- MODAL LOGIC ---

async function openApplyModal() {
  const session = requireAuth();
  if (!session || session.role !== 1) {
      showToast("Student login required to apply.", 'warning');
      return;
  }

  const { data: profile, error } = await supabaseClient
      .from('student_profiles')
      .select('id') 
      .eq('user_id', session.userId)
      .single();

  if (error || !profile) {
      console.error("Profile check error:", error);
      showToast("Student profile not found. Please complete your profile first.", 'warning');
      return;
  }

  // Store the INTEGER ID
  window.currentStudentId = profile.id;

  // Populate modal title and company
  const modalTitle = document.getElementById('modalTitle');
  const modalCompany = document.getElementById('modalCompany');
  if (modalTitle) modalTitle.textContent = window.currentPosition?.title || 'this position';
  if (modalCompany) modalCompany.textContent = window.currentCompany?.company_name || 'this company';

  // Show modal
  document.getElementById('applyModal').style.display = "block";
}

async function enableCompanyEditFeatures(companyId) {
    const adminPanel = document.getElementById('companyFormControls');
    if (!adminPanel) return;
    adminPanel.style.display = "none";

    let userId = null;
    if (typeof getCurrentSession === 'function') {
        const session = getCurrentSession();
        if (session && session.role === 2) {
            userId = session.userId;
        }
    }

    if (!userId) {
        const { data: authData } = await supabaseClient.auth.getUser();
        userId = authData?.user?.id || null;
    }

    if (!userId) return;

    const { data: company, error } = await supabaseClient
        .from('Companies')
        .select('user_id')
        .eq('company_id', companyId)
        .single();

    if (!error && company && company.user_id === userId) {
        adminPanel.style.display = "block";
    }
}
function closeApplyModal() {
    document.getElementById('applyModal').style.display = "none";
    document.body.style.overflow = "auto";
}

async function checkOwnershipAndShowControls(companyId) {
    const controls = document.getElementById('companyFormControls');
    if (!controls) return;

    let userId = null;
    if (typeof getCurrentSession === 'function') {
        const session = getCurrentSession();
        if (session && session.role === 2) {
            userId = session.userId;
        }
    }

    if (!userId) {
        const { data: authData } = await supabaseClient.auth.getUser();
        userId = authData?.user?.id || null;
    }

    if (!userId) {
        controls.style.display = "none";
        return;
    }

    const { data: company, error } = await supabaseClient
        .from('Companies')
        .select('user_id')
        .eq('company_id', companyId)
        .single();

    if (!error && company && company.user_id === userId) {
        controls.style.display = "block"; // User is the owner!
    } else {
        controls.style.display = "none";
    }
}

// --- THE EDIT MODULE ---


/**
 * Adds a new input field to the application form.
 */
function addNewLine(label = "") {
    const container = document.getElementById('customLinesContainer');
    const id = Date.now();
    const html = `
        <div class="custom-line" id="line-${id}" style="display: flex; gap: 10px; margin-bottom: 10px; align-items: center;">
            <input type="text" placeholder="Question Name (e.g. Github Link)" class="dynamic-label" value="${label}" 
                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <button type="button" onclick="document.getElementById('line-${id}').remove()" 
                    style="background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.2rem;">&times;</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}


// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('applyModal');
    if (event.target == modal) {
        closeApplyModal();
    }
}

// Function to handle the CV file selection UI
function handleCVSelection(input) {
    const fileInfo = document.getElementById('cvFileInfo');
    const statusText = document.getElementById('cvStatusText');
    
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        const fileSize = (input.files[0].size / 1024 / 1024).toFixed(2); // Convert to MB
        
        fileInfo.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; background: #e7f3ff; padding: 8px; border-radius: 4px; margin-bottom:10px;">
                <span style="font-size: 1.2rem;">pdf</span>
                <div style="flex:1; overflow:hidden;">
                    <p style="margin:0; font-weight:600; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${fileName}</p>
                    <p style="margin:0; font-size:0.75rem; color: #666;">${fileSize} MB</p>
                </div>
                <button type="button" onclick="resetCVUpload()" style="border:none; background:none; color:red; cursor:pointer; font-weight:bold;">✕</button>
            </div>
        `;
    }
}

function handleEditCVSelection(input) {
    const statusText = document.getElementById('editCvStatusText');
    if (input.files && input.files[0]) {
        statusText.innerHTML = `<strong>New file selected:</strong> ${input.files[0].name}`;
        statusText.style.color = "#059669"; // Green color
    }
}
// Function to clear the CV selection
function resetCVUpload() {
    const input = document.getElementById('cvUpload');
    input.value = ''; // Clear file
    document.getElementById('cvFileInfo').innerHTML = '<p id="cvStatusText" style="font-size: 0.9rem; color: #666;">No CV uploaded yet.</p>';
}


document.getElementById('modalApplyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // 1. Get the current user
    // Custom auth already checked by requireAuth()


    const pos = window.currentPosition;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const cvFile = document.getElementById('cvUpload').files[0];

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Uploading...";

        // 2. Upload CV (Same as before)
        const fileName = `${Date.now()}-${cvFile.name}`;
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('resumes')
            .upload(fileName, cvFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabaseClient.storage.from('resumes').getPublicUrl(fileName);

        // 3. Insert into DB (Matching your specific schema)
       // Inside your submit listener
const { error: dbError } = await supabaseClient
.from('applications')
.insert([{
    student_id: window.currentStudentId, // The INTEGER (e.g. 5)
    position_id: window.currentPosition.position_id,
    full_name: document.getElementById('applyName').value,
    email: document.getElementById('applyEmail').value,
    phone: document.getElementById('applyPhone').value,
    cover_letter: document.getElementById('applyLetter').value,
    cv_url: publicUrl,
    cv_original_name: cvFile.name
}]);

if (dbError) {
console.error("Insert Error:", dbError);
showToast("Error: " + dbError.message, 'error');
} else {
showToast("Application sent!", 'success');
}

        if (dbError) throw dbError;

        showToast("Application sent!", 'success');
        closeApplyModal();

    } catch (err) {
        console.error(err);
        showToast("Error: " + err.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Application";
    }
});

async function checkOwnerAndLoadApplicants(companyId, positionId) {
  try {
      let userId = null;
      if (typeof getCurrentSession === 'function') {
          const session = getCurrentSession();
          if (session && session.role === 2) {
              userId = session.userId;
          }
      }

      if (!userId) {
          const { data: authData } = await supabaseClient.auth.getUser();
          userId = authData?.user?.id || null;
      }

      if (!userId) return;

      const { data: company, error } = await supabaseClient
          .from('Companies')
          .select('user_id')
          .eq('company_id', companyId)
          .single();

      if (error || !company) {
          console.warn('Company lookup failed in owner check:', error);
          return;
      }

      if (company.user_id !== userId) return;

      const section = document.getElementById('applicantsSection');
      if (section) section.style.display = 'block';

      const { data: apps, error: appsError } = await supabaseClient
          .from('applications')
          .select('*')
          .eq('position_id', positionId)
          .order('applied_at', { ascending: false });

      if (appsError) {
          console.error('Error loading applications for owner:', appsError);
          return;
      }

      renderSidebarApplicants(apps || []);
  } catch (err) {
      console.error("Error in owner check:", err);
  }
}

async function updateSidebarVisibility(companyId) {
  const sidebar = document.querySelector('.sidebar');
  const section = document.getElementById('applicantsSection');

  if (sidebar) sidebar.style.display = 'none';
  if (section) section.style.display = 'none';

  let session = null;
  if (typeof getCurrentSession === 'function') {
      session = getCurrentSession();
  }

  if (!session) {
      return false;
  }

  if (session.role !== 2) {
      return false;
  }

  const userId = session.userId;
  if (!userId) {
      return false;
  }

  const { data: company, error } = await supabaseClient
      .from('Companies')
      .select('user_id')
      .eq('company_id', companyId)
      .single();

  if (error || !company || company.user_id !== userId) {
      return false;
  }

  if (sidebar) sidebar.style.display = '';
  return true;
}

function formatDateEuropean(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function renderSidebarApplicants(apps) {
  const container = document.getElementById('companyApplicationsContainer');
  const countEl = document.getElementById('applicantsCount');
  
  if (!container) return;
  if (countEl) countEl.textContent = `(${apps.length})`;

  if (apps.length === 0) {
      container.innerHTML = '<p style="color: #666; font-size: 0.9rem;">No applications yet.</p>';
      return;
  }

  // Creating a clean list for the sidebar
  container.innerHTML = apps.map(app => {
    const statusDisplay = getStatusDisplay(app.status);
    const appliedDate = formatDateEuropean(app.created_at);
    return `
      <div class="application-item" style="padding: 12px 0; border-bottom: 1px solid #eee;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <div>
                  <p style="margin: 0; font-weight: 600; font-size: 0.95rem;">${app.full_name}</p>
                  <small style="color: #888; font-size: 0.85rem;">${app.email || 'N/A'}</small>
                  <div style="margin-top: 4px;">
                      <small style="color: #888; font-size: 0.8rem;">Applied: ${appliedDate}</small>
                  </div>
                  <div style="margin-top: 4px;">
                      ${statusDisplay}
                  </div>
              </div>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button class="btn btn-small btn-view" onclick="viewStudentProfile(${app.student_id})">View</button>
              <button class="btn btn-small btn-danger" onclick="deleteApplicationFromSidebar(${app.application_id}, '${app.full_name}')">Delete</button>
          </div>
      </div>
    `;
  }).join('');
}

function getStatusDisplay(status) {
  let bgColor = '#fef3c7';
  let textColor = '#92400e';
  let statusText = 'pending';
  
  if (status === 'viewed' || status === 'in review') {
    bgColor = '#dbeafe';
    textColor = '#1e40af';
    statusText = 'in review';
  } else if (status === 'accepted' || status === 'rejected' || status === 'ready') {
    bgColor = '#dcfce7';
    textColor = '#166534';
    statusText = 'ready';
  }
  
  return `<span style="display: inline-block; background: ${bgColor}; color: ${textColor}; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Status: ${statusText}</span>`;
}

function showFullApplication(app) {
  console.log('Full application details:', app);
}

// View student profile
async function viewStudentProfile(studentId) {
  try {
    const { data: student, error } = await supabaseClient
      .from('student_profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (error || !student) {
      showToast('Student profile not found.', 'warning');
      return;
    }

    // Display student profile in a modal or redirect
    const profileHTML = `
      <div style="max-height: 500px; overflow-y: auto; padding: 20px;">
        <h3>${student.first_name} ${student.last_name}</h3>
        <p><strong>Email:</strong> ${student.user_id || 'N/A'}</p>
        <p><strong>Phone:</strong> ${student.phone || 'N/A'}</p>
        <p><strong>City:</strong> ${student.city || 'N/A'}</p>
        <p><strong>Education:</strong> ${student.type_education || 'N/A'}</p>
        <p><strong>About:</strong></p>
        <p>${student.about || 'No information provided.'}</p>
        ${student.cv_url ? `<p><a href="${student.cv_url}" target="_blank" class="btn btn-primary btn-small">Download CV</a></p>` : ''}
      </div>
    `;
    let modal = document.getElementById('studentProfileModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'studentProfileModal';
      modal.style.cssText = 'display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.7); overflow-y:auto;';
      modal.innerHTML = '<div style="background:#fff; margin:5% auto; padding:30px; border-radius:12px; width:90%; max-width:550px; position:relative; box-shadow:0 10px 25px rgba(0,0,0,0.2);"><span onclick="document.getElementById(\'studentProfileModal\').style.display=\'none\'" style="position:absolute; right:20px; top:15px; font-size:28px; cursor:pointer; color:#999;">&times;</span><div id="studentProfileModalBody"></div></div>';
      modal.addEventListener('click', function(e) { if (e.target === modal) modal.style.display = 'none'; });
      document.body.appendChild(modal);
    }
    document.getElementById('studentProfileModalBody').innerHTML = profileHTML;
    modal.style.display = 'block';
  } catch (err) {
    console.error('Error viewing student profile:', err);
    showToast('Error loading student profile: ' + err.message, 'error');
  }
}

// Review application - update status to 'viewed'
async function reviewApplication(applicationId, studentName) {
  try {
    const { error } = await supabaseClient
      .from('applications')
      .update({ status: 'viewed' })
      .eq('application_id', applicationId);

    if (error) throw error;

    showToast(`Application from ${studentName} marked as "in review".`, 'success');
    
    // Reload applications
    if (window.currentPosition && window.currentPosition.company_id) {
      await checkOwnerAndLoadApplicants(window.currentPosition.company_id, window.currentPosition.position_id);
    }
  } catch (err) {
    console.error('Error reviewing application:', err);
    showToast('Error updating application: ' + err.message, 'error');
  }
}

// Delete application from sidebar
async function deleteApplicationFromSidebar(applicationId, studentName) {
  if (!confirm(`Delete application from ${studentName}?`)) return;

  try {
    const { error } = await supabaseClient
      .from('applications')
      .delete()
      .eq('application_id', applicationId);

    if (error) throw error;

    showToast(`Application from ${studentName} deleted.`, 'success');
    
    // Reload applications
    if (window.currentPosition && window.currentPosition.company_id) {
      await checkOwnerAndLoadApplicants(window.currentPosition.company_id, window.currentPosition.position_id);
    }
  } catch (err) {
    console.error('Error deleting application:', err);
    showToast('Error deleting application: ' + err.message, 'error');
  }
}
