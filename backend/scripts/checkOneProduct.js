require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'smartcart';

async function run() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const products = db.collection('products');

  const doc = await products.findOne({
    name: { $regex: 'Cosmetics Pearl Eye Shadow', $options: 'i' },
  });

  console.log('Found document:');
  console.log(JSON.stringify(doc, null, 2));

  // Also show total count and how many have a non-empty offers array
  const total = await products.countDocuments();
  const withOffers = await products.countDocuments({ 'offers.0': { $exists: true } });
  console.log('\nTotal products in DB:', total);
  console.log('Products WITH at least 1 offer:', withOffers);

  await client.close();
}

run().catch((err) => {
  console.error('Check failed:', err);
  process.exit(1);
});