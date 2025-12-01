// Simple front-end demo cart with drawer and count

let cart = [];

function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');

  if (!cartItemsEl || !cartTotalEl || !cartCountEl) return;

  if (!cart.length) {
    cartItemsEl.innerHTML =
      '<p class="small">No items yet. Add something from the store.</p>';
    cartTotalEl.innerHTML = '<strong>Total: $0.00</strong>';
    cartCountEl.textContent = '0';
    return;
  }

  let html = '<ul class="small">';
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    count += item.qty;
    html += `<li>${item.name} (x${item.qty}) - $${lineTotal.toFixed(2)}</li>`;
  });

  html += '</ul>';
  cartItemsEl.innerHTML = html;
  cartTotalEl.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
  cartCountEl.textContent = String(count);
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price: parseFloat(price), qty: 1 });
  }
  renderCart();
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  // Add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addToCart(name, price);
      openCartDrawer();
    });
  });

  // Cart icon open
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', openCartDrawer);
  }

  // Close button
  const closeBtn = document.getElementById('close-cart');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCartDrawer);
  }

// Mock checkout
const checkoutBtn = document.getElementById('checkout-button');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (!cart.length) {
      alert('Your cart is empty.');
      return;
    }

    // Save cart to localStorage for the next page
    localStorage.setItem('zontaCart', JSON.stringify(cart));

    // Clear current cart UI
    cart = [];
    renderCart();
    closeCartDrawer();

    // Go to local checkout / payment step
    window.location.href = 'checkout.html';
  });
}

