/* ==========================================================
   cookie-consent.js — Cookie consent banner (GDPR)
   Evästehyväksyntäbanneri (GDPR-vaatimustenmukaisuus)
   ========================================================== */

/**
 * EN: Immediately-invoked function that shows a cookie consent banner once
 *     per browser session. It checks localStorage first so the banner never
 *     re-appears after the user has already made a choice.
 *     The banner is injected into the DOM at runtime so no HTML changes are needed.
 * FI: Heti kutsuttava funktio, joka näyttää evästehyväksyntäbannerin kerran
 *     per selainistunto. Tarkistaa ensin localStoragen, joten banneri ei
 *     ilmesty uudelleen, kun käyttäjä on jo tehnyt valinnan.
 *     Banneri lisätään DOM:iin ajonaikaisesti, joten HTML:ään ei tarvita muutoksia.
 */
(function () {
  // EN: Skip rendering entirely if the user already accepted or declined cookies.
  //     This avoids a layout-shift flash on every page load.
  // FI: Ohita renderöinti kokonaan, jos käyttäjä on jo hyväksynyt tai hylännyt evästeet.
  //     Tämä estää asettelun välähtämisen jokaisella sivulatauksella.
  if (localStorage.getItem('cookieConsent')) return;

  // EN: Detect if we are inside the /footer_info/ subfolder so the policy link
  //     points to the correct relative path regardless of current page depth.
  // FI: Tunnista, olemmeko /footer_info/-alikansiossa, jotta käytäntölinkki
  //     osoittaa oikeaan suhteelliseen polkuun riippumatta nykyisestä sivusyvyydestä.
  const isFooterPage = window.location.pathname.includes('/footer_info/');
  const policyLink = isFooterPage ? 'cookie-policy.html' : 'footer_info/cookie-policy.html';

  // EN: Build the banner element programmatically — inline styles are used so
  //     the banner works even if the main stylesheet hasn't loaded yet.
  // FI: Rakennetaan bannerielementti ohjelmallisesti — inline-tyylejä käytetään,
  //     jotta banneri toimii, vaikka päätyylitiedostoa ei ole vielä ladattu.
  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
    'background:#1f2937', 'color:#f9fafb', 'padding:1rem 1.5rem',
    'display:flex', 'align-items:center', 'justify-content:space-between',
    'flex-wrap:wrap', 'gap:1rem', 'box-shadow:0 -2px 10px rgba(0,0,0,0.2)'
  ].join(';');

  // EN: Banner content — a short informational text with a link to the full
  //     Cookie Policy, plus Accept and Decline buttons.
  // FI: Bannerin sisältö — lyhyt tiedote ja linkki koko evästekäytäntöön,
  //     sekä Hyväksy- ja Hylkää-painikkeet.
  banner.innerHTML = `
    <p style="margin:0; font-size:0.9rem; flex:1; min-width:200px; color:#818cf8;">
      🍪 We use essential cookies to keep you logged in and make the site work.
      <a href="${policyLink}" style="color:#818cf8; text-decoration:underline;">Cookie Policy</a>
    </p>
    <div style="display:flex; gap:0.5rem; flex-shrink:0;">
      <button id="cookieAccept" style="background:#6366f1; color:white; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-size:0.875rem;">Accept</button>
      <button id="cookieDecline" style="background:transparent; color:#9ca3af; border:1px solid #4b5563; padding:8px 20px; border-radius:6px; cursor:pointer; font-size:0.875rem;">Decline</button>
    </div>
  `;

  document.body.appendChild(banner);

  // EN: When the user clicks Accept, store the consent flag in localStorage
  //     and remove the banner from the page. The flag persists across sessions.
  // FI: Kun käyttäjä klikkaa Hyväksy, tallennetaan suostumuslippu localStorageen
  //     ja poistetaan banneri sivulta. Lippu säilyy istuntojen välillä.
  document.getElementById('cookieAccept').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.remove();
  });

  // EN: When the user clicks Decline, we still store the flag ('declined') so
  //     the banner doesn't reappear — but no tracking cookies will be set.
  // FI: Kun käyttäjä klikkaa Hylkää, tallennetaan silti lippu ('declined'), jotta
  //     banneri ei ilmesty uudelleen — mutta seurantaevästeitä ei aseteta.
  document.getElementById('cookieDecline').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'declined');
    banner.remove();
  });
})();
