const API = "https://shopnexa-backend.onrender.com/api";
if (!getToken()) {
  alert("Please login as admin first");
  window.location.href = "login.html";
}

let editingProductId = null;

async function loadStats() {
  const res = await fetch(`${API}/admin/analytics`, {
    headers: authHeader()
  });

  const data = await res.json();

  if (!data.success) {
    alert(data.message);
    return;
  }

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card" style="cursor:pointer;" onclick="showDetail('products')">
      <div class="num">${data.analytics.totalProducts}</div>
      <div class="label">Products</div>
    </div>

    <div class="stat-card" style="cursor:pointer;" onclick="showDetail('users')">
      <div class="num">${data.analytics.totalUsers}</div>
      <div class="label">Users</div>
    </div>

    <div class="stat-card" style="cursor:pointer;" onclick="showDetail('clicks')">
      <div class="num">${data.analytics.totalClicks}</div>
      <div class="label">Clicks</div>
    </div>

    <div class="stat-card" style="cursor:pointer;" onclick="showDetail('reviews')">
      <div class="num">${data.analytics.totalReviews}</div>
      <div class="label">Reviews</div>
    </div>
  `;
}

async function showDetail(type) {
  const box = document.getElementById("detailList");
  box.innerHTML = `<p>Loading ${type}...</p>`;

  const endpoints = {
    products: "admin/products",
    users: "admin/users",
    clicks: "admin/clicks",
    reviews: "admin/reviews"
  };

  const res = await fetch(`${API}/${endpoints[type]}`, { headers: authHeader() });
  const data = await res.json();

  if (!data.success) {
    box.innerHTML = `<p>Failed to load ${type}</p>`;
    return;
  }

  const list = data.data || data.products || [];

  if (list.length === 0) {
    box.innerHTML = `<p>No ${type} found.</p>`;
    return;
  }

  let rows = "";

  if (type === "products") {
    rows = list.map(p => `<div class="admin-row"><span>${p.name} — ₹${p.price} (${p.category})</span></div>`).join("");
  } else if (type === "users") {
    rows = list.map(u => `<div class="admin-row"><span>${u.name} — ${u.email} (${u.role})</span></div>`).join("");
  } else if (type === "clicks") {
    rows = list.map(c => `<div class="admin-row"><span>${c.product?.name || "Unknown product"} — ${new Date(c.createdAt).toLocaleString()}</span></div>`).join("");
  } else if (type === "reviews") {
    rows = list.map(r => `<div class="admin-row"><span>${r.product?.name || "Unknown product"} — ★ ${r.rating} — "${r.comment || ""}"</span></div>`).join("");
  }

  box.innerHTML = `
    <h3 style="margin-bottom:10px; text-transform:capitalize;">${type}</h3>
    ${rows}
  `;
}
window.showDetail = showDetail;

async function loadProducts(keyword = "") {
  const url = keyword
    ? `${API}/admin/products?keyword=${encodeURIComponent(keyword)}`
    : `${API}/admin/products`;

  const res = await fetch(url, { headers: authHeader() });
  const data = await res.json();
  if (!data.success) return;

  if (data.products.length === 0) {
    document.getElementById("productList").innerHTML = `<p style="color:var(--text-muted);">No products found.</p>`;
    return;
  }

  document.getElementById("productList").innerHTML = data.products.map(p => `
    <div class="admin-row">
      <span>${p.name} — ₹${p.price} (${p.category})</span>
      <button onclick="editProduct('${p._id}', '${p.name.replace(/'/g, "\\'")}', '${p.category}', ${p.price}, '${(p.brand || "").replace(/'/g, "\\'")}', '${(p.images && p.images[0]) || ""}')">Edit</button>
      <button onclick="deleteProduct('${p._id}')">Delete</button>
    </div>
  `).join("");
}

let adminSearchDebounce;
document.getElementById("adminSearchInput").addEventListener("input", (e) => {
  clearTimeout(adminSearchDebounce);
  adminSearchDebounce = setTimeout(() => {
    loadProducts(e.target.value.trim());
  }, 300);
});

function editProduct(id, name, category, price, brand, image) {
  editingProductId = id;

  document.getElementById("apName").value = name;
  document.getElementById("apCategory").value = category;
  document.getElementById("apPrice").value = price;
  document.getElementById("apBrand").value = brand;
  document.getElementById("apImage").value = image;

  document.getElementById("addProductBtn").textContent = "Update Product";
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("Editing product — update fields and click 'Update Product'");
}
window.editProduct = editProduct;

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;
  await fetch(`${API}/admin/products/${id}`, { method: "DELETE", headers: authHeader() });
  loadProducts();
  loadStats();
}
window.deleteProduct = deleteProduct;

document.getElementById("addProductBtn").addEventListener("click", async () => {
  const name = document.getElementById("apName").value.trim();
  const category = document.getElementById("apCategory").value.trim();
  const price = document.getElementById("apPrice").value;
  const brand = document.getElementById("apBrand").value.trim();
  const image = document.getElementById("apImage").value.trim();

  if (!name || !category || !price) { 
    showToast("Name, Category, and Base Price are required!"); 
    return; 
  }

  const offers = [];
  const offerRows = document.querySelectorAll(".offer-row");
  
  offerRows.forEach(row => {
    const store = row.querySelector(".of-store").value.trim();
    const offerPrice = row.querySelector(".of-price").value;
    const url = row.querySelector(".of-url").value.trim();

    if (store && offerPrice && url) {
      offers.push({
        store: store,
        price: Number(offerPrice),
        url: url
      });
    }
  });

  const isEditing = !!editingProductId;
  const url = isEditing ? `${API}/admin/products/${editingProductId}` : `${API}/admin/products`;
  const method = isEditing ? "PUT" : "POST";

  const body = { name, category, price: Number(price), brand, images: image ? [image] : [] };
  if (offers.length > 0) body.offers = offers;

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify(body),
    });
    
    const data = await res.json();

    if (data.success) {
      showToast(isEditing ? "Product updated!" : "Product successfully added!");
      
      document.getElementById("apName").value = "";
      document.getElementById("apCategory").value = "";
      document.getElementById("apPrice").value = "";
      document.getElementById("apBrand").value = "";
      document.getElementById("apImage").value = "";
      document.querySelectorAll(".offer-row input").forEach(inpt => inpt.value = "");
      
      editingProductId = null;
      document.getElementById("addProductBtn").textContent = "Add Product";

      loadProducts();
      loadStats();
    } else {
      showToast(data.message || "Failed to save product");
    }
  } catch (error) {
    console.error("Save Product Error:", error);
    showToast("Server error! Backend check karo.");
  }
});

loadStats();
loadProducts();