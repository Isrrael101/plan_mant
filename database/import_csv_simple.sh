#!/bin/bash

# Script simple para importar CSV usando MySQL desde Docker

CONTAINER="mtto-mysql"
USER="mtto_user"
PASS="mtto_password"
DB="mtto_db"
DATA_DIR="database/data"

echo "📊 Importando datos CSV a MySQL..."
echo ""

# Función para importar un CSV
import_csv() {
    local file=$1
    local table=$2
    local fields=$3
    
    echo "📁 Importando $table desde $file..."
    
    docker exec -i $CONTAINER mysql -u$USER -p$PASS $DB <<EOF
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/$(basename $file)'
INTO TABLE $table
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
($fields);
SET FOREIGN_KEY_CHECKS = 1;
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ $table importado correctamente"
    else
        echo "❌ Error importando $table"
    fi
    echo ""
}

# Copiar archivos al contenedor
echo "📦 Copiando archivos CSV al contenedor..."
docker cp $DATA_DIR $CONTAINER:/tmp/

# Importar en orden
import_csv "$DATA_DIR/01_maquinaria.csv" "maquinaria" "id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales"
import_csv "$DATA_DIR/02_personal.csv" "personal" "id, codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado"
import_csv "$DATA_DIR/03_herramientas.csv" "herramientas" "id, codigo, nombre, marca, estado, categoria, costo"
import_csv "$DATA_DIR/04_insumos.csv" "insumos" "id, codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria"

# Planes (con campos NULL)
echo "📁 Importando planes_mantenimiento..."
docker exec -i $CONTAINER mysql -u$USER -p$PASS $DB <<EOF
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/05_planes_mantenimiento.csv'
INTO TABLE planes_mantenimiento
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, @h, @i, descripcion, activo)
SET horas_operacion = NULLIF(@h, 'NULL'),
    intervalo_dias = NULLIF(@i, 'NULL');
SET FOREIGN_KEY_CHECKS = 1;
EOF

import_csv "$DATA_DIR/06_actividades_mantenimiento.csv" "actividades_mantenimiento" "id, plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado"

# Actividad insumos (con NULL)
echo "📁 Importando actividad_insumos..."
docker exec -i $CONTAINER mysql -u$USER -p$PASS $DB <<EOF
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/07_actividad_insumos.csv'
INTO TABLE actividad_insumos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, actividad_id, @insumo_id, cantidad, unidad, especificaciones, costo_unitario)
SET insumo_id = NULLIF(@insumo_id, 'NULL');
SET FOREIGN_KEY_CHECKS = 1;
EOF

# Actividad herramientas (con NULL)
echo "📁 Importando actividad_herramientas..."
docker exec -i $CONTAINER mysql -u$USER -p$PASS $DB <<EOF
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/08_actividad_herramientas.csv'
INTO TABLE actividad_herramientas
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, actividad_id, @herramienta_id, cantidad, especificaciones)
SET herramienta_id = NULLIF(@herramienta_id, 'NULL');
SET FOREIGN_KEY_CHECKS = 1;
EOF

# Mantenimientos (con NULL)
echo "📁 Importando mantenimientos..."
docker exec -i $CONTAINER mysql -u$USER -p$PASS $DB <<EOF
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/09_mantenimientos.csv'
INTO TABLE mantenimientos
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, maquinaria_id, @plan_id, tipo_mantenimiento, @fp, @fe, horas_maquina, estado, observaciones, costo_mano_obra, costo_insumos)
SET plan_id = NULLIF(@plan_id, 'NULL'),
    fecha_programada = NULLIF(@fp, 'NULL'),
    fecha_ejecucion = NULLIF(@fe, 'NULL');
SET FOREIGN_KEY_CHECKS = 1;
EOF

import_csv "$DATA_DIR/10_mantenimiento_personal.csv" "mantenimiento_personal" "id, mantenimiento_id, personal_id, horas_trabajadas, tarifa_aplicada"
import_csv "$DATA_DIR/11_mantenimiento_insumos.csv" "mantenimiento_insumos" "id, mantenimiento_id, insumo_id, cantidad_usada, unidad, precio_unitario"

# Mantenimiento actividades (con NULL)
echo "📁 Importando mantenimiento_actividades..."
docker exec -i $CONTAINER mysql -u$USER -p$PASS $DB <<EOF
SET FOREIGN_KEY_CHECKS = 0;
LOAD DATA LOCAL INFILE '/tmp/data/12_mantenimiento_actividades.csv'
INTO TABLE mantenimiento_actividades
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(id, mantenimiento_id, @actividad_id, descripcion, tiempo_real, completada, observaciones)
SET actividad_id = NULLIF(@actividad_id, 'NULL');
SET FOREIGN_KEY_CHECKS = 1;
EOF

echo ""
echo "✅ Importación completada!"
echo ""
echo "📊 Verificando datos..."
docker exec $CONTAINER mysql -u$USER -p$PASS $DB -e "
SELECT 'Maquinaria' as tabla, COUNT(*) as registros FROM maquinaria
UNION ALL SELECT 'Personal', COUNT(*) FROM personal
UNION ALL SELECT 'Herramientas', COUNT(*) FROM herramientas
UNION ALL SELECT 'Insumos', COUNT(*) FROM insumos
UNION ALL SELECT 'Planes', COUNT(*) FROM planes_mantenimiento
UNION ALL SELECT 'Actividades', COUNT(*) FROM actividades_mantenimiento
UNION ALL SELECT 'Mantenimientos', COUNT(*) FROM mantenimientos;
"

