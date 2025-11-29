# ============================================
# Script de Despliegue Automatizado en Minikube
# MTTO Pro - Sistema de Gestión de Mantenimiento
# ============================================

Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "  MTTO Pro - Despliegue en Minikube"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. Verificar Minikube
# ============================================
Write-Host "🔍 Verificando Minikube..." -ForegroundColor Yellow

$minikubeStatus = minikube status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Minikube no está corriendo. Iniciando Minikube..." -ForegroundColor Red
    minikube start --driver=docker --cpus=4 --memory=4096
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al iniciar Minikube. Abortando." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Minikube está corriendo" -ForegroundColor Green
}
Write-Host ""

# ============================================
# 2. Configurar entorno Docker de Minikube
# ============================================
Write-Host "🐳 Configurando entorno Docker de Minikube..." -ForegroundColor Yellow
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
Write-Host "✅ Entorno Docker configurado" -ForegroundColor Green
Write-Host ""

# ============================================
# 3. Construir imágenes Docker
# ============================================
Write-Host "🔨 Construyendo imágenes Docker..." -ForegroundColor Yellow

# Obtener ruta del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "  📦 Construyendo imagen del frontend..." -ForegroundColor Cyan
docker build -t mtto-frontend:latest -f "$projectRoot/docker/frontend/Dockerfile" "$projectRoot"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir imagen del frontend" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Frontend construido" -ForegroundColor Green

Write-Host "  📦 Construyendo imagen del backend..." -ForegroundColor Cyan
docker build -t mtto-backend:latest -f "$projectRoot/docker/backend/Dockerfile" "$projectRoot"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al construir imagen del backend" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Backend construido" -ForegroundColor Green
Write-Host ""

# ============================================
# 4. Aplicar recursos de Kubernetes
# ============================================
Write-Host "☸️  Aplicando recursos de Kubernetes..." -ForegroundColor Yellow

$k8sPath = "$projectRoot/k8s"

# Namespace
Write-Host "  📁 Creando namespace..." -ForegroundColor Cyan
kubectl apply -f "$k8sPath/namespace.yaml"

# Secrets y ConfigMaps
Write-Host "  🔐 Aplicando secrets y configmaps..." -ForegroundColor Cyan
kubectl apply -f "$k8sPath/secrets.yaml"
kubectl apply -f "$k8sPath/configmap.yaml"
kubectl apply -f "$k8sPath/mysql-init-configmap.yaml"

# PersistentVolume y PVC
Write-Host "  💾 Configurando almacenamiento..." -ForegroundColor Cyan
kubectl apply -f "$k8sPath/mysql-pv.yaml"

# Esperar a que el PVC esté bound
Write-Host "  ⏳ Esperando a que PVC esté disponible..." -ForegroundColor Cyan
$timeout = 30
$elapsed = 0
while ($elapsed -lt $timeout) {
    $pvcStatus = kubectl get pvc mysql-pvc -n mtto-system -o jsonpath='{.status.phase}' 2>$null
    if ($pvcStatus -eq "Bound") {
        Write-Host "  ✅ PVC disponible" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 2
    $elapsed += 2
}

# MySQL
Write-Host "  🗄️  Desplegando MySQL..." -ForegroundColor Cyan
kubectl apply -f "$k8sPath/mysql-deployment.yaml"

# Esperar a que MySQL esté ready
Write-Host "  ⏳ Esperando a que MySQL esté listo..." -ForegroundColor Cyan
kubectl wait --for=condition=ready pod -l app=mysql -n mtto-system --timeout=120s
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ MySQL está listo" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  MySQL tardó más de lo esperado, continuando..." -ForegroundColor Yellow
}

# Esperar unos segundos adicionales para que MySQL inicialice completamente
Start-Sleep -Seconds 10

# Job de generación de datos
Write-Host "  📊 Ejecutando generación de datos profesionales..." -ForegroundColor Cyan
# Eliminar job anterior si existe
kubectl delete job data-generation -n mtto-system --ignore-not-found=true
Start-Sleep -Seconds 5

# Aplicar el ConfigMap y el Job
kubectl apply -f "$k8sPath/data-generation-job.yaml"

Write-Host "  ⏳ Esperando a que la generación de datos complete..." -ForegroundColor Cyan
Write-Host "     (Esto puede tardar 1-2 minutos)" -ForegroundColor Gray

