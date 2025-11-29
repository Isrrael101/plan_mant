-- Agregar campo email a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER nombre_completo;

