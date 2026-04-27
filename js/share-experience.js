const shareTestimonials = [];
let shareIndex = 0;
const PREVIEW_LENGTH = 100;

function formatStudentName(firstName, lastName) {
  if (!firstName && !lastName) return 'Anonymous';
  if (!lastName) return firstName;
  return `${firstName} ${lastName[0].toUpperCase()}.`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderText(text) {
  const safe = escHtml(text || '');
  if (!text || text.length <= PREVIEW_LENGTH) return safe;
  const short = escHtml(text.slice(0, PREVIEW_LENGTH).trimEnd()) + '…';
  return `<span class="review-text"><span class="review-short">${short}</span><span class="review-full" hidden>${safe}</span></span><button type="button" class="show-more-btn" onclick="toggleReviewText(this)">Show more</button>`;
}

function toggleReviewText(btn) {
  const container = btn.previousElementSibling;
  const short = container.querySelector('.review-short');
  const full = container.querySelector('.review-full');
  const expanding = full.hidden;
  full.hidden = !expanding;
  short.hidden = expanding;
  btn.textContent = expanding ? 'Show less' : 'Show more';
}

function updateCharCounter(textarea, counterId) {
  const counter = document.getElementById(counterId);
  if (!counter) return;
  const len = textarea.value.length;
  counter.textContent = len + '/200';
  counter.classList.toggle('char-limit', len >= 200);
}

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

function prevShareTestimonial() {
  shareIndex = (shareIndex - 1 + shareTestimonials.length) % shareTestimonials.length;
  updateShareCards();
}

function nextShareTestimonial() {
  shareIndex = (shareIndex + 1) % shareTestimonials.length;
  updateShareCards();
}

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
        prompt1: 'What surprised me most?',
        answer1: exp.question1 || '',
        prompt2: 'Top interview tip:',
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
    prompt1: 'What surprised me most?',
    answer1,
    prompt2: 'Top interview tip:',
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
