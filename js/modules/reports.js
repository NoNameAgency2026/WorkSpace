export function renderReports(container, state) {
  const pendingTasks = state.tasks.filter((t) => t.status !== 'Hecho').length;
  const overdueInvoices = state.invoices.filter((i) => i.status !== 'pagada' && new Date(i.dueDate) < new Date()).length;
  const activeClients = state.clients.filter((c) => c.status === 'activo').length;

  container.innerHTML = `
    <section class="grid cols-4">
      <article class="card"><h3>Tareas pendientes</h3><p>${pendingTasks}</p></article>
      <article class="card"><h3>Facturas vencidas</h3><p>${overdueInvoices}</p></article>
      <article class="card"><h3>Clientes activos</h3><p>${activeClients}</p></article>
      <article class="card"><h3>Eventos</h3><p>${state.events.length}</p></article>
    </section>
    <section class="card"><h3>Próximos vencimientos</h3><ul>${state.tasks.filter((t) => t.dueDate).slice(0,5).map((t) => `<li>${t.title} · ${t.dueDate}</li>`).join('') || '<li>Sin vencimientos</li>'}</ul></section>
  `;
}
