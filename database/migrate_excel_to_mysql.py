# -*- coding: utf-8 -*-
"""
Script de migración de datos de Excel a MySQL
MTTO Pro - Sistema de Gestión de Mantenimiento
"""

import os
import sys
import pandas as pd
import mysql.connector
from mysql.connector import Error
from datetime import datetime

# Configuración de la base de datos
DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'port': int(os.getenv('MYSQL_PORT', 3306)),
    'user': os.getenv('MYSQL_USER', 'mtto_user'),
    'password': os.getenv('MYSQL_PASSWORD', 'mtto_password'),
    'database': os.getenv('MYSQL_DATABASE', 'mtto_db'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci'
}

# Archivo Excel fuente
EXCEL_FILE = os.getenv('EXCEL_FILE', 'Plan_Mant.xlsm')


def get_connection():
    """Crear conexión a MySQL"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print(f"✓ Conectado a MySQL: {DB_CONFIG['database']}")
            return connection
    except Error as e:
        print(f"✗ Error al conectar a MySQL: {e}")
        sys.exit(1)


def clean_value(value):
    """Limpiar valores nulos o vacíos"""
    if pd.isna(value) or value == '' or str(value).strip() == '':
        return None
    return str(value).strip()


def migrate_maquinaria(connection, excel_file):
    """Migrar datos de maquinaria"""
    print("\n📦 Migrando Maquinaria...")
    try:
        df = pd.read_excel(excel_file, sheet_name='Maquinaria', engine='openpyxl')
        cursor = connection.cursor()
        
        count = 0
        for _, row in df.iterrows():
            codigo = clean_value(row.get('Unnamed: 3'))
            nombre = clean_value(row.get('Unnamed: 4'))
            
            if not codigo or not nombre:
                continue
            
            # Ignorar headers
            if 'CODIGO' in str(codigo).upper() or 'NOMBRE' in str(nombre).upper():
                continue
            
            marca = clean_value(row.get('Unnamed: 5'))
            modelo = clean_value(row.get('Unnamed: 6'))
            anio = clean_value(row.get('Unnamed: 7'))
            estado = clean_value(row.get('Unnamed: 8')) or 'OPERATIVO'
            
            # Normalizar estado
            estado = estado.upper()
            if estado not in ['OPERATIVO', 'MANTENIMIENTO', 'INACTIVO']:
                estado = 'OPERATIVO'
            
            sql = """
                INSERT INTO maquinaria (codigo, nombre, marca, modelo, anio, estado)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    nombre = VALUES(nombre),
                    marca = VALUES(marca),
                    modelo = VALUES(modelo),
                    anio = VALUES(anio),
                    estado = VALUES(estado)
            """
            cursor.execute(sql, (codigo, nombre, marca, modelo, anio, estado))
            count += 1
        
        connection.commit()
        print(f"  ✓ {count} registros migrados")
        return count
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0


def migrate_personal(connection, excel_file):
    """Migrar datos de personal"""
    print("\n👥 Migrando Personal...")
    try:
        df = pd.read_excel(excel_file, sheet_name='Personal', engine='openpyxl')
        cursor = connection.cursor()
        
        count = 0
        for _, row in df.iterrows():
            nombre = clean_value(row.get('Unnamed: 3'))
            
            if not nombre:
                continue
            
            # Ignorar headers
            if 'APELLIDOS' in str(nombre).upper() or 'NOMBRE' in str(nombre).upper():
                continue
            
            codigo = clean_value(row.get('Unnamed: 2')) or f"EMP-{count+1:03d}"
            ci = clean_value(row.get('Unnamed: 4'))
            cargo = clean_value(row.get('Unnamed: 5'))
            telefono = clean_value(row.get('Unnamed: 6'))
            celular = clean_value(row.get('Unnamed: 7'))
            
            sql = """
                INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    nombre_completo = VALUES(nombre_completo),
                    ci = VALUES(ci),
                    cargo = VALUES(cargo),
                    telefono = VALUES(telefono),
                    celular = VALUES(celular)
            """
            cursor.execute(sql, (codigo, nombre, ci, cargo, telefono, celular))
            count += 1
        
        connection.commit()
        print(f"  ✓ {count} registros migrados")
        return count
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0


def migrate_herramientas(connection, excel_file):
    """Migrar datos de herramientas"""
    print("\n🔧 Migrando Herramientas...")
    try:
        df = pd.read_excel(excel_file, sheet_name='Herramientas', engine='openpyxl')
        cursor = connection.cursor()
        
        count = 0
        for _, row in df.iterrows():
            nombre = clean_value(row.get('Unnamed: 3'))
            
            if not nombre:
                continue
            
            # Ignorar headers
            if 'HERRAMIENTA' in str(nombre).upper():
                continue
            
            codigo = clean_value(row.get('Unnamed: 2')) or f"HER-{count+1:03d}"
            marca = clean_value(row.get('Unnamed: 4'))
            estado = clean_value(row.get('Unnamed: 5')) or 'OPERATIVO'
            
            # Normalizar estado
            estado = estado.upper()
            if estado not in ['OPERATIVO', 'MANTENIMIENTO', 'INACTIVO']:
                estado = 'OPERATIVO'
            
            # Categorizar automáticamente
            categoria = categorize_tool(nombre)
            
            sql = """
                INSERT INTO herramientas (codigo, nombre, marca, estado, categoria)
                VALUES (%s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    nombre = VALUES(nombre),
                    marca = VALUES(marca),
                    estado = VALUES(estado),
                    categoria = VALUES(categoria)
            """
            cursor.execute(sql, (codigo, nombre, marca, estado, categoria))
            count += 1
        
        connection.commit()
        print(f"  ✓ {count} registros migrados")
        return count
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0


def categorize_tool(nombre):
    """Categorizar herramienta por nombre"""
    nombre_upper = str(nombre).upper()
    
    categories = {
        'Herramientas Manuales': ['LLAVE', 'DESTORNILLADOR', 'MARTILLO', 'ALICATE', 'PINZA'],
        'Herramientas Eléctricas': ['TALADRO', 'SIERRA', 'PULIDORA', 'ESMERIL', 'ELECTRICA'],
        'Equipos de Medición': ['MEDIDOR', 'NIVEL', 'CALIBRADOR', 'TERMOMETRO'],
        'Herramientas Pesadas': ['COMPRESOR', 'SOLDADOR', 'GENERADOR']
    }
    
    for category, keywords in categories.items():
        if any(kw in nombre_upper for kw in keywords):
            return category
    
    return 'Otras Herramientas'


def migrate_insumos(connection, excel_file):
    """Migrar datos de insumos"""
    print("\n📦 Migrando Insumos...")
    try:
        df = pd.read_excel(excel_file, sheet_name='Insumos', engine='openpyxl')
        cursor = connection.cursor()
        
        count = 0
        for _, row in df.iterrows():
            nombre = clean_value(row.get('Unnamed: 3'))
            
            if not nombre:
                continue
            
            # Ignorar headers
            if 'INSUMO' in str(nombre).upper():
                continue
            
            codigo = clean_value(row.get('Unnamed: 2')) or f"INS-{count+1:03d}"
            unidad = clean_value(row.get('Unnamed: 4'))
            
            # Precio
            precio = row.get('Unnamed: 5')
            try:
                precio = float(precio) if pd.notna(precio) else 0.00
            except:
                precio = 0.00
            
            # Cantidad
            cantidad = row.get('Unnamed: 6')
            try:
                cantidad = int(float(cantidad)) if pd.notna(cantidad) else 0
            except:
                cantidad = 0
            
            # Categorizar
            categoria = categorize_supply(nombre)
            
            sql = """
                INSERT INTO insumos (codigo, nombre, unidad, precio_unitario, cantidad, categoria)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    nombre = VALUES(nombre),
                    unidad = VALUES(unidad),
                    precio_unitario = VALUES(precio_unitario),
                    cantidad = VALUES(cantidad),
                    categoria = VALUES(categoria)
            """
            cursor.execute(sql, (codigo, nombre, unidad, precio, cantidad, categoria))
            count += 1
        
        connection.commit()
        print(f"  ✓ {count} registros migrados")
        return count
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0


def categorize_supply(nombre):
    """Categorizar insumo por nombre"""
    nombre_upper = str(nombre).upper()
    
    categories = {
        'Lubricantes': ['ACEITE', 'LUBRICANTE', 'GRASA'],
        'Filtros': ['FILTRO'],
        'Repuestos': ['REPUESTO', 'PARTE', 'PIEZA'],
        'Combustibles': ['COMBUSTIBLE', 'DIESEL', 'GASOLINA'],
        'Materiales de Consumo': ['BATERIA', 'FUSIBLE', 'BOMBILLA']
    }
    
    for category, keywords in categories.items():
        if any(kw in nombre_upper for kw in keywords):
            return category
    
    return 'Otros Insumos'


def migrate_maintenance_plans(connection, excel_file):
    """Migrar planes de mantenimiento"""
    print("\n📅 Migrando Planes de Mantenimiento...")
    try:
        excel = pd.ExcelFile(excel_file, engine='openpyxl')
        cursor = connection.cursor()
        
        count = 0
        for sheet_name in excel.sheet_names:
            upper_name = sheet_name.upper()
            
            # Solo hojas de mantenimiento
            if not any(kw in upper_name for kw in ['HORAS', 'HRS', 'CRONOGRAMA', 'CHECK']):
                continue
            
            # Determinar tipo de plan
            if 'CRONOGRAMA' in upper_name or 'CRONOGRAM' in upper_name:
                tipo = 'CRONOGRAMA'
            elif 'CHECK' in upper_name:
                tipo = 'CHECKLIST'
            else:
                tipo = 'POR_HORAS'
            
            # Extraer horas si existe en el nombre
            horas = None
            for h in ['250', '500', '1000', '2000', '4000']:
                if h in sheet_name:
                    horas = int(h)
                    break
            
            sql = """
                INSERT INTO planes_mantenimiento (nombre_plan, tipo_plan, horas_operacion, descripcion)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (sheet_name, tipo, horas, f"Plan importado desde Excel: {sheet_name}"))
            count += 1
        
        connection.commit()
        print(f"  ✓ {count} planes migrados")
        return count
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0


