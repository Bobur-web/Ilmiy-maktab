// ===== SHARED APPLICATION LOGIC =====

// ===== NAVIGATION =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile menu
  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks?.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  updateAuthUI();
  updateCartBadge();
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// ===== AUTHENTICATION =====
function getCurrentUser() {
  const data = localStorage.getItem('uzr_current_user');
  return data ? JSON.parse(data) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('uzr_current_user', JSON.stringify(user));
}

function logout() {
  localStorage.removeItem('uzr_current_user');
  updateAuthUI();
  showToast("Tizimdan chiqdingiz", "info");
  setTimeout(() => window.location.reload(), 500);
}

function updateAuthUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('loginBtn');
  const userDropdown = document.getElementById('userDropdown');
  const userName = document.getElementById('userNameDisplay');
  const userInitial = document.getElementById('userInitial');

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userDropdown) {
      userDropdown.style.display = 'block';
      if (userName) userName.textContent = user.name.split(' ')[0];
      if (userInitial) userInitial.textContent = user.name.charAt(0).toUpperCase();
    }
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (userDropdown) userDropdown.style.display = 'none';
  }
}

function toggleUserMenu() {
  document.getElementById('userMenu')?.classList.toggle('active');
}

// Close user menu on click outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('userDropdown');
  const menu = document.getElementById('userMenu');
  if (dropdown && menu && !dropdown.contains(e.target)) {
    menu.classList.remove('active');
  }
});

// ===== AUTH MODALS =====
function openLoginModal() {
  document.getElementById('loginModal')?.classList.add('active');
}

function closeLoginModal() {
  document.getElementById('loginModal')?.classList.remove('active');
}

function openRegisterModal() {
  closeLoginModal();
  document.getElementById('registerModal')?.classList.add('active');
}

function closeRegisterModal() {
  document.getElementById('registerModal')?.classList.remove('active');
}

function switchToLogin() {
  closeRegisterModal();
  openLoginModal();
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const users = getData('users');
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    setCurrentUser(user);
    closeLoginModal();
    updateAuthUI();
    showToast(`Xush kelibsiz, ${user.name}!`, 'success');
  } else {
    showToast("Email yoki parol noto'g'ri!", 'error');
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;

  if (password !== confirmPassword) {
    showToast("Parollar mos kelmaydi!", 'error');
    return;
  }

  if (password.length < 6) {
    showToast("Parol kamida 6 belgidan iborat bo'lishi kerak!", 'error');
    return;
  }

  const users = getData('users');
  if (users.find(u => u.email === email)) {
    showToast("Bu email allaqachon ro'yxatdan o'tgan!", 'error');
    return;
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    phone,
    password,
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  setData('users', users);
  setCurrentUser(newUser);
  closeRegisterModal();
  updateAuthUI();
  showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz!", 'success');
}

// ===== FORGOT PASSWORD FLOW =====
let resetSession = { email: null, code: null };

function openForgotModal() {
  closeLoginModal();
  document.getElementById('forgotModal')?.classList.add('active');
}

function closeForgotModal() {
  document.getElementById('forgotModal')?.classList.remove('active');
}

function openVerifyModal() {
  closeForgotModal();
  document.getElementById('verifyModal')?.classList.add('active');
}

function closeVerifyModal() {
  document.getElementById('verifyModal')?.classList.remove('active');
}

function openResetModal() {
  closeVerifyModal();
  document.getElementById('resetModal')?.classList.add('active');
}

function closeResetModal() {
  document.getElementById('resetModal')?.classList.remove('active');
  resetSession = { email: null, code: null }; // clear session
}

function handleForgot(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim();
  const users = getData('users');
  
  if (!users.find(u => u.email === email)) {
    showToast("Bunday email ro'yxatdan o'tmagan!", 'error');
    return;
  }

  // Generate a mock 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetSession.email = email;
  resetSession.code = code;

  // SIMULATE SENDING EMAIL
  alert(`[SIMULATED EMAIL]\n\nKimga: ${email}\n\nSizning parolni tiklash kodingiz: ${code}`);

  showToast("Tasdiqlash kodi elektron pochtangizga yuborildi!", 'info');
  openVerifyModal();
}

function handleVerify(e) {
  e.preventDefault();
  const code = document.getElementById('verifyCode').value.trim();

  if (code !== resetSession.code) {
    showToast("Tasdiqlash kodi noto'g'ri!", 'error');
    return;
  }

  showToast("Kod tasdiqlandi!", 'success');
  openResetModal();
}

function handleReset(e) {
  e.preventDefault();
  const password = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmNewPassword').value;

  if (password !== confirmPassword) {
    showToast("Parollar mos kelmaydi!", 'error');
    return;
  }

  if (password.length < 6) {
    showToast("Parol kamida 6 belgidan iborat bo'lishi kerak!", 'error');
    return;
  }

  // Update password in db
  const users = getData('users');
  const userIndex = users.findIndex(u => u.email === resetSession.email);
  
  if (userIndex !== -1) {
    users[userIndex].password = password;
    setData('users', users);
    showToast("Parolingiz muvaffaqiyatli o'zgartirildi!", 'success');
    closeResetModal();
    openLoginModal();
  } else {
    showToast("Xatolik yuz berdi!", 'error');
  }
}

// ===== CART =====
function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  return JSON.parse(localStorage.getItem(`uzr_cart_${user.id}`) || '[]');
}

