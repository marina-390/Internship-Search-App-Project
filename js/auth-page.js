/* auth-page.js — login / register page logic */

console.log('[auth-page.js] loaded');

function switchTab(tab) {
  var loginForm    = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  var tabs         = document.querySelectorAll('.form-tab');

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

function toggleRoleFields() {
  var roleInput     = document.querySelector('input[name="role"]:checked');
  var studentFields = document.getElementById('studentFields');
  var companyFields = document.getElementById('companyFields');

  if (!roleInput || !studentFields || !companyFields) return;

  if (roleInput.value === 'student') {
    studentFields.style.display = 'block';
    companyFields.style.display = 'none';
  } else {
    studentFields.style.display = 'none';
    companyFields.style.display = 'block';
  }
}

function togglePasswordVisibility(fieldId) {
  var field = document.getElementById(fieldId);
  field.type = field.type === 'password' ? 'text' : 'password';
}

async function handleLogin(event) {
  event.preventDefault();

  var email     = document.getElementById('loginEmail').value.trim().toLowerCase();
  var password  = document.getElementById('loginPassword').value;
  var submitBtn = event.target.querySelector('button[type="submit"]');

  if (!email || !password) return;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Signing in...';

  try {
    var res = await supabaseClient
      .from('Users')
      .select('user_id, user_password, role')
      .eq('user_login', email)
      .single();

    var user  = res.data;
    var error = res.error;

    if (error || !user) {
      alert('No account found with that email. Please register and verify your email first.');
      return;
    }

    var match = dcodeIO.bcrypt.compareSync(password, user.user_password);
    if (!match) {
      alert('Incorrect password. Please try again.');
      return;
    }

    // Establish Supabase Auth session for RLS — ignored if old account has no auth.users entry
    await supabaseClient.auth.signInWithPassword({ email: email, password: password }).catch(function() {});

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId',   user.user_id);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userLogin', email);

    if      (user.role === 0) window.location.href = 'admin.html';
    else if (user.role === 1) window.location.href = 'student-profile.html';
    else if (user.role === 2) window.location.href = 'company-profile.html';
    else                      window.location.href = 'index.html';

  } catch (err) {
    console.error('Login error:', err);
    alert('An unexpected error occurred. Please try again.');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Sign In';
  }
}

