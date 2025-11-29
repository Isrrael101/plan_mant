-- ============================================
-- Migration: Add Maintenance Forms Tables
-- ============================================

USE mtto_db;

-- ============================================
-- TABLA: Checklists de Maquinaria
-- ============================================
CREATE TABLE IF NOT EXISTS checklists_maquinaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquinaria_id INT NOT NULL,
    fecha DATE NOT NULL,
    tipo_checklist VARCHAR(50) DEFAULT 'GENERAL',
    codigo_checklist VARCHAR(50),
    realizado_por INT,
    revisado_por INT,
    
    -- Sección 1: SONDA
    sonda_botella_vibradora VARCHAR(20) DEFAULT 'BUENO',
    sonda_botella_vibradora_accion VARCHAR(100),
    sonda_flexible VARCHAR(20) DEFAULT 'BUENO',
    sonda_flexible_accion VARCHAR(100),
    sonda_cuerpo_acople VARCHAR(20) DEFAULT 'BUENO',
    sonda_cuerpo_acople_accion VARCHAR(100),
    
    -- Sección 2: UNIDAD MOTRIZ ELÉCTRICA
    ume_partidor_proteccion VARCHAR(20) DEFAULT 'BUENO',
    ume_partidor_proteccion_accion VARCHAR(100),
    ume_conductor_electrodo VARCHAR(20) DEFAULT 'BUENO',
    ume_conductor_electrodo_accion VARCHAR(100),
    ume_enchufe_macho VARCHAR(20) DEFAULT 'BUENO',
    ume_enchufe_macho_accion VARCHAR(100),
    ume_ension_tierra VARCHAR(20) DEFAULT 'BUENO',
    ume_ension_tierra_accion VARCHAR(100),
    ume_fundamento_giro VARCHAR(20) DEFAULT 'BUENO',
    ume_fundamento_giro_accion VARCHAR(100),
    
    -- Sección 3: UNIDAD MOTRIZ COMBUSTIBLE
    umc_partes_moviles VARCHAR(20) DEFAULT 'BUENO',
    umc_partes_moviles_accion VARCHAR(100),
    umc_sectores_calientes VARCHAR(20) DEFAULT 'BUENO',
    umc_sectores_calientes_accion VARCHAR(100),
    umc_tubo_escape VARCHAR(20) DEFAULT 'BUENO',
    umc_tubo_escape_accion VARCHAR(100),
    umc_motor VARCHAR(20) DEFAULT 'BUENO',
    umc_motor_accion VARCHAR(100),
    umc_soportes_motor VARCHAR(20) DEFAULT 'BUENO',
    umc_soportes_motor_accion VARCHAR(100),
    umc_estructura_aislada VARCHAR(20) DEFAULT 'BUENO',
    umc_estructura_aislada_accion VARCHAR(100),
    umc_contacto_electrico VARCHAR(20) DEFAULT 'BUENO',
    umc_contacto_electrico_accion VARCHAR(100),
    umc_otros VARCHAR(20) DEFAULT 'BUENO',
    umc_otros_accion VARCHAR(100),
    
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE CASCADE,
    FOREIGN KEY (realizado_por) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (revisado_por) REFERENCES personal(id) ON DELETE SET NULL,
    INDEX idx_maquinaria_fecha (maquinaria_id, fecha),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Reportes Diarios
