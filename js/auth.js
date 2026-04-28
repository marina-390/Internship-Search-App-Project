/* ==========================================================
   auth.js — Shared authentication helpers & OAuth handling
   Jaetut todennusapufunktiot ja OAuth-käsittely koko sovellukselle
   ========================================================== */

/* ----------------------------------------------------------
   SESSION HELPERS — read / write localStorage session state
   Istunnon apufunktiot — localStoragen tilan luku ja kirjoitus
   ---------------------------------------------------------- */

/**
 * EN: Checks whether a valid user session exists in localStorage.
 *     Both the login flag AND a userId must be present — prevents a
 *     partial-write state (e.g. interrupted login) from being treated
 *     as authenticated.
 * FI: Tarkistaa, onko localStoragessa kelvollinen käyttäjäistunto.
 *     Sekä kirjautumislippu ETTÄ userId täytyy olla olemassa — estää
 *     osittaisen kirjoitustilan käsittelyn todennettuna.
 * @returns {boolean}
 */
  // Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('userId');
}

/**
 * EN: Returns the current session object built from localStorage values.
 *     Returns null when no valid session exists so callers use a simple
 *     null-check instead of reading multiple localStorage keys directly.
 * FI: Palauttaa nykyisen istunto-objektin localStorage-arvoista rakennettuna.
 *     Palauttaa null, kun kelvollista istuntoa ei ole, jotta kutsujat
 *     käyttävät yksinkertaista null-tarkistusta.
 * @returns {{userId: number, role: number, login: string}|null}
 */
// Get current user session info from localStorage
function getCurrentSession() {
  if (!isLoggedIn()) return null;
  return {
    userId: parseInt(localStorage.getItem('userId')),
    role:   parseInt(localStorage.getItem('userRole')),
    login:  localStorage.getItem('userLogin')
  };
}

/**
 * EN: Guards a page that requires authentication. If not logged in, the
 *     user is immediately redirected to auth.html before any protected
 *     content is loaded or rendered.
 * FI: Suojaa sivun, joka vaatii kirjautumisen. Jos käyttäjä ei ole
 *     kirjautunut, hänet ohjataan auth.html-sivulle ennen kuin suojattua
 *     sisältöä ladataan tai renderöidään.
 * @returns {object|null} EN: session object, or null after redirect / FI: istunto-objekti tai null uudelleenohjauksen jälkeen
 */
// Check auth and redirect if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'auth.html';
    return null;
  }
  return getCurrentSession();
}

/**
 * EN: Signs the user out from both Supabase Auth and the local session.
 *     Clears all four localStorage keys used by the app and redirects home.
 *     Called from the nav logout link via onclick="logout(event)".
 * FI: Kirjaa käyttäjän ulos Supabase Auth:ista ja paikallisesta istunnosta.
 *     Tyhjentää kaikki neljä sovelluksen käyttämää localStorage-avainta
 *     ja ohjaa etusivulle. Kutsutaan nav-uloskirjautumislinkistä.
 * @param {Event} event - EN: click event, prevented so the link does not navigate / FI: klikkaustapahtuma
 */
async function logout(event) {
  event.preventDefault();
  await supabaseClient.auth.signOut();
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userLogin');
  window.location.href = 'index.html';
}

/**
 * EN: Guards the "Post Internship" entry point. Only employer accounts (role 2)
 *     may access company-profile.html. Students see a warning toast;
 *     unauthenticated users are redirected to login.
 * FI: Suojaa "Julkaise harjoittelu" -sisäänkäynnin. Vain työnantajatilit
 *     (rooli 2) pääsevät yritysprofiilisivulle. Opiskelijat saavat varoituksen;
 *     tunnistautumattomat käyttäjät ohjataan kirjautumiseen.
 */
function checkCompanyAuth() {
  const session = getCurrentSession();
  if (!session) {
    window.location.href = 'auth.html?mode=login';
  } else if (session.role === 2) {
    window.location.href = 'company-profile.html';
  } else {
    showToast('Only employer accounts can post internships.', 'warning');
  }
}

/* ----------------------------------------------------------
   TAB SWITCHING
   Välilehtien vaihto kirjautumis-/rekisteröintilomakkeiden välillä
   ---------------------------------------------------------- */

