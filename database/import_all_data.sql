-- ============================================
-- IMPORTAR TODOS LOS DATOS A MTTO DB
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas existentes
TRUNCATE TABLE mantenimiento_actividades;
TRUNCATE TABLE mantenimiento_insumos;
TRUNCATE TABLE mantenimiento_personal;
TRUNCATE TABLE mantenimientos;
TRUNCATE TABLE actividad_herramientas;
TRUNCATE TABLE actividad_insumos;
TRUNCATE TABLE actividades_mantenimiento;
TRUNCATE TABLE planes_mantenimiento;
TRUNCATE TABLE insumos;
TRUNCATE TABLE herramientas;
TRUNCATE TABLE personal;
TRUNCATE TABLE maquinaria;

-- Eliminar tabla de especificaciones si existe y recrearla
DROP TABLE IF EXISTS maquinaria_especificaciones;

CREATE TABLE maquinaria_especificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquinaria_id INT NOT NULL UNIQUE,
    motor_marca VARCHAR(100),
    motor_modelo VARCHAR(100),
    motor_serie VARCHAR(100),
    potencia_neta_hp DECIMAL(10,2),
    potencia_bruta_hp DECIMAL(10,2),
    numero_cilindros INT,
    calibre_mm DECIMAL(10,2),
    carrera_mm DECIMAL(10,2),
    cilindrada_l DECIMAL(10,2),
    tipo_combustible VARCHAR(50),
    longitud_total_m DECIMAL(10,2),
    ancho_total_m DECIMAL(10,2),
    altura_total_m DECIMAL(10,2),
    distancia_entre_ejes_m DECIMAL(10,2),
    tiempo_carga_s DECIMAL(10,2),
    tiempo_subida_s DECIMAL(10,2),
    tiempo_bajada_s DECIMAL(10,2),
    tiempo_total_utilizado_s DECIMAL(10,2),
    peso_total_kg DECIMAL(12,2),
    consumo_combustible_gal_hr DECIMAL(10,2),
    tanque_combustible_gal DECIMAL(10,2),
    transmision_tipo VARCHAR(100),
    traccion VARCHAR(100),
    velocidades_adelante INT,
    velocidades_atras INT,
    velocidad_max_avance_km_hr DECIMAL(10,2),
    velocidad_max_retroceso_km_hr DECIMAL(10,2),
    impulso_propulsion_m DECIMAL(10,2),
    par_torsion_kg_m DECIMAL(10,2),
    velocidad_propulsion_rpm DECIMAL(10,2),
    profundidad_excavacion_m DECIMAL(10,2),
    placa_rodaje VARCHAR(50),
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE CASCADE,
    INDEX idx_maquinaria (maquinaria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Tablas preparadas para importación' as status;

