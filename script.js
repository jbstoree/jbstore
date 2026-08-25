// ==========================================
// JB STORE - NEW SCRIPT (Supabase Version)
// ==========================================

// ===== 1. SUPABASE CLIENT =====
const { createClient } = supabase;

// 🔑 Replace with YOUR keys
const SUPABASE_URL = 'https://iuucwxdkjqpecqwbsoyv.supabase.co'; 
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dWN3eGRranFwZWNxd2Jzb3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NjU4MTksImV4cCI6MjEwMzA0MTgxOX0.UPQ7jf3C_9DX9Jr1y-g6JIxBe2EHOlMAn4CZZyQgLDQ'; 

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON);

// ===== 2. ALL PRODUCTS (Global) =====
let allProducts = [];

// ===== 3. LOAD PRODUCTS FROM SUPABASE =====
async function loadProductsFromSupabase() {
  const { data, error } = await supabaseClient
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  
  allProducts = data;
  console.log('✅ Loaded', allProducts.length, 'products from Supabase');
  return allProducts;
}

// ===== 4. BRAND DATA (Static) =====
const brands = {
  sealpack: ["iPhone", "OnePlus", "Samsung", "Google Pixel", "Vivo", "OPPO"],
  sealcut: ["iPhone", "Samsung", "OnePlus"],
  second: ["iPhone", "Samsung", "OnePlus", "Vivo"],
  mobiles: ["iPhone", "OnePlus", "Samsung", "Google Pixel", "Vivo", "OPPO"],
  fridge: ["LG", "Samsung", "Godrej", "Haier", "Whirlpool"],
  washing: ["LG", "Samsung", "IFB", "Bosch", "Haier", "Whirlpool"],
  ac: ["Daikin", "LG", "Voltas", "Blue Star", "Samsung"],
  tv: ["Sony", "Samsung", "LG", "TCL", "Xiaomi"]
};

let currentCategory = "mobiles";
let selectedBrand = null;

// ===== 5. ELEMENTS =====
const brandBox = document.getElementById("brandFilters");
const productGrid = document.getElementById("productGrid");
const productTitle = document.getElementById("productTitle");
const clearFilter = document.getElementById("clearFilter");

// ===== 6. LOAD BRAND BUTTONS =====
function loadBrands(category) {
  if (!brandBox) return;
  brandBox.innerHTML = "";
  selectedBrand = null;
  const categoryBrands = brands[category] || [];
  const uniqueBrands = [...new Set(categoryBrands)];

  uniqueBrands.forEach(brand => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";

    const logoMap = {
      "iPhone": "images/apple.png", "OnePlus": "images/oneplus.png", "Samsung": "images/samsung-logo.png",
      "Google Pixel": "images/google.png", "Vivo": "images/vivo.png", "OPPO": "images/oppo.png",
      "LG": "images/lg.png", "Godrej": "images/godrej.png", "Haier": "images/haier.png",
      "Whirlpool": "images/whirlpool.png", "IFB": "images/ifb.png", "Bosch": "images/bosch.png",
      "Daikin": "images/daikin.png", "Voltas": "images/voltas.png", "Blue Star": "images/bluestar.png",
      "Sony": "images/sony.png", "TCL": "images/tcl.png", "Xiaomi": "images/xiaomi.png",
      "Realme": "images/realme.png"
    };

    const logo = document.createElement("img");
    logo.src = logoMap[brand] || "";
    logo.alt = brand;
    const name = document.createElement("span");
    name.textContent = brand;
    chip.appendChild(logo);
    chip.appendChild(name);

    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("on"));
      chip.classList.add("on");
      selectedBrand = brand;
      displayProducts();
    });
    brandBox.appendChild(chip);
  });
}

