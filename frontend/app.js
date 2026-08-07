/* Wishlist now persists in localStorage (same 'sc_wish' key used on
   product.html) so items added on the homepage stay wishlisted when you
   navigate to a product page, and vice versa. */
async function loadWish() {
  const token = getToken();
  if (!token) return new Set(JSON.parse(localStorage.getItem('sc_wish') || '[]'));

  try {
    const res = await fetch("https://ShopNexa-backend.onrender.com/api/wishlist", { headers: authHeader() });
    const data = await res.json();
    return new Set(data.wishlist.map(p => p._id));
  } catch {
    return new Set();
  }
}

async function toggleWishBackend(id) {
  const token = getToken();
  if (!token) { window.location.href = "login.html"; return; }

  const method = wishlist.has(id) ? "DELETE" : "POST";
  await fetch(`http://localhost:5000/api/wishlist/${id}`, { method, headers: authHeader() });
}
let wishlist = new Set();
let compareSet = new Set();
let activeTab = "All";
let searchTerm = "";
let sortMode = "rec";
let products = [];

const grid = document.getElementById('prodGrid');
const resultCount = document.getElementById('resultCount');

/* ── Category groups for sidebar ──────────────────────────────────
   NOTE: 'key' values below match your HTML's data-cat="grp:xxx" prefixes
   and are assumed to match your backend's `category` field values
   (lowercase: fashion, beauty, electronics, kids, pets). If your actual
   category values are different, tell me and I'll adjust this list. */
const categoryGroups = [
  { group: 'Fashion', open: true, items: [
    { key: 'fashion', icon: '👗', label: 'Fashion' }
  ]},
  { group: 'Beauty & Personal Care', open: true, items: [
    { key: 'beauty', icon: '💄', label: 'Beauty & Personal Care' }
  ]},
  { group: 'Electronics & Home', open: true, items: [
    { key: 'electronics', icon: '💻', label: 'Electronics & Home' }
  ]},
  { group: 'Kids', open: true, items: [
    { key: 'kids', icon: '🧸', label: 'Kids' }
  ]},
  { group: 'Pets', open: true, items: [
    { key: 'pets', icon: '🐾', label: 'Pets' }
  ]}
];

/* ── Currency detection & formatting ─────────────────────────────── */
/* CURRENCIES, COUNTRY_CURRENCY, fetchLiveRates(), detectCountryCurrency(),
   and money() now live in currency.js (shared with product.html) — see
   that file for the currency/geo-IP logic. */

async function detectCurrency() {
  await Promise.allSettled([fetchLiveRates(), detectCountryCurrency()]);
  const badge = document.getElementById('ratesBadge');
  if (badge && ratesLoaded) { badge.textContent = '● live'; badge.style.color = '#4ade80'; }
  renderCurrencyPicker();
  render(products);
}

function renderCurrencyPicker() {
  const existing = document.getElementById('currencyPicker');
  if (existing) { existing.value = activeCurrency; return; }

  const nav = document.querySelector('.nav-actions');
  const sel = document.createElement('select');
  sel.id = 'currencyPicker';
  sel.title = 'Change currency';
  sel.style.cssText = 'background:var(--surface-2);color:var(--text);border:1px solid var(--border-mid);border-radius:9px;padding:7px 11px;font-size:12.5px;cursor:pointer;font-family:inherit;transition:border-color .18s;';
  Object.entries(CURRENCIES).forEach(([code, info]) => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = `${info.symbol} ${code}`;
    if (code === activeCurrency) opt.selected = true;
    sel.appendChild(opt);
  });
  sel.addEventListener('change', e => {
    activeCurrency = e.target.value;
    render(products);
  });

  const badge = document.createElement('span');
  badge.id = 'ratesBadge';
  badge.title = 'Exchange rate status';
  badge.style.cssText = 'font-size:10px;margin-left:4px;color:var(--text-muted);vertical-align:middle;';
  badge.textContent = ratesLoaded ? '● live' : '○ est.';
  if (ratesLoaded) badge.style.color = '#4ade80';

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'display:inline-flex;align-items:center;gap:2px;';
  wrapper.appendChild(sel);
  wrapper.appendChild(badge);
  nav.insertBefore(wrapper, nav.firstChild);
}

