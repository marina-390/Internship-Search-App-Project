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