function saveCart(cart) {
  const user = getCurrentUser();
  if (user) {
    localStorage.setItem(`uzr_cart_${user.id}`, JSON.stringify(cart));
  }
  updateCartBadge();
}

function addToCart(bookId) {
  const user = getCurrentUser();
  if (!user) {
    showToast("Iltimos, avval tizimga kiring!", 'error');
    openLoginModal();
    return;
  }

  const books = getData('books');
  const book = books.find(b => b.id === bookId);
  if (!book) return;

  const cart = getCart();
  if (cart.find(item => item.id === bookId)) {
    showToast("Bu kitob allaqachon savatda!", 'info');
    return;
  }

  cart.push({ id: book.id, title: book.title, price: book.price, author: book.author });
  saveCart(cart);
  showToast(`"${book.title}" savatga qo'shildi!`, 'success');
}

function removeFromCart(bookId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== bookId);
  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = cart.length;
    badge.classList.toggle('visible', cart.length > 0);
  }
}

function toggleCart() {
  document.querySelector('.cart-sidebar')?.classList.toggle('active');
  document.querySelector('.cart-overlay')?.classList.toggle('active');
  renderCart();
}

function closeCart() {
  document.querySelector('.cart-sidebar')?.classList.remove('active');
  document.querySelector('.cart-overlay')?.classList.remove('active');
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Savat bo'sh</p>
      </div>`;
    document.getElementById('cartTotal').textContent = '0';
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-cover">📚</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cartTotal').textContent = formatPrice(total);
  }
}

function formatPrice(price) {
  if (price === 0) return 'Bepul';
  return price.toLocaleString('uz-UZ') + " so'm";
}

// ===== CHECKOUT =====
function openCheckout() {
  const user = getCurrentUser();
  if (!user) {
    showToast("Iltimos, avval tizimga kiring!", 'error');
    openLoginModal();
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    showToast("Savatda kitob yo'q!", 'error');
    return;
  }

  closeCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('checkoutTotal').textContent = formatPrice(total);
  document.getElementById('checkoutModal')?.classList.add('active');

  // Render order items
  const list = document.getElementById('checkoutItems');
  if (list) {
    list.innerHTML = cart.map(item => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:0.88rem;border-bottom:1px solid var(--border-glass);">
        <span>${item.title}</span>
        <span style="color:var(--accent-gold);font-weight:600;">${formatPrice(item.price)}</span>
      </div>
    `).join('');
  }
}

function closeCheckout() {
  document.getElementById('checkoutModal')?.classList.remove('active');
  // Reset upload
  const preview = document.getElementById('uploadPreview');
  const text = document.getElementById('uploadText');
  const area = document.getElementById('uploadArea');
  if (preview) preview.style.display = 'none';
  if (text) text.textContent = "Skreenshot yuklash uchun bosing yoki faylni shu yerga tashlang";
  if (area) area.classList.remove('has-file');
  uploadedScreenshot = null;
}

let uploadedScreenshot = null;

