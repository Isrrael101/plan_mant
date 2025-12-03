# -*- coding: utf-8 -*-
"""
Generador de datos completos para MTTO Pro
Todos los campos tendrán valores válidos - Sin NaN
"""

import csv
import random
import json
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
           'María', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Sandra', 'Elena', 'Claudia', 'Isabel',
           'Ricardo', 'Gabriel', 'Hugo', 'Daniel', 'Pablo', 'Alejandro', 'Javier', 'Francisco', 'Manuel', 'Antonio']
APELLIDOS = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez',
             'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Vargas',
             'Castillo', 'Ortiz', 'Silva', 'Rojas', 'Guerrero', 'Mendoza', 'Ruiz', 'Alvarez', 'Romero', 'Fernández']

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
    ('Eslinga de Cadena', 'Elevación'), ('Engrasadora Manual', 'Manual'), ('Extractor de Rodamientos', 'Manual'),
    ('Llave de Impacto 1"', 'Neumática'), ('Esmeril de Banco', 'Eléctrica'), ('Sierra Sable', 'Eléctrica'),
    ('Pinza Amperimétrica', 'Medición'), ('Tacómetro Digital', 'Medición'), ('Termómetro Infrarrojo', 'Medición'),
    ('Juego de Dados 3/4"', 'Manual'), ('Llave Dinamométrica', 'Medición'), ('Gata Lagarto', 'Hidráulica'),
    ('Pluma Hidráulica', 'Elevación'), ('Mesa Elevadora', 'Elevación'), ('Cizalla Manual', 'Corte'),
    ('Sierra Circular', 'Eléctrica'), ('Lijadora Orbital', 'Eléctrica'), ('Pistola de Calor', 'Eléctrica'),
    ('Cargador de Baterías', 'Eléctrica'), ('Probador de Inyectores', 'Medición'), ('Analizador de Gases', 'Medición'),
    ('Estetoscopio Mecánico', 'Medición'), ('Comparador de Carátula', 'Medición'), ('Goniómetro', 'Medición'),
    ('Remachadora Neumática', 'Neumática'), ('Taladro de Banco', 'Eléctrica'), ('Pistola de Pintar', 'Neumática')
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
    ('Cinta Aislante', 'Rollo', 'Consumibles', 12.00),
    ('Limpiador de Contactos', 'Spray', 'Químicos', 15.00),
    ('Aflojatodo', 'Spray', 'Químicos', 12.00),
    ('Abrazadera Metálica', 'Unidad', 'Consumibles', 2.50),
    ('Tornillo Grado 8', 'Unidad', 'Repuestos', 3.00),
    ('Tuerca de Seguridad', 'Unidad', 'Repuestos', 1.50),
    ('Arandela de Presión', 'Unidad', 'Repuestos', 0.50),
    ('O-ring Kit', 'Kit', 'Hidráulicos', 45.00),
    ('Retén de Aceite', 'Unidad', 'Repuestos', 25.00),
    ('Terminal Eléctrico', 'Unidad', 'Eléctricos', 0.50),
    ('Relé 24V', 'Unidad', 'Eléctricos', 15.00),
    ('Sensor de Presión', 'Unidad', 'Eléctricos', 120.00),
    ('Sensor de Temperatura', 'Unidad', 'Eléctricos', 85.00),
    ('Filtro Separador Agua', 'Unidad', 'Filtros', 65.00),
    ('Aceite Diferencial', 'Litro', 'Lubricantes', 30.00),
    ('Grasa Chasis', 'Kg', 'Lubricantes', 10.00),
    ('Lija de Agua', 'Pliego', 'Consumibles', 1.50),
    ('Disco de Corte', 'Unidad', 'Consumibles', 5.00),
    ('Electrodo 7018', 'Kg', 'Consumibles', 18.00)
]

COMPONENTES = [
    'Sistema de Lubricación', 'Motor', 'Sistema Hidráulico', 'Sistema de Transmisión',
    'Sistema de Refrigeración', 'Sistema Eléctrico', 'Sistema de Frenos', 'Neumáticos',
    'Carrocería', 'Cuchara y Brazo', 'Filtros', 'Sistema de Combustible', 'Cabina',
    'Sistema de Dirección', 'Tren de Rodaje', 'Sistema de Escape'
]

