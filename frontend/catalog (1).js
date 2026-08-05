/* =====================================================================
   Shopnexa — catalog.js  (RESTORED)
   ---------------------------------------------------------------------
   Yeh file wahi kaam karti hai jo tumhari purani catalog.js karti thi:
   backend se products laa kar app.js ke expected shape mein deti hai.

   Load order (index.html):
     <script src="catalog.js"></script>          <!-- data layer  -->
     <script src="catalog-render.js"></script>   <!-- naye cards (optional) -->
     <script src="app.js"></script>

   NOTE: catalog-render.js ko catalog.js ke naam se replace mat karna —
   dono alag files hain.
   ===================================================================== */

// Backend base URL — localhost ki jagah live Render backend
window.API_BASE = 'https://shopnexa-backend.onrender.com';

/* Backend product document -> app.js ka internal shape */
function mapProduct(p) {
  const sellerList = (p.offers || []).map(function (o) {
    return {
      name: o.store || o.marketplace || 'Store',
      price: Number(o.price),
      unitCount: o.unitCount || p.unitCount || 1,
      affiliateLink: o.url || o.affiliateLink || '#',
    };
  });

  const lowestPrice = sellerList.length
    ? Math.min.apply(null, sellerList.map(function (s) { return s.price; }))
    : Number(p.price);

  return {
    id: p._id,
    name: p.name,
    cat: p.category,
    image: (p.images && p.images[0]) || p.image || '',
    currency: p.currency || 'USD',
    unitCount: p.unitCount || 1,
    price: lowestPrice,
    was: p.was ?? p.price,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? p.reviewCount ?? 0,
    tag: p.tag || '',
    glyph: p.glyph || '🛒',
    grad: p.grad || '#1a1d29, #2a2f42',
    sellerList: sellerList,
    seller: (sellerList[0] && sellerList[0].name) || 'Multiple sellers',
    specs: p.specs || {},
  };
}

/* Backend response ke alag-alag shapes handle karo:
   {success, data:[...]} | {products:[...]} | [...] */
function extractList(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.data)) return json.data;
  if (json && Array.isArray(json.products)) return json.products;
  if (json && json.data && Array.isArray(json.data.products)) return json.data.products;
  return [];
}

/* app.js isko call karta hai: products = await loadCatalog(); */
async function loadCatalog() {
  const res = await fetch(window.API_BASE + '/api/products');
  if (!res.ok) throw new Error('Catalog request failed: ' + res.status);
  const json = await res.json();
  return extractList(json).map(mapProduct);
}

/* Search bhi wahi mapping use kare */
async function searchCatalog(q) {
  const res = await fetch(window.API_BASE + '/api/search?q=' + encodeURIComponent(q));
  if (!res.ok) throw new Error('Search failed: ' + res.status);
  const json = await res.json();
  return extractList(json).map(mapProduct);
}

window.mapProduct = mapProduct;
window.loadCatalog = loadCatalog;
window.searchCatalog = searchCatalog;
