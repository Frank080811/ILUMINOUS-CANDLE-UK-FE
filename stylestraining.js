// ================== SMALL HELPERS ==================
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => parent.querySelectorAll(sel);

function money(v) {
  return "£" + Number(v || 0).toFixed(2);
}

// ================== HEADER SCROLL EFFECT ==================
window.addEventListener("scroll", () => {
  const header = $("header");
  if (header) header.classList.toggle("scrolled", window.scrollY > 40);
});

// ================== STATE ==================
let state = {
  cart: {},
  orders: JSON.parse(localStorage.getItem("lumina_orders") || "[]"),
  coupon: null,
};

// ================== PRODUCT CATALOG ==================
const products = [
  { name: "Coastal Sanctuary", price: 25, img: "images/Coastal_Sanctuary.jpg", category: "floral" },
  { name: "Arctic Ice", price: 25, img: "images/Arctic_Ice.jpg", category: "floral" },
  { name: "Autumne Embrace", price: 25, img: "images/Autumne_Embrace.jpg", category: "floral" },
  { name: "Cozy Comfort", price: 25, img: "images/Cozy_Comfort.jpg", category: "floral" },
  { name: "Autumne Indulgence", price: 25, img: "images/Autumne_Indulgence.jpg", category: "floral" },
  { name: "Chrismas Kiss", price: 25, img: "images/Chrismas_Kiss.jpg", category: "floral" },
  { name: "Eucalyptus Escape", price: 25, img: "images/Eucalyptus_Escape.jpg", category: "floral" },	{ name: "Naughty Santal", price: 25, img: "images/Naughty_Santal.jpg", category: "floral" },
  { name: "Coastal Couture", price: 25, img: "images/Coastal_Couture.jpg", category: "floral" },
  { name: "Evergreen Lux", price: 25, img: "images/Evergreen_Lux.jpg", category: "floral" },
  { name: "Fallin’ 4 U", price: 25, img: "images/Fallin’_4_U.jpg", category: "floral" },
  { name: "Gentlemans's Study", price: 25, img: "images/Gentlemans's_Study.jpg", category: "floral" },
  { name: "Golden Magic", price: 25, img: "images/Golden_Magic.jpg", category: "floral" },
  { name: "Green Meadow", price: 25, img: "images/Green_Meadow.jpg", category: "floral" },
  { name: "Hampton's Breeze", price: 25, img: "images/Hampton's_Breeze.jpg", category: "floral" },
  { name: "Intrigue", price: 25, img: "images/Intrigue.jpg", category: "floral" },
  { name: "Lavender", price: 25, img: "images/Lavender.jpg", category: "floral" },
  { name: "Lemon Luster", price: 25, img: "images/Lemon_Luster.jpg", category: "floral" },
  { name: "Lemonade Bash", price: 25, img: "images/Lemonade_Bash.jpg", category: "floral" },
  { name: "Mango Madness", price: 25, img: "images/Mango_Madness.jpg", category: "floral" },
  { name: "Midnight Snow.jpg", price: 25, img: "images/Midnight_Snow.jpg", category: "floral" },
  { name: "Mystic Woods", price: 25, img: "images/Mystic_Woods.jpg", category: "floral" },
  { name: "Orchid Oasis", price: 25, img: "images/Orchid_Oasis.jpg", category: "floral" },
  { name: "Patchouli Amber", price: 25, img: "images/Patchouli_Amber.jpg", category: "floral" },
  { name: "Renewed", price: 25, img: "images/Renewed.jpg", category: "floral" },
  { name: "Royal Pine", price: 25, img: "images/Royal_Pine.jpg", category: "floral" },
  { name: "Saffron Royal", price: 25, img: "images/Saffron_Royal.jpg", category: "floral" },
  { name: "Secret Garden", price: 25, img: "images/Secret_Garden.jpg", category: "floral" },
  { name: "Seduction", price: 25, img: "images/Seduction.jpg", category: "floral" },
  { name: "Spa Serenity", price: 25, img: "images/Spa_Serenity.jpg", category: "floral" },
  { name: "Sweet Figs", price: 25, img: "images/Sweet_Figs.jpg", category: "floral" },
  { name: "The Alchemist", price: 25, img: "images/The_Alchemist.jpg", category: "floral" },
  { name: "Tropical Twist", price: 25, img: "images/Tropical_Twist.jpg", category: "floral" },
  { name: "Winter Spice", price: 25, img: "images/Winter_Spice.jpg", category: "floral" },
  { name: "Winter Woods", price: 25, img: "images/Winter_Woods.jpg", category: "floral" },
  
];

// ================== PRODUCT RENDERING ==================
const productGrid = $(".products-grid");