ACTIVIDADES_POR_COMPONENTE = {
    'Sistema de Lubricación': ['Cambiar aceite de motor', 'Verificar nivel de aceite', 'Engrasar puntos de lubricación', 'Tomar muestra de aceite'],
    'Motor': ['Revisar nivel de refrigerante', 'Inspeccionar correas', 'Verificar funcionamiento de motor', 'Ajustar válvulas', 'Revisar soportes de motor'],
    'Sistema Hidráulico': ['Cambiar aceite hidráulico', 'Revisar mangueras', 'Verificar cilindros', 'Medir presiones de bomba', 'Cambiar sellos de cilindro'],
    'Sistema de Transmisión': ['Cambiar aceite de transmisión', 'Ajustar embrague', 'Revisar convertidor', 'Verificar cardanes', 'Engrasar crucetas'],
    'Sistema de Refrigeración': ['Limpiar radiador', 'Verificar termostato', 'Revisar mangueras', 'Cambiar refrigerante', 'Revisar bomba de agua'],
    'Sistema Eléctrico': ['Revisar batería', 'Verificar alternador', 'Inspeccionar conexiones', 'Revisar luces de trabajo', 'Verificar motor de arranque'],
    'Sistema de Frenos': ['Revisar pastillas', 'Verificar líquido de frenos', 'Ajustar frenos', 'Purgar sistema de frenos', 'Revisar discos'],
    'Neumáticos': ['Verificar presión', 'Inspeccionar desgaste', 'Rotar neumáticos', 'Ajustar pernos de rueda', 'Reparar pinchazo'],
    'Carrocería': ['Inspección visual', 'Reparar abolladuras', 'Pintar partes oxidadas', 'Lavar equipo completo', 'Revisar vidrios'],
    'Cuchara y Brazo': ['Revisar dientes', 'Verificar pasadores', 'Engrasar articulaciones', 'Soldar refuerzos', 'Cambiar bocinas'],
    'Filtros': ['Cambiar filtro de aceite', 'Cambiar filtro de aire', 'Cambiar filtro de combustible', 'Limpiar pre-filtro', 'Cambiar filtro de cabina'],
    'Sistema de Combustible': ['Drenar tanque', 'Revisar inyectores', 'Verificar bomba de combustible', 'Limpiar trampa de agua', 'Cambiar cañerías'],
    'Cabina': ['Revisar asiento', 'Verificar controles', 'Limpiar filtros de aire acondicionado', 'Revisar cinturón de seguridad', 'Verificar tablero'],
    'Sistema de Dirección': ['Revisar bomba de dirección', 'Verificar juego', 'Engrasar articulaciones', 'Alinear dirección', 'Revisar terminales'],
    'Tren de Rodaje': ['Revisar tensión de cadena', 'Inspeccionar rodillos', 'Verificar sprockets', 'Medir desgaste de zapatas', 'Ajustar tensión'],
    'Sistema de Escape': ['Revisar tubo de escape', 'Verificar silenciador', 'Inspeccionar DPF', 'Revisar turbo', 'Cambiar empaques']
}

OBSERVACIONES_MANTENIMIENTO = [
    "Mantenimiento realizado sin novedades.",
    "Se detectó desgaste prematuro en componentes.",
    "Equipo operativo y en buenas condiciones.",
    "Se recomienda monitorear temperatura en próxima guardia.",
    "Trabajo realizado según procedimiento estándar.",
    "Se requiere cambio de repuestos en próximo servicio.",
    "Limpieza general realizada.",
    "Niveles de fluidos restablecidos.",
    "Pruebas de funcionamiento exitosas.",
    "Se ajustaron parámetros de operación."
]

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

def generar_email(nombre, apellido):
    dominios = ['empresa.com', 'gmail.com', 'outlook.com', 'hotmail.com']
    return f"{nombre.lower()}.{apellido.lower()}@{random.choice(dominios)}"

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
            'anio': str(random.randint(2015, 2024)),
            'estado': random.choice(['OPERATIVO', 'OPERATIVO', 'OPERATIVO', 'MANTENIMIENTO', 'INACTIVO']),
            'costo_adquisicion': round(random.uniform(80000, 600000), 2),
            'horas_totales': round(random.uniform(100, 12000), 2)
        })
    
    return data

