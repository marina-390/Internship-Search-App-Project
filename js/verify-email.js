const verifyTimeout = setTimeout(
  () => showError('Verification link expired or invalid. Please try registering again.'),
  15000
);

supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    clearTimeout(verifyTimeout);
    await completeRegistration(session.user);
  }
});

async function completeRegistration(user) {
  try {
    const { data: existing } = await supabaseClient
      .from('Users')
      .select('user_id, role, preferred_lang')
      .eq('user_login', user.email)
      .maybeSingle();

    if (existing) {
      await finishSession(existing.user_id, existing.role, user.email, existing.preferred_lang);
      return;
    }

    const meta = user.user_metadata;

    const { data: newUser, error: userError } = await supabaseClient
      .from('Users')
      .insert({
        user_login: user.email,
        user_password: meta.hashed_password,
        role: meta.role,
        preferred_lang: meta.preferred_lang || 'en'
      })
      .select('user_id')
      .single();

    if (userError) throw userError;

    if (meta.role === 1) {
      const { error: profileError } = await supabaseClient
        .from('student_profiles')
        .insert({
          user_id: newUser.user_id,
          first_name: meta.first_name,
          last_name: meta.last_name,
          type_education: meta.edu_level || null
        });
      if (profileError) throw profileError;

    } else if (meta.role === 2) {
      const { data: newCompany, error: compError } = await supabaseClient
        .from('Companies')
        .insert({
          user_id: newUser.user_id,
          company_name: meta.company_name,
          website: meta.website || null,
          country: meta.country,
          business_id: meta.business_id
        })
        .select('company_id')
        .single();

      if (compError) throw compError;

      const { error: teamError } = await supabaseClient
        .from('company_team')
        .insert({
          company_id: newCompany.company_id,
          name: `${meta.first_name} ${meta.last_name}`,
          job_title: meta.job_title,
          email: user.email
        });

      if (teamError) console.error('Team auto-add failed:', teamError);
    }

    await finishSession(newUser.user_id, meta.role, user.email, meta.preferred_lang || 'en');

  } catch (err) {
    console.error('Registration completion error:', err);
    showError(err.message);
  }
}

async function finishSession(userId, role, email, lang) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userId', userId);
  localStorage.setItem('userRole', role);
  localStorage.setItem('userLogin', email);
  if (lang) localStorage.setItem('lang', lang);

  document.getElementById('stateLoading').style.display = 'none';
  document.getElementById('stateSuccess').style.display = 'block';

  setTimeout(() => {
    window.location.href = role === 1 ? 'student-profile.html' : 'company-profile.html';
  }, 1500);
}

function showError(message) {
  document.getElementById('stateLoading').style.display = 'none';
  document.getElementById('stateError').style.display = 'block';
  document.getElementById('errorMsg').textContent = message;
}
