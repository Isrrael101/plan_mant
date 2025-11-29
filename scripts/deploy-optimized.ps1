# Script de despliegue optimizado con MySQL sincronizado
Write-Host "
🚀 Desplegando aplicación con MySQL sincronizado..." -ForegroundColor Green

# 1. Crear ConfigMap con schema
Write-Host "
1. Configurando MySQL con schema..." -ForegroundColor Cyan
kubectl create configmap mysql-init-config --from-file=init.sql=database/schema.sql -n mtto-system --dry-run=client -o yaml | kubectl apply -f -

# 2. Aplicar todos los recursos
Write-Host "
2. Aplicando recursos Kubernetes..." -ForegroundColor Cyan
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-pv.yaml
kubectl apply -f k8s/mysql-deployment.yaml

# 3. Esperar MySQL
Write-Host "
3. Esperando MySQL..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=mysql -n mtto-system --timeout=180s

# 4. Aplicar backend y frontend
Write-Host "
4. Desplegando backend y frontend..." -ForegroundColor Cyan
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# 5. Esperar pods
Write-Host "
5. Esperando pods..." -ForegroundColor Yellow
kubectl wait --for=condition=ready pod -l app=backend -n mtto-system --timeout=120s
kubectl wait --for=condition=ready pod -l app=frontend -n mtto-system --timeout=120s

Write-Host "
✅ Deployment completado!" -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:8080" -ForegroundColor Cyan
