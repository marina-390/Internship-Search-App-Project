/* ==========================================================
   auth-page.js — Login / Register page UI logic
   Kirjautumis-/rekisteröintisivun käyttöliittymälogiikka
   ========================================================== */

console.log('[auth-page.js] loaded')

var BUSINESS_ID_CONFIG = {
  FI:    { label: 'Y-Tunnus (Finnish Business ID, required)',  placeholder: '1234567-8',           hint: 'Format: 6-7 digits, dash, 1 digit (e.g. 1234567-8)', regex: /^\d{6,7}-\d$/,     filter: /[^\d-]/g,      autoDash: null },
  EE:    { label: 'Registry Code (required)',                  placeholder: '12345678',             hint: 'Format: 8 digits',                                    regex: /^\d{8}$/,          filter: /[^\d]/g,       autoDash: null },
  SE:    { label: 'Organisationsnummer (required)',            placeholder: '123456-7890',          hint: 'Format: 6 digits, dash, 4 digits',                    regex: /^\d{6}-\d{4}$/,    filter: /[^\d-]/g,      autoDash: 6    },
  NO:    { label: 'Organisasjonsnummer (required)',            placeholder: '123456789',            hint: 'Format: 9 digits',                                    regex: /^\d{9}$/,          filter: /[^\d]/g,       autoDash: null },
  DE:    { label: 'Handelsregisternummer (required)',          placeholder: 'HRB 12345',            hint: 'e.g. HRA 12345 or HRB 12345',                         regex: /^HR[AB]\s*\d+$/i,  filter: /[^A-Za-z\d ]/g, autoDash: null },
  LV:    { label: 'Registration Number (required)',            placeholder: '40000000000',          hint: 'Format: 11 digits',                                   regex: /^\d{11}$/,         filter: /[^\d]/g,       autoDash: null },
  LT:    { label: 'Registration Number (required)',            placeholder: '123456789',            hint: 'Format: 9 digits',                                    regex: /^\d{9}$/,          filter: /[^\d]/g,       autoDash: null },
  OTHER: { label: 'Business Registration Number',             placeholder: 'Enter registration number', hint: 'Official business ID from your country',         regex: null,               filter: null,           autoDash: null }
};

function updateBusinessIdField() {
  var country = document.getElementById('companyCountry').value;
  var config = BUSINESS_ID_CONFIG[country] || BUSINESS_ID_CONFIG['OTHER'];
  var lbl = document.getElementById('businessIdLabel');
  lbl.textContent = config.label;
  lbl.classList.toggle('req', config.regex !== null);
  var input = document.getElementById('businessId');
  input.placeholder = config.placeholder;
  input.maxLength = config.regex ? config.placeholder.length + 5 : 50;
  input.value = '';
  input.style.borderColor = '';
  document.getElementById('businessIdHint').textContent = config.hint;
  var errEl = document.getElementById('businessIdError');
  if (errEl) errEl.style.display = 'none';
};

function onBusinessIdInput() {
  var country = document.getElementById('companyCountry').value;
  var config = BUSINESS_ID_CONFIG[country] || BUSINESS_ID_CONFIG['OTHER'];
  var input = document.getElementById('businessId');
  var errEl = document.getElementById('businessIdError');

  // Filter disallowed characters
  if (config.filter) {
    var pos = input.selectionStart;
    var before = input.value;
    input.value = before.replace(config.filter, '');
    if (input.value.length < before.length) {
      input.setSelectionRange(Math.max(0, pos - (before.length - input.value.length)), Math.max(0, pos - (before.length - input.value.length)));
    }
  }

  // Auto-dash for SE: XXXXXX-XXXX
  if (config.autoDash !== null) {
    var digits = input.value.replace(/\D/g, '');
    input.value = digits.length > config.autoDash
      ? digits.slice(0, config.autoDash) + '-' + digits.slice(config.autoDash)
      : digits;
  }

  // Live format validation
  var val = input.value.trim();
  if (!val) {
    input.style.borderColor = '';
    errEl.style.display = 'none';
    return;
  }
  if (config.regex) {
    if (config.regex.test(val)) {
      input.style.borderColor = '#22c55e';
      errEl.style.display = 'none';
    } else {
      input.style.borderColor = '#ef4444';
      errEl.textContent = config.hint;
      errEl.style.display = 'block';
    }
  } else {
    input.style.borderColor = '';
    errEl.style.display = 'none';
  }
}