function renderProductsDynamic(list = products) {
  if (!productGrid) return;

  productGrid.innerHTML = "";

  list.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card fade-up";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${money(p.price)}</p>
      <button 
        class="btn add-to-cart-btn" 
        data-name="${p.name}" 
        data-price="${p.price}" 
        data-img="${p.img}">
        <i class="fa-solid fa-cart-plus"></i>&nbsp;Add
      </button>
    `;
    productGrid.appendChild(card);
    setTimeout(() => card.classList.add("appear"), i * 80);
  });
}

// ================== FILTERING ==================
const categoryFilter = $("#category");
const priceFilter = $("#price");
const sortFilter = $("#sort");
const applyFiltersBtn = $("#applyFilters");

function filterProducts() {
  if (!productGrid) return;

  const category = categoryFilter?.value || "all";
  const price = priceFilter?.value || "all";
  const sort = sortFilter?.value || "default";

  let filtered = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (price === "low" && p.price >= 20) return false;
    if (price === "mid" && (p.price < 20 || p.price > 30)) return false;
    if (price === "high" && p.price <= 30) return false;
    return true;
  });

  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);
  if (sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "za") filtered.sort((a, b) => b.name.localeCompare(a.name));

  renderProductsDynamic(filtered);
}

applyFiltersBtn?.addEventListener("click", filterProducts);

// ================== CART PERSISTENCE ==================
function loadCartFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem("lumina_cart") || "{}");
    if (saved && typeof saved === "object") state.cart = saved;
  } catch {
    state.cart = {};
  }
}

function saveCart() {
  localStorage.setItem("lumina_cart", JSON.stringify(state.cart));
}

// ================== CART UI RENDERING (TABLE + DRAWER + FLOAT ICON) ==================
const checkoutBody = $("#cartItems");      // table body on checkout section
const checkoutTotal = $("#cartTotal");     // total on checkout section

const drawer = $("#cartDrawer");
const drawerItems = $("#drawerItems");
const drawerSubtotal = $("#drawerSubtotal");
const floatingCartBtn = $(".floating-checkout");
const floatingCartCount = $("#floatingCartCount");

function renderCart() {
  const items = Object.values(state.cart);

  // --- Checkout table (categories.html) ---
  if (checkoutBody && checkoutTotal) {
    checkoutBody.innerHTML = "";
    if (!items.length) {
      checkoutBody.innerHTML = `<tr><td colspan="5" class="empty-cart">Your cart is empty</td></tr>`;
      checkoutTotal.textContent = "0.00";
    } else {
      let subtotal = 0;
      items.forEach((i) => {
        const row = document.createElement("tr");
        const lineTotal = i.price * i.qty;
        subtotal += lineTotal;
        row.innerHTML = `
          <td>${i.name}</td>
          <td>${money(i.price)}</td>
          <td>
            <input 
              type="number" 
              min="1" 
              value="${i.qty}" 
              class="qty-input" 
              data-name="${i.name}">
          </td>
          <td>${money(lineTotal)}</td>
          <td><button class="remove-btn" data-name="${i.name}">❌</button></td>
        `;
        checkoutBody.appendChild(row);
      });

      const shipping = subtotal > 50 ? 0 : 5.99;
      const total = subtotal + shipping;
      checkoutTotal.textContent = total.toFixed(2);
    }
  }

  // --- Drawer items ---
  if (drawerItems && drawerSubtotal) {
    drawerItems.innerHTML = "";
    if (!items.length) {
      drawerItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
      drawerSubtotal.textContent = money(0);
    } else {
      let subtotal = 0;
      items.forEach((i) => {
        const lineTotal = i.price * i.qty;
        subtotal += lineTotal;
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
          <img src="${i.img || ""}" alt="${i.name}">
          <div class="cart-item-info">
            <h4>${i.name}</h4>
            <p>${i.qty} × ${money(i.price)}</p>
          </div>
        `;
        drawerItems.appendChild(itemEl);
      });
      drawerSubtotal.textContent = money(subtotal);
    }
  }

  // --- Floating icon count ---
  if (floatingCartCount) {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    floatingCartCount.textContent = count;
  }
}

// ================== CART OPERATIONS ==================
function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    left: "50%",
    bottom: "26px",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,.85)",
    border: "1px solid #fff",
    padding: "10px 14px",
    borderRadius: "12px",
    zIndex: "10000",
    color: "#fff",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .4s";
    setTimeout(() => el.remove(), 400);
  }, 1300);
}

function addToCart(name, price, img) {
  if (!name) return;
  const key = name;
  if (!state.cart[key]) {
    state.cart[key] = { name, price: Number(price), qty: 1, img: img || "" };
  } else {
    state.cart[key].qty += 1;
  }
  saveCart();
  renderCart();
}

function removeFromCart(name) {
  if (!name) return;
  delete state.cart[name];
  saveCart();
  renderCart();
}

function updateQty(name, qty) {
  const n = parseInt(qty, 10);
  if (!state.cart[name]) return;
  if (isNaN(n) || n <= 0) {
    removeFromCart(name);
  } else {
    state.cart[name].qty = n;
    saveCart();
    renderCart();
  }
}

