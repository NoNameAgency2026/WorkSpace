export const fmtDate = (value) => value ? new Intl.DateTimeFormat('es-ES',{dateStyle:'medium'}).format(new Date(value)) : '—';
export const todayISO = () => new Date().toISOString().slice(0,10);
