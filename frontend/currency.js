const CURRENCIES = {
  USD: { symbol: '$',   locale: 'en-US', rate: 1 },
  INR: { symbol: '₹',   locale: 'en-IN', rate: 95.2 },
  EUR: { symbol: '€',   locale: 'de-DE', rate: 0.865 },
  GBP: { symbol: '£',   locale: 'en-GB', rate: 0.741 },
  AUD: { symbol: 'A$',  locale: 'en-AU', rate: 1.414 },
  CAD: { symbol: 'C$',  locale: 'en-CA', rate: 1.40  },
  JPY: { symbol: '¥',   locale: 'ja-JP', rate: 158.5 },
  AED: { symbol: 'AED ',locale: 'ar-AE', rate: 3.6725 }, // fixed peg
  SGD: { symbol: 'S$',  locale: 'en-SG', rate: 1.278 },
  BRL: { symbol: 'R$',  locale: 'pt-BR', rate: 5.24 },
  SAR: { symbol: 'SR ', locale: 'ar-SA', rate: 3.75 },   // fixed peg
  // ── ADDED (Aug 2026) — major markets that were missing ──
  CNY: { symbol: '¥',   locale: 'zh-CN', rate: 6.85 },   // China
  MXN: { symbol: 'MX$', locale: 'es-MX', rate: 17.12 },  // Mexico
  ZAR: { symbol: 'R',   locale: 'en-ZA', rate: 16.3 },   // South Africa
  KRW: { symbol: '₩',   locale: 'ko-KR', rate: 1408 },   // South Korea
  CHF: { symbol: 'CHF ',locale: 'de-CH', rate: 0.808 },  // Switzerland
  IDR: { symbol: 'Rp',  locale: 'id-ID', rate: 17885 },  // Indonesia
  PHP: { symbol: '₱',   locale: 'en-PH', rate: 60.82 },  // Philippines
  MYR: { symbol: 'RM',  locale: 'ms-MY', rate: 4.09 },   // Malaysia
  THB: { symbol: '฿',   locale: 'th-TH', rate: 33.02 },  // Thailand
  NZD: { symbol: 'NZ$', locale: 'en-NZ', rate: 1.70 },   // New Zealand
};

// Map country codes → currency codes
const COUNTRY_CURRENCY = {
  IN:'INR', US:'USD', CA:'CAD', GB:'GBP', AU:'AUD', NZ:'NZD',
  DE:'EUR', FR:'EUR', IT:'EUR', ES:'EUR', NL:'EUR', PT:'EUR',
  AT:'EUR', BE:'EUR', GR:'EUR', FI:'EUR', IE:'EUR', LU:'EUR',
  JP:'JPY', AE:'AED', SG:'SGD', BR:'BRL', SA:'SAR',
  // ── ADDED (Aug 2026) ──
  CN:'CNY', MX:'MXN', ZA:'ZAR', KR:'KRW', CH:'CHF',
  ID:'IDR', PH:'PHP', MY:'MYR', TH:'THB',
};

let activeCurrency = 'USD';
let ratesLoaded = false;

/* Fetch live rates from open.er-api.com (free, no key, HTTPS, updates daily).
   Base = USD. On failure keeps the hardcoded fallback rates above. */
async function fetchLiveRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) return;
    const data = await res.json();
    if (data.result !== 'success') return;
    const r = data.rates;
    Object.keys(CURRENCIES).forEach(code => {
      if (code !== 'USD' && r[code]) CURRENCIES[code].rate = r[code];
    });
    ratesLoaded = true;
  } catch (e) { /* silently keep fallback rates */ }
}

/* Detect the visitor's country via a free HTTPS geo-IP service and set
   activeCurrency. NOTE: ip-api.com's free tier is HTTP-only and gets
   blocked as mixed content on an HTTPS site — ipwho.is is used instead
   because it supports HTTPS on its free tier. Falls back to browser
   locale if the geo lookup fails for any reason. */
async function detectCountryCurrency() {
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data && data.success !== false && data.country_code) {
      const code = COUNTRY_CURRENCY[data.country_code];
      if (code && CURRENCIES[code]) { activeCurrency = code; return; }
    }
  } catch (e) { /* fall through to locale-based guess below */ }

  const locale = navigator.language || '';
  if (locale.startsWith('hi') || locale.endsWith('-IN')) activeCurrency = 'INR';
  else if (locale.endsWith('-GB')) activeCurrency = 'GBP';
  else if (locale.endsWith('-AU')) activeCurrency = 'AUD';
  else if (locale.endsWith('-CA')) activeCurrency = 'CAD';
}

/**
 * Format a price for display, converting from its ACTUAL source
 * currency to the visitor's active currency.
 *
 * @param {number} price          the raw price as stored in the DB
 * @param {string} sourceCurrency the currency that `price` is actually
 *                                 in (e.g. product.currency — "INR",
 *                                 "USD", "SAR", etc). Defaults to USD
 *                                 for any old call sites that don't
 *                                 pass it yet.
 */
function money(price, sourceCurrency = 'USD') {
  const target = CURRENCIES[activeCurrency] || CURRENCIES.USD;
  const source = CURRENCIES[(sourceCurrency || 'USD').toUpperCase()] || CURRENCIES.USD;

  // Convert source → USD → target. If source === target, this is a no-op
  // (dividing and multiplying by the same rate cancels out), so a
  // product already in the visitor's currency is shown as-is.
  const usdPrice = price / source.rate;
  const converted = usdPrice * target.rate;

  try {
    return new Intl.NumberFormat(target.locale, {
      style: 'currency', currency: activeCurrency,
      maximumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
      minimumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
    }).format(converted);
  } catch (e) {
    return target.symbol + converted.toFixed(activeCurrency === 'JPY' ? 0 : 2);
  }
}