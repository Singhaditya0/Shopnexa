/* ShopNexa — Multi-Marketplace Price Comparison
   
   NOW: Each product has `offers` array [{marketplace, price, url}]
   All prices stored in USD. Frontend converts to user's local currency.
   
   Supported currencies (auto-detect by country):
   US/Default: $ USD (rate: 1)
   India: ₹ INR (rate: 83.5)
   UK: £ GBP (rate: 0.79)
   EU: € EUR (rate: 0.92)
   Australia: A$ AUD (rate: 1.52)
   Canada: C$ CAD (rate: 1.36)
   Japan: ¥ JPY (rate: 150)
   Sweden: kr SEK (rate: 10.5)
   Switzerland: CHF (rate: 0.88)
*/

const categoryGroups = [
  {
    key: "fashion",
    group: "Fashion",
    icon: "👗",
    open: true,
    items: [
      { key: "clothes",          label: "Clothes (All Types)",   icon: "👕" },
      { key: "accessories",      label: "Accessories",           icon: "🕶️" },
      { key: "bags",             label: "Bags",                  icon: "👜" },
      { key: "footwear",         label: "Footwear",              icon: "👟" },
      { key: "mens-accessories", label: "Men's Accessories",     icon: "⌚" }
    ]
  },
  {
    key: "beauty",
    group: "Beauty & Personal Care",
    icon: "💄",
    open: false,
    items: [
      { key: "boys-perfume",   label: "Boys Perfumes",       icon: "🧴" },
      { key: "girls-perfume",  label: "Girls Perfumes",      icon: "🌸" },
      { key: "hair-appliances",label: "Hair Appliances",     icon: "💇" },
      { key: "hair-products",  label: "Hair Products",       icon: "🧴" },
      { key: "skincare",       label: "Skin Care Products",  icon: "🧖" },
      { key: "face-trimmers",  label: "Face Razors / Trimmers", icon: "🪒" },
      { key: "makeup",         label: "Makeup Products",     icon: "💋" }
    ]
  },
  {
    key: "electronics",
    group: "Electronics & Home",
    icon: "💻",
    open: false,
    items: [
      { key: "electronics",        label: "Electronics",         icon: "🔌" },
      { key: "kitchen-appliances", label: "Kitchen Appliances",  icon: "🍳" },
      { key: "smartphones",        label: "Smart Phones",        icon: "📱" }
    ]
  },
  {
    key: "kids",
    group: "Kids",
    icon: "🧸",
    open: false,
    items: [
      { key: "kids-clothes-footwear", label: "Kids Clothes & Footwear", icon: "👶" },
      { key: "kids-toys",             label: "Kids Toys",               icon: "🧸" }
    ]
  },
  {
    key: "pets",
    group: "Pets",
    icon: "🐾",
    open: false,
    items: [
      { key: "pet-food",        label: "Pet Foods",        icon: "🦴" },
      { key: "pet-products",    label: "Pet Products",     icon: "🐕" },
      { key: "pet-accessories", label: "Pet Accessories",  icon: "🐾" }
    ]
  }
];

function findGroupFor(catKey) {
  const grp = categoryGroups.find(g => g.items.some(it => it.key === catKey));
  return grp ? grp.key : null;
}

