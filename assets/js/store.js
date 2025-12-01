// Simple front-end demo cart (no real payments)
// This file should be saved as assets/js/store.js

const cart = [];

function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');

  if (!cartItemsEl || !cartTotalEl) {
    return;
  }

  if (!cart.length) {
    cartItemsEl.innerHTML =
      '<p class="small">No items yet. Add something from the store above.</p>';
    cartTotalEl.innerHTML = '<strong>Total: $0.00</strong>';
    return;
  }

  let html = '<ul class="small">';
  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    html += `<li>${item.name} (x${item.qty}) - $${lineTotal.toFixed(2)}</li>`;
  });

  html += '</ul>';
  cartItemsEl.innerHTML = html;
  cartTotalEl.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
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

document.addEventListener('DOMContentLoaded', () => {
  // Hook up all "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addToCart(name, price);
    });
  });

  // Demo checkout button
  const checkoutBtn = document.getElementById('checkout-button');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert(
        'This is a demo checkout. In a live site, this would redirect to a secure payment provider.'
      );
    });
  }

  // Initial render
  renderCart();
});
