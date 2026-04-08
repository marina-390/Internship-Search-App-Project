async function loadInternshipDetail(positionId) {
    try {
        const { data: position, error: posError } = await supabaseClient
            .from('positions')
            .select('*')
            .eq('position_id', positionId)
            .single();
  
        if (posError || !position) throw new Error("Position not found");
  
        const { data: company, error: companyError } = await supabaseClient
            .from('Companies')
            .select('*')
            .eq('company_id', position.company_id)
            .single();

        if (companyError || !company) {
            console.warn('Company not found for position:', positionId);
            company = { company_name: 'Unknown Company' };
        }

        document.querySelector('.card-title').textContent = position.title;
        const companyNameEl = document.querySelector('.card-header .text-muted');
        if (companyNameEl) companyNameEl.textContent = company?.company_name || 'Unknown Company';

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
            salaryEl.textContent = position.salary && position.salary.trim() !== "" 
                                ? position.salary 
                                : 'Negotiable';
        }
        
                const durationEl = document.getElementById('displayDuration');
                if (durationEl) {
                    if (position.period_start && position.period_end) {
                        durationEl.textContent = `${position.period_start} - ${position.period_end}`;
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
        if (displayEmail) displayEmail.textContent = company?.email || 'No email provided.';

        const displayWebsite = document.getElementById('dWebsite');
        if (displayWebsite) displayWebsite.textContent = company?.website || 'N/A';

        const displayCity = document.getElementById('dHeadquarters');
        if (displayCity) displayCity.textContent = company?.city || 'N/A';

        const displayY = document.getElementById('dYTunnus');
        if (displayY) displayY.textContent = company?.y_tunnus || 'N/A';
  
        const responsibilitiesEl = document.getElementById('displayResponsibilities');
        if (responsibilitiesEl) responsibilitiesEl.textContent = position.responsibilities || 'No responsibilities.';
  
        const reqsElement = document.getElementById('pReqs'); 
        if (reqsElement) reqsElement.textContent = position.requirements || 'No requirements.';
  
        // 5. COMPANY CARD
        if (document.getElementById('dCompanyDesc')) document.getElementById('dCompanyDesc').textContent = company?.description || '';
        if (document.getElementById('dWebsite')) document.getElementById('dWebsite').textContent = company?.website || 'N/A';
        if (document.getElementById('dHeadquarters')) document.getElementById('dHeadquarters').textContent = company?.city || 'N/A';
        if (document.getElementById('dYTunnus')) document.getElementById('dYTunnus').textContent = company?.y_tunnus || 'N/A';
  
        window.currentPosition = position;
  
    } catch (err) {
        console.error('Error:', err);
    }
  }

  // --- MODAL LOGIC ---

  async function openApplyModal() {
    const pos = window.currentPosition;
    if (!pos) return;

    // 1. Set text safely
    document.getElementById('modalTitle').innerText = pos.title;
    
    // Grab the company name from the main page header
    const mainCompanyName = document.querySelector('.card-header .text-muted').innerText;
    document.getElementById('modalCompany').innerText = mainCompanyName;

    // 2. Clear previous custom lines so they don't double up
    document.getElementById('customLinesContainer').innerHTML = '';

    // 3. RUN THE EDIT MODULE CHECK
    await enableCompanyEditFeatures(pos.company_id);

    // 4. Show Modal
    document.getElementById('applyModal').style.display = "block";
    document.body.style.overflow = "hidden";
}

async function enableCompanyEditFeatures(companyId) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    const adminPanel = document.getElementById('companyFormControls');
    
    console.log("Logged in user:", user?.id); // DEBUG 1
    
    if (!adminPanel) return;
    adminPanel.style.display = "none";

    if (user) {
        const { data: company } = await supabaseClient
            .from('Companies')
            .select('owner_id')
            .eq('company_id', companyId)
            .single();

        console.log("Company Owner:", company?.owner_id); // DEBUG 2

        if (company && company.owner_id === user.id) {
            adminPanel.style.display = "block";
        }
    }
}
function closeApplyModal() {
    document.getElementById('applyModal').style.display = "none";
    document.body.style.overflow = "auto";
}

async function checkOwnershipAndShowControls(companyId) {
    const { data: { user } } = await supabase.auth.getUser();
    const controls = document.getElementById('companyFormControls');
    
    if (user) {
        // Fetch the company profile to see if this user is the owner
        const { data: company } = await supabase
            .from('Companies')
            .select('owner_id')
            .eq('company_id', companyId)
            .single();

        if (company && company.owner_id === user.id) {
            controls.style.display = "block"; // User is the owner!
        } else {
            controls.style.display = "none";
        }
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

// Function to clear the CV selection
function resetCVUpload() {
    const input = document.getElementById('cvUpload');
    input.value = ''; // Clear file
    document.getElementById('cvFileInfo').innerHTML = '<p id="cvStatusText" style="font-size: 0.9rem; color: #666;">No CV uploaded yet.</p>';
}

// Handle Form Submission
document.getElementById('modalApplyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const pos = window.currentPosition;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Gather values
    const applicationData = {
        position_id: pos.position_id,
        full_name: document.getElementById('applyName').value,
        email: document.getElementById('applyEmail').value,
        phone: document.getElementById('applyPhone').value,
        letter: document.getElementById('applyLetter').value,
        cv_file: document.getElementById('cvUpload').files[0]
    };

    if (!applicationData.cv_file) {
        alert("Please upload your CV before submitting.");
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";

        // Logic here for Supabase storage upload and table insert...
        // For now, we show success
        alert("Application sent successfully to " + pos.title + "!");
        closeApplyModal();
        this.reset();
        resetCVUpload();

    } catch (err) {
        console.error(err);
        alert("Error sending application.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Application";
    }
});