/* ═══════════════════════════════════════════
   main.js — Core interactions & animations
   CineLove Clone
═══════════════════════════════════════════ */

'use strict';

// ── NAVBAR: scroll shadow + mobile drawer ───
const navbar   = document.querySelector('.navbar');
const hamburger = document.querySelector('.navbar__hamburger');
const mobileNav = document.querySelector('.mobile-nav');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  // close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── SCROLL ANIMATION (IntersectionObserver) ─
const animatedEls = document.querySelectorAll('.animate-on-scroll');
if (animatedEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  animatedEls.forEach(el => io.observe(el));
}

// ── HERO PARTICLES ──────────────────────────
function initParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'hero__particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --dur: ${6 + Math.random() * 10}s;
      --delay: ${Math.random() * 12}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      opacity: 0;
    `;
    container.appendChild(p);
  }
}
initParticles();

// ── FAQ ACCORDION ───────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    // open if was closed
    if (!isOpen) item.classList.add('open');
  });
});

// ── FILTER TABS (templates page) ────────────
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // Could filter cards here
    const filter = tab.dataset.filter;
    filterTemplates(filter);
  });
});

function filterTemplates(filter) {
  document.querySelectorAll('.template-card').forEach(card => {
    const theme = card.dataset.theme || 'all';
    const show = filter === 'all' || theme === filter;
    card.style.display = show ? '' : 'none';
    if (show) {
      card.style.animation = 'fadeUp .4s ease both';
      setTimeout(() => card.style.animation = '', 500);
    }
  });
}

// ── PRICING TOGGLE ──────────────────────────
const pricingToggle = document.querySelector('.toggle-switch');
if (pricingToggle) {
  let yearly = false;
  pricingToggle.addEventListener('click', () => {
    yearly = !yearly;
    pricingToggle.classList.toggle('on', yearly);
    document.querySelectorAll('.pricing-toggle__label').forEach((l, i) => {
      l.classList.toggle('active', yearly ? i === 1 : i === 0);
    });
    // update prices
    document.querySelectorAll('[data-monthly][data-yearly]').forEach(el => {
      el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly;
    });
  });
}

// ── TOAST ───────────────────────────────────
window.showToast = function(msg, duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
};

// ── SMOOTH HOVER on template cards ──────────
document.querySelectorAll('.template-card').forEach(card => {
  card.addEventListener('click', () => {
    showToast('✨ Đang tải mẫu thiệp...');
  });
});

// ── COPY SHARE LINK ─────────────────────────
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.copy)
      .then(() => showToast('✅ Đã sao chép đường dẫn!'))
      .catch(() => showToast('❌ Không thể sao chép'));
  });
});

// ── PARALLAX on hero title ──────────────────
const heroTitle = document.querySelector('.hero__title');
if (heroTitle) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroTitle.style.transform = `translateY(${y * 0.25}px)`;
    heroTitle.style.opacity   = 1 - y * 0.002;
  }, { passive: true });
}

// ── THEME TOGGLE ─────────────────────────────
(function initTheme() {
  const STORAGE_KEY = 'cinelove-theme';
  const html = document.documentElement;

  // Restore saved preference immediately (before paint)
  const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
  html.setAttribute('data-theme', saved);

  function setTheme(theme) {
    // Add class to enable smooth transitions
    html.classList.add('theme-transitioning');
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update all toggle buttons on the page
    document.querySelectorAll('.theme-toggle__knob').forEach(knob => {
      knob.textContent = theme === 'light' ? '☀️' : '🌙';
    });
    document.querySelectorAll('.theme-toggle-wrap').forEach(wrap => {
      wrap.dataset.tip = theme === 'light' ? 'Chuyển sang tối' : 'Chuyển sang sáng';
    });

    setTimeout(() => html.classList.remove('theme-transitioning'), 450);
  }

  // Init all toggle buttons
  function bindToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      // Set initial state
      const current = html.getAttribute('data-theme') || 'dark';
      const knob = btn.querySelector('.theme-toggle__knob');
      if (knob) knob.textContent = current === 'light' ? '☀️' : '🌙';

      btn.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(next);
      });
    });

    // Set tooltip
    document.querySelectorAll('.theme-toggle-wrap').forEach(wrap => {
      const current = html.getAttribute('data-theme') || 'dark';
      wrap.dataset.tip = current === 'light' ? 'Chuyển sang tối' : 'Chuyển sang sáng';
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggles);
  } else {
    bindToggles();
  }
})();
