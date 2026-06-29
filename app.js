const menuButton = document.querySelector('.menu-button');
const siteNav = document.querySelector('.site-nav');

if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? '×' : '☰';
  });
}

const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;
    const error = document.querySelector('#login-error');
    if (email === 'demo@guidox.uy' && password === 'demo123') {
      error.textContent = '';
      window.location.href = 'dashboard.html';
    } else {
      error.textContent = 'Usá las credenciales de demostración que aparecen debajo.';
    }
  });
  document.querySelector('#forgot-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#login-error').textContent = 'En el producto final, esta opción enviará un enlace de recuperación.';
  });
}
