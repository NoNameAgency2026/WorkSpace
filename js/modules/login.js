import { login } from '../auth/auth.js';
import { toast } from '../ui/components.js';

export function renderLogin(container) {
  container.innerHTML = `
    <section class="login-wrap card">
      <h1>NoName Workspace</h1>
      <p class="small">Acceso interno del equipo.</p>
      <form id="login-form" class="grid">
        <label>Usuario <input name="username" required autocomplete="username" /></label>
        <label>Contraseña <input type="password" name="password" required autocomplete="current-password" /></label>
        <label><input type="checkbox" name="remember" /> Recordarme</label>
        <button type="submit">Entrar</button>
        <p class="small" id="login-error"></p>
      </form>
      <p class="small">Nota: este login en GitHub Pages es una puerta de acceso de frontend y NO seguridad real para datos sensibles.</p>
    </section>
  `;
  container.querySelector('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const ok = await login(data.get('username'), data.get('password'), data.get('remember') === 'on');
    if (!ok) {
      container.querySelector('#login-error').textContent = 'Credenciales incorrectas.';
      toast('Login fallido');
      return;
    }
    location.hash = '#/tareas';
  });
}
