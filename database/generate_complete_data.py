# -*- coding: utf-8 -*-
"""
Generador de datos completos para MTTO Pro
Todos los campos tendrán valores válidos - Sin NaN
"""

import csv
import random
import os
from datetime import datetime, timedelta

# Configuración
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================
# DATOS BASE
# ============================================

MARCAS_MAQUINARIA = ['Caterpillar', 'Komatsu', 'Volvo', 'John Deere', 'Hitachi', 'Liebherr', 'Case', 'JCB', 'Bobcat', 'Doosan']
TIPOS_MAQUINARIA = [
    ('Excavadora Hidráulica', ['320', '330', '336', '349', 'PC200', 'PC300', 'EC220', 'EC300']),
    ('Bulldozer', ['D6T', 'D7R', 'D8T', 'D9T', 'D155', 'D275']),
    ('Cargador Frontal', ['950M', '966M', '980M', 'WA380', 'WA470', 'L150']),
    ('Motoniveladora', ['140M', '160M', '14M', 'GD655', 'G930']),
    ('Volquete', ['730C', '745C', '770G', 'HD785', 'A40G']),
    ('Retroexcavadora', ['420F', '430F', 'WB97', '3CX', '4CX']),
    ('Rodillo Compactador', ['CS56', 'CS66', 'CV533', 'BW211']),
    ('Grúa', ['LTM 1050', 'LTM 1100', 'RT890E', 'GMK4100']),
    ('Perforadora', ['DM45', 'DM30', 'PV271', 'D245S']),
    ('Minicargador', ['262D', '272D', 'S650', 'SR250'])
]

CARGOS_PERSONAL = [
    'Mecánico Senior', 'Mecánico Junior', 'Electricista', 'Soldador', 
    'Técnico Hidráulico', 'Operador de Maquinaria', 'Supervisor de Mantenimiento',
    'Jefe de Taller', 'Lubricador', 'Ayudante Mecánico', 'Técnico en Motores',
    'Inspector de Calidad', 'Planificador de Mantenimiento'
]

NOMBRES = ['Carlos', 'Juan', 'Miguel', 'José', 'Pedro', 'Luis', 'Fernando', 'Roberto', 'Diego', 'Andrés',
           'María', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Sandra', 'Elena', 'Claudia', 'Isabel']
APELLIDOS = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez',
             'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Vargas']

CATEGORIAS_HERRAMIENTAS = ['Manual', 'Eléctrica', 'Neumática', 'Hidráulica', 'Medición', 'Corte', 'Soldadura', 'Elevación']
HERRAMIENTAS = [
    ('Llave de Tubo', 'Manual'), ('Llave Allen', 'Manual'), ('Destornillador Phillips', 'Manual'),
    ('Destornillador Plano', 'Manual'), ('Martillo de Bola', 'Manual'), ('Alicate Universal', 'Manual'),
    ('Llave Stilson', 'Manual'), ('Torquímetro', 'Medición'), ('Calibrador Digital', 'Medición'),
    ('Micrómetro', 'Medición'), ('Nivel de Burbuja', 'Medición'), ('Manómetro', 'Medición'),
    ('Multímetro Digital', 'Medición'), ('Taladro Industrial', 'Eléctrica'), ('Amoladora Angular', 'Eléctrica'),
    ('Soldadora MIG', 'Soldadura'), ('Soldadora TIG', 'Soldadura'), ('Equipo Oxicorte', 'Corte'),
    ('Compresor de Aire 100 PSI', 'Neumática'), ('Pistola de Impacto', 'Neumática'),
    ('Gato Hidráulico 20T', 'Hidráulica'), ('Prensa Hidráulica', 'Hidráulica'), ('Tecle 5T', 'Elevación'),
    ('Eslinga de Cadena', 'Elevación'), ('Engrasadora Manual', 'Manual'), ('Extractor de Rodamientos', 'Manual')
]

