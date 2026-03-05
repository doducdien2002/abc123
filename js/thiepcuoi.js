
// ====== CONFIG ======
const CONFIG = {
  groomName: "Nguyễn Anh Tú",
  brideName: "Trần Thị Diệu Nhi",
  coupleShort: "Anh Tú - Diệu Nhi",
  date: "15.02.2025",
  dayOfWeek: "Thứ 5",
  dayNum: "15",
  month: "Tháng 2",
  year: "Năm 2025",
  time: "10 giờ 00",
  lunarDate: "(Tức Ngày 18 Tháng 01 Năm Ất Tỵ)",
  venueName: "The ADORA Center",
  venueAddress: "431 Hoàng Văn Thụ, Phường 4,<br>Tân Bình, Hồ Chí Minh",
  mapLink: "https://maps.app.goo.gl/PP57rDnyXbgNEVbM8",
  groomFamily: { label: "NHÀ TRAI", parents: "ÔNG CẤN VĂN AN<br>BÀ NGUYỄN THỊ HẢI", location: "Quận 8, Hồ Chí Minh" },
  brideFamily: { label: "NHÀ GÁI", parents: "ÔNG CẤN VĂN AN<br>BÀ NGUYỄN THỊ HẢI", location: "Quận 8, Hồ Chí Minh" },
  bankInfo: "MBBANK - NGUYEN TAN DAT<br>8838683860",
  guestName: "Tên Khách Mời",
  musicURL: "https://statics.pancake.vn/web-media/5e/ee/bf/4a/afa10d3bdf98ca17ec3191ebbfd3c829d135d06939ee1f1b712d731d-w:0-h:0-l:2938934-t:audio/mpeg.mp3"
};

(function applyConfig() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestFromUrl = urlParams.get('guest') || urlParams.get('name');
  if (guestFromUrl) CONFIG.guestName = decodeURIComponent(guestFromUrl);
  document.querySelector('.couple-name').textContent = CONFIG.coupleShort;
  document.querySelector('.wedding-date').textContent = CONFIG.date;
  document.querySelector('.groom-name').textContent = CONFIG.groomName;
  document.querySelector('.bride-name').textContent = CONFIG.brideName;
  document.querySelector('.day-name').textContent = CONFIG.dayOfWeek;
  document.querySelector('.day-big').textContent = CONFIG.dayNum;
  document.querySelector('.month-name').textContent = CONFIG.month;
  document.querySelector('.year-right').textContent = CONFIG.year;
  document.querySelector('.time-left').textContent = CONFIG.time;
  document.querySelector('.lunar-date').textContent = CONFIG.lunarDate;
  document.querySelector('.venue-name').innerHTML = '<span style="font-weight:700;">' + CONFIG.venueName + '</span>';
  document.querySelector('.venue-address').innerHTML = CONFIG.venueAddress;
  document.querySelector('.direction-btn').href = CONFIG.mapLink;
  document.querySelector('.groom-side').innerHTML = '&nbsp;' + CONFIG.groomFamily.label;
  document.querySelector('.bride-side').innerHTML = '&nbsp;' + CONFIG.brideFamily.label;
  document.querySelector('.groom-parents').innerHTML = CONFIG.groomFamily.parents;
  document.querySelector('.bride-parents').innerHTML = CONFIG.brideFamily.parents;
  document.querySelector('.groom-location').textContent = CONFIG.groomFamily.location;
  document.querySelector('.bride-location').textContent = CONFIG.brideFamily.location;
  document.querySelector('.gift-bank').innerHTML = CONFIG.bankInfo;
  document.getElementById('guest-name-display').textContent = CONFIG.guestName;
  document.getElementById('background-music').src = CONFIG.musicURL;
})();