/**
 * EN: Displays a temporary toast notification on the auth page.
 *     Any existing toast is removed first to prevent stacking.
 *     The toast fades out after 3.5 s and is removed from the DOM at 3.9 s.
 *     Uses inline styles so it works independently of the main stylesheet.
 * FI: Näyttää väliaikaisen ponnahdusviesti-ilmoituksen todennussivulla.
 *     Mahdollinen aiempi toast poistetaan ensin, jotta niitä ei pinota.
 *     Toast häipyy 3,5 s jälkeen ja poistetaan DOM:ista 3,9 s kohdalla.
 *     Käyttää inline-tyylejä toimiakseen riippumatta päätyylitiedostosta.
 * @param {string} message - EN: message to display / FI: näytettävä viesti
 * @param {'error'|'success'|'warning'|string} type - EN: controls color scheme / FI: ohjaa värimaailmaa
 */
function showToast(message, type) {
  var existing = document.getElementById('auth-toast');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.id = 'auth-toast';
  toast.textContent = message;
  toast.style.cssText = [
    'position:fixed', 'top:1.5rem', 'right:1.5rem', 'z-index:9999',
    'padding:0.85rem 1.25rem', 'border-radius:0.5rem',
    'font-size:0.95rem', 'font-weight:500', 'max-width:340px',
    'box-shadow:0 4px 16px rgba(0,0,0,0.15)',
    'transition:opacity 0.4s ease',
    type === 'error'
      ? 'background:#fee2e2;color:#b91c1c;border:1px solid #fca5a5'
      : 'background:#dcfce7;color:#15803d;border:1px solid #86efac'
  ].join(';');

  document.body.appendChild(toast);
  setTimeout(function() { toast.style.opacity = '0'; }, 3500);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3900);
}

/**
 * EN: Switches between Login and Register panels by toggling the 'active'
 *     CSS class. Defined here (and also in auth.js) because auth-page.js
 *     is the primary script for the auth.html page and must be self-contained.
 * FI: Vaihtaa kirjautumis- ja rekisteröintipaneelien välillä vaihtamalla
 *     'active'-CSS-luokkaa. Määritelty tässä (ja myös auth.js:ssä), koska
 *     auth-page.js on auth.html-sivun pääskripti ja sen täytyy olla itsenäinen.
 * @param {'login'|'register'} tab
 */
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

/**
 * EN: Shows or hides the student/company-specific registration fields
 *     depending on which role radio is checked. Also controls visibility of
 *     social-login buttons (hidden for companies because OAuth creates student
 *     accounts only).
 * FI: Näyttää tai piilottaa opiskelija/yrityskohtaiset rekisteröintikentät
 *     valitun roolin mukaan. Ohjaa myös sosiaalisen kirjautumisen painikkeiden
 *     näkyvyyttä (piilotettu yrityksiltä, koska OAuth luo vain opiskelijatilejä).
 */
function toggleRoleFields() {
  var roleInput     = document.querySelector('input[name="role"]:checked');
  var studentFields = document.getElementById('studentFields');
  var companyFields = document.getElementById('companyFields');
  var socialLogin   = document.getElementById('registerSocialLogin');
  var socialDivider = document.getElementById('registerSocialDivider');

  if (!roleInput || !studentFields || !companyFields) return;

  if (roleInput.value === 'student') {
    studentFields.style.display = 'block';
    companyFields.style.display = 'none';
    if (socialLogin)   socialLogin.style.display = 'grid';
    if (socialDivider) socialDivider.style.display = 'flex';
  } else {
    studentFields.style.display = 'none';
    companyFields.style.display = 'block';
    if (socialLogin)   socialLogin.style.display = 'none';
    if (socialDivider) socialDivider.style.display = 'none';
  }
}

