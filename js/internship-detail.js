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
            const startDate = position.period_start ? new Date(position.period_start).toLocaleDateString() : 'TBD';
            const endDate = position.period_end ? new Date(position.period_end).toLocaleDateString() : 'Open';
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
                durationEl.textContent = `${position.period_start} - ${position.period_end}`;
            } else {
                durationEl.textContent = position.duration != null && String(position.duration).trim() !== ''
                    ? String(position.duration)
                    : 'Not specified';
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
        if (displayEmail) displayEmail.textContent = company?.email || 'No email provided.';

        const displayWebsite = document.getElementById('dWebsite');
        if (displayWebsite) displayWebsite.textContent = company?.website || 'N/A';

        const displayCity = document.getElementById('dHeadquarters');
        if (displayCity) displayCity.textContent = company?.city || 'N/A';

        const displayY = document.getElementById('dYTunnus');
        if (displayY) displayY.textContent = company?.y_tunnus || 'N/A';
  
        // DB has no 'responsibilities' column — 'description' = About Us, 'requirements' = Requirements
        // displayResponsibilities shows requirements; pReqs also shows requirements (same field)
        const responsibilitiesEl = document.getElementById('displayResponsibilities');
        if (responsibilitiesEl) {
            const requirementsValue = position.requirements != null ? String(position.requirements).trim() : '';
            if (requirementsValue !== '') {
                responsibilitiesEl.textContent = requirementsValue;
            } else {
                responsibilitiesEl.closest('.card-content').style.display = 'none';
            }
        }
  
        const reqsElement = document.getElementById('pReqs');
        if (reqsElement) reqsElement.textContent = position.requirements != null ? String(position.requirements) : '';

        // 5. COMPANY CARD
        if (document.getElementById('dCompanyDesc')) document.getElementById('dCompanyDesc').textContent = company?.description || '';
        if (document.getElementById('dWebsite')) document.getElementById('dWebsite').textContent = company?.website || 'N/A';
        if (document.getElementById('dHeadquarters')) document.getElementById('dHeadquarters').textContent = company?.city || 'N/A';
        if (document.getElementById('dYTunnus')) document.getElementById('dYTunnus').textContent = company?.y_tunnus || 'N/A';
  
        if (document.getElementById('displayResponsibilities')) document.getElementById('displayResponsibilities').textContent = position.responsibilities || 'No responsibilities.';
        if (document.getElementById('pReqs')) document.getElementById('pReqs').textContent = position.requirements || 'No requirements.';

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

        // Try owner-specific loading, but don’t fail the whole page if it cannot complete
        if (position.company_id) {
            try {
                await checkOwnerAndLoadApplicants(position.company_id, position.position_id);
            } catch (ownerErr) {
                console.warn('Could not load owner/applicant data:', ownerErr);
            }
        }

    } catch (err) {
        console.error('Error loading detail:', err);
        const message = err?.message || err?.toString() || 'Unknown error';
        alert("Could not load details: " + message);
    }
}

  // --- MODAL LOGIC ---

async function openApplyModal() {
  const session = requireAuth();
  if (!session || session.role !== 1) {
      alert("Student login required to apply.");
      return;
  }

  const { data: profile, error } = await supabaseClient
      .from('student_profiles')
      .select('id') 
      .eq('user_id', session.userId)
      .single();

  if (error || !profile) {
      console.error("Profile check error:", error);
      alert("Student profile not found. Please complete your profile first.");
      return;
  }

  // Store the INTEGER ID
  window.currentStudentId = profile.id;

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
alert("Error: " + dbError.message);
} else {
alert("Application sent!");
}

        if (dbError) throw dbError;

        alert("Application sent!");
        closeApplyModal();

    } catch (err) {
        console.error(err);
        alert("Error: " + err.message);
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
  container.innerHTML = apps.map(app => `
      <div class="application-item" style="padding: 12px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
          <div>
              <p style="margin: 0; font-weight: 600; font-size: 0.95rem;">${app.full_name}</p>
              <small style="color: #888;">${new Date(app.created_at).toLocaleDateString()}</small>
          </div>
          <button class="btn btn-small btn-outline" 
              onclick="console.log('View application:', ${JSON.stringify(app)})" 
              style="padding: 4px 8px; font-size: 0.75rem;">
              View
          </button>
      </div>
  `).join('');
}

function showFullApplication(app) {
  console.log('Full application details:', app);
  alert('Application details: ' + JSON.stringify(app, null, 2));
}
