import { store } from './store.js';
import { route } from './router.js';
import { bindActivityWatcher, logout } from './auth/auth.js';
import { toast } from './ui/components.js';

let saveStatus = 'Guardado';

async function bootstrap() {
  await store.init();

  store.setSaveStatusHandler((status) => {
    saveStatus = status;
    route(store, saveStatus);
  });

  const rerender = () => route(store, saveStatus);
  window.addEventListener('hashchange', rerender);
  store.subscribe(rerender);

  bindActivityWatcher(() => {
    logout();
    location.hash = '#/login';
    toast('Sesión cerrada por inactividad');
  });

  if (!location.hash) location.hash = '#/login';
  rerender();
}

bootstrap();
