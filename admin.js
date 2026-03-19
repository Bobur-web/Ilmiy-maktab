let isAdminLoggedIn = false;
let currentOrderFilter = 'all';

// ===== AUTH =====
function adminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    isAdminLoggedIn = true;
    localStorage.setItem('uzr_admin_logged', 'true');
    showDashboard();
    showToast("Admin paneliga xush kelibsiz!", 'success');
  } else {
    showToast("Noto'g'ri ma'lumotlar!", 'error');
  }
}

function adminLogout() {
  isAdminLoggedIn = false;
  localStorage.removeItem('uzr_admin_logged');
  document.getElementById('adminLoginSection').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
  showToast("Admin paneldan chiqdingiz", 'info');
}

function showDashboard() {
  document.getElementById('adminLoginSection').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
  refreshAll();
}

function refreshAll() {
  updateAdminStats();
  renderOrders();
  renderBooksTable();
  renderNewsTable();
  renderScholarsTable();
  renderUsers();
  renderMessages();
  loadSiteSettingsForm();
  loadThemeSettings();
  renderMenus();
}

function updateAdminStats() {
  const orders = getData('orders');
  const users = getData('users');
  const books = getData('books');
  const news = getData('news');
  const scholars = getData('scholars');
  document.getElementById('adminStatOrders').textContent = orders.length;
  document.getElementById('adminStatPending').textContent = orders.filter(o => o.status === 'kutilmoqda').length;
  document.getElementById('adminStatBooks').textContent = books.length;
  document.getElementById('adminStatNews').textContent = news.length;
  document.getElementById('adminStatScholars').textContent = scholars.length;
  document.getElementById('adminStatUsers').textContent = users.length;
}

// ===== CONFIRM DIALOG =====
function showConfirm(message, onConfirm) {
  const container = document.getElementById('confirmDialog');
  container.style.display = 'block';
  container.innerHTML = `
    <div class="confirm-overlay">
      <div class="confirm-box">
        <h3>⚠️ Tasdiqlash</h3>
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn btn-danger btn-sm" id="confirmYes">Ha, o'chirish</button>
          <button class="btn btn-secondary btn-sm" id="confirmNo">Bekor qilish</button>
        </div>
      </div>
    </div>`;
  document.getElementById('confirmYes').onclick = () => { container.style.display = 'none'; onConfirm(); };
  document.getElementById('confirmNo').onclick = () => { container.style.display = 'none'; };
}

// Custom Toast (so we don't need app.js)
function showToast(msg, type='info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `<span style="font-size:1.2rem;">${type==='success'?'✅':type==='error'?'❌':'ℹ️'}</span> ${msg}`;
  container.appendChild(t);
  requestAnimationFrame(()=>t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(()=>t.remove(), 300); }, 3000);
}

// Format Price
function formatPrice(num) {
  return parseInt(num).toLocaleString('uz-UZ') + " so'm";
}

