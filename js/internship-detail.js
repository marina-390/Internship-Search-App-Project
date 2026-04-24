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
        if (displayEmail) {
          displayEmail.innerHTML = '';
          if (company?.contact_email) {
            const a = document.createElement('a');
            a.href = `mailto:${company.contact_email}`;
            a.textContent = company.contact_email;
            displayEmail.appendChild(a);
          } else {
            displayEmail.textContent = 'No contact email provided.';
          }
        }

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

        checkAlreadyApplied(position.position_id);

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

// Hide Apply buttons for company users
        hideApplyButtonForCompanies();

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

function hideApplyButtonForCompanies() {
  const session = getCurrentSession ? getCurrentSession() : null;
  if (session && session.role === 2) {
    const applyBtn = document.querySelector('.card-footer .btn-primary');
    const saveBtn = document.querySelector('.card-footer .btn-outline');
    if (applyBtn) applyBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'none';
  }
}

async function openApplyModal() {
  const session = requireAuth();
  if (!session || session.role !== 1) {
    showToast("Student login required to apply.", 'warning');
    return;
  }

  const { data: profile, error } = await supabaseClient
    .from('student_profiles')
    .select('id, first_name, last_name, phone, cv_url')
    .eq('user_id', session.userId)
    .single();

  if (error || !profile) {
    console.error("Profile check error:", error);
    showToast("Student profile not found. Please complete your profile first.", 'warning');
    return;
  }

  window.currentStudentId = profile.id;
  window.existingCvUrl = profile.cv_url || null;

  // Pre-fill read-only fields
  const el = id => document.getElementById(id);
  if (el('applyFirstName')) el('applyFirstName').value = profile.first_name || '';
  if (el('applyLastName'))  el('applyLastName').value  = profile.last_name  || '';
  if (el('applyEmail'))     el('applyEmail').value     = session.login       || '';
  if (el('applyPhone'))     el('applyPhone').value     = profile.phone       || '';

  // Show CV from profile
  const cvInfo = document.getElementById('cvFileInfo');
  if (profile.cv_url) {
    const fileName = decodeURIComponent(profile.cv_url.split('/').pop().split('?')[0]);
    cvInfo.innerHTML = `<p style="font-size:0.9rem; color:#15803d; margin:0;">✅ ${fileName}</p>`;
  } else {
    cvInfo.innerHTML = '<p style="font-size:0.9rem; color:#e57373; margin:0;">⚠ No CV in your profile. <a href="student-profile.html" style="color:#6366f1;">Add it →</a></p>';
  }

  // Populate modal title and company
  const modalTitle   = document.getElementById('modalTitle');
  const modalCompany = document.getElementById('modalCompany');
  if (modalTitle)   modalTitle.textContent   = window.currentPosition?.title        || 'this position';
  if (modalCompany) modalCompany.textContent = window.currentCompany?.company_name  || 'this company';

  document.getElementById('applyModal').style.display = "block";
}

