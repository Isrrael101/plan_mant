# Exportación e Importación de Datos CSV

## 📋 Archivos CSV Exportados

Todos los datos de la base de datos han sido exportados a archivos CSV en formato UTF-8 con BOM, listos para importar en otra instalación.

### Ubicación
```
database/csv_exports/
```

### Archivos Exportados

1. **maquinaria.csv** - 50 registros (8.96 KB)
2. **personal.csv** - 55 registros (10.08 KB)
3. **herramientas.csv** - 60 registros (9.65 KB)
4. **insumos.csv** - 80 registros (12.79 KB)
5. **planes_mantenimiento.csv** - 250 registros (61.42 KB)
6. **actividades_mantenimiento.csv** - 2,200 registros (350.11 KB)
7. **mantenimientos.csv** - 383 registros (112.26 KB)
8. **checklists.csv** - 250 registros (65.14 KB)
9. **users.csv** - 1 registro (0.27 KB)
10. **actividad_herramientas.csv** - 1,599 registros (78.54 KB)
11. **actividad_insumos.csv** - 1,690 registros (119.48 KB)
12. **mantenimiento_actividades.csv** - 2,465 registros (174.69 KB)
13. **mantenimiento_insumos.csv** - 1,150 registros (39.04 KB)
14. **mantenimiento_personal.csv** - 664 registros (18.5 KB)

**Total: 14 archivos CSV exportados**

## 🔄 Cómo Exportar Nuevamente

Para actualizar los archivos CSV con los datos más recientes:

```bash
node backend/scripts/exportToCSV.js
```

Los archivos se guardarán en `database/csv_exports/`

## 📥 Cómo Importar en Otra Instalación

### Opción 1: Usando MySQL Command Line

1. Copiar los archivos CSV a la nueva instalación
2. Asegurarse de que MySQL tenga habilitado `local_infile`:
   ```sql
   SET GLOBAL local_infile = 1;
   ```
3. Ejecutar el script de importación:
   ```bash
   mysql -u usuario -p --local-infile base_de_datos < database/import_from_csv.sql
   ```

### Opción 2: Usando Script Node.js (Recomendado)

Crear un script similar a `exportToCSV.js` pero para importar:

```javascript
// Leer CSV y hacer INSERT
const csv = require('csv-parser');
const fs = require('fs');
// ... código de importación
```

### Opción 3: Usando Herramientas GUI

- **MySQL Workbench**: Data Import/Restore → Import from Self-Contained File
- **phpMyAdmin**: Importar → Seleccionar archivo CSV
- **DBeaver**: Import Data → CSV

## ⚙️ Configuración Requerida

### MySQL
- Character set: `utf8mb4`
- Collation: `utf8mb4_unicode_ci`
- `local_infile` habilitado

### Formato de Archivos
- Encoding: UTF-8 con BOM
- Delimitador: Coma (`,`)
- Campos entrecomillados: Sí (`"`)
- Headers: Primera línea contiene nombres de columnas

## ✅ Verificación

Después de importar, verificar los datos:

```sql
SELECT COUNT(*) FROM maquinaria;  -- Debe ser 50
SELECT COUNT(*) FROM personal;    -- Debe ser 55
SELECT COUNT(*) FROM herramientas; -- Debe ser 60
SELECT COUNT(*) FROM insumos;     -- Debe ser 80
```

## 📝 Notas

- Los archivos CSV incluyen BOM UTF-8 para compatibilidad con Excel
- Todos los caracteres especiales y acentos están correctamente codificados
- La tabla `password_reset_tokens` no se exporta (está vacía por defecto)
- Los IDs se mantienen para preservar relaciones entre tablas

