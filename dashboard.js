const defaultProducts = [
  { id: 1, emoji: '🍅', name: 'Tomate americano', code: '1001', category: 'Verduras', unit: 'Por kilo', price: 89, stock: 32, measure: 'kg', status: 'Activo' },
  { id: 2, emoji: '🥬', name: 'Lechuga mantecosa', code: '1002', category: 'Verduras', unit: 'Por unidad', price: 45, stock: 4, measure: 'un.', status: 'Stock bajo' },
  { id: 3, emoji: '🍋', name: 'Limón', code: '2001', category: 'Frutas', unit: 'Por kilo', price: 72, stock: 18, measure: 'kg', status: 'Activo' },
  { id: 4, emoji: '🥕', name: 'Zanahoria', code: '1003', category: 'Verduras', unit: 'Por bolsa', price: 590, stock: 8, measure: 'kg', status: 'Stock bajo' },
  { id: 5, emoji: '🥔', name: 'Papa blanca', code: '1004', category: 'Verduras', unit: 'Por bolsa', price: 760, stock: 54, measure: 'kg', status: 'Activo' },
  { id: 6, emoji: '🍎', name: 'Manzana roja', code: '2002', category: 'Frutas', unit: 'Por kilo', price: 110, stock: 27, measure: 'kg', status: 'Activo' },
  { id: 7, emoji: '🫙', name: 'Aceite de girasol', code: '3001', category: 'Almacén', unit: 'Por unidad', price: 145, stock: 12, measure: 'un.', status: 'Activo' },
  { id: 8, emoji: '🥗', name: 'Ensalada lista', code: '4001', category: 'Procesados', unit: 'Por unidad', price: 130, stock: 3, measure: 'un.', status: 'Stock bajo' }
];

let products = JSON.parse(localStorage.getItem('guidox-products') || 'null') || defaultProducts;
const views = document.querySelectorAll('.dashboard-view');
const navButtons = document.querySelectorAll('.dashboard-nav button');
const sidebar = document.querySelector('#sidebar');
const toast = document.querySelector('#toast');
let toastTimer;

function money(value) { return `$ ${Number(value).toLocaleString('es-UY')}`; }
function saveProducts() { localStorage.setItem('guidox-products', JSON.stringify(products)); }
function showToast(message, title = 'Listo') {
  clearTimeout(toastTimer);
  toast.querySelector('strong').textContent = title;
  document.querySelector('#toast-message').textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
function goToView(name) {
  views.forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.view === name));
  const activeButton = document.querySelector(`[data-view="${name}"]`);
  document.querySelector('#mobile-section-label').textContent = activeButton ? activeButton.textContent.trim() : 'Panel';
  sidebar.classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => button.addEventListener('click', () => goToView(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => goToView(button.dataset.go)));
document.querySelector('.dashboard-menu').addEventListener('click', () => sidebar.classList.toggle('open'));

function renderProducts() {
  const query = (document.querySelector('#product-search')?.value || '').toLowerCase();
  const category = document.querySelector('#category-filter')?.value || '';
  const rows = products.filter(product => (!query || `${product.name} ${product.code}`.toLowerCase().includes(query)) && (!category || product.category === category));
  document.querySelector('#products-table').innerHTML = rows.map(product => `
    <tr>
      <td><span class="table-product"><i>${product.emoji}</i><span><strong>${product.name}</strong><small>${product.category}</small></span></span></td>
      <td><code>${product.code}</code></td><td>${product.unit}</td>
      <td><button class="price-button" data-edit-price="${product.id}">${money(product.price)} <span>✎</span></button></td>
      <td>${product.stock} ${product.measure}</td><td><em class="status ${product.status === 'Activo' ? '' : 'low'}">${product.status}</em></td>
      <td><button class="row-menu">•••</button></td>
    </tr>`).join('');
  document.querySelectorAll('[data-edit-price]').forEach(button => button.addEventListener('click', () => {
    const product = products.find(item => item.id === Number(button.dataset.editPrice));
    const next = prompt(`Nuevo precio para ${product.name}:`, product.price);
    if (next !== null && next !== '' && !Number.isNaN(Number(next))) {
      product.price = Number(next); saveProducts(); renderProducts(); syncProductDisplays();
      showToast(`${product.name} ahora vale ${money(product.price)} en todos los canales.`);
    }
  }));
}

