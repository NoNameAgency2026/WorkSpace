import { storageProvider } from './storage/storageProvider.js';
import { debounce, uid } from './utils/helpers.js';
import { todayISO } from './utils/date.js';

const defaultState = () => ({
  schemaVersion: 1,
  columns: ['Backlog', 'En progreso', 'En revisión', 'Hecho'],
  tasks: [
    { id: uid(), title: 'Preparar propuesta Q2', description: 'Slides + presupuesto', status: 'Backlog', priority: 'Alta', dueDate: todayISO(), assignees: ['NoName'], tags: ['propuesta'], clientId: '' }
  ],
  clients: [
    { id: uid(), name: 'Acme Corp', contact: 'Laura Gómez', email: 'laura@acme.com', phone: '+34 600000000', company: 'Acme', notes: 'Cliente estratégico', status: 'activo', tags: ['retainer'] }
  ],
  events: [],
  invoices: [],
  notes: [{ id: uid(), title: 'SOP Onboarding', content: '- Crear carpeta\n- Kickoff\n- Timeline' }],
  settings: {
    agencyName: 'NoName Agency',
    invoicePrefix: 'NNA-',
    includeTaskDeadlinesInCalendar: true,
    saveStatus: 'Guardado'
  },
  members: ['NoName']
});

const listeners = new Set();
let state = defaultState();
let saveStatusCb = () => {};

const debouncedPersist = debounce(async () => {
  try {
    saveStatusCb('Guardando…');
    await storageProvider.save(state);
    saveStatusCb('Guardado');
  } catch {
    saveStatusCb('Error al guardar');
  }
}, 1000);

export const store = {
  async init() {
    const persisted = await storageProvider.load();
    if (persisted?.schemaVersion) state = persisted;
    setInterval(() => this.persistNow(), 30_000);
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
  notify() { listeners.forEach((l) => l(state)); },
  getState() { return state; },
  setSaveStatusHandler(fn) { saveStatusCb = fn; },
  update(mutator) {
    mutator(state);
    this.notify();
    debouncedPersist();
  },
  async persistNow() {
    try {
      saveStatusCb('Guardando…');
      await storageProvider.save(state);
      saveStatusCb('Guardado');
    } catch {
      saveStatusCb('Error al guardar');
    }
  },
  async importState(data) {
    if (!data?.schemaVersion || !Array.isArray(data.tasks)) throw new Error('Archivo inválido');
    state = { ...defaultState(), ...data };
    this.notify();
    await this.persistNow();
  },
  exportState() {
    return JSON.stringify(state, null, 2);
  },
  resetDemo() {
    state = defaultState();
    this.notify();
    this.persistNow();
  }
};