// ===== ORDERS =====
function renderOrders(filter = 'all') {
  let orders = getData('orders');
  if (filter !== 'all') orders = orders.filter(o => o.status === filter);
  const container = document.getElementById('ordersContainer');

  if (orders.length === 0) {
    container.innerHTML = `<div class="glass-card" style="padding:40px;text-align:center;"><div style="font-size:3rem;margin-bottom:12px;">📭</div><p style="color:var(--text-muted);">Buyurtmalar mavjud emas</p></div>`;
    return;
  }

  container.innerHTML = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(o => {
    const statusLabels = { kutilmoqda: '⏳ Kutilmoqda', tasdiqlangan: '✅ Tasdiqlangan', 'rad etilgan': '❌ Rad etilgan' };
    const statusClass = o.status === 'kutilmoqda' ? 'status-pending' : o.status === 'tasdiqlangan' ? 'status-approved' : 'status-rejected';
    return `
      <div class="order-card">
        <div class="order-header">
          <span class="order-id">${o.id}</span>
          <span class="order-status ${statusClass}">${statusLabels[o.status]}</span>
        </div>
        <div class="order-details">
          <div><span class="order-detail-label">Foydalanuvchi:</span><div>${o.userName}</div></div>
          <div><span class="order-detail-label">Email:</span><div>${o.userEmail}</div></div>
          <div><span class="order-detail-label">Telefon:</span><div>${o.userPhone || '-'}</div></div>
          <div><span class="order-detail-label">Karta:</span><div>${o.cardNumber}</div></div>
          <div><span class="order-detail-label">Kitoblar:</span><div>${o.items.map(i => i.title).join(', ')}</div></div>
          <div><span class="order-detail-label">Jami:</span><div style="color:var(--accent-gold);font-weight:700;">${formatPrice(o.total)}</div></div>
          <div><span class="order-detail-label">Sana:</span><div>${new Date(o.createdAt).toLocaleString('uz-UZ')}</div></div>
        </div>
        ${o.screenshot ? `<div><span class="order-detail-label">Skreenshot:</span><div style="margin-top:8px;"><img src="${o.screenshot}" class="order-screenshot" alt="screenshot" onclick="viewScreenshot(this.src)"></div></div>` : ''}
        ${o.status === 'kutilmoqda' ? `<div class="order-actions"><button class="btn btn-teal btn-sm" onclick="approveOrder('${o.id}')">✅ Tasdiqlash</button><button class="btn btn-danger btn-sm" onclick="rejectOrder('${o.id}')">❌ Rad etish</button></div>` : ''}
      </div>`;
  }).join('');
}

function viewScreenshot(src) { document.getElementById('screenshotPreviewFull').src = src; document.getElementById('screenshotModal').classList.add('active'); }

function approveOrder(id) {
  const orders = getData('orders'); const o = orders.find(x => x.id === id);
  if (o) { o.status = 'tasdiqlangan'; setData('orders', orders); renderOrders(currentOrderFilter); updateAdminStats(); showToast(`Buyurtma ${id} tasdiqlandi!`, 'success'); }
}

function rejectOrder(id) {
  const orders = getData('orders'); const o = orders.find(x => x.id === id);
  if (o) { o.status = 'rad etilgan'; setData('orders', orders); renderOrders(currentOrderFilter); updateAdminStats(); showToast(`Buyurtma ${id} rad etildi`, 'info'); }
}

