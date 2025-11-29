# -*- coding: utf-8 -*-
import sys
import json
import pandas as pd

# Configurar codificación UTF-8 para stdout
if sys.stdout.encoding != 'utf-8':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def read_sheet(file_path, sheet_name):
    """Read a specific sheet from Excel and return as JSON"""
    try:
        # Leer sin encabezados primero para encontrar la fila de encabezados
        df_raw = pd.read_excel(file_path, sheet_name=sheet_name, engine='openpyxl', header=None)
        
        # Buscar la fila que contiene los encabezados reales
        # Buscar filas que contengan palabras clave de encabezados
        header_row = None
        for idx in range(min(15, len(df_raw))):  # Buscar en las primeras 15 filas
            row_values = df_raw.iloc[idx].astype(str).str.upper().tolist()
            # Buscar palabras clave que indican encabezados
            keywords = ['ACTIVIDAD', 'DESCRIPCION', 'TIEMPO', 'INSUMOS', 'HERRAMIENTAS', 
                       'CANTIDAD', 'UNIDAD', 'ESPECIFICACIONES', 'Nº', 'NO', 'NUMERO']
            if any(any(kw in str(val) for kw in keywords) for val in row_values if pd.notna(val)):
                header_row = idx
                break
        
        # Si no se encuentra, usar la fila 9 (índice 8) que suele tener los encabezados
        if header_row is None:
            header_row = 8
        
        # Leer con los encabezados correctos
        df = pd.read_excel(file_path, sheet_name=sheet_name, engine='openpyxl', header=header_row)
        
        # Limpiar nombres de columnas
        df.columns = df.columns.astype(str)
        df.columns = [col.strip() if pd.notna(col) and col != 'nan' else f'Columna_{i}' 
                      for i, col in enumerate(df.columns)]
        
        # Filtrar filas vacías
        df = df.dropna(how='all')
        
        # Convert DataFrame to dict, handling NaN values
        result = df.to_dict('records')
        
        # Clean up NaN values y renombrar columnas
        cleaned_result = []
        column_mapping = {}
        
        for idx, col in enumerate(df.columns):
            if 'unnamed' in col.lower() or col.startswith('Columna_'):
                # Intentar encontrar un nombre mejor basado en el contenido
                col_name = col
            else:
                col_name = col
            column_mapping[col] = col_name
        
        for row in result:
            cleaned_row = {}
            for key, value in row.items():
                new_key = column_mapping.get(key, key)
                # Limpiar nombres de columnas
                if 'unnamed' in str(new_key).lower():
                    # Usar el índice de la columna
                    col_idx = list(df.columns).index(key)
                    new_key = f'Columna_{col_idx + 1}'
                
                if pd.isna(value) or value == '' or str(value).strip() == '':
                    cleaned_row[new_key] = None
                else:
                    cleaned_row[new_key] = value
            cleaned_result.append(cleaned_row)
        
        # Obtener encabezados limpios
        clean_columns = [column_mapping.get(col, col) for col in df.columns]
        clean_columns = [col if not ('unnamed' in str(col).lower() or col.startswith('Columna_')) 
                        else f'Columna_{i+1}' for i, col in enumerate(clean_columns)]
        
        return {
            'success': True,
            'sheet_name': sheet_name,
            'rows': len(cleaned_result),
            'columns': clean_columns,
            'data': cleaned_result,
            'header_row': header_row
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def get_all_sheets(file_path):
    """Get list of all sheets in Excel file"""
    try:
        excel_file = pd.ExcelFile(file_path, engine='openpyxl')
        return {
            'success': True,
            'sheets': excel_file.sheet_names,
            'count': len(excel_file.sheet_names)
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({'success': False, 'error': 'Missing arguments'}))
        sys.exit(1)
    
    command = sys.argv[1]
    file_path = sys.argv[2]
    
    if command == 'list':
        result = get_all_sheets(file_path)
    elif command == 'read':
        if len(sys.argv) < 4:
            result = {'success': False, 'error': 'Missing sheet name'}
        else:
            sheet_name = sys.argv[3]
            result = read_sheet(file_path, sheet_name)
    else:
        result = {'success': False, 'error': 'Unknown command'}
    
    print(json.dumps(result, ensure_ascii=False))
