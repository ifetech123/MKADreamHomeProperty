// ============================================================
// app.js — MKA Dream Home Property
// Single unified file. No other JS files needed.
// ============================================================


// ============================================================
// 1. THEME SWITCHING + PERSISTENCE
// ONE storage key: 'mka_theme' — used everywhere
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

// Run on every page load
(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(VALID_THEMES.includes(saved) ? saved : 'theme-blue');
})();

// All theme pills on the page (header + nav mobile) share one listener
document.querySelectorAll('.theme-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const theme = pill.getAttribute('data-theme');
    if (theme) {
      applyTheme(theme);
      pill.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.86)' }, { transform: 'scale(1)' }],
        { duration: 220 }
      );
    }
  });
});


// ============================================================
// 2. DARK MODE — single shared handler for ALL buttons
//
// HOW IT WORKS:
// setDarkMode(true)  → adds 'dark-mode' class, saves '1', labels say "Light Mode"
// setDarkMode(false) → removes 'dark-mode' class, saves '0', labels say "Dark Mode"
// handleDarkToggle() → reads current state and flips it
//
// Both buttons (header + mobile nav) call the SAME handleDarkToggle()
// so they are always in sync.
// ============================================================
const darkModeToggleBtn = document.getElementById('darkModeToggle'); // desktop header btn
const navDarkBtn = document.getElementById('navDarkToggle');         // mobile nav btn

function updateAllDarkBtnLabels(isOn) {
  // "Light Mode" means: currently dark, click to go light
  // "Dark Mode"  means: currently light, click to go dark
  const label = isOn ? 'Light Mode' : 'Dark Mode';
  if (darkModeToggleBtn) darkModeToggleBtn.textContent = label;
  if (navDarkBtn) navDarkBtn.textContent = label;
}

function setDarkMode(isOn) {
  document.body.classList.toggle('dark-mode', isOn);
  updateAllDarkBtnLabels(isOn);
  localStorage.setItem(DARK_MODE_KEY, isOn ? '1' : '0');
}

// Read saved state on page load and apply it
(function initDarkMode() {
  const saved = localStorage.getItem(DARK_MODE_KEY);
  // saved === '1' → dark mode on, anything else → light mode
  setDarkMode(saved === '1');
})();

// One function — flips whatever the current state is
function handleDarkToggle() {
  const currentlyDark = document.body.classList.contains('dark-mode');
  setDarkMode(!currentlyDark);
}

// Both buttons point to the same handler
if (darkModeToggleBtn) darkModeToggleBtn.addEventListener('click', handleDarkToggle);
if (navDarkBtn) navDarkBtn.addEventListener('click', handleDarkToggle);


// ============================================================
// 3. MOBILE MENU TOGGLE
// ============================================================
const mobileMenu = document.getElementById('mobile-menu');
const mainNav = document.getElementById('main-nav');

function toggleMobileMenu(forceClose = false) {
  if (!mobileMenu || !mainNav) return;
  const open = forceClose ? false : !mainNav.classList.contains('active');
  mainNav.classList.toggle('active', open);
  mobileMenu.classList.toggle('active', open);
  mobileMenu.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

if (mobileMenu) {
  mobileMenu.addEventListener('click', () => toggleMobileMenu());
  mobileMenu.addEventListener('keyup', e => {
    if (e.key === 'Enter' || e.key === ' ') toggleMobileMenu();
  });
}

// Close when a nav link is clicked
document.querySelectorAll('#main-nav ul li a').forEach(link => {
  link.addEventListener('click', () => toggleMobileMenu(true));
});

// Close when clicking outside the menu
document.addEventListener('click', e => {
  if (
    mainNav &&
    mainNav.classList.contains('active') &&
    !mainNav.contains(e.target) &&
    mobileMenu &&
    !mobileMenu.contains(e.target)
  ) {
    toggleMobileMenu(true);
  }
});


// ============================================================
// 4. FOOTER YEAR
// ============================================================
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();


// ============================================================
// 5. CONTACT FORM — real emails via FormSubmit (free service)
// First time submitting: FormSubmit will send a confirmation
// email to mkadproperties2019@gmail.com — click confirm once.
// After that all messages go through automatically.
// ============================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
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
        showFormFeedback("Message sent! We'll be in touch shortly. 🎉", 'success');
        contactForm.reset();
      } else {
        throw new Error('Failed');
      }
    } catch {
      showFormFeedback('Something went wrong. Please call or email us directly.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function showFormFeedback(msg, type) {
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
  setTimeout(() => div.remove(), 5000);
}


// ============================================================
// 6. LIGHTBOX — gallery images + videos (learn-more pages)
// ============================================================
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightbox-img');
const lightboxVideo  = document.getElementById('lightbox-video');
const closeLightboxBtn = document.querySelector('.close-lightbox');
const galleryItems   = document.querySelectorAll('.gallery-grid img, .gallery-grid video');

if (lightbox && galleryItems.length > 0) {

  function openLightbox(item) {
    if (item.tagName === 'IMG') {
      lightboxImg.src = item.src;
      lightboxImg.style.display = 'block';
      if (lightboxVideo) { lightboxVideo.style.display = 'none'; lightboxVideo.pause(); }
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

  galleryItems.forEach(item => item.addEventListener('click', () => openLightbox(item)));
  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightboxFn);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightboxFn(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') closeLightboxFn();
  });
}


// ============================================================
// 7. PAYMENT PLAN MODAL (learn-more pages)
// ============================================================
const openModalBtn  = document.getElementById('openModal');
const paymentModal  = document.getElementById('paymentModal');
const closeModalBtn = document.querySelector('.close-modal');

if (openModalBtn && paymentModal) {
  const openModal  = () => { paymentModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; };
  const closeModal = () => { paymentModal.style.display = 'none'; document.body.style.overflow = ''; };

  openModalBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  paymentModal.addEventListener('click', e => { if (e.target === paymentModal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && paymentModal.style.display === 'flex') closeModal();
  });
}


// ============================================================
// 8. SCROLL FADE-IN (IntersectionObserver)
// Each section animates when it enters the viewport
// ============================================================
const fadeEls = document.querySelectorAll('.fadeInUp');

if ('IntersectionObserver' in window && fadeEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => observer.observe(el));
}


