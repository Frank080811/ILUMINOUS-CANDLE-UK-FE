// ===== Scroll-triggered animations =====
document.addEventListener("DOMContentLoaded", () => {
  const animatedEls = document.querySelectorAll(
    ".fade-up, .fade-left, .fade-right, .contact-form, .contact-info"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("appear");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.2 }
  );

  animatedEls.forEach((el) => observer.observe(el));
});

// ===== Mobile Nav Toggle =====
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

// ===== Header Scroll Effect =====
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add("scrolled"); // apply gradient and light links
  } else {
    header.classList.remove("scrolled"); // revert to light header and dark links
  }
});

// ------------------ Helpers ------------------
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => parent.querySelectorAll(sel);

const TAX_RATE = 0.07;

// Global state
let state = {
  cart: {},
  orders: JSON.parse(localStorage.getItem("lumina_orders") || "[]"),
  coupon: null
};

function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function money(v) {
  return `$${v.toFixed(2)}`;
}

// ------------------ Toast ------------------
function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    left: "50%",
    bottom: "26px",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,.85)",
    border: "1px solid var(--stroke)",
    padding: "10px 14px",
    borderRadius: "12px",
    zIndex: "100",
    pointerEvents: "none",
    color: "#fff",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .4s";
    setTimeout(() => el.remove(), 400);
  }, 1300);
}

// ------------------ Cart Logic ------------------
function cartSubtotal() {
  return Object.values(state.cart).reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
}

function calcDiscount(subtotal) {
  return state.coupon === "SALE25" ? subtotal * 0.25 : 0;
}

function calcShipping(subtotal) {
  return subtotal > 50 ? 0 : 4.99;
}

function renderCart() {
  const cartWrap = $("#cart");
  if (!cartWrap) return;

  const items = Object.values(state.cart);
  if (!items.length) {
    cartWrap.innerHTML = `<p>Your cart is empty</p>`;
    return;
  }

  let html = `<ul>`;
  items.forEach((i) => {
    html += `<li>${i.name} x${i.qty} - ${money(i.price * i.qty)}</li>`;
  });
  html += `</ul>`;
  html += `<strong>Total: ${money(cartSubtotal())}</strong>`;
  cartWrap.innerHTML = html;
}

function addToCart(name, price) {
  if (!state.cart[name]) {
    state.cart[name] = { name, price, qty: 1 };
  } else {
    state.cart[name].qty++;
  }
  renderCart();
  toast(`${name} added to cart`);
}

function clearCart() {
  state.cart = {};
  renderCart();
  toast("Cart cleared");
}

// ------------------ Checkout ------------------
function buildOrderTable() {
  const wrap = $("#orderTableWrap");
  if (!wrap) return;

  const items = Object.values(state.cart);
  const rows = items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td>${i.qty}</td><td>${money(
          i.price * i.qty
        )}</td></tr>`
    )
    .join("");
  wrap.innerHTML = `
    <table>
      <thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function openModal() {
  $("#checkoutModal").classList.add("open");
}
function closeModal() {
  $("#checkoutModal").classList.remove("open");
}
function closeCart() {
  $("#cart").classList.remove("open");
}

function initCheckout() {
  const checkoutModal = $("#checkoutModal");
  if (!checkoutModal) return;

  const checkoutBtn = $("#checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!Object.keys(state.cart).length) {
        toast("Your cart is empty");
        return;
      }
      buildOrderTable();
      openModal();
    });
  }

  checkoutModal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close], .shade, .close-x")) closeModal();
  });

  const confirmCheckout = $("#confirmCheckout");
  if (confirmCheckout) {
    confirmCheckout.addEventListener("click", () => {
      const subtotal = cartSubtotal();
      const discount = calcDiscount(subtotal);
      const taxable = subtotal - discount;

      const order = {
        id: "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        ts: new Date().toISOString(),
        items: Object.values(state.cart),
        coupon: state.coupon,
        totals: {
          subtotal,
          discount,
          tax: taxable * TAX_RATE,
          shipping: calcShipping(taxable),
        },
      };
      order.totals.total =
        order.totals.subtotal -
        order.totals.discount +
        order.totals.tax +
        order.totals.shipping;

      state.orders.unshift(order);
      save("lumina_orders", state.orders);
      clearCart();
      closeModal();
      closeCart();
      toast(`Order ${order.id} saved`);
    });
  }

  const viewOrders = $("#viewOrders");
  if (viewOrders) {
    viewOrders.addEventListener("click", () => {
      if (!state.orders.length) {
        toast("No orders yet");
        return;
      }
      const lines = state.orders
        .map(
          (o) => `<tr>
        <td>${o.id}</td>
        <td>${new Date(o.ts).toLocaleString()}</td>
        <td>${o.items.reduce((n, i) => n + i.qty, 0)}</td>
        <td>${money(o.totals.total)}</td>
      </tr>`
        )
        .join("");

      $("#orderTableWrap").innerHTML = `
        <table>
          <thead>
            <tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th></tr>
          </thead>
          <tbody>${lines}</tbody>
        </table>`;
      openModal();
    });
  }

  const clearCartBtn = $("#clearCart");
  if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
}

// ------------------ UI Enhancements ------------------
function renderNoteChips() {
  const wrap = $("#noteChips");
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="chip">Eco-Friendly</div>
    <div class="chip">Long-lasting</div>
    <div class="chip">Handmade</div>
  `;
}

function initGridDelegation() {
  const grid = $("#productGrid");
  if (!grid) return;
  grid.addEventListener("click", (e) => {
    if (e.target.matches(".add-to-cart")) {
      const card = e.target.closest(".product-card");
      const name = card.querySelector("h4").textContent;
      const price = parseFloat(
        card.querySelector("p").textContent.replace("$", "")
      );
      addToCart(name, price);
    }
  });
}

function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;
  grid.innerHTML = `
    <div class="product-card fade-up">
      <h4>Lavender Bliss</h4>
      <p>$15.00</p>
      <button class="add-to-cart">Add to Cart</button>
    </div>
    <div class="product-card fade-up">
      <h4>Vanilla Dreams</h4>
      <p>$18.00</p>
      <button class="add-to-cart">Add to Cart</button>
    </div>
  `;
}

// ------------------ Boot ------------------
function boot() {
  const menuToggle = $(".menu-toggle");
  const navbar = $(".navbar");
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }

  // Scroll animations
  const faders = $$(".fade-up");
  if (faders.length) {
    const appearOptions = { threshold: 0.2 };
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      });
    }, appearOptions);
    faders.forEach((fader) => appearOnScroll.observe(fader));
  }

  // Init features
  renderNoteChips();
  initToolbar();
  initGridDelegation();
  renderProducts();
  renderCart();
  initCheckout();
}

document.addEventListener("DOMContentLoaded", boot);