/**
 * EN: Toggles a password input between 'password' (hidden) and 'text' (visible).
 *     Called by the eye-icon button next to each password field.
 * FI: Vaihtaa salasanakentän 'password' (piilotettu) ja 'text' (näkyvä) välillä.
 *     Kutsutaan silmäkuvakepainikkeesta kunkin salasanakentän vierestä.
 * @param {string} fieldId - EN: ID of the password input element / FI: salasanakentän elementti-ID
 */
function togglePasswordVisibility(fieldId) {
  var field = document.getElementById(fieldId);
  field.type = field.type === 'password' ? 'text' : 'password';
}

/**
 * EN: Handles the login form submit. Looks up the email in the custom Users
 *     table, compares the submitted password against the stored bcrypt hash,
 *     then establishes a Supabase Auth session for RLS before writing
 *     localStorage and redirecting by role.
 *     The Supabase Auth sign-in is wrapped in .catch() so legacy accounts
 *     without an auth.users entry can still log in via the custom table only.
 * FI: Käsittelee kirjautumislomakkeen lähetyksen. Hakee sähköpostin omasta
 *     Users-taulukosta, vertaa annettua salasanaa tallennettuun bcrypt-hashiin,
 *     sitten muodostaa Supabase Auth -istunnon RLS:ää varten ennen localStoragen
 *     kirjoittamista ja roolin mukaista uudelleenohjausta.
 *     Supabase Auth -kirjautuminen on .catch()-kutsun sisällä, jotta vanhat tilit
 *     ilman auth.users-tietuetta voivat silti kirjautua vain oman taulukon kautta.
 * @param {Event} event - EN: form submit event / FI: lomakkeen lähetystapahtuma
 */
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
      .select('user_id, user_password, role, preferred_lang')
      .eq('user_login', email)
      .single();

    var user  = res.data;
    var error = res.error;

    if (error || !user) {
      showToast('Please check your email and password.', 'error');
      return;
    }

    var match = dcodeIO.bcrypt.compareSync(password, user.user_password);
    if (!match) {
      showToast('Please check your email and password.', 'error');
      return;
    }

    // EN: Establish Supabase Auth session for RLS — silently ignored if the account
    //     pre-dates Supabase Auth and has no matching auth.users row.
    // FI: Muodostetaan Supabase Auth -istunto RLS:ää varten — virhe ohitetaan hiljaa,
    //     jos tili on luotu ennen Supabase Auth:ia eikä sillä ole auth.users-tietuetta.
    await supabaseClient.auth.signInWithPassword({ email: email, password: password }).catch(function() {});

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId',   user.user_id);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userLogin', email);
    if (user.preferred_lang) localStorage.setItem('lang', user.preferred_lang);

    if      (user.role === 0) window.location.href = 'admin.html';
    else if (user.role === 1) window.location.href = 'student-profile.html';
    else if (user.role === 2) window.location.href = 'company-profile.html';
    else                      window.location.href = 'index.html';

  } catch (err) {
    console.error('Login error:', err);
    showToast('Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Sign In';
  }
}