$jobTimeout = 180
$jobElapsed = 0
while ($jobElapsed -lt $jobTimeout) {
    $jobStatus = kubectl get job data-generation -n mtto-system -o jsonpath='{.status.succeeded}' 2>$null
    if ($jobStatus -eq "1") {
        Write-Host "  ✅ Datos profesionales generados exitosamente" -ForegroundColor Green
        
        # Mostrar logs del job
        Write-Host ""
        Write-Host "  📋 Últimas líneas del log:" -ForegroundColor Cyan
        kubectl logs -n mtto-system job/data-generation --tail=15
        Write-Host ""
        break
    }
    
    $jobFailed = kubectl get job data-generation -n mtto-system -o jsonpath='{.status.failed}' 2>$null
    if ($jobFailed -gt 0) {
        Write-Host "  ❌ Error en la generación de datos" -ForegroundColor Red
        Write-Host "  📋 Logs del error:" -ForegroundColor Yellow
        kubectl logs -n mtto-system job/data-generation --tail=30
        exit 1
    }
    
    Start-Sleep -Seconds 5
    $jobElapsed += 5
    Write-Host "." -NoNewline -ForegroundColor Gray
}

if ($jobElapsed -ge $jobTimeout) {
    Write-Host ""
    Write-Host "  ⚠️  La generación de datos está tomando más tiempo del esperado" -ForegroundColor Yellow
    Write-Host "     Continuando con el despliegue..." -ForegroundColor Yellow
}

# Backend
Write-Host "  🔧 Desplegando backend..." -ForegroundColor Cyan
kubectl apply -f "$k8sPath/backend-deployment.yaml"

# Frontend
Write-Host "  🌐 Desplegando frontend..." -ForegroundColor Cyan
kubectl apply -f "$k8sPath/frontend-deployment.yaml"

Write-Host "✅ Recursos aplicados" -ForegroundColor Green
Write-Host ""

# ============================================
# 5. Esperar a que todos los pods estén ready
# ============================================
Write-Host "⏳ Esperando a que todos los servicios estén listos..." -ForegroundColor Yellow

# Esperar backend
Write-Host "  🔧 Esperando backend..." -ForegroundColor Cyan
kubectl wait --for=condition=ready pod -l app=backend -n mtto-system --timeout=120s
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Backend listo" -ForegroundColor Green
}

# Esperar frontend
Write-Host "  🌐 Esperando frontend..." -ForegroundColor Cyan
kubectl wait --for=condition=ready pod -l app=frontend -n mtto-system --timeout=120s
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Frontend listo" -ForegroundColor Green
}

Write-Host ""

# ============================================
# 6. Mostrar información de acceso
# ============================================
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "  ✅ DESPLIEGUE COMPLETADO"  -ForegroundColor Green
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 Estado de los pods:" -ForegroundColor Yellow
kubectl get pods -n mtto-system
Write-Host ""

Write-Host "🌐 Servicios:" -ForegroundColor Yellow
kubectl get svc -n mtto-system
Write-Host ""

# Obtener URL del frontend
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "  🌐 Acceso a la Aplicación"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host ""

Write-Host "Para acceder a la aplicación, ejecuta uno de estos comandos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Opción 1 - Obtener URL del servicio:" -ForegroundColor Cyan
Write-Host "    minikube service frontend-service -n mtto-system" -ForegroundColor White
Write-Host ""
Write-Host "  Opción 2 - Acceder directamente al NodePort:" -ForegroundColor Cyan
$minikubeIp = minikube ip
Write-Host "    http://${minikubeIp}:30080" -ForegroundColor White
Write-Host ""

Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host "  📋 Comandos Útiles"  -ForegroundColor Cyan
Write-Host "=========================================="  -ForegroundColor Cyan
Write-Host ""
Write-Host "Ver logs del backend:" -ForegroundColor Yellow
Write-Host "  kubectl logs -n mtto-system -l app=backend --tail=50 -f" -ForegroundColor White
Write-Host ""
Write-Host "Ver logs del frontend:" -ForegroundColor Yellow
Write-Host "  kubectl logs -n mtto-system -l app=frontend --tail=50 -f" -ForegroundColor White
Write-Host ""
Write-Host "Ver logs de MySQL:" -ForegroundColor Yellow
Write-Host "  kubectl logs -n mtto-system -l app=mysql --tail=50 -f" -ForegroundColor White
Write-Host ""
Write-Host "Ver todos los recursos:" -ForegroundColor Yellow
Write-Host "  kubectl get all -n mtto-system" -ForegroundColor White
Write-Host ""
Write-Host "Acceder a MySQL:" -ForegroundColor Yellow
Write-Host "  kubectl port-forward -n mtto-system svc/mysql-service 3306:3306" -ForegroundColor White
Write-Host "  Luego: mysql -h 127.0.0.1 -u mtto_user -p" -ForegroundColor White
Write-Host "  Password: mtto_password" -ForegroundColor Gray
Write-Host ""
Write-Host "Eliminar todo el despliegue:" -ForegroundColor Yellow
Write-Host "  kubectl delete namespace mtto-system" -ForegroundColor White
Write-Host ""
