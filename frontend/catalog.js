/* =====================================================================
   Shopnexa — Card renderer for the new redesign markup
   ---------------------------------------------------------------------
   Drop this file in your frontend (e.g. /js/catalog-render.js) and load
   it BEFORE your existing catalog.js:

     <script src="/js/catalog-render.js"></script>
     <script src="/js/catalog.js"></script>

   Then, wherever your old code did:
       productGrid.innerHTML = products.map(oldCardHTML).join('');
   replace it with:
       ShopnexaCards.renderGrid(products);

   The renderer is defensive: it accepts several common field names, so
   it should work with your existing MongoDB product documents without
   any backend change.
   ===================================================================== */

(function (global) {
  'use strict';

  /* ---------------- helpers ---------------- */

  const PLACEHOLDER =
    'https://placehold.co/400x300/f4f6f9/94a3b8?text=Product';

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ₹ formatting, no decimals for whole numbers
  function money(value, currency) {
    const num = Number(value);
    if (!isFinite(num)) return '';
    const cur = currency || 'INR';
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: cur,
        maximumFractionDigits: num % 1 === 0 ? 0 : 2,
      }).format(num);
    } catch (e) {
      return '₹' + num.toLocaleString('en-IN');
    }
  }

  function pick(obj) {
    for (let i = 1; i < arguments.length; i++) {
      const v = obj && obj[arguments[i]];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }

  /* ------------- normalise a product document ------------- */

  function normalise(p) {
    const id = pick(p, '_id', 'id', 'productId', 'slug') || '';
    const title = pick(p, 'title', 'name', 'productName') || 'Untitled product';
    const image =
      pick(p, 'image', 'imageUrl', 'thumbnail', 'img') ||
      (Array.isArray(p.images) && p.images[0]) ||
      PLACEHOLDER;
    const category = pick(p, 'category', 'categoryName', 'cat') || '';
    const currency = pick(p, 'currency', 'currencyCode') || 'INR';

    // offers / sellers
    let offers = pick(p, 'offers', 'sellers', 'prices', 'listings') || [];
    if (!Array.isArray(offers)) offers = [];
    offers = offers
      .map(function (o) {
        return {
          seller: pick(o, 'seller', 'store', 'source', 'merchant', 'name') || 'Seller',
          price: Number(pick(o, 'price', 'currentPrice', 'amount', 'value')),
          url: pick(o, 'url', 'link', 'affiliateUrl', 'productUrl') || '',
        };
      })
      .filter(function (o) { return isFinite(o.price); })
      .sort(function (a, b) { return a.price - b.price; });

    const price = Number(
      pick(p, 'price', 'currentPrice', 'bestPrice', 'lowestPrice') ??
        (offers[0] && offers[0].price)
    );
    const mrp = Number(pick(p, 'mrp', 'originalPrice', 'listPrice', 'oldPrice'));

    let discount = Number(pick(p, 'discount', 'discountPercent'));
    if (!isFinite(discount) && isFinite(mrp) && isFinite(price) && mrp > price) {
      discount = Math.round(((mrp - price) / mrp) * 100);
    }

    const unitCount = Number(pick(p, 'unitCount', 'packSize', 'quantity')) || 1;
    const unitLabel = pick(p, 'unitLabel', 'unit') || 'unit';

    const rating = Number(pick(p, 'rating', 'ratings', 'avgRating'));
    const reviews = Number(pick(p, 'reviewCount', 'reviews', 'numReviews', 'totalReviews'));

    const link =
      pick(p, 'detailUrl', 'productUrl', 'url', 'affiliateUrl') ||
      (offers[0] && offers[0].url) ||
      ('/product.html?id=' + encodeURIComponent(id));

    return {
      id, title, image, category, currency, offers, price, mrp,
      discount, unitCount, unitLabel, rating, reviews, link,
      wished: !!pick(p, 'inWishlist', 'wished', 'isWishlisted'),
    };
  }

  /* ---------------- markup ---------------- */

  const HEART_SVG =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">' +
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/></svg>';

  function cardHTML(raw) {
    const p = normalise(raw);

    const badge =
      isFinite(p.discount) && p.discount > 0
        ? '<span class="badge-off">-' + Math.round(p.discount) + '%</span>'
        : '';

    const oldPrice =
      isFinite(p.mrp) && p.mrp > p.price
        ? '<span class="price-old">' + esc(money(p.mrp, p.currency)) + '</span>'
        : '';

    const unitPrice =
      isFinite(p.price) && p.unitCount > 0
        ? '<span class="unit-price">' +
          esc(money(p.price / p.unitCount, p.currency)) +
          ' per ' + esc(p.unitLabel) +
          ' · pack of ' + p.unitCount +
          '</span>'
        : '';

    const meta =
      isFinite(p.rating) || isFinite(p.reviews)
        ? '<div class="card-meta">' +
          (isFinite(p.rating)
            ? '<span class="rating">★ ' + p.rating.toFixed(1) + '</span> '
            : '') +
          (isFinite(p.reviews) ? '<span>(' + p.reviews + ' reviews)</span>' : '') +
          '</div>'
        : '';

    const offers = p.offers.length
      ? '<div class="offers">' +
        p.offers
          .slice(0, 3)
          .map(function (o, i) {
            return (
              '<span class="offer-chip' + (i === 0 ? ' best' : '') + '">' +
              esc(o.seller) + ' <b>' + esc(money(o.price, p.currency)) + '</b></span>'
            );
          })
          .join('') +
        '</div>'
      : '';

    return (
      '<article class="product-card" data-id="' + esc(p.id) + '">' +
        '<div class="thumb">' +
          badge +
          '<button class="wish-btn' + (p.wished ? ' is-active' : '') + '" type="button" ' +
            'data-action="wishlist" data-id="' + esc(p.id) + '" ' +
            'aria-pressed="' + (p.wished ? 'true' : 'false') + '" ' +
            'aria-label="Save to wishlist">' + HEART_SVG + '</button>' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" ' +
            'onerror="this.onerror=null;this.src=\'' + PLACEHOLDER + '\'" />' +
        '</div>' +
        '<div class="card-body">' +
          (p.category ? '<span class="card-cat">' + esc(p.category) + '</span>' : '') +
          '<h3 class="card-title">' + esc(p.title) + '</h3>' +
          meta +
          '<div class="price-row">' +
            '<span class="price-main">' + esc(money(p.price, p.currency)) + '</span>' +
            oldPrice +
          '</div>' +
          unitPrice +
          offers +
          '<div class="card-foot">' +
            '<a class="btn btn-primary btn-sm btn-block" href="' + esc(p.link) + '">View deal →</a>' +
          '</div>' +
          '<label class="compare-lbl">' +
            '<input type="checkbox" data-action="compare" data-id="' + esc(p.id) + '" /> Compare' +
          '</label>' +
        '</div>' +
      '</article>'
    );
  }

  function emptyHTML(message) {
    return (
      '<div class="empty-state">' +
        '<h3>No products found</h3>' +
        '<p>' + esc(message || 'Try changing your filters or search terms.') + '</p>' +
      '</div>'
    );
  }

  function skeletonHTML(count) {
    let out = '';
    for (let i = 0; i < (count || 6); i++) {
      out +=
        '<article class="product-card is-skeleton" aria-hidden="true">' +
          '<div class="thumb skeleton"></div>' +
          '<div class="card-body">' +
            '<span class="skeleton line sm"></span>' +
            '<span class="skeleton line lg"></span>' +
            '<span class="skeleton line md"></span>' +
          '</div>' +
        '</article>';
    }
    return out;
  }

  /* ---------------- public API ---------------- */

  function grid(target) {
    if (!target) return document.getElementById('productGrid');
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  const ShopnexaCards = {
    normalise: normalise,
    cardHTML: cardHTML,
    money: money,

    renderGrid: function (products, target, emptyMessage) {
      const el = grid(target);
      if (!el) return;
      if (!products || !products.length) {
        el.innerHTML = emptyHTML(emptyMessage);
        return;
      }
      el.innerHTML = products.map(cardHTML).join('');
    },

    appendGrid: function (products, target) {
      const el = grid(target);
      if (!el || !products || !products.length) return;
      el.insertAdjacentHTML('beforeend', products.map(cardHTML).join(''));
    },

    renderSkeletons: function (count, target) {
      const el = grid(target);
      if (el) el.innerHTML = skeletonHTML(count);
    },

    /* Optional: one delegated listener for wishlist / compare clicks.
       Pass your own handlers; both receive the product id. */
    bindActions: function (opts, target) {
      const el = grid(target);
      if (!el) return;
      el.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-action="wishlist"]');
        if (!btn) return;
        e.preventDefault();
        const active = btn.classList.toggle('is-active');
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (opts && typeof opts.onWishlist === 'function') {
          opts.onWishlist(btn.dataset.id, active, btn);
        }
      });
      el.addEventListener('change', function (e) {
        const box = e.target.closest('[data-action="compare"]');
        if (!box) return;
        if (opts && typeof opts.onCompare === 'function') {
          opts.onCompare(box.dataset.id, box.checked, box);
        }
      });
    },
  };

  global.ShopnexaCards = ShopnexaCards;
})(window);