function renderStock() {
  document.querySelector('#stock-grid').innerHTML = products.map(product => {
    const percent = Math.min(100, product.stock * 2.5);
    const low = product.stock < 10;
    return `<article class="dashboard-card stock-card"><div><span class="product-emoji">${product.emoji}</span><p><strong>${product.name}</strong><small>${product.code} · ${product.unit}</small></p><em class="status ${low ? 'low' : ''}">${low ? 'Stock bajo' : 'Disponible'}</em></div><h3>${product.stock} <small>${product.measure}</small></h3><div class="stock-meter"><i style="width:${percent}%" class="${low ? 'low' : ''}"></i></div><button data-stock="${product.id}">Registrar entrada / salida</button></article>`;
  }).join('');
  document.querySelectorAll('[data-stock]').forEach(button => button.addEventListener('click', () => {
    const product = products.find(item => item.id === Number(button.dataset.stock));
    const next = prompt(`Stock actual de ${product.name}. Ingresá el nuevo total:`, product.stock);
    if (next !== null && next !== '' && !Number.isNaN(Number(next))) {
      product.stock = Number(next); product.status = product.stock < 10 ? 'Stock bajo' : 'Activo'; saveProducts(); renderStock(); renderProducts(); updateCounts();
      showToast(`Stock de ${product.name} actualizado sin registrar una venta.`);
    }
  }));
}

function updateCounts() {
  document.querySelector('#active-product-count').textContent = products.length;
  document.querySelector('#low-stock-count').textContent = products.filter(product => product.stock < 10).length;
}
function syncProductDisplays() {
  const tomato = products.find(product => product.name === 'Tomate americano');
  if (!tomato) return;
  document.querySelector('#quick-price').value = tomato.price;
  document.querySelector('#wholesale-tomato').textContent = money(tomato.price);
  updateLabelPreview();
}

document.querySelector('#product-search').addEventListener('input', renderProducts);
document.querySelector('#category-filter').addEventListener('change', renderProducts);
document.querySelector('#quick-save').addEventListener('click', () => {
  const tomato = products.find(product => product.name === 'Tomate americano');
  tomato.price = Number(document.querySelector('#quick-price').value); saveProducts(); renderProducts(); syncProductDisplays();
  showToast('Precio actualizado en caja, balanza y lista mayorista.');
});

const modalBackdrop = document.querySelector('#modal-backdrop');
function openModal() { modalBackdrop.hidden = false; setTimeout(() => modalBackdrop.classList.add('show'), 10); }
function closeModal() { modalBackdrop.classList.remove('show'); setTimeout(() => { modalBackdrop.hidden = true; }, 180); }
document.querySelector('#new-product').addEventListener('click', openModal);
document.querySelector('.modal-close').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.querySelector('#modal-form').addEventListener('submit', event => {
  event.preventDefault();
  products.push({ id: Date.now(), emoji: '📦', name: document.querySelector('#modal-name').value, code: String(5000 + products.length), category: document.querySelector('#modal-category').value, unit: document.querySelector('#modal-unit').value, price: Number(document.querySelector('#modal-price').value), stock: Number(document.querySelector('#modal-stock').value), measure: 'un.', status: Number(document.querySelector('#modal-stock').value) < 10 ? 'Stock bajo' : 'Activo' });
  saveProducts(); renderProducts(); renderStock(); updateCounts(); event.target.reset(); closeModal(); showToast('Producto agregado al catálogo central.');
});

