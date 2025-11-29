# 🚀 MTTO Pro - Guía de Deployment

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      MINIKUBE CLUSTER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Frontend   │  │   Backend   │  │       MySQL         │  │
│  │  (Nginx)    │──│   (Node)    │──│    (Database)       │  │
│  │  Port: 80   │  │  Port: 3001 │  │    Port: 3306       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│  ┌──────┴────────────────┴────────────────────┴──────┐      │
│  │                    Ingress                         │      │
│  │                  mtto.local                        │      │
│  └────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Minikube instalado (`choco install minikube` en Windows)
- kubectl instalado (`choco install kubernetes-cli`)
- Al menos 4GB de RAM disponible

## 📦 Opción 1: Docker Compose (Desarrollo Local)

### Iniciar todos los servicios:

```bash
# Iniciar servicios principales
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

### URLs de acceso:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001/api
- **Adminer (DB UI)**: http://localhost:8081
  - Server: `mysql`
  - User: `mtto_user`
  - Password: `mtto_password`
  - Database: `mtto_db`

### Migrar datos desde Excel:

```bash
# Ejecutar migración (asegúrate de tener Plan_Mant.xlsm en la raíz)
docker-compose --profile migration up migration
```

## ☸️ Opción 2: Minikube (Kubernetes)

### Windows (PowerShell como Admin):

```powershell
# Dar permisos de ejecución
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ejecutar script de deployment
.\scripts\deploy-minikube.ps1
```

### Linux/Mac:

```bash
# Dar permisos de ejecución
chmod +x scripts/deploy-minikube.sh

# Ejecutar script de deployment
./scripts/deploy-minikube.sh
```

### Comandos manuales:

```bash
# 1. Iniciar Minikube
minikube start --memory=4096 --cpus=2

# 2. Configurar Docker para usar Minikube
eval $(minikube docker-env)  # Linux/Mac
minikube docker-env --shell powershell | Invoke-Expression  # Windows

# 3. Construir imágenes
docker build -t mtto-frontend:latest -f docker/frontend/Dockerfile .
docker build -t mtto-backend:latest -f docker/backend/Dockerfile.mysql .

# 4. Desplegar a Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-pv.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# 5. Verificar estado
kubectl get all -n mtto-system

# 6. Acceder a la aplicación
minikube service frontend-service -n mtto-system
```

## 🔍 Comandos Útiles

### Ver pods y servicios:
```bash
kubectl get pods -n mtto-system
kubectl get services -n mtto-system
kubectl get deployments -n mtto-system
```

### Ver logs:
```bash
# Logs del backend
kubectl logs -f deployment/backend -n mtto-system

# Logs de MySQL
kubectl logs -f deployment/mysql -n mtto-system

# Logs del frontend
kubectl logs -f deployment/frontend -n mtto-system
```

### Escalar aplicación:
```bash
# Escalar backend a 3 réplicas
kubectl scale deployment/backend --replicas=3 -n mtto-system

# Escalar frontend a 3 réplicas
kubectl scale deployment/frontend --replicas=3 -n mtto-system
```

### Acceder a MySQL:
```bash
# Conectar al pod de MySQL
kubectl exec -it deployment/mysql -n mtto-system -- mysql -u mtto_user -pmtto_password mtto_db
```

### Dashboard de Minikube:
```bash
minikube dashboard
```

## 🗄️ Estructura de Base de Datos

### Tablas principales:
- `maquinaria` - Inventario de equipos pesados
- `personal` - Directorio de empleados
- `herramientas` - Inventario de herramientas
- `insumos` - Stock de insumos y materiales
- `planes_mantenimiento` - Planes de mantenimiento preventivo
- `actividades_mantenimiento` - Detalle de actividades por plan
- `historial_mantenimiento` - Registro de mantenimientos realizados

### Vistas:
- `v_dashboard_stats` - Estadísticas para el dashboard
- `v_resumen_inventario` - Resumen de inventario por estado

## 🔧 Troubleshooting

### Minikube no inicia:
```bash
minikube delete
minikube start --memory=4096 --cpus=2 --driver=docker
```

### Imágenes no se encuentran:
```bash
# Asegúrate de estar usando el Docker de Minikube
eval $(minikube docker-env)
docker images | grep mtto
```

### MySQL no conecta:
```bash
# Verificar que MySQL está corriendo
kubectl get pods -n mtto-system -l app=mysql

# Ver logs de MySQL
kubectl logs deployment/mysql -n mtto-system
```

### Limpiar todo:
```bash
# Eliminar namespace (elimina todos los recursos)
kubectl delete namespace mtto-system

# O eliminar Minikube completamente
minikube delete
```

## 📊 Monitoreo

### Métricas de recursos:
```bash
# Habilitar metrics-server
minikube addons enable metrics-server

# Ver uso de recursos
kubectl top pods -n mtto-system
kubectl top nodes
```

## 🔐 Seguridad (Producción)

Para producción, actualiza los siguientes valores en `k8s/secrets.yaml`:
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_PASSWORD`
- `JWT_SECRET`

Y considera:
- Habilitar TLS/HTTPS en el Ingress
- Configurar Network Policies
- Usar un gestor de secretos (Vault, Sealed Secrets)

