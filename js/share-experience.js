/* ==========================================================
   share-experience.js — Student experience testimonials
   Opiskelijakokemustodistukset (arvostelut / "Jaa kokemus")
   ========================================================== */

// EN: In-memory array holding all loaded testimonial objects.
//     Populated by loadExperiencesFromDB() and appended to by submitExperienceForm().
// FI: Muistinsisäinen taulukko, joka sisältää kaikki ladatut todistusobjektit.
//     Täytetään loadExperiencesFromDB()-funktiolla ja siihen lisätään submitExperienceForm()-funktiolla.
const shareTestimonials = [];

// EN: Current display index — points to the leftmost visible testimonial card.
// FI: Nykyinen näyttöindeksi — osoittaa vasemmanpuolisimpaan näkyvään todistuskorttiin.
let shareIndex = 0;

// EN: Character limit for the "preview" snippet shown before "Show more".
// FI: Merkkiraja "esikatselu"-katkelmalle, joka näytetään ennen "Näytä lisää" -painiketta.
const PREVIEW_LENGTH = 100;

/**
 * EN: Formats a student name for public display — last name is abbreviated
 *     to initial + period for privacy (e.g. "Anna K.").
 * FI: Muotoilee opiskelijan nimen julkista näyttöä varten — sukunimi lyhennetään
 *     alkukirjaimeksi + pisteeksi yksityisyyden vuoksi (esim. "Anna K.").
 * @param {string} firstName - EN: first name / FI: etunimi
 * @param {string} lastName - EN: last name / FI: sukunimi
 * @returns {string}
 */
function formatStudentName(firstName, lastName) {
  if (!firstName && !lastName) return 'Anonymous';
  if (!lastName) return firstName;
  return `${firstName} ${lastName[0].toUpperCase()}.`;
}

/**
 * EN: Escapes HTML special characters to prevent XSS when inserting
 *     user-submitted text via innerHTML. Used for all testimonial content.
 * FI: Pakottaa HTML-erikoismerkit XSS:n estämiseksi, kun käyttäjän lähettämää
 *     tekstiä lisätään innerHTML-ominaisuuden kautta. Käytetään kaikelle todistussisällölle.
 * @param {string} str - EN: raw user text / FI: raaka käyttäjäteksti
 * @returns {string} EN: escaped HTML-safe string / FI: pakotettu HTML-turvallinen merkkijono
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * EN: Renders review text with an optional "Show more / Show less" toggle if
 *     the text exceeds PREVIEW_LENGTH characters. Short texts are returned as
 *     plain escaped HTML. This keeps cards compact without losing content.
 * FI: Renderöi arvostelutekstin valinnaisella "Näytä lisää / Näytä vähemmän"
 *     vaihdolla, jos teksti ylittää PREVIEW_LENGTH-merkkimäärän. Lyhyet tekstit
 *     palautetaan pelkkänä pakotettuina HTML:nä. Pitää kortit kompakteina menettämättä sisältöä.
 * @param {string} text - EN: review text / FI: arvosteluteteksti
 * @returns {string} EN: HTML string / FI: HTML-merkkijono
 */
function renderText(text) {
  const safe = escHtml(text || '');
  if (!text || text.length <= PREVIEW_LENGTH) return safe;
  const short = escHtml(text.slice(0, PREVIEW_LENGTH).trimEnd()) + '…';
  return `<span class="review-text"><span class="review-short">${short}</span><span class="review-full" hidden>${safe}</span></span><button type="button" class="show-more-btn" onclick="toggleReviewText(this)">${t('shareExperience.showMore')}</button>`;
}

/**
 * EN: Toggles the visibility of the short/full review text spans
 *     and updates the button label accordingly.
 * FI: Vaihtaa lyhyen/täyden arvostelutekstin span-elementtien näkyvyyttä
 *     ja päivittää painikkeen tekstin vastaavasti.
 * @param {HTMLButtonElement} btn - EN: the "Show more/less" button / FI: "Näytä lisää/vähemmän" -painike
 */
