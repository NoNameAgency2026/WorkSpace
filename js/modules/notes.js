import { uid, escapeHtml } from '../utils/helpers.js';

export function renderNotes(container, state, store) {
  container.innerHTML = `
    <section class="card">
      <h2>Notas / Wiki interna</h2>
      <form id="note-form" class="grid cols-2">
        <input name="title" placeholder="Título" required />
        <textarea name="content" placeholder="Contenido (Markdown simple)"></textarea>
        <button>Guardar nota</button>
      </form>
    </section>
    <section class="card">
      ${state.notes.map((n) => `<article><h3>${escapeHtml(n.title)}</h3><pre>${escapeHtml(n.content)}</pre><button data-del="${n.id}">Eliminar</button></article>`).join('') || 'Sin notas'}
    </section>
  `;
  container.querySelector('#note-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    store.update((s) => s.notes.unshift({ id: uid(), title: String(f.get('title')), content: String(f.get('content') || '') }));
  });
  container.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => store.update((s) => s.notes = s.notes.filter((n) => n.id !== b.dataset.del))));
}