function matchesTab(p){
  if(activeTab === "All") return true;
  if(activeTab.startsWith("grp:")) return p.cat === activeTab.slice(4);
  return p.cat === activeTab;
}

function render(list) {
  const grid = document.getElementById("prodGrid");
  let filtered = (list || products).filter(p => matchesTab(p) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if(sortMode === "low") filtered = [...filtered].sort((a,b)=>a.price-b.price);
  if(sortMode === "high") filtered = [...filtered].sort((a,b)=>b.price-a.price);
  if(sortMode === "rating") filtered = [...filtered].sort((a,b)=>b.rating-a.rating);

  resultCount.textContent = filtered.length ? `Showing ${filtered.length} product${filtered.length>1?'s':''}` : 'No matches';

  if(filtered.length === 0){
grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="e-glyph">🔍</div>
      <div style="font-weight:600;margin-bottom:6px;">No products found</div>
      <div style="color:var(--text-muted);font-size:13px;margin-bottom:14px;">Try a different keyword, or browse all categories instead.</div>
      <button class="btn btn-ghost" onclick="document.getElementById('searchInput').value='';searchTerm='';setCategory('All');">Clear filters</button>
    </div>`;
        return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="card">
      <div class="thumb" style="background:linear-gradient(135deg, ${p.grad}); cursor:pointer;" onclick="location.href='product.html?id=${p.id}'">
        <span class="tag">${p.tag}</span>
        ${(() => {
          const lowest = p.sellerList && p.sellerList.length > 0 ? Math.min(...p.sellerList.map(s => s.price)) : p.price;
          const pct = p.was > lowest ? Math.round(((p.was - lowest) / p.was) * 100) : 0;
          return pct > 0 ? `<span class="discount-badge">-${pct}%</span>` : '';
        })()}
        <div class="wish ${wishlist.has(p.id)?'active':''}" onclick="event.stopPropagation(); toggleWish('${p.id}')">${wishlist.has(p.id)?'♥':'♡'}</div>
        ${p.glyph}
      </div>
      <div class="card-body">
        <div class="card-cat">${catLabel(p.cat)}</div>
        <div class="card-title" style="cursor:pointer;" onclick="location.href='product.html?id=${p.id}'">${p.name}</div>
        <div class="card-rating"><span class="star">★</span> <b>${p.rating}</b> <span style="color:var(--text-muted);">(${p.reviews.toLocaleString()}) · ${p.seller}</span></div>
        <div class="card-foot">
  <div>
  <span class="price-now">
    ${money(
      p.sellerList && p.sellerList.length > 0
        ? Math.min(...p.sellerList.map(s => s.price))
        : p.price
    )}
  </span>
  <span class="price-was">${money(p.was)}</span>
  <div class="store-badge">via ${p.seller}</div>
</div>
  <label class="compare-check">
    <input type="checkbox" ${compareSet.has(p.id)?'checked':''} onchange="toggleCompare('${p.id}')"> Compare
  </label>
</div>
${sellerTickerHTML(p)}
<button class="buy-btn" onclick="location.href='product.html?id=${p.id}'">View deal →</button>
      </div>
    </div>
  `).join('');
}
function bestSellerPrice(p) {
  if (!p.sellerList || p.sellerList.length === 0) return p.price;
  return Math.min(...p.sellerList.map(s => s.price));
}

function sellerTickerHTML(p) {
  if (!p.sellerList || p.sellerList.length === 0) return '';

  const sorted = [...p.sellerList].sort((a, b) => a.price - b.price);
  const lowest = sorted[0].price;

  return `
    <div class="seller-ticker">
      ${sorted.map(s => `
        <span class="ticker-chip ${s.price === lowest ? 'best' : ''}">
          ${s.name} <b>${money(s.price)}</b>
        </span>
      `).join('')}
    </div>
  `;
}
function catLabel(key){
  for(const grp of categoryGroups){
    const found = grp.items.find(it => it.key === key);
    if(found) return found.label;
  }
  return key;
}

async function toggleWish(id){
  wishlist.has(id) ? wishlist.delete(id) : wishlist.add(id);
  const wc = document.getElementById('wishCount');
  wc.textContent = wishlist.size;
  wc.style.display = wishlist.size ? 'flex' : 'none';
  render(products);
  await toggleWishBackend(id); // backend ko bhi update karo
}

function toggleCompare(id){
  if(compareSet.has(id)) compareSet.delete(id);
  else {
    if(compareSet.size >= 3){ showToast('You can compare up to 3 products at a time.', 'error'); render(products); return; }
    compareSet.add(id);
  }
  const tray = document.getElementById('compareTray');
  document.getElementById('cmpCount').textContent = compareSet.size;
  tray.classList.toggle('show', compareSet.size > 0);
  tray.style.display = compareSet.size > 0 ? 'flex' : 'none';
}

function clearCompare(){
  compareSet.clear();
  document.getElementById('compareTray').classList.remove('show');
  render(products);
}

function openCompare(){
  if(compareSet.size < 2){ showToast('Select at least 2 products to compare.', 'error'); return; }
  const items = products.filter(p => compareSet.has(p.id));
  const allSpecKeys = [...new Set(items.flatMap(p => Object.keys(p.specs)))];
  document.getElementById('modalBody').innerHTML = `
    <table class="cmp-table">
      <tr><th>Spec</th>${items.map(p=>`<th>${p.name}</th>`).join('')}</tr>
      <tr><td>Price</td>${items.map(p=>`<td class="pname">${money(p.price)}</td>`).join('')}</tr>
      <tr><td>Rating</td>${items.map(p=>`<td>★ ${p.rating} (${p.reviews})</td>`).join('')}</tr>
      ${allSpecKeys.map(k=>`<tr><td>${k}</td>${items.map(p=>`<td>${p.specs[k]||'—'}</td>`).join('')}</tr>`).join('')}
    </table>`;
  document.getElementById('modalOverlay').classList.add('show');
}
function closeCompare(){ document.getElementById('modalOverlay').classList.remove('show'); }

function renderSidebar(){
  const counts = {};
  products.forEach(p => counts[p.cat] = (counts[p.cat]||0) + 1);
  const total = products.length;

  let html = `<div class="side-item ${activeTab==='All'?'active':''}" data-tab="All"><span class="g">🗂️</span>All Products<span class="n">${total}</span></div>`;

  categoryGroups.forEach((grp, gi) => {
    html += `
      <div class="side-group ${grp.open ? '' : 'collapsed'}" data-group="${gi}">
        <div class="side-group-head" data-toggle="${gi}">${grp.group}<span class="arrow">▾</span></div>
        <div class="side-group-items">
          ${grp.items.map(it => `
            <div class="side-item ${activeTab===it.key?'active':''}" data-tab="${it.key}">
              <span class="g">${it.icon}</span>${it.label}<span class="n">${counts[it.key]||0}</span>
            </div>`).join('')}
        </div>
      </div>`;
  });

  document.getElementById('sidebarCats').innerHTML = html;

  document.querySelectorAll('.side-item').forEach(item => {
    item.addEventListener('click', () => { setCategory(item.dataset.tab); closeSidebar(); });
  });
  document.querySelectorAll('.side-group-head').forEach(head => {
    head.addEventListener('click', () => {
      head.closest('.side-group').classList.toggle('collapsed');
    });
  });
}

let searchDebounce;
document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value;
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(async () => {
    if (searchTerm.trim() === "") { render(products); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      const mapped = data.products.map(p => {
  // Backend "offers" ({store, price, url}) ko standard "sellerList" mein map karo
  const sellerList = (p.offers || []).map(o => ({
    name: o.store || o.marketplace || 'Store',
    price: o.price,
    affiliateLink: o.url || o.affiliateLink || '#'
  }));

  // Lowest price calculate karo agar offers available hain
  const lowestPrice = sellerList.length > 0 
    ? Math.min(...sellerList.map(s => s.price)) 
    : p.price;

  return {
    id: p._id,
    name: p.name,
    cat: p.category,
    price: lowestPrice, // Auto pick lowest price
    was: p.was ?? p.price,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    tag: p.tag || '',
    glyph: p.glyph || '🛒',
    grad: p.grad || '#1a1d29, #2a2f42',
    sellerList: sellerList,
    seller: sellerList[0]?.name || 'Multiple sellers',
    specs: p.specs || {}
  };
});
      render(mapped);
    } catch { render(products); }
  }, 300);
});
document.getElementById('sortSelect').addEventListener('change', e => { sortMode = e.target.value; render(products); });

