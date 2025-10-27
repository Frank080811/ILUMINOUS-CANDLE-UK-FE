// ------------------ Helpers ------------------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => parent.querySelectorAll(sel);

window.addEventListener("scroll", () => {
  const header = $("header");
  if (window.scrollY > 40) header.classList.add("scrolled");
  else header.classList.remove("scrolled");
});

function staggerAppear(selector, delay = 0.15) {
  $$(selector).forEach((el, i) => {
    setTimeout(() => el.classList.add("appear"), i * delay * 1000);
  });
}

function animateOnScroll() {
  const animEls = $$(".fade-up, .fade-left, .fade-right");
  const triggerBottom = window.innerHeight * 0.85;
  animEls.forEach(el => {
    if (el.getBoundingClientRect().top < triggerBottom) el.classList.add("appear");
  });
}

// ------------------ State ------------------
let state = {
  cart: JSON.parse(localStorage.getItem("lumina_cart") || "{}"),
  orders: JSON.parse(localStorage.getItem("lumina_orders") || "[]"),
  coupon: null
};

// ------------------ Product Data ------------------
const products = [
  { name: "Aqua Surge", price: 25, img: "images/Aqua_Surge.png", category: "floral" },
  { name: "Autumn Indulgence", price: 25, img: "images/Autumn_Indulgence.png", category: "woody" },
  { name: "Bergamot Bloom", price: 25, img: "images/Bergamot_Bloom.png", category: "citrus" },
  { name: "Cashmere Dreams", price: 25, img: "images/Cashmere_Dreams.png", category: "vanilla" },
  { name: "Christmas Kiss", price: 25, img: "images/Christmas_Kiss.png", category: "sweet" },
  { name: "Golden Nector", price: 25, img: "images/Golden_Nector.png", category: "floral" },
  { name: "Hamptons Breeze", price: 25, img: "images/Hamptons_Breeze.png", category: "floral" },
  { name: "Holy Berry", price: 25, img: "images/berry.png.png", category: "fruity" },
  { name: "Lemon & Lavender", price: 25, img: "images/Lemon_Lavender.png", category: "woody" },
  { name: "Lemongrass Elixir", price: 25, img: "images/Lemongrass_Elixir.png", category: "fresh" },
  { name: "Take Me Away", price: 25, img: "images/Take_Me_Away.png", category: "fresh" },
  { name: "Mocha Delight", price: 25, img: "images/Mocha_Delight.png", category: "floral" },
  { name: "Mojito Millionaire", price: 25, img: "images/Mojito_Millionaire.png", category: "floral" },
  { name: "Mystic Woods", price: 25, img: "images/Mystic_Woods.png", category: "fruity" },
  { name: "Strawberry Vanilla", price: 25, img: "images/Strawberry_Vanilla.png", category: "woody" }
];

// ------------------ Money ------------------
function money(v) {
  return `£${v.toFixed(2)}`;
}

