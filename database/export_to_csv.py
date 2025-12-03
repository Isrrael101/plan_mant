#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para exportar todas las tablas de MySQL a CSV con UTF-8
"""
import mysql.connector
import csv
import sys
import os

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'mtto_user',
    'password': 'mtto_password',
    'database': 'mtto_db',
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
    'use_unicode': True
}

# Directorio de exportación
EXPORT_DIR = '/tmp/csv_exports'
os.makedirs(EXPORT_DIR, exist_ok=True)

def export_table_to_csv(cursor, table_name):
    """Exporta una tabla a CSV con UTF-8"""
    try:
        # Obtener datos de la tabla
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        # Obtener nombres de columnas
        cursor.execute(f"SHOW COLUMNS FROM {table_name}")
        columns = [column[0] for column in cursor.fetchall()]
        
        if not rows:
            print(f"⚠ Tabla {table_name} está vacía")
            return
        
        # Escribir CSV
        csv_file = os.path.join(EXPORT_DIR, f"{table_name}.csv")
        with open(csv_file, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f, quoting=csv.QUOTE_ALL)
            # Escribir headers
            writer.writerow(columns)
            # Escribir datos
            writer.writerows(rows)
        
        print(f"✓ {table_name}: {len(rows)} registros exportados")
        return True
    except Exception as e:
        print(f"✗ Error exportando {table_name}: {e}")
        return False

def main():
    """Función principal"""
    try:
        # Conectar a MySQL
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Obtener lista de tablas (excluyendo vistas)
        cursor.execute("""
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'mtto_db' 
            AND TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        """)
        tables = [row[0] for row in cursor.fetchall()]
        
        print(f"Exportando {len(tables)} tablas a CSV...")
        print(f"Directorio: {EXPORT_DIR}\n")
        
        # Exportar cada tabla
        exported = 0
        for table in tables:
            if export_table_to_csv(cursor, table):
                exported += 1
        
        cursor.close()
        conn.close()
        
        print(f"\n✓ Exportación completada: {exported}/{len(tables)} tablas")
        print(f"Archivos guardados en: {EXPORT_DIR}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()

