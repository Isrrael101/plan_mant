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
    
    print("\n" + "="*80 + "\n")
    
    # Leer y mostrar información de cada hoja
    for sheet_name in sheet_names:
        print(f"HOJA: {sheet_name}")
        print("-" * 80)
        
        # Leer la hoja
        df = pd.read_excel(excel_file, sheet_name=sheet_name, engine='openpyxl')
        
        # Mostrar información básica
        print(f"Dimensiones: {df.shape[0]} filas x {df.shape[1]} columnas")
        print(f"\nColumnas:")
        for col in df.columns:
            print(f"  - {col}")
        
        # Mostrar las primeras filas
        print(f"\nPrimeras 5 filas:")
        print(df.head())
        
        # Mostrar información estadística si hay columnas numéricas
        numeric_cols = df.select_dtypes(include=['number']).columns
        if len(numeric_cols) > 0:
            print(f"\nEstadísticas de columnas numéricas:")
            print(df[numeric_cols].describe())
        
        print("\n" + "="*80 + "\n")
    
    # Guardar la primera hoja en una variable para trabajar con ella
    if len(sheet_names) > 0:
        main_df = pd.read_excel(excel_file, sheet_name=sheet_names[0], engine='openpyxl')
        print(f"\nDatos de la primera hoja '{sheet_names[0]}' cargados en 'main_df'")
        print(f"Puedes acceder a los datos usando: main_df")
        
except Exception as e:
    print(f"Error al leer el archivo: {e}")
