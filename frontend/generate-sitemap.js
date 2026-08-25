// generate-sitemap.js
// Run with: node generate-sitemap.js
// Pulls live product data from the API and writes a complete sitemap.xml
// with real product IDs (instead of guessed/sequential ones).

const fs = require('fs');

const API_BASE = 'https://shopnexa-khaki.vercel.app/api';
const SITE_URL = 'https://shopnexaco.com';

const staticPages = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  { loc: `${SITE_URL}/about.html`, priority: '0.8' },
  { loc: `${SITE_URL}/contact.html`, priority: '0.8' },
  { loc: `${SITE_URL}/privacy-policy.html`, priority: '0.6' },
  { loc: `${SITE_URL}/terms.html`, priority: '0.6' },
  { loc: `${SITE_URL}/affiliate-disclosure.html`, priority: '0.6' },
];

async function main() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data = await res.json();
  const products = Array.isArray(data) ? data : (data.products || []);

  const productUrls = products.map(p => ({
    loc: `${SITE_URL}/product.html?id=${p._id}`,
    priority: '0.9',
  }));

  const allUrls = [...staticPages, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n\n')}
</urlset>
`;

  fs.writeFileSync('sitemap.xml', xml);
  console.log(`sitemap.xml written with ${allUrls.length} URLs (${productUrls.length} products).`);
}

main().catch(err => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});
