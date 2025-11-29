# Script PowerShell para iniciar el sistema MTTO Pro con Docker

Write-Host "🚀 Iniciando MTTO Pro con Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker esté instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado. Por favor instala Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Verificar que Docker Compose esté instalado
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose no está instalado. Por favor instala Docker Desktop primero." -ForegroundColor Red
    exit 1
}

# Detener contenedores existentes si los hay
Write-Host "🛑 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

# Construir y levantar los servicios
Write-Host "🔨 Construyendo e iniciando servicios..." -ForegroundColor Green
docker-compose up --build -d

# Esperar a que MySQL esté listo
Write-Host "⏳ Esperando a que MySQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Verificar estado de los servicios
Write-Host ""
Write-Host "📊 Estado de los servicios:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "✅ Sistema iniciado!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Servicios disponibles:" -ForegroundColor Cyan
Write-Host "   - Frontend:    http://localhost:8080" -ForegroundColor White
Write-Host "   - Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   - Adminer:     http://localhost:8081" -ForegroundColor White
Write-Host ""
Write-Host "📝 Para ver los logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para detener:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""