CATEGORIAS_INSUMOS = ['Lubricantes', 'Filtros', 'Repuestos', 'Eléctricos', 'Hidráulicos', 'Neumáticos', 'Químicos', 'Consumibles']
INSUMOS = [
    ('Aceite de Motor 15W40', 'Litro', 'Lubricantes', 25.50),
    ('Aceite Hidráulico ISO 46', 'Litro', 'Hidráulicos', 18.00),
    ('Aceite Transmisión', 'Litro', 'Lubricantes', 35.00),
    ('Aceite de Reductor', 'Litro', 'Lubricantes', 28.00),
    ('Grasa de Rodamientos', 'Kg', 'Lubricantes', 15.00),
    ('Grasa EP2', 'Kg', 'Lubricantes', 12.50),
    ('Filtro de Aceite Motor', 'Unidad', 'Filtros', 45.00),
    ('Filtro de Combustible', 'Unidad', 'Filtros', 38.00),
    ('Filtro de Aire Primario', 'Unidad', 'Filtros', 120.00),
    ('Filtro de Aire Secundario', 'Unidad', 'Filtros', 85.00),
    ('Filtro Hidráulico', 'Unidad', 'Filtros', 150.00),
    ('Filtro de Transmisión', 'Unidad', 'Filtros', 95.00),
    ('Refrigerante Anticongelante', 'Litro', 'Químicos', 22.00),
    ('Líquido de Frenos DOT4', 'Litro', 'Químicos', 35.00),
    ('Desengrasante Industrial', 'Litro', 'Químicos', 18.00),
    ('Neumático 23.5R25', 'Unidad', 'Neumáticos', 4500.00),
    ('Neumático 17.5R25', 'Unidad', 'Neumáticos', 3200.00),
    ('Cámara de Llanta', 'Unidad', 'Neumáticos', 180.00),
    ('Batería 12V 150Ah', 'Unidad', 'Eléctricos', 850.00),
    ('Cable de Batería', 'Metro', 'Eléctricos', 25.00),
    ('Fusible 30A', 'Unidad', 'Eléctricos', 5.00),
    ('Foco Halógeno 24V', 'Unidad', 'Eléctricos', 35.00),
    ('Correa de Alternador', 'Unidad', 'Repuestos', 85.00),
    ('Rodamiento 6205', 'Unidad', 'Repuestos', 45.00),
    ('Empaque de Culata', 'Unidad', 'Repuestos', 250.00),
    ('Manguera Hidráulica 1/2"', 'Metro', 'Hidráulicos', 65.00),
    ('Conexión Rápida', 'Unidad', 'Hidráulicos', 35.00),
    ('Cilindro Hidráulico', 'Unidad', 'Hidráulicos', 1200.00),
    ('Bomba Hidráulica', 'Unidad', 'Hidráulicos', 2500.00),
    ('Trapo Industrial', 'Kg', 'Consumibles', 8.00),
    ('Silicona Roja', 'Unidad', 'Consumibles', 25.00),
    ('Cinta Aislante', 'Rollo', 'Consumibles', 12.00)
]

COMPONENTES = [
    'Sistema de Lubricación', 'Motor', 'Sistema Hidráulico', 'Sistema de Transmisión',
    'Sistema de Refrigeración', 'Sistema Eléctrico', 'Sistema de Frenos', 'Neumáticos',
    'Carrocería', 'Cuchara y Brazo', 'Filtros', 'Sistema de Combustible', 'Cabina',
    'Sistema de Dirección', 'Tren de Rodaje', 'Sistema de Escape'
]

