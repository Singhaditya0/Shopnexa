require('dotenv').config();
const u = process.env.MONGO_URI || '';
console.log('Found variable:', u.length > 0);
console.log('Starts with mongodb:', u.startsWith('mongodb'));
console.log('Has quotes:', u.includes('"'));
console.log('Length:', u.length);