const rawProducts = [
  // ---------- FASHION ----------
  { id: 1,  name: "Classic Fit Cotton T-Shirt",        cat: "clothes",          rating: 4.4, reviews: 1820, tag: "-36%", glyph: "👕", grad: "#5EEAD4, #2A2E3A", specs: { "Material": "100% Cotton", "Fit": "Regular", "Sizes": "S–XXL" }, offers: [
    { marketplace: "AliExpress", price: 8.99,  url: "https://aliexpress.com/item/cotton-tshirt" },
    { marketplace: "Amazon",     price: 12.99, url: "https://amazon.in/s?k=cotton-tshirt" },
    { marketplace: "Flipkart",   price: 14.99, url: "https://flipkart.com/search?q=cotton-tshirt" },
    { marketplace: "Shein",      price: 7.99,  url: "https://shein.com/search?wd=cotton-tshirt" }
  ]},
  { id: 2,  name: "Women's Wrap Summer Dress",          cat: "clothes",          rating: 4.5, reviews: 940,  tag: "-34%", glyph: "👗", grad: "#FF6B4A, #2A2E3A", specs: { "Material": "Rayon Blend", "Length": "Midi", "Sizes": "XS–XL" }, offers: [
    { marketplace: "Shein",      price: 16.50, url: "https://shein.com/search?wd=dress" },
    { marketplace: "AliExpress", price: 18.99, url: "https://aliexpress.com/item/dress" },
    { marketplace: "Amazon",     price: 22.99, url: "https://amazon.in/s?k=dress" }
  ]},
  { id: 3,  name: "Slim Fit Denim Jacket",               cat: "clothes",          rating: 4.6, reviews: 512,  tag: "-31%", glyph: "🧥", grad: "#5EEAD4, #171A23", specs: { "Material": "Denim", "Fit": "Slim", "Sizes": "S–XXL" }, offers: [
    { marketplace: "AliExpress", price: 27.00, url: "https://aliexpress.com/item/denim-jacket" },
    { marketplace: "Amazon",     price: 35.00, url: "https://amazon.in/s?k=denim-jacket" },
    { marketplace: "Flipkart",   price: 39.00, url: "https://flipkart.com/search?q=denim-jacket" }
  ]},
  { id: 4,  name: "Aviator Polarized Sunglasses",        cat: "accessories",      rating: 4.5, reviews: 1330, tag: "-38%", glyph: "🕶️", grad: "#FF6B4A, #1E212C", specs: { "Lens": "Polarized UV400", "Frame": "Metal" }, offers: [
    { marketplace: "DHGate",     price: 11.20, url: "https://dhgate.com/search?key=sunglasses" },
    { marketplace: "AliExpress", price: 13.90, url: "https://aliexpress.com/item/sunglasses" },
    { marketplace: "Amazon",     price: 18.00, url: "https://amazon.in/s?k=aviator-sunglasses" }
  ]},
  { id: 5,  name: "Minimalist Leather Belt",             cat: "accessories",      rating: 4.4, reviews: 610,  tag: "-34%", glyph: "🧵", grad: "#5EEAD4, #2A2E3A", specs: { "Material": "Genuine Leather", "Width": "3.5cm" }, offers: [
    { marketplace: "Alibaba",    price: 9.90,  url: "https://alibaba.com/search?wd=leather-belt" },
    { marketplace: "AliExpress", price: 11.50, url: "https://aliexpress.com/item/leather-belt" },
    { marketplace: "Amazon",     price: 15.00, url: "https://amazon.in/s?k=leather-belt" }
  ]},
  { id: 6,  name: "Everyday Canvas Tote Bag",            cat: "bags",             rating: 4.6, reviews: 780,  tag: "-31%", glyph: "👜", grad: "#FF6B4A, #2A2E3A", specs: { "Material": "Canvas", "Capacity": "15L" }, offers: [
    { marketplace: "AliExpress", price: 12.40, url: "https://aliexpress.com/item/canvas-bag" },
    { marketplace: "Amazon",     price: 16.50, url: "https://amazon.in/s?k=canvas-tote-bag" },
    { marketplace: "Flipkart",   price: 18.00, url: "https://flipkart.com/search?q=canvas-bag" }
  ]},
  { id: 7,  name: "Anti-Theft Travel Backpack",          cat: "bags",             rating: 4.7, reviews: 1105, tag: "-29%", glyph: "🎒", grad: "#5EEAD4, #171A23", specs: { "Capacity": "25L", "USB Port": "Yes", "Water Resistant": "Yes" }, offers: [
    { marketplace: "Banggood",   price: 29.99, url: "https://banggood.com/search?key=travel-backpack" },
    { marketplace: "AliExpress", price: 34.90, url: "https://aliexpress.com/item/backpack" },
    { marketplace: "Amazon",     price: 42.00, url: "https://amazon.in/s?k=anti-theft-backpack" }
  ]},
  { id: 8,  name: "Running Sneakers Air Mesh",           cat: "footwear",         rating: 4.5, reviews: 2040, tag: "-31%", glyph: "👟", grad: "#FF6B4A, #1E212C", specs: { "Sole": "EVA Cushion", "Upper": "Breathable Mesh" }, offers: [
    { marketplace: "AliExpress", price: 24.90, url: "https://aliexpress.com/item/running-shoes" },
    { marketplace: "Amazon",     price: 32.00, url: "https://amazon.in/s?k=running-sneakers" },
    { marketplace: "Flipkart",   price: 36.00, url: "https://flipkart.com/search?q=running-shoes" },
    { marketplace: "Banggood",   price: 28.50, url: "https://banggood.com/search?key=sneakers" }
  ]},
  { id: 9,  name: "Formal Leather Oxford Shoes",         cat: "footwear",         rating: 4.4, reviews: 390,  tag: "-30%", glyph: "👞", grad: "#5EEAD4, #2A2E3A", specs: { "Material": "PU Leather", "Sizes": "39–45" }, offers: [
    { marketplace: "DHGate",     price: 33.50, url: "https://dhgate.com/search?key=oxford-shoes" },
    { marketplace: "AliExpress", price: 38.00, url: "https://aliexpress.com/item/shoes" },
    { marketplace: "Amazon",     price: 48.00, url: "https://amazon.in/s?k=oxford-shoes" }
  ]},
  { id: 10, name: "Chronograph Steel Wristwatch",        cat: "mens-accessories", rating: 4.5, reviews: 860,  tag: "-35%", glyph: "⌚", grad: "#FF6B4A, #2A2E3A", specs: { "Movement": "Quartz", "Water Resistance": "3ATM" }, offers: [
    { marketplace: "AliExpress", price: 22.00, url: "https://aliexpress.com/item/wristwatch" },
    { marketplace: "Amazon",     price: 28.99, url: "https://amazon.in/s?k=chronograph-watch" },
    { marketplace: "DHGate",     price: 25.50, url: "https://dhgate.com/search?key=watch" }
  ]},
  { id: 11, name: "Men's Genuine Leather Wallet",        cat: "mens-accessories", rating: 4.6, reviews: 1204, tag: "-32%", glyph: "👛", grad: "#5EEAD4, #171A23", specs: { "Material": "Leather", "Card Slots": "8" }, offers: [
    { marketplace: "Alibaba",    price: 10.90, url: "https://alibaba.com/search?wd=leather-wallet" },
    { marketplace: "AliExpress", price: 12.50, url: "https://aliexpress.com/item/wallet" },
    { marketplace: "Amazon",     price: 16.00, url: "https://amazon.in/s?k=leather-wallet" }
  ]},

  // ---------- BEAUTY & PERSONAL CARE ----------
  { id: 12, name: "Voyage Woody Eau de Parfum (Him)",    cat: "boys-perfume",     rating: 4.4, reviews: 640,  tag: "-32%", glyph: "🧴", grad: "#5EEAD4, #2A2E3A", specs: { "Volume": "100ml", "Notes": "Woody, Musk" }, offers: [
    { marketplace: "AliExpress", price: 14.90, url: "https://aliexpress.com/item/perfume" },
    { marketplace: "Amazon",     price: 19.99, url: "https://amazon.in/s?k=perfume" },
    { marketplace: "Flipkart",   price: 22.00, url: "https://flipkart.com/search?q=perfume" }
  ]},
  { id: 13, name: "Sport Fresh Cologne (Him)",           cat: "boys-perfume",     rating: 4.2, reviews: 388,  tag: "-37%", glyph: "🧴", grad: "#FF6B4A, #2A2E3A", specs: { "Volume": "75ml", "Notes": "Citrus, Aquatic" }, offers: [
    { marketplace: "DHGate",     price: 9.50,  url: "https://dhgate.com/search?key=cologne" },
    { marketplace: "AliExpress", price: 11.20, url: "https://aliexpress.com/item/cologne" },
    { marketplace: "Amazon",     price: 15.00, url: "https://amazon.in/s?k=sport-cologne" }
  ]},
  { id: 14, name: "Bloom Floral Eau de Toilette (Her)",  cat: "girls-perfume",    rating: 4.6, reviews: 720,  tag: "-31%", glyph: "🌸", grad: "#5EEAD4, #171A23", specs: { "Volume": "100ml", "Notes": "Floral, Vanilla" }, offers: [
    { marketplace: "AliExpress", price: 15.90, url: "https://aliexpress.com/item/perfume" },
    { marketplace: "Amazon",     price: 20.00, url: "https://amazon.in/s?k=floral-perfume" },
    { marketplace: "Flipkart",   price: 23.00, url: "https://flipkart.com/search?q=perfume" }
  ]},
  { id: 15, name: "Rose Musk Perfume Mist (Her)",        cat: "girls-perfume",    rating: 4.3, reviews: 505,  tag: "-34%", glyph: "🌷", grad: "#FF6B4A, #1E212C", specs: { "Volume": "60ml", "Notes": "Rose, Musk" }, offers: [
    { marketplace: "Shein",      price: 8.90,  url: "https://shein.com/search?wd=perfume" },
    { marketplace: "AliExpress", price: 10.50, url: "https://aliexpress.com/item/perfume" },
    { marketplace: "Amazon",     price: 13.50, url: "https://amazon.in/s?k=rose-perfume" }
  ]},
  { id: 16, name: "Ionic Hair Straightener Pro",         cat: "hair-appliances", rating: 4.5, reviews: 990,  tag: "-33%", glyph: "💇", grad: "#5EEAD4, #2A2E3A", specs: { "Plate": "Ceramic Tourmaline", "Heat": "Up to 230°C" }, offers: [
    { marketplace: "AliExpress", price: 18.90, url: "https://aliexpress.com/item/hair-straightener" },
    { marketplace: "Amazon",     price: 24.99, url: "https://amazon.in/s?k=hair-straightener" },
    { marketplace: "Flipkart",   price: 28.00, url: "https://flipkart.com/search?q=hair-straightener" }
  ]},
  { id: 17, name: "Compact Fast-Dry Hair Dryer",         cat: "hair-appliances", rating: 4.4, reviews: 730,  tag: "-31%", glyph: "💨", grad: "#FF6B4A, #2A2E3A", specs: { "Power": "1800W", "Speeds": "3" }, offers: [
    { marketplace: "Banggood",   price: 14.50, url: "https://banggood.com/search?key=hair-dryer" },
    { marketplace: "AliExpress", price: 16.90, url: "https://aliexpress.com/item/hair-dryer" },
    { marketplace: "Amazon",     price: 21.00, url: "https://amazon.in/s?k=hair-dryer" }
  ]},
  { id: 18, name: "Argan Oil Repair Shampoo 400ml",      cat: "hair-products",   rating: 4.5, reviews: 1150, tag: "-34%", glyph: "🧴", grad: "#5EEAD4, #171A23", specs: { "Volume": "400ml", "Type": "Sulfate-Free" }, offers: [
    { marketplace: "AliExpress", price: 6.90,  url: "https://aliexpress.com/item/shampoo" },
    { marketplace: "Amazon",     price: 9.99,  url: "https://amazon.in/s?k=argan-shampoo" },
    { marketplace: "Flipkart",   price: 10.50, url: "https://flipkart.com/search?q=shampoo" }
  ]},
  { id: 19, name: "Keratin Smooth Hair Serum",           cat: "hair-products",   rating: 4.4, reviews: 604,  tag: "-33%", glyph: "🧴", grad: "#FF6B4A, #1E212C", specs: { "Volume": "100ml", "Benefit": "Frizz Control" }, offers: [
    { marketplace: "DHGate",     price: 7.40,  url: "https://dhgate.com/search?key=hair-serum" },
    { marketplace: "AliExpress", price: 8.90,  url: "https://aliexpress.com/item/serum" },
    { marketplace: "Amazon",     price: 11.00, url: "https://amazon.in/s?k=hair-serum" }
  ]},
  { id: 20, name: "Vitamin C Brightening Face Serum",    cat: "skincare",        rating: 4.6, reviews: 1420, tag: "-34%", glyph: "🧖", grad: "#5EEAD4, #2A2E3A", specs: { "Volume": "30ml", "Key Ingredient": "Vitamin C" }, offers: [
    { marketplace: "AliExpress", price: 9.90,  url: "https://aliexpress.com/item/face-serum" },
    { marketplace: "Amazon",     price: 13.49, url: "https://amazon.in/s?k=vitamin-c-serum" },
    { marketplace: "Flipkart",   price: 15.00, url: "https://flipkart.com/search?q=serum" }
  ]},
  { id: 21, name: "Hydrating Hyaluronic Moisturizer",    cat: "skincare",        rating: 4.5, reviews: 980,  tag: "-34%", glyph: "🧴", grad: "#FF6B4A, #2A2E3A", specs: { "Volume": "50ml", "Skin Type": "All" }, offers: [
    { marketplace: "Alibaba",    price: 8.20,  url: "https://alibaba.com/search?wd=moisturizer" },
    { marketplace: "AliExpress", price: 9.80,  url: "https://aliexpress.com/item/moisturizer" },
    { marketplace: "Amazon",     price: 12.50, url: "https://amazon.in/s?k=moisturizer" }
  ]},
  { id: 22, name: "Rechargeable Face Trimmer",           cat: "face-trimmers",   rating: 4.4, reviews: 655,  tag: "-32%", glyph: "🪒", grad: "#5EEAD4, #171A23", specs: { "Battery": "USB Rechargeable", "Waterproof": "Yes" }, offers: [
    { marketplace: "AliExpress", price: 12.90, url: "https://aliexpress.com/item/face-trimmer" },
    { marketplace: "Amazon",     price: 17.50, url: "https://amazon.in/s?k=face-trimmer" },
    { marketplace: "Flipkart",   price: 19.00, url: "https://flipkart.com/search?q=trimmer" }
  ]},
  { id: 23, name: "Precision Beard & Detail Trimmer",    cat: "face-trimmers",   rating: 4.6, reviews: 812,  tag: "-31%", glyph: "🪒", grad: "#FF6B4A, #1E212C", specs: { "Blade": "Stainless Steel", "Attachments": "4" }, offers: [
    { marketplace: "Banggood",   price: 16.50, url: "https://banggood.com/search?key=beard-trimmer" },
    { marketplace: "AliExpress", price: 19.20, url: "https://aliexpress.com/item/trimmer" },
    { marketplace: "Amazon",     price: 24.00, url: "https://amazon.in/s?k=beard-trimmer" }
  ]},
  { id: 24, name: "12-Color Matte Eyeshadow Palette",    cat: "makeup",          rating: 4.5, reviews: 1340, tag: "-34%", glyph: "💄", grad: "#5EEAD4, #2A2E3A", specs: { "Shades": "12", "Finish": "Matte" }, offers: [
    { marketplace: "Shein",      price: 7.90,  url: "https://shein.com/search?wd=eyeshadow" },
    { marketplace: "AliExpress", price: 9.50,  url: "https://aliexpress.com/item/eyeshadow" },
    { marketplace: "Amazon",     price: 12.00, url: "https://amazon.in/s?k=eyeshadow-palette" }
  ]},
  { id: 25, name: "Long-Wear Matte Liquid Lipstick",     cat: "makeup",          rating: 4.4, reviews: 2010, tag: "-36%", glyph: "💋", grad: "#FF6B4A, #2A2E3A", specs: { "Finish": "Matte", "Wear Time": "12hrs" }, offers: [
    { marketplace: "AliExpress", price: 4.50,  url: "https://aliexpress.com/item/lipstick" },
    { marketplace: "Shein",      price: 5.50,  url: "https://shein.com/search?wd=lipstick" },
    { marketplace: "Amazon",     price: 7.00,  url: "https://amazon.in/s?k=liquid-lipstick" }
  ]},

  // ---------- ELECTRONICS & HOME ----------
  { id: 26, name: "NimbusHub Smart Speaker",             cat: "electronics",       rating: 4.2, reviews: 689,  tag: "-22%", glyph: "🔊", grad: "#5EEAD4, #171A23", specs: { "Output": "10W", "Connectivity": "Bluetooth 5.3", "Battery": "12hrs" }, offers: [
    { marketplace: "AliExpress", price: 34.50, url: "https://aliexpress.com/item/smart-speaker" },
    { marketplace: "Amazon",     price: 39.99, url: "https://amazon.in/s?k=smart-speaker" },
    { marketplace: "Flipkart",   price: 44.00, url: "https://flipkart.com/search?q=speaker" }
  ]},
  { id: 27, name: "ClearView Smartwatch Pro",            cat: "electronics",       rating: 4.4, reviews: 977,  tag: "-28%", glyph: "⌚", grad: "#FF6B4A, #1E212C", specs: { "Display": "1.9\" AMOLED", "Battery": "10 days", "Waterproof": "IP68" }, offers: [
    { marketplace: "DHGate",     price: 42.90, url: "https://dhgate.com/search?key=smartwatch" },
    { marketplace: "AliExpress", price: 48.50, url: "https://aliexpress.com/item/smartwatch" },
    { marketplace: "Amazon",     price: 59.90, url: "https://amazon.in/s?k=smartwatch" }
  ]},
  { id: 28, name: "OrbitPad 10.5\" Tablet",               cat: "electronics",       rating: 4.3, reviews: 421,  tag: "-20%", glyph: "📱", grad: "#5EEAD4, #2A2E3A", specs: { "Screen": "10.5\" IPS", "Storage": "128GB", "Battery": "7000mAh" }, offers: [
    { marketplace: "Geekbuying", price: 159.00, url: "https://geekbuying.com/search?key=tablet" },
    { marketplace: "Banggood",   price: 179.00, url: "https://banggood.com/search?key=tablet" },
    { marketplace: "Amazon",     price: 199.00, url: "https://amazon.in/s?k=tablet" }
  ]},
  { id: 29, name: "2-Slice Stainless Toaster",           cat: "kitchen-appliances",rating: 4.4, reviews: 540,  tag: "-31%", glyph: "🍞", grad: "#FF6B4A, #2A2E3A", specs: { "Power": "800W", "Slots": "2" }, offers: [
    { marketplace: "AliExpress", price: 15.90, url: "https://aliexpress.com/item/toaster" },
    { marketplace: "Amazon",     price: 20.99, url: "https://amazon.in/s?k=toaster" },
    { marketplace: "Flipkart",   price: 23.00, url: "https://flipkart.com/search?q=toaster" }
  ]},
  { id: 30, name: "Digital Air Fryer 4.5L",              cat: "kitchen-appliances",rating: 4.6, reviews: 1330, tag: "-30%", glyph: "🍟", grad: "#5EEAD4, #171A23", specs: { "Capacity": "4.5L", "Power": "1400W", "Presets": "8" }, offers: [
    { marketplace: "Banggood",   price: 38.00, url: "https://banggood.com/search?key=air-fryer" },
    { marketplace: "AliExpress", price: 44.50, url: "https://aliexpress.com/item/air-fryer" },
    { marketplace: "Amazon",     price: 54.00, url: "https://amazon.in/s?k=air-fryer" }
  ]},
  { id: 31, name: "Handheld Immersion Blender Set",      cat: "kitchen-appliances",rating: 4.3, reviews: 402,  tag: "-31%", glyph: "🥣", grad: "#FF6B4A, #1E212C", specs: { "Power": "600W", "Attachments": "3" }, offers: [
    { marketplace: "DHGate",     price: 17.20, url: "https://dhgate.com/search?key=blender" },
    { marketplace: "AliExpress", price: 20.00, url: "https://aliexpress.com/item/blender" },
    { marketplace: "Amazon",     price: 25.00, url: "https://amazon.in/s?k=hand-blender" }
  ]},
  { id: 32, name: "Pulse X12 Smartphone 128GB",          cat: "smartphones",       rating: 4.5, reviews: 2210, tag: "-21%", glyph: "📱", grad: "#5EEAD4, #2A2E3A", specs: { "Display": "6.5\" AMOLED", "RAM": "8GB", "Storage": "128GB", "Camera": "50MP" }, offers: [
    { marketplace: "AliExpress", price: 189.00, url: "https://aliexpress.com/item/smartphone" },
    { marketplace: "Geekbuying", price: 210.00, url: "https://geekbuying.com/search?key=phone" },
    { marketplace: "Amazon",     price: 239.00, url: "https://amazon.in/s?k=smartphone" }
  ]},
  { id: 33, name: "Aegis Mini Budget Smartphone 64GB",   cat: "smartphones",       rating: 4.2, reviews: 860,  tag: "-24%", glyph: "📱", grad: "#FF6B4A, #2A2E3A", specs: { "Display": "6.1\" LCD", "RAM": "4GB", "Storage": "64GB" }, offers: [
    { marketplace: "Alibaba",    price: 89.90, url: "https://alibaba.com/search?wd=smartphone" },
    { marketplace: "AliExpress", price: 105.00, url: "https://aliexpress.com/item/phone" },
    { marketplace: "Amazon",     price: 119.00, url: "https://amazon.in/s?k=budget-phone" }
  ]},

  // ---------- KIDS ----------
  { id: 34, name: "Kids Cotton Graphic T-Shirt Set",     cat: "kids-clothes-footwear", rating: 4.5, reviews: 640,  tag: "-34%", glyph: "👕", grad: "#5EEAD4, #171A23", specs: { "Material": "Cotton", "Age": "2–10 yrs" }, offers: [
    { marketplace: "Shein",      price: 9.90,  url: "https://shein.com/search?wd=kids-tshirt" },
    { marketplace: "AliExpress", price: 12.00, url: "https://aliexpress.com/item/kids-shirt" },
    { marketplace: "Amazon",     price: 15.00, url: "https://amazon.in/s?k=kids-clothing" }
  ]},
  { id: 35, name: "Kids Light-Up Sneakers",              cat: "kids-clothes-footwear", rating: 4.6, reviews: 780,  tag: "-33%", glyph: "👟", grad: "#FF6B4A, #1E212C", specs: { "Feature": "LED Sole", "Sizes": "24–34" }, offers: [
    { marketplace: "AliExpress", price: 13.50, url: "https://aliexpress.com/item/kids-shoes" },
    { marketplace: "Amazon",     price: 18.00, url: "https://amazon.in/s?k=kids-sneakers" },
    { marketplace: "Flipkart",   price: 20.00, url: "https://flipkart.com/search?q=kids-shoes" }
  ]},
  { id: 36, name: "Building Blocks Creative Set 500pc",  cat: "kids-toys",         rating: 4.7, reviews: 1520, tag: "-32%", glyph: "🧱", grad: "#5EEAD4, #2A2E3A", specs: { "Pieces": "500", "Age": "4+" }, offers: [
    { marketplace: "AliExpress", price: 16.90, url: "https://aliexpress.com/item/building-blocks" },
    { marketplace: "Amazon",     price: 21.99, url: "https://amazon.in/s?k=building-blocks" },
    { marketplace: "Flipkart",   price: 25.00, url: "https://flipkart.com/search?q=blocks" }
  ]},
  { id: 37, name: "Remote Control Stunt Car",            cat: "kids-toys",         rating: 4.5, reviews: 910,  tag: "-34%", glyph: "🚗", grad: "#FF6B4A, #2A2E3A", specs: { "Battery": "Rechargeable", "Speed": "20km/h" }, offers: [
    { marketplace: "Banggood",   price: 21.00, url: "https://banggood.com/search?key=rc-car" },
    { marketplace: "AliExpress", price: 25.00, url: "https://aliexpress.com/item/rc-car" },
    { marketplace: "Amazon",     price: 32.00, url: "https://amazon.in/s?k=remote-control-car" }
  ]},

  // ---------- PETS ----------
  { id: 38, name: "Grain-Free Dry Dog Food 3kg",         cat: "pet-food",          rating: 4.6, reviews: 640,  tag: "-26%", glyph: "🦴", grad: "#5EEAD4, #171A23", specs: { "Weight": "3kg", "Type": "Grain-Free" }, offers: [
    { marketplace: "AliExpress", price: 14.90, url: "https://aliexpress.com/item/dog-food" },
    { marketplace: "Amazon",     price: 17.99, url: "https://amazon.in/s?k=dog-food" },
    { marketplace: "Flipkart",   price: 20.00, url: "https://flipkart.com/search?q=dog-food" }
  ]},
  { id: 39, name: "Salmon Recipe Cat Food 2kg",          cat: "pet-food",          rating: 4.5, reviews: 505,  tag: "-28%", glyph: "🐟", grad: "#FF6B4A, #1E212C", specs: { "Weight": "2kg", "Flavor": "Salmon" }, offers: [
    { marketplace: "Alibaba",    price: 11.50, url: "https://alibaba.com/search?wd=cat-food" },
    { marketplace: "AliExpress", price: 13.80, url: "https://aliexpress.com/item/cat-food" },
    { marketplace: "Amazon",     price: 16.00, url: "https://amazon.in/s?k=cat-food" }
  ]},
  { id: 40, name: "Self-Cleaning Slicker Brush",         cat: "pet-products",      rating: 4.4, reviews: 720,  tag: "-34%", glyph: "🐕", grad: "#5EEAD4, #2A2E3A", specs: { "Type": "Slicker Brush", "Suitable For": "Dogs & Cats" }, offers: [
    { marketplace: "AliExpress", price: 6.90,  url: "https://aliexpress.com/item/pet-brush" },
    { marketplace: "Amazon",     price: 9.49,  url: "https://amazon.in/s?k=pet-brush" },
    { marketplace: "Flipkart",   price: 10.50, url: "https://flipkart.com/search?q=brush" }
  ]},
  { id: 41, name: "Automatic Pet Water Fountain 2L",     cat: "pet-products",      rating: 4.5, reviews: 940,  tag: "-31%", glyph: "💧", grad: "#FF6B4A, #2A2E3A", specs: { "Capacity": "2L", "Filter": "Included" }, offers: [
    { marketplace: "Banggood",   price: 15.90, url: "https://banggood.com/search?key=pet-fountain" },
    { marketplace: "AliExpress", price: 18.50, url: "https://aliexpress.com/item/water-fountain" },
    { marketplace: "Amazon",     price: 23.00, url: "https://amazon.in/s?k=pet-fountain" }
  ]},
  { id: 42, name: "Adjustable Padded Dog Harness",       cat: "pet-accessories",   rating: 4.6, reviews: 1105, tag: "-34%", glyph: "🐾", grad: "#5EEAD4, #171A23", specs: { "Sizes": "S–XL", "Material": "Padded Nylon" }, offers: [
    { marketplace: "AliExpress", price: 8.90,  url: "https://aliexpress.com/item/dog-harness" },
    { marketplace: "Amazon",     price: 12.00, url: "https://amazon.in/s?k=dog-harness" },
    { marketplace: "Flipkart",   price: 13.50, url: "https://flipkart.com/search?q=harness" }
  ]},
  { id: 43, name: "Cozy Orthopedic Pet Bed",             cat: "pet-accessories",   rating: 4.7, reviews: 830,  tag: "-31%", glyph: "🛏️", grad: "#FF6B4A, #2A2E3A", specs: { "Size": "M/L", "Washable Cover": "Yes" }, offers: [
    { marketplace: "DHGate",     price: 19.90, url: "https://dhgate.com/search?key=pet-bed" },
    { marketplace: "AliExpress", price: 22.50, url: "https://aliexpress.com/item/bed" },
    { marketplace: "Amazon",     price: 29.00, url: "https://amazon.in/s?k=pet-bed" }
  ]}
];

// Add derived fields: cheapest offer, seller, price
// (Currency conversion happens in frontend app.js based on user's location)
//
// NOTE ON "was" PRICE: this used to be a fabricated number (cheapest * 1.45),
// which is a fake reference/"was" price and a real legal risk (FTC/CMA/CCPA
// rules on reference pricing). It has been replaced with the HIGHEST real
// offer price found among this product's actual marketplace listings, so
// every "was" price and every discount % shown on the site now reflects a
// genuine price that a real seller is genuinely charging.
const products = rawProducts.map(p => {
  const cheapest = p.offers.reduce((a, b) => a.price < b.price ? a : b);
  const highest  = p.offers.reduce((a, b) => a.price > b.price ? a : b);
  const hasSpread = highest.price > cheapest.price;
  const discountPct = hasSpread
    ? Math.round(((highest.price - cheapest.price) / highest.price) * 100)
    : 0;
  return {
    ...p,
    price: cheapest.price,
    seller: cheapest.marketplace,
    was: hasSpread ? highest.price : cheapest.price,
    tag: hasSpread ? `-${discountPct}%` : 'Compare prices',
    group: findGroupFor(p.cat)
  };
});
