/**
 * Arturo Tramontini — Mandelbrot Minimalist Gallery
 * Logica visualizzazione immagini e download
 */

document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');
  
  const modalImg = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalReal = document.getElementById('modal-real');
  const modalImag = document.getElementById('modal-imag');
  const modalZoom = document.getElementById('modal-zoom');
  const modalIter = document.getElementById('modal-iter');
  const modalRes = document.getElementById('modal-res');
  const modalDownload = document.getElementById('modal-download-btn');

  const data = window.MANDELBROT_DATA || [];

  // Renderizza solo la griglia di immagini pulita
  function renderGrid() {
    galleryGrid.innerHTML = data.map((item, idx) => `
      <div class="image-item" onclick="openModal(${idx})" title="${item.title}">
        <img src="${item.thumb || item.full}" alt="${item.title}" loading="lazy">
      </div>
    `).join('');
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

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  renderGrid();
});
