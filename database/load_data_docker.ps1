# Script PowerShell para cargar datos CSV en MySQL desde Docker

Write-Host "📊 Cargando datos en MySQL desde Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar que el contenedor MySQL esté corriendo
$mysqlRunning = docker ps | Select-String "mtto-mysql"
if (-not $mysqlRunning) {
    Write-Host "❌ El contenedor MySQL no está corriendo. Inicia Docker Compose primero." -ForegroundColor Red
    exit 1
}

# Función para cargar CSV
function Load-CSV {
    param(
        [string]$ContainerName,
        [string]$CSVFile,
        [string]$TableName,
        [string]$User,
        [string]$Password,
        [string]$Database
    )
    
    Write-Host "📁 Cargando $TableName..." -ForegroundColor Yellow
    
    # Leer archivo CSV
    $csvContent = Get-Content $CSVFile -Raw
    
    # Convertir CSV a formato SQL INSERT
    $lines = Get-Content $CSVFile
    $header = $lines[0]
    $dataLines = $lines[1..($lines.Length-1)]
    
    # Crear comandos INSERT
    $inserts = @()
    foreach ($line in $dataLines) {
        if ($line.Trim()) {
            $values = $line -split ',' | ForEach-Object { 
                $val = $_.Trim('"')
                if ($val -eq 'NULL' -or $val -eq '') {
                    'NULL'
                } else {
                    "'$($val.Replace("'", "''"))'"
                }
            }
            $inserts += "INSERT INTO $TableName VALUES ($($values -join ','));"
        }
    }
    
    # Ejecutar en contenedor
    $sql = $inserts -join "`n"
    $sql | docker exec -i $ContainerName mysql -u$User -p$Password $Database
    
    Write-Host "✅ $TableName cargado" -ForegroundColor Green
}

# Cargar datos tabla por tabla
Write-Host "🔄 Cargando datos..." -ForegroundColor Cyan

# Maquinaria
docker exec -i mtto-mysql mysql -umtto_user -pmtto_password mtto_db -e "SET FOREIGN_KEY_CHECKS = 0;"
Get-Content database/data/01_maquinaria.csv | Select-Object -Skip 1 | ForEach-Object {
    $fields = $_ -split ',' | ForEach-Object { $_.Trim('"') }
    $sql = "INSERT INTO maquinaria (id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales) VALUES ($($fields[0]), '$($fields[1])', '$($fields[2])', '$($fields[3])', '$($fields[4])', '$($fields[5])', '$($fields[6])', $($fields[7]), $($fields[8]));"
    docker exec -i mtto-mysql mysql -umtto_user -pmtto_password mtto_db -e $sql
}

Write-Host ""
Write-Host "✅ Proceso completado!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Nota: Para cargar todos los datos, usa Adminer o ejecuta los comandos SQL manualmente" -ForegroundColor Yellow
Write-Host "   Adminer: http://localhost:8081" -ForegroundColor Cyan