def generar_personal(cantidad=40):
    """Genera datos de personal"""
    data = []
    for i in range(1, cantidad + 1):
        nombre_pila = random.choice(NOMBRES)
        apellido1 = random.choice(APELLIDOS)
        apellido2 = random.choice(APELLIDOS)
        nombre = f"{nombre_pila} {apellido1} {apellido2}"
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
    
    # Asegurar que tenemos suficientes herramientas base o repetir con lógica
    while len(herramientas_base) < cantidad:
        item = random.choice(HERRAMIENTAS)
        herramientas_base.append((f"{item[0]} Pro", item[1]))

    for i in range(1, cantidad + 1):
        nombre, categoria = herramientas_base[i-1]
        marca = random.choice(['Stanley', 'DeWalt', 'Bosch', 'Makita', 'Milwaukee', 'Snap-on', 'Proto', 'Bahco', 'Hilti', 'Ingersoll Rand'])
        
        data.append({
            'id': i,
            'codigo': generar_codigo('HER', i),
            'nombre': nombre,
            'marca': marca,
            'estado': random.choice(['OPERATIVO', 'OPERATIVO', 'OPERATIVO', 'MANTENIMIENTO', 'INACTIVO']),
            'categoria': categoria,
            'costo': round(random.uniform(50, 2500), 2)
        })
    
    return data

