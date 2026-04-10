
// ======================================
// Global Theme Switching + Persistence
// ======================================
const themePills = document.querySelectorAll('.theme-pill');
const rootEl = document.body;
const THEME_KEY = 'mka_dream_home_theme'; // Unique key for theme
const DARK_MODE_KEY = 'mka_dream_home_dark_mode'; // Unique key for dark mode

function applyTheme(themeClass) {
    rootEl.classList.remove('theme-blue', 'theme-gold', 'theme-green');
    rootEl.classList.add(themeClass);
    localStorage.setItem(THEME_KEY, themeClass);
}

// Initialize theme on page load for all pages
(function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && ['theme-blue','theme-gold','theme-green'].includes(savedTheme)) {
        applyTheme(savedTheme);
    } else {
        applyTheme('theme-blue'); // Default theme
    }
})();

// Event listeners for theme pills (only if they exist on the page)
themePills.forEach(pill => {
    pill.addEventListener('click', (e) => {
        const theme = pill.getAttribute('data-theme');
        if (theme) {
            applyTheme(theme);
            // small accessible feedback
            pill.animate([{ transform: 'scale(1)' }, { transform: 'scale(.92)' }, { transform: 'scale(1)' }], { duration: 260 });
        }
    });
});

// ======================================
// Dark Mode Toggle + Persistence
// ======================================
const darkModeToggleBtn = document.getElementById('darkModeToggle');

function setDarkMode(isOn) {
    if (isOn) {
        rootEl.classList.add('dark-mode');
        if (darkModeToggleBtn) darkModeToggleBtn.textContent = 'Light Mode';
    } else {
        rootEl.classList.remove('dark-mode');
        if (darkModeToggleBtn) darkModeToggleBtn.textContent = 'Dark Mode';
    }
    localStorage.setItem(DARK_MODE_KEY, isOn ? '1' : '0');
}

// Initialize dark mode on page load for all pages
(function initDarkMode() {
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    // If no saved state, default to light mode
    // Otherwise, apply saved state
    setDarkMode(savedDarkMode === '1');
})();

// Event listener for dark mode toggle button (only if it exists on the page)
if (darkModeToggleBtn) {
    darkModeToggleBtn.addEventListener('click', () => {
        setDarkMode(!rootEl.classList.contains('dark-mode'));
    });
}


// ======================================
// Mobile Menu Toggle + Close on Link Click
// ======================================
const mobileMenu = document.getElementById('mobile-menu');
const mainNav = document.getElementById('main-nav');

function toggleMobileMenu() {
    if (mobileMenu && mainNav) {
        mainNav.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        const isExpanded = mainNav.classList.contains('active');
        mobileMenu.setAttribute('aria-expanded', isExpanded);
        document.body.style.overflow = isExpanded ? 'hidden' : ''; // Prevent scroll when menu is open
    }
}

if (mobileMenu) {
    mobileMenu.addEventListener('click', toggleMobileMenu);
    mobileMenu.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleMobileMenu();
        }
    });
}

// Close menu when a nav link is clicked (for single page smooth scroll)
// This applies to any nav with `id="main-nav"`
document.querySelectorAll('#main-nav ul li a').forEach(item => {
    item.addEventListener('click', () => {
        if (mainNav && mainNav.classList.contains('active')) {
            toggleMobileMenu(); // Use toggle function to also update aria and overflow
        }
    });
});


// ======================================
// Footer Year Update
// ======================================
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ======================================
// Contact Form Handler (on index.html)
// ======================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        // Simulate network request
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = 'Send Message';
            alert('Message sent successfully! We will contact you shortly.'); // Friendly feedback
            e.target.reset(); // Clear form
        }, 1500); // Simulate 1.5 seconds delay
    });
}

// ======================================
// Learn More Page Specific Logic
// (Lightbox for Gallery, Payment Modal)
// ======================================

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeLightbox = document.querySelector('.close-lightbox');
const galleryItems = document.querySelectorAll('.gallery-grid img, .gallery-grid video');

if (lightbox && closeLightbox && galleryItems.length > 0) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.tagName === 'IMG') {
                lightboxImg.src = item.src;
                lightboxImg.style.display = 'block';
                lightboxVideo.style.display = 'none';
            } else if (item.tagName === 'VIDEO') {
                // For videos, make sure the src is set to the source within the video tag
                const videoSource = item.querySelector('source');
                if (videoSource) {
                    lightboxVideo.src = videoSource.src;
                    lightboxVideo.style.display = 'block';
                    lightboxImg.style.display = 'none';
                    lightboxVideo.play(); // Autoplay video in lightbox
                } else {
                    console.error("Video element is missing a <source> tag.");
                    return; // Exit if no source is found
                }
            }
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scroll when lightbox is open
        });
    });

    closeLightbox.addEventListener('click', () => {
        if (lightboxVideo.style.display === 'block') {
            lightboxVideo.pause(); // Pause video when closing
            lightboxVideo.currentTime = 0; // Reset video to start
        }
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Close lightbox when clicking outside the content (on the overlay)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
             if (lightboxVideo.style.display === 'block') {
                lightboxVideo.pause();
                lightboxVideo.currentTime = 0;
            }
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Payment Plan Modal functionality
const openModalBtn = document.getElementById('openModal');
const paymentModal = document.getElementById('paymentModal');
const closeModalSpan = document.querySelector('.close-modal');

if (openModalBtn && paymentModal && closeModalSpan) {
    openModalBtn.addEventListener('click', () => {
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    closeModalSpan.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside the content
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}