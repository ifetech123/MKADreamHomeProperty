// ============================================================
// app.js — MKA Dream Home Property
// Unified, deduplicated, production-ready JS
// Covers: index.html + learn-more pages (all in one file)
// ============================================================


// ============================================================
// 1. THEME SWITCHING + PERSISTENCE
// Single storage key — fixed conflict between old keys
// ============================================================
const THEME_KEY = 'mka_theme';
const DARK_MODE_KEY = 'mka_dark_mode';
const VALID_THEMES = ['theme-blue', 'theme-gold', 'theme-green'];

function applyTheme(themeClass) {
  if (!VALID_THEMES.includes(themeClass)) return;
  document.body.classList.remove(...VALID_THEMES);
  document.body.classList.add(themeClass);
  localStorage.setItem(THEME_KEY, themeClass);
}

// Init theme on every page load
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(VALID_THEMES.includes(saved) ? saved : 'theme-blue');
})();

// Theme pill click listeners (only on pages that have them)
document.querySelectorAll('.theme-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const theme = pill.getAttribute('data-theme');
    if (theme) {
      applyTheme(theme);
      pill.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.88)' }, { transform: 'scale(1)' }],
        { duration: 240 }
      );
    }
  });
});

// ============================================================
// 2. DARK MODE TOGGLE + PERSISTENCE
// ============================================================
const darkModeToggleBtn = document.getElementById('darkModeToggle');
const navDarkBtn = document.getElementById('navDarkToggle');

// Updates ALL dark mode buttons text at once
function updateDarkBtnText(isOn) {
  const label = isOn ? 'Light Mode' : 'Dark Mode';
  if (darkModeToggleBtn) darkModeToggleBtn.textContent = label;
  if (navDarkBtn) navDarkBtn.textContent = label;
}

function setDarkMode(isOn) {
  document.body.classList.toggle('dark-mode', isOn);
  updateDarkBtnText(isOn);
  localStorage.setItem(DARK_MODE_KEY, isOn ? '1' : '0');
}

// Init dark mode on every page load
(function initDarkMode() {
  const saved = localStorage.getItem(DARK_MODE_KEY);
  setDarkMode(saved === '1');
})();

// One toggle function used by BOTH buttons
function handleDarkToggle() {
  setDarkMode(!document.body.classList.contains('dark-mode'));
}

if (darkModeToggleBtn) darkModeToggleBtn.addEventListener('click', handleDarkToggle);
if (navDarkBtn) navDarkBtn.addEventListener('click', handleDarkToggle);


// ============================================================
// 3. MOBILE MENU TOGGLE
// ============================================================
const mobileMenu = document.getElementById('mobile-menu');
const mainNav = document.getElementById('main-nav');

function toggleMobileMenu(forceClose = false) {
  if (!mobileMenu || !mainNav) return;
  const isActive = forceClose ? false : !mainNav.classList.contains('active');
  mainNav.classList.toggle('active', isActive);
  mobileMenu.classList.toggle('active', isActive);
  mobileMenu.setAttribute('aria-expanded', String(isActive));
  document.body.style.overflow = isActive ? 'hidden' : '';
}

if (mobileMenu) {
  mobileMenu.addEventListener('click', () => toggleMobileMenu());
  mobileMenu.addEventListener('keyup', e => {
    if (e.key === 'Enter' || e.key === ' ') toggleMobileMenu();
  });
}

// Close menu when any nav link is clicked
document.querySelectorAll('#main-nav ul li a').forEach(link => {
  link.addEventListener('click', () => toggleMobileMenu(true));
});

// Close menu when clicking outside of it
document.addEventListener('click', e => {
  if (
    mainNav &&
    mainNav.classList.contains('active') &&
    !mainNav.contains(e.target) &&
    !mobileMenu.contains(e.target)
  ) {
    toggleMobileMenu(true);
  }
});


// ============================================================
// 4. FOOTER YEAR — auto-updates every year
// ============================================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}


// ============================================================
// 5. CONTACT FORM — connected to FormSubmit (real emails, free)
// Replace YOUR_EMAIL below with the actual business email
// First submission will ask FormSubmit to verify the email once
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showFormFeedback('Please fill in all fields.', 'error');
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('https://formsubmit.co/ajax/mkadproperties2019@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });

      const data = await res.json();

      if (data.success === 'true' || data.success === true) {
        showFormFeedback('Message sent! We\'ll be in touch shortly. 🎉', 'success');
        contactForm.reset();
      } else {
        throw new Error('FormSubmit returned failure');
      }
    } catch (err) {
      showFormFeedback('Something went wrong. Please call or email us directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function showFormFeedback(msg, type) {
  // Remove existing feedback if any
  const existing = document.getElementById('form-feedback');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.id = 'form-feedback';
  div.textContent = msg;
  div.style.cssText = `
    padding: .8rem 1rem;
    margin-top: .8rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: .95rem;
    background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
    color: ${type === 'success' ? '#065f46' : '#991b1b'};
    border: 1px solid ${type === 'success' ? '#6ee7b7' : '#fca5a5'};
  `;
  contactForm.appendChild(div);

  // Auto-remove after 5 seconds
  setTimeout(() => div.remove(), 5000);
}


// ============================================================
// 6. LIGHTBOX — for gallery images + videos (learn-more pages)
// Single clean implementation — no duplicates
// ============================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeLightboxBtn = document.querySelector('.close-lightbox');
const galleryItems = document.querySelectorAll('.gallery-grid img, .gallery-grid video');

if (lightbox && galleryItems.length > 0) {

  function openLightbox(item) {
    if (item.tagName === 'IMG') {
      lightboxImg.src = item.src;
      lightboxImg.style.display = 'block';
      if (lightboxVideo) {
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
      }
    } else if (item.tagName === 'VIDEO') {
      const source = item.querySelector('source');
      if (!source) return;
      if (lightboxVideo) {
        lightboxVideo.src = source.src;
        lightboxVideo.style.display = 'block';
        lightboxVideo.play();
      }
      lightboxImg.style.display = 'none';
    }
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightboxFn() {
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.currentTime = 0;
      lightboxVideo.src = '';
    }
    lightboxImg.src = '';
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', closeLightboxFn);
  }

  // Click outside to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightboxFn();
  });

  // ESC key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightboxFn();
  });
}


// ============================================================
// 7. PAYMENT PLAN MODAL (learn-more pages)
// ============================================================
const openModalBtn = document.getElementById('openModal');
const paymentModal = document.getElementById('paymentModal');
const closeModalBtn = document.querySelector('.close-modal');

if (openModalBtn && paymentModal) {

  function openModal() {
    paymentModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Click outside to close
  paymentModal.addEventListener('click', e => {
    if (e.target === paymentModal) closeModal();
  });

  // ESC key to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && paymentModal.style.display === 'flex') closeModal();
  });
}


// ============================================================
// 8. SCROLL FADE-IN ANIMATION
// Replaces CSS-only fadeInUp which fires once on load.
// Now triggers when each section scrolls into view.
// ============================================================
const fadeEls = document.querySelectorAll('.fadeInUp');

if ('IntersectionObserver' in window && fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Fire once only
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    observer.observe(el);
  });
}

// Add .visible to trigger the animation
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .fadeInUp.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  </style>
`);