function initUpload() {
  const area = document.getElementById('uploadArea');
  const fileInput = document.getElementById('screenshotInput');

  area?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  });

  area?.addEventListener('dragover', (e) => { e.preventDefault(); area.style.borderColor = 'var(--accent-gold)'; });
  area?.addEventListener('dragleave', () => { area.style.borderColor = ''; });
  area?.addEventListener('drop', (e) => {
    e.preventDefault();
    area.style.borderColor = '';
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  });
}

function handleFileUpload(file) {
  if (!file.type.startsWith('image/')) {
    showToast("Faqat rasm fayllari qabul qilinadi!", 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedScreenshot = e.target.result;
    const preview = document.getElementById('uploadPreview');
    const text = document.getElementById('uploadText');
    const area = document.getElementById('uploadArea');
    if (preview) { preview.src = uploadedScreenshot; preview.style.display = 'block'; }
    if (text) text.textContent = file.name;
    if (area) area.classList.add('has-file');
  };
  reader.readAsDataURL(file);
}

function handleCheckout(e) {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const cardNumber = document.getElementById('cardNumber').value.trim();
  const cardHolder = document.getElementById('cardHolder').value.trim();

  if (!cardNumber || cardNumber.length < 16) {
    showToast("Karta raqamini to'liq kiriting!", 'error');
    return;
  }

  if (!cardHolder) {
    showToast("Karta egasi ismini kiriting!", 'error');
    return;
  }

  if (!uploadedScreenshot) {
    showToast("To'lov skrinshotini yuklang!", 'error');
    return;
  }

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const order = {
    id: 'ORD-' + Date.now(),
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone,
    items: cart,
    total,
    cardNumber: '**** **** **** ' + cardNumber.slice(-4),
    cardHolder,
    screenshot: uploadedScreenshot,
    status: 'kutilmoqda',
    createdAt: new Date().toISOString()
  };

  const orders = getData('orders');
  orders.push(order);
  setData('orders', orders);

  // Clear cart
  saveCart([]);

  closeCheckout();
  showToast("Buyurtmangiz qabul qilindi! Admin tekshirganidan so'ng xabar beramiz.", 'success');
}
// ===== PROFILE / MY ORDERS =====
function openOrdersModal() {
  const user = getCurrentUser();
  if (!user) return;
  toggleUserMenu();

  // Render user orders
  const orders = getData('orders').filter(o => o.userId === user.id);
  const container = document.getElementById('ordersContainer');

  if (container) {
    if (orders.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:40px 0;"><div style="font-size:3rem;margin-bottom:12px;">📦</div><p style="color:var(--text-muted);font-size:0.95rem;">Sizda hozircha xaridlar yo\'q</p></div>';
    } else {
      // Sort newest first
      orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      container.innerHTML = orders.map(o => {
        const statusLabels = { kutilmoqda: '⏳ Kutilmoqda', tasdiqlangan: '✅ Tasdiqlangan', 'rad etilgan': '❌ Rad etilgan' };
        const statusClass = o.status === 'kutilmoqda' ? 'status-pending' : o.status === 'tasdiqlangan' ? 'status-approved' : 'status-rejected';
        return `
          <div class="order-card" style="margin-bottom:12px; padding: 20px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
              <div>
                <div style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700; margin-bottom:4px;">${o.id}</div>
                <div style="font-size:0.85rem;color:var(--text-muted);">${new Date(o.createdAt).toLocaleString('uz-UZ')}</div>
              </div>
              <span class="order-status ${statusClass}">${statusLabels[o.status]}</span>
            </div>
            
            <div style="background:var(--bg-glass); border-radius:var(--radius-sm); padding:12px; margin-bottom:14px;">
              <div style="font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-bottom:6px;">Xarid qilingan kitoblar:</div>
              <ul style="list-style:none; padding:0; margin:0; font-size:0.9rem;">
                ${o.items.map(item => `
                  <li style="display:flex; justify-content:space-between; margin-bottom:4px; padding-bottom:4px; border-bottom:1px dashed var(--border-glass);">
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-right:12px;">${item.title}</span>
                    <span style="font-weight:600; color:var(--text-primary); flex-shrink:0;">${formatPrice(item.price)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-glass); padding-top:12px;">
              <span style="font-size:0.9rem; font-weight:600; color:var(--text-secondary);">Umumiy summa:</span>
              <span style="font-family:var(--font-heading); font-size:1.2rem; font-weight:700; color:var(--accent-gold);">${formatPrice(o.total)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  document.getElementById('ordersModal')?.classList.add('active');
}

function closeOrdersModal() {
  document.getElementById('ordersModal')?.classList.remove('active');
}

// ===== PROFILE =====
function openProfileModal() {
  const user = getCurrentUser();
  if (!user) return;
  toggleUserMenu();

  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profilePhone').textContent = user.phone || '-';

  document.getElementById('profileModal')?.classList.add('active');
}

function closeProfileModal() {
  document.getElementById('profileModal')?.classList.remove('active');
}

// ===== SCROLL ANIMATION =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    if (isNaN(target)) return;

    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
      }
    }, 16);
  });
}

