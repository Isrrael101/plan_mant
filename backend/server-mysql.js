// -*- coding: utf-8 -*-
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from './services/emailService.js';
import { generateSecret, generateQRCode, verifyToken } from './services/twoFactorService.js';
import {
    getChecklistsByMachinery,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getDailyReportsByMachinery,
    getDailyReport,
    upsertDailyReport,
    updateDailyReport,
    deleteDailyReport,
    getMachineryHistory
} from './routes/forms.js';
import {
    getWorkOrders,
    getWorkOrder,
    createWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    assignMechanics,
    updateWorkOrderStatus
} from './routes/workOrders.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_123';

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de MySQL con UTF-8 completo
const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'mtto_user',
    password: process.env.MYSQL_PASSWORD || 'mtto_password',
    database: process.env.MYSQL_DATABASE || 'mtto_db',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    waitForConnections: true,
    connectionLimit: 20, // Aumentado de 10 a 20 para mejor concurrencia
    queueLimit: 0,
    connectTimeout: 10000, // 10 segundos timeout para conexiones
    acquireTimeout: 10000,  // 10 segundos timeout para adquirir conexiones del pool
    // Asegurar UTF-8 en todas las consultas
    typeCast: function (field, next) {
        if (field.type === 'VAR_STRING' || field.type === 'STRING') {
            return field.string();
        }
        return next();
    }
};

// Pool de conexiones
let pool;

async function initDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        
        // Asegurar UTF-8 en todas las conexiones
        pool.on('connection', (connection) => {
            connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
            connection.query('SET CHARACTER SET utf8mb4');
            connection.query('SET character_set_connection=utf8mb4');
            connection.query('SET character_set_client=utf8mb4');
            connection.query('SET character_set_results=utf8mb4');
        });
        
        const connection = await pool.getConnection();
        // Ejecutar SET NAMES en la conexión inicial
        await connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
        await connection.query('SET CHARACTER SET utf8mb4');
        await connection.query('SET character_set_connection=utf8mb4');
        await connection.query('SET character_set_client=utf8mb4');
        await connection.query('SET character_set_results=utf8mb4');
        console.log('✓ Conectado a MySQL con UTF-8 (utf8mb4)');
        connection.release();
    } catch (error) {
        console.error('✗ Error conectando a MySQL:', error.message);
        process.exit(1);
    }
}

// Middleware
app.use(cors());

// Configurar UTF-8 para todas las respuestas
app.use((req, res, next) => {
    // Establecer charset UTF-8 para todas las respuestas
    const originalSend = res.send;
    res.send = function(data) {
        if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
        } else {
            const contentType = res.getHeader('Content-Type');
            if (typeof contentType === 'string' && !contentType.includes('charset')) {
                res.setHeader('Content-Type', `${contentType}; charset=utf-8`);
            }
        }
        return originalSend.call(this, data);
    };
    next();
});

app.use(express.json({ 
    charset: 'utf-8',
    type: 'application/json'
}));
app.use(express.urlencoded({ 
    extended: true, 
    charset: 'utf-8',
    type: 'application/x-www-form-urlencoded'
}));

// Middleware de Autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ============================================
// RUTAS - HEALTH CHECK
// ============================================
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'OK', message: 'Backend is running', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Database connection failed' });
    }
});

