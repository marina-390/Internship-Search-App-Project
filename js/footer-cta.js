document.addEventListener('DOMContentLoaded', function () {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('userId');
  const cta = document.getElementById('ctaSection');
  if (loggedIn && cta) cta.style.display = 'none';
});
