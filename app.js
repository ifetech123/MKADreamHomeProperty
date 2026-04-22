// ============================================================
// app.js — MKA Dream Home Property
// Single JS file covering index.html + property.html
// ============================================================


// ============================================================
// 1. THEME SYSTEM
// One key: 'mka_theme' — works across all pages
// ============================================================
const THEME_KEY    = 'mka_theme';
const DARK_KEY     = 'mka_dark';
const VALID_THEMES = ['theme-blue', 'theme-gold', 'theme-green'];

function applyTheme(theme) {
  if (!VALID_THEMES.includes(theme)) return;
  document.body.classList.remove(...VALID_THEMES);
  document.body.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}

(function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  applyTheme(VALID_THEMES.includes(saved) ? saved : 'theme-blue');
})();

document.querySelectorAll('.theme-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    const t = pill.dataset.theme;
    if (t) {
      applyTheme(t);
      pill.animate([{transform:'scale(1)'},{transform:'scale(.85)'},{transform:'scale(1)'}],{duration:200});
    }
  });
});


// ============================================================
// 2. DARK MODE
// Both buttons (header + mobile nav) always in sync
// ============================================================
const darkBtnHeader = document.getElementById('darkModeToggle');
const darkBtnNav    = document.getElementById('navDarkToggle');

function setDarkMode(on) {
  document.body.classList.toggle('dark-mode', on);
  const label = on ? 'Light Mode' : 'Dark Mode';
  if (darkBtnHeader) darkBtnHeader.textContent = label;
  if (darkBtnNav)    darkBtnNav.textContent    = label;
  localStorage.setItem(DARK_KEY, on ? '1' : '0');
}

function toggleDark() {
  setDarkMode(!document.body.classList.contains('dark-mode'));
}

(function initDark() {
  setDarkMode(localStorage.getItem(DARK_KEY) === '1');
})();

if (darkBtnHeader) darkBtnHeader.addEventListener('click', toggleDark);
if (darkBtnNav)    darkBtnNav.addEventListener('click', toggleDark);


// ============================================================
// 3. MOBILE NAV
// ============================================================
const mobileMenuBtn = document.getElementById('mobile-menu');
const mainNav       = document.getElementById('main-nav');

function toggleNav(forceClose = false) {
  if (!mobileMenuBtn || !mainNav) return;
  const open = forceClose ? false : !mainNav.classList.contains('active');
  mainNav.classList.toggle('active', open);
  mobileMenuBtn.classList.toggle('active', open);
  mobileMenuBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => toggleNav());
  mobileMenuBtn.addEventListener('keyup', e => {
    if (e.key === 'Enter' || e.key === ' ') toggleNav();
  });
}

// Close when nav link clicked
document.querySelectorAll('#main-nav a').forEach(a => {
  a.addEventListener('click', () => toggleNav(true));
});

// Close when clicking outside
document.addEventListener('click', e => {
  if (
    mainNav?.classList.contains('active') &&
    !mainNav.contains(e.target) &&
    !mobileMenuBtn?.contains(e.target)
  ) toggleNav(true);
});


// ============================================================
// 4. FOOTER YEAR
// ============================================================
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


// ============================================================
// 5. CONTACT FORM (index.html only)
// Real emails via FormSubmit. First submission triggers a
// one-time confirmation email to the address below.
// ============================================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      showFormMsg('Please fill in all fields.', 'error');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res  = await fetch('https://formsubmit.co/ajax/ifeoluwakelvin123@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();

      if (data.success === 'true' || data.success === true) {
        showFormMsg("Message sent successfully! We'll be in touch shortly. 🎉", 'success');
        contactForm.reset();
      } else {
        throw new Error('failed');
      }
    } catch {
      showFormMsg('Something went wrong. Please call or WhatsApp us directly.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }
  });
}

function showFormMsg(msg, type) {
  document.getElementById('form-feedback')?.remove();
  const el = document.createElement('div');
  el.id = 'form-feedback';
  el.textContent = msg;
  el.style.cssText = `
    padding:.8rem 1rem; margin-top:.8rem; border-radius:8px;
    font-weight:600; font-size:.95rem;
    background:${type==='success'?'#d1fae5':'#fee2e2'};
    color:${type==='success'?'#065f46':'#991b1b'};
    border:1px solid ${type==='success'?'#6ee7b7':'#fca5a5'};
  `;
  contactForm.appendChild(el);
  setTimeout(() => el.remove(), 6000);
}


