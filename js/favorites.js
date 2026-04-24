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