// ============================================================
// 9. SCROLL TO TOP BUTTON
// Appears after user scrolls 300px, smooth scrolls back to top
// ============================================================
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
  // Show/hide based on scroll position
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true }); // passive:true = better scroll performance

  // Smooth scroll to top on click
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ============================================================
// 10. PAGE LOADER
//
// HOW IT WORKS:
// The loader div starts with class 'active' (visible).
// We listen for the 'load' event — this fires when ALL
// assets (images, fonts, videos) are fully downloaded.
// Then we add 'hidden' class → CSS fades it out smoothly.
// After the fade (.5s), we remove it from the DOM entirely
// so it doesn't interfere with anything.
// ============================================================
const pageLoader = document.getElementById('page-loader');

if (pageLoader) {
  window.addEventListener('load', () => {
    // Small delay so loader doesn't flash away instantly
    // on fast connections — gives branded moment
    setTimeout(() => {
      pageLoader.classList.add('hidden');

      // Remove from DOM after fade animation completes
      pageLoader.addEventListener('transitionend', () => {
        pageLoader.remove();
      }, { once: true }); // { once: true } = listener fires only once then removes itself
    }, 600); // 600ms minimum display time
  });
}


// ============================================================
// 11. PROPERTY FILTER SYSTEM
//
// HOW IT WORKS:
// 1. User clicks a filter button (e.g. "Residential")
// 2. We read its data-filter value ("residential")
// 3. We loop through every .property-card
// 4. We check each card's data-type attribute
// 5. If it matches — show the card
//    If it doesn't  — add .filtered-out class (CSS hides it)
// 6. Update the count text "Showing X of Y properties"
// ============================================================
const filterBtns   = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('.property-card');
const filterCount  = document.getElementById('filterCount');

// Show all count on page load
updateFilterCount(propertyCards.length, propertyCards.length);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // Step 1 — update active button styling
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Step 2 — read which filter was clicked
    const filter = btn.getAttribute('data-filter');

    // Step 3 — loop through every card and decide show/hide
    let visibleCount = 0;

    propertyCards.forEach(card => {
      const type = card.getAttribute('data-type');

      // 'all' shows everything, otherwise match the type
      const isMatch = filter === 'all' || type === filter;

      if (isMatch) {
        card.classList.remove('filtered-out');
        visibleCount++;
      } else {
        card.classList.add('filtered-out');
      }
    });

    // Step 4 — update the count text
    updateFilterCount(visibleCount, propertyCards.length);

    // Step 5 — show "no results" message if nothing matches
    handleNoResults(visibleCount);
  });
});

function updateFilterCount(visible, total) {
  if (!filterCount) return;
  if (visible === total) {
    filterCount.textContent = `Showing all ${total} properties`;
  } else {
    filterCount.textContent = `Showing ${visible} of ${total} properties`;
  }
}

function handleNoResults(visibleCount) {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;

  // Remove existing no-results message if any
  const existing = grid.querySelector('.no-results');
  if (existing) existing.remove();

  // Add message if nothing is visible
  if (visibleCount === 0) {
    const msg = document.createElement('div');
    msg.className = 'no-results';
    msg.innerHTML = `
      <span>🔍</span>
      No properties found for this category yet.<br>
      <strong>Contact us</strong> — we may have unlisted options available.
    `;
    grid.appendChild(msg);
  }
}


// ============================================================
// 12. DYNAMIC PROPERTY DETAIL PAGE
//
// Only runs on property.html — checks if the element
// #detail-hero-content exists before doing anything.
//
// HOW IT WORKS:
// 1. Read ?id= from the URL using URLSearchParams
// 2. Find the matching property in the properties array
// 3. Inject all content into the empty HTML placeholders
// 4. If no matching id found → show error message
// ============================================================
const detailHero = document.getElementById('detail-hero-content');

