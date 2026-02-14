import { uid } from '../utils/helpers.js';
import { fmtDate, todayISO } from '../utils/date.js';

export function renderCalendar(container, state, store) {
  const month = new Date();
  const relatedDeadlines = state.settings.includeTaskDeadlinesInCalendar
    ? state.tasks.filter((t) => t.dueDate).map((t) => ({ id: t.id, title: `Deadline: ${t.title}`, start: t.dueDate, end: t.dueDate, source: 'task' }))
    : [];
  const events = [...state.events, ...relatedDeadlines].sort((a, b) => a.start.localeCompare(b.start));

  container.innerHTML = `
    <section class="card">
      <h2>Calendario (${month.toLocaleString('es-ES', { month: 'long', year: 'numeric' })})</h2>
      <form id="event-form" class="grid cols-4">
        <input name="title" placeholder="Evento" required />
        <input name="start" type="date" value="${todayISO()}" required />
        <input name="end" type="date" value="${todayISO()}" required />
        <input name="client" placeholder="Cliente/Proyecto" />
        <button>Crear evento</button>
      </form>
    </section>
    <section class="card">
      <h3>Lista semanal / próximos eventos</h3>
      <table class="table"><thead><tr><th>Título</th><th>Inicio</th><th>Fin</th><th>Origen</th><th></th></tr></thead>
      <tbody>
        ${events.map((e) => `<tr><td>${e.title}</td><td>${fmtDate(e.start)}</td><td>${fmtDate(e.end)}</td><td>${e.source || 'manual'}</td><td>${e.source === 'task' ? '' : `<button data-del="${e.id}">Eliminar</button>`}</td></tr>`).join('') || '<tr><td colspan="5">Sin eventos</td></tr>'}
      </tbody></table>
    </section>
  `;

  container.querySelector('#event-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = new FormData(ev.currentTarget);
    store.update((s) => s.events.push({ id: uid(), title: String(form.get('title')), start: form.get('start'), end: form.get('end'), client: String(form.get('client') || '') }));
  });
  container.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    store.update((s) => s.events = s.events.filter((e) => e.id !== b.dataset.del));
  }));
}