async function checkAlreadyApplied(positionId) {
  const session = typeof getCurrentSession === 'function' ? getCurrentSession() : null;
  if (!session || session.role !== 1) return;

  const { data: profile } = await supabaseClient
    .from('student_profiles')
    .select('id')
    .eq('user_id', session.userId)
    .maybeSingle();

  if (!profile) return;

  const { data } = await supabaseClient
    .from('applications')
    .select('application_id')
    .eq('student_id', profile.id)
    .eq('position_id', positionId)
    .maybeSingle();

  const btn = document.getElementById('applyBtn');
  if (!btn) return;

  if (data) {
    btn.textContent = '✓ Applied';
    btn.disabled = true;
    btn.style.background = '#6b7280';
    btn.style.cursor = 'default';
    btn.onclick = null;
  }
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


(function() { if (typeof emailjs !== 'undefined') emailjs.init("JI1iX7kMcKuHQBrGW"); })();

document.getElementById('modalApplyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // 1. Get the current user
    // Custom auth already checked by requireAuth()


    const submitBtn = e.target.querySelector('button[type="submit"]');
    const cvFile = document.getElementById('cvUpload')?.files[0];

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        let cvUrl      = window.existingCvUrl || null;
        let cvOrigName = cvUrl ? decodeURIComponent(cvUrl.split('/').pop().split('?')[0]) : null;

        if (cvFile) {
            submitBtn.innerText = "Uploading CV...";
            const fileName = `${Date.now()}-${cvFile.name}`;
            const { error: uploadError } = await supabaseClient.storage
                .from('resumes').upload(fileName, cvFile);
            if (uploadError) throw uploadError;
            const { data: urlData } = supabaseClient.storage.from('resumes').getPublicUrl(fileName);
            cvUrl      = urlData.publicUrl;
            cvOrigName = cvFile.name;
        }

        if (!cvUrl) {
            showToast("Please add a CV to your profile or upload one here.", 'warning');
            return;
        }

        const { error: dbError } = await supabaseClient
            .from('applications')
            .insert([{
                student_id:       window.currentStudentId,
                position_id:      window.currentPosition.position_id,
                cover_letter:     document.getElementById('applyLetter').value,
                cv_url:           cvUrl,
                cv_original_name: cvOrigName
            }]);

        if (dbError) throw dbError;

        // Notify employer by email
        const companyEmail = window.currentCompany?.contact_email;
        console.log('[Email] company contact_email:', companyEmail);
        console.log('[Email] emailjs loaded:', typeof emailjs !== 'undefined');
        if (companyEmail && typeof emailjs !== 'undefined') {
            const studentName = [
                document.getElementById('applyFirstName')?.value,
                document.getElementById('applyLastName')?.value
            ].filter(Boolean).join(' ') || 'A student';
            const emailParams = {
                to_email:       companyEmail,
                student_name:   studentName,
                position_title: window.currentPosition?.title || 'your position',
                cover_letter:   document.getElementById('applyLetter')?.value?.trim() || 'Not provided',
                profile_link:   window.location.href
            };
            console.log('[Email] sending with params:', emailParams);
            emailjs.send('service_gix61gn', 'template_new_application', emailParams)
                .then(() => console.log('[Email] sent successfully'))
                .catch(err => console.error('[Email] send failed:', err));
        } else if (!companyEmail) {
            console.warn('[Email] skipped — company has no contact_email in database');
        }

        showToast("Application sent!", 'success');
        closeApplyModal();

        const btn = document.getElementById('applyBtn');
        if (btn) {
            btn.textContent = '✓ Applied';
            btn.disabled = true;
            btn.style.background = '#6b7280';
            btn.style.cursor = 'default';
            btn.onclick = null;
        }

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
          .select(`
            application_id, status, applied_at, cover_letter, interview_date,
            student_profiles(id, first_name, last_name,
              Users(user_login)
            )
          `)
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

  container.innerHTML = apps.map(app => {
    const profile      = app.student_profiles || {};
    const fullName     = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Unknown';
    const email        = profile.Users?.user_login || '';
    const status       = app.status || 'pending';
    const statusLabel  = { pending: 'pending', viewed: 'in review', 'in review': 'in review', interview_scheduled: 'interview scheduled', accepted: 'accepted', rejected: 'rejected' }[status] || status;
    const appliedDate  = formatDateEuropean(app.applied_at);
    const existingDate = app.interview_date || '';
    const interviewDate = app.interview_date
      ? `<p style="margin:0.4rem 0 0; font-size:0.85rem; color:#059669;">📅 Interview: ${formatDateEuropean(app.interview_date)} ${new Date(app.interview_date).toLocaleTimeString('en-GB', {hour:'2-digit', minute:'2-digit'})}</p>`
      : '';
    const interviewBtn = app.interview_date
      ? `<button class="btn btn-small" style="font-size:0.78rem; background:#d1fae5; color:#065f46;" onclick="scheduleInterview('${fullName}', '${email}', ${app.application_id}, '${existingDate}')">✅ Scheduled</button>`
      : `<button class="btn btn-small btn-primary" style="font-size:0.78rem;" onclick="scheduleInterview('${fullName}', '${email}', ${app.application_id}, '')">📅 Schedule Interview</button>`;
    return `
      <div class="application-card" style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; flex-wrap:wrap; padding:1rem 0; border-bottom:1px solid #eee;">
        <div style="min-width:0; flex:1;">
          <h5 style="margin:0 0 0.25rem; font-size:1rem;">${window.currentPosition?.title || ''}</h5>
          <p style="margin:0; color:#374151; font-weight:600;">${fullName}</p>
          <p style="margin:0.25rem 0 0; font-size:0.9rem; color:#6b7280;">${email}</p>
          <p style="margin:0.5rem 0 0; font-size:0.85rem; color:#6b7280;">Applied: ${appliedDate}</p>
          <p style="margin:0.4rem 0 0; font-size:0.85rem;">Status: <span class="status-badge status-${status}">${statusLabel}</span></p>
          ${interviewDate}
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; flex-shrink:0;">
          <button class="btn btn-view" onclick="viewStudentProfile(${profile.id})">View</button>
          ${interviewBtn}
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
  } else if (status === 'interview_scheduled') {
    bgColor = '#d1fae5';
    textColor = '#065f46';
    statusText = 'interview scheduled';
  } else if (status === 'accepted' || status === 'ready') {
    bgColor = '#dcfce7';
    textColor = '#166534';
    statusText = 'accepted';
  } else if (status === 'rejected') {
    bgColor = '#fee2e2';
    textColor = '#991b1b';
    statusText = 'rejected';
  }

  return `<span style="display: inline-block; background: ${bgColor}; color: ${textColor}; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${statusText}</span>`;
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

function scheduleInterview(fullName, email, applicationId, existingDate) {
  const positionTitle = window.currentPosition?.title || 'internship position';
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
          <button class="btn btn-primary" onclick="confirmInterviewScheduleDetail()">Confirm &amp; Open Calendar</button>
          <button id="cancelInterviewBtnDetail" class="btn btn-outline" style="color:#dc2626;border-color:#dc2626;display:none;" onclick="cancelInterviewDetail()">Cancel Interview</button>
          <button class="btn btn-outline" onclick="document.getElementById('interviewDateModal').style.display='none'">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  modal._data = { fullName, email, positionTitle, applicationId };
  document.getElementById('interviewModalDesc').textContent = `${fullName} — ${positionTitle}`;
  document.getElementById('interviewModalTitle').textContent = existingDate ? 'Reschedule Interview' : 'Schedule Interview';
  document.getElementById('cancelInterviewBtnDetail').style.display = existingDate ? 'inline-block' : 'none';

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

function toLocalInputValue(date) {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

async function cancelInterviewDetail() {
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
    if (window.currentPosition) {
      await checkOwnerAndLoadApplicants(window.currentPosition.company_id, window.currentPosition.position_id);
    }
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

async function confirmInterviewScheduleDetail() {
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
    if (window.currentPosition) {
      await checkOwnerAndLoadApplicants(window.currentPosition.company_id, window.currentPosition.position_id);
    }
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

// Delete application from sidebar
async function deleteApplicationFromSidebar(applicationId, studentName) {
  if (!await showConfirm(`Delete application from ${studentName}?`, 'Delete')) return;

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