def generar_insumos(cantidad=80):
    """Genera datos de insumos"""
    data = []
    insumos_base = INSUMOS.copy()
    
    while len(insumos_base) < cantidad:
        item = random.choice(INSUMOS)
        insumos_base.append((f"{item[0]} Premium", item[1], item[2], item[3] * 1.2))

    for i in range(1, cantidad + 1):
        nombre, unidad, categoria, precio_base = insumos_base[i-1]
        
        precio = round(precio_base * random.uniform(0.9, 1.1), 2)
        cantidad_stock = random.randint(20, 800)
        stock_minimo = random.randint(10, 100)
        
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
    horas_planes = [250, 500, 1000, 2000]
    
    for maq in maquinaria_data:
        # Generar planes por horas
        for horas in horas_planes:
            data.append({
                'id': plan_id,
                'maquinaria_id': maq['id'],
                'nombre_plan': f"PM-{horas}H {maq['nombre'].split()[0]} {maq['modelo']}",
                'tipo_mantenimiento': 'PREVENTIVO',
                'tipo_plan': 'POR_HORAS',
                'horas_operacion': horas,
                'intervalo_dias': 0,
                'descripcion': f"Mantenimiento preventivo estándar de {horas} horas. Incluye cambio de filtros y aceites según manual.",
                'activo': 1
            })
            plan_id += 1
        
        # Plan correctivo
        data.append({
            'id': plan_id,
            'maquinaria_id': maq['id'],
            'nombre_plan': f"Correctivo General {maq['modelo']}",
            'tipo_mantenimiento': 'CORRECTIVO',
            'tipo_plan': 'CRONOGRAMA',
            'horas_operacion': 0,
            'intervalo_dias': 0,
            'descripcion': f"Plan para reparaciones no programadas y fallas imprevistas.",
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
            if '250H' in plan['nombre_plan']:
                num_actividades = 5
            elif '500H' in plan['nombre_plan']:
                num_actividades = 8
            elif '1000H' in plan['nombre_plan']:
                num_actividades = 12
            else:
                num_actividades = 15
        else:
            num_actividades = 4
        
        componentes_usados = random.sample(COMPONENTES, min(num_actividades, len(COMPONENTES)))
        
        for orden, componente in enumerate(componentes_usados, 1):
            actividades_comp = ACTIVIDADES_POR_COMPONENTE.get(componente, ['Inspección general', 'Mantenimiento preventivo'])
            actividad = random.choice(actividades_comp)
            
            tiempo_min = random.randint(15, 45)
            tiempo_prom = tiempo_min + random.randint(10, 30)
            tiempo_max = tiempo_prom + random.randint(10, 30)
            costo = round(random.uniform(80, 600), 2)
            
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
        # 40% de probabilidad de necesitar insumos
        if random.random() > 0.6:
            num_insumos = random.randint(1, 3)
            insumos_seleccionados = random.sample(insumos_data, min(num_insumos, len(insumos_data)))
            
            for insumo in insumos_seleccionados:
                cantidad = round(random.uniform(1, 5), 2)
                costo_unitario = insumo['precio_unitario']
                
                data.append({
                    'id': rel_id,
                    'actividad_id': act['id'],
                    'insumo_id': insumo['id'],
                    'cantidad': cantidad,
                    'unidad': insumo['unidad'],
                    'especificaciones': f"Requerido para {act['actividad']}",
                    'costo_unitario': costo_unitario
                })
                rel_id += 1
    
    return data

def generar_actividad_herramientas(actividades_data, herramientas_data):
    """Genera relación entre actividades y herramientas"""
    data = []
    rel_id = 1
    
    for act in actividades_data:
        # 50% de probabilidad de necesitar herramientas específicas
        if random.random() > 0.5:
            num_herramientas = random.randint(1, 2)
            herramientas_seleccionadas = random.sample(herramientas_data, min(num_herramientas, len(herramientas_data)))
            
            for herramienta in herramientas_seleccionadas:
                data.append({
                    'id': rel_id,
                    'actividad_id': act['id'],
                    'herramienta_id': herramienta['id'],
                    'cantidad': 1,
                    'especificaciones': f"Uso estándar para {act['descripcion_componente']}"
                })
                rel_id += 1
    
    return data

def generar_mantenimientos(maquinaria_data, planes_data):
    """Genera registros de mantenimientos ejecutados"""
    data = []
    mant_id = 1
    
    for maq in maquinaria_data:
        # Generar 5-10 mantenimientos por maquinaria
        num_mant = random.randint(5, 10)
        planes_maq = [p for p in planes_data if p['maquinaria_id'] == maq['id']]
        
        for _ in range(num_mant):
            plan = random.choice(planes_maq) if planes_maq else None
            estado = random.choice(['COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'PROGRAMADO', 'EN_PROCESO'])
            
            fecha_prog = fecha_aleatoria(1)
            fecha_ejec = fecha_prog if estado == 'COMPLETADO' else ''
            
            costo_mo = round(random.uniform(200, 2000), 2) if estado == 'COMPLETADO' else 0
            costo_ins = round(random.uniform(300, 5000), 2) if estado == 'COMPLETADO' else 0
            
            observacion = random.choice(OBSERVACIONES_MANTENIMIENTO)
            
            data.append({
                'id': mant_id,
                'maquinaria_id': maq['id'],
                'plan_id': plan['id'] if plan else 1,
                'tipo_mantenimiento': plan['tipo_mantenimiento'] if plan else 'CORRECTIVO',
                'fecha_programada': fecha_prog,
                'fecha_ejecucion': fecha_ejec if fecha_ejec else fecha_prog, # Para evitar NULLs molestos si el usuario quiere ver fechas
                'horas_maquina': round(random.uniform(500, 10000), 2),
                'estado': estado,
                'observaciones': observacion,
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
            num_personas = random.randint(1, 3)
            personas_asignadas = random.sample(mecanicos, min(num_personas, len(mecanicos)))
            
            for persona in personas_asignadas:
                horas = round(random.uniform(2, 10), 2)
                
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
            num_insumos = random.randint(2, 5)
            insumos_usados = random.sample(insumos_data, min(num_insumos, len(insumos_data)))
            
            for insumo in insumos_usados:
                cantidad = round(random.uniform(1, 10), 2)
                
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
            actividades_plan = [a for a in actividades_data if a['plan_id'] == mant['plan_id']]
            
            if actividades_plan:
                # Ejecutar todas o casi todas las actividades
                num_acts = max(1, int(len(actividades_plan) * 0.9))
                acts_ejecutadas = random.sample(actividades_plan, num_acts)
                
                for act in acts_ejecutadas:
                    tiempo_real = random.randint(act['tiempo_min'], act['tiempo_max'])
                    completada = 1
                    
                    data.append({
                        'id': rel_id,
                        'mantenimiento_id': mant['id'],
                        'actividad_id': act['id'],
                        'descripcion': act['actividad'],
                        'tiempo_real': tiempo_real,
                        'completada': completada,
                        'observaciones': 'Tarea finalizada correctamente.'
                    })
                    rel_id += 1
    
    return data

def generar_usuarios(personal_data):
    """Genera usuarios del sistema basados en personal"""
    data = []
    
    # Admin
    data.append({
        'id': 1,
        'username': 'admin',
        'password': 'admin123_hashed_placeholder', # En producción esto debe ser hash
        'nombre_completo': 'Administrador del Sistema',
        'email': 'admin@mttopro.com',
        'rol': 'ADMIN',
        'estado': 1,
        'two_factor_secret': '',
        'two_factor_enabled': 0,
        'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    })
    
    user_id = 2
    # Generar usuarios para algunos del personal
    for p in personal_data[:15]: # Primeros 15 empleados
        username = f"{p['nombre_completo'].split()[0].lower()}.{p['nombre_completo'].split()[1].lower()}"
        rol = 'MANTENIMIENTO'
        if 'Jefe' in p['cargo'] or 'Supervisor' in p['cargo']:
            rol = 'ADMIN'
        elif 'Operador' in p['cargo']:
            rol = 'OPERADOR'
            
        data.append({
            'id': user_id,
            'username': username,
            'password': 'password123', # Placeholder
            'nombre_completo': p['nombre_completo'],
            'email': generar_email(p['nombre_completo'].split()[0], p['nombre_completo'].split()[1]),
            'rol': rol,
            'estado': 1,
            'two_factor_secret': '',
            'two_factor_enabled': 0,
            'created_at': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        user_id += 1
        
    return data

def generar_checklists(maquinaria_data, usuarios_data):
    """Genera checklists diarios"""
    data = []
    checklist_id = 1
    
    for maq in maquinaria_data:
        # 5 checklists por máquina
        for _ in range(5):
            fecha = fecha_aleatoria(1)
            usuario = random.choice(usuarios_data)
            
            checklist_content = {
                "motor": {"nivel_aceite": "OK", "ruidos_anormales": "NO", "fugas": "NO"},
                "hidraulico": {"nivel_aceite": "OK", "mangueras": "OK", "cilindros": "OK"},
                "electrico": {"luces": "OK", "bateria": "OK", "tablero": "OK"},
                "seguridad": {"extintor": "OK", "cinturon": "OK", "espejos": "OK"}
            }
            
            data.append({
                'id': checklist_id,
                'maquinaria_id': maq['id'],
                'fecha': fecha,
                'tipo_checklist': 'DIARIO',
                'codigo_checklist': f"CHK-{maq['codigo']}-{checklist_id}",
                'realizado_por': usuario['nombre_completo'],
                'revisado_por': 'Supervisor General',
                'observaciones': 'Equipo en condiciones operativas.',
                'data': json.dumps(checklist_content),
                'created_at': f"{fecha} 08:00:00",
                'updated_at': f"{fecha} 08:30:00"
            })
            checklist_id += 1
            
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
    print("GENERADOR DE DATOS COMPLETOS - MTTO PRO v2")
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
    
    # Generar usuarios y checklists
    print("\nGenerando usuarios y checklists...")
    usuarios = generar_usuarios(personal)
    checklists = generar_checklists(maquinaria, usuarios)
    
    guardar_csv(usuarios, '13_users.csv',
                ['id', 'username', 'password', 'nombre_completo', 'email', 'rol', 'estado', 'two_factor_secret', 'two_factor_enabled', 'created_at'])
    guardar_csv(checklists, '14_checklists.csv',
                ['id', 'maquinaria_id', 'fecha', 'tipo_checklist', 'codigo_checklist', 'realizado_por', 'revisado_por', 'observaciones', 'data', 'created_at', 'updated_at'])
    
    print("\n" + "=" * 50)
    print("¡DATOS GENERADOS EXITOSAMENTE!")
    print("=" * 50)
    print(f"\nTotal de archivos: 14")
    print(f"Ubicación: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
