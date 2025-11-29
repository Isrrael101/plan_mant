# 🐳 MTTO Pro - Guía de Docker

Sistema de Gestión de Mantenimiento ejecutándose en Docker con MySQL.

## 📋 Requisitos Previos

- Docker Desktop instalado y ejecutándose
- Docker Compose (incluido en Docker Desktop)
- Al menos 4GB de RAM disponibles
- Puertos libres: 3001, 3306, 8080, 8081

## 🚀 Inicio Rápido

### Windows (PowerShell)
```powershell
.\docker-start.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x docker-start.sh
./docker-start.sh
```

### Manual
```bash
# Construir e iniciar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Ver estado
docker-compose ps
```

## 📍 Servicios Disponibles

Una vez iniciado, los servicios estarán disponibles en:

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Adminer (DB Manager)**: http://localhost:8081
- **MySQL**: localhost:3306

## 🗄️ Acceso a Base de Datos

### Credenciales MySQL
- **Host**: localhost (desde tu máquina) o `mysql` (desde otros contenedores)
- **Puerto**: 3306
- **Usuario**: mtto_user
- **Contraseña**: mtto_password
- **Base de datos**: mtto_db

### Adminer
1. Abre http://localhost:8081
2. Sistema: **MySQL**
3. Servidor: **mysql**
4. Usuario: **mtto_user**
5. Contraseña: **mtto_password**
6. Base de datos: **mtto_db**

## 🔧 Comandos Útiles

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Reiniciar un servicio
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ elimina datos)
```bash
docker-compose down -v
```

### Reconstruir un servicio específico
```bash
docker-compose up --build -d backend
```

## 📊 Estructura del Sistema

```
mtto-mysql      → Base de datos MySQL 8.0
mtto-backend    → API Node.js con Express
mtto-frontend   → React + Vite + Nginx
mtto-adminer    → Interfaz web para MySQL
```

## 🔍 Verificar que Todo Funciona

1. **Backend**: http://localhost:3001/api/health
   - Debe responder: `{"status":"OK","message":"Backend is running","database":"connected"}`

2. **Frontend**: http://localhost:8080
   - Debe cargar la aplicación React

3. **Base de datos**: Conectar con Adminer o cliente MySQL
   - Verificar que las tablas estén creadas

## 🐛 Solución de Problemas

### El backend no se conecta a MySQL
```bash
# Verificar que MySQL esté corriendo
docker-compose ps mysql

# Ver logs de MySQL
docker-compose logs mysql

# Reiniciar MySQL
docker-compose restart mysql
```

### El frontend no carga
```bash
# Verificar logs del frontend
docker-compose logs frontend

# Reconstruir frontend
docker-compose up --build -d frontend
```

### Puerto ya en uso
Si algún puerto está ocupado, edita `docker-compose.yaml` y cambia:
- Frontend: `8080:80` → `8082:80`
- Backend: `3001:3001` → `3002:3001`
- MySQL: `3306:3306` → `3307:3306`
- Adminer: `8081:8080` → `8083:8080`

### Limpiar todo y empezar de nuevo
```bash
# Detener y eliminar contenedores, redes y volúmenes
docker-compose down -v

# Eliminar imágenes
docker rmi mtto-backend mtto-frontend

# Volver a construir
docker-compose up --build -d
```

## 📝 Notas Importantes

- La base de datos se inicializa automáticamente con el schema desde `database/schema.sql`
- Los datos persisten en el volumen `mtto-mysql-data`
- El frontend se construye en producción (optimizado)
- El backend usa el servidor MySQL (`server-mysql.js`)

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Esta configuración es para desarrollo. Para producción:

1. Cambia las contraseñas en `docker-compose.yaml`
2. Usa variables de entorno para credenciales
3. Configura SSL/TLS
4. Limita el acceso a los puertos
5. Usa secrets de Docker para datos sensibles

## 📚 Más Información

- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Documentación de MySQL](https://dev.mysql.com/doc/)
- [Documentación de Node.js](https://nodejs.org/docs/)

