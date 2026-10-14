/**
 * Arturo Tramontini — Mandelbrot Minimalist Gallery
 * Logica visualizzazione immagini e download
 */

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const backdrop = document.getElementById('modal-backdrop');
  
  const modalImg = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalReal = document.getElementById('modal-real');
  const modalImag = document.getElementById('modal-imag');
  const modalZoom = document.getElementById('modal-zoom');
  const modalIter = document.getElementById('modal-iter');
  const modalRes = document.getElementById('modal-res');
  const modalViews = document.getElementById('modal-views');
  const siteViewsCount = document.getElementById('site-views-count');
  const modalDownload = document.getElementById('modal-download-btn');

  const data = window.MANDELBROT_DATA || [];

  // Estrae risoluzione, tipo file e dimensione in MB dai dati del frattale
  function getItemMeta(item) {
    const res = item.resolution || '';
    const normalized = res.replace(/\\u00d7/g, '×');
    const resMatch = normalized.match(/^([0-9]+\s*×\s*[0-9]+)/);
    const cleanRes = resMatch ? resMatch[1] : normalized.split('(')[0].trim();

    const mbMatch = normalized.match(/([\d.]+)\s*MB/i);
    const sizeMb = mbMatch ? (mbMatch[1] + ' MB') : '';

    let ext = 'PNG';
    if (item.filename && item.filename.includes('.')) {
      ext = item.filename.split('.').pop().toUpperCase();
    }
    return { cleanRes, ext, sizeMb };
  }

  // Renderizza i riquadri della griglia di posizionamento (3 colonne) con numero, risoluzione, tipo file e dimensione MB
  function renderGrid() {
    galleryGrid.innerHTML = data.map((item, index) => {
      const num = index + 1;
      const meta = getItemMeta(item);
      return `
        <div class="grid-cell" id="riquadro-${num}">
          <div class="cell-header">
            <span class="cell-number">${num}</span>
            <div class="cell-meta">
              <span class="cell-resolution">${meta.cleanRes}</span>
              <span class="cell-dot">·</span>
              <span class="cell-ext">${meta.ext}</span>
              <span class="cell-dot">·</span>
              <span class="cell-size">${meta.sizeMb}</span>
            </div>
          </div>
          <div class="image-item" onclick="openModal(${index})" title="${item.title}">
            <img src="${item.thumb || item.full}" alt="${item.title}" loading="lazy">
          </div>
        </div>
      `;
    }).join('');
  }

  // Apertura modale al click sull'immagine
  window.openModal = function(index) {
    const item = data[index];
    if (!item) return;

    modalImg.src = item.preview || item.full;
    modalTitle.textContent = item.title;
    modalReal.textContent = item.real;
    modalImag.textContent = item.imag;
    modalZoom.textContent = item.zoom;
    modalIter.textContent = item.iterations ? item.iterations.toLocaleString() : '-';
    modalRes.textContent = item.resolution || 'Originale';

    if (modalViews) modalViews.textContent = '...';
    trackArtworkView(item.id);

    modalDownload.href = item.downloadUrl || item.full;
    modalDownload.setAttribute('download', item.filename || `${item.id}.png`);

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Chiusura modale
  function closeModal() {
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Chiusura modale esclusivamente con il tasto ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Evidenzia in rosso il numero progressivo quando il mouse passa sul quadro
  galleryGrid.addEventListener('mouseover', (e) => {
    const item = e.target.closest('.image-item');
    if (item && item.parentElement) {
      item.parentElement.classList.add('item-hovered');
    }
  });

  galleryGrid.addEventListener('mouseout', (e) => {
    const item = e.target.closest('.image-item');
    if (item && item.parentElement) {
      item.parentElement.classList.remove('item-hovered');
    }
  });

  // Gestione Contatori Visite e Quadri (100% anonimo, senza cookie, GDPR-compliant)
  async function trackSiteVisit() {
    try {
      const alreadyVisited = sessionStorage.getItem('arturo_visited_site');
      const action = alreadyVisited ? 'get' : 'hit';
      const res = await fetch(`counter.php?action=${action}&target=site`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && siteViewsCount) {
          siteViewsCount.textContent = Number(json.site).toLocaleString();
          sessionStorage.setItem('arturo_visited_site', '1');
        }
      }
    } catch (e) {
      // silenzioso in caso di offline
    }
  }

  async function trackArtworkView(artworkId) {
    if (!artworkId) return;
    try {
      const sessionKey = 'arturo_viewed_' + artworkId;
      const alreadyViewed = sessionStorage.getItem(sessionKey);
      const action = alreadyViewed ? 'get' : 'hit';
      const res = await fetch(`counter.php?action=${action}&target=${encodeURIComponent(artworkId)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && modalViews) {
          const views = (json.artworks && json.artworks[artworkId] !== undefined)
            ? json.artworks[artworkId]
            : (json.views || 1);
          modalViews.textContent = Number(views).toLocaleString();
          sessionStorage.setItem(sessionKey, '1');
        }
      }
    } catch (e) {
      if (modalViews) modalViews.textContent = '-';
    }
  }

  renderGrid();
  trackSiteVisit();
});
