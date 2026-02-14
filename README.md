# NoName Agency Workspace

SPA estática (HTML/CSS/JS) para productividad interna de **NoName Agency**, compatible con **GitHub Pages**.

## Módulos
- Login (`NoName` / `Noname_2026`) con guard de rutas hash.
- Tareas Kanban: Backlog, En progreso, En revisión, Hecho.
- Calendario: eventos + deadlines de tareas (conmutador en ajustes).
- Clientes (CRM ligero) con detalle asociado.
- Facturación con cálculo de total, estado y salida para impresión/PDF.
- Notas/Wiki interna.
- Reportes rápidos.
- Ajustes: prefijos, export/import JSON, reset demo.

## Seguridad (importante)
Este login es **solo frontend** (access gate) y **no es seguridad real** para datos sensibles al desplegar en GitHub Pages.

## Persistencia y guardado
- Modo por defecto: `localStorage` (adapter local).
- Autosave en cambios con debounce (~1s).
- Persistencia periódica cada 30 segundos.
- Indicador visual: Guardando… / Guardado / Error al guardar.

## Sync remoto opcional
Archivo `config.js` incluye placeholders para un modo remoto (por ejemplo Supabase). Si no se configura, la app funciona en modo local.

## Ejecución local
1. Abrir `index.html` directamente en navegador, o servir carpeta estática.
2. Iniciar sesión con:
   - Usuario: `NoName`
   - Password: `Noname_2026`

## Deploy en GitHub Pages
- Publicar raíz del repositorio en Pages.
- Usar rutas hash (`#/tareas`, `#/clientes`, etc.) para evitar 404 en refresh.

## Estructura
- `index.html`
- `css/styles.css`
- `js/app.js`, `js/router.js`, `js/store.js`
- `js/auth/auth.js`
- `js/storage/storageProvider.js`, `js/storage/localDb.js`
- `js/modules/*`
- `js/ui/components.js`
- `js/utils/*`
- `config.js`
