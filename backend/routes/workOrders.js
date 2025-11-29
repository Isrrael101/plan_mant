// -*- coding: utf-8 -*-
/**
 * Rutas para el sistema de órdenes de trabajo
 */

// Generar número de OT automático
async function generateOTNumber(pool) {
    const year = new Date().getFullYear();
    const [rows] = await pool.query(`
        SELECT numero_ot FROM ordenes_trabajo 
        WHERE numero_ot LIKE ? 
        ORDER BY numero_ot DESC LIMIT 1
    `, [`OT-${year}-%`]);

    let counter = 1;
    if (rows.length > 0) {
        const lastNumber = rows[0].numero_ot;
        const lastCounter = parseInt(lastNumber.split('-')[2]);
        counter = lastCounter + 1;
    }

    return `OT-${year}-${String(counter).padStart(3, '0')}`;
}

// ============================================
// ÓRDENES DE TRABAJO - CRUD
// ============================================

// Listar todas las órdenes de trabajo
export function getWorkOrders(pool) {
    return async (req, res) => {
        try {
            const { estado, prioridad, fecha_inicio, fecha_fin } = req.query;

            let query = `
                SELECT ot.*,
                       m.nombre as maquinaria_nombre,
                       m.codigo as maquinaria_codigo,
                       s.nombre_completo as solicitante_nombre,
                       r.nombre_completo as responsable_nombre,
                       ja.nombre_completo as jefe_admin_nombre,
                       mt.nombre_completo as mantenimiento_nombre,
                       d.nombre_completo as director_nombre
                FROM ordenes_trabajo ot
                LEFT JOIN maquinaria m ON ot.maquinaria_id = m.id
                LEFT JOIN personal s ON ot.solicitante_id = s.id
                LEFT JOIN personal r ON ot.responsable_id = r.id
                LEFT JOIN personal ja ON ot.jefe_admin_id = ja.id
                LEFT JOIN personal mt ON ot.mantenimiento_id = mt.id
                LEFT JOIN personal d ON ot.director_id = d.id
                WHERE 1=1
            `;

            const params = [];

            if (estado) {
                query += ` AND ot.estado = ?`;
                params.push(estado);
            }

            if (prioridad) {
                query += ` AND ot.prioridad = ?`;
                params.push(prioridad);
            }

            if (fecha_inicio && fecha_fin) {
                query += ` AND ot.fecha_solicitud BETWEEN ? AND ?`;
                params.push(fecha_inicio, fecha_fin);
            }

            query += ` ORDER BY ot.fecha_solicitud DESC, ot.id DESC`;

            const [rows] = await pool.query(query, params);

            // Obtener mecánicos para cada OT
            for (let ot of rows) {
                const [mecanicos] = await pool.query(`
                    SELECT om.*, p.nombre_completo as mecanico_nombre
                    FROM ot_mecanicos om
                    LEFT JOIN personal p ON om.mecanico_id = p.id
                    WHERE om.ot_id = ?
                `, [ot.id]);
                ot.mecanicos = mecanicos;
            }

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error getting work orders:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Obtener OT específica
export function getWorkOrder(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;

            const [rows] = await pool.query(`
                SELECT ot.*,
                       m.nombre as maquinaria_nombre,
                       m.codigo as maquinaria_codigo,
                       s.nombre_completo as solicitante_nombre,
                       r.nombre_completo as responsable_nombre,
                       ja.nombre_completo as jefe_admin_nombre,
                       mt.nombre_completo as mantenimiento_nombre,
                       d.nombre_completo as director_nombre
                FROM ordenes_trabajo ot
                LEFT JOIN maquinaria m ON ot.maquinaria_id = m.id
                LEFT JOIN personal s ON ot.solicitante_id = s.id
                LEFT JOIN personal r ON ot.responsable_id = r.id
                LEFT JOIN personal ja ON ot.jefe_admin_id = ja.id
                LEFT JOIN personal mt ON ot.mantenimiento_id = mt.id
                LEFT JOIN personal d ON ot.director_id = d.id
                WHERE ot.id = ?
            `, [id]);

            if (rows.length === 0) {
                return res.status(404).json({ success: false, error: 'OT no encontrada' });
            }

            // Obtener mecánicos
            const [mecanicos] = await pool.query(`
                SELECT om.*, p.nombre_completo as mecanico_nombre
                FROM ot_mecanicos om
                LEFT JOIN personal p ON om.mecanico_id = p.id
                WHERE om.ot_id = ?
            `, [id]);

            rows[0].mecanicos = mecanicos;

            res.json({ success: true, data: rows[0] });
        } catch (error) {
            console.error('Error getting work order:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Crear nueva OT
export function createWorkOrder(pool) {
    return async (req, res) => {
        try {
            const data = req.body;

            // Generar número de OT
            const numero_ot = await generateOTNumber(pool);

            const [result] = await pool.query(`
                INSERT INTO ordenes_trabajo (
                    numero_ot, fecha_solicitud, maquinaria_id, solicitante_id,
                    numero_referencia, anexo, horometro, descripcion_trabajo,
                    prioridad, tipo_trabajo, valor_materiales, cargo_a,
                    responsable_id, fecha_inicio, fecha_termino, porcentaje_taller,
                    estado, observaciones
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                numero_ot,
                data.fecha_solicitud || new Date().toISOString().split('T')[0],
                data.maquinaria_id,
                data.solicitante_id,
                data.numero_referencia,
                data.anexo,
                data.horometro,
                data.descripcion_trabajo,
                data.prioridad || 'MEDIA',
                data.tipo_trabajo || 'CORRECTIVO',
                data.valor_materiales || 0,
                data.cargo_a,
                data.responsable_id,
                data.fecha_inicio,
                data.fecha_termino,
                data.porcentaje_taller || 10,
                'SOLICITADA',
                data.observaciones
            ]);

            const otId = result.insertId;

            // Asignar mecánicos si se proporcionan
            if (data.mecanicos && Array.isArray(data.mecanicos)) {
                for (const mecanico of data.mecanicos) {
                    await pool.query(`
                        INSERT INTO ot_mecanicos (ot_id, mecanico_id, horas_trabajadas)
                        VALUES (?, ?, ?)
                    `, [otId, mecanico.mecanico_id, mecanico.horas_trabajadas || 0]);
                }
            }

            res.json({ success: true, id: otId, numero_ot });
        } catch (error) {
            console.error('Error creating work order:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Actualizar OT
export function updateWorkOrder(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            await pool.query(`
                UPDATE ordenes_trabajo SET
                    fecha_solicitud = ?,
                    maquinaria_id = ?,
                    solicitante_id = ?,
                    numero_referencia = ?,
                    anexo = ?,
                    horometro = ?,
                    descripcion_trabajo = ?,
                    prioridad = ?,
                    tipo_trabajo = ?,
                    valor_materiales = ?,
                    cargo_a = ?,
                    responsable_id = ?,
                    fecha_inicio = ?,
                    fecha_termino = ?,
                    porcentaje_taller = ?,
                    observaciones = ?
                WHERE id = ?
            `, [
                data.fecha_solicitud,
                data.maquinaria_id,
                data.solicitante_id,
                data.numero_referencia,
                data.anexo,
                data.horometro,
                data.descripcion_trabajo,
                data.prioridad,
                data.tipo_trabajo,
                data.valor_materiales,
                data.cargo_a,
                data.responsable_id,
                data.fecha_inicio,
                data.fecha_termino,
                data.porcentaje_taller,
                data.observaciones,
                id
            ]);

            res.json({ success: true });
        } catch (error) {
            console.error('Error updating work order:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Eliminar OT
export function deleteWorkOrder(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;

            await pool.query('DELETE FROM ordenes_trabajo WHERE id = ?', [id]);

            res.json({ success: true });
        } catch (error) {
            console.error('Error deleting work order:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// ============================================
// MECÁNICOS
// ============================================

// Asignar/actualizar mecánicos a OT
export function assignMechanics(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const { mecanicos } = req.body;

            // Eliminar mecánicos existentes
            await pool.query('DELETE FROM ot_mecanicos WHERE ot_id = ?', [id]);

            // Insertar nuevos mecánicos
            if (mecanicos && Array.isArray(mecanicos)) {
                for (const mecanico of mecanicos) {
                    await pool.query(`
                        INSERT INTO ot_mecanicos (ot_id, mecanico_id, horas_trabajadas)
                        VALUES (?, ?, ?)
                    `, [id, mecanico.mecanico_id, mecanico.horas_trabajadas || 0]);
                }
            }

            res.json({ success: true });
        } catch (error) {
            console.error('Error assigning mechanics:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// ============================================
// ESTADO Y WORKFLOW
// ============================================

// Cambiar estado de OT
export function updateWorkOrderStatus(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const { estado, firma_tipo, firma_id } = req.body;

            let updateQuery = 'UPDATE ordenes_trabajo SET estado = ?';
            const params = [estado];

            // Si se proporciona una firma, actualizarla
            if (firma_tipo && firma_id) {
                const fecha = new Date().toISOString().split('T')[0];

                if (firma_tipo === 'jefe_admin') {
                    updateQuery += ', jefe_admin_id = ?, jefe_admin_fecha = ?';
                    params.push(firma_id, fecha);
                } else if (firma_tipo === 'mantenimiento') {
                    updateQuery += ', mantenimiento_id = ?, mantenimiento_fecha = ?';
                    params.push(firma_id, fecha);
                } else if (firma_tipo === 'director') {
                    updateQuery += ', director_id = ?, director_fecha = ?';
                    params.push(firma_id, fecha);
                }
            }

            updateQuery += ' WHERE id = ?';
            params.push(id);

            await pool.query(updateQuery, params);

            res.json({ success: true });
        } catch (error) {
            console.error('Error updating work order status:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}