ACTIVIDADES_POR_COMPONENTE = {
    'Sistema de Lubricación': ['Cambiar aceite de motor', 'Verificar nivel de aceite', 'Engrasar puntos de lubricación'],
    'Motor': ['Revisar nivel de refrigerante', 'Inspeccionar correas', 'Verificar funcionamiento de motor'],
    'Sistema Hidráulico': ['Cambiar aceite hidráulico', 'Revisar mangueras', 'Verificar cilindros'],
    'Sistema de Transmisión': ['Cambiar aceite de transmisión', 'Ajustar embrague', 'Revisar convertidor'],
    'Sistema de Refrigeración': ['Limpiar radiador', 'Verificar termostato', 'Revisar mangueras'],
    'Sistema Eléctrico': ['Revisar batería', 'Verificar alternador', 'Inspeccionar conexiones'],
    'Sistema de Frenos': ['Revisar pastillas', 'Verificar líquido de frenos', 'Ajustar frenos'],
    'Neumáticos': ['Verificar presión', 'Inspeccionar desgaste', 'Rotar neumáticos'],
    'Carrocería': ['Inspección visual', 'Reparar abolladuras', 'Pintar partes oxidadas'],
    'Cuchara y Brazo': ['Revisar dientes', 'Verificar pasadores', 'Engrasar articulaciones'],
    'Filtros': ['Cambiar filtro de aceite', 'Cambiar filtro de aire', 'Cambiar filtro de combustible'],
    'Sistema de Combustible': ['Drenar tanque', 'Revisar inyectores', 'Verificar bomba de combustible'],
    'Cabina': ['Revisar asiento', 'Verificar controles', 'Limpiar filtros de aire acondicionado'],
    'Sistema de Dirección': ['Revisar bomba de dirección', 'Verificar juego', 'Engrasar articulaciones'],
    'Tren de Rodaje': ['Revisar tensión de cadena', 'Inspeccionar rodillos', 'Verificar sprockets'],
    'Sistema de Escape': ['Revisar tubo de escape', 'Verificar silenciador', 'Inspeccionar DPF']
}

# ============================================
# FUNCIONES GENERADORAS
# ============================================

def generar_codigo(prefijo, numero):
    return f"{prefijo}-{str(numero).zfill(3)}"

def generar_telefono():
    return f"7{random.randint(1000000, 9999999)}"

def generar_ci():
    return f"{random.randint(1000000, 9999999)}"

def fecha_aleatoria(inicio_anios=5):
    dias = random.randint(0, inicio_anios * 365)
    return (datetime.now() - timedelta(days=dias)).strftime('%Y-%m-%d')

# ============================================
# GENERADORES DE CSV
# ============================================

def generar_maquinaria(cantidad=50):
    """Genera datos de maquinaria"""
    data = []
    for i in range(1, cantidad + 1):
        tipo, modelos = random.choice(TIPOS_MAQUINARIA)
        marca = random.choice(MARCAS_MAQUINARIA)
        modelo = random.choice(modelos)
        
        data.append({
            'id': i,
            'codigo': generar_codigo('EQ', i),
            'nombre': f"{tipo} {marca} {modelo}",
            'marca': marca,
            'modelo': modelo,
            'anio': str(random.randint(2010, 2024)),
            'estado': random.choice(['OPERATIVO', 'OPERATIVO', 'OPERATIVO', 'MANTENIMIENTO', 'INACTIVO']),
            'costo_adquisicion': round(random.uniform(50000, 500000), 2),
            'horas_totales': round(random.uniform(500, 15000), 2)
        })
    
    return data

def generar_personal(cantidad=40):
    """Genera datos de personal"""
    data = []
    for i in range(1, cantidad + 1):
        nombre = f"{random.choice(NOMBRES)} {random.choice(APELLIDOS)} {random.choice(APELLIDOS)}"
        cargo = random.choice(CARGOS_PERSONAL)
        
        # Tarifa según cargo
        if 'Senior' in cargo or 'Jefe' in cargo or 'Supervisor' in cargo:
            tarifa = round(random.uniform(80, 150), 2)
        elif 'Junior' in cargo or 'Ayudante' in cargo:
            tarifa = round(random.uniform(35, 60), 2)
        else:
            tarifa = round(random.uniform(50, 100), 2)
        
        data.append({
            'id': i,
            'codigo': generar_codigo('PER', i),
            'nombre_completo': nombre,
            'ci': generar_ci(),
            'cargo': cargo,
            'telefono': generar_telefono(),
            'celular': generar_telefono(),
            'tarifa_hora': tarifa,
            'estado': 'ACTIVO' if random.random() > 0.1 else 'INACTIVO'
        })
    
    return data