function setCategory(tab){
  activeTab = tab;
  document.querySelectorAll('.side-item').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  render(products);
}
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    setCategory(card.dataset.cat);
    document.getElementById('deals').scrollIntoView({behavior:'smooth'});
  });
});

function openSidebar(){
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('show');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
}
document.getElementById('mobileCatToggle').addEventListener('click', openSidebar);
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

if (localStorage.getItem('sc_theme') !== 'dark') {
  document.documentElement.classList.add('light');
  document.getElementById('themeToggle').textContent = '☀️';
}

document.getElementById('themeToggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  const isLight = document.documentElement.classList.contains('light');
  document.getElementById('themeToggle').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('sc_theme', isLight ? 'light' : 'dark');
});

document.getElementById('wishNavBtn').addEventListener('click', () => {
  showToast(wishlist.size ? `You have ${wishlist.size} item(s) wishlisted.` : 'Your wishlist is empty — tap the ♡ on any product.');
});

document.getElementById('modalOverlay').addEventListener('click', e => { if(e.target.id==='modalOverlay') closeCompare(); });

/* --- PWA: install prompt + service worker --- */
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBtn').style.display = 'inline-flex';
});
document.getElementById('installBtn').addEventListener('click', async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('installBtn').style.display = 'none';
});
window.addEventListener('appinstalled', () => {
  document.getElementById('installBtn').style.display = 'none';
});
//if('serviceWorker' in navigator){
  //window.addEventListener('load', () => {
    //navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  //});
