export const isEmail = (v='') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const required = (v='') => String(v).trim().length > 0;