def generar_herramientas(cantidad=60):
    """Genera datos de herramientas"""
    data = []
    herramientas_base = HERRAMIENTAS.copy()
    
    for i in range(1, cantidad + 1):
        if i <= len(herramientas_base):
            nombre, categoria = herramientas_base[i-1]
        else:
            nombre, categoria = random.choice(herramientas_base)
            nombre = f"{nombre} Variante {i}"
        
        marca = random.choice(['Stanley', 'DeWalt', 'Bosch', 'Makita', 'Milwaukee', 'Snap-on', 'Proto', 'Bahco'])
        
        data.append({
            'id': i,
            'codigo': generar_codigo('HER', i),
            'nombre': nombre,
            'marca': marca,
            'estado': random.choice(['OPERATIVO', 'OPERATIVO', 'OPERATIVO', 'MANTENIMIENTO', 'INACTIVO']),
            'categoria': categoria,
            'costo': round(random.uniform(50, 2000), 2)
        })
    
    return data

def generar_insumos(cantidad=80):
    """Genera datos de insumos"""
    data = []
    insumos_base = INSUMOS.copy()
    
    for i in range(1, cantidad + 1):
        if i <= len(insumos_base):
            nombre, unidad, categoria, precio_base = insumos_base[i-1]
        else:
            nombre, unidad, categoria, precio_base = random.choice(insumos_base)
            nombre = f"{nombre} Variante {i}"
        
        precio = round(precio_base * random.uniform(0.8, 1.3), 2)
        cantidad_stock = random.randint(10, 500)
        stock_minimo = random.randint(5, 50)
        
        data.append({
            'id': i,
            'codigo': generar_codigo('INS', i),
            'nombre': nombre,
            'unidad': unidad,
            'precio_unitario': precio,
            'cantidad': cantidad_stock,
            'stock_minimo': stock_minimo,
            'categoria': categoria
        })
    
    return data

def generar_planes_mantenimiento(maquinaria_data):
    """Genera planes de mantenimiento para cada maquinaria"""
    data = []
    plan_id = 1
    horas_planes = [10, 50, 250, 500, 1000, 2000]
    
    for maq in maquinaria_data:
        # Generar planes por horas
        for horas in horas_planes:
            data.append({
                'id': plan_id,
                'maquinaria_id': maq['id'],
                'nombre_plan': f"PMP {maq['nombre'].split()[0]} {maq['modelo']} {horas}H",
                'tipo_mantenimiento': 'PREVENTIVO',
                'tipo_plan': 'POR_HORAS',
                'horas_operacion': horas,
                'intervalo_dias': 0,
                'descripcion': f"Plan de mantenimiento preventivo cada {horas} horas de operación",
                'activo': 1
            })
            plan_id += 1
        
        # Plan correctivo
        data.append({
            'id': plan_id,
            'maquinaria_id': maq['id'],
            'nombre_plan': f"Mantenimiento Correctivo {maq['nombre'].split()[0]} {maq['modelo']}",
            'tipo_mantenimiento': 'CORRECTIVO',
            'tipo_plan': 'CRONOGRAMA',
            'horas_operacion': 0,
            'intervalo_dias': 0,
            'descripcion': f"Plan para mantenimientos correctivos no programados",
            'activo': 1
        })
        plan_id += 1
    
    return data

