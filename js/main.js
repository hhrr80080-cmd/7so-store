const DEFAULT_PRODUCTS = [
  { id: 1, name: "تصميم سيرفر دسكورد احترافي", description: "تصميم كامل للسيرفر مع رتب، رومانات تنظيمية، حماية متقدمة، وبوتات أساسية جاهزة", category: "server", badge: "الأكثر طلبا", badgeType: "popular", price: "طلب خاص", features: [], icon: "fa-brands fa-discord", hasImage: false, imageUrl: null },
  { id: 2, name: "بوت برودكاست", description: "ارتقِ بإدارة سيرفرك مع بوت برودكاست احترافي، مصمم لإرسال الإعلانات والتنبيهات بسرعة وسهولة. آمن، مستقر، ويعمل بكفاءة عالية على السيرفرات الصغيرة والكبيرة.", category: "bots", badge: "🚀 بوت احترافي", badgeType: "bot", price: "طلب خاص", features: [{ text: "Python", icon: "🐍" }, { text: "إرسال للجميع", icon: "🚀" }, { text: "ملكك بالكامل", icon: "👑" }, { text: "معرفة الـ Ping", icon: "📡" }, { text: "آمن ومستقر", icon: "🔒" }, { text: "قابل للتطوير", icon: "🔄" }], icon: null, hasImage: true, imageUrl: "assets/broadcast-bot.png" },
  { id: 3, name: "برمجة بوت دسكورد مخصص", description: "برمجة بوت بلغة بايثون أو جافاسكريبت حسب طلبك (تذاكر، ترحيب، حماية، أو ألعاب)", category: "bots", badge: "برمجة خاصة", badgeType: "custom", price: "تواصل للاتفاق", features: [{ text: "Python", icon: "🐍" }, { text: "JavaScript", icon: "⚡" }, { text: "مخصص", icon: "🔧" }], icon: "fa-solid fa-robot", hasImage: false, imageUrl: null },
  { id: 4, name: "حزم الحماية والإدارة", description: "أنظمة حماية ضد التخريب (Anti-Nuke)، تفعيل نظام التحقق التلقائي، وإدارة الرتب الحساسة", category: "protection", badge: "حماية وإدارة", badgeType: "protection", price: "استشارة مجانية", features: [{ text: "Anti-Nuke", icon: "🛡️" }, { text: "تحقق تلقائي", icon: "✅" }, { text: "إدارة الرتب", icon: "👑" }], icon: "fa-solid fa-shield-halved", hasImage: false, imageUrl: null },
  { id: 5, name: "ضبط سيرفر دسكورد كامل", description: "خدمة شاملة لضبط سيرفرك من الصفر - تصميم وتنظيم وحماية كاملة لتكون جاهزاً للاستخدام الاحترافي من أول يوم", category: "server", badge: "✨ ضبط كامل", badgeType: "popular", price: "حسب الطلب", features: [{ text: "تصميم رومات فخم", icon: "🎨" }, { text: "إعداد البوتات والأنظمة", icon: "⚙️" }, { text: "حماية قوية ضد التخريب", icon: "🛡️" }, { text: "تنظيم الرتب والصلاحيات", icon: "👥" }, { text: "نظام تذاكر ودعم فني", icon: "💬" }, { text: "سجلات وإحصائيات متقدمة", icon: "📊" }, { text: "نظام ترحيب ذكي", icon: "🤝" }, { text: "إيموجيات وستيكرات مخصصة", icon: "🎉" }, { text: "ربط السوشال ميديا", icon: "🔗" }, { text: "رومات ألعاب ومجتمع", icon: "🎮" }, { text: "تحسين الشكل العام", icon: "✨" }], icon: "fa-solid fa-sliders", hasImage: false, imageUrl: null }
];

const CAT_NAMES = { server: "Server", bots: "Bots", protection: "Protection" };
let products = [];
let features = [];
let deleteTargetId = null;
let settings = {};
let API_BASE = '/api/products';

function api(method, body, password) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, API_BASE + (password ? '?password=' + password : ''), true);
    xhr.onload = () => resolve({ status: xhr.status, data: JSON.parse(xhr.responseText) });
    xhr.onerror = () => resolve({ status: 0, data: { error: 'Network error' } });
    if (body && typeof body === 'object') xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
  });
}

async function loadData() {
  const res = await api('GET');
  if (!res.error) products = res.data || [];
  else products = DEFAULT_PRODUCTS;
  renderAll();
}

function renderAll() {
  renderProducts();
  updateStats();
  loadSettings();
}

