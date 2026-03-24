/* ==========================================
   STUDENT PROFILE (Supabase)
   ========================================== */

// Load student profile from Supabase
async function loadStudentProfile() {
  const session = requireAuth();
  if (!session) return;

  try {
    const { data: profile, error } = await supabaseClient
      .from('student_profiles')
      .select('*')
      .eq('user_id', session.userId)
      .single();

    if (error || !profile) {
      console.error('Error loading profile:', error);
      return;
    }

    // Update profile header
    const profileName = document.querySelector('.profile-info h2');
    const profileEmail = document.querySelectorAll('.profile-info p')[0];
    const profileUniversity = document.querySelectorAll('.profile-info p')[1];
    const profileLocation = document.querySelectorAll('.profile-info p')[2];

    if (profileName) profileName.textContent = (profile.first_name || '') + ' ' + (profile.last_name || '');
    if (profileEmail) profileEmail.textContent = session.login;
    if (profileUniversity) profileUniversity.innerHTML = profile.type_education || '';
    if (profileLocation) profileLocation.innerHTML = profile.city || '';

    // Update About Section
    const aboutDisplay = document.getElementById('aboutDisplay');
    if (aboutDisplay) aboutDisplay.textContent = profile.about || '';

    // Add Logout button
    addLogoutButton();
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

// Download CV
async function downloadCV() {
  const session = requireAuth();
  if (!session) return;

  try {
    const { data: profile } = await supabaseClient
      .from('student_profiles')
      .select('*')
      .eq('user_id', session.userId)
      .single();

    if (!profile) return;

    const fullName = (profile.first_name || '') + ' ' + (profile.last_name || '');

    const cvContent = `
═══════════════════════════════════════════════════════════
                      CURRICULUM VITAE
═══════════════════════════════════════════════════════════

NAME: ${fullName}
EMAIL: ${session.login}
LOCATION: ${profile.city || ''}

───────────────────────────────────────────────────────────
EDUCATION
───────────────────────────────────────────────────────────
${profile.type_education || ''}

───────────────────────────────────────────────────────────
ABOUT
───────────────────────────────────────────────────────────
${profile.about || ''}

═══════════════════════════════════════════════════════════
Downloaded on: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════════════════
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvContent));
    element.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_CV.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  } catch (err) {
    console.error('Error downloading CV:', err);
  }
}