// ===== GENERATE NAV HTML =====
function getNavHTML() {
  const user = getCurrentUser();
  return `
  <nav class="navbar" id="navbar">
    <a href="index.html" class="nav-brand">
      <div class="nav-brand-icon">IM</div>
      <div class="nav-brand-text">Ilmiy <span>Maktab</span></div>
    </a>

    <ul class="nav-links" id="navLinks">
      ${(getData('menus') || []).map(m => `<li><a href="${m.url}">${m.text}</a></li>`).join('')}
    </ul>

    <div class="nav-actions">
      <button class="nav-cart-btn" onclick="toggleCart()" title="Savat">
        🛒
        <span class="cart-badge" id="cartBadge">0</span>
      </button>

      <button class="btn btn-primary btn-sm" id="loginBtn" onclick="openLoginModal()">Kirish</button>

      <div class="user-dropdown" id="userDropdown" style="display:none;">
        <button class="user-avatar-btn" onclick="toggleUserMenu()">
          <div class="user-avatar-small" id="userInitial">U</div>
          <span id="userNameDisplay">User</span>
          ▾
        </button>
        <div class="user-menu" id="userMenu">
          <button class="user-menu-item" onclick="openProfileModal()">👤 Profilim</button>
          <button class="user-menu-item" onclick="openOrdersModal()">📦 Buyurtmalarim</button>
          <button class="user-menu-item danger" onclick="logout()">🚪 Chiqish</button>
        </div>
      </div>

      <button class="hamburger" onclick="document.getElementById('navLinks').classList.toggle('active')">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

function getCartSidebarHTML() {
  return `
  <div class="cart-overlay" onclick="closeCart()"></div>
  <div class="cart-sidebar" id="cartSidebar">
    <div class="cart-header" style="flex-shrink:0;">
      <h3>🛒 Savat</h3>
      <button class="cart-close" onclick="closeCart()">✕</button>
    </div>
    <div class="cart-items" id="cartItems" style="flex:1; overflow-y:auto;"></div>

    <div class="cart-footer" style="flex-shrink:0;">
      <div class="cart-total">
        <span>Jami:</span>
        <span class="cart-total-price" id="cartTotal">0</span>
      </div>
      <button class="btn btn-primary btn-lg" style="width:100%;" onclick="openCheckout()">Buyurtma berish</button>
    </div>
  </div>`;
}

function getModalsHTML() {
  return `
  <!-- Login Modal -->
  <div class="modal-overlay" id="loginModal">
    <div class="modal">
      <button class="modal-close" onclick="closeLoginModal()">✕</button>
      <h2>Tizimga kirish</h2>
      <p class="subtitle">Hisobingizga kiring</p>
      <form onsubmit="handleLogin(event)">
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="loginEmail" placeholder="email@example.com" required>
        </div>
        <div class="form-group">
          <label>Parol</label>
          <input type="password" id="loginPassword" placeholder="Parolingizni kiriting" required>
        </div>
        <div style="text-align:right; margin-bottom: 8px;">
          <span class="form-link" style="font-size:0.88rem;" onclick="openForgotModal()">Parolni unutdingizmi?</span>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px;">Kirish</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:0.88rem;color:var(--text-muted);">
        Hisobingiz yo'qmi? <span class="form-link" onclick="openRegisterModal()">Ro'yxatdan o'ting</span>
      </p>
    </div>
  </div>

  <!-- Register Modal -->
  <div class="modal-overlay" id="registerModal">
    <div class="modal">
      <button class="modal-close" onclick="closeRegisterModal()">✕</button>
      <h2>Ro'yxatdan o'tish</h2>
      <p class="subtitle">Yangi hisob yarating</p>
      <form onsubmit="handleRegister(event)">
        <div class="form-group">
          <label>To'liq ism</label>
          <input type="text" id="regName" placeholder="Ismingiz Familiyangiz" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="regEmail" placeholder="email@example.com" required>
        </div>
        <div class="form-group">
          <label>Telefon raqam</label>
          <input type="tel" id="regPhone" placeholder="+998 90 123 45 67" required>
        </div>
        <div class="form-group">
          <label>Parol</label>
          <input type="password" id="regPassword" placeholder="Kamida 6 belgi" required minlength="6">
        </div>
        <div class="form-group">
          <label>Parolni tasdiqlash</label>
          <input type="password" id="regConfirmPassword" placeholder="Parolni qayta kiriting" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px;">Ro'yxatdan o'tish</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:0.88rem;color:var(--text-muted);">
        Hisobingiz bormi? <span class="form-link" onclick="switchToLogin()">Tizimga kiring</span>
      </p>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div class="modal-overlay" id="forgotModal">
    <div class="modal">
      <button class="modal-close" onclick="closeForgotModal()">✕</button>
      <h2>Parolni tiklash</h2>
      <p class="subtitle">Parolni tiklash uchun pochtangizni kiriting</p>
      <form onsubmit="handleForgot(event)">
        <div class="form-group">
          <label>Email</label>
          <input type="email" id="forgotEmail" placeholder="email@example.com" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px;">Kodni yuborish</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:0.88rem;color:var(--text-muted);">
        <span class="form-link" onclick="closeForgotModal(); openLoginModal()">Orqaga qaytish</span>
      </p>
    </div>
  </div>

  <!-- Verify Code Modal -->
  <div class="modal-overlay" id="verifyModal">
    <div class="modal">
      <button class="modal-close" onclick="closeVerifyModal()">✕</button>
      <h2>Kodni tasdiqlash</h2>
      <p class="subtitle">Emailingizga yuborilgan 6 xonali kodni kiriting</p>
      <form onsubmit="handleVerify(event)">
        <div class="form-group">
          <label>Tasdiqlash kodi</label>
          <input type="text" id="verifyCode" placeholder="123456" maxlength="6" required pattern="\\d{6}" title="6 ta raqam">
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px;">Tasdiqlash</button>
      </form>
    </div>
  </div>

  <!-- Reset Password Modal -->
  <div class="modal-overlay" id="resetModal">
    <div class="modal">
      <button class="modal-close" onclick="closeResetModal()">✕</button>
      <h2>Yangi parol</h2>
      <p class="subtitle">Yangi parolni kiriting</p>
      <form onsubmit="handleReset(event)">
        <div class="form-group">
          <label>Yangi parol</label>
          <input type="password" id="newPassword" placeholder="Kamida 6 belgi" required minlength="6">
        </div>
        <div class="form-group">
          <label>Parolni bir marta tasdiqlash</label>
          <input type="password" id="confirmNewPassword" placeholder="Parolni qayta kiriting" required>
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width:100%;margin-top:8px;">O'zgartirish</button>
      </form>
    </div>
  </div>

  <!-- Profile Modal -->
  <div class="modal-overlay" id="profileModal">
    <div class="modal">
      <button class="modal-close" onclick="closeProfileModal()">✕</button>
      <h2>👤 Profilim</h2>
      <div style="margin-top:16px;">
        <div style="margin-bottom:10px;"><strong>Ism:</strong> <span id="profileName"></span></div>
        <div style="margin-bottom:10px;"><strong>Email:</strong> <span id="profileEmail"></span></div>
        <div style="margin-bottom:10px;"><strong>Telefon:</strong> <span id="profilePhone"></span></div>
      </div>
    </div>
  </div>

  <!-- Orders Modal -->
  <div class="modal-overlay" id="ordersModal">
    <div class="modal" style="max-width: 600px;">
      <button class="modal-close" onclick="closeOrdersModal()">✕</button>
      <h2>📦 Buyurtmalarim</h2>
      <p class="subtitle">Sizning xaridlar tarixingiz</p>
      <div id="ordersContainer" style="margin-top:20px; max-height: 60vh; overflow-y: auto; padding-right: 10px;"></div>
    </div>
  </div>

  <!-- Checkout Modal -->
  <div class="modal-overlay checkout-modal" id="checkoutModal">
    <div class="modal" style="max-width:540px;">
      <button class="modal-close" onclick="closeCheckout()">✕</button>
      <h2>💳 To'lov</h2>
      <p class="subtitle">Buyurtmani yakunlash</p>

      <div id="checkoutItems" style="margin-bottom:16px;"></div>

      <div class="payment-info-box">
        <h4>To'lov ma'lumotlari</h4>
        <p>Quyidagi karta raqamiga to'lov qiling va skrinshotini yuklang:</p>
        <p class="payment-card-number" style="margin-top:8px;">8600 1234 5678 9012</p>
        <p style="margin-top:4px;font-size:0.82rem;">Egasi: Ilmiy Maktab MChJ</p>
      </div>

      <div style="text-align:center;font-size:1.2rem;font-weight:700;color:var(--accent-gold);margin-bottom:16px;">
        Jami: <span id="checkoutTotal">0</span>
      </div>

      <form onsubmit="handleCheckout(event)">
        <div class="form-group">
          <label>Sizning karta raqamingiz</label>
          <input type="text" id="cardNumber" placeholder="8600 XXXX XXXX XXXX" maxlength="19" required>
        </div>
        <div class="form-group">
          <label>Karta egasi</label>
          <input type="text" id="cardHolder" placeholder="ISMINGIZ FAMILIYANGIZ" required>
        </div>

        <div class="form-group">
          <label>To'lov skreenshot</label>
          <div class="upload-area" id="uploadArea">
            <div class="upload-icon">📷</div>
            <p class="upload-text" id="uploadText">Skreenshot yuklash uchun bosing yoki faylni shu yerga tashlang</p>
            <img class="upload-preview" id="uploadPreview" style="display:none;" alt="preview">
          </div>
          <input type="file" id="screenshotInput" accept="image/*" style="display:none;">
        </div>

        <button type="submit" class="btn btn-teal btn-lg" style="width:100%;">Buyurtmani tasdiqlash</button>
      </form>
    </div>
  </div>`;
}

function getFooterHTML() {
  const settingsStr = localStorage.getItem('uzr_site_settings');
  const settings = settingsStr ? JSON.parse(settingsStr) : DEFAULT_SITE_SETTINGS;
  return `
  <footer class="footer">
    <div class="footer-content">
      <div>
        <div class="footer-brand">Ilmiy <span>Maktab</span></div>
        <p class="footer-desc">O'zbekistondagi yetakchi ilmiy tadqiqot markazi. Zamonaviy fan va texnologiyalar sohasida ilmiy izlanishlar olib boriladi.</p>
      </div>
      <div>
        <div class="footer-title">Sahifalar</div>
        <ul class="footer-links">
          <li><a href="index.html">Bosh sahifa</a></li>
          <li><a href="news.html">Yangiliklar</a></li>
          <li><a href="scholars.html">Olimlar</a></li>
          <li><a href="books.html">Adabiyotlar</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-title">Resurslar</div>
        <ul class="footer-links">
          <li><a href="books.html">Bepul kitoblar</a></li>
          <li><a href="scholars.html">Professorlar</a></li>
          <li><a href="contact.html">Bog'lanish</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-title">Bog'lanish</div>
        <ul class="footer-links">
          <li><a href="mailto:${settings.contactEmail}" id="footerEmail">${settings.contactEmail}</a></li>
          <li><a href="tel:${settings.contactPhone}" id="footerPhone">${settings.contactPhone}</a></li>
          <li><a id="footerAddress">${settings.contactAddress}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      © 2026 Ilmiy Maktab. Barcha huquqlar himoyalangan.
    </div>
  </footer>`;
}

// ===== INITIALIZE PAGE =====
function initPage() {
  // Inject common elements if placeholders exist
  const navPlaceholder = document.getElementById('nav-placeholder');
  const cartPlaceholder = document.getElementById('cart-placeholder');
  const modalsPlaceholder = document.getElementById('modals-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (navPlaceholder) navPlaceholder.innerHTML = getNavHTML();
  if (cartPlaceholder) cartPlaceholder.innerHTML = getCartSidebarHTML();
  if (modalsPlaceholder) modalsPlaceholder.innerHTML = getModalsHTML();
  if (footerPlaceholder) footerPlaceholder.innerHTML = getFooterHTML();

  initNavbar();
  initScrollAnimations();
  initUpload();
  applyDynamicSettings();

  // Card number formatting
  const cardInput = document.getElementById('cardNumber');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = val;
    });
  }
}

function applyDynamicSettings() {
  const settingsStr = localStorage.getItem('uzr_site_settings');
  if (!settingsStr) return;
  const settings = JSON.parse(settingsStr);

  // Home page elements
  const elHeroTitle = document.getElementById('dynHeroTitle');
  const elHeroSub = document.getElementById('dynHeroSubtitle');
  if (elHeroTitle) elHeroTitle.innerHTML = settings.heroTitle;
  if (elHeroSub) elHeroSub.innerHTML = settings.heroSubtitle;

  const elStat1Label = document.getElementById('dynStat1Label');
  const elStat1Val = document.getElementById('dynStat1Val');
  if (elStat1Label) elStat1Label.textContent = settings.stat1Title;
  if (elStat1Val) elStat1Val.setAttribute('data-target', settings.stat1Value);

  const elStat2Label = document.getElementById('dynStat2Label');
  const elStat2Val = document.getElementById('dynStat2Val');
  if (elStat2Label) elStat2Label.textContent = settings.stat2Title;
  if (elStat2Val) elStat2Val.setAttribute('data-target', settings.stat2Value);

  const elStat3Label = document.getElementById('dynStat3Label');
  const elStat3Val = document.getElementById('dynStat3Val');
  if (elStat3Label) elStat3Label.textContent = settings.stat3Title;
  if (elStat3Val) elStat3Val.setAttribute('data-target', settings.stat3Value);

  const elStat4Label = document.getElementById('dynStat4Label');
  const elStat4Val = document.getElementById('dynStat4Val');
  if (elStat4Label) elStat4Label.textContent = settings.stat4Title;
  if (elStat4Val) elStat4Val.setAttribute('data-target', settings.stat4Value);

  // Contact page elements
  const elContactPhone = document.getElementById('dynContactPhone');
  const elContactEmail = document.getElementById('dynContactEmail');
  const elContactAddress = document.getElementById('dynContactAddress');
  if (elContactPhone) elContactPhone.textContent = settings.contactPhone;
  if (elContactEmail) elContactEmail.textContent = settings.contactEmail;
  if (elContactAddress) elContactAddress.textContent = settings.contactAddress;
}

function applyTheme() {
  const themeObjStr = localStorage.getItem('uzr_theme');
  if (!themeObjStr) return;
  try {
    const theme = JSON.parse(themeObjStr);
    const root = document.documentElement;
    if (theme.bgPrimary) root.style.setProperty('--bg-primary', theme.bgPrimary);
    if (theme.bgSecondary) root.style.setProperty('--bg-secondary', theme.bgSecondary);
    if (theme.bgSecondary) root.style.setProperty('--bg-glass', hexToRgba(theme.bgSecondary, 0.7));
    if (theme.accentGold) {
      root.style.setProperty('--accent-gold', theme.accentGold);
      root.style.setProperty('--border-glass', hexToRgba(theme.accentGold, 0.15));
    }
    if (theme.accentTeal) root.style.setProperty('--accent-teal', theme.accentTeal);
    if (theme.accentPurple) root.style.setProperty('--accent-purple', theme.accentPurple);
  } catch (e) {
    console.error("Theme parse error", e);
  }
}

function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;
  if (hex && hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; }
  else if (hex && hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
  return `rgba(${+r},${+g},${+b},${alpha})`;
}

document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  initPage();
});
