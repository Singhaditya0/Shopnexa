/**
 * fixOffersStructure.js
 * -------------------------------------------------------------
 * ONE-TIME FIX for the 799 products imported via importListings.js.
 *
 * PROBLEM:
 *   catalog.js (frontend) reads each product's `offers` array like:
 *     p.offers.map(o => ({ name: o.store, price: o.price/units, affiliateLink: o.url }))
 *   But the imported documents only have flat fields (platform, price,
 *   productUrl) — no `offers` array. So sellerList ends up empty, and the
 *   "Buy on X" button always falls back to a default instead of the real
 *   marketplace + link.
 *
 * WHAT THIS SCRIPT DOES:
 *   For every product in the "products" collection that doesn't yet have
 *   an `offers` array, it builds one from the existing flat fields:
 *     offers: [{ store: platform, price, url: productUrl, unitCount: 1 }]
 *   This makes catalog.js's mapping work immediately — "Buy on {platform}"
 *   will show the correct marketplace and link to the correct URL.
 *
 * WHERE TO PUT THIS FILE:
 *   backend/scripts/fixOffersStructure.js
 *
 * RUN:
 *   node scripts/fixOffersStructure.js
 *
 * NOTE ON PRICE COMPARISON:
 *   This fixes the "Buy on default" bug. It does NOT create real price
 *   comparison across stores, because the source CSV only had ONE
 *   listing per product (no cross-platform matches — matchGroupId was
 *   empty for all 799 rows). Each product will show exactly 1 offer,
 *   so the compare UI will correctly show one price/store, not "vs".
 * -------------------------------------------------------------
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_ATLAS_URI_HERE';
const DB_NAME = process.env.DB_NAME || 'shopnexa';

async function run() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const products = db.collection('products');

  // Only touch docs that don't already have a populated offers array
  const cursor = products.find({
    $or: [{ offers: { $exists: false } }, { offers: { $size: 0 } }],
  });

  let updated = 0;
  let skipped = 0;

  while (await cursor.hasNext()) {
    const doc = await cursor.next();

    if (!doc.price || !doc.platform) {
      skipped++;
      continue;
    }

    const offer = {
      store: doc.platform,
      price: doc.price,
      url: doc.productUrl || '',
      unitCount: 1,
    };

    await products.updateOne(
      { _id: doc._id },
      {
        $set: {
          offers: [offer],
          image: doc.image || doc.imageUrl || '',
        },
      }
    );
    updated++;
  }

  console.log('--- Fix summary ---');
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (missing price/platform): ${skipped}`);

  await client.close();
}

run().catch((err) => {
  console.error('Fix failed:', err);
  process.exit(1);
});