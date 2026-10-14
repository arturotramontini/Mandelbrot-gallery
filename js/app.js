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
  const modalDownload = document.getElementById('modal-download-btn');

  const data = window.MANDELBROT_DATA || [];

  // Estrae la risoluzione in pixel (es. "7680 × 4320") dalla stringa dei dati
  function getCleanResolution(res) {
    if (!res) return '';
    const normalized = res.replace(/\\u00d7/g, '×');
    const match = normalized.match(/^([0-9]+\s*×\s*[0-9]+)/);
    return match ? match[1] : normalized.split('(')[0].trim();
  }

  // Renderizza i riquadri della griglia di posizionamento (3 colonne) con numero progressivo e risoluzione
  function renderGrid() {
    galleryGrid.innerHTML = data.map((item, index) => {
      const num = index + 1;
      const res = getCleanResolution(item.resolution);
      return `
        <div class="grid-cell" id="riquadro-${num}">
          <div class="cell-header">
            <span class="cell-number">${num}</span>
            <span class="cell-resolution">${res}</span>
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

  renderGrid();
});