function toggleReviewText(btn) {
  const container = btn.previousElementSibling;
  const short = container.querySelector('.review-short');
  const full = container.querySelector('.review-full');
  const expanding = full.hidden;
  full.hidden = !expanding;
  short.hidden = expanding;
  btn.textContent = expanding ? t('shareExperience.showLess') : t('shareExperience.showMore');
}

/**
 * EN: Updates the character counter display for a textarea.
 *     Adds the 'char-limit' CSS class when the user reaches the max
 *     to visually warn them before hitting the hard database limit.
 * FI: Päivittää merkkilaskurin näytön tekstialueelle.
 *     Lisää 'char-limit'-CSS-luokan, kun käyttäjä saavuttaa maksimin,
 *     varoittaakseen visuaalisesti ennen kovaa tietokantarajaa.
 * @param {HTMLTextAreaElement} textarea - EN: the input element / FI: syöteelementti
 * @param {string} counterId - EN: ID of the counter display element / FI: laskurin näyttöelementin ID
 */
function updateCharCounter(textarea, counterId) {
  const counter = document.getElementById(counterId);
  if (!counter) return;
  const len = textarea.value.length;
  counter.textContent = len + '/200';
  counter.classList.toggle('char-limit', len >= 200);
}

/**
 * EN: Returns the inner HTML for a single testimonial card given a data object.
 *     All user-provided strings are run through escHtml to prevent XSS.
 * FI: Palauttaa yksittäisen todistuskortin sisäisen HTML:n dataobjektista.
 *     Kaikki käyttäjän antamat merkkijonot käytetään escHtml:n läpi XSS:n estämiseksi.
 * @param {object} data - EN: testimonial data object / FI: todistusdataobjekti
 * @returns {string} EN: HTML string / FI: HTML-merkkijono
 */
function createTestimonialHtml(data) {
  return `
    <div class="testimonial-avatar">
      <span class="avatar-circle" style="background: ${escHtml(data.avatarColor)};">${escHtml(data.initials)}</span>
      <div class="testimonial-header"><h3>${escHtml(data.name)}</h3><p>${escHtml(data.role)}</p></div>
    </div>
    <div class="testimonial-copy">
      <div><strong>${escHtml(data.prompt1)}</strong>${renderText(data.answer1)}</div>
      <div><strong>${escHtml(data.prompt2)}</strong>${renderText(data.answer2)}</div>
    </div>
  `;
}

/**
 * EN: Renders the two visible testimonial cards (left = current index,
 *     right = next index wrapped). Clears both if the array is empty.
 * FI: Renderöi kaksi näkyvää todistuskorttia (vasen = nykyinen indeksi,
 *     oikea = seuraava indeksi kierrätettyä). Tyhjentää molemmat, jos taulukko on tyhjä.
 */
function updateShareCards() {
  const left = document.getElementById('testimonialLeft');
  const right = document.getElementById('testimonialRight');
  if (!left || !right) return;
  if (shareTestimonials.length === 0) {
    left.innerHTML = '';
    right.innerHTML = '';
    return;
  }
  left.innerHTML = createTestimonialHtml(shareTestimonials[shareIndex]);
  if (shareTestimonials.length > 1) {
    right.innerHTML = createTestimonialHtml(shareTestimonials[(shareIndex + 1) % shareTestimonials.length]);
  } else {
    right.innerHTML = '';
  }
}

/**
 * EN: Navigates to the previous testimonial (wraps around when at index 0).
 * FI: Navigoi edelliseen todistukseen (kiertyy, kun indeksi on 0).
 */
function prevShareTestimonial() {
  shareIndex = (shareIndex - 1 + shareTestimonials.length) % shareTestimonials.length;
  updateShareCards();
}

/**
 * EN: Navigates to the next testimonial (wraps around to index 0 at the end).
 * FI: Navigoi seuraavaan todistukseen (kiertyy indeksiin 0 lopussa).
 */
function nextShareTestimonial() {
  shareIndex = (shareIndex + 1) % shareTestimonials.length;
  updateShareCards();
}

