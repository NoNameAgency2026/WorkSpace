const USERNAME = 'NoName';
const PASSWORD_HASH = 'aa803eb6c1c0778c568fb5166a8c8d49de25a847d7c38914597a839ae0d24350';
const SESSION_KEY = 'noname-auth-session';
const REMEMBER_KEY = 'noname-auth-remember';
const LAST_ACTIVITY_KEY = 'noname-last-activity';
const INACTIVITY_MS = 15 * 60 * 1000;

const enc = new TextEncoder();

export async function sha256(text) {
  const hash = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getSession() {
  const fromSession = sessionStorage.getItem(SESSION_KEY);
  const fromLocal = localStorage.getItem(REMEMBER_KEY);
  return fromSession || fromLocal;
}

export function isAuthenticated() {
  const session = getSession();
  if (!session) return false;
  const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || Date.now());
  if (Date.now() - last > INACTIVITY_MS) {
    logout();
    return false;
  }
  return true;
}

export async function login(username, password, remember = false) {
  const pHash = await sha256(password);
  if (username !== USERNAME || pHash !== PASSWORD_HASH) return false;

  sessionStorage.setItem(SESSION_KEY, USERNAME);
  if (remember) localStorage.setItem(REMEMBER_KEY, USERNAME);
  touchActivity();
  return true;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function touchActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function bindActivityWatcher(onTimeout) {
  const events = ['click', 'keydown', 'mousemove', 'touchstart'];
  const handler = () => touchActivity();
  events.forEach((e) => window.addEventListener(e, handler, { passive: true }));
  setInterval(() => {
    if (!isAuthenticated()) onTimeout?.();
  }, 30_000);
}