def generar_actividades_mantenimiento(planes_data):
    """Genera actividades para cada plan"""
    data = []
    act_id = 1
    
    for plan in planes_data:
        # Número de actividades según tipo de plan
        if plan['tipo_mantenimiento'] == 'PREVENTIVO':
            num_actividades = random.randint(8, 15)
        else:
            num_actividades = random.randint(3, 8)
        
        componentes_usados = random.sample(COMPONENTES, min(num_actividades, len(COMPONENTES)))
        
        for orden, componente in enumerate(componentes_usados, 1):
            actividades_comp = ACTIVIDADES_POR_COMPONENTE.get(componente, ['Inspección general', 'Mantenimiento preventivo'])
            actividad = random.choice(actividades_comp)
            
            tiempo_min = random.randint(10, 30)
            tiempo_prom = tiempo_min + random.randint(5, 15)
            tiempo_max = tiempo_prom + random.randint(5, 20)
            costo = round(random.uniform(50, 500), 2)
            
            data.append({
                'id': act_id,
                'plan_id': plan['id'],
                'numero_orden': orden,
                'descripcion_componente': componente,
                'actividad': actividad,
                'tiempo_min': tiempo_min,
                'tiempo_promedio': tiempo_prom,
                'tiempo_max': tiempo_max,
                'costo_estimado': costo
            })
            act_id += 1
    
    return data

def generar_actividad_insumos(actividades_data, insumos_data):
    """Genera relación entre actividades e insumos"""
    data = []
    rel_id = 1
    
    for act in actividades_data:
        # Cada actividad tiene 1-4 insumos
        num_insumos = random.randint(1, 4)
        insumos_seleccionados = random.sample(insumos_data, min(num_insumos, len(insumos_data)))
        
        for insumo in insumos_seleccionados:
            cantidad = round(random.uniform(0.5, 10), 2)
            costo_unitario = insumo['precio_unitario']
            
            data.append({
                'id': rel_id,
                'actividad_id': act['id'],
                'insumo_id': insumo['id'],
                'cantidad': cantidad,
                'unidad': insumo['unidad'],
                'especificaciones': f"Para {act['descripcion_componente']}",
                'costo_unitario': costo_unitario
            })
            rel_id += 1
    
    return data

def generar_actividad_herramientas(actividades_data, herramientas_data):
    """Genera relación entre actividades y herramientas"""
    data = []
    rel_id = 1
    
    for act in actividades_data:
        # Cada actividad tiene 1-3 herramientas
        num_herramientas = random.randint(1, 3)
        herramientas_seleccionadas = random.sample(herramientas_data, min(num_herramientas, len(herramientas_data)))
        
        for herramienta in herramientas_seleccionadas:
            data.append({
                'id': rel_id,
                'actividad_id': act['id'],
                'herramienta_id': herramienta['id'],
                'cantidad': random.randint(1, 2),
                'especificaciones': f"Herramienta para {act['actividad']}"
            })
            rel_id += 1
    
    return data