def main():
    """Función principal de migración"""
    print("=" * 60)
    print("  MTTO Pro - Migración de Excel a MySQL")
    print("=" * 60)
    print(f"\n📄 Archivo Excel: {EXCEL_FILE}")
    print(f"🗄️  Base de datos: {DB_CONFIG['database']}")
    print(f"🖥️  Servidor: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
    
    # Verificar que el archivo Excel existe
    if not os.path.exists(EXCEL_FILE):
        print(f"\n✗ Error: No se encuentra el archivo {EXCEL_FILE}")
        sys.exit(1)
    
    # Conectar a MySQL
    connection = get_connection()
    
    try:
        # Ejecutar migraciones
        total = 0
        total += migrate_maquinaria(connection, EXCEL_FILE)
        total += migrate_personal(connection, EXCEL_FILE)
        total += migrate_herramientas(connection, EXCEL_FILE)
        total += migrate_insumos(connection, EXCEL_FILE)
        total += migrate_maintenance_plans(connection, EXCEL_FILE)
        
        print("\n" + "=" * 60)
        print(f"  ✓ Migración completada: {total} registros totales")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error durante la migración: {e}")
        connection.rollback()
        sys.exit(1)
    finally:
        if connection.is_connected():
            connection.close()
            print("\n✓ Conexión cerrada")


if __name__ == '__main__':
    main()