// ============================================
// RUTAS - ESTADÍSTICAS
// ============================================
app.get('/api/stats', async (req, res) => {
    try {
        // Calcular estadísticas directamente para asegurar valores correctos
        const [maquinaria] = await pool.query('SELECT COUNT(*) as total FROM maquinaria');
        const [personal] = await pool.query('SELECT COUNT(*) as total FROM personal');
        const [herramientas] = await pool.query('SELECT COUNT(*) as total FROM herramientas');
        const [insumos] = await pool.query('SELECT COUNT(*) as total FROM insumos');
        const [planes] = await pool.query('SELECT COUNT(*) as total FROM planes_mantenimiento WHERE activo = true');
        const [programados] = await pool.query("SELECT COUNT(*) as total FROM mantenimientos WHERE estado = 'PROGRAMADO'");
        const [enProceso] = await pool.query("SELECT COUNT(*) as total FROM mantenimientos WHERE estado = 'EN_PROCESO'");
        
        res.json({
            success: true,
            totalSheets: planes[0]?.total || 0,
            totalMachinery: maquinaria[0]?.total || 0,
            totalPersonnel: personal[0]?.total || 0,
            totalTools: herramientas[0]?.total || 0,
            totalSupplies: insumos[0]?.total || 0,
            mantenimientosProgramados: programados[0]?.total || 0,
            mantenimientosEnProceso: enProceso[0]?.total || 0
        });
    } catch (error) {
        console.error('Error in /api/stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - MAQUINARIA
// ============================================
app.get('/api/machinery', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales FROM maquinaria ORDER BY id'
        );

        // Devolver los datos con nombres de columnas correctos
        const data = rows.map(row => ({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            marca: row.marca,
            modelo: row.modelo,
            anio: row.anio,
            estado: row.estado,
            costo_adquisicion: row.costo_adquisicion || 0,
            horas_totales: row.horas_totales || 0
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/machinery/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM maquinaria WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Maquinaria no encontrada' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - ESPECIFICACIONES TÉCNICAS DE MAQUINARIA
// ============================================
// Especificaciones - Ruta en español (alias)
app.get('/api/maquinaria/:id/specs', async (req, res) => {
    try {
        // Verificar si la tabla existe
        const [tableCheck] = await pool.query(
            `SELECT COUNT(*) as count FROM information_schema.tables 
             WHERE table_schema = DATABASE() AND table_name = 'maquinaria_especificaciones'`
        );

        if (tableCheck[0].count === 0) {
            // Si la tabla no existe, retornar solo datos básicos de la maquinaria
            const [maq] = await pool.query('SELECT * FROM maquinaria WHERE id = ?', [req.params.id]);
            if (maq.length === 0) {
                return res.status(404).json({ success: false, error: 'Maquinaria no encontrada' });
            }
            return res.json({ success: true, data: { ...maq[0], specs: null } });
        }

        const [rows] = await pool.query(
            `SELECT me.*, m.codigo, m.nombre, m.marca, m.modelo, m.anio, m.estado
             FROM maquinaria_especificaciones me
             JOIN maquinaria m ON me.maquinaria_id = m.id
             WHERE me.maquinaria_id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            // Si no existe registro, obtener datos básicos de la maquinaria
            const [maq] = await pool.query('SELECT * FROM maquinaria WHERE id = ?', [req.params.id]);
            if (maq.length === 0) {
                return res.status(404).json({ success: false, error: 'Maquinaria no encontrada' });
            }
            return res.json({ success: true, data: { ...maq[0], specs: null } });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error getting specs:', error);
        // Si hay error, intentar al menos retornar datos básicos
        try {
            const [maq] = await pool.query('SELECT * FROM maquinaria WHERE id = ?', [req.params.id]);
            if (maq.length > 0) {
                return res.json({ success: true, data: { ...maq[0], specs: null } });
            }
        } catch (e) {
            // Ignorar error secundario
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/machinery/:id/specs', async (req, res) => {
    try {
        // Verificar si la tabla existe
        const [tableCheck] = await pool.query(
            `SELECT COUNT(*) as count FROM information_schema.tables 
             WHERE table_schema = DATABASE() AND table_name = 'maquinaria_especificaciones'`
        );

        if (tableCheck[0].count === 0) {
            // Si la tabla no existe, retornar solo datos básicos de la maquinaria
            const [maq] = await pool.query('SELECT * FROM maquinaria WHERE id = ?', [req.params.id]);
            if (maq.length === 0) {
                return res.status(404).json({ success: false, error: 'Maquinaria no encontrada' });
            }
            return res.json({ success: true, data: { ...maq[0], specs: null } });
        }

        const [rows] = await pool.query(
            `SELECT me.*, m.codigo, m.nombre, m.marca, m.modelo, m.anio, m.estado
             FROM maquinaria_especificaciones me
             JOIN maquinaria m ON me.maquinaria_id = m.id
             WHERE me.maquinaria_id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            // Si no existe registro, obtener datos básicos de la maquinaria
            const [maq] = await pool.query('SELECT * FROM maquinaria WHERE id = ?', [req.params.id]);
            if (maq.length === 0) {
                return res.status(404).json({ success: false, error: 'Maquinaria no encontrada' });
            }
            return res.json({ success: true, data: { ...maq[0], specs: null } });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error getting specs:', error);
        // Si hay error, intentar al menos retornar datos básicos
        try {
            const [maq] = await pool.query('SELECT * FROM maquinaria WHERE id = ?', [req.params.id]);
            if (maq.length > 0) {
                return res.json({ success: true, data: { ...maq[0], specs: null } });
            }
        } catch (e) {
            // Ignorar error secundario
        }
        res.status(500).json({ success: false, error: error.message });
    }
});

// Especificaciones POST - Ruta en español (alias)
app.post('/api/maquinaria/:id/specs', async (req, res) => {
    try {
        const maquinaria_id = req.params.id;
        const data = req.body;

        // Verificar si la tabla existe
        const [tableCheck] = await pool.query(
            `SELECT COUNT(*) as count FROM information_schema.tables 
             WHERE table_schema = DATABASE() AND table_name = 'maquinaria_especificaciones'`
        );

        if (tableCheck[0].count === 0) {
            return res.status(400).json({ success: false, error: 'La tabla de especificaciones no existe' });
        }

        // Verificar si ya existe un registro
        const [existing] = await pool.query(
            'SELECT id FROM maquinaria_especificaciones WHERE maquinaria_id = ?',
            [maquinaria_id]
        );

        if (existing.length > 0) {
            // Actualizar registro existente
            await pool.query(
                `UPDATE maquinaria_especificaciones 
                 SET motor=?, transmision=?, sistema_hidraulico=?, sistema_electrico=?, 
                     sistema_frenos=?, sistema_direccion=?, sistema_suspension=?, 
                     neumaticos=?, capacidad_carga=?, dimensiones=?, peso=?, 
                     velocidad_maxima=?, consumo_combustible=?, otros=?
                 WHERE maquinaria_id=?`,
                [
                    data.motor || null, data.transmision || null, data.sistema_hidraulico || null,
                    data.sistema_electrico || null, data.sistema_frenos || null, data.sistema_direccion || null,
                    data.sistema_suspension || null, data.neumaticos || null, data.capacidad_carga || null,
                    data.dimensiones || null, data.peso || null, data.velocidad_maxima || null,
                    data.consumo_combustible || null, data.otros || null, maquinaria_id
                ]
            );
            res.json({ success: true, message: 'Especificaciones actualizadas' });
        } else {
            // Crear nuevo registro
            await pool.query(
                `INSERT INTO maquinaria_especificaciones 
                 (maquinaria_id, motor, transmision, sistema_hidraulico, sistema_electrico, 
                  sistema_frenos, sistema_direccion, sistema_suspension, neumaticos, 
                  capacidad_carga, dimensiones, peso, velocidad_maxima, consumo_combustible, otros) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    maquinaria_id, data.motor || null, data.transmision || null, data.sistema_hidraulico || null,
                    data.sistema_electrico || null, data.sistema_frenos || null, data.sistema_direccion || null,
                    data.sistema_suspension || null, data.neumaticos || null, data.capacidad_carga || null,
                    data.dimensiones || null, data.peso || null, data.velocidad_maxima || null,
                    data.consumo_combustible || null, data.otros || null
                ]
            );
            res.json({ success: true, message: 'Especificaciones creadas' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/machinery/:id/specs', async (req, res) => {
    try {
        const maquinaria_id = req.params.id;
        const data = req.body;

        // Verificar si ya existe
        const [existing] = await pool.query(
            'SELECT id FROM maquinaria_especificaciones WHERE maquinaria_id = ?',
            [maquinaria_id]
        );

        if (existing.length > 0) {
            // Actualizar
            await pool.query(`
                UPDATE maquinaria_especificaciones SET
                    motor_marca = ?, motor_modelo = ?, motor_serie = ?,
                    potencia_neta_hp = ?, potencia_bruta_hp = ?, numero_cilindros = ?,
                    calibre_mm = ?, carrera_mm = ?, cilindrada_l = ?, tipo_combustible = ?,
                    longitud_total_m = ?, ancho_total_m = ?, altura_total_m = ?,
                    distancia_entre_ejes_m = ?, tiempo_carga_s = ?, tiempo_subida_s = ?,
                    tiempo_bajada_s = ?, tiempo_total_utilizado_s = ?, peso_total_kg = ?,
                    consumo_combustible_gal_hr = ?, tanque_combustible_gal = ?,
                    transmision_tipo = ?, traccion = ?, velocidades_adelante = ?,
                    velocidades_atras = ?, velocidad_max_avance_km_hr = ?,
                    velocidad_max_retroceso_km_hr = ?, impulso_propulsion_m = ?,
                    par_torsion_kg_m = ?, velocidad_propulsion_rpm = ?,
                    profundidad_excavacion_m = ?, placa_rodaje = ?, observaciones = ?
                WHERE maquinaria_id = ?
            `, [
                data.motor_marca, data.motor_modelo, data.motor_serie,
                data.potencia_neta_hp, data.potencia_bruta_hp, data.numero_cilindros,
                data.calibre_mm, data.carrera_mm, data.cilindrada_l, data.tipo_combustible,
                data.longitud_total_m, data.ancho_total_m, data.altura_total_m,
                data.distancia_entre_ejes_m, data.tiempo_carga_s, data.tiempo_subida_s,
                data.tiempo_bajada_s, data.tiempo_total_utilizado_s, data.peso_total_kg,
                data.consumo_combustible_gal_hr, data.tanque_combustible_gal,
                data.transmision_tipo, data.traccion, data.velocidades_adelante,
                data.velocidades_atras, data.velocidad_max_avance_km_hr,
                data.velocidad_max_retroceso_km_hr, data.impulso_propulsion_m,
                data.par_torsion_kg_m, data.velocidad_propulsion_rpm,
                data.profundidad_excavacion_m, data.placa_rodaje, data.observaciones,
                maquinaria_id
            ]);
            res.json({ success: true, message: 'Especificaciones actualizadas' });
        } else {
            // Crear nuevo
            await pool.query(`
                INSERT INTO maquinaria_especificaciones (
                    maquinaria_id, motor_marca, motor_modelo, motor_serie,
                    potencia_neta_hp, potencia_bruta_hp, numero_cilindros,
                    calibre_mm, carrera_mm, cilindrada_l, tipo_combustible,
                    longitud_total_m, ancho_total_m, altura_total_m,
                    distancia_entre_ejes_m, tiempo_carga_s, tiempo_subida_s,
                    tiempo_bajada_s, tiempo_total_utilizado_s, peso_total_kg,
                    consumo_combustible_gal_hr, tanque_combustible_gal,
                    transmision_tipo, traccion, velocidades_adelante,
                    velocidades_atras, velocidad_max_avance_km_hr,
                    velocidad_max_retroceso_km_hr, impulso_propulsion_m,
                    par_torsion_kg_m, velocidad_propulsion_rpm,
                    profundidad_excavacion_m, placa_rodaje, observaciones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                maquinaria_id, data.motor_marca, data.motor_modelo, data.motor_serie,
                data.potencia_neta_hp, data.potencia_bruta_hp, data.numero_cilindros,
                data.calibre_mm, data.carrera_mm, data.cilindrada_l, data.tipo_combustible,
                data.longitud_total_m, data.ancho_total_m, data.altura_total_m,
                data.distancia_entre_ejes_m, data.tiempo_carga_s, data.tiempo_subida_s,
                data.tiempo_bajada_s, data.tiempo_total_utilizado_s, data.peso_total_kg,
                data.consumo_combustible_gal_hr, data.tanque_combustible_gal,
                data.transmision_tipo, data.traccion, data.velocidades_adelante,
                data.velocidades_atras, data.velocidad_max_avance_km_hr,
                data.velocidad_max_retroceso_km_hr, data.impulso_propulsion_m,
                data.par_torsion_kg_m, data.velocidad_propulsion_rpm,
                data.profundidad_excavacion_m, data.placa_rodaje, data.observaciones
            ]);
            res.json({ success: true, message: 'Especificaciones creadas' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/machinery', async (req, res) => {
    try {
        const { codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales } = req.body;

        // Validar que costo_adquisicion sea mayor a 0
        const costo = parseFloat(costo_adquisicion || req.body[7] || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo de adquisición debe ser mayor a cero' });
        }

        const horas = parseFloat(horas_totales || req.body[8] || 0);
        if (isNaN(horas) || horas < 0) {
            return res.status(400).json({ success: false, error: 'Las horas totales deben ser un número válido' });
        }

        const [result] = await pool.query(
            'INSERT INTO maquinaria (codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [codigo || req.body[2], nombre || req.body[3], marca || req.body[4], modelo || req.body[5], anio || req.body[6], estado || req.body[7] || 'OPERATIVO', costo, horas]
        );
        res.json({ success: true, message: 'Equipo creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/machinery/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales } = req.body;

        // Validar que costo_adquisicion sea mayor a 0
        const costo = parseFloat(costo_adquisicion || req.body[7] || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo de adquisición debe ser mayor a cero' });
        }

        const horas = parseFloat(horas_totales || req.body[8] || 0);
        if (isNaN(horas) || horas < 0) {
            return res.status(400).json({ success: false, error: 'Las horas totales deben ser un número válido' });
        }

        await pool.query(
            'UPDATE maquinaria SET codigo=?, nombre=?, marca=?, modelo=?, anio=?, estado=?, costo_adquisicion=?, horas_totales=? WHERE id=?',
            [codigo || req.body[2], nombre || req.body[3], marca || req.body[4], modelo || req.body[5], anio || req.body[6], estado || req.body[7], costo, horas, id]
        );
        res.json({ success: true, message: 'Equipo actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/machinery/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM maquinaria WHERE id=?', [id]);
        res.json({ success: true, message: 'Equipo eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS EN ESPAÑOL - MAQUINARIA
// ============================================
app.get('/api/maquinaria', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales FROM maquinaria ORDER BY id'
        );

        const data = rows.map(row => ({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            marca: row.marca,
            modelo: row.modelo,
            anio: row.anio,
            estado: row.estado,
            costo_adquisicion: row.costo_adquisicion || 0,
            horas_totales: row.horas_totales || 0
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/maquinaria/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM maquinaria WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Maquinaria no encontrada' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/maquinaria', async (req, res) => {
    try {
        const { codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales } = req.body;

        const costo = parseFloat(costo_adquisicion || req.body[7] || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo de adquisición debe ser mayor a cero' });
        }

        const horas = parseFloat(horas_totales || req.body[8] || 0);
        if (isNaN(horas) || horas < 0) {
            return res.status(400).json({ success: false, error: 'Las horas totales deben ser un número válido' });
        }

        const [result] = await pool.query(
            'INSERT INTO maquinaria (codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [codigo || req.body[2], nombre || req.body[3], marca || req.body[4], modelo || req.body[5], anio || req.body[6], estado || req.body[7] || 'OPERATIVO', costo, horas]
        );
        res.json({ success: true, message: 'Equipo creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/maquinaria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo, nombre, marca, modelo, anio, estado, costo_adquisicion, horas_totales } = req.body;

        const costo = parseFloat(costo_adquisicion || req.body[7] || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo de adquisición debe ser mayor a cero' });
        }

        const horas = parseFloat(horas_totales || req.body[8] || 0);
        if (isNaN(horas) || horas < 0) {
            return res.status(400).json({ success: false, error: 'Las horas totales deben ser un número válido' });
        }

        await pool.query(
            'UPDATE maquinaria SET codigo=?, nombre=?, marca=?, modelo=?, anio=?, estado=?, costo_adquisicion=?, horas_totales=? WHERE id=?',
            [codigo || req.body[2], nombre || req.body[3], marca || req.body[4], modelo || req.body[5], anio || req.body[6], estado || req.body[7], costo, horas, id]
        );
        res.json({ success: true, message: 'Equipo actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/maquinaria/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM maquinaria WHERE id=?', [id]);
        res.json({ success: true, message: 'Equipo eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - PERSONAL
// ============================================
app.get('/api/personnel', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado FROM personal ORDER BY id'
        );

        const data = rows.map((row, index) => ({
            id: row.id,
            codigo: row.codigo,
            nombre_completo: row.nombre_completo,
            ci: row.ci,
            cargo: row.cargo,
            telefono: row.telefono,
            celular: row.celular,
            tarifa_hora: row.tarifa_hora || 0,
            estado: row.estado
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/personnel', async (req, res) => {
    try {
        const data = req.body;

        // Validar que tarifa_hora sea mayor a 0
        const tarifa = parseFloat(data.tarifa_hora || 0);
        if (isNaN(tarifa) || tarifa <= 0) {
            return res.status(400).json({ success: false, error: 'La tarifa por hora debe ser mayor a cero' });
        }

        const [result] = await pool.query(
            'INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.codigo || data[1], data.nombre_completo || data.nombre || data[2], data.ci || data[3], data.cargo || data[4], data.telefono || data[5], data.celular || data[6], tarifa]
        );
        res.json({ success: true, message: 'Empleado creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/personnel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Validar que tarifa_hora sea mayor a 0
        const tarifa = parseFloat(data.tarifa_hora || 0);
        if (isNaN(tarifa) || tarifa <= 0) {
            return res.status(400).json({ success: false, error: 'La tarifa por hora debe ser mayor a cero' });
        }

        await pool.query(
            'UPDATE personal SET codigo=?, nombre_completo=?, ci=?, cargo=?, telefono=?, celular=?, tarifa_hora=? WHERE id=?',
            [data.codigo || data[1], data.nombre_completo || data.nombre || data[2], data.ci || data[3], data.cargo || data[4], data.telefono || data[5], data.celular || data[6], tarifa, id]
        );
        res.json({ success: true, message: 'Empleado actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/personnel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM personal WHERE id=?', [id]);
        res.json({ success: true, message: 'Empleado eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS EN ESPAÑOL - PERSONAL
// ============================================
app.get('/api/personal', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora, estado FROM personal ORDER BY id'
        );

        const data = rows.map((row, index) => ({
            id: row.id,
            codigo: row.codigo,
            nombre_completo: row.nombre_completo,
            ci: row.ci,
            cargo: row.cargo,
            telefono: row.telefono,
            celular: row.celular,
            tarifa_hora: row.tarifa_hora || 0,
            estado: row.estado
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/personal', async (req, res) => {
    try {
        const data = req.body;

        const tarifa = parseFloat(data.tarifa_hora || 0);
        if (isNaN(tarifa) || tarifa <= 0) {
            return res.status(400).json({ success: false, error: 'La tarifa por hora debe ser mayor a cero' });
        }

        const [result] = await pool.query(
            'INSERT INTO personal (codigo, nombre_completo, ci, cargo, telefono, celular, tarifa_hora) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.codigo || data[1], data.nombre_completo || data.nombre || data[2], data.ci || data[3], data.cargo || data[4], data.telefono || data[5], data.celular || data[6], tarifa]
        );
        res.json({ success: true, message: 'Empleado creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/personal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const tarifa = parseFloat(data.tarifa_hora || 0);
        if (isNaN(tarifa) || tarifa <= 0) {
            return res.status(400).json({ success: false, error: 'La tarifa por hora debe ser mayor a cero' });
        }

        await pool.query(
            'UPDATE personal SET codigo=?, nombre_completo=?, ci=?, cargo=?, telefono=?, celular=?, tarifa_hora=? WHERE id=?',
            [data.codigo || data[1], data.nombre_completo || data.nombre || data[2], data.ci || data[3], data.cargo || data[4], data.telefono || data[5], data.celular || data[6], tarifa, id]
        );
        res.json({ success: true, message: 'Empleado actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/personal/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM personal WHERE id=?', [id]);
        res.json({ success: true, message: 'Empleado eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - HERRAMIENTAS
// ============================================
app.get('/api/tools', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre, marca, estado, categoria, costo FROM herramientas ORDER BY id'
        );

        const data = rows.map((row, index) => ({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            marca: row.marca,
            estado: row.estado,
            categoria: row.categoria,
            costo: row.costo || 0
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/tools', async (req, res) => {
    try {
        const data = req.body;

        // Validar que costo sea mayor a 0
        const costo = parseFloat(data.costo || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo debe ser mayor a cero' });
        }

        const [result] = await pool.query(
            'INSERT INTO herramientas (codigo, nombre, marca, estado, categoria, costo) VALUES (?, ?, ?, ?, ?, ?)',
            [data.codigo || data[1], data.nombre || data[2], data.marca || data[3], data.estado || data[4] || 'OPERATIVO', data.categoria || '', costo]
        );
        res.json({ success: true, message: 'Herramienta creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/tools/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Validar que costo sea mayor a 0
        const costo = parseFloat(data.costo || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo debe ser mayor a cero' });
        }

        await pool.query(
            'UPDATE herramientas SET codigo=?, nombre=?, marca=?, estado=?, categoria=?, costo=? WHERE id=?',
            [data.codigo || data[1], data.nombre || data[2], data.marca || data[3], data.estado || data[4], data.categoria || '', costo, id]
        );
        res.json({ success: true, message: 'Herramienta actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/tools/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM herramientas WHERE id=?', [id]);
        res.json({ success: true, message: 'Herramienta eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS EN ESPAÑOL - HERRAMIENTAS
// ============================================
app.get('/api/herramientas', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre, marca, estado, categoria, costo FROM herramientas ORDER BY id'
        );

        const data = rows.map((row, index) => ({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            marca: row.marca,
            estado: row.estado,
            categoria: row.categoria,
            costo: row.costo || 0
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/herramientas', async (req, res) => {
    try {
        const data = req.body;

        const costo = parseFloat(data.costo || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo debe ser mayor a cero' });
        }

        const [result] = await pool.query(
            'INSERT INTO herramientas (codigo, nombre, marca, estado, categoria, costo) VALUES (?, ?, ?, ?, ?, ?)',
            [data.codigo || data[1], data.nombre || data[2], data.marca || data[3], data.estado || data[4] || 'OPERATIVO', data.categoria || '', costo]
        );
        res.json({ success: true, message: 'Herramienta creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/herramientas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const costo = parseFloat(data.costo || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo debe ser mayor a cero' });
        }

        await pool.query(
            'UPDATE herramientas SET codigo=?, nombre=?, marca=?, estado=?, categoria=?, costo=? WHERE id=?',
            [data.codigo || data[1], data.nombre || data[2], data.marca || data[3], data.estado || data[4], data.categoria || '', costo, id]
        );
        res.json({ success: true, message: 'Herramienta actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/herramientas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM herramientas WHERE id=?', [id]);
        res.json({ success: true, message: 'Herramienta eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - INSUMOS
// ============================================
app.get('/api/supplies', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria FROM insumos ORDER BY id'
        );

        const data = rows.map((row, index) => ({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            unidad: row.unidad,
            precio_unitario: row.precio_unitario || 0,
            cantidad: row.cantidad || 0,
            stock_minimo: row.stock_minimo || 0,
            categoria: row.categoria
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/supplies', async (req, res) => {
    try {
        const data = req.body;

        // Validar que precio_unitario sea mayor a 0
        const precio = parseFloat(data.precio_unitario || data.precio || data[4] || 0);
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ success: false, error: 'El precio unitario debe ser mayor a cero' });
        }

        // Validar que cantidad sea mayor a 0
        const cantidad = parseInt(data.cantidad || data[5] || 0);
        if (isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ success: false, error: 'La cantidad debe ser mayor a cero' });
        }

        const [result] = await pool.query(
            'INSERT INTO insumos (codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.codigo || data[1], data.nombre || data[2], data.unidad || data[3], precio, cantidad, data.stock_minimo || 0, data.categoria || '']
        );
        res.json({ success: true, message: 'Insumo creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/supplies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Validar que precio_unitario sea mayor a 0
        const precio = parseFloat(data.precio_unitario || data.precio || data[4] || 0);
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ success: false, error: 'El precio unitario debe ser mayor a cero' });
        }

        // Validar que cantidad sea mayor a 0
        const cantidad = parseInt(data.cantidad || data[5] || 0);
        if (isNaN(cantidad) || cantidad < 0) {
            return res.status(400).json({ success: false, error: 'La cantidad debe ser un número válido' });
        }

        await pool.query(
            'UPDATE insumos SET codigo=?, nombre=?, unidad=?, precio_unitario=?, cantidad=?, stock_minimo=?, categoria=? WHERE id=?',
            [data.codigo || data[1], data.nombre || data[2], data.unidad || data[3], precio, cantidad, data.stock_minimo || 0, data.categoria || '', id]
        );
        res.json({ success: true, message: 'Insumo actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/supplies/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM insumos WHERE id=?', [id]);
        res.json({ success: true, message: 'Insumo eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS EN ESPAÑOL - INSUMOS
// ============================================
app.get('/api/insumos', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria FROM insumos ORDER BY id'
        );

        const data = rows.map((row, index) => ({
            id: row.id,
            codigo: row.codigo,
            nombre: row.nombre,
            unidad: row.unidad,
            precio_unitario: row.precio_unitario || 0,
            cantidad: row.cantidad || 0,
            stock_minimo: row.stock_minimo || 0,
            categoria: row.categoria
        }));

        res.json({ success: true, data, rows: rows.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/insumos', async (req, res) => {
    try {
        const data = req.body;

        const precio = parseFloat(data.precio_unitario || data.precio || data[4] || 0);
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ success: false, error: 'El precio unitario debe ser mayor a cero' });
        }

        const cantidad = parseInt(data.cantidad || data[5] || 0);
        if (isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ success: false, error: 'La cantidad debe ser mayor a cero' });
        }

        const [result] = await pool.query(
            'INSERT INTO insumos (codigo, nombre, unidad, precio_unitario, cantidad, stock_minimo, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [data.codigo || data[1], data.nombre || data[2], data.unidad || data[3], precio, cantidad, data.stock_minimo || 0, data.categoria || '']
        );
        res.json({ success: true, message: 'Insumo creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/insumos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const precio = parseFloat(data.precio_unitario || data.precio || data[4] || 0);
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ success: false, error: 'El precio unitario debe ser mayor a cero' });
        }

        const cantidad = parseInt(data.cantidad || data[5] || 0);
        if (isNaN(cantidad) || cantidad < 0) {
            return res.status(400).json({ success: false, error: 'La cantidad debe ser un número válido' });
        }

        await pool.query(
            'UPDATE insumos SET codigo=?, nombre=?, unidad=?, precio_unitario=?, cantidad=?, stock_minimo=?, categoria=? WHERE id=?',
            [data.codigo || data[1], data.nombre || data[2], data.unidad || data[3], precio, cantidad, data.stock_minimo || 0, data.categoria || '', id]
        );
        res.json({ success: true, message: 'Insumo actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/insumos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM insumos WHERE id=?', [id]);
        res.json({ success: true, message: 'Insumo eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - PLANES DE MANTENIMIENTO
// ============================================
app.get('/api/sheets', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT pm.id, pm.nombre_plan, pm.tipo_mantenimiento, m.nombre as maquinaria_nombre, m.codigo as maquinaria_codigo
             FROM planes_mantenimiento pm
             LEFT JOIN maquinaria m ON pm.maquinaria_id = m.id
             WHERE pm.activo = TRUE 
             ORDER BY pm.nombre_plan`
        );

        const sheets = rows.map(row => row.nombre_plan);
        res.json({ success: true, sheets, count: sheets.length, planes: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/plans', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT pm.*, m.nombre as maquinaria_nombre, m.codigo as maquinaria_codigo
             FROM planes_mantenimiento pm
             LEFT JOIN maquinaria m ON pm.maquinaria_id = m.id
             WHERE pm.activo = TRUE 
             ORDER BY pm.nombre_plan`
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/plans/:id', async (req, res) => {
    try {
        const [plans] = await pool.query(
            `SELECT pm.*, m.nombre as maquinaria_nombre, m.codigo as maquinaria_codigo
             FROM planes_mantenimiento pm
             LEFT JOIN maquinaria m ON pm.maquinaria_id = m.id
             WHERE pm.id = ?`,
            [req.params.id]
        );

        if (plans.length === 0) {
            return res.status(404).json({ success: false, error: 'Plan no encontrado' });
        }

        const plan = plans[0];

        // Obtener actividades con insumos y herramientas (incluyendo nombres y costos)
        const [activities] = await pool.query(
            `SELECT am.*,
                    GROUP_CONCAT(DISTINCT CONCAT(i.nombre, '|', ai.cantidad, '|', COALESCE(ai.unidad, i.unidad, ''), '|', ai.costo_unitario, '|', ai.costo_total) SEPARATOR ';;') as insumos_data,
                    GROUP_CONCAT(DISTINCT CONCAT(h.nombre, '|', ah.cantidad, '|', COALESCE(ah.especificaciones, '')) SEPARATOR ';;') as herramientas_data
             FROM actividades_mantenimiento am
             LEFT JOIN actividad_insumos ai ON am.id = ai.actividad_id
             LEFT JOIN insumos i ON ai.insumo_id = i.id
             LEFT JOIN actividad_herramientas ah ON am.id = ah.actividad_id
             LEFT JOIN herramientas h ON ah.herramienta_id = h.id
             WHERE am.plan_id = ?
             GROUP BY am.id
             ORDER BY am.numero_orden`,
            [plan.id]
        );

        plan.actividades = activities;
        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/sheet/:name', async (req, res) => {
    try {
        const { name } = req.params;

        // Buscar el plan
        const [plans] = await pool.query(
            'SELECT id FROM planes_mantenimiento WHERE nombre_plan = ?',
            [name]
        );

        if (plans.length === 0) {
            return res.json({ success: true, data: [], columns: [] });
        }

        // Obtener actividades del plan con costos
        const [activities] = await pool.query(
            `SELECT 
                am.numero_orden as 'Nº',
                am.descripcion_componente as 'Descripción',
                am.actividad as 'Actividad',
                am.tiempo_min as 'Tiempo Mín',
                am.tiempo_promedio as 'Tiempo Prom',
                am.tiempo_max as 'Tiempo Máx',
                am.costo_estimado as 'Costo Estimado',
                COALESCE((SELECT SUM(ai.costo_total) FROM actividad_insumos ai WHERE ai.actividad_id = am.id), 0) as 'Costo Insumos'
            FROM actividades_mantenimiento am
            WHERE am.plan_id = ?
            ORDER BY am.numero_orden`,
            [plans[0].id]
        );

        const columns = ['Nº', 'Descripción', 'Actividad', 'Tiempo Mín', 'Tiempo Prom', 'Tiempo Máx', 'Costo Estimado', 'Costo Insumos'];
        const data = activities;

        res.json({ success: true, data, columns, rows: data.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CRUD para Planes de Mantenimiento
app.post('/api/plans', async (req, res) => {
    try {
        const { maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, horas_operacion, intervalo_dias, descripcion, activo } = req.body;

        if (!nombre_plan || !tipo_mantenimiento) {
            return res.status(400).json({ success: false, error: 'Nombre del plan y tipo de mantenimiento son requeridos' });
        }

        const [result] = await pool.query(
            `INSERT INTO planes_mantenimiento 
             (maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, horas_operacion, intervalo_dias, descripcion, activo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [maquinaria_id || null, nombre_plan, tipo_mantenimiento, tipo_plan || 'POR_HORAS', horas_operacion || null, intervalo_dias || null, descripcion || null, activo !== undefined ? activo : true]
        );

        res.json({ success: true, message: 'Plan de mantenimiento creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/plans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { maquinaria_id, nombre_plan, tipo_mantenimiento, tipo_plan, horas_operacion, intervalo_dias, descripcion, activo } = req.body;

        await pool.query(
            `UPDATE planes_mantenimiento 
             SET maquinaria_id=?, nombre_plan=?, tipo_mantenimiento=?, tipo_plan=?, horas_operacion=?, intervalo_dias=?, descripcion=?, activo=?
             WHERE id=?`,
            [maquinaria_id || null, nombre_plan, tipo_mantenimiento, tipo_plan, horas_operacion || null, intervalo_dias || null, descripcion || null, activo !== undefined ? activo : true, id]
        );

        res.json({ success: true, message: 'Plan de mantenimiento actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/plans/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM planes_mantenimiento WHERE id=?', [id]);
        res.json({ success: true, message: 'Plan de mantenimiento eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CRUD para Actividades de Mantenimiento
app.get('/api/activities', async (req, res) => {
    try {
        const { plan_id } = req.query;
        let query = 'SELECT * FROM actividades_mantenimiento WHERE 1=1';
        const params = [];

        if (plan_id) {
            query += ' AND plan_id = ?';
            params.push(plan_id);
        }

        query += ' ORDER BY COALESCE(numero_orden, 999999), id';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/activities/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM actividades_mantenimiento WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Actividad no encontrada' });
        }

        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/activities', async (req, res) => {
    try {
        const { plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado } = req.body;

        if (!plan_id || !actividad) {
            return res.status(400).json({ success: false, error: 'Plan ID y actividad son requeridos' });
        }

        // Validar que costo_estimado sea mayor a 0
        const costo = parseFloat(costo_estimado || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo estimado debe ser mayor a cero' });
        }

        // Calcular automáticamente el siguiente número de orden si no se proporciona
        let orderNumber = numero_orden;
        if (!orderNumber) {
            const [existingActivities] = await pool.query(
                'SELECT MAX(numero_orden) as max_order FROM actividades_mantenimiento WHERE plan_id = ?',
                [plan_id]
            );
            orderNumber = (existingActivities[0]?.max_order || 0) + 1;
        }

        const [result] = await pool.query(
            `INSERT INTO actividades_mantenimiento 
             (plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [plan_id, orderNumber, descripcion_componente || null, actividad, tiempo_min || null, tiempo_promedio || null, tiempo_max || null, costo]
        );

        res.json({ success: true, message: 'Actividad creada', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { plan_id, numero_orden, descripcion_componente, actividad, tiempo_min, tiempo_promedio, tiempo_max, costo_estimado } = req.body;

        // Validar que costo_estimado sea mayor a 0
        const costo = parseFloat(costo_estimado || 0);
        if (isNaN(costo) || costo <= 0) {
            return res.status(400).json({ success: false, error: 'El costo estimado debe ser mayor a cero' });
        }

        await pool.query(
            `UPDATE actividades_mantenimiento 
             SET plan_id=?, numero_orden=?, descripcion_componente=?, actividad=?, tiempo_min=?, tiempo_promedio=?, tiempo_max=?, costo_estimado=?
             WHERE id=?`,
            [plan_id, numero_orden || null, descripcion_componente || null, actividad, tiempo_min || null, tiempo_promedio || null, tiempo_max || null, costo, id]
        );

        res.json({ success: true, message: 'Actividad actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/activities/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el plan_id y numero_orden de la actividad antes de eliminarla
        const [activity] = await pool.query(
            'SELECT plan_id, numero_orden FROM actividades_mantenimiento WHERE id = ?',
            [id]
        );

        if (activity.length === 0) {
            return res.status(404).json({ success: false, error: 'Actividad no encontrada' });
        }

        const planId = activity[0].plan_id;
        const deletedOrder = activity[0].numero_orden;

        // Eliminar la actividad
        await pool.query('DELETE FROM actividades_mantenimiento WHERE id=?', [id]);

        // Renumerar todas las actividades restantes del mismo plan empezando desde 1
        const [remainingActivities] = await pool.query(
            'SELECT id FROM actividades_mantenimiento WHERE plan_id = ? ORDER BY numero_orden',
            [planId]
        );

        // Actualizar los números de orden secuencialmente desde 1
        for (let i = 0; i < remainingActivities.length; i++) {
            await pool.query(
                'UPDATE actividades_mantenimiento SET numero_orden = ? WHERE id = ?',
                [i + 1, remainingActivities[i].id]
            );
        }

        res.json({ success: true, message: 'Actividad eliminada y actividades renumeradas' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - MANTENIMIENTOS
// ============================================
app.get('/api/maintenance', async (req, res) => {
    try {
        const { tipo, estado, maquinaria_id, fecha_desde, fecha_hasta } = req.query;

        let query = `
            SELECT m.*, 
                   ma.nombre as maquinaria_nombre, 
                   ma.codigo as maquinaria_codigo,
                   pm.nombre_plan
            FROM mantenimientos m
            LEFT JOIN maquinaria ma ON m.maquinaria_id = ma.id
            LEFT JOIN planes_mantenimiento pm ON m.plan_id = pm.id
            WHERE 1=1
        `;
        const params = [];

        if (tipo) {
            query += ' AND m.tipo_mantenimiento = ?';
            params.push(tipo);
        }
        if (estado) {
            query += ' AND m.estado = ?';
            params.push(estado);
        }
        if (maquinaria_id) {
            query += ' AND m.maquinaria_id = ?';
            params.push(maquinaria_id);
        }
        if (fecha_desde) {
            query += ' AND m.fecha_programada >= ?';
            params.push(fecha_desde);
        }
        if (fecha_hasta) {
            query += ' AND m.fecha_programada <= ?';
            params.push(fecha_hasta);
        }

        query += ' ORDER BY m.fecha_programada DESC, m.fecha_ejecucion DESC';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/maintenance/:id', async (req, res) => {
    try {
        const [maintenance] = await pool.query(
            `SELECT m.*, 
                    ma.nombre as maquinaria_nombre, 
                    ma.codigo as maquinaria_codigo,
                    pm.nombre_plan
             FROM mantenimientos m
             LEFT JOIN maquinaria ma ON m.maquinaria_id = ma.id
             LEFT JOIN planes_mantenimiento pm ON m.plan_id = pm.id
             WHERE m.id = ?`,
            [req.params.id]
        );

        if (maintenance.length === 0) {
            return res.status(404).json({ success: false, error: 'Mantenimiento no encontrado' });
        }

        const maint = maintenance[0];

        // Obtener personal asignado
        const [personal] = await pool.query(
            `SELECT mp.*, p.nombre_completo, p.cargo, p.codigo as personal_codigo
             FROM mantenimiento_personal mp
             LEFT JOIN personal p ON mp.personal_id = p.id
             WHERE mp.mantenimiento_id = ?`,
            [maint.id]
        );

        // Obtener insumos utilizados
        const [insumos] = await pool.query(
            `SELECT mi.*, i.nombre as insumo_nombre, i.codigo as insumo_codigo, i.unidad as insumo_unidad
             FROM mantenimiento_insumos mi
             LEFT JOIN insumos i ON mi.insumo_id = i.id
             WHERE mi.mantenimiento_id = ?`,
            [maint.id]
        );

        // Obtener actividades ejecutadas
        const [actividades] = await pool.query(
            `SELECT ma.*, am.descripcion_componente as actividad_plan_descripcion
             FROM mantenimiento_actividades ma
             LEFT JOIN actividades_mantenimiento am ON ma.actividad_id = am.id
             WHERE ma.mantenimiento_id = ?`,
            [maint.id]
        );

        maint.personal = personal;
        maint.insumos = insumos;
        maint.actividades = actividades;

        res.json({ success: true, data: maint });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/maintenance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { maquinaria_id, plan_id, tipo_mantenimiento, fecha_programada, fecha_ejecucion, horas_maquina, observaciones, estado, costo_mano_obra, costo_insumos } = req.body;

        // Validar costos si el estado es COMPLETADO
        if (estado === 'COMPLETADO') {
            const costoMO = parseFloat(costo_mano_obra || 0);
            const costoIns = parseFloat(costo_insumos || 0);

            if (isNaN(costoMO) || costoMO <= 0) {
                return res.status(400).json({ success: false, error: 'El costo de mano de obra debe ser mayor a cero para mantenimientos completados' });
            }

            if (isNaN(costoIns) || costoIns <= 0) {
                return res.status(400).json({ success: false, error: 'El costo de insumos debe ser mayor a cero para mantenimientos completados' });
            }
        }

        await pool.query(
            `UPDATE mantenimientos
             SET maquinaria_id=?, plan_id=?, tipo_mantenimiento=?, fecha_programada=?, fecha_ejecucion=?,
                 horas_maquina=?, observaciones=?, estado=?, costo_mano_obra=?, costo_insumos=?
             WHERE id=?`,
            [maquinaria_id, plan_id || null, tipo_mantenimiento, fecha_programada, fecha_ejecucion || null,
                horas_maquina || null, observaciones || null, estado, costo_mano_obra || null, costo_insumos || null, id]
        );

        res.json({ success: true, message: 'Mantenimiento actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/maintenance/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM mantenimientos WHERE id=?', [id]);
        res.json({ success: true, message: 'Mantenimiento eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Crear nuevo mantenimiento
app.post('/api/maintenance', async (req, res) => {
    try {
        const { maquinaria_id, plan_id, tipo_mantenimiento, fecha_programada, fecha_ejecucion, horas_maquina, observaciones, estado, costo_mano_obra, costo_insumos } = req.body;

        if (!maquinaria_id || !tipo_mantenimiento) {
            return res.status(400).json({ success: false, error: 'Maquinaria y tipo de mantenimiento son requeridos' });
        }

        // Validar costos si el estado es COMPLETADO
        let costoMO = null;
        let costoIns = null;
        if (estado === 'COMPLETADO') {
            costoMO = parseFloat(costo_mano_obra || 0);
            costoIns = parseFloat(costo_insumos || 0);

            if (isNaN(costoMO) || costoMO <= 0) {
                return res.status(400).json({ success: false, error: 'El costo de mano de obra debe ser mayor a cero para mantenimientos completados' });
            }

            if (isNaN(costoIns) || costoIns <= 0) {
                return res.status(400).json({ success: false, error: 'El costo de insumos debe ser mayor a cero para mantenimientos completados' });
            }
        } else {
            costoMO = costo_mano_obra ? parseFloat(costo_mano_obra) : null;
            costoIns = costo_insumos ? parseFloat(costo_insumos) : null;
        }

        const [result] = await pool.query(
            `INSERT INTO mantenimientos 
             (maquinaria_id, plan_id, tipo_mantenimiento, fecha_programada, fecha_ejecucion, horas_maquina, observaciones, estado, costo_mano_obra, costo_insumos) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [maquinaria_id, plan_id || null, tipo_mantenimiento, fecha_programada || null, fecha_ejecucion || null, horas_maquina || null, observaciones || null, estado || 'PROGRAMADO', costoMO, costoIns]
        );

        res.json({ success: true, message: 'Mantenimiento creado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Agregar personal a mantenimiento
app.post('/api/maintenance/:id/personnel', async (req, res) => {
    try {
        const { id } = req.params;
        const { personal_id, horas_trabajadas, tarifa_aplicada } = req.body;

        // Si no se proporciona tarifa, obtenerla del personal
        let tarifa = tarifa_aplicada;
        if (!tarifa) {
            const [personal] = await pool.query('SELECT tarifa_hora FROM personal WHERE id = ?', [personal_id]);
            tarifa = personal[0]?.tarifa_hora || 0;
        }

        const [result] = await pool.query(
            'INSERT INTO mantenimiento_personal (mantenimiento_id, personal_id, horas_trabajadas, tarifa_aplicada) VALUES (?, ?, ?, ?)',
            [id, personal_id, horas_trabajadas, tarifa]
        );

        // Actualizar costo de mano de obra del mantenimiento
        const [costos] = await pool.query(
            'SELECT SUM(costo_total) as total FROM mantenimiento_personal WHERE mantenimiento_id = ?',
            [id]
        );
        await pool.query(
            'UPDATE mantenimientos SET costo_mano_obra = ? WHERE id = ?',
            [costos[0].total || 0, id]
        );

        res.json({ success: true, message: 'Personal agregado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Agregar insumo a mantenimiento
app.post('/api/maintenance/:id/supplies', async (req, res) => {
    try {
        const { id } = req.params;
        const { insumo_id, cantidad_usada, unidad, precio_unitario } = req.body;

        // Si no se proporciona precio, obtenerlo del insumo
        let precio = precio_unitario;
        if (!precio) {
            const [insumo] = await pool.query('SELECT precio_unitario FROM insumos WHERE id = ?', [insumo_id]);
            precio = insumo[0]?.precio_unitario || 0;
        }

        const [result] = await pool.query(
            'INSERT INTO mantenimiento_insumos (mantenimiento_id, insumo_id, cantidad_usada, unidad, precio_unitario) VALUES (?, ?, ?, ?, ?)',
            [id, insumo_id, cantidad_usada, unidad || null, precio]
        );

        // Actualizar costo de insumos del mantenimiento
        const [costos] = await pool.query(
            'SELECT SUM(costo_total) as total FROM mantenimiento_insumos WHERE mantenimiento_id = ?',
            [id]
        );
        await pool.query(
            'UPDATE mantenimientos SET costo_insumos = ? WHERE id = ?',
            [costos[0].total || 0, id]
        );

        res.json({ success: true, message: 'Insumo agregado', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - FICHAS DE MANTENIMIENTO Y ÓRDENES DE TRABAJO
// ============================================
// Función para registrar rutas que dependen del pool
function registerPoolRoutes() {
    // Checklists - Rutas en inglés
    app.get('/api/machinery/:id/checklists', getChecklistsByMachinery(pool));
    app.post('/api/checklists', createChecklist(pool));
    app.put('/api/checklists/:id', updateChecklist(pool));
    app.delete('/api/checklists/:id', deleteChecklist(pool));
    
    // Checklists - Rutas en español (alias) - COMPLETAS
    app.get('/api/maquinaria/:id/checklists', getChecklistsByMachinery(pool));
    app.post('/api/checklists', createChecklist(pool)); // POST usa /api/checklists (sin maquinaria)
    app.put('/api/checklists/:id', updateChecklist(pool)); // PUT usa /api/checklists/:id
    app.delete('/api/checklists/:id', deleteChecklist(pool)); // DELETE usa /api/checklists/:id

    // Reportes Diarios - Rutas en inglés
    app.get('/api/machinery/:id/daily-reports', getDailyReportsByMachinery(pool));
    app.get('/api/daily-reports/:id', getDailyReport(pool));
    app.post('/api/daily-reports', upsertDailyReport(pool));
    app.put('/api/daily-reports/:id', updateDailyReport(pool));
    app.delete('/api/daily-reports/:id', deleteDailyReport(pool));
    
    // Reportes Diarios - Rutas en español (alias) - COMPLETAS
    app.get('/api/maquinaria/:id/daily-reports', getDailyReportsByMachinery(pool));
    // POST, PUT, DELETE usan /api/daily-reports (sin maquinaria) - ya están registradas arriba

    // Historial - Rutas en inglés
    app.get('/api/machinery/:id/history', getMachineryHistory(pool));
    
    // Historial - Rutas en español (alias)
    app.get('/api/maquinaria/:id/history', getMachineryHistory(pool));

    // Órdenes de Trabajo
    app.get('/api/work-orders', getWorkOrders(pool));
    app.get('/api/work-orders/:id', getWorkOrder(pool));
    app.post('/api/work-orders', createWorkOrder(pool));
    app.put('/api/work-orders/:id', updateWorkOrder(pool));
    app.delete('/api/work-orders/:id', deleteWorkOrder(pool));
    app.post('/api/work-orders/:id/mechanics', assignMechanics(pool));
    app.put('/api/work-orders/:id/status', updateWorkOrderStatus(pool));
}

// ============================================
// RUTAS - AUTENTICACIÓN
// ============================================
// Ruta pública de registro (sin autenticación requerida)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, nombre_completo, email } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Usuario y contraseña son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si existe
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'El nombre de usuario ya está en uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Nuevos registros por defecto son OPERADOR y pueden estar inactivos hasta aprobación
        await pool.query(
            'INSERT INTO users (username, password, nombre_completo, email, rol, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, nombre_completo || '', email || null, 'OPERADOR', true] // true para permitir acceso inmediato
        );

        res.json({ success: true, message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password, twoFactorCode } = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
        }

        // Si el usuario tiene 2FA activado, verificar el código
        if (user.two_factor_enabled && user.two_factor_secret) {
            if (!twoFactorCode) {
                return res.status(200).json({
                    success: false,
                    requiresTwoFactor: true,
                    message: 'Se requiere código de autenticación de dos factores'
                });
            }

            const isValidCode = verifyToken(user.two_factor_secret, twoFactorCode);
            if (!isValidCode) {
                return res.status(401).json({
                    success: false,
                    error: 'Código de autenticación inválido',
                    requiresTwoFactor: true
                });
            }
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, rol: user.rol, nombre: user.nombre_completo },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                rol: user.rol,
                nombre: user.nombre_completo,
                email: user.email || null,
                two_factor_enabled: user.two_factor_enabled || false
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - AUTENTICACIÓN DE DOS FACTORES (2FA)
// ============================================

// GET - Generar secreto y QR code para activar 2FA
app.get('/api/auth/two-factor/setup', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        const user = users[0];

        // Si ya tiene 2FA activado, devolver el QR existente
        if (user.two_factor_enabled && user.two_factor_secret) {
            const otpauthUrl = `otpauth://totp/MTTO%20Pro%20(${user.username})?secret=${user.two_factor_secret}&issuer=MTTO%20Pro`;
            const qrCode = await generateQRCode(otpauthUrl);
            return res.json({
                success: true,
                qrCode,
                secret: user.two_factor_secret,
                enabled: true
            });
        }

        // Generar nuevo secreto
        const { secret, otpauth_url } = generateSecret(user.username, 'MTTO Pro');
        const qrCode = await generateQRCode(otpauth_url);

        // Guardar el secreto temporalmente (aún no activado)
        await pool.query(
            'UPDATE users SET two_factor_secret = ? WHERE id = ?',
            [secret, userId]
        );

        res.json({
            success: true,
            qrCode,
            secret,
            enabled: false
        });
    } catch (error) {
        console.error('Error en setup 2FA:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Verificar código y activar 2FA
app.post('/api/auth/two-factor/verify', authenticateToken, async (req, res) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;

        if (!code) {
            return res.status(400).json({ success: false, error: 'Código requerido' });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        const user = users[0];

        if (!user.two_factor_secret) {
            return res.status(400).json({ success: false, error: 'Primero debes generar un código QR' });
        }

        const isValid = verifyToken(user.two_factor_secret, code);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Código inválido' });
        }

        // Activar 2FA
        await pool.query(
            'UPDATE users SET two_factor_enabled = TRUE WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Autenticación de dos factores activada exitosamente'
        });
    } catch (error) {
        console.error('Error verificando código 2FA:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Desactivar 2FA
app.post('/api/auth/two-factor/disable', authenticateToken, async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.id;

        if (!password) {
            return res.status(400).json({ success: false, error: 'Contraseña requerida para desactivar 2FA' });
        }

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
        }

        // Desactivar 2FA y eliminar secreto
        await pool.query(
            'UPDATE users SET two_factor_enabled = FALSE, two_factor_secret = NULL WHERE id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Autenticación de dos factores desactivada exitosamente'
        });
    } catch (error) {
        console.error('Error desactivando 2FA:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Estado de 2FA del usuario
app.get('/api/auth/two-factor/status', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const [users] = await pool.query('SELECT two_factor_enabled FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        res.json({
            success: true,
            enabled: users[0].two_factor_enabled || false
        });
    } catch (error) {
        console.error('Error obteniendo estado 2FA:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - RECUPERACIÓN DE CONTRASEÑA
// ============================================

// POST - Solicitar recuperación de contraseña
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
            return res.status(400).json({ success: false, error: 'Debe proporcionar usuario o email' });
        }

        // Buscar usuario por username o email
        let query = 'SELECT id, username, email, nombre_completo FROM users WHERE ';
        let params = [];

        if (username && email) {
            query += '(username = ? OR email = ?)';
            params = [username, email];
        } else if (username) {
            query += 'username = ?';
            params = [username];
        } else {
            query += 'email = ?';
            params = [email];
        }

        const [users] = await pool.query(query, params);

        if (users.length === 0) {
            // Por seguridad, siempre devolver éxito aunque el usuario no exista
            return res.json({
                success: true,
                message: 'Si el usuario existe, recibirás un enlace de recuperación por email'
            });
        }

        const user = users[0];

        // Generar token único
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

        // Eliminar tokens anteriores no usados del usuario
        await pool.query(
            'DELETE FROM password_reset_tokens WHERE user_id = ? AND used = FALSE',
            [user.id]
        );

        // Guardar token en la base de datos
        await pool.query(
            'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, resetToken, expiresAt]
        );

        // Construir URL de reset
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

        // Validar que el usuario tenga email registrado
        if (!user.email) {
            return res.status(400).json({
                success: false,
                error: 'Tu cuenta no tiene un email registrado. Por favor, contacta al administrador para restablecer tu contraseña.'
            });
        }

        // Intentar enviar email con el token
        let emailSent = false;
        try {
            const emailResult = await sendPasswordResetEmail(
                user.email,
                user.username,
                resetToken,
                resetUrl
            );

            if (emailResult.sent) {
                emailSent = true;
                console.log(`✅ Email de recuperación enviado exitosamente a ${user.email}`);
            }
        } catch (emailError) {
            console.error('❌ Error enviando email de recuperación:', emailError);

            // Si el email no está configurado o hay error, informar que debe contactar al administrador
            if (emailError.code === 'EMAIL_NOT_CONFIGURED' || emailError.code === 'USER_NO_EMAIL') {
                console.log(`⚠️ Solicitud de recuperación para ${user.username} - Email no disponible. El administrador debe resetear la contraseña.`);
                // El token ya está guardado en la BD, el admin puede verlo y resetear
            }
        }

        // Respuesta segura: siempre informar que se procesó la solicitud
        // Si el email se envió, informar al usuario
        if (emailSent) {
            return res.json({
                success: true,
                message: 'Se ha enviado un email a tu dirección de correo electrónico con las instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada (y la carpeta de spam si no lo encuentras).'
            });
        } else {
            // Si no se pudo enviar el email, informar que debe contactar al administrador
            return res.json({
                success: true,
                message: 'Tu solicitud de recuperación de contraseña ha sido registrada. Por favor, contacta al administrador del sistema para restablecer tu contraseña de forma segura.',
                requiresAdmin: true
            });
        }
    } catch (error) {
        console.error('Error en forgot-password:', error);
        res.status(500).json({ success: false, error: 'Error al procesar la solicitud' });
    }
});

// POST - Verificar token de recuperación
app.post('/api/auth/verify-reset-token', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, error: 'Token requerido' });
        }

        const [tokens] = await pool.query(
            `SELECT prt.*, u.username, u.email 
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.id
             WHERE prt.token = ? AND prt.used = FALSE AND prt.expires_at > NOW()`,
            [token]
        );

        if (tokens.length === 0) {
            return res.status(400).json({ success: false, error: 'Token inválido o expirado' });
        }

        res.json({
            success: true,
            message: 'Token válido',
            username: tokens[0].username
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Restablecer contraseña con token
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ success: false, error: 'Token y nueva contraseña son requeridos' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar token
        const [tokens] = await pool.query(
            `SELECT prt.*, u.id as user_id, u.username 
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.id
             WHERE prt.token = ? AND prt.used = FALSE AND prt.expires_at > NOW()`,
            [token]
        );

        if (tokens.length === 0) {
            return res.status(400).json({ success: false, error: 'Token inválido o expirado' });
        }

        const resetToken = tokens[0];

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await pool.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, resetToken.user_id]
        );

        // Marcar token como usado
        await pool.query(
            'UPDATE password_reset_tokens SET used = TRUE WHERE id = ?',
            [resetToken.id]
        );

        res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// RUTAS - GESTIÓN DE USUARIOS (Solo ADMIN)
// ============================================

// Middleware para verificar si es ADMIN
const requireAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        if (user.rol !== 'ADMIN') return res.status(403).json({ success: false, error: 'Solo administradores pueden realizar esta acción' });
        req.user = user;
        next();
    });
};

// GET - Obtener perfil del usuario actual
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, nombre_completo, email, rol, estado, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        // Asegurar que email null se maneje correctamente
        const userData = users[0];
        if (userData.email === 'null' || userData.email === 'NULL') {
            userData.email = null;
        }
        res.json({ success: true, data: userData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT - Actualizar perfil del usuario actual
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
    try {
        const { nombre_completo, email, password } = req.body;
        const userId = req.user.id;

        console.log('=== ACTUALIZACIÓN DE PERFIL ===');
        console.log('Usuario ID:', userId);
        console.log('Datos recibidos:', JSON.stringify({ nombre_completo, email, password: password ? '***' : 'no proporcionada' }, null, 2));
        console.log('Tipo de email:', typeof email);
        console.log('Valor de email:', email);

        const updates = [];
        const values = [];

        if (nombre_completo !== undefined) {
            updates.push('nombre_completo = ?');
            values.push(nombre_completo || '');
        }

        // SIEMPRE incluir email si está presente en el request
        if (email !== undefined) {
            updates.push('email = ?');
            let emailValue = null;
            if (email && typeof email === 'string' && email.trim() !== '') {
                emailValue = email.trim();
            } else if (email === null || email === 'null' || email === '') {
                emailValue = null;
            }
            console.log('Email procesado para guardar:', emailValue);
            values.push(emailValue);
        } else {
            console.log('ADVERTENCIA: email no está definido en el request');
        }
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'No hay campos para actualizar' });
        }

        values.push(userId);
        console.log('Ejecutando UPDATE:', `UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
        console.log('Valores:', values);

        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

        // Obtener usuario actualizado
        const [updated] = await pool.query(
            'SELECT id, username, nombre_completo, email, rol, estado FROM users WHERE id = ?',
            [userId]
        );

        // Asegurar que email null se convierta en null (no string 'null')
        const userData = updated[0];
        if (userData.email === 'null' || userData.email === 'NULL') {
            userData.email = null;
        }

        console.log('Usuario actualizado:', userData);
        res.json({ success: true, message: 'Perfil actualizado exitosamente', data: userData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Listar todos los usuarios
app.get('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, nombre_completo, email, rol, estado, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Obtener un usuario por ID
app.get('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, nombre_completo, email, rol, estado, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
        res.json({ success: true, data: users[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Crear nuevo usuario (ya existe en /api/auth/register, pero lo movemos aquí para consistencia)
app.post('/api/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { username, password, nombre_completo, email, rol } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Usuario y contraseña son requeridos' });
        }

        // Verificar si existe
        const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (username, password, nombre_completo, email, rol) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, nombre_completo || '', email || null, rol || 'OPERADOR']
        );

        res.json({ success: true, message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// PUT - Actualizar usuario
app.put('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { username, password, nombre_completo, rol, estado } = req.body;
        const userId = req.params.id;

        // Verificar que el usuario existe
        const [existing] = await pool.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        // Si se quiere cambiar el username, verificar que no exista
        if (username) {
            const [duplicate] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
            if (duplicate.length > 0) {
                return res.status(400).json({ success: false, error: 'El nombre de usuario ya está en uso' });
            }
        }

        // Construir query de actualización
        const updates = [];
        const values = [];

        if (username) {
            updates.push('username = ?');
            values.push(username);
        }
        if (nombre_completo !== undefined) {
            updates.push('nombre_completo = ?');
            values.push(nombre_completo);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            // Si email es string vacío, guardar como NULL
            values.push(email === '' || email === null ? null : email);
        }
        if (rol) {
            updates.push('rol = ?');
            values.push(rol);
        }
        if (estado !== undefined) {
            updates.push('estado = ?');
            values.push(estado);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'No hay campos para actualizar' });
        }

        values.push(userId);
        await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

        res.json({ success: true, message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET - Obtener solicitudes de recuperación de contraseña pendientes (Solo ADMIN)
app.get('/api/password-reset-requests', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [requests] = await pool.query(
            `SELECT prt.id, prt.token, prt.created_at, prt.expires_at, prt.used,
                    u.id as user_id, u.username, u.nombre_completo, u.email
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.id
             WHERE prt.used = FALSE AND prt.expires_at > NOW()
             ORDER BY prt.created_at DESC`
        );
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST - Resetear contraseña de usuario (Solo ADMIN)
app.post('/api/users/:id/reset-password', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const userId = req.params.id;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ success: false, error: 'Nueva contraseña es requerida' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar que el usuario existe
        const [users] = await pool.query('SELECT id, username FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        // Invalidar todos los tokens de recuperación del usuario
        await pool.query('UPDATE password_reset_tokens SET used = TRUE WHERE user_id = ?', [userId]);

        res.json({
            success: true,
            message: `Contraseña restablecida exitosamente para el usuario ${users[0].username}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// DELETE - Eliminar usuario
app.delete('/api/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const userId = req.params.id;

        // No permitir eliminar el propio usuario
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({ success: false, error: 'No puedes eliminar tu propio usuario' });
        }

        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/checklists/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM checklists_maquinaria WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Checklist no encontrado' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================
async function startServer() {
    await initDatabase();

    // Registrar rutas que dependen del pool después de inicializar la base de datos
    registerPoolRoutes();

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Backend MySQL running on http://0.0.0.0:${PORT}`);
        console.log(`🗄️  Database: ${dbConfig.database}`);
    });
}

startServer().catch(console.error);