/**
 * EN: Fetches approved testimonials from the 'feedbacks' table (joined with
 *     student profile and position/company data) and populates shareTestimonials.
 *     Called on DOMContentLoaded so cards are visible on page load.
 *     Errors are silently swallowed so the rest of the page still loads.
 * FI: Hakee hyväksytyt todistukset 'feedbacks'-taulukosta (yhdistettynä
 *     opiskelijan profiiliin ja positio/yritystietoihin) ja täyttää shareTestimonials.
 *     Kutsutaan DOMContentLoaded-tapahtumassa, jotta kortit näkyvät sivun latauksessa.
 *     Virheet nielataan hiljaa, jotta muu sivu latautuu silti.
 */
async function loadExperiencesFromDB() {
  try {
    const { data } = await supabaseClient
      .from('feedbacks')
      .select(`
        id, question1, question2,
        applications(
          application_id,
          student_profiles(first_name, last_name),
          positions(title, Companies(company_name))
        )
      `)
      .order('created_at', { ascending: false });

    if (!data || data.length === 0) return;

    shareTestimonials.length = 0;
    data.forEach(exp => {
      const app = exp.applications;
      if (!app) return;
      const sp = app.student_profiles;
      const pos = app.positions;
      if (!sp || !pos) return;
      const name = formatStudentName(sp.first_name, sp.last_name);
      const companyName = pos.Companies ? pos.Companies.company_name : '';
      const role = companyName ? `${pos.title} @ ${companyName}` : pos.title;
      const initials = [sp.first_name, sp.last_name].filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'IN';
      shareTestimonials.push({
        initials, name, role,
        prompt1: t('shareExperience.prompt1'),
        answer1: exp.question1 || '',
        prompt2: t('shareExperience.prompt2'),
        answer2: exp.question2 || '',
        avatarColor: '#5a669d'
      });
    });
    shareIndex = 0;
    updateShareCards();
  } catch (e) {
    // keep cards empty on error
  }
}

/**
 * EN: Opens the "Share Your Experience" modal. Enforces eligibility rules:
 *     - Must be logged in as a student (role 1).
 *     - Must have at least one accepted application.
 *     - Cannot re-review a position that already has feedback.
 *     Populates the position select with eligible (accepted, not yet reviewed) positions.
 * FI: Avaa "Jaa kokemuksesi" -modaalin. Pakottaa kelpoisuussäännöt:
 *     - Täytyy olla kirjautunut opiskelijana (rooli 1).
 *     - Täytyy olla vähintään yksi hyväksytty hakemus.
 *     - Ei voi arvostella uudelleen positiota, jolla on jo palaute.
 *     Täyttää positio-valinnan kelpoisilla (hyväksytyillä, ei vielä arvioituilla) positioilla.
 */
async function openExperienceModal() {
  const session = typeof getCurrentSession === 'function' ? getCurrentSession() : null;
  if (!session || session.role !== 1) {
    window.location.href = 'auth.html?mode=login';
    return;
  }

  const { data: profile } = await supabaseClient
    .from('student_profiles')
    .select('id, first_name, last_name')
    .eq('user_id', session.userId)
    .single();

  if (!profile) {
    showToast('Student profile not found.', 'error');
    return;
  }

  const { data: acceptedApps } = await supabaseClient
    .from('applications')
    .select('application_id, positions(title, Companies(company_name))')
    .eq('student_id', profile.id)
    .eq('status', 'accepted');

  if (!acceptedApps || acceptedApps.length === 0) {
    showToast('You can only share an experience once your application has been accepted.', 'warning');
    return;
  }

  // EN: Filter out applications that already have feedback so the student
  //     cannot submit duplicate reviews for the same internship.
  // FI: Suodatetaan pois hakemukset, joilla on jo palaute, jotta opiskelija
  //     ei voi lähettää päällekkäisiä arvosteluja samasta harjoittelusta.
  const appIds = acceptedApps.map(a => a.application_id);
  const { data: existing } = await supabaseClient
    .from('feedbacks')
    .select('application_id')
    .in('application_id', appIds);

  const reviewedIds = new Set((existing || []).map(e => e.application_id));
  const available = acceptedApps.filter(a => !reviewedIds.has(a.application_id));

  if (available.length === 0) {
    showToast('You have already shared your experience for all accepted internships.', 'info');
    return;
  }

  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || session.login;
  document.getElementById('shareStudentName').textContent = name;

  const select = document.getElementById('sharePositionSelect');
  select.innerHTML = '';
  available.forEach(app => {
    const pos = app.positions;
    const companyName = pos.Companies ? pos.Companies.company_name : '';
    const label = companyName ? `${pos.title} @ ${companyName}` : pos.title;
    const opt = document.createElement('option');
    opt.value = app.application_id;
    opt.textContent = label;
    select.appendChild(opt);
  });

  document.getElementById('shareModal').style.display = 'flex';
}

