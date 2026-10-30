const CATEGORY_NAMES = { all: 'الكل', server: 'تصميم سيرفرات', bots: 'بوتات', protection: 'حماية وإدارة' };
const BADGE_COLORS = { popular: 'bg-red-500/20 text-red-400 border-red-500/20', bot: 'bg-red-500/20 text-red-400 border-red-500/20', custom: 'bg-red-500/20 text-red-400 border-red-500/20', protection: 'bg-red-500/20 text-red-400 border-red-500/20' };

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

async function loadProducts() {
  try {
    const res = await fetch('/api/products?password=7so-admin-secret');
    if (res.ok) { const data = await res.json(); products = data; }
    else {
      const fallback = { "products": [{"id":1,"name":"تصميم سيرفر دسكورد احترافي","description":"تصميم كامل للسيرفر مع رتب، رومانات تنظيمية، حماية متقدمة، وبوتات أساسية جاهزة","category":"server","badge":"الأكثر طلبا","badgeType":"popular","price":"طلب خاص","features":[],"icon":"fa-brands fa-discord","hasImage":false,"imageUrl":null},{"id":2,"name":"بوت برودكاست","description":"ارتقِ بإدارة سيرفرك مع بوت برودكاست احترافي، مصمم لإرسال الإعلانات والتنبيهات بسرعة وسهولة. آمن، مستقر، ويعمل بكفاءة عالية على السيرفرات الصغيرة والكبيرة.","category":"bots","badge":"🚀 بوت احترافي","badgeType":"bot","price":"طلب خاص","features":[{"text":"Python","icon":"🐍"},{"text":"إرسال للجميع","icon":"🚀"},{"text":"ملكك بالكامل","icon":"👑"},{"text":"معرفة الـ Ping","icon":"📡"},{"text":"آمن ومستقر","icon":"🔒"},{"text":"قابل للتطوير","icon":"🔄"}],"icon":null,"hasImage":true,"imageUrl":"assets/broadcast-bot.png"},{"id":3,"name":"برمجة بوت دسكورد مخصص","description":"برمجة بوت بلغة بايثون أو جافاسكريبت حسب طلبك (تذاكر، ترحيب، حماية، أو ألعاب)","category":"bots","badge":"برمجة خاصة","badgeType":"custom","price":"تواصل للاتفاق","features":[{"text":"Python","icon":"🐍"},{"text":"JavaScript","icon":"⚡"},{"text":"مخصص","icon":"🔧"}],"icon":"fa-solid fa-robot","hasImage":false,"imageUrl":null},{"id":4,"name":"حزم الحماية والإدارة","description":"أنظمة حماية ضد التخريب (Anti-Nuke)، تفعيل نظام التحقق التلقائي، وإدارة الرتب الحساسة","category":"protection","badge":"حماية وإدارة","badgeType":"protection","price":"استشارة مجانية","features":[{"text":"Anti-Nuke","icon":"🛡️"},{"text":"تحقق تلقائي","icon":"✅"},{"text":"إدارة الرتب","icon":"👑"}],"icon":"fa-solid fa-shield-halved","hasImage":false,"imageUrl":null}] };
      products = fallback.products;
    }
  } catch(e) { /* keep empty array */ }
  renderProducts();
}

