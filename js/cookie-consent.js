(function () {
  if (localStorage.getItem('cookieConsent')) return;

  const isFooterPage = window.location.pathname.includes('/footer_info/');
  const policyLink = isFooterPage ? 'cookie-policy.html' : 'footer_info/cookie-policy.html';

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0', 'z-index:99999',
    'background:#1f2937', 'color:#f9fafb', 'padding:1rem 1.5rem',
    'display:flex', 'align-items:center', 'justify-content:space-between',
    'flex-wrap:wrap', 'gap:1rem', 'box-shadow:0 -2px 10px rgba(0,0,0,0.2)'
  ].join(';');

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

  document.getElementById('cookieAccept').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.remove();
  });

  document.getElementById('cookieDecline').addEventListener('click', function () {
    localStorage.setItem('cookieConsent', 'declined');
    banner.remove();
  });
})();