if (detailHero) {

  // Step 1 — Read the id from the URL
  // e.g. property.html?id=3 → params.get('id') returns "3"
  const params = new URLSearchParams(window.location.search);
  const propertyId = parseInt(params.get('id')); // convert "3" to number 3

  // Step 2 — Find matching property in our data file
  // .find() returns the first item where the condition is true
  const property = properties.find(p => p.id === propertyId);

  if (!property) {
    // No property found — show friendly error
    detailHero.innerHTML = `
      <div style="text-align:center; padding: 4rem 1rem;">
        <h2 style="color:#fff; font-size:2rem;">Property Not Found</h2>
        <p style="color:#e8eef7; margin-bottom:1.5rem;">
          This property may have been sold or the link is incorrect.
        </p>
        <a href="index.html#properties" class="btn">← View All Listings</a>
      </div>
    `;
  } else {

    // Step 3 — Update browser tab title
    document.title = `${property.title} | MKA Dream Home Property`;

    // Update meta description dynamically
    document.querySelector('meta[name="description"]')
      .setAttribute('content', property.shortDesc);

    // ── HERO SECTION ────────────────────────────────────────
    const statusClass = property.status === 'sold' ? 'sold' : 'available';
    const statusLabel = property.status === 'sold' ? 'Sold' : 'Available';

    detailHero.innerHTML = `
      <h1>${property.title}</h1>
      <p class="location">📍 ${property.location}</p>
      <p class="price">${property.price}</p>
      <div class="hero-actions">
        <a href="tel:+2348054696078" class="btn">📞 Call Now</a>
        <a href="https://wa.me/2348054696078?text=${property.whatsappMsg}"
           class="btn btn-whatsapp" target="_blank" rel="noopener">
          WhatsApp
        </a>
      </div>
      <span class="status-badge ${statusClass}">${statusLabel}</span>
    `;

    // ── GALLERY ──────────────────────────────────────────────
    const gallery = document.getElementById('detail-gallery');
    if (gallery) {
      let galleryHTML = '';

      // Add images
      property.images.forEach(img => {
        galleryHTML += `<img src="${img}" alt="${property.title}" loading="lazy">`;
      });

      // Add video if this property has one
      if (property.video) {
        galleryHTML += `
          <video controls preload="none" muted playsinline>
            <source src="${property.video}" type="video/mp4">
          </video>
        `;
      }

      gallery.innerHTML = galleryHTML;
    }

    // ── FEATURES GRID ────────────────────────────────────────
    const featuresEl = document.getElementById('detail-features');
    if (featuresEl) {
      featuresEl.innerHTML = property.features
        .map(f => `<div class="detail-card">${f}</div>`)
        .join('');
    }

    // ── FULL DESCRIPTION ─────────────────────────────────────
    const descEl = document.getElementById('detail-full-desc');
    if (descEl) descEl.textContent = property.fullDesc;

    // ── BENEFITS LIST ────────────────────────────────────────
    const benefitsEl = document.getElementById('detail-benefits');
    if (benefitsEl) {
      benefitsEl.innerHTML = property.benefits
        .map(b => `<li>${b}</li>`)
        .join('');
    }

    // ── PAYMENT PLAN MODAL ───────────────────────────────────
    const paymentList = document.getElementById('detail-payment-list');
    if (paymentList) {
      paymentList.innerHTML = property.paymentPlans
        .map(plan => `<li><strong>${plan.label}:</strong> ${plan.amount}</li>`)
        .join('');
    }

    // ── WHATSAPP FLOATING BUTTON ─────────────────────────────
    const waFloat = document.getElementById('wa-float');
    if (waFloat) {
      waFloat.href = `https://wa.me/2348054696078?text=${property.whatsappMsg}`;
    }

    // CTA WhatsApp button
    const waBtn = document.getElementById('detail-wa-btn');
    if (waBtn) {
      waBtn.href = `https://wa.me/2348054696078?text=${property.whatsappMsg}`;
    }

    // ── SIMILAR PROPERTIES ───────────────────────────────────
    // Find up to 2 properties of the same type (excluding current)
    const similar = properties
      .filter(p => p.type === property.type && p.id !== property.id)
      .slice(0, 2);

    const similarGrid = document.getElementById('detail-similar');
    if (similarGrid) {
      if (similar.length === 0) {
        similarGrid.innerHTML = `
          <p style="grid-column:1/-1; color:var(--muted); text-align:center;">
            No similar properties listed yet. <a href="index.html#properties">View all listings →</a>
          </p>
        `;
      } else {
        similarGrid.innerHTML = similar.map(p => `
          <div class="property-card">
            <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
            <div class="property-card-content">
              <h3>${p.title}</h3>
              <p class="location">📍 ${p.location}</p>
              <span class="price">${p.price}</span>
              <div class="card-actions">
                <a href="property.html?id=${p.id}" class="btn btn-secondary">View</a>
                <a href="https://wa.me/2348054696078?text=${p.whatsappMsg}"
                   class="btn btn-whatsapp" target="_blank" rel="noopener">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

  } // end if property found
} // end if detail page