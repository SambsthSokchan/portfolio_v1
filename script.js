// Theme toggle
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', saved);
toggle.addEventListener('click', function () {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

/* === CUSTOM CURSOR & MAGNETIC ELEMENTS === */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', function (e) {
  mx = e.clientX; 
  my = e.clientY;
});

const magneticEls = document.querySelectorAll('[data-magnetic]');
magneticEls.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = `translate(0px, 0px)`;
    el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  });
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'none';
  });
});

document.querySelectorAll('a, .theme-toggle, [data-magnetic]').forEach(function (el) {
  el.addEventListener('mouseenter', function () {
    cursor.style.width = '16px'; cursor.style.height = '16px';
    ring.style.width = '60px'; ring.style.height = '60px';
  });
  el.addEventListener('mouseleave', function () {
    cursor.style.width = '10px'; cursor.style.height = '10px';
    ring.style.width = '40px'; ring.style.height = '40px';
  });
});

/* === ANIMATION LOOP === */
function raf(time) {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';

  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* === VANILLA TILT === */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll(".project-card"), {
    max: 8,
    speed: 400,
    glare: true,
    "max-glare": 0.15,
  });
}

/* === TEXT SPLITTING === */
function splitTextNodes(el) {
  const textNodes = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walk.nextNode())) {
    if (node.textContent.trim() !== '') textNodes.push(node);
  }
  
  let globalCharIndex = 0;
  
  textNodes.forEach(node => {
    const words = node.textContent.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    
    words.forEach(word => {
      if (word.trim() === '') {
        fragment.appendChild(document.createTextNode(word));
      } else {
        const wordWrap = document.createElement('span');
        wordWrap.className = 'split-word';
        
        const chars = word.split('');
        chars.forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.className = 'split-char';
          charSpan.textContent = char;
          charSpan.style.transitionDelay = `${globalCharIndex * 0.025}s`;
          wordWrap.appendChild(charSpan);
          globalCharIndex++;
        });
        fragment.appendChild(wordWrap);
      }
    });
    node.parentNode.replaceChild(fragment, node);
  });
}

const splitTexts = document.querySelectorAll('.split-text');
splitTexts.forEach(el => splitTextNodes(el));

/* === SCROLL REVEAL (Observer) === */
const reveals = document.querySelectorAll('.reveal, .split-text');
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });
reveals.forEach(function (el) { observer.observe(el); });

/* === ACTIVE NAV LINK === */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', function () {
  let current = '';
  sections.forEach(function (s) {
    if (window.scrollY >= s.offsetTop - 150) current = s.getAttribute('id');
  });
  navLinks.forEach(function (a) {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});