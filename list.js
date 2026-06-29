const catalog = {
  tomate: { name: 'Tomate americano', price: 89, unit: 'kg', emoji: '🍅' },
  lechuga: { name: 'Lechuga mantecosa', price: 45, unit: 'un.', emoji: '🥬' },
  papa: { name: 'Papa blanca', price: 760, unit: 'bolsa', emoji: '🥔' },
  zanahoria: { name: 'Zanahoria', price: 590, unit: 'bolsa', emoji: '🥕' },
  cebolla: { name: 'Cebolla', price: 68, unit: 'kg', emoji: '🧅' },
  limon: { name: 'Limón', price: 72, unit: 'kg', emoji: '🍋' },
  manzana: { name: 'Manzana roja', price: 110, unit: 'kg', emoji: '🍎' },
  banana: { name: 'Banana ecuatoriana', price: 96, unit: 'kg', emoji: '🍌' },
  ensalada: { name: 'Ensalada lista', price: 130, unit: 'un.', emoji: '🥗' },
  'papas-peladas': { name: 'Papas peladas', price: 520, unit: 'bolsa', emoji: '🥣' },
  aceite: { name: 'Aceite de girasol', price: 145, unit: 'un.', emoji: '🫙' },
  arroz: { name: 'Arroz largo fino', price: 430, unit: 'bolsa', emoji: '🍚' }
};

const order = {};
const productCards = [...document.querySelectorAll('.public-product')];
const searchInput = document.querySelector('#catalog-search');
const categoryButtons = document.querySelectorAll('[data-category]');
const orderLines = document.querySelector('#order-lines');
const orderEmpty = document.querySelector('#order-empty');
const orderSummary = document.querySelector('#order-summary');
const orderModal = document.querySelector('#order-modal');
const toast = document.querySelector('#public-toast');
let activeCategory = 'todos';
let toastTimer;

function money(value) { return `$ ${Number(value).toLocaleString('es-UY')}`; }

function showToast(message, title = 'Listo') {
  clearTimeout(toastTimer);
  toast.querySelector('strong').textContent = title;
  document.querySelector('#public-toast-message').textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  let visible = 0;
  productCards.forEach(card => {
    const name = card.dataset.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const categoryMatches = activeCategory === 'todos' || card.dataset.category === activeCategory;
    const searchMatches = !query || name.includes(query);
    const show = categoryMatches && searchMatches;
    card.hidden = !show;
    if (show) visible += 1;
  });
  document.querySelector('#catalog-empty').hidden = visible !== 0;
}

categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(item => item.classList.toggle('active', item === button));
  filterProducts();
}));
searchInput.addEventListener('input', filterProducts);

function renderOrder() {
  const entries = Object.entries(order).filter(([, quantity]) => quantity > 0);
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + catalog[id].price * quantity, 0);
  document.querySelector('#order-count').textContent = `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`;
  document.querySelector('#order-total').textContent = money(total);
  orderEmpty.hidden = entries.length > 0;
  orderSummary.hidden = entries.length === 0;
  orderLines.innerHTML = entries.map(([id, quantity]) => {
    const product = catalog[id];
    return `<div class="public-order-line"><span>${product.emoji}</span><p><strong>${product.name}</strong><small>${money(product.price)} / ${product.unit}</small></p><div><button data-decrease="${id}" aria-label="Quitar uno">−</button><b>${quantity}</b><button data-increase="${id}" aria-label="Agregar uno">+</button></div></div>`;
  }).join('');
}

document.querySelector('#public-product-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = button.dataset.add;
  order[id] = (order[id] || 0) + 1;
  renderOrder();
  showToast(`${catalog[id].name} se agregó al pedido.`);
});

orderLines.addEventListener('click', event => {
  const increase = event.target.closest('[data-increase]');
  const decrease = event.target.closest('[data-decrease]');
  if (increase) order[increase.dataset.increase] += 1;
  if (decrease) order[decrease.dataset.decrease] -= 1;
  renderOrder();
});

document.querySelector('#clear-order').addEventListener('click', () => {
  Object.keys(order).forEach(id => delete order[id]);
  renderOrder();
  showToast('El pedido quedó vacío.');
});

function orderText() {
  const lines = Object.entries(order).filter(([, quantity]) => quantity > 0).map(([id, quantity]) => `• ${catalog[id].name} × ${quantity}`);
  return ['Hola, quiero consultar este pedido:', ...lines, '', '¿Me confirman disponibilidad y total?'].join('\n');
}

document.querySelector('#prepare-order').addEventListener('click', () => {
  document.querySelector('#order-modal-summary').textContent = orderText();
  orderModal.hidden = false;
  setTimeout(() => orderModal.classList.add('show'), 10);
});

function closeModal() {
  orderModal.classList.remove('show');
  setTimeout(() => { orderModal.hidden = true; }, 180);
}
document.querySelector('.order-modal-close').addEventListener('click', closeModal);
orderModal.addEventListener('click', event => { if (event.target === orderModal) closeModal(); });
document.querySelector('#copy-order').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(orderText()); showToast('Resumen copiado para compartir.'); }
  catch { showToast('No pudimos copiarlo automáticamente.', 'Seleccioná el resumen'); }
});
document.querySelector('#sales-help').addEventListener('click', () => showToast('En producción, este botón abrirá el WhatsApp comercial.', 'Canal comercial'));

renderOrder();
