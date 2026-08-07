/* ── ShopNexa shared currency utilities ──────────────────────────────
   Used by both index.html (via app.js) and product.html.
   Previously this logic was duplicated in both places — now it lives
   here once, so updating rates/currencies only needs one edit.
*/

const CURRENCIES = {
  USD: { symbol: '$',  locale: 'en-US', rate: 1 },
  INR: { symbol: '₹',  locale: 'en-IN', rate: 83.5 },
  EUR: { symbol: '€',  locale: 'de-DE', rate: 0.92 },
  GBP: { symbol: '£',  locale: 'en-GB', rate: 0.79 },
  AUD: { symbol: 'A$', locale: 'en-AU', rate: 1.52 },
  CAD: { symbol: 'C$', locale: 'en-CA', rate: 1.36 },
  JPY: { symbol: '¥',  locale: 'ja-JP', rate: 149  },
  AED: { symbol: 'AED ', locale: 'ar-AE', rate: 3.67 },
  SGD: { symbol: 'S$', locale: 'en-SG', rate: 1.34 },
  BRL: { symbol: 'R$', locale: 'pt-BR', rate: 4.97 },
};

// Map country codes → currency codes
const COUNTRY_CURRENCY = {
  IN:'INR', US:'USD', CA:'CAD', GB:'GBP', AU:'AUD', NZ:'NZD',
  DE:'EUR', FR:'EUR', IT:'EUR', ES:'EUR', NL:'EUR', PT:'EUR',
  AT:'EUR', BE:'EUR', GR:'EUR', FI:'EUR', IE:'EUR',
  JP:'JPY', AE:'AED', SG:'SGD', BR:'BRL',
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

function money(usdPrice) {
  const c = CURRENCIES[activeCurrency] || CURRENCIES.USD;
  const converted = usdPrice * c.rate;
  try {
    return new Intl.NumberFormat(c.locale, {
      style: 'currency', currency: activeCurrency,
      maximumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
      minimumFractionDigits: activeCurrency === 'JPY' ? 0 : 2,
    }).format(converted);
  } catch (e) {
    return c.symbol + converted.toFixed(activeCurrency === 'JPY' ? 0 : 2);
  }
}
