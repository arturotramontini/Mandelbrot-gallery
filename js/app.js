/**
 * Mandelbrot Exploration Gallery - Application Logic
 * Arturo Tramontini
 */

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');
  
  // Lightbox elements
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxReal = document.getElementById('lightbox-real');
  const lightboxImag = document.getElementById('lightbox-imag');
  const lightboxZoom = document.getElementById('lightbox-zoom');
  const lightboxIter = document.getElementById('lightbox-iter');
  const lightboxRes = document.getElementById('lightbox-res');
  const lightboxPal = document.getElementById('lightbox-palette');
  const lightboxEngine = document.getElementById('lightbox-engine');
  const lightboxDownloadBtn = document.getElementById('lightbox-download-btn');
  const copyCoordsBtn = document.getElementById('btn-copy-coords');
  const closeBtn = document.getElementById('lightbox-close');
  const toast = document.getElementById('toast-notice');

  let currentCategory = 'all';
  let currentSearch = '';
  let activeIndex = 0;
  let filteredItems = [];

  const data = window.MANDELBROT_DATA || [];

  // Function to render cards
  function renderGallery() {
    filteredItems = data.filter(item => {
      const matchCategory = currentCategory === 'all' || item.category.toLowerCase().includes(currentCategory.toLowerCase());
      const query = currentSearch.toLowerCase();
      const matchSearch = !query || 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.real.includes(query) ||
        item.imag.includes(query) ||
        item.palette.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });

    if (filteredItems.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-size: 1.2rem; margin-bottom: 8px;">Nessun frattale trovato con questi filtri.</p>
          <p style="font-size: 0.9rem; color: var(--text-dim);">Prova a cambiare termine di ricerca o seleziona un'altra categoria.</p>
        </div>
      `;
      return;
    }

    galleryGrid.innerHTML = filteredItems.map((item, idx) => `
      <article class="fractal-card" data-index="${idx}">
        <div class="card-media-wrapper" onclick="openLightbox(${idx})">
          <img class="card-img" src="${item.thumb}" alt="${item.title}" loading="lazy">
          <div class="card-overlay-badges">
            <span class="badge-category">${item.category}</span>
            <span class="badge-zoom">Zoom ${item.zoom}</span>
          </div>
        </div>
        <div class="card-body">
          <h2 class="card-title">${item.title}</h2>
          <p class="card-desc">${item.description}</p>
          
          <div class="spec-box">
            <div class="spec-row">
              <span class="spec-label">Re(c):</span>
              <span class="spec-value">${item.real.substring(0, 16)}...</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Im(c):</span>
              <span class="spec-value">${item.imag.substring(0, 16)}...</span>
            </div>
            <div class="spec-row">
              <span class="spec-label">Iterazioni:</span>
              <span class="spec-value">${item.iterations.toLocaleString()}</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-card-action btn-primary-action" onclick="openLightbox(${idx})">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              Dettagli
            </button>
            <a class="btn-card-action btn-download-action" href="${item.full}" download="${item.id}.jpg">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Scarica
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Filter button click
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      renderGallery();
    });
  });

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderGallery();
  });

  // Lightbox functions
  window.openLightbox = function(index) {
    activeIndex = index;
    const item = filteredItems[index];
    if (!item) return;

    lightboxImg.src = item.full;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.description;
    lightboxReal.textContent = item.real;
    lightboxImag.textContent = item.imag;
    lightboxZoom.textContent = item.zoom;
    lightboxIter.textContent = item.iterations.toLocaleString();
    lightboxRes.textContent = item.resolution;
    lightboxPal.textContent = item.palette;
    lightboxEngine.textContent = item.engine;
    
    lightboxDownloadBtn.href = item.full;
    lightboxDownloadBtn.setAttribute('download', `${item.id}.jpg`);

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') {
      if (activeIndex < filteredItems.length - 1) window.openLightbox(activeIndex + 1);
    }
    if (e.key === 'ArrowLeft') {
      if (activeIndex > 0) window.openLightbox(activeIndex - 1);
    }
  });

  // Copy coordinates function
  copyCoordsBtn.addEventListener('click', () => {
    const item = filteredItems[activeIndex];
    if (!item) return;
    const textToCopy = `Re: ${item.real}\nIm: ${item.imag}\nZoom: ${item.zoom}\nIter: ${item.iterations}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Coordinate matematiche copiate negli appunti!');
    }).catch(() => {
      showToast('Impossibile copiare negli appunti.');
    });
  });

  function showToast(msg) {
    toast.querySelector('.toast-msg').textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Initial render
  renderGallery();
});
