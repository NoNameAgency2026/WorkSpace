export const toast = (message) => {
  const region = document.getElementById('toast-region');
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  region.appendChild(node);
  setTimeout(() => node.remove(), 2600);
};

export const appNav = [
  ['#/tareas', 'Tareas'],
  ['#/calendario', 'Calendario'],
  ['#/clientes', 'Clientes'],
  ['#/facturas', 'Facturación'],
  ['#/notas', 'Notas'],
  ['#/reportes', 'Reportes'],
  ['#/ajustes', 'Ajustes']
];

export function renderSidebar(activeHash) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="brand">NoName Agency</div>
    ${appNav.map(([hash, label]) => `<a class="nav-link ${activeHash.startsWith(hash) ? 'active' : ''}" href="${hash}">${label}</a>`).join('')}
  `;
}

export function renderTopbar({ user, saveStatus, onLogout }) {
  const topbar = document.getElementById('topbar');
  topbar.innerHTML = `
    <div class="small">Usuario: <strong>${user}</strong></div>
    <div class="btn-row">
      <span class="status-pill">${saveStatus || 'Guardado'}</span>
      <button id="btn-logout">Cerrar sesión</button>
    </div>
  `;
  topbar.querySelector('#btn-logout')?.addEventListener('click', onLogout);
}
