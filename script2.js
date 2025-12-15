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

// ================== PRODUCT CATALOG (for categories page) ==================
const products = [
  { name: "Peach N Ginger", price: 25, img: "images/peachnginger.jpeg", category: "floral" },
  { name: "Arctic Ice", price: 25, img: "images/Arctic_Ice.jpg", category: "floral" },
  { name: "Coastal Couture", price: 25, img: "images/coastalcouture.jpeg", category: "floral" },
  { name: "Autumne Embrace", price: 25, img: "images/autumneembrace.jpeg", category: "floral" },
  { name: "Autumne Spice", price: 25, img: "images/autumnespice.jpeg", category: "floral" },
  { name: "Autumne Indulgence", price: 25, img: "images/autumneindulgence.jpeg", category: "floral" },
  { name: "Citrus Burst", price: 25, img: "images/citrusburst.jpeg", category: "floral" },
  { name: "Coastal Sanctuary", price: 25, img: "images/coastalsanctuary.jpeg", category: "floral" },
  { name: "Cozy Nook", price: 25, img: "images/cozynook.jpeg", category: "floral" },
  { name: "Eucalyptus Escape", price: 25, img: "images/eucolatusescappe.jpeg", category: "floral" },
  { name: "Cozy Comfort", price: 25, img: "images/cozycomfort.jpeg", category: "floral" },
  { name: "Intrigue", price: 25, img: "images/intrigue.jpeg", category: "floral" },
  { name: "Golden Magic", price: 25, img: "images/goldenmagic.jpeg", category: "floral" },
  { name: "Fallin' 4 U", price: 25, img: "images/fallin4u.jpeg", category: "floral" },
  { name: "Spa serenity", price: 25, img: "images/spaserenity.jpeg", category: "floral" },
  { name: "Lavender", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Lavender", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Lemon Luster", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Lemonade Bash", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Mango Madness", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Midnight Snow.jpg", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Mystic Woods", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Orchid Oasis", price: 25, img: "images/Olavender.jpeg", category: "floral" },
  { name: "Patchouli Amber", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Renewed", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Royal Pine", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Saffron Royal", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Secret Garden", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Seduction", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Spa Serenity", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Sweet Figs", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "The Alchemist", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Tropical Twist", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Winter Spice", price: 25, img: "images/lavender.jpeg", category: "floral" },
  { name: "Winter Woods", price: 25, img: "images/lavender.jpeg", category: "floral" },
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

// ================== FILTERING (categories.html only) ==================
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

// ================== INDEX PAGE — ADVANCED SLIDER ==================
function initHomeSlider() {
  const homeGrid = $(".home-products-grid");
  const prev = $("#homePrev");
  const next = $("#homeNext");

  if (!homeGrid || !prev || !next) return; // only index.html

  function updateButtons() {
    prev.classList.toggle("disabled", homeGrid.scrollLeft <= 10);
    const max = homeGrid.scrollWidth - homeGrid.clientWidth - 10;
    next.classList.toggle("disabled", homeGrid.scrollLeft >= max);
  }

  prev.addEventListener("click", () => {
    homeGrid.scrollBy({ left: -280, behavior: "smooth" });
    setTimeout(updateButtons, 350);
  });

  next.addEventListener("click", () => {
    homeGrid.scrollBy({ left: 280, behavior: "smooth" });
    setTimeout(updateButtons, 350);
  });

  homeGrid.addEventListener("scroll", updateButtons);

  updateButtons();
}

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

// ================== CART UI (DRAWER + FLOAT ICON + CHECKOUT PAGE) ==================
const checkoutBody = $("#cartItems");
const checkoutTotal = $("#cartTotal");
const drawer = $("#cartDrawer");
const drawerItems = $("#drawerItems");
const drawerSubtotal = $("#drawerSubtotal");
const floatingCartCount = $("#floatingCartCount");

function renderCart() {
  const items = Object.values(state.cart);

  // Checkout page
  if (checkoutBody && checkoutTotal) {
    checkoutBody.innerHTML = "";
    if (!items.length) {
      checkoutBody.innerHTML = `<tr><td colspan="5" class="empty-cart">Your cart is empty</td></tr>`;
      checkoutTotal.textContent = "0.00";
    } else {
      let subtotal = 0;
      items.forEach((i) => {
        const lineTotal = i.price * i.qty;
        subtotal += lineTotal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${i.name}</td>
          <td>${money(i.price)}</td>
          <td><input type="number" value="${i.qty}" min="1" class="qty-input" data-name="${i.name}"></td>
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

  // Drawer
  if (drawerItems && drawerSubtotal) {
    drawerItems.innerHTML = "";
    if (!items.length) {
      drawerItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
      drawerSubtotal.textContent = money(0);
    } else {
      let subtotal = 0;
      items.forEach((i) => {
        subtotal += i.price * i.qty;
        const el = document.createElement("div");
        el.className = "cart-item";
        el.innerHTML = `
          <img src="${i.img}">
          <div><h4>${i.name}</h4><p>${i.qty} × ${money(i.price)}</p></div>
        `;
        drawerItems.appendChild(el);
      });
      drawerSubtotal.textContent = money(subtotal);
    }
  }

  // Floating count
  if (floatingCartCount) {
    const count = items.reduce((a, b) => a + b.qty, 0);
    floatingCartCount.textContent = String(count);
  }
}

// ================== CART ACTIONS ==================
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
  if (!state.cart[name]) {
    state.cart[name] = { name, price, qty: 1, img };
  } else {
    state.cart[name].qty++;
  }
  saveCart();
  renderCart();
}

function removeFromCart(name) {
  delete state.cart[name];
  saveCart();
  renderCart();
}

function updateQty(name, qty) {
  qty = Number(qty);
  if (qty <= 0) removeFromCart(name);
  else {
    state.cart[name].qty = qty;
    saveCart();
    renderCart();
  }
}

// ================== EVENT DELEGATION ==================
function initCartDelegation() {
  document.body.addEventListener("click", (e) => {
    const addBtn = e.target.closest(".add-to-cart-btn");
    if (addBtn) {
      const { name, price, img } = addBtn.dataset;
      addToCart(name, Number(price), img);
      toast(`${name} added to cart`);
      return;
    }

    if (e.target.classList.contains("remove-btn")) {
      removeFromCart(e.target.dataset.name);
      return;
    }

    if (e.target.closest(".floating-checkout")) {
      e.preventDefault();
      drawer?.classList.add("open");
      return;
    }

    if (e.target === $("#closeCart")) {
      drawer?.classList.remove("open");
      return;
    }
  });

  document.body.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input")) {
      updateQty(e.target.dataset.name, e.target.value);
    }
  });
}

// ================== CHECKOUT FORM ==================
const API_URL = "https://iluminous-candle-uk-be.onrender.com";

function initCheckoutForm() {
  const checkoutForm = $("#checkoutForm");
  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cartItems = Object.values(state.cart);
    if (!cartItems.length) return toast("Your cart is empty.");

    const customer = {
      fullName: checkoutForm.fullName.value,
      email: checkoutForm.email.value,
      phone: checkoutForm.phone.value,
      address: checkoutForm.address.value,
      city: checkoutForm.city.value,
      state: checkoutForm.state.value,
      zip: checkoutForm.zip.value,
      country: checkoutForm.country.value,
    };

    localStorage.setItem("lumina_customer", JSON.stringify(customer));

    const subtotal = cartItems.reduce((a, b) => a + b.qty * b.price, 0);
    const shipping = subtotal > 50 ? 0 : 5.99;

    const payload = {
      customer,
      cart: cartItems,
      total: Number(subtotal + shipping),
    };

    toast("Processing payment...");

    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast("Checkout failed.");
    } catch (err) {
      toast("Payment error: " + err.message);
    }
  });
}

