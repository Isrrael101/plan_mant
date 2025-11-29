---
description: Iniciar MySQL y la aplicación completa
---

# Workflow: Iniciar MySQL y la Aplicación Completa

Este workflow inicia la base de datos MySQL, genera datos de prueba, y ejecuta el backend y frontend.

## Pasos

1. Detener contenedores existentes y limpiar volúmenes
```bash
docker-compose down -v
```

// turbo
2. Iniciar solo MySQL y esperar que esté listo
```bash
docker-compose up -d mysql
```

3. Esperar 30 segundos para que MySQL esté completamente iniciado
```bash
Start-Sleep -Seconds 30
```

// turbo
4. Verificar que MySQL está corriendo
```bash
docker-compose ps mysql
```

// turbo
5. Generar 1000 datos de prueba
```bash
cd database && python generate_sample_data.py && cd ..
```

// turbo
6. Iniciar el backend
```bash
cd backend && npm install && npm start
```

// turbo
7. En otra terminal, iniciar el frontend
```bash
cd frontend && npm install && npm run dev
```

## Acceso a los servicios

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Adminer (Admin de BD)**: http://localhost:8081
  - Sistema: MySQL
  - Servidor: mysql
  - Usuario: mtto_user
  - Contraseña: mtto_password
  - Base de datos: mtto_db
