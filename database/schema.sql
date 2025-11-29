-- ============================================
-- MTTO Pro - Schema de Base de Datos MySQL
-- Sistema de Gestión de Mantenimiento Profesional
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mtto_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE mtto_db;

-- ============================================
-- TABLA: Maquinaria
-- ============================================
CREATE TABLE IF NOT EXISTS maquinaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    anio VARCHAR(10),
    estado ENUM('OPERATIVO', 'MANTENIMIENTO', 'INACTIVO') DEFAULT 'OPERATIVO',
    costo_adquisicion DECIMAL(12, 2) DEFAULT 0.00,
    horas_totales DECIMAL(10, 2) DEFAULT 0.00,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Personal
-- ============================================
CREATE TABLE IF NOT EXISTS personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre_completo VARCHAR(255) NOT NULL,
    ci VARCHAR(50),
    cargo VARCHAR(150),
    telefono VARCHAR(50),
    celular VARCHAR(50),
    tarifa_hora DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Tarifa por hora de trabajo',
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_cargo (cargo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Herramientas
-- ============================================
CREATE TABLE IF NOT EXISTS herramientas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100),
    estado ENUM('OPERATIVO', 'MANTENIMIENTO', 'INACTIVO') DEFAULT 'OPERATIVO',
    categoria VARCHAR(100),
    costo DECIMAL(12, 2) DEFAULT 0.00,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Insumos
-- ============================================
CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    unidad VARCHAR(50),
    precio_unitario DECIMAL(12, 2) DEFAULT 0.00,
    cantidad INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    categoria VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Planes de Mantenimiento
