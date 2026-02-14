export const appConfig = {
  syncMode: 'local', // 'local' | 'remote'
  remote: {
    provider: 'supabase',
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'YOUR_PUBLIC_KEY',
    notes: 'Opcional: agrega credenciales para modo equipo. Sin credenciales la app sigue en local.'
  }
};