// ------------------ Render Products ------------------
const productGrid = $(".productGrid");
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
      <button class="btn add-to-cart" data-name="${p.name}" data-price="${p.price}">🛒 Add</button>
    `;
    productGrid.appendChild(card);
    setTimeout(() => card.classList.add("appear"), i * 100);
  });

  productGrid.style.display = "grid";
  productGrid.style.gridTemplateColumns = "repeat(5, 1fr)";
  productGrid.style.gap = "20px";
}

// ------------------ Filter/Search ------------------
const categoryFilter = $("#category");
const priceFilter = $("#price");
const sortFilter = $("#sort");
const applyFiltersBtn = $("#applyFilters");

function filterProducts() {
  const category = categoryFilter?.value || "all";
  const price = priceFilter?.value || "all";
  const sort = sortFilter?.value || "default";

  let filtered = products.filter(p => {
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

if (applyFiltersBtn) applyFiltersBtn.addEventListener("click", filterProducts);

// ------------------ Cart Logic ------------------
function saveCart() {
  localStorage.setItem("lumina_cart", JSON.stringify(state.cart));
}

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
    zIndex: "100",
    color: "#fff",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .4s";
    setTimeout(() => el.remove(), 400);
  }, 1300);
}

function addToCart(name, price) {
  if (!state.cart[name]) state.cart[name] = { name, price, qty: 1 };
  else state.cart[name].qty++;
  saveCart();
  renderCart();
  toast(`${name} added to cart`);
}

function removeFromCart(name) {
  delete state.cart[name];
  saveCart();
  renderCart();
}

function updateQty(name, qty) {
  if (qty <= 0) removeFromCart(name);
  else {
    state.cart[name].qty = qty;
    saveCart();
    renderCart();
  }
}

function renderCart() {
  const cartBody = $("#cartItems");
  const cartTotal = $("#cartTotal");
  if (!cartBody || !cartTotal) return;

  const items = Object.values(state.cart);
  cartBody.innerHTML = "";

  if (!items.length) {
    cartBody.innerHTML = '<tr><td colspan="5" class="empty-cart">Your cart is empty</td></tr>';
    cartTotal.textContent = "0.00";
    return;
  }

  let subtotal = 0;
  items.forEach(i => {
    const row = document.createElement("tr");
    const itemSubtotal = i.price * i.qty;
    subtotal += itemSubtotal;
    row.innerHTML = `
      <td>${i.name}</td>
      <td>${money(i.price)}</td>
      <td><input type="number" min="1" value="${i.qty}" class="qty-input" data-name="${i.name}"></td>
      <td>${money(itemSubtotal)}</td>
      <td><button class="remove-btn" data-name="${i.name}">❌</button></td>
    `;
    cartBody.appendChild(row);
  });

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = (subtotal + shipping).toFixed(2); // ✅ Tax removed
  cartTotal.textContent = total;
}

// ------------------ Event Delegation ------------------
function initCartDelegation() {
  document.body.addEventListener("click", e => {
    const btn = e.target.closest(".add-to-cart");
    if (btn) addToCart(btn.dataset.name, parseFloat(btn.dataset.price));

    if (e.target.classList.contains("remove-btn")) removeFromCart(e.target.dataset.name);
  });

  document.body.addEventListener("input", e => {
    if (e.target.classList.contains("qty-input")) updateQty(e.target.dataset.name, parseInt(e.target.value));
  });
}

// ------------------ Checkout ------------------
const API_URL = "https://iluminous-candle-uk-be.onrender.com";

function initCheckoutForm() {
  const checkoutForm = $("#checkoutForm");
  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const items = Object.values(state.cart);
    if (!items.length) return toast("Your cart is empty");

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
    const total = (subtotal + shipping).toFixed(2); // ✅ Tax removed

    const orderData = { customer: customerInfo, cart: items, total: parseFloat(total) };
    console.log("Submitting checkout request:", orderData);

    try {
      toast("Creating checkout session...");
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        mode: "cors"
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Checkout error");

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast("Checkout failed — no URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast("Checkout failed: " + err.message);
    }
  });
}

// ------------------ Promo Timer ------------------
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
    const now = new Date();
    const diff = promoEnd - now;

    if (diff <= 0) {
      promoContainer.innerHTML = `<p class="ended-text">🎉 Promo has ended!</p>`;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    daysEl.textContent = days.toString().padStart(2, "0");
    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = mins.toString().padStart(2, "0");
    secondsEl.textContent = secs.toString().padStart(2, "0");
  }

  updatePromoTimer();
  const timer = setInterval(updatePromoTimer, 1000);
}

// ------------------ Boot ------------------
document.addEventListener("DOMContentLoaded", () => {
  renderProductsDynamic();
  renderCart();
  initCartDelegation();
  initCheckoutForm();
  staggerAppear(".hero h1, .hero p", 0.2);
  staggerAppear(".contact-form, .contact-info", 0.25);
  animateOnScroll();
  initPromoTimer();
});

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar ul");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");

    // Smooth icon animation (optional)
    if (menuToggle.innerHTML === "&#9776;") {
      menuToggle.innerHTML = "&times;"; // change to 'X'
    } else {
      menuToggle.innerHTML = "&#9776;"; // revert to hamburger
    }
  });
});


window.addEventListener("scroll", animateOnScroll);