function updateStats() {
  const set = document.getElementById('statTotal');
  const sb = document.getElementById('statServer');
  const ss = document.getElementById('statBots');
  const sp = document.getElementById('statProtection');
  if (set) set.textContent = products.length;
  if (sb) sb.textContent = products.filter(p => p.category === 'server').length;
  if (ss) ss.textContent = products.filter(p => p.category === 'bots').length;
  if (sp) sp.textContent = products.filter(p => p.category === 'protection').length;
}

function loadSettings() {
  const n = document.getElementById('storeName');
  const d = document.getElementById('discordLink');
  if (n) n.value = settings.storeName || '7SO STORE';
  if (d) d.value = settings.discordLink || 'https://discord.gg/gupu65sVck';
}

async function saveSettings() {
  settings = {
    storeName: (document.getElementById('storeName') || {}).value || '7SO STORE',
    discordLink: (document.getElementById('discordLink') || {}).value || 'https://discord.gg/gupu65sVck'
  };
  await api('POST', settings, '7so-admin-secret');
  localStorage.setItem('7so_settings', JSON.stringify(settings));
  showToast('Saved');
}

function renderProducts() {
  let container = document.getElementById('productsList');
  if (!container) container = document.getElementById('productsGrid');
  if (!container) return;
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const header = document.createElement('div');
    header.className = 'flex items-start justify-between mb-3';

    const right = document.createElement('div');
    right.className = 'flex items-center gap-3';

    if (p.hasImage && p.imageUrl) {
      const img = document.createElement('img');
      img.src = p.imageUrl;
      img.className = 'w-12 h-12 rounded-xl object-cover border border-gray-700';
      right.appendChild(img);
    } else {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center';
      const icon = document.createElement('i');
      icon.className = (p.icon || 'fa-solid fa-robot') + ' text-red-400';
      iconDiv.appendChild(icon);
      right.appendChild(iconDiv);
    }

    const info = document.createElement('div');
    const title = document.createElement('h4');
    title.className = 'font-bold text-white';
    title.textContent = p.name;
    const cat = document.createElement('span');
    cat.className = 'text-xs text-gray-500';
    cat.textContent = CAT_NAMES[p.category] || p.category;
    info.appendChild(title);
    info.appendChild(cat);
    right.appendChild(info);
    header.appendChild(right);

    const price = document.createElement('span');
    price.className = 'text-red-400 font-bold text-sm';
    price.textContent = p.price;
    header.appendChild(price);
    card.appendChild(header);

    const desc = document.createElement('p');
    desc.className = 'text-gray-400 text-xs mb-3 line-clamp-2';
    desc.textContent = p.description;
    card.appendChild(desc);

    if (p.features && p.features.length) {
      const featDiv = document.createElement('div');
      featDiv.className = 'flex flex-wrap gap-1 mb-3';
      p.features.forEach(f => {
        const s = document.createElement('span');
        s.className = 'text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700';
        s.textContent = f.icon + ' ' + f.text;
        featDiv.appendChild(s);
      });
      card.appendChild(featDiv);
    }

    const btnDiv = document.createElement('div');
    btnDiv.className = 'flex gap-2 pt-3 border-t border-gray-800/50';

    const editBtn = document.createElement('button');
    editBtn.className = 'flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-bold py-2 rounded-xl transition';
    editBtn.textContent = 'Edit';
    editBtn.onclick = function() { editProduct(p.id); };

    const delBtn = document.createElement('button');
    delBtn.className = 'flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold py-2 rounded-xl transition';
    delBtn.textContent = 'Delete';
    delBtn.onclick = function() { deleteProduct(p.id); };

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(delBtn);
    card.appendChild(btnDiv);

    container.appendChild(card);
  });
  updateStats();
}

async function openAddModal() {
  document.getElementById('modalTitle').textContent = 'Add Product';
  document.getElementById('editProductId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodDesc').value = '';
  document.getElementById('prodCategory').value = 'server';
  document.getElementById('prodPrice').value = 'Custom';
  document.getElementById('prodBadge').value = '';
  document.getElementById('prodIconType').value = 'fa-brands fa-discord';
  document.getElementById('prodImageUrl').value = '';
  document.getElementById('imageUrlField').classList.add('hidden');
  features = [];
  renderFeatures();
  document.getElementById('productModal').classList.remove('hidden');
}

