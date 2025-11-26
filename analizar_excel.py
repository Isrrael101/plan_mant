import pandas as pd
import os

# Ruta del archivo Excel
excel_file = 'Plan_Mant.xlsm'

# Verificar que el archivo existe
if not os.path.exists(excel_file):
    print(f"Error: El archivo {excel_file} no existe")
    exit(1)

print(f"Leyendo archivo: {excel_file}\n")

# Leer el archivo Excel y obtener todas las hojas
try:
    # Obtener los nombres de todas las hojas
    excel_data = pd.ExcelFile(excel_file, engine='openpyxl')
    sheet_names = excel_data.sheet_names
    
    print(f"Hojas encontradas en el archivo: {len(sheet_names)}")
    for i, sheet in enumerate(sheet_names, 1):
        print(f"  {i}. {sheet}")
    
    print("\n" + "="*100 + "\n")
    
    # Crear un archivo de salida con el análisis
    with open('analisis_excel.txt', 'w', encoding='utf-8') as f:
        f.write(f"ANÁLISIS DEL ARCHIVO: {excel_file}\n")
        f.write(f"{'='*100}\n\n")
        f.write(f"Hojas encontradas: {len(sheet_names)}\n")
        for i, sheet in enumerate(sheet_names, 1):
            f.write(f"  {i}. {sheet}\n")
        f.write(f"\n{'='*100}\n\n")
        
        # Analizar cada hoja
        for sheet_name in sheet_names:
            print(f"Analizando hoja: {sheet_name}")
            f.write(f"HOJA: {sheet_name}\n")
            f.write(f"{'-'*100}\n\n")
            
            # Leer la hoja
            df = pd.read_excel(excel_file, sheet_name=sheet_name, engine='openpyxl')
            
            # Información básica
            f.write(f"Dimensiones: {df.shape[0]} filas x {df.shape[1]} columnas\n\n")
            
            f.write(f"Columnas:\n")
            for i, col in enumerate(df.columns, 1):
                f.write(f"  {i}. {col}\n")
            
            f.write(f"\nPrimeras 10 filas:\n")
            f.write(df.head(10).to_string())
            f.write(f"\n\n")
            
            # Información de tipos de datos
            f.write(f"Tipos de datos:\n")
            f.write(df.dtypes.to_string())
            f.write(f"\n\n")
            
            # Valores nulos
            f.write(f"Valores nulos por columna:\n")
            f.write(df.isnull().sum().to_string())
            f.write(f"\n\n")
            
            # Estadísticas si hay columnas numéricas
            numeric_cols = df.select_dtypes(include=['number']).columns
            if len(numeric_cols) > 0:
                f.write(f"Estadísticas de columnas numéricas:\n")
                f.write(df[numeric_cols].describe().to_string())
                f.write(f"\n\n")
            
            f.write(f"\n{'='*100}\n\n")
    
    print(f"\n✓ Análisis completado y guardado en 'analisis_excel.txt'")
    print(f"\nResumen rápido:")
    print(f"  - Total de hojas: {len(sheet_names)}")
    
    # Mostrar resumen de la primera hoja
    if len(sheet_names) > 0:
        df_first = pd.read_excel(excel_file, sheet_name=sheet_names[0], engine='openpyxl')
        print(f"  - Primera hoja '{sheet_names[0]}':")
        print(f"    • {df_first.shape[0]} filas x {df_first.shape[1]} columnas")
        print(f"    • Columnas: {', '.join(df_first.columns[:5].tolist())}" + 
              (f" ... (+{len(df_first.columns)-5} más)" if len(df_first.columns) > 5 else ""))
        
except Exception as e:
    print(f"Error al leer el archivo: {e}")
    import traceback
    traceback.print_exc()