// ====== MUSIC ======
(function initMusic() {
  const audio = document.getElementById('background-music');
  const toggle = document.getElementById('music-toggle');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  audio.volume = 0.6;
  let playing = false, started = false;
  function setUI(p) {
    playing = p;
    playIcon.style.display = p ? 'none' : 'block';
    pauseIcon.style.display = p ? 'block' : 'none';
    toggle.classList.toggle('vibrating', p);
  }
  const startOnce = () => {
    if (!started) { started = true; audio.play().then(() => setUI(true)).catch(() => setUI(false)); }
  };
  document.body.addEventListener('click', startOnce, { once: true });
  document.body.addEventListener('touchstart', startOnce, { once: true, passive: true });
  toggle.addEventListener('click', e => {
    e.stopPropagation();
    if (playing) { audio.pause(); setUI(false); }
    else { audio.play().then(() => { started = true; setUI(true); }).catch(() => {}); }
  });
  audio.addEventListener('play', () => setUI(true));
  audio.addEventListener('pause', () => setUI(false));
})();

// ====== POPUPS ======
(function initPopups() {
  const backdrop = document.getElementById('popup-backdrop');
  const giftPopup = document.getElementById('popup-gift');
  const tyPopup = document.getElementById('popup-thankyou');
  function openPopup(el) { el.style.display = 'block'; backdrop.style.display = 'block'; }
  function closeAll() { giftPopup.style.display = 'none'; tyPopup.style.display = 'none'; backdrop.style.display = 'none'; }
  // document.getElementById('btn-gift').addEventListener('click', () => openPopup(giftPopup));
  document.getElementById('gift-close').addEventListener('click', closeAll);
  document.getElementById('ty-close').addEventListener('click', closeAll);
  backdrop.addEventListener('click', closeAll);
})();

// ====== FORM ======
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwnzSm-ircYXuGQmgDYw4kyx4lBP9BUf3SN8B7qEhK07hwvCwuHhjt-HR_vhA7B7o0U/exec";

(function initForm() {
  const btn = document.getElementById('btn-submit');

  btn.addEventListener('click', async function() {
    const name = document.getElementById('input-name').value.trim();
    const rel = document.getElementById('input-rel').value.trim();
    const wish = document.getElementById('input-wish').value.trim();
    const attend = document.getElementById('input-attend').value;

    if (!name) { showAlert('Vui lòng nhập tên của bạn!'); return; }
    if (!attend) { showAlert('Vui lòng chọn bạn có tham dự không!'); return; }

    // ====== set loading UI ======
    const oldHtml = btn.innerHTML;
    btn.classList.add('is-loading');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span><span>ĐANG GỬI...</span>`;

    try {
      const res = await fetch(SHEET_WEBAPP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({ name, rel, wish, attend }).toString()
      });

      const txt = await res.text();
      let out = {};
      try { out = JSON.parse(txt); } catch { out = { ok: false, raw: txt }; }
      if (!out.ok) throw new Error(out.raw || "Server not ok");

      // Popup cảm ơn
      document.getElementById('popup-thankyou').style.display = 'block';
      document.getElementById('popup-backdrop').style.display = 'block';

      // Clear
      document.getElementById('input-name').value = '';
      document.getElementById('input-rel').value = '';
      document.getElementById('input-wish').value = '';
      document.getElementById('input-attend').value = '';
    } catch (e) {
      console.error(e);
      showAlert('Gửi thất bại: ' + ((e && e.message) ? e.message : e));
    } finally {
      // ====== restore button ======
      btn.classList.remove('is-loading');
      btn.disabled = false;
      btn.innerHTML = oldHtml;
    }
  });
})();
function showAlert(msg) {
  const el = document.getElementById('alert-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

// ====== ENHANCED SCROLL REVEAL ======
(function initScrollReveal() {
  const items = document.querySelectorAll('.sr');

  // Nhóm các phần tử theo section cha để stagger theo nhóm
  // Khi một phần tử vào viewport, trigger animation với delay từ data-delay
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Lấy delay từ data-delay (đơn vị: * 0.1s), mặc định 0
        const delayStep = parseInt(el.getAttribute('data-delay') || '0');
        // Áp dụng animation-delay trực tiếp
        el.style.animationDelay = (delayStep * 0.25) + 's';
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -40px 0px'
  });

  items.forEach(el => observer.observe(el));
})();
