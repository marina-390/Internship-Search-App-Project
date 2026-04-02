async function loadInternshipDetail(positionId) {
  try {
      // 1. Fetch the main position
      const { data: position, error: posError } = await supabaseClient
          .from('positions')
          .select('*')
          .eq('position_id', positionId)
          .single();

      if (posError || !position) throw new Error("Position not found");

      // Fetch Company details separately
      const { data: company } = await supabaseClient
          .from('Companies')
          .select('company_name, description, city, website, y_tunnus')
          .eq('company_id', position.company_id)
          .single();

      // Main Header
      document.querySelector('.card-title').textContent = position.title;
      document.querySelector('.text-muted').textContent = company?.company_name || 'Unknown Company';

      // Meta badges (Location, Dates)
      const metaContainer = document.querySelector('.job-meta');
      const startDate = position.period_start ? new Date(position.period_start).toLocaleDateString() : 'TBD';
      const endDate = position.period_end ? new Date(position.period_end).toLocaleDateString() : 'Open-ended';
      
      metaContainer.innerHTML = `
          <span class="badge badge-primary">${company?.city || 'Remote'}</span>
          <span class="badge badge-secondary">${startDate} - ${endDate}</span>
      `;

      // About As
      const aboutUsElement = document.getElementById('pDesc'); 
      if (aboutUsElement) {
         aboutUsElement.textContent = company?.description || 'No company information available.';
      }



      // Resposibiliti
      const responsibilitiesEl = document.getElementById('displayResponsibilities');
      if (responsibilitiesEl) {
          responsibilitiesEl.textContent = position.responsibilities || 'No responsibilities listed.';
      }

      // Requirements
      const reqsElement = document.getElementById('pReqs'); 
      if (reqsElement) {
          reqsElement.textContent = position.requirements || 'No specific requirements listed.';
      }

      // Salary
      const overviewValues = document.querySelectorAll('.grid div p:last-child');
        if (overviewValues.length > 0) {
            overviewValues[0].textContent = position.salary || 'Negotiable';
        }


      // Company Profile Card
      document.getElementById('dCompanyDesc').textContent = company?.description || 'No description.';
      document.getElementById('dWebsite').textContent = company?.website || 'N/A';
      document.getElementById('dHeadquarters').textContent = company?.city || 'N/A';
      document.getElementById('dYTunnus').textContent = company?.y_tunnus || 'N/A';

      // Global store for the Apply form
      window.currentPosition = position;

  } catch (err) {
      console.error('Error:', err);
      document.querySelector('.card').innerHTML = `<p style="padding:2rem;">Error: ${err.message}</p>`;
  }
}