// ===== BOOKS CRUD =====
function renderBooksTable() {
  const books = getData('books');
  const container = document.getElementById('booksTableContainer');
  if (books.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Kitoblar mavjud emas</p>';
    return;
  }
  container.innerHTML = `
    <table class="admin-table">
      <thead><tr>
        <th>#</th><th>Nomi</th><th>Muallif</th><th>Kategoriya</th><th>Turi</th><th>Format</th><th>Narxi</th><th>Amallar</th>
      </tr></thead>
      <tbody>
        ${books.map((b, i) => `<tr>
          <td>${i + 1}</td>
          <td style="font-weight:600;max-width:200px;">${b.title}</td>
          <td>${b.author}</td>
          <td><span class="badge badge-online" style="font-size:0.72rem;">${b.category}</span></td>
          <td><span class="badge ${b.type === 'free' ? 'badge-free' : 'badge-paid'}">${b.type === 'free' ? 'Bepul' : 'Pullik'}</span></td>
          <td><span class="badge ${b.format === 'online' ? 'badge-online' : 'badge-offline'}">${b.format === 'online' ? 'Onlayn' : 'Oflayn'}</span></td>
          <td style="color:var(--accent-gold);font-weight:600;">${formatPrice(b.price)}</td>
          <td style="white-space:nowrap;">
            <button class="action-btn edit" title="Tahrirlash" onclick="editBook(${b.id})">✏️</button>
            <button class="action-btn delete" title="O'chirish" onclick="deleteBook(${b.id})">🗑️</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function openBookForm(book = null) {
  document.getElementById('bookEditId').value = book ? book.id : '';
  document.getElementById('bookFormTitle').textContent = book ? '✏️ Kitobni tahrirlash' : '📚 Yangi kitob qo\'shish';
  document.getElementById('bookFormSubtitle').textContent = book ? 'Ma\'lumotlarni o\'zgartiring' : 'Kitob ma\'lumotlarini kiriting';
  document.getElementById('bookFormTitle_input').value = book ? book.title : '';
  document.getElementById('bookFormAuthor').value = book ? book.author : '';
  document.getElementById('bookFormCategory').value = book ? book.category : '';
  document.getElementById('bookFormType').value = book ? book.type : 'free';
  document.getElementById('bookFormFormat').value = book ? book.format : 'online';
  document.getElementById('bookFormPrice').value = book ? book.price : 0;
  document.getElementById('bookFormPages').value = book ? book.pages : 0;
  document.getElementById('bookFormYear').value = book ? book.year : 2026;
  document.getElementById('bookFormIsbn').value = book ? book.isbn : '';
  document.getElementById('bookFormRating').value = book ? book.rating : 4.5;
  document.getElementById('bookFormDesc').value = book ? book.description : '';
  document.getElementById('bookFormContent').value = book ? (book.sampleContent || '') : '';
  document.getElementById('bookFormModal').classList.add('active');
}

function closeBookForm() { document.getElementById('bookFormModal').classList.remove('active'); }

function editBook(id) {
  const books = getData('books');
  const book = books.find(b => b.id === id);
  if (book) openBookForm(book);
}

function saveBook(e) {
  e.preventDefault();
  const editId = document.getElementById('bookEditId').value;
  const books = getData('books');
  const bookData = {
    title: document.getElementById('bookFormTitle_input').value.trim(),
    author: document.getElementById('bookFormAuthor').value.trim(),
    category: document.getElementById('bookFormCategory').value.trim(),
    type: document.getElementById('bookFormType').value,
    format: document.getElementById('bookFormFormat').value,
    price: parseInt(document.getElementById('bookFormPrice').value) || 0,
    pages: parseInt(document.getElementById('bookFormPages').value) || 0,
    year: parseInt(document.getElementById('bookFormYear').value) || 2026,
    isbn: document.getElementById('bookFormIsbn').value.trim(),
    rating: parseFloat(document.getElementById('bookFormRating').value) || 4.5,
    reviews: 0,
    description: document.getElementById('bookFormDesc').value.trim(),
    sampleContent: document.getElementById('bookFormContent').value.trim(),
    cover: '',
    image: ''
  };

  const pdfInput = document.getElementById('bookPdfInput');
  const finalizeSave = (pdfData) => {
    bookData.pdfData = pdfData;
    if (editId) {
      const idx = books.findIndex(b => b.id === parseInt(editId));
      if (idx !== -1) {
        bookData.id = parseInt(editId);
        bookData.reviews = books[idx].reviews;
        if (!pdfInput.files || !pdfInput.files[0]) {
           bookData.pdfData = books[idx].pdfData || null;
        }
        books[idx] = bookData;
        showToast("Kitob muvaffaqiyatli tahrirlandi!", 'success');
      }
    } else {
      bookData.id = Date.now();
      books.push(bookData);
      showToast("Yangi kitob muvaffaqiyatli qo'shildi!", 'success');
    }
    setData('books', books);
    closeBookForm();
    renderBooksTable();
    updateAdminStats();
  };

  if (pdfInput.files && pdfInput.files[0]) {
    const file = pdfInput.files[0];
    if (file.size > 5 * 1024 * 1024) { showToast("Fayl hajmi 5MB dan kam bo'lishi kerak", 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => finalizeSave(ev.target.result);
    reader.onerror = () => { showToast("PDF faylni o'qishda xatolik yuz berdi", 'error'); finalizeSave(null); };
    reader.readAsDataURL(file);
  } else {
    finalizeSave(null);
  }
}

function deleteBook(id) {
  const books = getData('books');
  const book = books.find(b => b.id === id);
  showConfirm(`"${book?.title}" kitobini o'chirishni xohlaysizmi?`, () => {
    setData('books', books.filter(b => b.id !== id));
    renderBooksTable();
    updateAdminStats();
    showToast("Kitob o'chirildi", 'info');
  });
}

// ===== NEWS CRUD =====
function renderNewsTable() {
  const news = getData('news');
  const container = document.getElementById('newsTableContainer');
  if (news.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Yangiliklar mavjud emas</p>';
    return;
  }
  container.innerHTML = `
    <table class="admin-table">
      <thead><tr>
        <th>#</th><th>Sarlavha</th><th>Kategoriya</th><th>Sana</th><th>Amallar</th>
      </tr></thead>
      <tbody>
        ${news.map((n, i) => `<tr>
          <td>${i + 1}</td>
          <td style="font-weight:600;max-width:300px;">${n.title}</td>
          <td><span class="badge badge-paid">${n.category}</span></td>
          <td style="color:var(--text-muted);">${new Date(n.date).toLocaleDateString('uz-UZ')}</td>
          <td style="white-space:nowrap;">
            <button class="action-btn edit" title="Tahrirlash" onclick="editNews(${n.id})">✏️</button>
            <button class="action-btn delete" title="O'chirish" onclick="deleteNews(${n.id})">🗑️</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function openNewsForm(newsItem = null) {
  document.getElementById('newsEditId').value = newsItem ? newsItem.id : '';
  document.getElementById('newsFormTitle').textContent = newsItem ? '✏️ Yangilikni tahrirlash' : '📰 Yangi yangilik qo\'shish';
  document.getElementById('newsFormSubtitle').textContent = newsItem ? 'Ma\'lumotlarni o\'zgartiring' : 'Yangilik ma\'lumotlarini kiriting';
  document.getElementById('newsFormHeadline').value = newsItem ? newsItem.title : '';
  document.getElementById('newsFormCategory').value = newsItem ? newsItem.category : 'Yangilik';
  document.getElementById('newsFormDate').value = newsItem ? newsItem.date : new Date().toISOString().split('T')[0];
  document.getElementById('newsFormSummary').value = newsItem ? newsItem.summary : '';
  document.getElementById('newsFormContent').value = newsItem ? newsItem.content : '';
  document.getElementById('newsFormModal').classList.add('active');
}

function closeNewsForm() { document.getElementById('newsFormModal').classList.remove('active'); }

function editNews(id) {
  const news = getData('news');
  const item = news.find(n => n.id === id);
  if (item) openNewsForm(item);
}

function saveNews(e) {
  e.preventDefault();
  const editId = document.getElementById('newsEditId').value;
  const news = getData('news');
  const newsData = {
    title: document.getElementById('newsFormHeadline').value.trim(),
    category: document.getElementById('newsFormCategory').value,
    date: document.getElementById('newsFormDate').value,
    summary: document.getElementById('newsFormSummary').value.trim(),
    content: document.getElementById('newsFormContent').value.trim(),
    image: ''
  };

  if (editId) {
    const idx = news.findIndex(n => n.id === parseInt(editId));
    if (idx !== -1) {
      newsData.id = parseInt(editId);
      news[idx] = newsData;
      showToast("Yangilik muvaffaqiyatli tahrirlandi!", 'success');
    }
  } else {
    newsData.id = Date.now();
    news.unshift(newsData);
    showToast("Yangi yangilik muvaffaqiyatli qo'shildi!", 'success');
  }
  setData('news', news);
  closeNewsForm();
  renderNewsTable();
  updateAdminStats();
}

function deleteNews(id) {
  const news = getData('news');
  const item = news.find(n => n.id === id);
  showConfirm(`"${item?.title}" yangiligini o'chirishni xohlaysizmi?`, () => {
    setData('news', news.filter(n => n.id !== id));
    renderNewsTable();
    updateAdminStats();
    showToast("Yangilik o'chirildi", 'info');
  });
}

// ===== SCHOLARS CRUD =====
function renderScholarsTable() {
  const scholars = getData('scholars');
  const container = document.getElementById('scholarsTableContainer');
  if (scholars.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Olimlar mavjud emas</p>';
    return;
  }
  container.innerHTML = `
    <table class="admin-table">
      <thead><tr>
        <th>#</th><th>Ism</th><th>Ilmiy daraja</th><th>Kafedra</th><th>Maqolalar</th><th>h-index</th><th>Amallar</th>
      </tr></thead>
      <tbody>
        ${scholars.map((s, i) => `<tr>
          <td>${i + 1}</td>
          <td style="font-weight:600;">${s.name}</td>
          <td style="color:var(--accent-gold);font-size:0.82rem;">${s.title}</td>
          <td style="font-size:0.82rem;color:var(--text-muted);">${s.department}</td>
          <td style="text-align:center;">${s.publications}</td>
          <td style="text-align:center;">${s.hIndex}</td>
          <td style="white-space:nowrap;">
            <button class="action-btn edit" title="Tahrirlash" onclick="editScholar(${s.id})">✏️</button>
            <button class="action-btn delete" title="O'chirish" onclick="deleteScholar(${s.id})">🗑️</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}

function openScholarForm(scholar = null) {
  document.getElementById('scholarEditId').value = scholar ? scholar.id : '';
  document.getElementById('scholarFormTitle').textContent = scholar ? '✏️ Olimni tahrirlash' : '👨‍🔬 Yangi olim qo\'shish';
  document.getElementById('scholarFormSubtitle').textContent = scholar ? 'Ma\'lumotlarni o\'zgartiring' : 'Olim ma\'lumotlarini kiriting';
  document.getElementById('scholarFormName').value = scholar ? scholar.name : '';
  document.getElementById('scholarFormDegree').value = scholar ? scholar.title : '';
  document.getElementById('scholarFormDept').value = scholar ? scholar.department : '';
  document.getElementById('scholarFormEmail').value = scholar ? scholar.email : '';
  document.getElementById('scholarFormPubs').value = scholar ? scholar.publications : 0;
  document.getElementById('scholarFormHindex').value = scholar ? scholar.hIndex : 0;
  document.getElementById('scholarFormFields').value = scholar ? scholar.fields.join(', ') : '';
  document.getElementById('scholarFormBio').value = scholar ? scholar.bio : '';
  document.getElementById('scholarFormModal').classList.add('active');
}

function closeScholarForm() { document.getElementById('scholarFormModal').classList.remove('active'); }

function editScholar(id) {
  const scholars = getData('scholars');
  const s = scholars.find(x => x.id === id);
  if (s) openScholarForm(s);
}

function saveScholar(e) {
  e.preventDefault();
  const editId = document.getElementById('scholarEditId').value;
  const scholars = getData('scholars');
  const scholarData = {
    name: document.getElementById('scholarFormName').value.trim(),
    title: document.getElementById('scholarFormDegree').value.trim(),
    department: document.getElementById('scholarFormDept').value.trim(),
    email: document.getElementById('scholarFormEmail').value.trim(),
    publications: parseInt(document.getElementById('scholarFormPubs').value) || 0,
    hIndex: parseInt(document.getElementById('scholarFormHindex').value) || 0,
    fields: document.getElementById('scholarFormFields').value.split(',').map(f => f.trim()).filter(f => f),
    bio: document.getElementById('scholarFormBio').value.trim(),
    image: ''
  };

  if (editId) {
    const idx = scholars.findIndex(s => s.id === parseInt(editId));
    if (idx !== -1) {
      scholarData.id = parseInt(editId);
      scholars[idx] = scholarData;
      showToast("Olim ma'lumotlari muvaffaqiyatli tahrirlandi!", 'success');
    }
  } else {
    scholarData.id = Date.now();
    scholars.push(scholarData);
    showToast("Yangi olim muvaffaqiyatli qo'shildi!", 'success');
  }

  setData('scholars', scholars);
  closeScholarForm();
  renderScholarsTable();
  updateAdminStats();
}

function deleteScholar(id) {
  const scholars = getData('scholars');
  const s = scholars.find(x => x.id === id);
  showConfirm(`"${s?.name}" olimini o'chirishni xohlaysizmi?`, () => {
    setData('scholars', scholars.filter(x => x.id !== id));
    renderScholarsTable();
    updateAdminStats();
    showToast("Olim o'chirildi", 'info');
  });
}

// ===== SITE SETTINGS =====
function loadSiteSettingsForm() {
  const s = getData('site_settings');
  if (!s || Array.isArray(s)) return;
  document.getElementById('setHeroTitle').value = s.heroTitle || '';
  document.getElementById('setHeroSubtitle').value = s.heroSubtitle || '';
  document.getElementById('setStat1Label').value = s.stat1Title || '';
  document.getElementById('setStat1Val').value = s.stat1Value || 0;
  document.getElementById('setStat2Label').value = s.stat2Title || '';
  document.getElementById('setStat2Val').value = s.stat2Value || 0;
  document.getElementById('setStat3Label').value = s.stat3Title || '';
  document.getElementById('setStat3Val').value = s.stat3Value || 0;
  document.getElementById('setStat4Label').value = s.stat4Title || '';
  document.getElementById('setStat4Val').value = s.stat4Value || 0;
  document.getElementById('setContactPhone').value = s.contactPhone || '';
  document.getElementById('setContactEmail').value = s.contactEmail || '';
  document.getElementById('setContactAddress').value = s.contactAddress || '';
}

function saveSiteSettings(e) {
  e.preventDefault();
  const s = {
    heroTitle: document.getElementById('setHeroTitle').value,
    heroSubtitle: document.getElementById('setHeroSubtitle').value,
    stat1Title: document.getElementById('setStat1Label').value,
    stat1Value: parseInt(document.getElementById('setStat1Val').value) || 0,
    stat2Title: document.getElementById('setStat2Label').value,
    stat2Value: parseInt(document.getElementById('setStat2Val').value) || 0,
    stat3Title: document.getElementById('setStat3Label').value,
    stat3Value: parseInt(document.getElementById('setStat3Val').value) || 0,
    stat4Title: document.getElementById('setStat4Label').value,
    stat4Value: parseInt(document.getElementById('setStat4Val').value) || 0,
    contactPhone: document.getElementById('setContactPhone').value,
    contactEmail: document.getElementById('setContactEmail').value,
    contactAddress: document.getElementById('setContactAddress').value
  };
  localStorage.setItem('uzr_site_settings', JSON.stringify(s));
  showToast("Sayt sozlamalari muvaffaqiyatli saqlandi!", 'success');
}

// ===== USERS =====
function renderUsers() {
  const users = getData('users');
  const container = document.getElementById('usersContainer');
  if (users.length === 0) {
    container.innerHTML = `<div class="glass-card" style="padding:40px;text-align:center;"><div style="font-size:3rem;margin-bottom:12px;">👥</div><p style="color:var(--text-muted);">Foydalanuvchilar mavjud emas</p></div>`;
    return;
  }
  container.innerHTML = `
    <div class="glass-card" style="padding:24px;overflow-x:auto;">
      <table class="admin-table">
        <thead><tr>
          <th>#</th><th>Ism</th><th>Email</th><th>Telefon</th><th>Ro'yxatdan o'tgan</th><th>Amallar</th>
        </tr></thead>
        <tbody>
          ${users.map((u, i) => `<tr>
            <td>${i + 1}</td>
            <td style="font-weight:600;">${u.name}</td>
            <td style="color:var(--accent-gold);">${u.email}</td>
            <td>${u.phone || '-'}</td>
            <td style="color:var(--text-muted);">${new Date(u.registeredAt).toLocaleDateString('uz-UZ')}</td>
            <td><button class="action-btn delete" title="O'chirish" onclick="deleteUser(${u.id})">🗑️</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function deleteUser(id) {
  const users = getData('users');
  const u = users.find(x => x.id === id);
  showConfirm(`"${u?.name}" foydalanuvchisini o'chirishni xohlaysizmi?`, () => {
    setData('users', users.filter(x => x.id !== id));
    renderUsers();
    updateAdminStats();
    showToast("Foydalanuvchi o'chirildi", 'info');
  });
}

// ===== MESSAGES =====
function renderMessages() {
  const messages = getData('messages');
  const container = document.getElementById('messagesContainer');
  if (messages.length === 0) {
    container.innerHTML = `<div class="glass-card" style="padding:40px;text-align:center;"><div style="font-size:3rem;margin-bottom:12px;">📩</div><p style="color:var(--text-muted);">Xabarlar mavjud emas</p></div>`;
    return;
  }
  container.innerHTML = messages.sort((a, b) => new Date(b.date) - new Date(a.date)).map((m, i) => `
    <div class="order-card">
      <div class="order-header">
        <span style="font-weight:700;">${m.name}</span>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="color:var(--text-muted);font-size:0.82rem;">${new Date(m.date).toLocaleString('uz-UZ')}</span>
          <button class="action-btn delete" title="O'chirish" onclick="deleteMessage(${i})">🗑️</button>
        </div>
      </div>
      <div style="font-size:0.85rem;color:var(--accent-gold);margin-bottom:6px;">${m.email}</div>
      <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px;">Mavzu: ${m.subject}</div>
      <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.6;">${m.message}</p>
    </div>
  `).join('');
}

function deleteMessage(index) {
  showConfirm("Bu xabarni o'chirishni xohlaysizmi?", () => {
    const messages = getData('messages');
    messages.splice(index, 1);
    setData('messages', messages);
    renderMessages();
    showToast("Xabar o'chirildi", 'info');
  });
}

// ===== THEMES & MENUS =====
function loadThemeSettings() {
  // Sync the theme inputs with what is saved or default
  let theme = null;
  const rawTheme = localStorage.getItem('uzr_theme');
  if (rawTheme) theme = JSON.parse(rawTheme);
  if (!theme || Array.isArray(theme)) theme = DEFAULT_THEME;

  const bP = document.getElementById('themeBgPrimary');
  const bS = document.getElementById('themeBgSecondary');
  const aG = document.getElementById('themeAccentGold');
  const aT = document.getElementById('themeAccentTeal');

  bP.value = theme.bgPrimary || "#0a0e27";
  bS.value = theme.bgSecondary || "#111638";
  aG.value = theme.accentGold || "#f0c040";
  aT.value = theme.accentTeal || "#00d4aa";

  document.getElementById('themeBgPrimaryText').value = bP.value;
  document.getElementById('themeBgSecondaryText').value = bS.value;
  document.getElementById('themeAccentGoldText').value = aG.value;
  document.getElementById('themeAccentTealText').value = aT.value;

  // Add listeners to update text fields on color pick
  bP.oninput = (e) => document.getElementById('themeBgPrimaryText').value = e.target.value;
  bS.oninput = (e) => document.getElementById('themeBgSecondaryText').value = e.target.value;
  aG.oninput = (e) => document.getElementById('themeAccentGoldText').value = e.target.value;
  aT.oninput = (e) => document.getElementById('themeAccentTealText').value = e.target.value;

  // Apply themes real-time to the admin panel mostly for preview
  applyThemeColors(theme);
}

function applyThemeColors(theme) {
  const root = document.documentElement;
  root.style.setProperty('--bg-primary', theme.bgPrimary);
  root.style.setProperty('--bg-secondary', theme.bgSecondary);
  root.style.setProperty('--bg-glass', hexToRgba(theme.bgSecondary, 0.7));
  root.style.setProperty('--border-glass', hexToRgba(theme.accentGold, 0.15));
  root.style.setProperty('--accent-gold', theme.accentGold);
  root.style.setProperty('--accent-teal', theme.accentTeal);
  root.style.setProperty('--accent-purple', theme.accentPurple || '#a78bfa');
}

function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; }
  else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
  return `rgba(${+r},${+g},${+b},${alpha})`;
}

function saveThemeSettings(e) {
  e.preventDefault();
  const theme = {
    bgPrimary: document.getElementById('themeBgPrimary').value,
    bgSecondary: document.getElementById('themeBgSecondary').value,
    accentGold: document.getElementById('themeAccentGold').value,
    accentTeal: document.getElementById('themeAccentTeal').value,
    accentPurple: "#a78bfa" // Default
  };
  localStorage.setItem('uzr_theme', JSON.stringify(theme));
  showToast("Dizayn o'zgarishlari saqlandi!", 'success');
  applyThemeColors(theme);
}

function resetThemeDefaults() {
  showConfirm("Ranglarni dastlabki holatga qaytarasizmi?", () => {
    localStorage.setItem('uzr_theme', JSON.stringify(DEFAULT_THEME));
    loadThemeSettings();
    showToast("Standart ranglar tiklandi", 'success');
  });
}

// Menus
function renderMenus() {
  let menus = localStorage.getItem('uzr_menus');
  if (menus) menus = JSON.parse(menus);
  if (!menus || !Array.isArray(menus)) menus = DEFAULT_MENUS;
  
  const container = document.getElementById('menusContainer');
  if (menus.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">Menyular yo'q</p>`;
    return;
  }

  container.innerHTML = menus.map((m, i) => `
    <div class="menu-item-row" data-index="${i}">
      <span style="color:var(--text-muted); cursor:move;">☰</span>
      <input type="text" value="${m.text}" onchange="updateMenuText(${i}, this.value)" placeholder="Havola nomi">
      <input type="text" value="${m.url}" onchange="updateMenuUrl(${i}, this.value)" placeholder="Manzil (URL)">
      <button class="action-btn delete" onclick="deleteMenu(${i})">🗑️</button>
    </div>
  `).join('');
}

function getMenus() {
  let menus = localStorage.getItem('uzr_menus');
  return menus ? JSON.parse(menus) : DEFAULT_MENUS;
}

function updateMenuText(idx, val) {
  const menus = getMenus();
  if (menus[idx]) { menus[idx].text = val; localStorage.setItem('uzr_menus', JSON.stringify(menus)); }
}

function updateMenuUrl(idx, val) {
  const menus = getMenus();
  if (menus[idx]) { menus[idx].url = val; localStorage.setItem('uzr_menus', JSON.stringify(menus)); }
}

function addMenuItem(e) {
  e.preventDefault();
  const text = document.getElementById('newMenuText').value.trim();
  const url = document.getElementById('newMenuUrl').value.trim();
  if (!text || !url) return;
  const menus = getMenus();
  menus.push({ id: Date.now(), text, url });
  localStorage.setItem('uzr_menus', JSON.stringify(menus));
  document.getElementById('newMenuText').value = '';
  document.getElementById('newMenuUrl').value = '';
  renderMenus();
  showToast("Menyu qo'shildi", 'success');
}

function deleteMenu(idx) {
  const menus = getMenus();
  menus.splice(idx, 1);
  localStorage.setItem('uzr_menus', JSON.stringify(menus));
  renderMenus();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initializeData(); // from data.js
  if (localStorage.getItem('uzr_admin_logged') === 'true') {
    isAdminLoggedIn = true;
    showDashboard();
  }

  // Tab switching
  document.getElementById('adminTabs').addEventListener('click', (e) => {
    if (!e.target.classList.contains('admin-tab')) return;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + e.target.dataset.panel)?.classList.add('active');
  });

  // Order filter
  document.getElementById('orderFilters')?.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-tab')) return;
    document.querySelectorAll('#orderFilters .filter-tab').forEach(t => t.classList.remove('active'));
    e.target.classList.add('active');
    currentOrderFilter = e.target.dataset.status;
    renderOrders(currentOrderFilter);
  });
});
