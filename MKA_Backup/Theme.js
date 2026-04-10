// Theme handling (GLOBAL)
const themes = ['theme-blue', 'theme-gold', 'theme-green'];

function setTheme(theme) {
  document.body.classList.remove(...themes);
  document.body.classList.add(theme);
  localStorage.setItem('mka-theme', theme);
}

// Load saved theme on page load
(function loadTheme() {
  const savedTheme = localStorage.getItem('mka-theme');
  if (savedTheme && themes.includes(savedTheme)) {
    document.body.classList.add(savedTheme);
  } else {
    document.body.classList.add('theme-blue');
  }
})();

