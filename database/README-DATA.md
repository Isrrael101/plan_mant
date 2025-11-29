# 📊 Datos de Ejemplo para MTTO Pro

Este directorio contiene archivos CSV con datos profesionales de ejemplo para cargar en la base de datos MySQL.

## 📁 Archivos CSV Incluidos

1. **01_maquinaria.csv** - 15 equipos de maquinaria pesada
2. **02_personal.csv** - 15 empleados con tarifas por hora
3. **03_herramientas.csv** - 15 herramientas y equipos de taller
4. **04_insumos.csv** - 20 insumos y repuestos
5. **05_planes_mantenimiento.csv** - 12 planes de mantenimiento
6. **06_actividades_mantenimiento.csv** - 30 actividades de mantenimiento
7. **07_actividad_insumos.csv** - Relación insumos por actividad
8. **08_actividad_herramientas.csv** - Relación herramientas por actividad
9. **09_mantenimientos.csv** - 10 mantenimientos (completados y programados)
10. **10_mantenimiento_personal.csv** - Personal asignado a mantenimientos
11. **11_mantenimiento_insumos.csv** - Insumos utilizados en mantenimientos
12. **12_mantenimiento_actividades.csv** - Actividades ejecutadas

## 🚀 Métodos de Carga

### Método 1: Usando Adminer (Recomendado)

1. Abre http://localhost:8081
2. Conecta a MySQL:
   - Servidor: `mysql`
   - Usuario: `mtto_user`
   - Contraseña: `mtto_password`
   - Base de datos: `mtto_db`
3. Selecciona la tabla
4. Click en "Importar"
5. Selecciona el archivo CSV correspondiente
6. Configura:
   - Separador: `,`
   - Campos entrecomillados: `"`
   - Ignorar primera línea: ✅
7. Click en "Ejecutar"

### Método 2: Usando MySQL Workbench o cliente MySQL

```sql
USE mtto_db;

LOAD DATA LOCAL INFILE 'database/data/01_maquinaria.csv'
INTO TABLE maquinaria
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

### Método 3: Desde Docker (Línea de comandos)

```bash
# Copiar archivo al contenedor
docker cp database/data/01_maquinaria.csv mtto-mysql:/tmp/

# Cargar datos
docker exec mtto-mysql mysql -umtto_user -pmtto_password mtto_db -e "
LOAD DATA LOCAL INFILE '/tmp/01_maquinaria.csv'
INTO TABLE maquinaria
FIELDS TERMINATED BY ','
ENCLOSED BY '\"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
"
```

### Método 4: Script SQL Completo

Ejecuta el archivo `load_data.sql`:

```bash
# Desde fuera de Docker
docker exec -i mtto-mysql mysql -umtto_user -pmtto_password mtto_db < database/load_data.sql

# O desde dentro del contenedor
docker exec -it mtto-mysql mysql -umtto_user -pmtto_password mtto_db
source /tmp/load_data.sql
```

## 📋 Orden de Carga Recomendado

Carga los archivos en este orden para respetar las relaciones:

1. ✅ `01_maquinaria.csv`
2. ✅ `02_personal.csv`
3. ✅ `03_herramientas.csv`
4. ✅ `04_insumos.csv`
5. ✅ `05_planes_mantenimiento.csv` (requiere maquinaria)
6. ✅ `06_actividades_mantenimiento.csv` (requiere planes)
7. ✅ `07_actividad_insumos.csv` (requiere actividades e insumos)
8. ✅ `08_actividad_herramientas.csv` (requiere actividades y herramientas)
9. ✅ `09_mantenimientos.csv` (requiere maquinaria y planes)
10. ✅ `10_mantenimiento_personal.csv` (requiere mantenimientos y personal)
11. ✅ `11_mantenimiento_insumos.csv` (requiere mantenimientos e insumos)
12. ✅ `12_mantenimiento_actividades.csv` (requiere mantenimientos y actividades)

## 🔍 Verificar Datos Cargados

```sql
-- Verificar conteo de registros
SELECT 'Maquinaria' as tabla, COUNT(*) as registros FROM maquinaria
UNION ALL
SELECT 'Personal', COUNT(*) FROM personal
UNION ALL
SELECT 'Herramientas', COUNT(*) FROM herramientas
UNION ALL
SELECT 'Insumos', COUNT(*) FROM insumos
UNION ALL
SELECT 'Planes', COUNT(*) FROM planes_mantenimiento
UNION ALL
SELECT 'Actividades', COUNT(*) FROM actividades_mantenimiento
UNION ALL
SELECT 'Mantenimientos', COUNT(*) FROM mantenimientos;
```

## 📊 Datos Incluidos

### Maquinaria (15 equipos)
- Bulldozers, Excavadoras, Cargadores
- Volquetes, Motoniveladoras, Retroexcavadoras
- Compactadores, Perforadoras, Grúas, Montacargas

### Personal (15 empleados)
- Técnicos especializados
- Supervisores
- Operadores
- Con tarifas por hora realistas

### Herramientas (15 herramientas)
- Herramientas manuales
- Instrumentos de medición
- Equipos de taller
- Equipos de diagnóstico

### Insumos (20 insumos)
- Lubricantes (aceites, grasas)
- Filtros (aire, aceite, hidráulico)
- Componentes (baterías, correas, pastillas)
- Materiales de mantenimiento

### Planes y Mantenimientos
- Planes preventivos por horas
- Mantenimientos correctivos
- Mantenimientos proactivos
- Con costos calculados

## ⚠️ Notas Importantes

- Los archivos CSV usan comas (`,`) como separador
- Los campos de texto están entrecomillados (`"`)
- Los valores NULL están como `NULL` o vacíos
- Las fechas están en formato `YYYY-MM-DD`
- Los costos están en Bolivianos (Bs.)

## 🔄 Actualizar Datos

Si necesitas actualizar o agregar más datos:

1. Edita el archivo CSV correspondiente
2. Elimina los registros existentes (si es necesario)
3. Vuelve a cargar el archivo usando cualquiera de los métodos anteriores

## 📝 Formato de Archivos CSV

Todos los archivos CSV siguen este formato:
- Primera línea: Encabezados de columnas
- Separador: Coma (`,`)
- Campos de texto: Entrecomillados (`"`)
- Valores NULL: `NULL` o vacío
- Codificación: UTF-8