-- ============================================
CREATE TABLE IF NOT EXISTS planes_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquinaria_id INT,
    nombre_plan VARCHAR(255) NOT NULL,
    tipo_mantenimiento ENUM('PREVENTIVO', 'CORRECTIVO', 'PROACTIVO') DEFAULT 'PREVENTIVO',
    tipo_plan ENUM('POR_HORAS', 'CRONOGRAMA', 'CHECKLIST') DEFAULT 'POR_HORAS',
    horas_operacion INT COMMENT 'Horas de operación para activar el plan',
    intervalo_dias INT COMMENT 'Intervalo en días para mantenimiento programado',
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE SET NULL,
    INDEX idx_maquinaria (maquinaria_id),
    INDEX idx_tipo_mantenimiento (tipo_mantenimiento),
    INDEX idx_tipo_plan (tipo_plan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Actividades de Mantenimiento
-- ============================================
CREATE TABLE IF NOT EXISTS actividades_mantenimiento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_id INT NOT NULL,
    numero_orden INT,
    descripcion_componente VARCHAR(255),
    actividad TEXT,
    tiempo_min INT COMMENT 'Tiempo mínimo en minutos',
    tiempo_promedio INT COMMENT 'Tiempo promedio en minutos',
    tiempo_max INT COMMENT 'Tiempo máximo en minutos',
    costo_estimado DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Costo estimado total de la actividad',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES planes_mantenimiento(id) ON DELETE CASCADE,
    INDEX idx_plan (plan_id),
    INDEX idx_numero_orden (numero_orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Insumos por Actividad
-- ============================================
CREATE TABLE IF NOT EXISTS actividad_insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actividad_id INT NOT NULL,
    insumo_id INT,
    cantidad DECIMAL(10, 2) NOT NULL,
    unidad VARCHAR(50),
    especificaciones TEXT,
    costo_unitario DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Costo unitario al momento de la asignación',
    costo_total DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad * costo_unitario) STORED,
    FOREIGN KEY (actividad_id) REFERENCES actividades_mantenimiento(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE SET NULL,
    INDEX idx_actividad (actividad_id),
    INDEX idx_insumo (insumo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Herramientas por Actividad
-- ============================================
CREATE TABLE IF NOT EXISTS actividad_herramientas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actividad_id INT NOT NULL,
    herramienta_id INT,
    cantidad INT DEFAULT 1,
    especificaciones TEXT,
    FOREIGN KEY (actividad_id) REFERENCES actividades_mantenimiento(id) ON DELETE CASCADE,
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE SET NULL,
    INDEX idx_actividad (actividad_id),
    INDEX idx_herramienta (herramienta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Mantenimientos Programados/Ejecutados
-- ============================================
CREATE TABLE IF NOT EXISTS mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquinaria_id INT NOT NULL,
    plan_id INT COMMENT 'NULL para mantenimientos correctivos no planificados',
    tipo_mantenimiento ENUM('PREVENTIVO', 'CORRECTIVO', 'PROACTIVO') NOT NULL,
    fecha_programada DATE COMMENT 'Fecha programada para el mantenimiento',
    fecha_ejecucion DATE COMMENT 'Fecha real de ejecución',
    horas_maquina DECIMAL(10, 2) COMMENT 'Horas de operación de la maquinaria al momento del mantenimiento',
    estado ENUM('PROGRAMADO', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO') DEFAULT 'PROGRAMADO',
    observaciones TEXT,
    costo_mano_obra DECIMAL(12, 2) DEFAULT 0.00,
    costo_insumos DECIMAL(12, 2) DEFAULT 0.00,
    costo_total DECIMAL(12, 2) GENERATED ALWAYS AS (costo_mano_obra + costo_insumos) STORED,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES planes_mantenimiento(id) ON DELETE SET NULL,
    INDEX idx_maquinaria (maquinaria_id),
    INDEX idx_plan (plan_id),
    INDEX idx_tipo (tipo_mantenimiento),
    INDEX idx_fecha_programada (fecha_programada),
    INDEX idx_fecha_ejecucion (fecha_ejecucion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Personal Asignado a Mantenimiento
-- ============================================
CREATE TABLE IF NOT EXISTS mantenimiento_personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mantenimiento_id INT NOT NULL,
    personal_id INT NOT NULL,
    horas_trabajadas DECIMAL(5, 2) DEFAULT 0.00,
    tarifa_aplicada DECIMAL(10, 2) DEFAULT 0.00 COMMENT 'Tarifa por hora aplicada',
    costo_total DECIMAL(12, 2) GENERATED ALWAYS AS (horas_trabajadas * tarifa_aplicada) STORED,
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimientos(id) ON DELETE CASCADE,
    FOREIGN KEY (personal_id) REFERENCES personal(id) ON DELETE CASCADE,
    INDEX idx_mantenimiento (mantenimiento_id),
    INDEX idx_personal (personal_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Insumos Utilizados en Mantenimiento
-- ============================================
CREATE TABLE IF NOT EXISTS mantenimiento_insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mantenimiento_id INT NOT NULL,
    insumo_id INT NOT NULL,
    cantidad_usada DECIMAL(10, 2) NOT NULL,
    unidad VARCHAR(50),
    precio_unitario DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Precio unitario al momento del uso',
    costo_total DECIMAL(12, 2) GENERATED ALWAYS AS (cantidad_usada * precio_unitario) STORED,
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimientos(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE CASCADE,
    INDEX idx_mantenimiento (mantenimiento_id),
    INDEX idx_insumo (insumo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Actividades Ejecutadas en Mantenimiento
-- ============================================
CREATE TABLE IF NOT EXISTS mantenimiento_actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mantenimiento_id INT NOT NULL,
    actividad_id INT COMMENT 'Referencia a actividad del plan, NULL si es actividad adicional',
    descripcion TEXT NOT NULL,
    tiempo_real INT COMMENT 'Tiempo real en minutos',
    completada BOOLEAN DEFAULT FALSE,
    observaciones TEXT,
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimientos(id) ON DELETE CASCADE,
    FOREIGN KEY (actividad_id) REFERENCES actividades_mantenimiento(id) ON DELETE SET NULL,
    INDEX idx_mantenimiento (mantenimiento_id),
    INDEX idx_actividad (actividad_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VISTAS
-- ============================================

-- Vista: Resumen de Inventario
CREATE OR REPLACE VIEW v_resumen_inventario AS
SELECT 
    'maquinaria' as tipo,
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'OPERATIVO' THEN 1 ELSE 0 END) as operativos,
    SUM(CASE WHEN estado = 'MANTENIMIENTO' THEN 1 ELSE 0 END) as en_mantenimiento,
    SUM(CASE WHEN estado = 'INACTIVO' THEN 1 ELSE 0 END) as inactivos
FROM maquinaria
UNION ALL
SELECT 
    'herramientas' as tipo,
    COUNT(*) as total,
    SUM(CASE WHEN estado = 'OPERATIVO' THEN 1 ELSE 0 END) as operativos,
    SUM(CASE WHEN estado = 'MANTENIMIENTO' THEN 1 ELSE 0 END) as en_mantenimiento,
    SUM(CASE WHEN estado = 'INACTIVO' THEN 1 ELSE 0 END) as inactivos
FROM herramientas;

-- Vista: Dashboard Stats
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM maquinaria) as total_maquinaria,
    (SELECT COUNT(*) FROM personal WHERE estado = 'ACTIVO') as total_personal,
    (SELECT COUNT(*) FROM herramientas) as total_herramientas,
    (SELECT COUNT(*) FROM insumos) as total_insumos,
    (SELECT COUNT(*) FROM planes_mantenimiento WHERE activo = TRUE) as total_planes,
    (SELECT COUNT(*) FROM mantenimientos WHERE estado = 'PROGRAMADO') as mantenimientos_programados,
    (SELECT COUNT(*) FROM mantenimientos WHERE estado = 'EN_PROCESO') as mantenimientos_en_proceso;

-- Vista: Costos por Mantenimiento
CREATE OR REPLACE VIEW v_costos_mantenimiento AS
SELECT 
    m.id,
    m.maquinaria_id,
    ma.nombre as maquinaria_nombre,
    m.tipo_mantenimiento,
    m.fecha_ejecucion,
    m.costo_mano_obra,
    m.costo_insumos,
    m.costo_total,
    (SELECT SUM(costo_total) FROM mantenimiento_personal WHERE mantenimiento_id = m.id) as costo_mano_obra_detalle,
    (SELECT SUM(costo_total) FROM mantenimiento_insumos WHERE mantenimiento_id = m.id) as costo_insumos_detalle
FROM mantenimientos m
LEFT JOIN maquinaria ma ON m.maquinaria_id = ma.id
WHERE m.estado = 'COMPLETADO';

-- Vista: Planes con Costos Estimados
CREATE OR REPLACE VIEW v_planes_costos AS
SELECT 
    pm.id,
    pm.nombre_plan,
    pm.tipo_mantenimiento,
    ma.nombre as maquinaria_nombre,
    COUNT(DISTINCT am.id) as total_actividades,
    SUM(am.costo_estimado) as costo_estimado_total,
    SUM(COALESCE(ai.costo_total, 0)) as costo_insumos_estimado,
    SUM(am.tiempo_promedio) as tiempo_total_minutos
FROM planes_mantenimiento pm
LEFT JOIN maquinaria ma ON pm.maquinaria_id = ma.id
LEFT JOIN actividades_mantenimiento am ON pm.id = am.plan_id
LEFT JOIN actividad_insumos ai ON am.id = ai.actividad_id
WHERE pm.activo = TRUE
GROUP BY pm.id, pm.nombre_plan, pm.tipo_mantenimiento, ma.nombre;

-- ============================================
-- TABLA: Usuarios
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    rol ENUM('ADMIN', 'OPERADOR', 'MANTENIMIENTO') DEFAULT 'OPERADOR',
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario admin por defecto (password: admin123)
-- Nota: En producción esto debe ser hasheado. Aquí se insertará vía script o manualmente si es necesario,
-- pero para el script inicial podemos dejar un placeholder o insertarlo desde el backend al iniciar si no existe.

-- ============================================
-- TABLA: Checklists
-- ============================================
CREATE TABLE IF NOT EXISTS checklists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquinaria_id INT NOT NULL,
    fecha DATE NOT NULL,
    tipo_checklist VARCHAR(50) DEFAULT 'GENERAL',
    codigo_checklist VARCHAR(50),
    realizado_por VARCHAR(100), -- Puede ser texto libre o ID de usuario
    revisado_por VARCHAR(100),
    observaciones TEXT,
    data JSON, -- Almacena todos los campos del checklist (sonda, motor, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE CASCADE,
    INDEX idx_maquinaria (maquinaria_id),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
