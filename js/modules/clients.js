import { uid, escapeHtml } from '../utils/helpers.js';
import { isEmail } from '../utils/validation.js';

export function renderClients(container, state, store) {
  const rows = state.clients.map((c) => `
    <tr>
      <td><strong>${escapeHtml(c.name)}</strong><div class="small">${escapeHtml(c.contact || '')}</div></td>
      <td>${escapeHtml(c.email || '—')}</td>
      <td>${escapeHtml(c.phone || '—')}</td>
      <td><span class="badge">${c.status}</span></td>
      <td><button data-view="${c.id}">Ver</button> <button data-del="${c.id}">Eliminar</button></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <section class="card">
      <h2>Clientes (CRM ligero)</h2>
      <form id="client-form" class="grid cols-4">
        <input name="name" placeholder="Nombre" required />
        <input name="contact" placeholder="Contacto" />
        <input name="email" type="email" placeholder="Email" />
        <input name="phone" placeholder="Teléfono" />
        <input name="company" placeholder="Empresa" />
        <input name="tags" placeholder="Etiquetas" />
        <select name="status"><option>lead</option><option selected>activo</option><option>inactivo</option></select>
        <button>Guardar cliente</button>
      </form>
    </section>
    <section class="card">
      <table class="table"><thead><tr><th>Cliente</th><th>Email</th><th>Teléfono</th><th>Estado</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="5">No hay clientes</td></tr>'}</tbody></table>
      <div id="client-detail"></div>
    </section>
  `;

  container.querySelector('#client-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') || '');
    if (email && !isEmail(email)) return alert('Email inválido');
    store.update((s) => s.clients.push({
      id: uid(), name: String(f.get('name')), contact: String(f.get('contact') || ''), email,
      phone: String(f.get('phone') || ''), company: String(f.get('company') || ''), notes: '',
      status: String(f.get('status')), tags: String(f.get('tags') || '').split(',').map((x) => x.trim()).filter(Boolean)
    }));
  });

  container.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => store.update((s) => s.clients = s.clients.filter((c) => c.id !== b.dataset.del))));
  container.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => {
    const c = state.clients.find((x) => x.id === b.dataset.view);
    if (!c) return;
    const tasks = state.tasks.filter((t) => t.clientId === c.id).length;
    const invoices = state.invoices.filter((i) => i.clientId === c.id).length;
    container.querySelector('#client-detail').innerHTML = `<div class="card"><h3>${escapeHtml(c.name)}</h3><p>${escapeHtml(c.notes || 'Sin notas')}</p><p class="small">Tareas asociadas: ${tasks} · Facturas asociadas: ${invoices}</p></div>`;
  }));
}
