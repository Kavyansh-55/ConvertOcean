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
// Also the single point where a finished conversion reaches the user,
// which makes it the honest place to record file_converted. See the
// coTrack block in Layout.astro for what may and may not be sent.
function downloadBlob(blob, filename, mimeType) {
  if (typeof window.coTrack === 'function') {
    window.coTrackFiles('file_converted', [{ name: filename, size: blob && blob.size }]);
  }
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

/**
 * Rebuild readable lines from a pdf.js text layer.
 *
 * pdf.js hands back positioned fragments, not lines - a single visual line
 * is often several items, and a paragraph break is only implied by the gap
 * between them. Flattening the array with join(" ") throws all of that away
 * and turns a page into one run-on sentence, which is what the converters
 * used to do.
 *
 * Group items by their baseline (transform[5]), join each line left to
 * right, insert a space only where there is a real horizontal gap, and read
 * a blank line as a paragraph break when the vertical step is noticeably
 * bigger than the usual line height.
 *
 * @param {Array} items textContent.items from page.getTextContent()
 * @returns {string} text with lines and paragraph breaks preserved
 */
function pdfItemsToText(items) {
  if (!items || !items.length) return '';

  var lines = [];
  var cur = null;

  function pushCur() {
    if (cur && cur.parts.length) lines.push(cur);
    cur = null;
  }

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    if (typeof it.str !== 'string') continue;

    // pdf.js emits explicit end-of-line markers with an empty string.
    if (!it.str) {
      if (it.hasEOL) pushCur();
      continue;
    }

    var y = it.transform ? it.transform[5] : 0;
    var x = it.transform ? it.transform[4] : 0;
    var h = it.height || 10;

    // A new baseline means a new line. Half the glyph height tolerates
    // subscripts and slight rounding without splitting a real line.
    if (!cur || Math.abs(cur.y - y) > Math.max(2, h * 0.5)) {
      pushCur();
      cur = { y: y, h: h, parts: [], end: null };
    }

    // Only insert a space where the fragments are actually apart. PDFs
    // frequently split mid-word, and joining those with a space is what
    // produced "m e s s y" output.
    if (cur.end !== null && x - cur.end > h * 0.2) cur.parts.push(' ');

    cur.parts.push(it.str);
    cur.end = x + (it.width || 0);

    if (it.hasEOL) pushCur();
  }
  pushCur();

  if (!lines.length) return '';

  // Typical line step, used to tell a wrapped line from a new paragraph.
  // Deliberately a low percentile rather than the median: paragraph gaps sit
  // at the top of this distribution, and on a short page they can drag a
  // median up until nothing looks like a gap any more.
  var steps = [];
  for (var j = 1; j < lines.length; j++) {
    var d = Math.abs(lines[j - 1].y - lines[j].y);
    if (d > 0) steps.push(d);
  }
  steps.sort(function (a, b) { return a - b; });
  var median = steps.length ? steps[Math.floor(steps.length * 0.3)] : 0;

  var out = '';
  for (var k = 0; k < lines.length; k++) {
    var text = lines[k].parts.join('').replace(/\s+/g, ' ').trim();
    if (k > 0) {
      var gap = Math.abs(lines[k - 1].y - lines[k].y);
      out += (median && gap > median * 1.6) ? '\n\n' : '\n';
    }
    out += text;
  }
  return out;
}

window.pdfItemsToText = pdfItemsToText;

/**
 * Render an element to PDF as if it were on paper.
 *
 * html2canvas paints a transparent background as white and copies whatever
 * colours the element computes to. In dark mode those come from the theme
 * tokens, so near-white text landed on a white page and the output looked
 * blank. Every converter that exports a themed preview needs the same
 * treatment, so it lives here rather than in each tool.
 *
 * Works on an off-screen clone, so the visible preview keeps the site theme
 * and the user never sees a flash of white.
 *
 * @param {HTMLElement} element the preview to render
 * @param {Object} opt html2pdf options (filename, jsPDF, ...)
 * @returns {Promise}
 */
function exportElementToPdf(element, opt) {
  if (!element || typeof window.html2pdf !== 'function') {
    return Promise.reject(new Error('html2pdf unavailable'));
  }

  var clone = element.cloneNode(true);

  // cloneNode copies id attributes, which would put duplicates in the
  // document for as long as the render takes and make getElementById
  // ambiguous. The clone is write-only, so the ids are not needed.
  clone.removeAttribute('id');
  var ided = clone.querySelectorAll('[id]');
  for (var n = 0; n < ided.length; n++) ided[n].removeAttribute('id');

  // Three conditions, each of which fails SILENTLY into a plausible-looking but
  // useless PDF, so all three matter:
  //   1. the clone must be in normal flow   (absolute/fixed -> zero-height canvas)
  //   2. it must not be moved off-screen    (left:-10000px -> right size, 0% ink)
  //   3. the document must be scrolled to the top when it renders
  // (3) is the one that bites in practice: export buttons sit below the fold, so
  // by the time a user clicks, the page is scrolled and every render is blank.
  // html2canvas's own scrollY/windowHeight options did not compensate — only
  // actually scrolling to 0 did. The scroll position is restored afterwards.
  clone.style.position = 'static';
  clone.style.marginLeft = '0';
  clone.style.width = element.offsetWidth ? element.offsetWidth + 'px' : '794px';
  clone.style.maxHeight = 'none';
  clone.style.overflow = 'visible';

  // Paper colours, forced past the theme tokens on the clone and everything
  // inside it. Backgrounds are cleared rather than set white so borders and
  // header bands stay visible.
  clone.style.setProperty('color', '#171717', 'important');
  clone.style.setProperty('background-color', '#ffffff', 'important');
  var all = clone.querySelectorAll('*');
  for (var i = 0; i < all.length; i++) {
    all[i].style.setProperty('color', '#171717', 'important');
    all[i].style.setProperty('background-color', 'transparent', 'important');
    all[i].style.setProperty('border-color', '#d4d4d4', 'important');
  }

  var savedScroll = window.scrollY || document.documentElement.scrollTop || 0;
  var host = document.createElement('div');
  host.style.height = '0';
  host.style.overflow = 'hidden';
  host.appendChild(clone);
  document.body.insertBefore(host, document.body.firstChild);
  window.scrollTo(0, 0);

  var merged = Object.assign({
    margin: 10,
    image: { type: 'jpeg', quality: 0.95 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }, opt || {});
  merged.html2canvas = Object.assign(
    { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    (opt && opt.html2canvas) || {}
  );

  function cleanup() {
    if (host.parentNode) host.parentNode.removeChild(host);
    window.scrollTo(0, savedScroll);
  }

  return window.html2pdf().set(merged).from(clone).save()
    .then(function (r) { cleanup(); return r; })
    .catch(function (e) { cleanup(); throw e; });
}

window.exportElementToPdf = exportElementToPdf;