/**
 * EN: Closes the share-experience modal and resets all form fields and
 *     character counters so the next open starts with a clean state.
 * FI: Sulkee jakamistoiminnon modaalin ja nollaa kaikki lomakekentät ja
 *     merkkilaskurit, jotta seuraava avaus alkaa puhtaalta tilalta.
 */
function closeExperienceModal() {
  const modal = document.getElementById('shareModal');
  if (modal) modal.style.display = 'none';
  const form = document.getElementById('shareForm');
  if (form) form.reset();
  ['surpriseCount', 'tipCount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = '0/200'; el.classList.remove('char-limit'); }
  });
}

/**
 * EN: Submits a new testimonial to the 'feedbacks' table. The insert uses
 *     .select() with a full JOIN so the newly inserted row's related data is
 *     returned immediately — this lets us append the new testimonial card
 *     to shareTestimonials without a separate re-fetch.
 * FI: Lähettää uuden todistuksen 'feedbacks'-taulukkoon. Lisäys käyttää
 *     .select()-metodia täydellä JOIN-kyselyllä, joten juuri lisätyn rivin
 *     liittyvä data palautetaan välittömästi — tämä mahdollistaa uuden
 *     todistuskortin lisäämisen shareTestimonials-taulukkoon ilman erillistä uudelleenhakua.
 * @param {Event} event - EN: form submit event / FI: lomakkeen lähetystapahtuma
 */
async function submitExperienceForm(event) {
  event.preventDefault();
  const form = event.target;
  const applicationId = parseInt(document.getElementById('sharePositionSelect').value);
  const answer1 = form.surprise.value.trim();
  const answer2 = form.tip.value.trim();
  const btn = form.querySelector('.btn-publish');
  btn.disabled = true;

  const { data, error } = await supabaseClient
    .from('feedbacks')
    .insert({ application_id: applicationId, question1: answer1, question2: answer2 })
    .select(`
      id, question1, question2,
      applications(
        application_id,
        student_profiles(first_name, last_name),
        positions(title, Companies(company_name))
      )
    `)
    .single();

  btn.disabled = false;

  if (error) {
    console.error('feedbacks insert error:', error);
    showToast('Failed to save: ' + (error.message || 'unknown error'), 'error');
    return;
  }

  const app = data.applications;
  const sp = app.student_profiles;
  const pos = app.positions;
  const name = formatStudentName(sp.first_name, sp.last_name);
  const companyName = pos.Companies ? pos.Companies.company_name : '';
  const role = companyName ? `${pos.title} @ ${companyName}` : pos.title;
  const initials = [sp.first_name, sp.last_name].filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'IN';
  shareTestimonials.push({
    initials, name, role,
    prompt1: t('shareExperience.prompt1'),
    answer1,
    prompt2: t('shareExperience.prompt2'),
    answer2,
    avatarColor: '#5a669d'
  });
  shareIndex = shareTestimonials.length - 1;
  updateShareCards();
  closeExperienceModal();
}

document.addEventListener('DOMContentLoaded', () => {
  const session = typeof getCurrentSession === 'function' ? getCurrentSession() : null;
  const btn = document.getElementById('writeStoryBtn');
  if (btn && (!session || session.role !== 1)) {
    btn.disabled = true;
  }
  updateShareCards();
  loadExperiencesFromDB();
});