function escHtml(s) { return String(s).replace(/&/g,'&').replace(/</g,'<').replace(/>/g,'>').replace(/"/g,'"'); }

function createProductCard(p, i) {
  const delay = Math.min(i + 1, 4);
  const bc = BADGE_COLORS[p.badgeType] || BADGE_COLORS.popular;

  const card = document.createElement('div');
  card.className = 'reveal cat-' + p.category + ' cat-item reveal-delay-' + delay + ' relative bg-cardBg border border-gray-800/80 rounded-2xl p-5 glow-hover transition-all duration-400 overflow-hidden flex flex-col';
  card.dataset.category = p.category;
  card.dataset.id = p.id;

  // Num badge
  const numBadge = document.createElement('span');
  numBadge.className = 'num-badge';
  numBadge.textContent = String(p.id).padStart(2, '0');
  card.appendChild(numBadge);

  // Card accent
  const accent = document.createElement('div');
  accent.className = 'card-accent';
  card.appendChild(accent);

  // Content wrapper
  const content = document.createElement('div');
  content.className = 'relative z-10 flex flex-col flex-grow';

  // Image or icon
  const mediaDiv = document.createElement('div');
  if (p.hasImage && p.imageUrl) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'w-full h-44 rounded-xl overflow-hidden mb-4 border border-red-500/20 bg-black/40';
    const img = document.createElement('img');
    img.src = p.imageUrl;
    img.alt = p.name;
    img.className = 'w-full h-full object-contain';
    img.loading = 'lazy';
    imgWrap.appendChild(img);
    mediaDiv.appendChild(imgWrap);
  } else {
    mediaDiv.className = 'w-14 h-14 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mb-4';
    const icon = document.createElement('i');
    icon.className = (p.icon || 'fa-solid fa-robot') + ' text-2xl text-red-400 icon-bounce';
    mediaDiv.appendChild(icon);
  }
  content.appendChild(mediaDiv);

  // Badge
  const badgeDiv = document.createElement('div');
  badgeDiv.className = 'mb-3';
  const badgeSpan = document.createElement('span');
  badgeSpan.className = bc + ' text-xs px-3 py-1 rounded-full font-bold border';
  badgeSpan.textContent = p.badge;
  badgeDiv.appendChild(badgeSpan);
  content.appendChild(badgeDiv);

  // Title
  const title = document.createElement('h3');
  title.className = 'text-lg font-bold mb-2';
  title.textContent = p.name;
  content.appendChild(title);

  // Description
  const desc = document.createElement('p');
  desc.className = 'text-gray-400 text-sm mb-4 leading-relaxed flex-grow';
  desc.textContent = p.description;
  content.appendChild(desc);

  // Features
  if (p.features && p.features.length > 0) {
    const featuresDiv = document.createElement('div');
    featuresDiv.className = 'flex flex-wrap gap-2 mb-4';
    p.features.forEach(f => {
      const span = document.createElement('span');
      span.className = 'text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-lg border border-gray-700';
      span.textContent = f.icon + ' ' + f.text;
      featuresDiv.appendChild(span);
    });
    content.appendChild(featuresDiv);
  }

  // Footer
  const footer = document.createElement('div');
  footer.className = 'flex items-center justify-between pt-4 border-t border-gray-800/60 mt-auto';

  const priceDiv = document.createElement('div');
  const priceLabel = document.createElement('span');
  priceLabel.className = 'text-gray-500 text-xs';
  priceLabel.textContent = 'السعر';
  const priceValue = document.createElement('div');
  priceValue.className = 'text-red-400 font-black text-lg';
  priceValue.textContent = p.price;
  priceDiv.appendChild(priceLabel);
  priceDiv.appendChild(priceValue);
  footer.appendChild(priceDiv);

  const orderBtn = document.createElement('button');
  orderBtn.className = 'btn-shine bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2';
  orderBtn.onclick = function() { openOrderModal(p.name); };
  const orderIcon = document.createElement('i');
  orderIcon.className = 'fa-brands fa-discord';
  orderBtn.appendChild(orderIcon);
  orderBtn.appendChild(document.createTextNode(' اطلب الآن'));
  footer.appendChild(orderBtn);

  content.appendChild(footer);
  card.appendChild(content);

  return card;
}

function renderProducts(containerSelector) {
  const container = document.querySelector(containerSelector || '#productsGrid');
  if (!container) return;

  const filtered = filterCurrentProducts();

  if (filtered.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'col-span-full text-center text-gray-500 py-16';
    const emptyIcon = document.createElement('i');
    emptyIcon.className = 'fa-solid fa-box-open text-5xl mb-4 opacity-30 block';
    const emptyP = document.createElement('p');
    emptyP.className = 'text-lg';
    emptyP.textContent = 'لا توجد منتجات في هذا التصنيف';
    emptyDiv.appendChild(emptyIcon);
    emptyDiv.appendChild(emptyP);
    container.appendChild(emptyDiv);
    return;
  }

  // Clear and rebuild
  container.innerHTML = '';
  filtered.forEach((p, i) => {
    const card = createProductCard(p, i);
    container.appendChild(card);
  });

  // Observe reveals
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  container.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  updateCartUI();
}

function filterCurrentProducts() {
  const activeBtn = document.querySelector('.cat-btn.active');
  const cat = activeBtn ? activeBtn.dataset.cat : 'all';
  if (cat === 'all') return products;
  return products.filter(p => p.category === cat);
}

function initCategoryFilter() {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts();
    });
  });
}

