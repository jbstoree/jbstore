// ==========================================
// JB STORE - MAIN JAVASCRIPT
// ==========================================

// ==========================================
// 1. BANNER SLIDER
// ==========================================

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let current = 0;

function showSlide(index) {
  if (!slides.length) return;

  slides.forEach(slide => {
    slide.classList.remove("active");
  });

  dots.forEach(dot => {
    dot.classList.remove("active");
  });

  slides[index].classList.add("active");

  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

if (slides.length > 1) {
  setInterval(() => {
    current = (current + 1) % slides.length;
    showSlide(current);
  }, 3500);
}

// ==========================================
// 2. ALL PRODUCTS
// ==========================================

const allProducts = [
  ...mobileProducts,
  ...refrigeratorProducts,
  ...washingProducts,
  ...acProducts,
  ...tvProducts
];

console.log('Total products loaded:', allProducts.length);

// ==========================================
// 3. BRAND DATA
// ==========================================

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

// ==========================================
// 4. CURRENT FILTER
// ==========================================

let currentCategory = "mobiles";
let selectedBrand = null;

// ==========================================
// 5. ELEMENTS
// ==========================================

const brandBox = document.getElementById("brandFilters");
const productGrid = document.getElementById("productGrid");
const productTitle = document.getElementById("productTitle");
const clearFilter = document.getElementById("clearFilter");

// ==========================================
// 6. LOAD BRAND BUTTONS
// ==========================================

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
      "iPhone": "images/apple.png",
      "OnePlus": "images/oneplus.png",
      "Samsung": "images/samsung-logo.png",
      "Google Pixel": "images/google.png",
      "Vivo": "images/vivo.png",
      "OPPO": "images/oppo.png",
      "LG": "images/lg.png",
      "Godrej": "images/godrej.png",
      "Haier": "images/haier.png",
      "Whirlpool": "images/whirlpool.png",
      "IFB": "images/ifb.png",
      "Bosch": "images/bosch.png",
      "Daikin": "images/daikin.png",
      "Voltas": "images/voltas.png",
      "Blue Star": "images/bluestar.png",
      "Sony": "images/sony.png",
      "TCL": "images/tcl.png",
      "Xiaomi": "images/xiaomi.png",
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

// ==========================================
// 7. GET FIRST VARIANT
// ==========================================

function getFirstVariant(product) {
  if (product.variants && product.variants.length > 0) {
    return product.variants[0].label;
  }
  return null;
}

// ==========================================
// 8. DISPLAY PRODUCTS - WITH VARIANTS
// ==========================================

function displayProducts() {
  if (!productGrid) return;

  productGrid.innerHTML = "";

  let products;

  if (currentCategory === "sealpack") {
    products = allProducts.filter(product => product.category === "mobiles" && product.condition === "Seal Pack");
  } else if (currentCategory === "sealcut") {
    products = allProducts.filter(product => product.category === "mobiles" && product.condition === "Seal Cut");
  } else if (currentCategory === "second") {
    products = allProducts.filter(product => product.category === "mobiles" && product.condition === "2nd Hand");
  } else if (currentCategory === "mobiles") {
    products = allProducts.filter(product => product.category === "mobiles");
  } else {
    products = allProducts.filter(product => product.category === currentCategory);
  }

  if (selectedBrand) {
    products = products.filter(product => product.brand === selectedBrand);
  }

  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="no-products">
        <h3>No products found</h3>
        <p>Try another brand.</p>
      </div>
    `;
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "deal-card";

    const firstVariant = getFirstVariant(product);
    let variantHTML = '';
    if (firstVariant) {
      variantHTML = `<div style="display:inline-block;background:rgba(212,175,55,0.12);color:#D4AF37;font-size:11px;font-weight:600;padding:2px 10px;border-radius:12px;margin:4px 0;border:1px solid rgba(212,175,55,0.15);">📱 ${firstVariant}</div>`;
    }

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
        <button type="button" class="view-details-btn" onclick="viewProduct('${product.id}')">
          🔍 View Details
        </button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// ==========================================
// 9. CATEGORY BUTTONS
// ==========================================

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

// ==========================================
// 10. CLEAR ALL
// ==========================================

if (clearFilter) {
  clearFilter.addEventListener("click", () => {
    selectedBrand = null;
    document.querySelectorAll(".chip").forEach(chip => chip.classList.remove("on"));
    displayProducts();
  });
}

// ==========================================
// 11. VIEW PRODUCT
// ==========================================

function viewProduct(id) {
  console.log('Viewing product with ID:', id);
  
  const product = allProducts.find(item => item.id === id);
  
  if (!product) {
    console.error('Product not found with ID:', id);
    showToast('Product not found!');
    return;
  }
  
  localStorage.setItem('selectedProduct', JSON.stringify({ 
    id: product.id,
    name: product.name,
    brand: product.brand
  }));
  
  window.location.href = `product.html?id=${product.id}`;
}

// ==========================================
// 12. CART FUNCTIONALITY
// ==========================================

function addToCart(productId, variantLabel) {
  const product = allProducts.find(item => item.id === productId);
  
  if (!product) {
    showToast('Product not found!');
    return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  let price = product.price;
  let variantName = '';
  
  if (variantLabel && product.variants) {
    const variant = product.variants.find(v => v.label === variantLabel);
    if (variant) {
      price = variant.price;
      variantName = variantLabel;
    }
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

// ==========================================
// 13. TOAST NOTIFICATION
// ==========================================

function showToast(message) {
  const existingToast = document.querySelector('.toast-notification');
  if (existingToast) existingToast.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast) {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}

// ==========================================
// 14. INITIAL LOAD
// ==========================================

loadBrands("mobiles");
displayProducts();

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});

window.addEventListener("pageshow", () => {
  updateCartBadge();
});

// ==========================================
// 15. SHOP BY CATEGORY CARDS
// ==========================================

document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.dataset.category;
    const categoryButton = document.querySelector(`.cat[data-cat="${category}"]`);
    if (categoryButton) categoryButton.click();
    const products = document.querySelector(".deals");
    if (products) products.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ==========================================
// 16. SMART BRAND + CATEGORY SEARCH
// ==========================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchSuggestions = document.getElementById("searchSuggestions");

const categoryNames = {
  mobiles: "Mobiles",
  sealpack: "Seal Pack Mobiles",
  sealcut: "Seal Cut Mobiles",
  second: "2nd Hand Mobiles",
  fridge: "Refrigerators",
  washing: "Washing Machines",
  ac: "AC",
  tv: "TV"
};

function createSearchSuggestions() {
  if (!searchInput || !searchSuggestions) return;

  const text = searchInput.value.trim().toLowerCase();
  searchSuggestions.innerHTML = "";

  if (text === "") {
    searchSuggestions.classList.remove("show");
    return;
  }

  const combinations = new Map();

  allProducts.forEach(product => {
    const brand = String(product.brand || "").trim();
    const category = String(product.category || "").trim();
    if (!brand || !category) return;

    const brandLower = brand.toLowerCase();
    const categoryLower = category.toLowerCase();

    if (brandLower.includes(text) || categoryLower.includes(text) || product.name.toLowerCase().includes(text)) {
      const key = `${brandLower}|${categoryLower}`;
      if (!combinations.has(key)) {
        combinations.set(key, {
          brand: brand,
          category: category,
          image: product.image || product.images?.[0] || '',
          productName: product.name,
          productId: product.id
        });
      }
    }
  });

  const suggestions = Array.from(combinations.values());

  suggestions.sort((a, b) => {
    const aBrand = a.brand.toLowerCase();
    const bBrand = b.brand.toLowerCase();
    const aStarts = aBrand.startsWith(text);
    const bStarts = bBrand.startsWith(text);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return aBrand.localeCompare(bBrand);
  });

  const finalResults = suggestions.slice(0, 10);

  if (finalResults.length === 0) {
    searchSuggestions.innerHTML = `<div class="search-no-result">No products found</div>`;
    searchSuggestions.classList.add("show");
    return;
  }

  finalResults.forEach(item => {
    const row = document.createElement("div");
    row.className = "search-suggestion";
    const displayCategory = categoryNames[item.category] || item.category;

    row.innerHTML = `
      <img src="${item.image}" alt="">
      <div class="suggestion-info">
        <div class="suggestion-name">
          ${highlightSearch(item.brand, text)}
          ${displayCategory}
        </div>
        <div class="suggestion-category">
          ${item.productName || item.brand + ' ' + displayCategory}
        </div>
      </div>
      <span class="suggestion-arrow">↗</span>
    `;

    row.addEventListener("click", () => {
      window.location.href =
        "search.html?brand=" +
        encodeURIComponent(item.brand) +
        "&category=" +
        encodeURIComponent(item.category);
    });

    searchSuggestions.appendChild(row);
  });

  searchSuggestions.classList.add("show");
}

function highlightSearch(text, search) {
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "ig"), "<strong>$1</strong>");
}

function openSearchResults(value) {
  if (!value) return;
  window.location.href = "search.html?q=" + encodeURIComponent(value);
}

if (searchInput) {
  searchInput.addEventListener("input", createSearchSuggestions);
}

if (searchButton) {
  searchButton.addEventListener("click", () => {
    const value = searchInput.value.trim();
    if (value) openSearchResults(value);
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const value = searchInput.value.trim();
      if (value) openSearchResults(value);
    }
  });
}

document.addEventListener("click", event => {
  if (
    searchInput &&
    searchSuggestions &&
    !searchInput.contains(event.target) &&
    !searchSuggestions.contains(event.target)
  ) {
    searchSuggestions.classList.remove("show");
  }
});

// ==========================================
// 17. BOTTOM BAR ACTIVE STATE
// ==========================================

const bottomItems = document.querySelectorAll('.bottom-item');

bottomItems.forEach(item => {
  item.addEventListener('click', function() {
    bottomItems.forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  });
});

// ==========================================
// 18. CART PAGE LOGIC (appended)
// ==========================================

function isCartPage() {
  return window.location.pathname.includes('cart.html');
}

function getCartElements() {
  return {
    container: document.getElementById('cartItems'),
    summary: document.getElementById('cartSummary'),
    empty: document.getElementById('emptyCart'),
    count: document.getElementById('cartCount'),
    subtotal: document.getElementById('cartSubtotal'),
    totalPrice: document.getElementById('cartTotalPrice')
  };
}

function loadCart() {
  if (!isCartPage()) return;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const el = getCartElements();
  
  if (cart.length === 0) {
    el.container.innerHTML = '';
    el.summary.style.display = 'none';
    el.empty.style.display = 'block';
    el.count.textContent = '0 items';
    updateBadge(0);
    return;
  }
  
  el.container.innerHTML = '';
  el.summary.style.display = 'block';
  el.empty.style.display = 'none';
  
  let subtotal = 0;
  let totalItems = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    totalItems += item.quantity;
    
    const displayName = item.variant && item.variant !== 'Default' 
      ? `${item.name} (${item.variant})` 
      : item.name;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h3>${displayName}</h3>
        <p class="cart-item-brand">${item.brand} ${item.variant && item.variant !== 'Default' ? '• ' + item.variant : ''}</p>
        <p class="cart-item-price">₹${item.price.toLocaleString("en-IN")}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">−</button>
        <span class="qty-number">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
      </div>
      <div class="cart-item-total">
        ₹${itemTotal.toLocaleString("en-IN")}
      </div>
      <button class="remove-btn" onclick="removeItem(${index})" title="Remove item">✕</button>
    `;
    el.container.appendChild(cartItem);
  });
  
  el.count.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
  el.subtotal.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  el.totalPrice.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  
  updateBadge(totalItems);
}

