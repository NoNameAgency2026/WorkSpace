import { uid } from '../utils/helpers.js';
import { fmtDate, todayISO } from '../utils/date.js';

function computeTotal(items, tax, discount) {
  const subtotal = items.reduce((a, i) => a + (i.qty * i.price), 0);
  return subtotal + subtotal * (tax / 100) - discount;
}

export function renderInvoices(container, state, store) {
  const options = state.clients.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  container.innerHTML = `
    <section class="card">
      <h2>Facturación</h2>
      <form id="invoice-form" class="grid cols-4">
        <select name="clientId" required><option value="">Cliente</option>${options}</select>
        <input name="issueDate" type="date" value="${todayISO()}" required />
        <input name="dueDate" type="date" value="${todayISO()}" required />
        <input name="item" placeholder="Concepto" required />
        <input name="qty" type="number" min="1" value="1" required />
        <input name="price" type="number" step="0.01" value="0" required />
        <input name="tax" type="number" step="0.01" value="21" />
        <input name="discount" type="number" step="0.01" value="0" />
        <button>Crear factura</button>
      </form>
    </section>
    <section class="card">
      <table class="table"><thead><tr><th>Número</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Vencimiento</th><th></th></tr></thead>
      <tbody>
        ${state.invoices.map((inv) => `<tr><td>${inv.number}</td><td>${inv.clientName}</td><td>€${inv.total.toFixed(2)}</td><td>${inv.status}</td><td>${fmtDate(inv.dueDate)}</td><td><button data-print="${inv.id}">Imprimir/PDF</button></td></tr>`).join('') || '<tr><td colspan="6">Sin facturas</td></tr>'}
      </tbody></table>
    </section>
  `;

  container.querySelector('#invoice-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const client = state.clients.find((c) => c.id === f.get('clientId'));
    const items = [{ concept: String(f.get('item')), qty: Number(f.get('qty')), price: Number(f.get('price')) }];
    const tax = Number(f.get('tax') || 0);
    const discount = Number(f.get('discount') || 0);
    store.update((s) => s.invoices.push({
      id: uid(), number: `${s.settings.invoicePrefix}${String(s.invoices.length + 1).padStart(4, '0')}`,
      clientId: String(f.get('clientId')), clientName: client?.name || '—', issueDate: f.get('issueDate'), dueDate: f.get('dueDate'),
      items, tax, discount, total: computeTotal(items, tax, discount), status: 'borrador'
    }));
  });

  container.querySelectorAll('[data-print]').forEach((btn) => btn.addEventListener('click', () => {
    const inv = state.invoices.find((i) => i.id === btn.dataset.print);
    if (!inv) return;
    const html = `<h1>${state.settings.agencyName}</h1><h2>Factura ${inv.number}</h2><p>Cliente: ${inv.clientName}</p><p>Total: €${inv.total.toFixed(2)}</p>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.print();
    w.close();
  }));
}
