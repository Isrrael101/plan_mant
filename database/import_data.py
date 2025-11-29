#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para importar datos CSV a MySQL
"""
import csv
import mysql.connector
import os
import sys

# Configuración de MySQL
DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'port': int(os.getenv('MYSQL_PORT', '3306')),
    'user': os.getenv('MYSQL_USER', 'mtto_user'),
    'password': os.getenv('MYSQL_PASSWORD', 'mtto_password'),
    'database': os.getenv('MYSQL_DATABASE', 'mtto_db'),
    'charset': 'utf8mb4',
    'autocommit': False
}

def connect_db():
    """Conectar a la base de datos"""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as e:
        print(f"❌ Error conectando a MySQL: {e}")
        sys.exit(1)

def import_csv(conn, csv_file, table_name, columns, null_columns=None):
    """Importar un archivo CSV a una tabla"""
    null_columns = null_columns or []
    
    try:
        cursor = conn.cursor()
        
        # Leer CSV
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
        
        if not rows:
            print(f"⚠️  {table_name}: Archivo vacío")
            return
        
        # Preparar INSERT
        placeholders = ', '.join(['%s'] * len(columns))
        columns_str = ', '.join(columns)
        query = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"
        
        # Insertar datos
        inserted = 0
        for row in rows:
            values = []
            for col in columns:
                val = row.get(col, '')
                # Manejar valores NULL
                if col in null_columns and (val == 'NULL' or val == ''):
                    values.append(None)
                elif val == '':
                    values.append(None)
                else:
                    values.append(val)
            
            try:
                cursor.execute(query, values)
                inserted += 1
            except mysql.connector.Error as e:
                print(f"⚠️  Error insertando fila en {table_name}: {e}")
                print(f"   Valores: {values}")
        
        conn.commit()
        print(f"✅ {table_name}: {inserted} registros insertados")
        cursor.close()
        
    except Exception as e:
        print(f"❌ Error importando {table_name}: {e}")
        conn.rollback()

def main():
    print("📊 Importando datos CSV a MySQL...")
    print("")
    
    conn = connect_db()
    cursor = conn.cursor()
    
    # Deshabilitar verificaciones de claves foráneas
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
    
    data_dir = "database/data"
    
    # 1. Maquinaria
    import_csv(conn, f"{data_dir}/01_maquinaria.csv", "maquinaria", 
               ['id', 'codigo', 'nombre', 'marca', 'modelo', 'anio', 'estado', 'costo_adquisicion', 'horas_totales'])
    
    # 2. Personal
    import_csv(conn, f"{data_dir}/02_personal.csv", "personal",
               ['id', 'codigo', 'nombre_completo', 'ci', 'cargo', 'telefono', 'celular', 'tarifa_hora', 'estado'])
    
    # 3. Herramientas
    import_csv(conn, f"{data_dir}/03_herramientas.csv", "herramientas",
               ['id', 'codigo', 'nombre', 'marca', 'estado', 'categoria', 'costo'])
    
    # 4. Insumos
    import_csv(conn, f"{data_dir}/04_insumos.csv", "insumos",
               ['id', 'codigo', 'nombre', 'unidad', 'precio_unitario', 'cantidad', 'stock_minimo', 'categoria'])
    
    # 5. Planes de Mantenimiento (con NULLs)
    import_csv(conn, f"{data_dir}/05_planes_mantenimiento.csv", "planes_mantenimiento",
               ['id', 'maquinaria_id', 'nombre_plan', 'tipo_mantenimiento', 'tipo_plan', 'horas_operacion', 'intervalo_dias', 'descripcion', 'activo'],
               null_columns=['horas_operacion', 'intervalo_dias'])
    
    # 6. Actividades
    import_csv(conn, f"{data_dir}/06_actividades_mantenimiento.csv", "actividades_mantenimiento",
               ['id', 'plan_id', 'numero_orden', 'descripcion_componente', 'actividad', 'tiempo_min', 'tiempo_promedio', 'tiempo_max', 'costo_estimado'])
    
    # 7. Actividad Insumos (con NULLs)
    import_csv(conn, f"{data_dir}/07_actividad_insumos.csv", "actividad_insumos",
               ['id', 'actividad_id', 'insumo_id', 'cantidad', 'unidad', 'especificaciones', 'costo_unitario'],
               null_columns=['insumo_id'])
    
    # 8. Actividad Herramientas (con NULLs)
    import_csv(conn, f"{data_dir}/08_actividad_herramientas.csv", "actividad_herramientas",
               ['id', 'actividad_id', 'herramienta_id', 'cantidad', 'especificaciones'],
               null_columns=['herramienta_id'])
    
    # 9. Mantenimientos (con NULLs)
    import_csv(conn, f"{data_dir}/09_mantenimientos.csv", "mantenimientos",
               ['id', 'maquinaria_id', 'plan_id', 'tipo_mantenimiento', 'fecha_programada', 'fecha_ejecucion', 'horas_maquina', 'estado', 'observaciones', 'costo_mano_obra', 'costo_insumos'],
               null_columns=['plan_id', 'fecha_programada', 'fecha_ejecucion', 'observaciones'])
    
    # 10. Mantenimiento Personal
    import_csv(conn, f"{data_dir}/10_mantenimiento_personal.csv", "mantenimiento_personal",
               ['id', 'mantenimiento_id', 'personal_id', 'horas_trabajadas', 'tarifa_aplicada'])
    
    # 11. Mantenimiento Insumos
    import_csv(conn, f"{data_dir}/11_mantenimiento_insumos.csv", "mantenimiento_insumos",
               ['id', 'mantenimiento_id', 'insumo_id', 'cantidad_usada', 'unidad', 'precio_unitario'])
    
    # 12. Mantenimiento Actividades (con NULLs)
    import_csv(conn, f"{data_dir}/12_mantenimiento_actividades.csv", "mantenimiento_actividades",
               ['id', 'mantenimiento_id', 'actividad_id', 'descripcion', 'tiempo_real', 'completada', 'observaciones'],
               null_columns=['actividad_id', 'observaciones'])
    
    # Habilitar verificaciones de claves foráneas
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
    
    # Verificar datos
    print("")
    print("📊 Verificando datos cargados...")
    cursor.execute("""
        SELECT 'Maquinaria' as tabla, COUNT(*) as registros FROM maquinaria
        UNION ALL SELECT 'Personal', COUNT(*) FROM personal
        UNION ALL SELECT 'Herramientas', COUNT(*) FROM herramientas
        UNION ALL SELECT 'Insumos', COUNT(*) FROM insumos
        UNION ALL SELECT 'Planes', COUNT(*) FROM planes_mantenimiento
        UNION ALL SELECT 'Actividades', COUNT(*) FROM actividades_mantenimiento
        UNION ALL SELECT 'Mantenimientos', COUNT(*) FROM mantenimientos
    """)
    
    results = cursor.fetchall()
    for row in results:
        print(f"   {row[0]}: {row[1]} registros")
    
    cursor.close()
    conn.close()
    
    print("")
    print("✅ Importación completada!")

if __name__ == "__main__":
    main()