// ================== FLY TO CART ANIMATION ==================
function animateFlyToCart(imageSrc, startX, startY) {
  if (!imageSrc) return;
  const img = document.createElement("img");
  img.src = imageSrc;
  img.className = "fly-item";
  img.style.left = startX + "px";
  img.style.top = startY + "px";
  document.body.appendChild(img);
  setTimeout(() => img.remove(), 900);
}

// ================== CART EVENT DELEGATION ==================
function initCartDelegation() {
  document.body.addEventListener("click", (e) => {
    // Add-to-cart buttons
    const addBtn = e.target.closest(".add-to-cart, .add-to-cart-btn");
    if (addBtn) {
      const name =
        addBtn.dataset.name ||
        addBtn.closest(".product-card")?.querySelector("h3")?.textContent;
      const price =
        parseFloat(addBtn.dataset.price) ||
        parseFloat(
          addBtn.closest(".product-card")?.querySelector(".price")?.textContent?.replace(/[^\d.]/g, "") ||
            "0"
        );
      const imgEl = addBtn.closest(".product-card")?.querySelector("img");
      const imgSrc = addBtn.dataset.img || (imgEl ? imgEl.src : "");
      if (imgEl) {
        const rect = imgEl.getBoundingClientRect();
        animateFlyToCart(imgSrc, rect.left, rect.top);
      }
      addToCart(name, price, imgSrc);
      toast(`${name} added to cart`);
      return;
    }

    // Remove buttons (checkout table)
    if (e.target.classList.contains("remove-btn")) {
      removeFromCart(e.target.dataset.name);
      return;
    }

    // Open drawer (floating icon)
    if (e.target.closest(".floating-checkout")) {
      e.preventDefault();
      if (drawer) drawer.classList.add("open");
      return;
    }

    // Close drawer
    if (e.target === $("#closeCart")) {
      if (drawer) drawer.classList.remove("open");
      return;
    }
  });

  // Quantity input
  document.body.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input")) {
      updateQty(e.target.dataset.name, e.target.value);
    }
  });
}

// ================== CHECKOUT FORM / STRIPE BACKEND ==================
const API_URL = "https://iluminous-candle-uk-be.onrender.com";

function initCheckoutForm() {
  const checkoutForm = $("#checkoutForm");
  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const items = Object.values(state.cart);
    if (!items.length) {
      toast("Your cart is empty");
      return;
    }

    const customerInfo = {
      fullName: checkoutForm.fullName.value,
      email: checkoutForm.email.value,
      phone: checkoutForm.phone.value,
      address: checkoutForm.address.value,
      city: checkoutForm.city.value,
      state: checkoutForm.state.value,
      zip: checkoutForm.zip.value,
      country: checkoutForm.country.value,
    };
    localStorage.setItem("lumina_customer", JSON.stringify(customerInfo));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + shipping;

    const orderData = {
      customer: customerInfo,
      cart: items,
      total: Number(total.toFixed(2)),
    };

    toast("Creating checkout session...");
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Checkout error");
      if (data.url) window.location.href = data.url;
      else toast("Checkout failed — no URL returned");
    } catch (err) {
      toast("Checkout failed: " + err.message);
    }
  });
}

// ================== HERO SIMPLE FLOATING TEXT ==================
function initHeroFloating() {
  const heroTexts = document.querySelectorAll(".hero h1 span");
  heroTexts.forEach((el, i) => {
    el.style.animation = `floatY 6s ease-in-out ${i * 0.6}s infinite alternate`;
  });
}

// ================== PROMO TIMER ==================
function initPromoTimer() {
  const promoContainer = document.querySelector(".promo-timer");
  if (!promoContainer) return;
  const promoEnd = new Date("2025-10-30T23:59:59");

  promoContainer.innerHTML = `
    <div class="time-box"><span id="days">00</span><small>Days</small></div>
    <div class="time-box"><span id="hours">00</span><small>Hours</small></div>
    <div class="time-box"><span id="minutes">00</span><small>Minutes</small></div>
    <div class="time-box"><span id="seconds">00</span><small>Seconds</small></div>
  `;

  const daysEl = $("#days", promoContainer);
  const hoursEl = $("#hours", promoContainer);
  const minutesEl = $("#minutes", promoContainer);
  const secondsEl = $("#seconds", promoContainer);

  function updatePromoTimer() {
    const diff = promoEnd - new Date();
    if (diff <= 0) {
      promoContainer.innerHTML = `<p class="ended-text">🎉 Promo has ended!</p>`;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(mins).padStart(2, "0");
    secondsEl.textContent = String(secs).padStart(2, "0");
  }

  updatePromoTimer();
  const timer = setInterval(updatePromoTimer, 1000);
}

// ================== MOBILE NAV ==================
function initMobileNav() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navbar = document.querySelector(".navbar");
  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
    menuToggle.classList.toggle("open");
  });

  navbar.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => navbar.classList.remove("active"))
  );
}

// ================== ON DOM READY ==================
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  renderProductsDynamic();   // only affects categories.html where .productGrid exists
  renderCart();
  initCartDelegation();
  initCheckoutForm();
  initHeroFloating();
  initPromoTimer();
  initMobileNav();
});