document.querySelector('#bulk-update').addEventListener('click', () => showToast('El importador recibirá el Excel actual y mostrará una vista previa antes de guardar.', 'Importación prevista'));
document.querySelector('#register-movement').addEventListener('click', () => showToast('Elegí un producto para registrar su entrada o salida.', 'Movimiento de stock'));
document.querySelector('#export-scale').addEventListener('click', () => {
  const csv = ['codigo,producto,tipo,precio', ...products.map(p => `${p.code},${p.name},${p.unit},${p.price}`)].join('\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'guidox-precios-balanza.csv'; link.click(); URL.revokeObjectURL(link.href);
  showToast('Archivo de precios generado. No se registró ninguna venta.');
});

function updateLabelPreview() {
  const name = document.querySelector('#label-product').value;
  const product = products.find(item => item.name === name) || products[0];
  const weight = Number(document.querySelector('#label-weight').value || 0);
  document.querySelector('#preview-product').textContent = name.toUpperCase();
  document.querySelector('#preview-weight').textContent = `${weight.toLocaleString('es-UY')} kg`;
  document.querySelector('#preview-total').textContent = money(product.price * weight);
}
document.querySelector('#label-product').addEventListener('change', updateLabelPreview);
document.querySelector('#label-weight').addEventListener('input', updateLabelPreview);
document.querySelector('#print-label').addEventListener('click', () => {
  showToast('Etiqueta preparada. El stock y las ventas no cambiaron.');
  setTimeout(() => window.print(), 250);
});
document.querySelector('#copy-link').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('https://guidox.uy/lista/restaurantes'); showToast('Enlace copiado para compartir por WhatsApp.'); }
  catch { showToast('Enlace: guidox.uy/lista/restaurantes', 'Copiá este enlace'); }
});
document.querySelector('#publish-list').addEventListener('click', () => showToast('La lista mayorista ya muestra los últimos precios.'));
document.querySelector('#new-order').addEventListener('click', () => showToast('El formulario de carga manual se sumará en la siguiente etapa.', 'Flujo previsto'));
document.querySelector('#invite-user').addEventListener('click', () => showToast('La invitación permitirá asignar permisos antes de dar acceso.', 'Invitar empleado'));
document.querySelector('.sidebar-help button').addEventListener('click', () => showToast('Canal de soporte de Digital Match disponible para la puesta en marcha.'));
document.querySelectorAll('.orders-board article button').forEach(button => button.addEventListener('click', () => showToast('Estado del pedido actualizado.')));

document.querySelectorAll('.payment-types button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.payment-types button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
}));
function updateSaleTotal() {
  const total = [...document.querySelectorAll('[data-sale-line]')].reduce((sum, line) => sum + Number(line.dataset.amount || 0), 0);
  document.querySelector('#sale-total').textContent = money(total);
}
document.querySelector('#sale-lines').addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  button.closest('[data-sale-line]').remove(); updateSaleTotal();
  showToast('Producto retirado de la venta.');
});
document.querySelector('#sale-add').addEventListener('click', () => {
  const value = document.querySelector('#sale-scan').value.trim();
  if (!value) return showToast('Escaneá un código o escribí un producto.', 'Falta un producto');
  const product = products.find(item => item.code === value || item.name.toLowerCase().includes(value.toLowerCase()));
  if (!product) return showToast('No encontramos ese código o nombre en el catálogo.', 'Producto no encontrado');
  const line = document.createElement('div');
  line.dataset.saleLine = '';
  line.dataset.amount = product.price;
  const icon = document.createElement('span'); icon.className = 'product-emoji'; icon.textContent = product.emoji;
  const copy = document.createElement('p');
  const name = document.createElement('strong'); name.textContent = product.name;
  const detail = document.createElement('small'); detail.textContent = `1 × ${money(product.price)}`;
  copy.append(name, detail);
  const amount = document.createElement('b'); amount.textContent = money(product.price);
  const remove = document.createElement('button'); remove.type = 'button'; remove.setAttribute('aria-label', 'Quitar producto'); remove.textContent = '×';
  line.append(icon, copy, amount, remove);
  document.querySelector('#sale-lines').append(line);
  document.querySelector('#sale-scan').value = '';
  updateSaleTotal();
  showToast(`${product.name} agregado a la venta.`, 'Producto leído');
});
document.querySelector('#sale-scan').addEventListener('keydown', event => { if (event.key === 'Enter') document.querySelector('#sale-add').click(); });
document.querySelector('#complete-sale').addEventListener('click', () => showToast('Venta registrada una vez. Ticket enviado a impresión y stock actualizado.', 'Venta confirmada'));
document.querySelector('#close-cash').addEventListener('click', () => showToast('El reporte de cierre estará disponible para descargar.', 'Cierre de caja'));

renderProducts(); renderStock(); updateCounts(); syncProductDisplays();
