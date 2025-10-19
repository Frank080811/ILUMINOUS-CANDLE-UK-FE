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
  { name: "Lavender Bliss", price: 1, img: "images/lav.jpeg", category: "floral" },
  { name: "Aromatic Profiles", price: 1, img: "images/warm.jpeg", category: "woody" },
  { name: "Citrus Harmony", price: 1, img: "images/citrus.jpg", category: "citrus" },
  { name: "Vanilla Glow", price: 1, img: "images/Vanilla.jpeg", category: "vanilla" },
  { name: "Mocha Delight", price: 1, img: "images/mocha.jpeg", category: "sweet" },
  { name: "Orchid Oasis", price: 1, img: "images/orchid.jpeg", category: "floral" },
  { name: "Secret Garden", price: 1, img: "images/secret.jpg", category: "floral" },
  { name: "Currant Blossom", price: 1, img: "images/currant1.jpg", category: "fruity" },
  { name: "Patchouli Amber", price: 1, img: "images/Patchouli.jpg", category: "woody" },
  { name: "Arctic Ice", price: 1, img: "images/arctic.png", category: "fresh" },
];

// ------------------ Money ------------------
function money(v) {
  return `$${v.toFixed(2)}`;
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
  const tax = subtotal * 0.07;
  const total = +(subtotal + tax + shipping).toFixed(2);
  cartTotal.textContent = total.toFixed(2);
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
    const tax = subtotal * 0.07;
    const total = +(subtotal + tax + shipping).toFixed(2);

    const orderData = { customer: customerInfo, cart: items, total };
    console.log("Submitting checkout request:", orderData);

    try {
      toast("Creating checkout session...");
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        mode: "cors"
      });

      console.log("Response status:", res.status);

      const data = await res.json().catch(() => ({}));
      console.log("Response data:", data);

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


// ------------------ Boot ------------------
document.addEventListener("DOMContentLoaded", () => {
  // Clear cart on page load/refresh
  state.cart = {};
  localStorage.setItem("lumina_cart", JSON.stringify(state.cart));

  renderProductsDynamic();
  renderCart();
  initCartDelegation();
  initCheckoutForm();
  staggerAppear(".hero h1, .hero p", 0.2);
  staggerAppear(".contact-form, .contact-info", 0.25);
  animateOnScroll();
});

window.addEventListener("scroll", animateOnScroll);