function updateQuantity(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const itemName = cart[index]?.name || 'Item';
  const variant = cart[index]?.variant || '';
  const displayName = variant && variant !== 'Default' ? `${itemName} (${variant})` : itemName;
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
  showToast(`${displayName} removed from cart`);
}

function clearCart() {
  if (confirm('Are you sure you want to clear your cart?')) {
    localStorage.removeItem('cart');
    loadCart();
    updateCartBadge();
    showToast('Cart cleared');
  }
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    showToast('Your cart is empty!');
    return;
  }
  
  let message = '🛍️ *JB STORE - New Order*%0A%0A';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    const displayName = item.variant && item.variant !== 'Default' 
      ? `${item.name} (${item.variant})` 
      : item.name;
    message += `📱 ${displayName}%0A   × ${item.quantity} = ₹${itemTotal.toLocaleString("en-IN")}%0A`;
    total += itemTotal;
  });
  
  message += `%0A💰 *Total: ₹${total.toLocaleString("en-IN")}*%0A%0A`;
  message += `📞 Please confirm my order. Thank you!`;
  
  window.open(`https://wa.me/${STORE_PHONE}?text=${message}`, '_blank');
}

function updateBadge(count) {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ==========================================
// 19. GLOBAL SEARCH (for all pages)
// ==========================================

function setupGlobalSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  
  if (!searchInput || !searchSuggestions) return;

  // Use existing createSearchSuggestions
  // No need to redefine, already above
}

// ==========================================
// 20. INITIALIZE CART ON DOM READY
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  if (isCartPage()) {
    loadCart();
  }
  updateCartBadge();
  
  // Update favorites badge if available
  if (typeof updateFavBadge === 'function') {
    updateFavBadge();
  }
});

// ==========================================
// 21. EXPOSE FUNCTIONS GLOBALLY
// ==========================================

window.loadCart = loadCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.checkout = checkout;
window.updateCartBadge = updateCartBadge;
window.showToast = showToast;