async function editProduct(id) {
  const res = await api('GET', null, '7so-admin-secret');
  if (res.error) { alert('Could not load products'); return; }
  const p = res.data.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('editProductId').value = id;
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodDesc').value = p.description;
  document.getElementById('prodCategory').value = p.category;
  document.getElementById('prodPrice').value = p.price;
  document.getElementById('prodBadge').value = p.badge || '';
  document.getElementById('prodIconType').value = p.hasImage ? 'none' : (p.icon || 'fa-brands fa-discord');
  toggleIconInput();
  document.getElementById('prodImageUrl').value = p.imageUrl || '';
  features = p.features ? p.features.slice() : [];
  renderFeatures();
  document.getElementById('productModal').classList.remove('hidden');
}

function toggleIconInput() {
  const val = document.getElementById('prodIconType').value;
  document.getElementById('imageUrlField').classList.toggle('hidden', val !== 'none');
}

function addFeature() {
  const text = document.getElementById('featureText').value.trim();
  const icon = document.getElementById('featureIcon').value.trim();
  if (!text) return;
  features.push({ text, icon: icon || '*' });
  document.getElementById('featureText').value = '';
  document.getElementById('featureIcon').value = '';
  renderFeatures();
}

function removeFeature(i) { features.splice(i, 1); renderFeatures(); }

function renderFeatures() {
  const container = document.getElementById('featuresList');
  if (!container) return;
  container.innerHTML = '';
  features.forEach((f, i) => {
    const span = document.createElement('span');
    span.className = 'feature-tag';
    span.textContent = f.icon + ' ' + f.text;
    const btn = document.createElement('button');
    btn.textContent = 'x';
    btn.onclick = function() { removeFeature(i); };
    span.appendChild(btn);
    container.appendChild(span);
  });
}

async function saveProduct() {
  const name = document.getElementById('prodName').value.trim();
  const desc = document.getElementById('prodDesc').value.trim();
  if (!name || !desc) { alert('Please fill name and description'); return; }
  const editId = document.getElementById('editProductId').value;
  const isImage = document.getElementById('prodIconType').value === 'none';
  const product = {
    id: editId ? parseInt(editId) : Date.now(),
    name, description: desc,
    category: document.getElementById('prodCategory').value,
    badge: document.getElementById('prodBadge').value.trim() || name.split(' ')[0],
    badgeType: document.getElementById('prodCategory').value,
    price: document.getElementById('prodPrice').value.trim() || 'Custom',
    features: features.slice(),
    icon: isImage ? null : document.getElementById('prodIconType').value,
    hasImage: isImage,
    imageUrl: isImage ? document.getElementById('prodImageUrl').value.trim() : null
  };
  if (editId) {
    const idx = products.findIndex(p => p.id === parseInt(editId));
    if (idx >= 0) products[idx] = product;
  } else {
    products.push(product);
  }
  await api('POST', products, '7so-admin-secret');
  localStorage.setItem('7so_products', JSON.stringify(products));
  closeModal();
  renderProducts();
  showToast(editId ? 'Updated' : 'Added');
}

function closeModal() { document.getElementById('productModal').classList.add('hidden'); }

function deleteProduct(id) {
  deleteTargetId = id;
  const p = products.find(x => x.id === id);
  document.getElementById('deleteMsg').textContent = 'Delete "' + (p ? p.name : '') + '"?';
  document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() { document.getElementById('deleteModal').classList.add('hidden'); deleteTargetId = null; }

function confirmDelete() {
  if (deleteTargetId !== null) {
    products = products.filter(p => p.id !== deleteTargetId);
    localStorage.setItem('7so_products', JSON.stringify(products));
    renderProducts();
    showToast('Deleted');
  }
  closeDeleteModal();
}

function exportProducts() {
  const data = { products, settings };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported');
}

function importProducts(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.products) { products = data.products; localStorage.setItem('7so_products', JSON.stringify(products)); }
      if (data.settings) { settings = data.settings; localStorage.setItem('7so_settings', JSON.stringify(settings)); }
      renderAll();
      showToast('Imported');
    } catch(err) { alert('Invalid JSON'); }
  };
  reader.readAsText(file);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="' + tab + '"]').classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#ef4444;color:white;padding:0.75rem 1.5rem;border-radius:0.75rem;font-weight:bold;z-index:999;font-family:Cairo,sans-serif;';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

document.getElementById('addProductBtn').addEventListener('click', openAddModal);
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
document.getElementById('exportBtn').addEventListener('click', exportProducts);
document.getElementById('importFile').addEventListener('change', importProducts);
document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);
document.getElementById('addFeatureBtn').addEventListener('click', addFeature);
document.getElementById('prodIconType').addEventListener('change', toggleIconInput);
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function() { switchTab(this.dataset.tab); });
});
document.getElementById('productModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
document.getElementById('deleteModal').addEventListener('click', function(e) { if (e.target === this) closeDeleteModal(); });

loadData();