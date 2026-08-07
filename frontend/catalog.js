// catalog.js
const API_BASE = 'https://ShopNexa-backend.onrender.com/api';

export async function loadCatalog() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);

    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.products || []);

    return products.map(p => {
      const sellerList = (p.offers || []).map(o => {
        const units = o.unitCount && o.unitCount > 0 ? o.unitCount : 1;
        return {
          name: o.store,
          price: +(o.price / units).toFixed(2),   // ← divide by units
          affiliateLink: o.url
        };
      });

      const baseUnits = p.unitCount && p.unitCount > 0 ? p.unitCount : 1;

      return {
        id: p._id,
        name: p.name,
        description: p.description || '',
        price: +(p.price / baseUnits).toFixed(2),   // ← divide by units
        was: p.was ?? +(p.price / baseUnits).toFixed(2),
        currency: p.currency || 'INR',
        cat: (p.category || '').toLowerCase(),
        image: p.image || (p.images && p.images[0]) || '',
        images: p.images || [],
        specs: p.specs || {},
        sellerList,
        seller: sellerList[0]?.name || 'Multiple sellers',
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        tag: p.tag || (p.isFeatured ? 'Featured' : ''),
        glyph: p.glyph || '🛒',
        grad: p.grad || '#1a1d29, #2a2f42',
        isFeatured: p.isFeatured || false
      };
    });
  } catch (err) {
    console.error('Catalog load failed:', err);
    return [];
  }
}

export function getLowestPriceSeller(sellerList) {
  if (!sellerList || sellerList.length === 0) return null;
  return sellerList.reduce((lowest, seller) =>
    seller.price < lowest.price ? seller : lowest
  );
}