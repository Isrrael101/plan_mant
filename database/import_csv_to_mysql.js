// -*- coding: utf-8 -*-
/**
 * Script para importar todos los CSV a MySQL
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'mtto_user',
    password: process.env.MYSQL_PASSWORD || 'mtto_password',
    database: process.env.MYSQL_DATABASE || 'mtto_db',
    charset: 'utf8mb4'
};

async function importCSV(pool, tableName, csvFile, columns) {
    const filePath = path.join(DATA_DIR, csvFile);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${csvFile}`);
        return 0;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    });
    
    if (records.length === 0) {
        console.log(`⚠️  Sin datos en: ${csvFile}`);
        return 0;
    }
    
    // Construir INSERT
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    let inserted = 0;
    for (const record of records) {
        try {
            const values = columns.map(col => {
                const val = record[col];
                if (val === '' || val === undefined || val === null || val === 'NaN') {
                    return null;
                }
                return val;
            });
            
            await pool.query(query, values);
            inserted++;
        } catch (error) {
            // Ignorar duplicados
            if (!error.message.includes('Duplicate')) {
                console.error(`Error insertando en ${tableName}:`, error.message);
            }
        }
    }
    
    console.log(`✓ ${tableName}: ${inserted} registros importados`);
    return inserted;
}

async function main() {
    console.log('='.repeat(50));
    console.log('IMPORTADOR DE DATOS CSV A MYSQL');
    console.log('='.repeat(50));
    console.log();
    
    let pool;
    try {
        pool = mysql.createPool(dbConfig);
        console.log('✓ Conectado a MySQL');
        
        // Desactivar foreign keys temporalmente
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        
        // Limpiar tablas
        console.log('\nLimpiando tablas...');
        const tables = [
            'mantenimiento_actividades', 'mantenimiento_insumos', 'mantenimiento_personal',
            'mantenimientos', 'actividad_herramientas', 'actividad_insumos',
            'actividades_mantenimiento', 'planes_mantenimiento', 'maquinaria_especificaciones',
            'insumos', 'herramientas', 'personal', 'maquinaria'
        ];
        
        for (const table of tables) {
            try {
                await pool.query(`DELETE FROM ${table}`);
                await pool.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
            } catch (e) {
                // Ignorar errores de tablas que no existen
            }
        }
        
        // Crear tabla de especificaciones si no existe
        await pool.query(`
            CREATE TABLE IF NOT EXISTS maquinaria_especificaciones (
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
                FOREIGN KEY (maquinaria_id) REFERENCES maquinaria(id) ON DELETE CASCADE
            )
        `);
        
        // Importar datos
        console.log('\nImportando datos...');
        
        await importCSV(pool, 'maquinaria', '01_maquinaria.csv',
            ['id', 'codigo', 'nombre', 'marca', 'modelo', 'anio', 'estado', 'costo_adquisicion', 'horas_totales']);
        
        await importCSV(pool, 'personal', '02_personal.csv',
            ['id', 'codigo', 'nombre_completo', 'ci', 'cargo', 'telefono', 'celular', 'tarifa_hora', 'estado']);
        
        await importCSV(pool, 'herramientas', '03_herramientas.csv',
            ['id', 'codigo', 'nombre', 'marca', 'estado', 'categoria', 'costo']);
        
        await importCSV(pool, 'insumos', '04_insumos.csv',
            ['id', 'codigo', 'nombre', 'unidad', 'precio_unitario', 'cantidad', 'stock_minimo', 'categoria']);
        
        await importCSV(pool, 'planes_mantenimiento', '05_planes_mantenimiento.csv',
            ['id', 'maquinaria_id', 'nombre_plan', 'tipo_mantenimiento', 'tipo_plan', 'horas_operacion', 'intervalo_dias', 'descripcion', 'activo']);
        
        await importCSV(pool, 'actividades_mantenimiento', '06_actividades_mantenimiento.csv',
            ['id', 'plan_id', 'numero_orden', 'descripcion_componente', 'actividad', 'tiempo_min', 'tiempo_promedio', 'tiempo_max', 'costo_estimado']);
        
        await importCSV(pool, 'actividad_insumos', '07_actividad_insumos.csv',
            ['id', 'actividad_id', 'insumo_id', 'cantidad', 'unidad', 'especificaciones', 'costo_unitario']);
        
        await importCSV(pool, 'actividad_herramientas', '08_actividad_herramientas.csv',
            ['id', 'actividad_id', 'herramienta_id', 'cantidad', 'especificaciones']);
        
        await importCSV(pool, 'mantenimientos', '09_mantenimientos.csv',
            ['id', 'maquinaria_id', 'plan_id', 'tipo_mantenimiento', 'fecha_programada', 'fecha_ejecucion', 'horas_maquina', 'estado', 'observaciones', 'costo_mano_obra', 'costo_insumos']);
        
        await importCSV(pool, 'mantenimiento_personal', '10_mantenimiento_personal.csv',
            ['id', 'mantenimiento_id', 'personal_id', 'horas_trabajadas', 'tarifa_aplicada']);
        
        await importCSV(pool, 'mantenimiento_insumos', '11_mantenimiento_insumos.csv',
            ['id', 'mantenimiento_id', 'insumo_id', 'cantidad_usada', 'unidad', 'precio_unitario']);
        
        await importCSV(pool, 'mantenimiento_actividades', '12_mantenimiento_actividades.csv',
            ['id', 'mantenimiento_id', 'actividad_id', 'descripcion', 'tiempo_real', 'completada', 'observaciones']);
        
        // Generar especificaciones técnicas
        console.log('\nGenerando especificaciones técnicas...');
        await pool.query(`
            INSERT INTO maquinaria_especificaciones (
                maquinaria_id, motor_marca, motor_modelo, motor_serie,
                potencia_neta_hp, potencia_bruta_hp, numero_cilindros,
                calibre_mm, carrera_mm, cilindrada_l, tipo_combustible,
                longitud_total_m, ancho_total_m, altura_total_m,
                peso_total_kg, consumo_combustible_gal_hr, tanque_combustible_gal,
                transmision_tipo, traccion, velocidades_adelante, velocidades_atras,
                velocidad_max_avance_km_hr, velocidad_max_retroceso_km_hr,
                impulso_propulsion_m, par_torsion_kg_m, velocidad_propulsion_rpm,
                profundidad_excavacion_m
            )
            SELECT 
                m.id, m.marca, CONCAT(m.modelo, '-M'), CONCAT('SN-', LPAD(m.id * 1000, 6, '0')),
                ROUND(200 + RAND() * 800, 0), ROUND(250 + RAND() * 900, 0),
                FLOOR(4 + RAND() * 8),
                ROUND(100 + RAND() * 50, 1), ROUND(120 + RAND() * 40, 1),
                ROUND(8 + RAND() * 12, 1), 'DIESEL',
                ROUND(8 + RAND() * 8, 1), ROUND(2.5 + RAND() * 2, 1), ROUND(3 + RAND() * 2, 1),
                ROUND(15000 + RAND() * 35000, 0),
                ROUND(10 + RAND() * 30, 1), ROUND(100 + RAND() * 400, 0),
                ELT(FLOOR(1 + RAND() * 3), 'POWERSHIFT', 'HIDROSTÁTICA', 'MECÁNICA'),
                ELT(FLOOR(1 + RAND() * 2), '4x4', 'ORUGAS'),
                FLOOR(4 + RAND() * 6), FLOOR(2 + RAND() * 4),
                ROUND(30 + RAND() * 50, 0), ROUND(20 + RAND() * 30, 0),
                ROUND(5 + RAND() * 10, 1), ROUND(800 + RAND() * 1500, 0),
                ROUND(150 + RAND() * 150, 0), ROUND(3 + RAND() * 7, 1)
            FROM maquinaria m
        `);
        
        const [specs] = await pool.query('SELECT COUNT(*) as count FROM maquinaria_especificaciones');
        console.log(`✓ maquinaria_especificaciones: ${specs[0].count} registros generados`);
        
        // Reactivar foreign keys
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        
        // Mostrar estadísticas
        console.log('\n' + '='.repeat(50));
        console.log('RESUMEN DE IMPORTACIÓN');
        console.log('='.repeat(50));
        
        const stats = [
            'maquinaria', 'personal', 'herramientas', 'insumos',
            'planes_mantenimiento', 'actividades_mantenimiento',
            'actividad_insumos', 'actividad_herramientas',
            'mantenimientos', 'mantenimiento_personal',
            'mantenimiento_insumos', 'mantenimiento_actividades',
            'maquinaria_especificaciones'
        ];
        
        for (const table of stats) {
            try {
                const [rows] = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`${table}: ${rows[0].count} registros`);
            } catch (e) {
                console.log(`${table}: Error`);
            }
        }
        
        console.log('\n¡IMPORTACIÓN COMPLETADA!');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (pool) {
            await pool.end();
        }
    }
}

main();

