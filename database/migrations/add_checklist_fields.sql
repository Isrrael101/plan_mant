-- Agregar campos adicionales a checklists_maquinaria
USE mtto_db;

SET @dbname = DATABASE();
SET @tablename = 'checklists_maquinaria';

-- Función para agregar columna si no existe
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'anexo')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN anexo VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
     AND (table_schema = @dbname)
     AND (column_name = 'revision')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN revision INT DEFAULT 0"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Agregar campos quien, cuando, area para cada elemento
-- SONDA
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'sonda_botella_vibradora_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN sonda_botella_vibradora_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN sonda_botella_vibradora_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN sonda_botella_vibradora_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'sonda_flexible_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN sonda_flexible_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN sonda_flexible_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN sonda_flexible_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'sonda_cuerpo_acople_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN sonda_cuerpo_acople_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN sonda_cuerpo_acople_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN sonda_cuerpo_acople_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- UME (Unidad Motriz Eléctrica)
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'ume_partidor_proteccion_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN ume_partidor_proteccion_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_partidor_proteccion_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_partidor_proteccion_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'ume_conductor_electrodo_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN ume_conductor_electrodo_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_conductor_electrodo_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_conductor_electrodo_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'ume_enchufe_macho_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN ume_enchufe_macho_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_enchufe_macho_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_enchufe_macho_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'ume_ension_tierra_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN ume_ension_tierra_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_ension_tierra_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_ension_tierra_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'ume_fundamento_giro_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN ume_fundamento_giro_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_fundamento_giro_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN ume_fundamento_giro_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- UMC (Unidad Motriz Combustible)
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_partes_moviles_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_partes_moviles_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_partes_moviles_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_partes_moviles_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_sectores_calientes_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_sectores_calientes_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_sectores_calientes_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_sectores_calientes_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_tubo_escape_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_tubo_escape_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_tubo_escape_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_tubo_escape_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_motor_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_motor_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_motor_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_motor_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_soportes_motor_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_soportes_motor_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_soportes_motor_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_soportes_motor_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_estructura_aislada_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_estructura_aislada_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_estructura_aislada_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_estructura_aislada_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_contacto_electrico_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_contacto_electrico_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_contacto_electrico_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_contacto_electrico_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'umc_otros_quien')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN umc_otros_quien VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_otros_cuando VARCHAR(100) DEFAULT NULL, ADD COLUMN umc_otros_area VARCHAR(50) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Campos de firmas
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename) AND (table_schema = @dbname) AND (column_name = 'realizado_por_nombre')
  ) > 0,
  "SELECT 1",
  "ALTER TABLE checklists_maquinaria ADD COLUMN realizado_por_nombre VARCHAR(255) DEFAULT NULL, ADD COLUMN realizado_por_cargo VARCHAR(100) DEFAULT NULL, ADD COLUMN realizado_por_firma VARCHAR(100) DEFAULT NULL, ADD COLUMN revisado_por_nombre VARCHAR(255) DEFAULT NULL, ADD COLUMN revisado_por_cargo VARCHAR(100) DEFAULT NULL, ADD COLUMN revisado_por_firma VARCHAR(100) DEFAULT NULL"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

SELECT 'Campos agregados exitosamente' as resultado;

