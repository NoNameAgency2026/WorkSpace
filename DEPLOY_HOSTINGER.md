# Guía de Despliegue en Hostinger

Esta guía cubre el despliegue de la aplicación Workspace en Hostinger, tanto para VPS/Cloud como para Hosting Compartido.

---

## 📋 Requisitos previos

- Cuenta de Hostinger activa
- Dominio configurado (opcional pero recomendado)
- Acceso SSH (para VPS) o File Manager (para hosting compartido)
- SSL certificado (Let's Encrypt gratuito disponible en Hostinger)

---

## 🖥️ Opción 1: Hostinger VPS/Cloud (Recomendado)

El VPS permite ejecutar la aplicación completa con backend Node.js.

### 1. Preparar el VPS

```bash
# Conectar por SSH
ssh root@tu-vps-ip

# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Instalar Bun (alternativa más rápida)
curl -fsSL https://bun.sh/install | bash

# Instalar Python y dependencias para PDFs
apt install -y python3 python3-pip
pip3 install reportlab pillow

# Instalar PM2 para gestión de procesos
npm install -g pm2

# Instalar Nginx
apt install -y nginx
```

### 2. Preparar la aplicación

```bash
# Crear directorio
mkdir -p /var/www/workspace
cd /var/www/workspace

# Subir código (desde tu máquina local)
scp -r ./* root@tu-vps-ip:/var/www/workspace/

# O clonar desde repositorio
git clone <repository-url> .

# Instalar dependencias
bun install
# o npm install

# Configurar variables de entorno
cp .env.example .env
nano .env
```

### 3. Configurar .env para producción

```env
DATABASE_URL="file:/var/www/workspace/db/production.db"
AUTH_SECRET="clave-super-segura-de-al-menos-32-caracteres"
NODE_ENV="production"
PORT="3000"

# Usuario inicial
SEED_ADMIN_USERNAME="Noname"
SEED_ADMIN_PASSWORD="NoName2026"
SEED_ADMIN_EMAIL="admin@tudominio.com"

# Información de empresa
COMPANY_NAME="Mi Agencia"
COMPANY_NIT="123456789-0"
COMPANY_ADDRESS="Tu dirección"
COMPANY_PHONE="Tu teléfono"
COMPANY_EMAIL="contacto@tudominio.com"
```

### 4. Build e inicialización

```bash
# Generar cliente Prisma
bun run db:generate

# Build de producción
bun run build

# Inicializar base de datos
bun run db:push
bun run db:seed
```

### 5. Configurar PM2

```bash
# Crear archivo de configuración PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'workspace',
    script: 'bun',
    args: 'run start',
    cwd: '/var/www/workspace',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Iniciar con PM2
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

### 6. Configurar Nginx como Reverse Proxy

```bash
# Crear configuración
nano /etc/nginx/sites-available/workspace
```

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Aumentar límites para subida de archivos
    client_max_body_size 10M;
}
```

```bash
# Habilitar sitio
ln -s /etc/nginx/sites-available/workspace /etc/nginx/sites-enabled/

# Verificar configuración
nginx -t

# Reiniciar Nginx
systemctl restart nginx
```

### 7. Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
apt install -y certbot python3-certbot-nginx

# Obtener certificado
certbot --nginx -d tudominio.com -d www.tudominio.com

# Renovación automática
systemctl enable certbot.timer
```

### 8. Configurar Firewall

```bash
# Instalar UFW
apt install -y ufw

# Configurar reglas
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'

# Activar
ufw enable
```

### 9. Actualizaciones

```bash
# Script de actualización
cat > /var/www/workspace/update.sh << 'EOF'
#!/bin/bash
cd /var/www/workspace
git pull
bun install
bun run db:generate
bun run db:push
bun run build
pm2 restart workspace
EOF

chmod +x /var/www/workspace/update.sh
```

---

## 📁 Opción 2: Hosting Compartido

Para hosting compartido, exportamos como sitio estático con fallback.

### Limitaciones
- ❌ No ejecuta backend Node.js
- ❌ Sin API routes dinámicas
- ✅ Solo para frontend estático
- ✅ Requiere servicio externo para backend (Vercel, Railway, etc.)

### Pasos

1. **Modificar next.config.ts para export estático**

```typescript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};
```

2. **Build estático**

```bash
bun run build
```

3. **Subir a Hostinger**

- Acceder a File Manager en hPanel
- Navegar a `public_html`
- Subir contenido de la carpeta `out/` generada

4. **Configurar .htaccess para SPA**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Recomendación
Para hosting compartido, se recomienda:
1. Desplegar el backend en un servicio como Railway, Render o VPS
2. Desplegar solo el frontend estático en Hostinger
3. Configurar CORS y variables de API en el frontend

---

## 🔒 Seguridad adicional

### Rate Limiting con Nginx (VPS)

```nginx
# En http block
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

# En server block
location /api/auth/login {
    limit_req zone=login burst=10 nodelay;
    proxy_pass http://localhost:3000;
}
```

### Headers de seguridad

```nginx
# Añadir a server block
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### Backup automático (VPS)

```bash
# Script de backup
cat > /var/www/workspace/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/workspace"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup base de datos
cp /var/www/workspace/db/production.db $BACKUP_DIR/db_$DATE.db

# Backup documentos
tar -czf $BACKUP_DIR/docs_$DATE.tar.gz /var/www/workspace/public/documents/

# Mantener solo últimos 30 días
find $BACKUP_DIR -mtime +30 -delete
EOF

chmod +x /var/www/workspace/backup.sh

# Programar con cron
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/workspace/backup.sh") | crontab -
```

---

## 📊 Monitoreo (VPS)

### Logs de la aplicación

```bash
# Ver logs en tiempo real
pm2 logs workspace

# Logs de Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Métricas con PM2

```bash
pm2 monit
```

---

## 🆘 Solución de problemas

### Error 502 Bad Gateway
- Verificar que la app Node.js esté corriendo: `pm2 status`
- Verificar logs: `pm2 logs workspace`

### Error de base de datos
- Verificar permisos: `chmod 644 db/production.db`
- Verificar schema: `bun run db:push`

### PDFs no se generan
- Verificar Python: `python3 --version`
- Verificar reportlab: `pip3 list | grep reportlab`

### SSL no funciona
- Verificar certificado: `certbot certificates`
- Renovar: `certbot renew`

---

## 📞 Soporte

Para problemas específicos de Hostinger, consultar:
- [Documentación de Hostinger](https://support.hostinger.com/)
- [Comunidad Hostinger](https://community.hostinger.com/)
