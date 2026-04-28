/* ==========================================================
   favorites.js — Supabase favorites sync & profile panel rendering
   Supabase-suosikkien synkronointi ja profiilipaneelin renderöinti
   ========================================================== */

/**
 * EN: Loads the current user's saved favorites from Supabase and renders them
 *     in the #favoritesContainer (student profile sidebar). After fetching,
 *     it also back-fills localStorage so heart icons on the same page reflect
 *     the Supabase state immediately. Period dates are fetched in a second
 *     query so each card can display start/end without storing them in the
 *     favorites table itself.
 * FI: Lataa nykyisen käyttäjän tallennetut suosikit Supabasesta ja renderöi ne
 *     #favoritesContainer-elementtiin (opiskelijan profiilipalkki). Haun jälkeen
 *     täyttää myös localStoragen, jotta sydänkuvakkeet samalla sivulla heijastavat
 *     Supabasen tilaa välittömästi. Jaksojen päivämäärät haetaan toisella kyselyllä,
 *     jotta jokainen kortti voi näyttää alku/loppu ilman niiden tallentamista
 *     suosikki-taulukkoon itsessään.
 */
// ── FAVORITES — Supabase sync + profile panel ──

async function loadFavorites() {
  const container = document.getElementById('favoritesContainer');
  if (!container) return;

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) {
    container.innerHTML = '<p style="font-size:0.85rem;color:var(--text-light);">Log in to see saved internships.</p>';
    return;
  }

  const { data, error } = await supabaseClient
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false });

  if (error || !data || data.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light); font-size:0.9rem;">No saved internships yet.</p>';
    return;
  }

  // EN: Write fetched IDs to localStorage so that heart icons rendered by
  //     script.js (which reads localStorage synchronously) are already correct
  //     before updateFavoriteStates() is called.
  // FI: Kirjoitetaan haetut ID:t localStorageen, jotta script.js:n renderöimät
  //     sydänkuvakkeet (jotka lukevat localStoragen synkronisesti) ovat jo oikein
  //     ennen updateFavoriteStates()-funktion kutsumista.
  // Also sync to localStorage so heart icons are correct
  const ids = data.map(f => f.internship_id.toString());
  localStorage.setItem('favorites', JSON.stringify(ids));

  // Load date info for saved position IDs when available
  const numericIds = ids.map(id => Number(id)).filter(id => Number.isInteger(id));
  const positionInfo = {};
  if (numericIds.length > 0) {
    const { data: positions } = await supabaseClient
      .from('positions')
      .select('position_id, period_start, period_end, is_open_ended')
      .in('position_id', numericIds);

    if (positions && Array.isArray(positions)) {
      positions.forEach(pos => {
        positionInfo[pos.position_id.toString()] = pos;
      });
    }
  }

  const formatDate = typeof window.formatDateEuropean === 'function'
    ? window.formatDateEuropean
    : dateString => {
        if (!dateString) return '';
        const d = new Date(dateString);
        return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
      };

  container.innerHTML = data.map(fav => {
    const position = positionInfo[fav.internship_id?.toString()];
    let periodText = '';
    if (position) {
      if (position.is_open_ended) {
        periodText = 'Open-ended';
      } else if (position.period_start || position.period_end) {
        const start = position.period_start ? formatDate(position.period_start) : 'TBD';
        const end = position.period_end ? formatDate(position.period_end) : 'Open';
        periodText = `${start} - ${end}`;
      }
    }

    return `
      <div class="fav-item" id="fav-${fav.id}">
        <div class="fav-item-info">
          <a href="internship-detail.html?id=${fav.internship_id}">${fav.title}</a>
          <span>${fav.company}${fav.location ? ' · ' + fav.location : ''}${periodText ? ' · ' + periodText : ''}</span>
        </div>
        <button class="fav-remove-btn" onclick="removeFavorite('${fav.id}', '${fav.internship_id}')" title="Remove">✕</button>
      </div>
    `;
  }).join('');
}

