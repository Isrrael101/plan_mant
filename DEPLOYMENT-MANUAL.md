# ============================================
# Pasos para Desplegar MTTO Pro en Minikube
# ============================================

## Requisitos Previos

Antes de ejecutar el despliegue, asegúrate de que:

1. **Docker Desktop esté corriendo**
   - Abre Docker Desktop y espera a que esté completamente iniciado
   - Verifica que el ícono de Docker en la bandeja del sistema esté verde

2. **Minikube esté instalado**
   - Si no lo tienes, instálalo desde: https://minikube.sigs.k8s.io/docs/start/

## Pasos para Desplegar

### Opción 1: Script Automatizado (Recomendado)

Ejecuta el siguiente comando desde PowerShell en la raíz del proyecto:

```powershell
.\scripts\deploy-minikube.ps1
```

Este script hará automáticamente:
1. ✅ Verificar e iniciar Minikube si no está corriendo
2. ✅ Configurar el entorno Docker de Minikube
3. ✅ Construir las imágenes Docker del frontend y backend
4. ✅ Aplicar todos los recursos de Kubernetes (namespace, secrets, configmaps, etc.)
5. ✅ Desplegar MySQL con el schema
6. ✅ Ejecutar el job de generación de datos profesionales (~1000+ registros)
7. ✅ Desplegar backend y frontend
8. ✅ Mostrar la URL de acceso a la aplicación

### Opción 2: Pasos Manuales

Si prefieres ejecutar los pasos manualmente:

```powershell
# 1. Iniciar Minikube
minikube start --driver=docker --cpus=4 --memory=4096

# 2. Configurar Docker para usar el daemon de Minikube
& minikube -p minikube docker-env --shell powershell | Invoke-Expression

# 3. Construir imágenes
docker build -t mtto-frontend:latest -f docker/frontend/Dockerfile .
docker build -t mtto-backend:latest -f docker/backend/Dockerfile .

# 4. Aplicar recursos de Kubernetes
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/mysql-init-configmap.yaml
kubectl apply -f k8s/mysql-pv.yaml
kubectl apply -f k8s/mysql-deployment.yaml

# 5. Esperar a que MySQL esté listo
kubectl wait --for=condition=ready pod -l app=mysql -n mtto-system --timeout=120s

# 6. Generar datos profesionales
kubectl apply -f k8s/data-generation-job.yaml

# Esperar a que el job complete
kubectl wait --for=condition=complete job/data-generation -n mtto-system --timeout=180s

# Verificar logs del job
kubectl logs -n mtto-system job/data-generation

# 7. Desplegar backend y frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# 8. Esperar a que estén listos
kubectl wait --for=condition=ready pod -l app=backend -n mtto-system --timeout=120s
kubectl wait --for=condition=ready pod -l app=frontend -n mtto-system --timeout=120s
```

## Acceder a la Aplicación

Después del despliegue exitoso, puedes acceder a la aplicación de dos formas:

### Opción 1: Usando minikube service
```powershell
minikube service frontend-service -n mtto-system
```

Este comando abrirá automáticamente tu navegador con la URL correcta.

### Opción 2: Acceso directo al NodePort
```powershell
# Obtener IP de Minikube
$MINIKUBE_IP = minikube ip

# La aplicación estará disponible en:
# http://<MINIKUBE_IP>:30080
```

## Comandos Útiles

### Ver estado de los pods
```powershell
kubectl get pods -n mtto-system
```

### Ver logs del backend
```powershell
kubectl logs -n mtto-system -l app=backend --tail=50 -f
```

### Ver logs del frontend
```powershell
kubectl logs -n mtto-system -l app=frontend --tail=50 -f
```

### Ver logs de MySQL
```powershell
kubectl logs -n mtto-system -l app=mysql --tail=50 -f
```

### Ver logs de generación de datos
```powershell
kubectl logs -n mtto-system job/data-generation
```

### Conectarse a MySQL directamente
```powershell
# Port forward
kubectl port-forward -n mtto-system svc/mysql-service 3306:3306

# En otra terminal, conectarse
mysql -h 127.0.0.1 -u mtto_user -p
# Password: mtto_password
```

### Verificar cantidad de datos generados
```powershell
kubectl exec -it -n mtto-system deployment/backend -- sh -c "echo 'SELECT COUNT(*) FROM maquinaria; SELECT COUNT(*) FROM personal; SELECT COUNT(*) FROM herramientas; SELECT COUNT(*) FROM insumos;' | mysql -h mysql-service -u mtto_user -pmtto_password mtto_db"
```

## Datos Generados

El job de generación de datos crea aproximadamente:
- **250 Maquinarias**: Excavadoras, cargadores, bulldozers, etc.
- **180 Personal**: Operadores, mecánicos, supervisores, ingenieros
- **220 Herramientas**: Eléctricas, neumáticas, manuales, instrumentos
- **250 Insumos**: Lubricantes, filtros, repuestos, baterías
- **1500+ Planes de Mantenimiento**: 6 planes por máquina (10H, 50H, 250H, 500H, 1000H, 2000H)
- **100+ Registros de Historial**: Mantenimientos realizados

## Solución de Problemas

### Docker no está corriendo
```
Error: Cannot connect to the Docker daemon
```
**Solución**: Abre Docker Desktop y espera a que inicie completamente.

### Minikube no inicia
```
Error: Failed to start minikube
```
**Solución**: 
```powershell
minikube delete
minikube start --driver=docker --cpus=4 --memory=4096
```

### Pods en estado CrashLoopBackOff
```powershell
# Ver logs del pod con error
kubectl logs -n mtto-system <nombre-del-pod>

# Describir el pod para ver eventos
kubectl describe pod -n mtto-system <nombre-del-pod>
```

### Regenerar datos
```powershell
# Eliminar el job anterior
kubectl delete job data-generation -n mtto-system

# Opcional: Limpiar datos de MySQL
kubectl exec -it -n mtto-system deployment/mysql -- mysql -u root -prootpassword123 -e "DROP DATABASE mtto_db; CREATE DATABASE mtto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Volver a aplicar el schema
kubectl delete pod -n mtto-system -l app=mysql
# Esperar a que MySQL reinicie y ejecute el init script

# Ejecutar el job de generación nuevamente
kubectl apply -f k8s/data-generation-job.yaml
```

### Eliminar todo el despliegue
```powershell
kubectl delete namespace mtto-system
```

## Próximos Pasos

Una vez que la aplicación esté corriendo:
1. Accede a la URL proporcionada
2. Verifica que el dashboard muestre las estadísticas de datos
3. Navega por las diferentes secciones (Maquinaria, Personal, Herramientas, Insumos)
4. Explora los planes de mantenimiento
5. Revisa el historial de mantenimientos
