import { isAuthenticated, logout, getSession } from './auth/auth.js';
import { renderSidebar, renderTopbar } from './ui/components.js';
import { renderLogin } from './modules/login.js';
import { renderTasks } from './modules/tasks.js';
import { renderCalendar } from './modules/calendar.js';
import { renderClients } from './modules/clients.js';
import { renderInvoices } from './modules/invoices.js';
import { renderSettings } from './modules/settings.js';
import { renderNotes } from './modules/notes.js';
import { renderReports } from './modules/reports.js';

const guardedRoutes = {
  '/tareas': renderTasks,
  '/calendario': renderCalendar,
  '/clientes': renderClients,
  '/facturas': renderInvoices,
  '/ajustes': renderSettings,
  '/notas': renderNotes,
  '/reportes': renderReports
};

export function route(store, saveStatus) {
  const view = document.getElementById('view');
  const hash = location.hash || '#/login';
  const [path] = hash.replace('#', '').split('?');

  if (!isAuthenticated() && path !== '/login') {
    location.hash = '#/login';
    return;
  }

  if (path === '/login') {
    document.getElementById('sidebar').classList.add('hidden');
    document.getElementById('topbar').classList.add('hidden');
    renderLogin(view);
    return;
  }

  document.getElementById('sidebar').classList.remove('hidden');
  document.getElementById('topbar').classList.remove('hidden');
  renderSidebar(`#${path}`);
  renderTopbar({
    user: getSession() || 'NoName',
    saveStatus,
    onLogout: () => {
      logout();
      location.hash = '#/login';
    }
  });

  const render = guardedRoutes[path] || guardedRoutes['/tareas'];
  render(view, store.getState(), store);
}
