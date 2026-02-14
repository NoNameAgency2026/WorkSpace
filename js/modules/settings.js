export function renderSettings(container, state, store) {
  container.innerHTML = `
    <section class="card">
      <h2>Ajustes</h2>
      <form id="settings-form" class="grid cols-2">
        <label>Nombre agencia <input name="agencyName" value="${state.settings.agencyName}" /></label>
        <label>Prefijo facturas <input name="invoicePrefix" value="${state.settings.invoicePrefix}" /></label>
        <label><input type="checkbox" name="includeDeadlines" ${state.settings.includeTaskDeadlinesInCalendar ? 'checked' : ''}/> Incluir deadlines de tareas en calendario</label>
        <button>Guardar ajustes</button>
      </form>
      <div class="btn-row" style="margin-top:.8rem;">
        <button id="btn-export">Exportar JSON</button>
        <label>Importar JSON <input id="import-file" type="file" accept="application/json" /></label>
        <button id="btn-reset">Reset demo</button>
      </div>
      <p class="small">Seguridad: en GitHub Pages el login frontend solo actúa como barrera básica, no como seguridad robusta.</p>
    </section>
  `;

  container.querySelector('#settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    store.update((s) => {
      s.settings.agencyName = String(f.get('agencyName'));
      s.settings.invoicePrefix = String(f.get('invoicePrefix'));
      s.settings.includeTaskDeadlinesInCalendar = f.get('includeDeadlines') === 'on';
    });
  });

  container.querySelector('#btn-export').addEventListener('click', () => {
    const blob = new Blob([store.exportState()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'noname-workspace-export.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  container.querySelector('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await store.importState(JSON.parse(text));
  });

  container.querySelector('#btn-reset').addEventListener('click', () => store.resetDemo());
}