/**
 * EN: Switches between the Login and Register tab panels on auth.html.
 *     Adds/removes the 'active' class on both form containers and tab
 *     buttons so CSS handles the show/hide transition cleanly.
 * FI: Vaihtaa kirjautumis- ja rekisteröintivälilehtien välillä auth.html-sivulla.
 *     Lisää/poistaa 'active'-luokan lomakekontteihin ja välilehtipainikkeisiin.
 * @param {'login'|'register'} tab - EN: which panel to activate / FI: mikä paneeli aktivoidaan
 */
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
   Roolin kenttien vaihto — näyttää opiskelija- TAI yritystiedot,
   ei koskaan molempia samanaikaisesti.
   ---------------------------------------------------------- */

/**
 * EN: Dynamically shows/hides the correct set of registration fields based
 *     on the selected role radio button. Social login buttons are hidden for
 *     company accounts because OAuth providers return student-level metadata
 *     and cannot create employer accounts automatically.
 * FI: Näyttää/piilottaa oikeat rekisteröintikentät valitun roolin mukaan.
 *     Sosiaalinen kirjautuminen piilotetaan yrityksiltä, koska OAuth palauttaa
 *     opiskelijatason metatietoja eikä voi automaattisesti luoda työnantajatilejä.
 */
function toggleRoleFields() {
  const roleInput       = document.querySelector('input[name="role"]:checked');
  const studentFields   = document.getElementById('studentFields');
  const socialLogin     = document.getElementById('registerSocialLogin');
  const socialDivider   = document.getElementById('registerSocialDivider');

  if (!roleInput || !studentFields || !companyFields) return;

  if (roleInput.value === 'student') {
    studentFields.style.display = 'block';
    companyFields.style.display = 'none';
    if (socialLogin)   socialLogin.style.display = 'grid';
    if (socialDivider) socialDivider.style.display = 'flex';
  } else {
    studentFields.style.display = 'none';
    companyFields.style.display = 'block';
    // EN: Hide social login for companies — OAuth flow creates student profiles only
    // FI: Piilota sosiaalinen kirjautuminen yrityksiltä — OAuth luo vain opiskelijaprofiileja
    if (socialLogin)   socialLogin.style.display = 'none';
    if (socialDivider) socialDivider.style.display = 'none';
  }
}

/* ----------------------------------------------------------
   ON PAGE LOAD
   - Switch to correct tab based on URL param
   - Show correct role fields based on selected radio
   Sivun lataus — oikea välilehti URL-parametrista, oikeat kentät radiosta
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  // EN: ?mode=register opens the register tab directly — used by CTA buttons on other pages
  // FI: ?mode=register avaa rekisteröintivälilehden suoraan — käytetään muiden sivujen CTA-painikkeissa
  switchTab(params.get('mode') === 'register' ? 'register' : 'login');
  toggleRoleFields(); // ensure correct fields shown on first load
});

/* ----------------------------------------------------------
   OAUTH — GOOGLE & GITHUB
   Sosiaalinen kirjautuminen — Google, GitHub ja LinkedIn
   ---------------------------------------------------------- */

/**
 * EN: Sets a pending-OAuth flag in sessionStorage before redirecting to Google.
 *     The flag lets onAuthStateChange know this is a fresh sign-in rather
 *     than a normal page-load re-hydration of an existing session.
 * FI: Asettaa odottavan OAuth-lipun sessionStorageen ennen Googleen ohjausta.
 *     Lippu kertoo onAuthStateChange-kuuntelijalle, että kyseessä on tuore
 *     kirjautuminen eikä olemassa olevan istunnon uudelleenlataus.
 */
async function signInWithGoogle() {
  sessionStorage.setItem('oauth_pending', '1');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/auth.html' }
  });
  if (error) showToast('Google sign-in failed: ' + error.message, 'error');
}

/**
 * EN: Same OAuth pending-flag pattern as Google, but for GitHub.
 * FI: Sama OAuth-odottamislippukuvio kuin Googlella, mutta GitHubille.
 */
async function signInWithGitHub() {
  sessionStorage.setItem('oauth_pending', '1');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: window.location.origin + '/auth.html' }
  });
  if (error) showToast('GitHub sign-in failed: ' + error.message, 'error');
}

