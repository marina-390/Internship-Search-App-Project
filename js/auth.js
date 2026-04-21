/* ==========================================
   AUTH HELPERS
   ========================================== */

  // Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('userId');
}

// Get current user session info from localStorage
function getCurrentSession() {
  if (!isLoggedIn()) return null;
  return {
    userId: parseInt(localStorage.getItem('userId')),
    role:   parseInt(localStorage.getItem('userRole')),
    login:  localStorage.getItem('userLogin')
  };
}

// Check auth and redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'auth.html';
    return null;
  }
  return getCurrentSession();
}

async function logout(event) {
  event.preventDefault();
  await supabaseClient.auth.signOut();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userLogin');
  window.location.href = 'index.html';
}

function checkCompanyAuth() {
  const session = getCurrentSession();
  if (!session) {
    window.location.href = 'auth.html?mode=login';
  } else if (session.role === 2) {
    window.location.href = 'company-profile.html';
  } else {
    alert('Only employer accounts can post internships.');
  }
}

/* ----------------------------------------------------------
   TAB SWITCHING
   ---------------------------------------------------------- */
function switchTab(tab) {
  const loginForm    = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs         = document.querySelectorAll('.form-tab');

  if (!loginForm || !registerForm) return;

  if (tab === 'login') {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    if (tabs[0]) tabs[0].classList.add('active');
    if (tabs[1]) tabs[1].classList.remove('active');
  } else {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    if (tabs[0]) tabs[0].classList.remove('active');
    if (tabs[1]) tabs[1].classList.add('active');
  }
}

/* ----------------------------------------------------------
   ROLE FIELD TOGGLE
   Shows student fields (university) OR company fields,
   never both at the same time.
   ---------------------------------------------------------- */
function toggleRoleFields() {
  const roleInput     = document.querySelector('input[name="role"]:checked');
  const studentFields = document.getElementById('studentFields');

  if (!roleInput || !studentFields || !companyFields) return;

  if (roleInput.value === 'student') {
    studentFields.style.display = 'block';
    companyFields.style.display = 'none';
  } else {
    studentFields.style.display = 'none';
    companyFields.style.display = 'block';
  }
}

/* ----------------------------------------------------------
   ON PAGE LOAD
   - Switch to correct tab based on URL param
   - Show correct role fields based on selected radio
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  switchTab(params.get('mode') === 'register' ? 'register' : 'login');
  toggleRoleFields(); // ensure correct fields shown on first load
});

/* ----------------------------------------------------------
   OAUTH — GOOGLE & GITHUB
   ---------------------------------------------------------- */
async function signInWithGoogle() {
  sessionStorage.setItem('oauth_pending', '1');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/auth.html' }
  });
  if (error) alert('Google sign-in failed: ' + error.message);
}

async function signInWithGitHub() {
  sessionStorage.setItem('oauth_pending', '1');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin + '/auth.html' }
  });
  if (error) alert('GitHub sign-in failed: ' + error.message);
}

async function signInWithLinkedIn() {
  sessionStorage.setItem('oauth_pending', '1');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: { redirectTo: window.location.origin + '/auth.html' }
  });
  if (error) alert('LinkedIn sign-in failed: ' + error.message);
}

// Runs after redirect back from OAuth provider
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (!session || localStorage.getItem('isLoggedIn') === 'true') return;
  if (!sessionStorage.getItem('oauth_pending')) return;
  if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') return;
  sessionStorage.removeItem('oauth_pending');
  await _handleOAuthUser(session);
});

async function _handleOAuthUser(session) {
  const email    = session.user.email;
  const fullName = session.user.user_metadata?.full_name ||
                   session.user.user_metadata?.name || '';

  const { data: existingUser } = await supabaseClient
    .from('Users')
    .select('user_id, role')
    .eq('user_login', email)
    .maybeSingle();

  if (existingUser) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId',    existingUser.user_id);
    localStorage.setItem('userRole',  existingUser.role);
    localStorage.setItem('userLogin', email);
    _redirectByRole(existingUser.role);
    return;
  }

  // New user — register as student
  const parts     = fullName.split(' ');
  const firstName = parts[0] || 'User';
  const lastName  = parts.slice(1).join(' ') || '';

  const { data: newUser, error: userError } = await supabaseClient
    .from('Users')
    .insert({ user_login: email, user_password: 'oauth', role: 1 })
    .select('user_id')
    .single();

  if (userError) { alert('Account creation failed: ' + userError.message); return; }

  await supabaseClient.from('student_profiles').insert({
    user_id:    newUser.user_id,
    first_name: firstName,
    last_name:  lastName
  });

  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userId',    newUser.user_id);
  localStorage.setItem('userRole',  '1');
  localStorage.setItem('userLogin', email);
  window.location.href = 'student-profile.html';
}

function _redirectByRole(role) {
  if      (role === 0) window.location.href = 'admin.html';
  else if (role === 1) window.location.href = 'student-profile.html';
  else if (role === 2) window.location.href = 'company-profile.html';
  else                 window.location.href = 'index.html';
}

async function showForgotPrompt() {
  const email = prompt("Enter your Gmail address:");
  if (!email) return;

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    // USE THE FULL URL HERE
    redirectTo: 'http://127.0.0.1:5500/update-password.html',
  });

  if (error) {
    alert("Error: " + error.message);
  } else {
    alert("Check your email! The link will now take you to the correct page.");
  }
}

async function loginUser(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
  });

  if (error) {
      console.error("Login Error:", error.message);
      alert("Login failed: " + error.message);
  } else {
      // Success!
      window.location.href = 'student-profile.html';
  }
}

// Function to update the user's password in Supabase Auth
async function updateSupabasePassword(newPassword) {
  try {
      const { data, error } = await supabaseClient.auth.updateUser({
          password: newPassword
      });

      if (error) {
          return { success: false, message: error.message };
      }
      
      return { success: true, data: data };
  } catch (err) {
      return { success: false, message: err.message };
  }
}