/**
 * EN: Handles the registration form submit for both student and company roles.
 *     Flow:
 *       1. Client-side validation (name length, email format, password strength).
 *       2. Duplicate email check against the Users table.
 *       3. Company-specific: validate Finnish Y-Tunnus format and uniqueness.
 *       4. Hash the password with bcrypt (client-side, salt rounds = 10).
 *       5. Call Supabase Auth signUp — metadata carries hashed password + profile data
 *          so the database trigger / email webhook can insert the rows on confirmation.
 *       6a. If email confirmation is OFF (session returned immediately):
 *           Insert Users, student_profiles / Companies + company_team rows inline.
 *       6b. If confirmation is ON: show "Check your email" message.
 * FI: Käsittelee rekisteröintilomakkeen lähetyksen sekä opiskelija- että yritysrooleille.
 *     Virta:
 *       1. Asiakaspuolen validointi (nimien pituus, sähköpostimuoto, salasanan vahvuus).
 *       2. Päällekkäisyyden tarkistus sähköpostille Users-taulukosta.
 *       3. Yrityskohtaisesti: Y-tunnuksen muodon ja ainutlaatuisuuden validointi.
 *       4. Salasanan hajautus bcryptillä (asiakaspuolella, suolaroundet = 10).
 *       5. Kutsutaan Supabase Auth signUp — metadata sisältää hajautetun salasanan
 *          + profiilitiedot, jotta DB-trigger / sähköpostiwebhook voi lisätä rivit vahvistuksessa.
 *       6a. Jos sähköpostin vahvistus on POIS päältä (istunto palautetaan heti):
 *           Lisätään Users, student_profiles / Companies + company_team inline.
 *       6b. Jos vahvistus on PÄÄLLÄ: näytetään "Tarkista sähköpostisi" -viesti.
 * @param {Event} event - EN: form submit event / FI: lomakkeen lähetystapahtuma
 */
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
    showToast('First and last name must not exceed 15 characters.', 'error');
    return;
  }
  if (!email.includes('@')) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  // EN: Count digits and special characters so each password rule can give a
  //     targeted error message rather than a generic "password is weak".
  // FI: Lasketaan numerot ja erikoismerkit erikseen, jotta jokaisesta
  //     salasanasäännöstä voidaan antaa kohdennettu virheilmoitus.
  var digitCount       = (password.match(/\d/g) || []).length;
  var specialCharCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;

  if (password.length < 8) {
    showToast('Password must be at least 8 characters long.', 'error');
    return;
  }
  if (digitCount < 2) {
    showToast('Password must contain at least 2 numbers.', 'error');
    return;
  }
  if (specialCharCount < 2) {
    showToast('Password must contain at least 2 special characters (e.g. !@#).', 'error');
    return;
  }
  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
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
      showToast('An account with this email already exists.', 'error');
      return;
    }

    var companyMeta = null;
    if (role === 2) {
      var country    = document.getElementById('companyCountry').value;
      var businessId = document.getElementById('businessId').value.trim();
      var bidConfig  = BUSINESS_ID_CONFIG[country] || BUSINESS_ID_CONFIG['OTHER'];

      if (bidConfig.regex && !bidConfig.regex.test(businessId)) {
        showToast('Invalid format for ' + bidConfig.label.replace(' (required)', '') + '.', 'error');
        return;
      }

      if (businessId) {
        var dupBizRes = await supabaseClient
          .from('Companies')
          .select('company_id')
          .eq('business_id', businessId)
          .eq('country', country)
          .maybeSingle();

        if (dupBizRes.error) throw dupBizRes.error;
        if (dupBizRes.data) {
          showToast('This business ID is already registered. Only one account per company.', 'error');
          return;
        }
      }

      if (country === 'FI' && businessId) {
        try {
          submitBtn.textContent = 'Verifying with business registry...';
          var prhUrl   = 'https://avoindata.prh.fi/bis/v1?businessId=' + encodeURIComponent(businessId);
          var proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(prhUrl);
          var prhRes   = await fetch(proxyUrl);
          var prhProxy = await prhRes.json();
          var prhData  = JSON.parse(prhProxy.contents);
          if (!prhData.results || prhData.results.length === 0) {
            showToast('Y-Tunnus not found in Finnish Business Registry.', 'error');
            return;
          }
        } catch (e) {
          console.warn('PRH API check failed, skipping:', e);
        }
        submitBtn.textContent = 'Creating account...';
      }

      companyMeta = {
        company_name: document.getElementById('companyName').value.trim() || (firstName + ' ' + lastName),
        job_title:    document.getElementById('jobTitle').value.trim() || 'Administrator',
        website:      document.getElementById('companyWebsite').value.trim() || null,
        country:      country,
        business_id:  businessId || null
      };
    }

    // EN: Hash the password client-side with bcrypt (cost 10) so the raw password
    //     is never stored. The hash is passed as Supabase user metadata so the
    //     custom Users table can store it without a server-side function.
    // FI: Hajautetaan salasana asiakaspuolella bcryptillä (kustannus 10), jotta
    //     raaka salasana ei tallennu. Hash välitetään Supabase-käyttäjän metadatana,
    //     jotta custom Users-taulukko voi tallentaa sen ilman palvelinpuolen funktiota.
    var salt           = dcodeIO.bcrypt.genSaltSync(10);
    var hashedPassword = dcodeIO.bcrypt.hashSync(password, salt);

    // EN: Metadata is embedded in the Supabase Auth user object; a DB trigger or
    //     the immediate-session branch below reads it to create the app-level records.
    // FI: Metadata upotetaan Supabase Auth -käyttäjäobjektiin; DB-triggeri tai
    //     alla oleva välittömän istunnon haara lukee sen sovellustasoisten tietueiden luomiseksi.
    var metadata = {
      role:            role,
      first_name:      firstName,
      last_name:       lastName,
      hashed_password: hashedPassword,
      preferred_lang:  localStorage.getItem('lang') || 'en'
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

    // EN: If Supabase email confirmation is disabled the session is returned
    //     immediately and we must insert the app-level records inline here.
    //     When confirmation IS enabled this block is skipped and the user sees
    //     the "check your email" message instead.
    // FI: Jos Supabase-sähköpostivahvistus on poissa käytöstä, istunto palautetaan
    //     välittömästi ja sovellustasoisten tietueiden lisäys tehdään tässä.
    //     Kun vahvistus ON käytössä, tämä lohko ohitetaan ja käyttäjä näkee
    //     "tarkista sähköpostisi" -viestin.
    // If confirm email is OFF in Supabase — session is returned immediately, complete now
    if (signUpRes.data && signUpRes.data.session) {
      var authUser = signUpRes.data.user;
      var newUserRes = await supabaseClient
        .from('Users')
        .insert({ user_login: authUser.email, user_password: metadata.hashed_password, role: metadata.role, preferred_lang: metadata.preferred_lang })
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
          .insert({ user_id: newUser.user_id, company_name: metadata.company_name, website: metadata.website || null, country: metadata.country, business_id: metadata.business_id })
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
      showToast('Account created successfully!', 'success');
      setTimeout(function() {
        window.location.href = metadata.role === 1 ? 'student-profile.html' : 'company-profile.html';
      }, 1000);
      return;
    }

    // Normal flow: show "check your email" message
    document.getElementById('registerFormContent').style.display = 'none';
    document.getElementById('emailSentMessage').style.display = 'block';
    document.getElementById('sentToEmail').textContent = email;

  } catch (err) {
    console.error('Registration error:', err);
    showToast('Registration failed: ' + (err.message || 'Unknown error'), 'error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Create Account';
  }
}