/**
 * EN: Same OAuth pending-flag pattern, but for LinkedIn (OIDC provider).
 * FI: Sama OAuth-odottamislippukuvio, mutta LinkedInille (OIDC-palveluntarjoaja).
 */
async function signInWithLinkedIn() {
  sessionStorage.setItem('oauth_pending', '1');
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'linkedin_oidc',
    options: { redirectTo: window.location.origin + '/auth.html' }
  });
  if (error) showToast('LinkedIn sign-in failed: ' + error.message, 'error');
}

/**
 * EN: Listens for Supabase auth state changes after the OAuth provider
 *     redirects back to auth.html. Three guards prevent double-execution:
 *     1) Skip if already logged in (avoids re-running on normal page loads)
 *     2) Skip if no pending OAuth flag (avoids triggering on existing sessions)
 *     3) Only react to SIGNED_IN / INITIAL_SESSION events
 * FI: Kuuntelee Supabase-todennustilan muutoksia OAuth-uudelleenohjauksen jälkeen.
 *     Kolme suojaa estää kaksinkertaisen suorituksen:
 *     1) Ohita, jos jo kirjautunut
 *     2) Ohita, jos ei odottavaa OAuth-lippua
 *     3) Reagoi vain SIGNED_IN / INITIAL_SESSION -tapahtumiin
 */
// Runs after redirect back from OAuth provider
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (!session || localStorage.getItem('isLoggedIn') === 'true') return;
  if (!sessionStorage.getItem('oauth_pending')) return;
  if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') return;
  sessionStorage.removeItem('oauth_pending');
  await _handleOAuthUser(session);
});

/**
 * EN: Handles the post-OAuth user-record logic:
 *     - Existing email in Users table → restore session flags and redirect.
 *     - New email → insert Users row (role 1) + student_profiles row, then redirect.
 *     Prefixed with _ to signal it is an internal helper not called from HTML.
 * FI: Käsittelee OAuth:n jälkeisen käyttäjätietuelogiikan:
 *     - Olemassa oleva sähköposti Users-taulukossa → palautetaan istuntolipput ja ohjataan.
 *     - Uusi sähköposti → lisätään Users-rivi (rooli 1) + student_profiles-rivi, sitten ohjataan.
 *     Etuliite _ merkitsee sisäistä apufunktiota, jota ei kutsuta HTML:stä.
 * @param {object} session - EN: Supabase session after OAuth redirect / FI: Supabase-istunto OAuth-uudelleenohjauksen jälkeen
 */
