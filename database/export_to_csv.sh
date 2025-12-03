#!/bin/bash
# Script para exportar todas las tablas de MySQL a CSV con UTF-8

DB_USER="mtto_user"
DB_PASS="mtto_password"
DB_NAME="mtto_db"
EXPORT_DIR="/tmp/csv_exports"

# Crear directorio de exportación
mkdir -p $EXPORT_DIR

# Función para exportar tabla a CSV
export_table() {
    local table_name=$1
    echo "Exportando tabla: $table_name"
    
    mysql -u $DB_USER -p$DB_PASS $DB_NAME --default-character-set=utf8mb4 -e "
    SET NAMES utf8mb4;
    SELECT * FROM $table_name
    " | sed 's/\t/","/g;s/^/"/;s/$/"/;s/\n//g' > "$EXPORT_DIR/${table_name}.csv"
    
    # Agregar headers
    mysql -u $DB_USER -p$DB_PASS $DB_NAME --default-character-set=utf8mb4 -e "
    SET NAMES utf8mb4;
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = '$DB_NAME' AND TABLE_NAME = '$table_name'
    ORDER BY ORDINAL_POSITION
    " | tail -n +2 | tr '\n' ',' | sed 's/,$/\n/' > "$EXPORT_DIR/${table_name}_headers.txt"
    
    # Combinar headers con datos
    cat "$EXPORT_DIR/${table_name}_headers.txt" "$EXPORT_DIR/${table_name}.csv" > "$EXPORT_DIR/${table_name}_final.csv"
    rm "$EXPORT_DIR/${table_name}_headers.txt" "$EXPORT_DIR/${table_name}.csv"
    mv "$EXPORT_DIR/${table_name}_final.csv" "$EXPORT_DIR/${table_name}.csv"
    
    echo "✓ $table_name exportada"
}

# Exportar tablas principales (excluyendo vistas)
export_table "maquinaria"
export_table "personal"
export_table "herramientas"
export_table "insumos"
export_table "planes_mantenimiento"
export_table "actividades_mantenimiento"
export_table "mantenimientos"
export_table "users"
export_table "checklists"
export_table "actividad_herramientas"
export_table "actividad_insumos"
export_table "mantenimiento_actividades"
export_table "mantenimiento_insumos"
export_table "mantenimiento_personal"
export_table "password_reset_tokens"

echo "Exportación completada. Archivos en: $EXPORT_DIR"