// ================== HERO FLOATING TEXT ==================
function initHeroFloating() {
  const spans = document.querySelectorAll(".hero h1 span");
  spans.forEach((el, i) => {
    el.style.animation = `floatY 6s ease-in-out ${i * 0.6}s infinite alternate`;
  });
}

// ================== PROMO TIMER ==================
function initPromoTimer() {
  const promo = $(".promo-timer");
  if (!promo) return;

  const end = new Date("2025-10-30T23:59:59");
  promo.innerHTML = `
    <div class="time-box"><span id="days">00</span><small>Days</small></div>
    <div class="time-box"><span id="hours">00</span><small>Hours</small></div>
    <div class="time-box"><span id="minutes">00</span><small>Minutes</small></div>
    <div class="time-box"><span id="seconds">00</span><small>Seconds</small></div>
  `;

  const days = $("#days", promo);
  const hours = $("#hours", promo);
  const mins = $("#minutes", promo);
  const secs = $("#seconds", promo);

  function update() {
    const diff = end - new Date();
    if (diff <= 0) {
      promo.innerHTML = `<p class="ended-text">Promo ended!</p>`;
      return;
    }
    days.textContent = String(Math.floor(diff / (86400000))).padStart(2, "0");
    hours.textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
    mins.textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    secs.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ================== MOBILE NAV ==================
function initMobileNav() {
  const toggle = $(".menu-toggle");
  const nav = $(".navbar");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    toggle.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => nav.classList.remove("active"))
  );
}

// ================== DOM READY ==================
document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();
  renderProductsDynamic(); // Categories page only
  initHomeSlider();        // Index page only
  renderCart();
  initCartDelegation();
  initCheckoutForm();
  initHeroFloating();
  initPromoTimer();
  initMobileNav();
});

// FEATURED PRODUCTS NAVIGATION
const featGrid = document.querySelector(".products-grid.scrollable");
const featPrev = document.getElementById("featPrev");
const featNext = document.getElementById("featNext");

if (featGrid) {
  featPrev.addEventListener("click", () => {
    featGrid.scrollBy({ left: -300, behavior: "smooth" });
  });

  featNext.addEventListener("click", () => {
    featGrid.scrollBy({ left: 300, behavior: "smooth" });
  });
}