// ============================================================
// 6. SCROLL TO TOP
// ============================================================
const scrollBtn = document.getElementById('scrollTopBtn');

if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// ============================================================
// 7. SCROLL FADE-IN (IntersectionObserver)
// ============================================================
const fadeEls = document.querySelectorAll('.fadeInUp');

if ('IntersectionObserver' in window && fadeEls.length > 0) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => obs.observe(el));
}


// ============================================================
// 8. PAGE LOADER
// Waits for ALL assets (images, fonts, video) before hiding.
// 'load' fires after everything is ready — not just HTML.
// ============================================================
const loader = document.getElementById('page-loader');

if (loader) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 700);
  });
}


// ============================================================
// 9. PROPERTY FILTER (index.html only)
// data-filter on buttons matches data-type on cards.
// ============================================================
const filterBtns  = document.querySelectorAll('.filter-btn');
const propCards   = document.querySelectorAll('.property-card');
const countEl     = document.getElementById('filterCount');

if (filterBtns.length > 0) {
  updateCount(propCards.length, propCards.length);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter  = btn.dataset.filter;
      let   visible = 0;

      propCards.forEach(card => {
        const match = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('filtered-out', !match);
        if (match) visible++;
      });

      updateCount(visible, propCards.length);
      showNoResults(visible);
    });
  });
}

function updateCount(visible, total) {
  if (!countEl) return;
  countEl.textContent = visible === total
    ? `Showing all ${total} properties`
    : `Showing ${visible} of ${total} properties`;
}

function showNoResults(visible) {
  const grid = document.getElementById('propertyGrid');
  if (!grid) return;
  grid.querySelector('.no-results')?.remove();
  if (visible === 0) {
    const msg = document.createElement('div');
    msg.className = 'no-results';
    msg.innerHTML = `<span>🔍</span>No properties match this filter yet.<br><strong>Contact us</strong> — we may have unlisted options.`;
    grid.appendChild(msg);
  }
}


// ============================================================
// 10. PROPERTY DETAIL PAGE (property.html only)
// Detects the page by looking for #pd-hero-inner element.
// Reads ?id= from URL → finds property in properties array →
// renders everything dynamically.
// ============================================================
const pdHeroInner = document.getElementById('pd-hero-inner');

if (pdHeroInner && typeof properties !== 'undefined') {
  const params  = new URLSearchParams(window.location.search);
  const id      = parseInt(params.get('id'));
  const prop    = properties.find(p => p.id === id);

  if (!prop) {
    // No matching property — show clear error
    pdHeroInner.innerHTML = `
      <h1 style="color:#fff; margin-bottom:1rem;">Property Not Found</h1>
      <p style="color:rgba(255,255,255,.7); margin-bottom:1.5rem;">
        This listing may have been removed or the link is incorrect.
      </p>
      <a href="index.html#properties" class="btn">← View All Listings</a>
    `;
  } else {
    renderPropertyPage(prop);
  }
}

