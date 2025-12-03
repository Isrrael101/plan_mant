# Script para cargar TODOS los datos en MySQL Docker
Write-Host "🚀 Iniciando carga masiva de datos..." -ForegroundColor Cyan

# 1. Copiar archivos CSV al contenedor
Write-Host "📦 Copiando archivos al contenedor..." -ForegroundColor Yellow
docker exec mtto-mysql mkdir -p /tmp/data
docker cp database/data/. mtto-mysql:/tmp/data/

# 2. Copiar script SQL al contenedor
Write-Host "📜 Copiando script SQL..." -ForegroundColor Yellow
docker cp database/load_data_docker_full.sql mtto-mysql:/tmp/load_data.sql

# 3. Ejecutar script SQL en el contenedor
Write-Host "🔄 Ejecutando carga en MySQL..." -ForegroundColor Cyan
docker exec -i mtto-mysql mysql -umtto_user -pmtto_password mtto_db --local-infile=1 -e "source /tmp/load_data.sql"

Write-Host "✅ Datos cargados exitosamente!" -ForegroundColor Green