-- ============================================
CREATE TABLE IF NOT EXISTS reportes_diarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    maquinaria_id INT NOT NULL,
    fecha DATE NOT NULL,
    codigo_maquina VARCHAR(50),
    chofer_id INT,
    
    -- Actividades con estados por día (JSON más flexible)
    -- Formato: {"actividad": "LIMPIEZA_LAVADO", "lunes": "R", "martes": "X", ...}
    limpieza_lavado_lunes VARCHAR(10),
    limpieza_lavado_martes VARCHAR(10),
    limpieza_lavado_miercoles VARCHAR(10),
    limpieza_lavado_jueves VARCHAR(10),
    limpieza_lavado_viernes VARCHAR(10),
    
    nivel_refrigerante_lunes VARCHAR(10),
    nivel_refrigerante_martes VARCHAR(10),
    nivel_refrigerante_miercoles VARCHAR(10),
    nivel_refrigerante_jueves VARCHAR(10),
    nivel_refrigerante_viernes VARCHAR(10),
    
    nivel_agua_plumas_lunes VARCHAR(10),
    nivel_agua_plumas_martes VARCHAR(10),
    nivel_agua_plumas_miercoles VARCHAR(10),
    nivel_agua_plumas_jueves VARCHAR(10),
    nivel_agua_plumas_viernes VARCHAR(10),
    
    nivel_liquido_frenos_lunes VARCHAR(10),
    nivel_liquido_frenos_martes VARCHAR(10),
    nivel_liquido_frenos_miercoles VARCHAR(10),
    nivel_liquido_frenos_jueves VARCHAR(10),
    nivel_liquido_frenos_viernes VARCHAR(10),
    
    nivel_liquido_hidraulico_lunes VARCHAR(10),
    nivel_liquido_hidraulico_martes VARCHAR(10),
    nivel_liquido_hidraulico_miercoles VARCHAR(10),
    nivel_liquido_hidraulico_jueves VARCHAR(10),
    nivel_liquido_hidraulico_viernes VARCHAR(10),
    
    nivel_electrolito_bateria_lunes VARCHAR(10),
    nivel_electrolito_bateria_martes VARCHAR(10),
    nivel_electrolito_bateria_miercoles VARCHAR(10),
    nivel_electrolito_bateria_jueves VARCHAR(10),
    nivel_electrolito_bateria_viernes VARCHAR(10),
    
    presion_neumaticos_lunes VARCHAR(10),
    presion_neumaticos_martes VARCHAR(10),
    presion_neumaticos_miercoles VARCHAR(10),
    presion_neumaticos_jueves VARCHAR(10),
    presion_neumaticos_viernes VARCHAR(10),
    
    fugas_carter_lunes VARCHAR(10),
    fugas_carter_martes VARCHAR(10),
    fugas_carter_miercoles VARCHAR(10),
    fugas_carter_jueves VARCHAR(10),
    fugas_carter_viernes VARCHAR(10),
    
    fugas_direccion_lunes VARCHAR(10),
    fugas_direccion_martes VARCHAR(10),
    fugas_direccion_miercoles VARCHAR(10),
    fugas_direccion_jueves VARCHAR(10),
    fugas_direccion_viernes VARCHAR(10),
    
    fugas_mangueras_frenos_lunes VARCHAR(10),
    fugas_mangueras_frenos_martes VARCHAR(10),
    fugas_mangueras_frenos_miercoles VARCHAR(10),
    fugas_mangueras_frenos_jueves VARCHAR(10),
    fugas_mangueras_frenos_viernes VARCHAR(10),
    
    fugas_combustible_lunes VARCHAR(10),
    fugas_combustible_martes VARCHAR(10),
    fugas_combustible_miercoles VARCHAR(10),
    fugas_combustible_jueves VARCHAR(10),
    fugas_combustible_viernes VARCHAR(10),
    
    fugas_agua_lunes VARCHAR(10),
    fugas_agua_martes VARCHAR(10),
    fugas_agua_miercoles VARCHAR(10),
    fugas_agua_jueves VARCHAR(10),
    fugas_agua_viernes VARCHAR(10),
    
    luces_interiores_lunes VARCHAR(10),
    luces_interiores_martes VARCHAR(10),
    luces_interiores_miercoles VARCHAR(10),
    luces_interiores_jueves VARCHAR(10),
    luces_interiores_viernes VARCHAR(10),
    
    luces_exteriores_lunes VARCHAR(10),
    luces_exteriores_martes VARCHAR(10),
    luces_exteriores_miercoles VARCHAR(10),
    luces_exteriores_jueves VARCHAR(10),
    luces_exteriores_viernes VARCHAR(10),
    
    estabilidad_motor_lunes VARCHAR(10),
    estabilidad_motor_martes VARCHAR(10),
    estabilidad_motor_miercoles VARCHAR(10),
    estabilidad_motor_jueves VARCHAR(10),
    estabilidad_motor_viernes VARCHAR(10),
    
    temperatura_motor_lunes VARCHAR(10),
    temperatura_motor_martes VARCHAR(10),
    temperatura_motor_miercoles VARCHAR(10),
    temperatura_motor_jueves VARCHAR(10),
    temperatura_motor_viernes VARCHAR(10),
    
    sonidos_raros_lunes VARCHAR(10),
    sonidos_raros_martes VARCHAR(10),
    sonidos_raros_miercoles VARCHAR(10),
    sonidos_raros_jueves VARCHAR(10),
    sonidos_raros_viernes VARCHAR(10),
    
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE CASCADE,
    FOREIGN KEY (chofer_id) REFERENCES personal(id) ON DELETE SET NULL,
    UNIQUE KEY unique_daily_report (maquinaria_id, fecha),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Historial de Mantenimiento (ya existe como 'mantenimientos')
-- Agregar campos adicionales si es necesario
-- ============================================

-- Verificar y agregar columnas si no existen
SET @dbname = DATABASE();
SET @tablename = 'mantenimientos';

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'numero_ot')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN numero_ot VARCHAR(50) COMMENT 'Número de Orden de Trabajo'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'horometro')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN horometro DECIMAL(10, 2) COMMENT 'Lectura del horómetro'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'problema')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN problema TEXT COMMENT 'Descripción del problema'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'solucion')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN solucion TEXT COMMENT 'Solución aplicada'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'repuestos_empleados')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN repuestos_empleados TEXT COMMENT 'Repuestos utilizados'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'mecanicos_asignados')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN mecanicos_asignados TEXT COMMENT 'Mecánicos que trabajaron'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'tiempo_total')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE mantenimientos ADD COLUMN tiempo_total VARCHAR(20) COMMENT 'Tiempo total de trabajo'"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

COMMIT;