function openOrderModal(productName) {
  const el = document.getElementById('modalProductName'); if (el) el.textContent = productName;
  const modal = document.getElementById('orderModal'); if (modal) modal.classList.remove('hidden');
}
function closeOrderModal() { const m = document.getElementById('orderModal'); if (m) m.classList.add('hidden'); }

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  if (cart.length > 0) { countEl.classList.remove('hidden'); countEl.textContent = cart.length; } else { countEl.classList.add('hidden'); }
  renderCartItems();
}

function renderCartItems() {
  const c = document.getElementById('cartItems'), t = document.getElementById('cartTotal');
  if (!c) return;
  if (cart.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'text-center text-gray-500 py-12';
    const emptyIcon = document.createElement('i');
    emptyIcon.className = 'fa-solid fa-cart-shopping text-6xl mb-4 opacity-30';
    const emptyP = document.createElement('p');
    emptyP.textContent = 'السلة فاضية';
    emptyDiv.appendChild(emptyIcon);
    emptyDiv.appendChild(emptyP);
    c.appendChild(emptyDiv);
    if (t) t.textContent = 'طلب خاص'; return;
  }
  c.innerHTML = '';
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-4 bg-gray-800/50 rounded-xl mb-3 border border-gray-700/50';

    const info = document.createElement('div');
    info.className = 'flex-1';
    const name = document.createElement('h4');
    name.className = 'font-bold text-white';
    name.textContent = item.name;
    const price = document.createElement('p');
    price.className = 'text-red-400 text-sm font-bold mt-1';
    price.textContent = item.price;
    info.appendChild(name);
    info.appendChild(price);
    div.appendChild(info);

    const delBtn = document.createElement('button');
    delBtn.className = 'text-gray-500 hover:text-red-400 transition mr-3';
    delBtn.onclick = function() { removeFromCart(index); };
    const delIcon = document.createElement('i');
    delIcon.className = 'fa-solid fa-trash';
    delBtn.appendChild(delIcon);
    div.appendChild(delBtn);

    c.appendChild(div);
  });
  if (t) t.textContent = 'طلب خاص';
}

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  const btn = event && event.target ? event.target.closest('button') : null;
  if (btn) {
    const origHTML = btn.innerHTML;
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fa-solid fa-check';
    btn.innerHTML = '';
    btn.appendChild(checkIcon);
    btn.appendChild(document.createTextNode(' تمت الإضافة'));
    btn.classList.add('!bg-green-600');
    setTimeout(() => {
      btn.innerHTML = origHTML;
      btn.classList.remove('!bg-green-600');
    }, 1500);
  }
}
function removeFromCart(i) { cart.splice(i, 1); localStorage.setItem('cart', JSON.stringify(cart)); updateCartUI(); }
function toggleCart() {
  const m = document.getElementById('cartModal'), p = document.getElementById('cartPanel');
  if (!m || !p) return;
  m.classList.toggle('hidden');
  setTimeout(() => { p.classList.toggle('translate-x-full'); p.classList.toggle('translate-x-0'); }, 10);
}
function checkout() {
  if (cart.length === 0) { alert('السلة فاضية! أضف منتجات أولاَ'); return; }
  toggleCart();
  openOrderModal(cart.map(item => item.name).join('، '));
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', () => { loadProducts(); initCategoryFilter(); }); }
else { loadProducts(); initCategoryFilter(); }