async function handleRegister(event) {
  event.preventDefault();

  var firstName       = document.getElementById('firstName').value.trim();
  var lastName        = document.getElementById('lastName').value.trim();
  var email           = document.getElementById('regEmail').value.trim().toLowerCase();
  var password        = document.getElementById('regPassword').value;
  var confirmPassword = document.getElementById('confirmPassword').value;
  var roleValue       = document.querySelector('input[name="role"]:checked').value;
  var submitBtn       = event.target.querySelector('button[type="submit"]');

  if (firstName.length > 15 || lastName.length > 15) {
    alert('First Name and Last Name must not exceed 15 characters.');
    return;
  }
  if (!email.includes('@')) {
    alert('Please enter a valid email address containing "@".');
    return;
  }

  var digitCount       = (password.match(/\d/g) || []).length;
  var specialCharCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;

  if (password.length < 8) {
    alert('Password must be at least 8 characters long.');
    return;
  }
  if (digitCount < 2) {
    alert('Password must contain at least 2 numbers (0-9).');
    return;
  }
  if (specialCharCount < 2) {
    alert('Password must contain at least 2 special characters (e.g., !!, .., @#).');
    return;
  }
  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  var role = roleValue === 'student' ? 1 : 2;

  submitBtn.disabled    = true;
  submitBtn.textContent = 'Creating account...';

  try {
    console.log('[Register] step 1: checking duplicate email');
    var dupRes = await supabaseClient
      .from('Users')
      .select('user_id')
      .eq('user_login', email)
      .maybeSingle();

    console.log('[Register] step 1 result:', dupRes.data, dupRes.error);

    if (dupRes.data) {
      alert('An account with this email already exists. Please sign in.');
      return;
    }

    var companyMeta = null;
    if (role === 2) {
      var yTunnus = document.getElementById('yTunnus').value.trim();
      if (!/^\d{6,7}-\d$/.test(yTunnus)) {
        alert('Invalid Y-Tunnus format. Use: 123456-7 (6-7 digits - 1 digit)');
        return;
      }

      var ytRes = await supabaseClient
        .from('Companies')
        .select('company_id')
        .eq('y_tunnus', yTunnus)
        .maybeSingle();

      if (ytRes.error) throw ytRes.error;
      if (ytRes.data) {
        alert('Y-Tunnus "' + yTunnus + '" already registered! Only one account per company.');
        return;
      }

      companyMeta = {
        company_name: document.getElementById('companyName').value.trim() || (firstName + ' ' + lastName),
        job_title:    document.getElementById('jobTitle').value.trim() || 'Administrator',
        website:      document.getElementById('companyWebsite').value.trim() || null,
        y_tunnus:     yTunnus
      };
    }

    var salt           = dcodeIO.bcrypt.genSaltSync(10);
    var hashedPassword = dcodeIO.bcrypt.hashSync(password, salt);

    var metadata = {
      role:            role,
      first_name:      firstName,
      last_name:       lastName,
      hashed_password: hashedPassword
    };
    if (role === 1) {
      metadata.edu_level = document.getElementById('eduType').value;
    } else {
      Object.assign(metadata, companyMeta);
    }

    var redirectTo = new URL('verify-email.html', window.location.href).href;
    console.log('[Register] step 2: calling signUp, redirectTo =', redirectTo);

    var signUpRes = await supabaseClient.auth.signUp({
      email:    email,
      password: password,
      options:  { data: metadata, emailRedirectTo: redirectTo }
    });

    console.log('[Register] signUp result:', signUpRes.data, signUpRes.error);

    if (signUpRes.error) throw signUpRes.error;

    // If confirm email is OFF in Supabase — session is returned immediately, complete now
    if (signUpRes.data && signUpRes.data.session) {
      var authUser = signUpRes.data.user;
      var newUserRes = await supabaseClient
        .from('Users')
        .insert({ user_login: authUser.email, user_password: metadata.hashed_password, role: metadata.role })
        .select('user_id')
        .single();

      if (newUserRes.error) throw newUserRes.error;
      var newUser = newUserRes.data;

      if (metadata.role === 1) {
        await supabaseClient.from('student_profiles').insert({
          user_id:        newUser.user_id,
          first_name:     metadata.first_name,
          last_name:      metadata.last_name,
          type_education: metadata.edu_level || null
        });
      } else if (metadata.role === 2) {
        var compRes = await supabaseClient
          .from('Companies')
          .insert({ user_id: newUser.user_id, company_name: metadata.company_name, website: metadata.website || null, y_tunnus: metadata.y_tunnus })
          .select('company_id')
          .single();
        if (compRes.data) {
          await supabaseClient.from('company_team').insert({
            company_id: compRes.data.company_id,
            name:       firstName + ' ' + lastName,
            job_title:  metadata.job_title,
            email:      authUser.email
          });
        }
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId',    newUser.user_id);
      localStorage.setItem('userRole',  metadata.role);
      localStorage.setItem('userLogin', authUser.email);
      alert('Account created successfully!');
      window.location.href = metadata.role === 1 ? 'student-profile.html' : 'company-profile.html';
      return;
    }

    // Normal flow: show "check your email" message
    document.getElementById('registerFormContent').style.display = 'none';
    document.getElementById('emailSentMessage').style.display = 'block';
    document.getElementById('sentToEmail').textContent = email;

  } catch (err) {
    console.error('Registration error:', err);
    alert('Registration failed: ' + (err.message || String(err)));
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Create Account';
  }
}

async function resendConfirmEmail() {
  var email = document.getElementById('sentToEmail').textContent;
  if (!email) return;

  var redirectTo = new URL('verify-email.html', window.location.href).href;
  var { error } = await supabaseClient.auth.resend({ type: 'signup', email: email, options: { emailRedirectTo: redirectTo } });

  if (error) {
    showToast('Failed to resend: ' + error.message, 'error');
  } else {
    showToast('Confirmation email sent!', 'success');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var loginFormEl    = document.getElementById('loginForm_form');
  var registerFormEl = document.getElementById('registerForm_form');

  if (loginFormEl)    loginFormEl.addEventListener('submit', handleLogin);
  if (registerFormEl) registerFormEl.addEventListener('submit', handleRegister);

  var params = new URLSearchParams(window.location.search);
  switchTab(params.get('mode') === 'register' ? 'register' : 'login');
  toggleRoleFields();
});
