const API = "https://shopnexa-backend.onrender.com/api";
if (!getToken()) {
  alert("Please login as admin first");
  window.location.href = "login.html";
}

async function loadStats() {
  const res = await fetch(`${API}/admin/analytics`, {
    headers: authHeader()
  });

  const data = await res.json();

  console.log("Analytics Response:", data);

  if (!data.success) {
    alert(data.message);
    return;
  }

  document.getElementById("statsGrid").innerHTML = `
    <div class="stat-card"><div class="num">${data.analytics.totalProducts}</div><div class="label">Products</div></div>
    <div class="stat-card"><div class="num">${data.analytics.totalUsers}</div><div class="label">Users</div></div>
    <div class="stat-card"><div class="num">${data.analytics.totalClicks}</div><div class="label">Clicks</div></div>
    <div class="stat-card"><div class="num">${data.analytics.totalReviews}</div><div class="label">Reviews</div></div>
  `;
}

async function loadProducts() {
  const res = await fetch(`${API}/admin/products`, { headers: authHeader() });
  const data = await res.json();
  if (!data.success) return;

  document.getElementById("productList").innerHTML = data.products.map(p => `
    <div class="admin-row">
      <span>${p.name} — ₹${p.price} (${p.category})</span>
      <button onclick="deleteProduct('${p._id}')">Delete</button>
    </div>
  `).join("");
}

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

  // Naye Store Links aur Prices (Offers) ko array mein pack karna
  const offers = [];
  const offerRows = document.querySelectorAll(".offer-row");
  
  offerRows.forEach(row => {
    const store = row.querySelector(".of-store").value.trim();
    const offerPrice = row.querySelector(".of-price").value;
    const url = row.querySelector(".of-url").value.trim();

    // Agar teeno fields (Store, Price, URL) bhari hain, tabhi offer add karo
    if (store && offerPrice && url) {
      offers.push({
        store: store,
        price: Number(offerPrice),
        url: url
      });
    }
  });

  try {
    const res = await fetch(`${API}/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({ 
        name, 
        category, 
        price: Number(price), 
        brand,
        images: image ? [image] : [], 
        offers: offers 
      }),
    });
    
    const data = await res.json();

    if (data.success) {
      showToast("Product successfully added!");
      
      // Form ko clear karna
      document.getElementById("apName").value = "";
      document.getElementById("apCategory").value = "";
      document.getElementById("apPrice").value = "";
      document.getElementById("apBrand").value = "";
      document.getElementById("apImage").value = "";
      document.querySelectorAll(".offer-row input").forEach(inpt => inpt.value = "");
      
      // List ko refresh karna
      loadProducts();
      loadStats();
    } else {
      showToast(data.message || "Failed to add product");
    }
  } catch (error) {
    console.error("Add Product Error:", error);
    showToast("Server error! Backend check karo.");
  }
});

loadStats();
loadProducts();