// learn more.js
const images = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

images.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

const modal = document.getElementById('paymentModal');
document.getElementById('openModal').onclick = () => modal.style.display = 'flex';
document.querySelector('.close-modal').onclick = () => modal.style.display = 'none';

