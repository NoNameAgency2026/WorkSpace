import { uid, escapeHtml } from '../utils/helpers.js';

export function renderTasks(container, state, store) {
  const q = new URLSearchParams(location.hash.split('?')[1] || '');
  const search = q.get('q') || '';

  container.innerHTML = `
    <section class="card">
      <h2>Tablero de tareas</h2>
      <form id="task-form" class="grid cols-4">
        <input name="title" placeholder="Título" required />
        <input name="dueDate" type="date" />
        <select name="priority"><option>Alta</option><option>Media</option><option>Baja</option></select>
        <input name="assignees" placeholder="Responsables (coma)" value="NoName" />
        <input name="tags" placeholder="Etiquetas (coma)" />
        <select name="status">${state.columns.map((c) => `<option>${c}</option>`).join('')}</select>
        <input name="clientId" placeholder="ID cliente opcional" />
        <button>Crear tarea</button>
      </form>
      <div class="btn-row" style="margin-top:.6rem;">
        <input id="task-search" placeholder="Buscar tarea" value="${escapeHtml(search)}" />
        <button id="my-tasks">Mis tareas</button>
      </div>
    </section>
    <section class="kanban">
      ${state.columns.map((col) => `
        <article class="column"><h3>${col}</h3>
          ${state.tasks.filter((t) => t.status === col && t.title.toLowerCase().includes(search.toLowerCase())).map((t) => `
            <div class="task">
              <strong>${escapeHtml(t.title)}</strong>
              <p class="small">${escapeHtml(t.description || '')}</p>
              <p class="small">Prioridad: ${t.priority} · Vence: ${t.dueDate || '—'}</p>
              <div class="btn-row">
                ${state.columns.filter((c) => c !== col).map((c) => `<button data-move="${t.id}" data-to="${c}">→ ${c}</button>`).join('')}
                <button data-del="${t.id}">Eliminar</button>
              </div>
            </div>`).join('')}
        </article>`).join('')}
    </section>
  `;

  container.querySelector('#task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    store.update((s) => s.tasks.unshift({
      id: uid(), title: String(f.get('title')).trim(), description: '', status: f.get('status'), priority: f.get('priority'), dueDate: f.get('dueDate'),
      assignees: String(f.get('assignees') || '').split(',').map((x) => x.trim()).filter(Boolean),
      tags: String(f.get('tags') || '').split(',').map((x) => x.trim()).filter(Boolean),
      clientId: String(f.get('clientId') || '')
    }));
  });

  container.querySelector('#task-search').addEventListener('input', (e) => {
    location.hash = `#/tareas?q=${encodeURIComponent(e.target.value)}`;
  });

  container.querySelector('#my-tasks').addEventListener('click', () => {
    location.hash = '#/tareas?q=NoName';
  });

  container.querySelectorAll('[data-move]').forEach((btn) => btn.addEventListener('click', () => {
    store.update((s) => {
      const task = s.tasks.find((t) => t.id === btn.dataset.move);
      if (task) task.status = btn.dataset.to;
    });
  }));
  container.querySelectorAll('[data-del]').forEach((btn) => btn.addEventListener('click', () => {
    store.update((s) => s.tasks = s.tasks.filter((t) => t.id !== btn.dataset.del));
  }));
}
