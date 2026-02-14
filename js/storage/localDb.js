const KEY = 'noname-workspace-v1';

export const localDb = {
  async load() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  },
  async save(payload) {
    localStorage.setItem(KEY, JSON.stringify(payload));
    return true;
  },
  async clear() {
    localStorage.removeItem(KEY);
  }
};
