/* ConvertOcean Shared UI Scripts - theme.js */

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDropdowns();
  initMobileMenu();
  initFAQ();
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

  if (mobileMenuBtn && mobileNavMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavMenu.classList.toggle('active');
    });
  }
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
      });

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
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
    
    // Immediate cleanup of Object URL from browser memory
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 60000);
  }
}
