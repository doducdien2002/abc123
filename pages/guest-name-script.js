/* ============================================================
   CINELOVE - Hiển thị tên khách mời từ URL
   Cách dùng: thiepcuoi.html?ten=Nguyen+Van+A
   Chèn đoạn này vào trước </body> của mỗi file thiệp
   ============================================================ */
(function () {
  // Đọc tên từ URL ?ten=...
  var params = new URLSearchParams(window.location.search);
  var tenKhach = params.get('ten');
  if (!tenKhach) return; // Không có tên thì thôi

  // Decode và format đẹp (viết hoa chữ đầu mỗi từ)
  tenKhach = decodeURIComponent(tenKhach)
    .replace(/\+/g, ' ')
    .trim()
    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });

  // ── 1. Thay "Quý Khách" trong đoạn text kính mời ──
  function replaceInNode(node) {
    if (node.nodeType === 3) { // text node
      if (node.textContent.includes('Quý Khách') || node.textContent.includes('Quý khách') || node.textContent.includes('quý khách')) {
        node.textContent = node.textContent
          .replace(/Quý Khách/g, tenKhach)
          .replace(/Quý khách/g, tenKhach)
          .replace(/quý khách/g, tenKhach);
      }
    } else if (node.nodeType === 1 && node.childNodes) {
      node.childNodes.forEach(replaceInNode);
    }
  }

  // ── 2. Hiển thị banner tên khách mời ở đầu trang ──
  function showGuestBanner() {
    var banner = document.createElement('div');
    banner.id = 'cl-guest-banner';
    banner.innerHTML =
      '<div style="' +
        'position:fixed;top:0;left:0;right:0;z-index:99999;' +
        'background:linear-gradient(135deg,rgba(180,120,60,0.96),rgba(140,80,30,0.96));' +
        'color:#fff8e8;text-align:center;padding:10px 16px 8px;' +
        'font-family:Georgia,serif;font-size:13px;line-height:1.5;' +
        'box-shadow:0 2px 12px rgba(0,0,0,0.3);' +
        'animation:clSlideDown .5s ease;' +
      '">' +
        '<div style="font-size:11px;opacity:.8;letter-spacing:.05em;margin-bottom:2px;">💌 THIỆP MỜI GỬI ĐẾN</div>' +
        '<div style="font-size:16px;font-weight:bold;letter-spacing:.02em;">' + tenKhach + '</div>' +
      '</div>';

    // Animation CSS
    var style = document.createElement('style');
    style.textContent =
      '@keyframes clSlideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}' +
      '#cl-guest-banner{cursor:pointer;}' +
      '#cl-guest-banner:hover>div{opacity:.85;}';
    document.head.appendChild(style);

    // Click để đóng banner
    banner.addEventListener('click', function() {
      banner.style.transition = 'opacity .3s';
      banner.style.opacity = '0';
      setTimeout(function() { banner.remove(); }, 300);
    });

    document.body.insertBefore(banner, document.body.firstChild);

    // Tự đóng sau 6 giây
    setTimeout(function() {
      if (document.getElementById('cl-guest-banner')) {
        banner.style.transition = 'opacity .5s';
        banner.style.opacity = '0';
        setTimeout(function() { banner.remove(); }, 500);
      }
    }, 6000);
  }

  // Chạy sau khi DOM ready
  function run() {
    replaceInNode(document.body);
    showGuestBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
