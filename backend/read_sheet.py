import sys
import json
import pandas as pd

def read_sheet(file_path, sheet_name):
    """Read a specific sheet from Excel and return as JSON"""
    try:
        df = pd.read_excel(file_path, sheet_name=sheet_name, engine='openpyxl')
        
        # Convert DataFrame to dict, handling NaN values
        result = df.to_dict('records')
        
        # Clean up NaN values
        cleaned_result = []
        for row in result:
            cleaned_row = {}
            for key, value in row.items():
                if pd.isna(value):
                    cleaned_row[key] = None
                else:
                    cleaned_row[key] = value
            cleaned_result.append(cleaned_row)
        
        return {
            'success': True,
            'sheet_name': sheet_name,
            'rows': len(cleaned_result),
            'columns': list(df.columns),
            'data': cleaned_result
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