/**
 * EN: Removes a single favorite by its favorites table row ID (not the internship ID).
 *     Also removes it from localStorage and fires the 'favoritesUpdated' event so
 *     heart buttons on the same page update immediately.
 * FI: Poistaa yksittäisen suosikin sen suosikki-taulukon rivin ID:n perusteella
 *     (ei harjoittelu-ID:n). Poistaa sen myös localStoragesta ja laukaisee
 *     'favoritesUpdated'-tapahtuman, jotta sydänpainikkeet päivittyvät välittömästi.
 * @param {string} favId - EN: favorites table row ID / FI: suosikki-taulukon rivin ID
 * @param {string} internshipId - EN: position ID for localStorage cleanup / FI: positio-ID localStorage-siivousta varten
 */
async function removeFavorite(favId, internshipId) {
  const { error } = await supabaseClient.from('favorites').delete().eq('id', favId);
  if (!error) {
    document.getElementById('fav-' + favId)?.remove();

    // Also remove from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updated = favorites.filter(id => id !== internshipId?.toString());
    localStorage.setItem('favorites', JSON.stringify(updated));

    const container = document.getElementById('favoritesContainer');
    if (container && !container.querySelector('.fav-item')) {
      container.innerHTML = '<p style="color:var(--text-light); font-size:0.9rem;">No saved internships yet.</p>';
    }

    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('favoritesUpdated', {
        detail: { internshipId, isFavorite: false }
      }));
    }
  }
}

/**
 * EN: Removes a favorite by internship position ID rather than the row ID.
 *     Used by internship-detail.js after a student submits an application —
 *     applying to a position should automatically un-save it from favorites.
 *     Returns false on any error so the caller can continue gracefully.
 * FI: Poistaa suosikin harjoittelun positio-ID:n perusteella eikä rivin ID:n.
 *     Käytetään internship-detail.js:ssä sen jälkeen, kun opiskelija lähettää
 *     hakemuksen — paikkaan hakemisen pitäisi automaattisesti poistaa se suosikeista.
 *     Palauttaa false virheen yhteydessä, jotta kutsuja voi jatkaa siististi.
 * @param {string|number} internshipId - EN: position ID / FI: positio-ID
 * @returns {Promise<boolean>}
 */
async function removeFavoriteByInternshipId(internshipId) {
  if (!internshipId) return false;

  const { data, error } = await supabaseClient
    .from('favorites')
    .select('id')
    .eq('internship_id', internshipId)
    .single();

  if (error || !data || !data.id) return false;

  const { error: deleteError } = await supabaseClient
    .from('favorites')
    .delete()
    .eq('id', data.id);

  if (deleteError) return false;

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const updated = favorites.filter(id => id !== internshipId?.toString());
  localStorage.setItem('favorites', JSON.stringify(updated));

  if (typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { internshipId, isFavorite: false }
    }));
  }

  return true;
}

/**
 * EN: Writes a favorite add/remove to Supabase when the user clicks a heart
 *     button on the internships listing or detail page. Uses upsert with a
 *     unique constraint on (user_id, internship_id) so accidental double-clicks
 *     don't create duplicate rows. Title/company/location are denormalised into
 *     the favorites row so the profile panel can render without a JOIN.
 * FI: Kirjoittaa suosikin lisäyksen/poiston Supabaseen, kun käyttäjä klikkaa
 *     sydänpainiketta harjoittelulistaus- tai yksityiskohtasivulla. Käyttää upsertiä
 *     ainutlaatuisella rajoitteella (user_id, internship_id), jotta vahingolliset
 *     kaksoisklikkaamiset eivät luo päällekkäisiä rivejä. Otsikko/yritys/sijainti
 *     on denormalisoitu suosikkiriviin, jotta profiilipaneeli voi renderöidä ilman JOIN-kyselyä.
 * @param {string} internshipId - EN: position ID / FI: positio-ID
 * @param {boolean} isAdding - EN: true = add, false = remove / FI: true = lisää, false = poista
 */