function renderPropertyPage(p) {

  // ── Update page title + meta ─────────────────────────────
  document.title = `${p.title} | MKA Dream Home Property`;
  document.querySelector('meta[name="description"]')
    ?.setAttribute('content', p.shortDesc);

  // ── Hero background = first image ────────────────────────
  // To change: update images[0] in properties.js for this property
  const heroSection = document.getElementById('pd-hero');
  if (heroSection && p.images[0]) {
    heroSection.style.backgroundImage = `url('${p.images[0]}')`;
  }

  // ── Hero content ─────────────────────────────────────────
  const badgeColors = {
    residential:  '#1a73e8',
    commercial:   '#f59e0b',
    agricultural: '#10b981'
  };
  pdHeroInner.innerHTML = `
    <span class="pd-hero-badge" style="background:${badgeColors[p.type] || '#1a73e8'}">
      ${p.badge}
    </span>
    <h1>${p.title}</h1>
    <p class="pd-hero-location">📍 ${p.location}</p>
    <span class="pd-hero-price">${p.price}</span>
    <span class="pd-hero-status ${p.status}">
      ${p.status === 'available' ? 'Available' : 'Sold'}
    </span>
  `;

  // ── Breadcrumb ───────────────────────────────────────────
  const breadTitle = document.getElementById('pd-breadcrumb-title');
  if (breadTitle) breadTitle.textContent = p.title;

  // ── Sticky card ──────────────────────────────────────────
  const pdPrice    = document.getElementById('pd-price');
  const pdStatus   = document.getElementById('pd-status');
  const pdLocation = document.getElementById('pd-card-location');

  if (pdPrice)    pdPrice.textContent    = p.price;
  if (pdStatus) {
    pdStatus.textContent = p.status === 'available' ? 'Available' : 'Sold';
    pdStatus.className   = `pd-status ${p.status}`;
  }
  if (pdLocation) pdLocation.textContent = `📍 ${p.location}`;

  // ── Quick facts (first 3 features) ───────────────────────
  const quickFacts = document.getElementById('pd-quick-facts');
  if (quickFacts) {
    quickFacts.innerHTML = p.features.slice(0, 3)
      .map(f => `<div class="pd-quick-fact">${f}</div>`)
      .join('');
  }

  // ── WhatsApp links ───────────────────────────────────────
  const waUrl  = `https://wa.me/2348054696078?text=${p.whatsappMsg}`;
  const waCard = document.getElementById('pd-wa-card');
  const waCta  = document.getElementById('pd-wa-cta');
  const waFloat = document.getElementById('wa-float');
  const waMod  = document.getElementById('pd-modal-wa');

  if (waCard)  waCard.href  = waUrl;
  if (waCta)   waCta.href   = waUrl;
  if (waFloat) waFloat.href = waUrl;
  if (waMod)   waMod.href   = waUrl;

  // ── Gallery ──────────────────────────────────────────────
  // Images from p.images[] array in properties.js.
  // To swap an image: change the filename in that array.
  const gallery = document.getElementById('pd-gallery');
  if (gallery) {
    let html = '';

    p.images.forEach((img, i) => {
      html += `
        <div class="pd-gallery-item" data-index="${i}" data-type="image" data-src="${img}">
          <img src="${img}" alt="${p.title} — image ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">
        </div>
      `;
    });

    if (p.video) {
      html += `
        <div class="pd-gallery-item" data-index="${p.images.length}" data-type="video" data-src="${p.video}">
          <video muted preload="none" playsinline>
            <source src="${p.video}" type="video/mp4">
          </video>
          <div class="pd-video-overlay">
            <div class="pd-play-icon">▶</div>
          </div>
        </div>
      `;
    }

    gallery.innerHTML = html;

    // Attach click → lightbox
    gallery.querySelectorAll('.pd-gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        openLightbox(parseInt(item.dataset.index));
      });
    });
  }

  // ── Description ──────────────────────────────────────────
  const desc = document.getElementById('pd-description');
  if (desc) desc.textContent = p.fullDesc;

  // ── Features ─────────────────────────────────────────────
  const features = document.getElementById('pd-features');
  if (features) {
    features.innerHTML = p.features
      .map(f => `<div class="pd-feature-card">${f}</div>`)
      .join('');
  }

  // ── Benefits ─────────────────────────────────────────────
  const benefits = document.getElementById('pd-benefits');
  if (benefits) {
    benefits.innerHTML = p.benefits
      .map(b => `<li>${b}</li>`)
      .join('');
  }

  // ── Payment modal ────────────────────────────────────────
  const payList    = document.getElementById('pd-payment-list');
  const paySubtitle = document.getElementById('pd-modal-subtitle');

  if (paySubtitle) paySubtitle.textContent = `Payment options for ${p.title}`;

  if (payList) {
    payList.innerHTML = p.paymentPlans.map(plan => `
      <li>
        <span>${plan.label}</span>
        <span>${plan.amount}</span>
      </li>
    `).join('');
  }

  // ── Similar properties ───────────────────────────────────
  const similarGrid = document.getElementById('pd-similar');
  if (similarGrid && typeof properties !== 'undefined') {
    const similar = properties
      .filter(item => item.type === p.type && item.id !== p.id)
      .slice(0, 3);

    if (similar.length === 0) {
      similarGrid.innerHTML = `
        <p style="color:var(--muted); grid-column:1/-1;">
          No similar listings right now.
          <a href="index.html#properties">View all properties →</a>
        </p>
      `;
    } else {
      similarGrid.innerHTML = similar.map(s => `
        <div class="property-card">
          <span class="property-badge badge-${s.type}">${s.badge}</span>
          <img src="${s.images[0]}" alt="${s.title}" loading="lazy">
          <div class="property-card-content">
            <h3>${s.title}</h3>
            <p class="location">📍 ${s.location}</p>
            <span class="price">${s.price}</span>
            <div class="card-actions">
              <a href="property.html?id=${s.id}" class="btn btn-secondary">View</a>
              <a href="https://wa.me/2348054696078?text=${s.whatsappMsg}"
                 class="btn btn-whatsapp" target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // ── Share buttons ────────────────────────────────────────
  const shareWa   = document.getElementById('pd-share-wa');
  const shareCopy = document.getElementById('pd-share-copy');

  if (shareWa) {
    const shareMsg = `Check out this property — ${p.title} at ${p.price}. ${window.location.href}`;
    shareWa.addEventListener('click', () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, '_blank');
    });
  }

  if (shareCopy) {
    shareCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        shareCopy.textContent = 'Copied! ✓';
        shareCopy.style.borderColor = 'var(--secondary-color)';
        shareCopy.style.color       = 'var(--secondary-color)';
        setTimeout(() => {
          shareCopy.textContent    = 'Copy Link';
          shareCopy.style.borderColor = '';
          shareCopy.style.color       = '';
        }, 2500);
      });
    });
  }
}


// ============================================================
// 11. LIGHTBOX — with arrow navigation + counter
// Covers both index.html gallery and property.html gallery
// ============================================================
const lightbox    = document.getElementById('lightbox');
const lbImg       = document.getElementById('lightbox-img');
const lbVideo     = document.getElementById('lightbox-video');
const lbClose     = document.querySelector('.close-lightbox');
const lbPrev      = document.getElementById('lb-prev');
const lbNext      = document.getElementById('lb-next');
const lbCounter   = document.getElementById('lb-counter');

// Lightbox state
let lbItems  = []; // array of { type: 'image'|'video', src: '...' }
let lbCurrent = 0;

function buildLbItems() {
  // For property detail page — built from gallery items
  const galleryItems = document.querySelectorAll('.pd-gallery-item');
  if (galleryItems.length > 0) {
    lbItems = Array.from(galleryItems).map(item => ({
      type: item.dataset.type,
      src:  item.dataset.src
    }));
    return;
  }

  // For index.html — build from gallery-grid (learn-more style)
  const oldItems = document.querySelectorAll('.gallery-grid img, .gallery-grid video');
  lbItems = Array.from(oldItems).map(el => ({
    type: el.tagName === 'VIDEO' ? 'video' : 'image',
    src:  el.tagName === 'VIDEO'
      ? el.querySelector('source')?.src || ''
      : el.src
  }));
}

function openLightbox(index) {
  if (lbItems.length === 0) buildLbItems();
  lbCurrent = index;
  showLbItem(lbCurrent);
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function showLbItem(index) {
  const item = lbItems[index];
  if (!item) return;

  if (item.type === 'image') {
    lbImg.src = item.src;
    lbImg.style.display = 'block';
    if (lbVideo) { lbVideo.pause(); lbVideo.style.display = 'none'; }
  } else {
    if (lbVideo) {
      lbVideo.src = item.src;
      lbVideo.style.display = 'block';
      lbVideo.play();
    }
    lbImg.style.display = 'none';
  }

  if (lbCounter) lbCounter.textContent = `${index + 1} / ${lbItems.length}`;
}

function closeLightbox() {
  if (lbVideo) { lbVideo.pause(); lbVideo.currentTime = 0; lbVideo.src = ''; }
  lbImg.src = '';
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

function lbGoNext() {
  lbCurrent = (lbCurrent + 1) % lbItems.length;
  showLbItem(lbCurrent);
}

function lbGoPrev() {
  lbCurrent = (lbCurrent - 1 + lbItems.length) % lbItems.length;
  showLbItem(lbCurrent);
}

if (lightbox) {
  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', lbGoPrev);
  lbNext?.addEventListener('click', lbGoNext);

  // Click outside image to close
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard: ESC to close, arrows to navigate
  document.addEventListener('keydown', e => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbGoNext();
    if (e.key === 'ArrowLeft')  lbGoPrev();
  });
}


// ============================================================
// 12. PAYMENT MODAL
// ============================================================
const openModalBtn  = document.getElementById('openModal');
const paymentModal  = document.getElementById('paymentModal');
const closeModalBtn = document.querySelector('.close-modal');

if (openModalBtn && paymentModal) {
  const openModal  = () => { paymentModal.style.display = 'flex'; document.body.style.overflow = 'hidden'; };
  const closeModal = () => { paymentModal.style.display = 'none'; document.body.style.overflow = ''; };

  openModalBtn.addEventListener('click', openModal);
  closeModalBtn?.addEventListener('click', closeModal);
  paymentModal.addEventListener('click', e => { if (e.target === paymentModal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && paymentModal.style.display === 'flex') closeModal();
  });
}