def generar_mantenimientos(maquinaria_data, planes_data):
    """Genera registros de mantenimientos ejecutados"""
    data = []
    mant_id = 1
    
    for maq in maquinaria_data:
        # Generar 3-8 mantenimientos por maquinaria
        num_mant = random.randint(3, 8)
        planes_maq = [p for p in planes_data if p['maquinaria_id'] == maq['id']]
        
        for _ in range(num_mant):
            plan = random.choice(planes_maq) if planes_maq else None
            estado = random.choice(['COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'PROGRAMADO', 'EN_PROCESO'])
            
            fecha_prog = fecha_aleatoria(2)
            fecha_ejec = fecha_prog if estado == 'COMPLETADO' else ''
            
            costo_mo = round(random.uniform(100, 1500), 2) if estado == 'COMPLETADO' else 0
            costo_ins = round(random.uniform(200, 3000), 2) if estado == 'COMPLETADO' else 0
            
            data.append({
                'id': mant_id,
                'maquinaria_id': maq['id'],
                'plan_id': plan['id'] if plan else 1,
                'tipo_mantenimiento': plan['tipo_mantenimiento'] if plan else 'CORRECTIVO',
                'fecha_programada': fecha_prog,
                'fecha_ejecucion': fecha_ejec if fecha_ejec else fecha_prog,
                'horas_maquina': round(random.uniform(100, 5000), 2),
                'estado': estado,
                'observaciones': f"Mantenimiento {estado.lower()} correctamente",
                'costo_mano_obra': costo_mo,
                'costo_insumos': costo_ins
            })
            mant_id += 1
    
    return data

def generar_mantenimiento_personal(mantenimientos_data, personal_data):
    """Genera asignación de personal a mantenimientos"""
    data = []
    rel_id = 1
    
    mecanicos = [p for p in personal_data if 'Mecánico' in p['cargo'] or 'Técnico' in p['cargo']]
    
    for mant in mantenimientos_data:
        if mant['estado'] in ['COMPLETADO', 'EN_PROCESO']:
            # Asignar 1-3 personas
            num_personas = random.randint(1, 3)
            personas_asignadas = random.sample(mecanicos, min(num_personas, len(mecanicos)))
            
            for persona in personas_asignadas:
                horas = round(random.uniform(1, 8), 2)
                
                data.append({
                    'id': rel_id,
                    'mantenimiento_id': mant['id'],
                    'personal_id': persona['id'],
                    'horas_trabajadas': horas,
                    'tarifa_aplicada': persona['tarifa_hora']
                })
                rel_id += 1
    
    return data

def generar_mantenimiento_insumos(mantenimientos_data, insumos_data):
    """Genera uso de insumos en mantenimientos"""
    data = []
    rel_id = 1
    
    for mant in mantenimientos_data:
        if mant['estado'] in ['COMPLETADO', 'EN_PROCESO']:
            # Usar 2-6 insumos
            num_insumos = random.randint(2, 6)
            insumos_usados = random.sample(insumos_data, min(num_insumos, len(insumos_data)))
            
            for insumo in insumos_usados:
                cantidad = round(random.uniform(0.5, 5), 2)
                
                data.append({
                    'id': rel_id,
                    'mantenimiento_id': mant['id'],
                    'insumo_id': insumo['id'],
                    'cantidad_usada': cantidad,
                    'unidad': insumo['unidad'],
                    'precio_unitario': insumo['precio_unitario']
                })
                rel_id += 1
    
    return data

def generar_mantenimiento_actividades(mantenimientos_data, actividades_data, planes_data):
    """Genera actividades ejecutadas en mantenimientos"""
    data = []
    rel_id = 1
    
    for mant in mantenimientos_data:
        if mant['estado'] in ['COMPLETADO', 'EN_PROCESO']:
            # Obtener actividades del plan
            actividades_plan = [a for a in actividades_data if a['plan_id'] == mant['plan_id']]
            
            if actividades_plan:
                # Ejecutar algunas actividades
                num_acts = min(random.randint(3, 8), len(actividades_plan))
                acts_ejecutadas = random.sample(actividades_plan, num_acts)
                
                for act in acts_ejecutadas:
                    tiempo_real = random.randint(act['tiempo_min'], act['tiempo_max'])
                    completada = 1 if mant['estado'] == 'COMPLETADO' else random.choice([0, 1])
                    
                    data.append({
                        'id': rel_id,
                        'mantenimiento_id': mant['id'],
                        'actividad_id': act['id'],
                        'descripcion': act['actividad'],
                        'tiempo_real': tiempo_real,
                        'completada': completada,
                        'observaciones': 'Ejecutado según plan' if completada else 'Pendiente de completar'
                    })
                    rel_id += 1
    
    return data

def guardar_csv(data, nombre_archivo, campos):
    """Guarda datos en archivo CSV"""
    filepath = os.path.join(OUTPUT_DIR, nombre_archivo)
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(data)
    print(f"✓ Generado: {nombre_archivo} ({len(data)} registros)")

# ============================================
# MAIN
# ============================================

def main():
    print("=" * 50)
    print("GENERADOR DE DATOS COMPLETOS - MTTO PRO")
    print("=" * 50)
    print()
    
    # Generar datos base
    print("Generando datos base...")
    maquinaria = generar_maquinaria(50)
    personal = generar_personal(40)
    herramientas = generar_herramientas(60)
    insumos = generar_insumos(80)
    
    # Guardar datos base
    guardar_csv(maquinaria, '01_maquinaria.csv', 
                ['id', 'codigo', 'nombre', 'marca', 'modelo', 'anio', 'estado', 'costo_adquisicion', 'horas_totales'])
    guardar_csv(personal, '02_personal.csv',
                ['id', 'codigo', 'nombre_completo', 'ci', 'cargo', 'telefono', 'celular', 'tarifa_hora', 'estado'])
    guardar_csv(herramientas, '03_herramientas.csv',
                ['id', 'codigo', 'nombre', 'marca', 'estado', 'categoria', 'costo'])
    guardar_csv(insumos, '04_insumos.csv',
                ['id', 'codigo', 'nombre', 'unidad', 'precio_unitario', 'cantidad', 'stock_minimo', 'categoria'])
    
    # Generar planes y actividades
    print("\nGenerando planes de mantenimiento...")
    planes = generar_planes_mantenimiento(maquinaria)
    actividades = generar_actividades_mantenimiento(planes)
    
    guardar_csv(planes, '05_planes_mantenimiento.csv',
                ['id', 'maquinaria_id', 'nombre_plan', 'tipo_mantenimiento', 'tipo_plan', 'horas_operacion', 'intervalo_dias', 'descripcion', 'activo'])
    guardar_csv(actividades, '06_actividades_mantenimiento.csv',
                ['id', 'plan_id', 'numero_orden', 'descripcion_componente', 'actividad', 'tiempo_min', 'tiempo_promedio', 'tiempo_max', 'costo_estimado'])
    
    # Generar relaciones actividad-insumos/herramientas
    print("\nGenerando relaciones de actividades...")
    act_insumos = generar_actividad_insumos(actividades, insumos)
    act_herramientas = generar_actividad_herramientas(actividades, herramientas)
    
    guardar_csv(act_insumos, '07_actividad_insumos.csv',
                ['id', 'actividad_id', 'insumo_id', 'cantidad', 'unidad', 'especificaciones', 'costo_unitario'])
    guardar_csv(act_herramientas, '08_actividad_herramientas.csv',
                ['id', 'actividad_id', 'herramienta_id', 'cantidad', 'especificaciones'])
    
    # Generar mantenimientos
    print("\nGenerando mantenimientos...")
    mantenimientos = generar_mantenimientos(maquinaria, planes)
    mant_personal = generar_mantenimiento_personal(mantenimientos, personal)
    mant_insumos = generar_mantenimiento_insumos(mantenimientos, insumos)
    mant_actividades = generar_mantenimiento_actividades(mantenimientos, actividades, planes)
    
    guardar_csv(mantenimientos, '09_mantenimientos.csv',
                ['id', 'maquinaria_id', 'plan_id', 'tipo_mantenimiento', 'fecha_programada', 'fecha_ejecucion', 'horas_maquina', 'estado', 'observaciones', 'costo_mano_obra', 'costo_insumos'])
    guardar_csv(mant_personal, '10_mantenimiento_personal.csv',
                ['id', 'mantenimiento_id', 'personal_id', 'horas_trabajadas', 'tarifa_aplicada'])
    guardar_csv(mant_insumos, '11_mantenimiento_insumos.csv',
                ['id', 'mantenimiento_id', 'insumo_id', 'cantidad_usada', 'unidad', 'precio_unitario'])
    guardar_csv(mant_actividades, '12_mantenimiento_actividades.csv',
                ['id', 'mantenimiento_id', 'actividad_id', 'descripcion', 'tiempo_real', 'completada', 'observaciones'])
    
    print("\n" + "=" * 50)
    print("¡DATOS GENERADOS EXITOSAMENTE!")
    print("=" * 50)
    print(f"\nTotal de archivos: 12")
    print(f"Ubicación: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()

