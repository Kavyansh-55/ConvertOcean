/* ConvertOcean Shared UI Scripts - theme.js */

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDropdowns();
  initMobileMenu();
  initFAQ();
  // initLangSelector();
  // checkLanguageRedirect();
});

// Theme Switcher Logic
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleIcon = document.getElementById('themeToggleIcon');

  function updateThemeUI(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (!themeToggleIcon) return;

    if (theme === 'dark') {
      themeToggleIcon.innerHTML = `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor"></path>`;
    } else {
      themeToggleIcon.innerHTML = `<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>`;
    }
  }

  // Load initial theme
  const currentTheme = localStorage.getItem('theme') || 'light';
  updateThemeUI(currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      updateThemeUI(nextTheme);
    });
  }
}

// Navigation Tools Dropdown Toggle
function initDropdowns() {
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShow = dropdownMenu.classList.toggle('show');
      dropdownBtn.classList.toggle('open', isShow);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdownMenu.classList.remove('show');
        dropdownBtn.classList.remove('open');
      }
    });
  }
}

// Mobile Hamburger Menu Trigger
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  const header = document.querySelector('.nav-bar');

  if (!mobileMenuBtn || !mobileNavMenu) return;

  // Pin the fixed panel directly beneath the sticky header, at its exact
  // height, so it opens where the user is — not at the top of the page.
  function positionMenu() {
    const h = header ? header.offsetHeight : 60;
    mobileNavMenu.style.top = h + 'px';
    mobileNavMenu.style.maxHeight = (window.innerHeight - h) + 'px';
  }

  function closeMenu() {
    mobileNavMenu.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !mobileNavMenu.classList.contains('active');
    if (willOpen) positionMenu();
    mobileNavMenu.classList.toggle('active', willOpen);
    mobileMenuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  });

  // Tapping a link closes the menu (also covers same-page anchors)
  mobileNavMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });

  // Tapping outside the panel closes it
  document.addEventListener('click', (e) => {
    if (
      mobileNavMenu.classList.contains('active') &&
      !mobileNavMenu.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // Escape closes it
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Keep it aligned if the viewport changes while open
  window.addEventListener('resize', () => {
    if (mobileNavMenu.classList.contains('active')) positionMenu();
  });
}

// Reusable FAQ Accordion Animation
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all open items
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        const btn = el.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
      }
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

// Language Selector Handler
function initLangSelector() {
  const langSelector = document.getElementById('langSelector');
  const mobileLangSelector = document.getElementById('mobileLangSelector');

  function changeLanguage(selectedLang) {
    const currentPath = window.location.pathname;
    const locales = ['hi', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'ru', 'tr', 'pl', 'uk', 'ar', 'fa', 'ur', 'bn', 'pa', 'ta', 'te', 'mr', 'gu', 'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'fil'];
    
    let pathSegments = currentPath.split('/').filter(Boolean);
    if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
      pathSegments.shift();
    }
    
    let newPath = '';
    if (selectedLang !== 'en') {
      newPath = '/' + selectedLang + '/' + pathSegments.join('/');
    } else {
      newPath = '/' + pathSegments.join('/');
    }
    
    if (!newPath.endsWith('/') && !newPath.split('/').pop().includes('.')) {
      newPath += '/';
    }
    if (newPath === '//') newPath = '/';
    
    localStorage.setItem('preferredLang', selectedLang);
    window.location.href = newPath;
  }

  if (langSelector) {
    langSelector.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }

  if (mobileLangSelector) {
    mobileLangSelector.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
}

// Browser Language Detection & Redirection
function checkLanguageRedirect() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') {
    const cachedLang = localStorage.getItem('preferredLang');
    const locales = ['hi', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'ru', 'tr', 'pl', 'uk', 'ar', 'fa', 'ur', 'bn', 'pa', 'ta', 'te', 'mr', 'gu', 'zh', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'fil'];
    
    let targetLang = null;
    if (cachedLang && locales.includes(cachedLang)) {
      targetLang = cachedLang;
    } else {
      const userLangs = navigator.languages || [navigator.language || navigator.userLanguage];
      for (let l of userLangs) {
        const primary = l.split('-')[0].toLowerCase();
        if (locales.includes(primary)) {
          targetLang = primary;
          break;
        }
      }
    }
    
    if (targetLang && targetLang !== 'en') {
      window.location.href = '/' + targetLang + '/';
    }
  }
}

// Global File Download Helper (Safe memory release)
function downloadBlob(blob, filename, mimeType) {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }
}

// Make globally available to inline scripts in pages
window.downloadBlob = downloadBlob;

