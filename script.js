/* ============================================================
   KADHAMBAM – PREMIUM RESTAURANT JAVASCRIPT
   ============================================================ */

/* ---- LOADING SCREEN ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

/* ---- SCROLL PROGRESS BAR ---- */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
}, { passive: true });

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- MOBILE HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- HERO PARALLAX ---- */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (window.scrollY < hero.offsetHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.2}px)`;
    }
  }, { passive: true });
}

/* ---- FLOATING PARTICLES ---- */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(p);
  }
}
createParticles();

/* ---- MENU TAB FILTER ---- */
const tabBtns = document.querySelectorAll('.tab-btn');
const menuGrid = document.getElementById('menuGrid');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.category;
    const cards = menuGrid.querySelectorAll('.menu-card');
    const labels = menuGrid.querySelectorAll('.menu-category-label');

    cards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.transition = 'opacity 0.25s, transform 0.25s';
      if (!match) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 260);
      } else {
        card.style.display = '';
        setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 30);
      }
    });

    labels.forEach(label => {
      label.style.display = (category === 'all' || label.dataset.category === category) ? '' : 'none';
    });
  });
});

/* ---- INTERSECTION OBSERVER – REVEAL ---- */
const revealItems = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-card, .reveal-gallery');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement.querySelectorAll('.reveal-card, .reveal-gallery');
      const idx = Array.from(siblings).indexOf(entry.target);
      const delay = idx >= 0 ? idx * 80 : 0;
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealItems.forEach(el => revealObserver.observe(el));

/* ---- COUNTER ANIMATION ---- */
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  if (countersStarted || !counters.length) return;
  const rect = counters[0].getBoundingClientRect();
  if (rect.top > window.innerHeight) return;
  countersStarted = true;

  counters.forEach(counter => {
    const target = +counter.dataset.count;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(update);
  });
}

window.addEventListener('scroll', startCounters, { passive: true });
setTimeout(startCounters, 1500);

/* ---- REVIEWS CAROUSEL ---- */
const track = document.getElementById('reviewsTrack');
const cards = track ? track.querySelectorAll('.review-card') : [];
const dotsContainer = document.getElementById('carouselDots');
let currentSlide = 0;

function initCarousel() {
  if (!track || cards.length === 0) return;
  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  document.getElementById('carouselPrev').addEventListener('click', () => {
    goToSlide(currentSlide === 0 ? cards.length - 1 : currentSlide - 1);
  });
  document.getElementById('carouselNext').addEventListener('click', () => {
    goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
  });

  // Auto-advance
  setInterval(() => {
    goToSlide(currentSlide === cards.length - 1 ? 0 : currentSlide + 1);
  }, 6000);
}

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

initCarousel();

/* ---- GALLERY LIGHTBOX ---- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span')?.textContent || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---- OPEN STATUS ---- */
function updateOpenStatus() {
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.getElementById('statusText');
  if (!statusDot || !statusText) return;
  const now = new Date();
  const time = now.getHours() + now.getMinutes() / 60;
  const isOpen = time >= 12 && time < 23;

  if (isOpen) {
    statusDot.style.background = '#22c55e';
    statusText.textContent = 'Open Now · Closes at 11:00 PM';
    statusText.style.color = '#22c55e';
  } else {
    statusDot.style.background = '#ef4444';
    statusText.textContent = 'Closed · Opens at 12:00 PM';
    statusText.style.color = '#ef4444';
    statusDot.style.animation = 'none';
  }
}
updateOpenStatus();

/* ---- SET MIN DATE ---- */
const guestDate = document.getElementById('guestDate');
if (guestDate) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  guestDate.min = `${yyyy}-${mm}-${dd}`;
  guestDate.value = `${yyyy}-${mm}-${dd}`;
}

/* ---- RESERVATION FORM ---- */
const tableForm = document.getElementById('tableForm');
if (tableForm) {
  tableForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitReservation');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    setTimeout(() => {
      tableForm.style.display = 'none';
      const success = document.getElementById('formSuccess');
      success.style.display = 'block';
      success.style.animation = 'heroFadeIn 0.6s ease forwards';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  });
}

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionObserver.observe(s));