/**
 * EN: Resends the Supabase signup confirmation email to the address shown in
 *     the "check your email" message. Uses the same redirectTo URL as the
 *     original signup so verify-email.html handles the token correctly.
 * FI: Lähettää Supabase-rekisteröintivahvistussähköpostin uudelleen osoitteeseen,
 *     joka näkyy "tarkista sähköpostisi" -viestissä. Käyttää samaa redirectTo-URL:ia
 *     kuin alkuperäinen rekisteröinti, jotta verify-email.html käsittelee tokenin oikein.
 */
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

/**
 * EN: Bootstraps the auth page on DOM ready:
 *     - Attaches submit handlers to login and register forms.
 *     - Reads the ?mode URL param to open the correct tab on direct links.
 *     - Ensures role-specific fields match the initially selected radio button.
 * FI: Alustaa todennussivun DOM:n latauksen jälkeen:
 *     - Liittää lähetyskäsittelijät kirjautumis- ja rekisteröintilomakkeisiin.
 *     - Lukee ?mode URL-parametrin avatakseen oikean välilehden suorilla linkeillä.
 *     - Varmistaa, että roolikohtaiset kentät vastaavat alun perin valittua radiopainiketta.
 */
document.addEventListener('DOMContentLoaded', function() {
  var loginFormEl    = document.getElementById('loginForm_form');
  var registerFormEl = document.getElementById('registerForm_form');

  if (loginFormEl)    loginFormEl.addEventListener('submit', handleLogin);
  if (registerFormEl) registerFormEl.addEventListener('submit', handleRegister);

  var params = new URLSearchParams(window.location.search);
  switchTab(params.get('mode') === 'register' ? 'register' : 'login');
  toggleRoleFields();
});
