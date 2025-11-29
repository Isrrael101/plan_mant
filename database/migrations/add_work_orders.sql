-- ============================================
-- Migration: Add Work Orders System
-- ============================================

USE mtto_db;

-- ============================================
-- TABLA: Órdenes de Trabajo
-- ============================================
CREATE TABLE IF NOT EXISTS ordenes_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ot VARCHAR(50) UNIQUE NOT NULL,
    fecha_solicitud DATE NOT NULL,
    maquinaria_id INT,
    solicitante_id INT COMMENT 'Personal que solicita',
    numero_referencia VARCHAR(50) COMMENT 'Número de referencia interno',
    anexo VARCHAR(255) COMMENT 'Documentos adjuntos',
    horometro DECIMAL(10, 2) COMMENT 'Lectura del horómetro',
    
    -- Descripción del trabajo
    descripcion_trabajo TEXT NOT NULL,
    prioridad ENUM('ALTA', 'MEDIA', 'BAJA') DEFAULT 'MEDIA',
    tipo_trabajo ENUM('PREVENTIVO', 'CORRECTIVO', 'PROACTIVO') DEFAULT 'CORRECTIVO',
    
    -- Evaluación
    valor_materiales DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Costo estimado de materiales',
    cargo_a VARCHAR(255) COMMENT 'Centro de costo',
    responsable_id INT COMMENT 'Responsable de los trabajos',
    
    -- Fechas y tiempo
    fecha_inicio DATE,
    fecha_termino DATE,
    porcentaje_taller INT DEFAULT 10 COMMENT 'Porcentaje de trabajo en taller',
    
    -- Estado y workflow
    estado ENUM('SOLICITADA', 'APROBADA', 'EN_PROCESO', 'COMPLETADA', 'CANCELADA') DEFAULT 'SOLICITADA',
    
    -- Firmas y aprobaciones
    jefe_admin_id INT COMMENT 'Jefe Unidad de Administración',
    jefe_admin_firma VARCHAR(255),
    jefe_admin_fecha DATE,
    
    mantenimiento_id INT COMMENT 'Jefe de Mantenimiento',
    mantenimiento_firma VARCHAR(255),
    mantenimiento_fecha DATE,
    
    director_id INT COMMENT 'Director Departamento o Investigador',
    director_firma VARCHAR(255),
    director_fecha DATE,
    
    fecha_recepcion DATE COMMENT 'Fecha de recepción de los trabajos',
    
    observaciones TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE SET NULL,
    FOREIGN KEY (solicitante_id) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (responsable_id) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (jefe_admin_id) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (mantenimiento_id) REFERENCES personal(id) ON DELETE SET NULL,
    FOREIGN KEY (director_id) REFERENCES personal(id) ON DELETE SET NULL,
    
    INDEX idx_numero_ot (numero_ot),
    INDEX idx_fecha_solicitud (fecha_solicitud),
    INDEX idx_estado (estado),
    INDEX idx_maquinaria (maquinaria_id),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA: Mecánicos Asignados a OT
-- ============================================
CREATE TABLE IF NOT EXISTS ot_mecanicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ot_id INT NOT NULL,
    mecanico_id INT NOT NULL,
    horas_trabajadas DECIMAL(5, 2) DEFAULT 0.00,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ot_id) REFERENCES ordenes_trabajo(id) ON DELETE CASCADE,
    FOREIGN KEY (mecanico_id) REFERENCES personal(id) ON DELETE CASCADE,
    
    INDEX idx_ot (ot_id),
    INDEX idx_mecanico (mecanico_id),
    UNIQUE KEY unique_ot_mecanico (ot_id, mecanico_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


COMMIT;