async function _handleOAuthUser(session) {
  const email    = session.user.email;
  const fullName = session.user.user_metadata?.full_name ||
                   session.user.user_metadata?.name || '';

  // EN: Check if this email already exists in the app's custom Users table
  // FI: Tarkista, onko tämä sähköposti jo sovelluksen omassa Users-taulukossa
  const { data: existingUser } = await supabaseClient
    .from('Users')
    .select('user_id, role, preferred_lang')
    .eq('user_login', email)
    .maybeSingle();

  if (existingUser) {
    // EN: Returning OAuth user — restore session and redirect immediately
    // FI: Palaava OAuth-käyttäjä — palautetaan istunto ja ohjataan heti
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId',    existingUser.user_id);
    localStorage.setItem('userRole',  existingUser.role);
    localStorage.setItem('userLogin', email);
    if (existingUser.preferred_lang) localStorage.setItem('lang', existingUser.preferred_lang);
    _redirectByRole(existingUser.role);
    return;
  }

  // New user — register as student
  // EN: Split the OAuth display name into first/last parts; safe fallbacks prevent
  //     an invalid profile row when the provider returns no name at all.
  // FI: Jaa OAuth-näyttönimi etu/sukunimi-osiin; turvalliset oletusarvot estävät
  //     virheellisen profiilirivin, kun palveluntarjoaja ei palauta nimeä lainkaan.
  const parts     = fullName.split(' ');
  const firstName = parts[0] || 'User';
  const lastName  = parts.slice(1).join(' ') || '';

  const { data: newUser, error: userError } = await supabaseClient
    .from('Users')
    .insert({ user_login: email, user_password: 'oauth', role: 1, preferred_lang: localStorage.getItem('lang') || 'en' })
    .select('user_id')
    .single();

  if (userError) { showToast('Account creation failed: ' + userError.message, 'error'); return; }

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

/**
 * EN: Redirects the user to the correct home page based on their numeric role.
 *     Role 0 = admin, 1 = student, 2 = company. Unknown roles fall back to index.
 * FI: Ohjaa käyttäjän oikealle kotisivulle numeerisen roolinsa perusteella.
 *     Rooli 0 = ylläpitäjä, 1 = opiskelija, 2 = yritys. Tuntematon rooli — etusivu.
 * @param {number} role - EN: numeric role from Users table / FI: numeerinen rooli Users-taulukosta
 */
function _redirectByRole(role) {
  if      (role === 0) window.location.href = 'admin.html';
  else if (role === 1) window.location.href = 'student-profile.html';
  else if (role === 2) window.location.href = 'company-profile.html';
  else                 window.location.href = 'index.html';
}

/**
 * EN: Opens the forgot-password modal and clears any leftover text so the
 *     input is always empty when the user opens it again.
 * FI: Avaa salasanan palautusmodaalin ja tyhjentää mahdollisen aiemman tekstin,
 *     jotta syötekenttä on aina tyhjä, kun käyttäjä avaa sen uudelleen.
 */
function showForgotPrompt() {
  const modal = document.getElementById('forgotModal');
  const input = document.getElementById('forgotEmailInput');
  if (modal) { input.value = ''; modal.style.display = 'block'; input.focus(); }
}

/**
 * EN: Closes the forgot-password modal.
 * FI: Sulkee salasanan palautusmodaalin.
 */
function closeForgotModal() {
  const modal = document.getElementById('forgotModal');
  if (modal) modal.style.display = 'none';
}

/**
 * EN: Sends a password-reset email via Supabase Auth. The redirectTo URL
 *     points to update-password.html so Supabase embeds the recovery token
 *     in the URL hash for the update page to consume automatically.
 * FI: Lähettää salasanan palautusviestin Supabase Auth:n kautta. redirectTo-URL
 *     osoittaa update-password.html-sivulle, jotta Supabase upottaa
 *     palautustokenin URL-hashiin päivityssivua varten.
 */
async function submitForgotPassword() {
  const email = document.getElementById('forgotEmailInput').value.trim();
  if (!email) { showToast('Please enter your email address.', 'warning'); return; }

  const redirectTo = window.location.origin + '/update-password.html';
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    showToast('Error: ' + error.message, 'error');
  } else {
    showToast('Reset link sent! Check your email.', 'success');
    closeForgotModal();
  }
}

/**
 * EN: Attempts to sign in with email/password via Supabase Auth.
 *     Used by accounts that were created through the Supabase Auth signUp flow.
 *     Older accounts (bcrypt-hashed in the custom Users table) use auth-page.js.
 * FI: Yrittää kirjautua sisään sähköpostilla ja salasanalla Supabase Auth:n kautta.
 *     Käytetään tileillä, jotka on luotu Supabase Auth signUp-virralla.
 *     Vanhemmat tilit (bcrypt-hajautettu custom Users-taulukkoon) käyttävät auth-page.js:ää.
 * @param {string} email - EN: user email / FI: käyttäjän sähköposti
 * @param {string} password - EN: plaintext password / FI: selväkielinen salasana
 */
async function loginUser(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
  });

  if (error) {
      console.error("Login Error:", error.message);
      showToast("Login failed: " + error.message, 'error');
  } else {
      // Success!
      window.location.href = 'student-profile.html';
  }
}

/**
 * EN: Updates the user's password in Supabase Auth. Called from the
 *     update-password.html page after a recovery-link click. Returns a
 *     result object instead of throwing so the caller can display the
 *     appropriate UI message without a try/catch block.
 * FI: Päivittää käyttäjän salasanan Supabase Auth:ssa. Kutsutaan
 *     update-password.html-sivulta palautuslinkin klikkauksen jälkeen.
 *     Palauttaa tulosobjektin heittämisen sijaan, jotta kutsuja voi
 *     näyttää sopivan UI-viestin ilman try/catch-rakennetta.
 * @param {string} newPassword - EN: new plaintext password / FI: uusi selväkielinen salasana
 * @returns {{success: boolean, data?: object, message?: string}}
 */
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