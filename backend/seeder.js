const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones",
    price: 2999,
    currency: "INR",
    category: "Electronics",
    image: "/images/headphones.jpg",
    images: ["/images/headphones1.jpg", "/images/headphones2.jpg"],
    specs: { battery: "20h", bluetooth: "5.0" },
    sellerList: [
      { name: "Amazon", price: 2899, link: "https://amazon.in/product" },
      { name: "Flipkart", price: 2999, link: "https://flipkart.com/product" }
    ],
    isFeatured: true
  },
  {
    name: "Smartwatch",
    description: "Fitness tracking smartwatch",
    price: 4999,
    currency: "INR",
    category: "Wearables",
    image: "/images/smartwatch.jpg",
    specs: { display: "AMOLED", waterproof: "Yes" },
    sellerList: [
      { name: "Croma", price: 4799, link: "https://croma.com/product" }
    ]
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
