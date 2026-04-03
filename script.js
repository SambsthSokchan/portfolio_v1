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

// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', function (e) {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animateRing() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();
document.querySelectorAll('a, .theme-toggle').forEach(function (el) {
  el.addEventListener('mouseenter', function () {
    cursor.style.width = '16px'; cursor.style.height = '16px';
    ring.style.width = '60px'; ring.style.height = '60px';
  });
  el.addEventListener('mouseleave', function () {
    cursor.style.width = '10px'; cursor.style.height = '10px';
    ring.style.width = '40px'; ring.style.height = '40px';
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
reveals.forEach(function (el) { observer.observe(el); });

// Active nav link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', function () {
  let current = '';
  sections.forEach(function (s) {
    if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id');
  });
  navLinks.forEach(function (a) {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});