// Called from script.js when a heart button is clicked on internships page
async function syncFavoriteToSupabase(internshipId, isAdding) {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;

  if (isAdding) {
    // Get job info from the card or detail page if no card exists
    const card = document.querySelector(`[data-job-id="${internshipId}"]`);
    const title = card?.querySelector('.job-title')?.textContent?.trim()
      || window.currentPosition?.title
      || document.querySelector('.card-title')?.textContent?.trim()
      || 'Unknown';
    const company = card?.querySelector('.job-company')?.textContent?.trim()
      || window.currentCompany?.company_name
      || document.querySelector('.text-muted')?.textContent?.trim()
      || 'Unknown';
    const location = card?.querySelector('.job-location')?.textContent?.trim()
      || window.currentCompany?.city
      || document.getElementById('displayLocation')?.textContent?.trim()
      || '';

    await supabaseClient.from('favorites').upsert({
      user_id: user.id,
      internship_id: internshipId,
      title,
      company,
      location
    }, { onConflict: 'user_id,internship_id' });
  } else {
    await supabaseClient
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('internship_id', internshipId);
  }
}

/**
 * EN: Fetches all saved favorites for the logged-in user and highlights the
 *     corresponding heart buttons on the page. Also syncs the IDs to
 *     localStorage so subsequent synchronous reads (getFavorites) stay accurate.
 *     Called on page load of the internships listing page.
 * FI: Hakee kirjautuneen käyttäjän kaikki tallennetut suosikit ja korostaa
 *     vastaavat sydänpainikkeet sivulla. Synkronoi myös ID:t localStorageen,
 *     jotta myöhemmät synkroniset luennat (getFavorites) pysyvät tarkkoina.
 *     Kutsutaan harjoittelulistaussivun sivun latauksessa.
 */
// On internships page — highlight hearts based on Supabase data
async function highlightSavedFavorites() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return;

  const { data } = await supabaseClient
    .from('favorites')
    .select('internship_id')
    .eq('user_id', user.id);

  if (!data) return;

  const savedIds = new Set(data.map(f => f.internship_id.toString()));

  // Sync to localStorage
  localStorage.setItem('favorites', JSON.stringify([...savedIds]));

  document.querySelectorAll('[data-job-id]').forEach(card => {
    const jobId = card.getAttribute('data-job-id');
    const btn = card.querySelector('.favorite-btn');
    if (btn && savedIds.has(jobId)) btn.innerHTML = '❤️';
  });
}

/**
 * EN: Bootstraps the favorites module on page load:
 *     - Loads and renders the favorites panel (student profile page).
 *     - Highlights saved hearts on the internships listing page.
 *     - Listens for 'favoritesUpdated' custom events to re-render without
 *       a full page reload (fired by toggleFavoriteBtn in script.js).
 *     - Listens for localStorage 'storage' events from other browser tabs
 *       so favorites stay in sync across tabs.
 * FI: Alustaa suosikkimoduulin sivun latauksessa:
 *     - Lataa ja renderöi suosikkipaneelin (opiskelijan profiilisivu).
 *     - Korostaa tallennetut sydämet harjoittelulistaussivulla.
 *     - Kuuntelee 'favoritesUpdated'-mukautettuja tapahtumia uudelleenrenderöintiä
 *       varten ilman täyttä sivun uudelleenlatausta (laukaisee toggleFavoriteBtn script.js:ssä).
 *     - Kuuntelee localStorage 'storage'-tapahtumia muista selainvälilehdistä,
 *       jotta suosikit pysyvät synkronoituina välilehtien välillä.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Wait for supabase to be initialized
  if (typeof supabase === 'undefined') {
    console.error('Supabase not loaded — check script order in HTML');
    return;
  }
  loadFavorites();
  highlightSavedFavorites();

  window.addEventListener('favoritesUpdated', () => {
    loadFavorites();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
      loadFavorites();
    }
  });
});