/* ═══════════════════════════════════════════
   wedding.js — Wedding invitation page logic
   CineLove Clone
═══════════════════════════════════════════ */

'use strict';

// ── COUNTDOWN TIMER ─────────────────────────
function initCountdown() {
  const el = document.querySelector('.countdown');
  if (!el) return;

  const target = new Date(el.dataset.date);
  const pads = el.querySelectorAll('.countdown__value');

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.querySelectorAll('.countdown__unit').forEach(u => u.style.display = 'none');
      const msg = el.querySelector('.countdown__done');
      if (msg) msg.style.display = 'block';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    [d, h, m, s].forEach((v, i) => {
      if (pads[i]) pads[i].textContent = String(v).padStart(2, '0');
    });
  }
  update();
  setInterval(update, 1000);
}
initCountdown();

// ── MUSIC PLAYER ────────────────────────────
function initMusic() {
  const btn   = document.querySelector('.music-btn');
  const audio = document.querySelector('#bg-music');
  if (!btn || !audio) return;

  let playing = false;
  btn.addEventListener('click', () => {
    if (playing) { audio.pause(); btn.classList.remove('playing'); }
    else         { audio.play().catch(()=>{}); btn.classList.add('playing'); }
    playing = !playing;
  });
  // auto-play on first touch
  document.addEventListener('click', () => {
    if (!playing) { audio.play().catch(()=>{}); playing = true; btn.classList.add('playing'); }
  }, { once: true });
}
initMusic();

// ── GUEST WISH FORM ─────────────────────────
function initWishForm() {
  const form  = document.querySelector('.wish-form');
  const list  = document.querySelector('.wish-list');
  if (!form || !list) return;

  const wishes = JSON.parse(localStorage.getItem('wishes') || '[]');
  renderWishes(wishes);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const nameInput = form.querySelector('[name="name"]');
    const msgInput  = form.querySelector('[name="message"]');
    if (!nameInput?.value.trim() || !msgInput?.value.trim()) return;

    const wish = {
      name: nameInput.value.trim(),
      message: msgInput.value.trim(),
      time: new Date().toLocaleDateString('vi-VN'),
    };
    wishes.unshift(wish);
    localStorage.setItem('wishes', JSON.stringify(wishes.slice(0, 50)));
    renderWishes(wishes);
    form.reset();
    showToast('💌 Gửi lời chúc thành công!');
  });

  function renderWishes(list_data) {
    list.innerHTML = list_data.slice(0, 10).map(w => `
      <div class="wish-item animate-on-scroll">
        <div class="wish-item__avatar">${w.name[0].toUpperCase()}</div>
        <div class="wish-item__body">
          <span class="wish-item__name">${escapeHtml(w.name)}</span>
          <span class="wish-item__time">${w.time}</span>
          <p class="wish-item__msg">${escapeHtml(w.message)}</p>
        </div>
      </div>
    `).join('') || '<p class="wish-empty">Hãy là người đầu tiên gửi lời chúc 💕</p>';
  }
}
initWishForm();

// ── RSVP ────────────────────────────────────
function initRSVP() {
  const form = document.querySelector('.rsvp-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Đã xác nhận tham dự! Cảm ơn bạn 🎉');
    form.reset();
  });
}
initRSVP();

// ── CONFETTI on load ─────────────────────────
function launchConfetti() {
  const colors = ['#c9a96e', '#e2c98f', '#f0d4c8', '#ffffff'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed; top:-10px; left:${Math.random()*100}%;
        width:${4+Math.random()*6}px; height:${8+Math.random()*10}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:2px; pointer-events:none; z-index:9999;
        animation: confettiFall ${2+Math.random()*3}s ${Math.random()}s linear forwards;
        transform: rotate(${Math.random()*360}deg);
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, i * 40);
  }
}

const style = document.createElement('style');
style.textContent = `
@keyframes confettiFall {
  to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}`;
document.head.appendChild(style);

// Trigger confetti 1s after load
setTimeout(launchConfetti, 1000);

// ── UTILS ────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}

// Global toast (fallback if main.js not loaded)
if (!window.showToast) {
  window.showToast = function(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  };
}
