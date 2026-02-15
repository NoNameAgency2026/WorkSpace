# Workspace - Aplicación de Gestión para Agencias

Una aplicación web completa para la gestión de equipos de trabajo, proyectos, clientes, agenda y facturación.

## 🚀 Características

### Módulos principales
- **Dashboard**: Vista general con Kanban de tareas y calendario
- **Proyectos**: Gestión completa de proyectos con tareas, reuniones y documentos
- **Clientes**: Administración de clientes y sus proyectos asociados
- **Agenda**: Calendario completo con eventos, reuniones y recordatorios
- **Facturación**: Generación de facturas, contratos y cuentas de cobro en PDF

### Funcionalidades
- 🔐 Autenticación segura con cookies httpOnly y JWT
- 📋 Tablero Kanban con drag & drop
- 📅 Calendario con vistas semana, mes y año
- 🔍 Búsqueda global en toda la aplicación
- 📄 Generación de documentos PDF profesionales
- 🌙 Modo oscuro/claro
- 📱 Diseño responsive

## 📋 Requisitos

- Node.js 18+ o Bun
- SQLite (incluido)
- Python 3.8+ (para generación de PDFs)

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd workspace
```

2. **Instalar dependencias**
```bash
bun install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus valores
```

4. **Inicializar la base de datos**
```bash
bun run db:push
bun run db:seed
```

5. **Iniciar en desarrollo**
```bash
bun run dev
```

## 👤 Usuario inicial

Al ejecutar el seed, se crea automáticamente el usuario administrador:

- **Usuario**: `Noname`
- **Contraseña**: `NoName2026`
- **Email**: `admin@workspace.com`

⚠️ **Importante**: En el primer inicio de sesión, se requerirá cambiar la contraseña.

## 🏗️ Estructura del proyecto

```
src/
├── app/                    # Páginas y API routes (Next.js App Router)
│   ├── (app)/             # Rutas autenticadas
│   │   ├── home/          # Dashboard
│   │   ├── proyectos/     # Gestión de proyectos
│   │   ├── clientes/      # Gestión de clientes
│   │   ├── agenda/        # Calendario
│   │   └── facturacion/   # Facturación y PDFs
│   ├── (auth)/            # Rutas de autenticación
│   │   ├── login/
│   │   └── signup/
│   └── api/               # API endpoints
├── components/            # Componentes React
│   └── ui/               # Componentes shadcn/ui
├── lib/                   # Utilidades y configuración
└── stores/               # Estado global (Zustand)

prisma/
├── schema.prisma         # Esquema de base de datos
└── seed.js               # Script de inicialización

scripts/
└── generate_document_pdf.py  # Generación de PDFs
```

## 🔧 Scripts disponibles

```bash
# Desarrollo
bun run dev          # Servidor de desarrollo

# Base de datos
bun run db:push      # Sincronizar schema con DB
bun run db:generate  # Generar cliente Prisma
bun run db:seed      # Ejecutar seed inicial

# Producción
bun run build        # Build para producción
bun run start        # Servidor de producción

# Calidad
bun run lint         # Verificar con ESLint
```

## 📚 Tecnologías

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI**: shadcn/ui, Lucide Icons
- **Estado**: Zustand, TanStack Query
- **Base de datos**: Prisma ORM, SQLite
- **Autenticación**: JWT, cookies httpOnly
- **PDFs**: ReportLab (Python)

## 🚀 Despliegue

Ver [DEPLOY_HOSTINGER.md](./DEPLOY_HOSTINGER.md) para instrucciones detalladas de despliegue en Hostinger.

## 📄 Licencia

MIT License