//}

function showOffers(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  const rows = (p.sellerList || []).map(s => `
    <tr><td>${s.name || s.marketplace || '—'}</td><td>${money(s.price)}</td>
    <td><a href="${s.affiliateLink || '#'}" target="_blank" rel="noopener">Visit →</a></td></tr>
  `).join('');
  document.getElementById('offersModalBody').innerHTML = `
    <table class="cmp-table">
      <tr><th>Seller</th><th>Price</th><th></th></tr>
      ${rows || '<tr><td colspan="3">No seller offers available</td></tr>'}
    </table>`;
  document.getElementById('offersModalOverlay').classList.add('show');
}
function closeOffersModal(){ document.getElementById('offersModalOverlay').classList.remove('show'); }
document.getElementById('offersModalOverlay').addEventListener('click', e => { if(e.target.id==='offersModalOverlay') closeOffersModal(); });

/* ── App bootstrap: fetch catalog from backend, then render everything ── */
import { loadCatalog } from './catalog.js';

async function initApp() {
  grid.innerHTML = Array(8).fill(0).map(() => `
    <div class="card" style="min-height:280px;">
      <div class="thumb" style="background:linear-gradient(90deg,#1a1d29 25%,#22263a 50%,#1a1d29 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;"></div>
      <div class="card-body">
        <div style="height:12px;width:60%;background:var(--surface-2);border-radius:4px;margin-bottom:8px;"></div>
        <div style="height:16px;width:85%;background:var(--surface-2);border-radius:4px;"></div>
      </div>
    </div>
  `).join('');

  try {
    products = await loadCatalog();
  } catch (err) {
    console.error('Failed to load catalog:', err);
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Couldn't load products. Please try again later.</div>`;
    return;
  }

  wishlist = await loadWish();

  const wc = document.getElementById('wishCount');
  wc.textContent = wishlist.size;
  wc.style.display = wishlist.size ? 'flex' : 'none';

  renderSidebar();
  detectCurrency();
}

initApp();


// Jab bhi page bfcache se restore ho (back/forward navigation), catalog dobara load karo
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    initApp();
  }
});
window.toggleCompare = toggleCompare;
window.toggleWish = toggleWish;
window.openCompare = openCompare;
window.clearCompare = clearCompare;
window.closeCompare = closeCompare;
window.setCategory = setCategory;
window.showOffers = showOffers;
window.closeOffersModal = closeOffersModal;
/* ── Header v2: hamburger menu + search sync ─────────────────────── */
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// Header search boxes just mirror into the existing #searchInput
// so we reuse the debounce + filtering logic already in app.js
function wireHeaderSearch(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', (e) => {
    const main = document.getElementById('searchInput');
    main.value = e.target.value;
    main.dispatchEvent(new Event('input'));
    document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
  });
}
wireHeaderSearch('headerSearch');
wireHeaderSearch('headerSearchMobile');