// ===== 7. DISPLAY PRODUCTS =====
function displayProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = "";

  let products = allProducts;

  // Category filter
  if (currentCategory === "sealpack") {
    products = products.filter(p => p.category === "mobiles" && p.condition === "Seal Pack");
  } else if (currentCategory === "sealcut") {
    products = products.filter(p => p.category === "mobiles" && p.condition === "Seal Cut");
  } else if (currentCategory === "second") {
    products = products.filter(p => p.category === "mobiles" && p.condition === "2nd Hand");
  } else if (currentCategory === "mobiles") {
    products = products.filter(p => p.category === "mobiles");
  } else {
    products = products.filter(p => p.category === currentCategory);
  }

  // Brand filter
  if (selectedBrand) {
    products = products.filter(p => p.brand === selectedBrand);
  }

  if (products.length === 0) {
    productGrid.innerHTML = `<div class="no-products"><h3>No products found</h3><p>Try another brand.</p></div>`;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "deal-card";
    const firstVariant = (product.variants && product.variants.length > 0) ? product.variants[0].label : null;
    let variantHTML = firstVariant ? `<div style="display:inline-block;background:rgba(212,175,55,0.12);color:#D4AF37;font-size:11px;font-weight:600;padding:2px 10px;border-radius:12px;margin:4px 0;border:1px solid rgba(212,175,55,0.15);">📱 ${firstVariant}</div>` : '';

    card.innerHTML = `
      <span class="offer">${product.discount || ''}</span>
      <img src="${product.image || product.images?.[0] || ''}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="brand">${product.brand} • ${product.condition || "New"}</p>
      ${variantHTML}
      <div class="rating">⭐ ${product.rating || '4.5'} <span>(${product.reviews || 0})</span></div>
      <p class="price">₹${(product.price || 0).toLocaleString("en-IN")}</p>
      <p class="old-price">₹${(product.oldPrice || 0).toLocaleString("en-IN")}</p>
      <div class="deal-actions">
        <button type="button" class="view-details-btn" onclick="viewProduct('${product.id}')">🔍 View Details</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// ===== 8. VIEW PRODUCT =====
function viewProduct(id) {
  const product = allProducts.find(item => item.id === id);
  if (!product) { showToast('Product not found!'); return; }
  localStorage.setItem('selectedProduct', JSON.stringify({ id: product.id }));
  window.location.href = `product.html?id=${product.id}`;
}

// ===== 9. CATEGORY CLICKS =====
document.querySelectorAll(".cat").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".cat").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.cat;
    selectedBrand = null;
    loadBrands(currentCategory);
    displayProducts();
  });
});

// ===== 10. CLEAR FILTER =====
if (clearFilter) {
  clearFilter.addEventListener("click", () => {
    selectedBrand = null;
    document.querySelectorAll(".chip").forEach(chip => chip.classList.remove("on"));
    displayProducts();
  });
}

// ===== 11. CART FUNCTIONS =====
function addToCart(productId, variantLabel) {
  const product = allProducts.find(item => item.id === productId);
  if (!product) { showToast('Product not found!'); return; }
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let price = product.price;
  let variantName = '';
  if (variantLabel && product.variants) {
    const variant = product.variants.find(v => v.label === variantLabel);
    if (variant) { price = variant.price; variantName = variantLabel; }
  }
  const uniqueId = variantName ? `${product.id}_${variantName}` : product.id;
  const existingItem = cart.find(item => item.id === uniqueId);
  const displayName = variantName ? `${product.name} (${variantName})` : product.name;
  if (existingItem) {
    existingItem.quantity += 1;
    showToast(`📦 ${displayName} quantity updated!`);
  } else {
    cart.push({
      id: uniqueId,
      name: product.name,
      brand: product.brand,
      price: price,
      image: product.image || product.images?.[0] || '',
      quantity: 1,
      variant: variantName || 'Default'
    });
    showToast(`✅ ${displayName} added to cart!`);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">✕</button>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== 12. SEARCH SUGGESTIONS (Simplified) =====
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchSuggestions = document.getElementById("searchSuggestions");

function createSearchSuggestions() {
  const text = searchInput?.value?.trim().toLowerCase();
  if (!searchSuggestions) return;
  searchSuggestions.innerHTML = "";
  if (!text || text === "") { searchSuggestions.classList.remove("show"); return; }

  const matches = allProducts.filter(p => 
    p.name.toLowerCase().includes(text) || p.brand.toLowerCase().includes(text)
  ).slice(0, 6);

  if (matches.length === 0) {
    searchSuggestions.innerHTML = `<div class="search-no-result">No products found</div>`;
    searchSuggestions.classList.add("show");
    return;
  }
  matches.forEach(product => {
    const row = document.createElement("div");
    row.className = "search-suggestion";
    row.innerHTML = `
      <img src="${product.image}" alt="">
      <div class="suggestion-info">
        <div class="suggestion-name">${product.name}</div>
        <div class="suggestion-category">${product.brand}</div>
      </div>
    `;
    row.addEventListener("click", () => window.location.href = `product.html?id=${product.id}`);
    searchSuggestions.appendChild(row);
  });
  searchSuggestions.classList.add("show");
}

if (searchInput) {
  searchInput.addEventListener("input", createSearchSuggestions);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = searchInput.value.trim();
      if (val) window.location.href = "search.html?q=" + encodeURIComponent(val);
    }
  });
}
if (searchButton) {
  searchButton.addEventListener("click", () => {
    const val = searchInput?.value?.trim();
    if (val) window.location.href = "search.html?q=" + encodeURIComponent(val);
  });
}
document.addEventListener("click", (e) => {
  if (searchInput && searchSuggestions && 
      !searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
    searchSuggestions.classList.remove("show");
  }
});

// ===== 13. INITIALIZATION =====
async function init() {
  await loadProductsFromSupabase();
  loadBrands("mobiles");
  displayProducts();
  updateCartBadge();
}

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("pageshow", updateCartBadge);

// Category Cards (Shop by Category)
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    const btn = document.querySelector(`.cat[data-cat="${category}"]`);
    if (btn) btn.click();
    document.querySelector(".deals")?.scrollIntoView({ behavior: "smooth" });
  });
});
