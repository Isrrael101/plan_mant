// -*- coding: utf-8 -*-
/**
 * Rutas para el sistema de fichas de mantenimiento
 * - Checklists de maquinaria
 * - Reportes diarios
 * - Historial de mantenimiento
 */

// ============================================
// CHECKLISTS DE MAQUINARIA
// ============================================

// Obtener todos los checklists de una maquinaria
export function getChecklistsByMachinery(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await pool.query(`
                SELECT c.*, 
                       m.nombre as maquinaria_nombre,
                       m.codigo as maquinaria_codigo,
                       p1.nombre_completo as realizado_por_nombre,
                       p2.nombre_completo as revisado_por_nombre
                FROM checklists_maquinaria c
                LEFT JOIN maquinaria m ON c.maquinaria_id = m.id
                LEFT JOIN personal p1 ON c.realizado_por = p1.id
                LEFT JOIN personal p2 ON c.revisado_por = p2.id
                WHERE c.maquinaria_id = ?
                ORDER BY c.fecha DESC
            `, [id]);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error getting checklists:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Crear nuevo checklist
export function createChecklist(pool) {
    return async (req, res) => {
        try {
            const data = req.body;

            // Construir query dinámicamente con todos los campos
            const fields = [
                'maquinaria_id', 'fecha', 'tipo_checklist', 'codigo_checklist', 'anexo', 'revision',
                'realizado_por', 'revisado_por',
                'sonda_botella_vibradora', 'sonda_botella_vibradora_accion', 'sonda_botella_vibradora_quien', 'sonda_botella_vibradora_cuando', 'sonda_botella_vibradora_area',
                'sonda_flexible', 'sonda_flexible_accion', 'sonda_flexible_quien', 'sonda_flexible_cuando', 'sonda_flexible_area',
                'sonda_cuerpo_acople', 'sonda_cuerpo_acople_accion', 'sonda_cuerpo_acople_quien', 'sonda_cuerpo_acople_cuando', 'sonda_cuerpo_acople_area',
                'ume_partidor_proteccion', 'ume_partidor_proteccion_accion', 'ume_partidor_proteccion_quien', 'ume_partidor_proteccion_cuando', 'ume_partidor_proteccion_area',
                'ume_conductor_electrodo', 'ume_conductor_electrodo_accion', 'ume_conductor_electrodo_quien', 'ume_conductor_electrodo_cuando', 'ume_conductor_electrodo_area',
                'ume_enchufe_macho', 'ume_enchufe_macho_accion', 'ume_enchufe_macho_quien', 'ume_enchufe_macho_cuando', 'ume_enchufe_macho_area',
                'ume_ension_tierra', 'ume_ension_tierra_accion', 'ume_ension_tierra_quien', 'ume_ension_tierra_cuando', 'ume_ension_tierra_area',
                'ume_fundamento_giro', 'ume_fundamento_giro_accion', 'ume_fundamento_giro_quien', 'ume_fundamento_giro_cuando', 'ume_fundamento_giro_area',
                'umc_partes_moviles', 'umc_partes_moviles_accion', 'umc_partes_moviles_quien', 'umc_partes_moviles_cuando', 'umc_partes_moviles_area',
                'umc_sectores_calientes', 'umc_sectores_calientes_accion', 'umc_sectores_calientes_quien', 'umc_sectores_calientes_cuando', 'umc_sectores_calientes_area',
                'umc_tubo_escape', 'umc_tubo_escape_accion', 'umc_tubo_escape_quien', 'umc_tubo_escape_cuando', 'umc_tubo_escape_area',
                'umc_motor', 'umc_motor_accion', 'umc_motor_quien', 'umc_motor_cuando', 'umc_motor_area',
                'umc_soportes_motor', 'umc_soportes_motor_accion', 'umc_soportes_motor_quien', 'umc_soportes_motor_cuando', 'umc_soportes_motor_area',
                'umc_estructura_aislada', 'umc_estructura_aislada_accion', 'umc_estructura_aislada_quien', 'umc_estructura_aislada_cuando', 'umc_estructura_aislada_area',
                'umc_contacto_electrico', 'umc_contacto_electrico_accion', 'umc_contacto_electrico_quien', 'umc_contacto_electrico_cuando', 'umc_contacto_electrico_area',
                'umc_otros', 'umc_otros_accion', 'umc_otros_quien', 'umc_otros_cuando', 'umc_otros_area',
                'realizado_por_nombre', 'realizado_por_cargo', 'realizado_por_firma',
                'revisado_por_nombre', 'revisado_por_cargo', 'revisado_por_firma',
                'observaciones'
            ];

            const placeholders = fields.map(() => '?').join(', ');
            const values = fields.map(field => {
                if (field.includes('_condicion') || field.includes('sonda_') || field.includes('ume_') || field.includes('umc_')) {
                    if (field.endsWith('_accion') || field.endsWith('_quien') || field.endsWith('_cuando') || field.endsWith('_area')) {
                        return data[field] || null;
                    }
                    return data[field] || 'BUENO';
                }
                return data[field] || null;
            });

            const [result] = await pool.query(
                `INSERT INTO checklists_maquinaria (${fields.join(', ')}) VALUES (${placeholders})`,
                values
            );

            res.json({ success: true, id: result.insertId });
        } catch (error) {
            console.error('Error creating checklist:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Actualizar checklist
export function updateChecklist(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            // Construir SET dinámicamente
            const fields = [
                'fecha', 'tipo_checklist', 'codigo_checklist', 'anexo', 'revision',
                'realizado_por', 'revisado_por',
                'sonda_botella_vibradora', 'sonda_botella_vibradora_accion', 'sonda_botella_vibradora_quien', 'sonda_botella_vibradora_cuando', 'sonda_botella_vibradora_area',
                'sonda_flexible', 'sonda_flexible_accion', 'sonda_flexible_quien', 'sonda_flexible_cuando', 'sonda_flexible_area',
                'sonda_cuerpo_acople', 'sonda_cuerpo_acople_accion', 'sonda_cuerpo_acople_quien', 'sonda_cuerpo_acople_cuando', 'sonda_cuerpo_acople_area',
                'ume_partidor_proteccion', 'ume_partidor_proteccion_accion', 'ume_partidor_proteccion_quien', 'ume_partidor_proteccion_cuando', 'ume_partidor_proteccion_area',
                'ume_conductor_electrodo', 'ume_conductor_electrodo_accion', 'ume_conductor_electrodo_quien', 'ume_conductor_electrodo_cuando', 'ume_conductor_electrodo_area',
                'ume_enchufe_macho', 'ume_enchufe_macho_accion', 'ume_enchufe_macho_quien', 'ume_enchufe_macho_cuando', 'ume_enchufe_macho_area',
                'ume_ension_tierra', 'ume_ension_tierra_accion', 'ume_ension_tierra_quien', 'ume_ension_tierra_cuando', 'ume_ension_tierra_area',
                'ume_fundamento_giro', 'ume_fundamento_giro_accion', 'ume_fundamento_giro_quien', 'ume_fundamento_giro_cuando', 'ume_fundamento_giro_area',
                'umc_partes_moviles', 'umc_partes_moviles_accion', 'umc_partes_moviles_quien', 'umc_partes_moviles_cuando', 'umc_partes_moviles_area',
                'umc_sectores_calientes', 'umc_sectores_calientes_accion', 'umc_sectores_calientes_quien', 'umc_sectores_calientes_cuando', 'umc_sectores_calientes_area',
                'umc_tubo_escape', 'umc_tubo_escape_accion', 'umc_tubo_escape_quien', 'umc_tubo_escape_cuando', 'umc_tubo_escape_area',
                'umc_motor', 'umc_motor_accion', 'umc_motor_quien', 'umc_motor_cuando', 'umc_motor_area',
                'umc_soportes_motor', 'umc_soportes_motor_accion', 'umc_soportes_motor_quien', 'umc_soportes_motor_cuando', 'umc_soportes_motor_area',
                'umc_estructura_aislada', 'umc_estructura_aislada_accion', 'umc_estructura_aislada_quien', 'umc_estructura_aislada_cuando', 'umc_estructura_aislada_area',
                'umc_contacto_electrico', 'umc_contacto_electrico_accion', 'umc_contacto_electrico_quien', 'umc_contacto_electrico_cuando', 'umc_contacto_electrico_area',
                'umc_otros', 'umc_otros_accion', 'umc_otros_quien', 'umc_otros_cuando', 'umc_otros_area',
                'realizado_por_nombre', 'realizado_por_cargo', 'realizado_por_firma',
                'revisado_por_nombre', 'revisado_por_cargo', 'revisado_por_firma',
                'observaciones'
            ];

            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => data[field] !== undefined ? data[field] : null);
            values.push(id);

            await pool.query(
                `UPDATE checklists_maquinaria SET ${setClause} WHERE id = ?`,
                values
            );

            res.json({ success: true });
        } catch (error) {
            console.error('Error updating checklist:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// ============================================
// REPORTES DIARIOS
// ============================================

// Obtener reportes diarios de una maquinaria
export function getDailyReportsByMachinery(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.query;

            let query = `
                SELECT r.*, 
                       m.nombre as maquinaria_nombre,
                       m.codigo as maquinaria_codigo,
                       p.nombre_completo as chofer_nombre
                FROM reportes_diarios r
                LEFT JOIN maquinaria m ON r.maquinaria_id = m.id
                LEFT JOIN personal p ON r.chofer_id = p.id
                WHERE r.maquinaria_id = ?
            `;

            const params = [id];

            if (startDate && endDate) {
                query += ` AND r.fecha BETWEEN ? AND ?`;
                params.push(startDate, endDate);
            }

            query += ` ORDER BY r.fecha DESC`;

            const [rows] = await pool.query(query, params);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error getting daily reports:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Crear o actualizar reporte diario
export function upsertDailyReport(pool) {
    return async (req, res) => {
        try {
            const data = req.body;

            // Verificar si ya existe un reporte para esta fecha y maquinaria
            const [existing] = await pool.query(
                'SELECT id FROM reportes_diarios WHERE maquinaria_id = ? AND fecha = ?',
                [data.maquinaria_id, data.fecha]
            );

            if (existing.length > 0) {
                // Actualizar
                await pool.query(`
                    UPDATE reportes_diarios SET
                        codigo_maquina = ?, chofer_id = ?,
                        limpieza_lavado_lunes = ?, limpieza_lavado_martes = ?, limpieza_lavado_miercoles = ?, limpieza_lavado_jueves = ?, limpieza_lavado_viernes = ?,
                        nivel_refrigerante_lunes = ?, nivel_refrigerante_martes = ?, nivel_refrigerante_miercoles = ?, nivel_refrigerante_jueves = ?, nivel_refrigerante_viernes = ?,
                        nivel_agua_plumas_lunes = ?, nivel_agua_plumas_martes = ?, nivel_agua_plumas_miercoles = ?, nivel_agua_plumas_jueves = ?, nivel_agua_plumas_viernes = ?,
                        nivel_liquido_frenos_lunes = ?, nivel_liquido_frenos_martes = ?, nivel_liquido_frenos_miercoles = ?, nivel_liquido_frenos_jueves = ?, nivel_liquido_frenos_viernes = ?,
                        nivel_liquido_hidraulico_lunes = ?, nivel_liquido_hidraulico_martes = ?, nivel_liquido_hidraulico_miercoles = ?, nivel_liquido_hidraulico_jueves = ?, nivel_liquido_hidraulico_viernes = ?,
                        nivel_electrolito_bateria_lunes = ?, nivel_electrolito_bateria_martes = ?, nivel_electrolito_bateria_miercoles = ?, nivel_electrolito_bateria_jueves = ?, nivel_electrolito_bateria_viernes = ?,
                        presion_neumaticos_lunes = ?, presion_neumaticos_martes = ?, presion_neumaticos_miercoles = ?, presion_neumaticos_jueves = ?, presion_neumaticos_viernes = ?,
                        fugas_carter_lunes = ?, fugas_carter_martes = ?, fugas_carter_miercoles = ?, fugas_carter_jueves = ?, fugas_carter_viernes = ?,
                        fugas_direccion_lunes = ?, fugas_direccion_martes = ?, fugas_direccion_miercoles = ?, fugas_direccion_jueves = ?, fugas_direccion_viernes = ?,
                        fugas_mangueras_frenos_lunes = ?, fugas_mangueras_frenos_martes = ?, fugas_mangueras_frenos_miercoles = ?, fugas_mangueras_frenos_jueves = ?, fugas_mangueras_frenos_viernes = ?,
                        fugas_combustible_lunes = ?, fugas_combustible_martes = ?, fugas_combustible_miercoles = ?, fugas_combustible_jueves = ?, fugas_combustible_viernes = ?,
                        fugas_agua_lunes = ?, fugas_agua_martes = ?, fugas_agua_miercoles = ?, fugas_agua_jueves = ?, fugas_agua_viernes = ?,
                        luces_interiores_lunes = ?, luces_interiores_martes = ?, luces_interiores_miercoles = ?, luces_interiores_jueves = ?, luces_interiores_viernes = ?,
                        luces_exteriores_lunes = ?, luces_exteriores_martes = ?, luces_exteriores_miercoles = ?, luces_exteriores_jueves = ?, luces_exteriores_viernes = ?,
                        estabilidad_motor_lunes = ?, estabilidad_motor_martes = ?, estabilidad_motor_miercoles = ?, estabilidad_motor_jueves = ?, estabilidad_motor_viernes = ?,
                        temperatura_motor_lunes = ?, temperatura_motor_martes = ?, temperatura_motor_miercoles = ?, temperatura_motor_jueves = ?, temperatura_motor_viernes = ?,
                        sonidos_raros_lunes = ?, sonidos_raros_martes = ?, sonidos_raros_miercoles = ?, sonidos_raros_jueves = ?, sonidos_raros_viernes = ?,
                        observaciones = ?
                    WHERE id = ?
                `, [
                    data.codigo_maquina, data.chofer_id,
                    ...getDailyReportValues(data),
                    data.observaciones,
                    existing[0].id
                ]);

                res.json({ success: true, id: existing[0].id, updated: true });
            } else {
                // Insertar
                const [result] = await pool.query(`
                    INSERT INTO reportes_diarios (
                        maquinaria_id, fecha, codigo_maquina, chofer_id,
                        limpieza_lavado_lunes, limpieza_lavado_martes, limpieza_lavado_miercoles, limpieza_lavado_jueves, limpieza_lavado_viernes,
                        nivel_refrigerante_lunes, nivel_refrigerante_martes, nivel_refrigerante_miercoles, nivel_refrigerante_jueves, nivel_refrigerante_viernes,
                        nivel_agua_plumas_lunes, nivel_agua_plumas_martes, nivel_agua_plumas_miercoles, nivel_agua_plumas_jueves, nivel_agua_plumas_viernes,
                        nivel_liquido_frenos_lunes, nivel_liquido_frenos_martes, nivel_liquido_frenos_miercoles, nivel_liquido_frenos_jueves, nivel_liquido_frenos_viernes,
                        nivel_liquido_hidraulico_lunes, nivel_liquido_hidraulico_martes, nivel_liquido_hidraulico_miercoles, nivel_liquido_hidraulico_jueves, nivel_liquido_hidraulico_viernes,
                        nivel_electrolito_bateria_lunes, nivel_electrolito_bateria_martes, nivel_electrolito_bateria_miercoles, nivel_electrolito_bateria_jueves, nivel_electrolito_bateria_viernes,
                        presion_neumaticos_lunes, presion_neumaticos_martes, presion_neumaticos_miercoles, presion_neumaticos_jueves, presion_neumaticos_viernes,
                        fugas_carter_lunes, fugas_carter_martes, fugas_carter_miercoles, fugas_carter_jueves, fugas_carter_viernes,
                        fugas_direccion_lunes, fugas_direccion_martes, fugas_direccion_miercoles, fugas_direccion_jueves, fugas_direccion_viernes,
                        fugas_mangueras_frenos_lunes, fugas_mangueras_frenos_martes, fugas_mangueras_frenos_miercoles, fugas_mangueras_frenos_jueves, fugas_mangueras_frenos_viernes,
                        fugas_combustible_lunes, fugas_combustible_martes, fugas_combustible_miercoles, fugas_combustible_jueves, fugas_combustible_viernes,
                        fugas_agua_lunes, fugas_agua_martes, fugas_agua_miercoles, fugas_agua_jueves, fugas_agua_viernes,
                        luces_interiores_lunes, luces_interiores_martes, luces_interiores_miercoles, luces_interiores_jueves, luces_interiores_viernes,
                        luces_exteriores_lunes, luces_exteriores_martes, luces_exteriores_miercoles, luces_exteriores_jueves, luces_exteriores_viernes,
                        estabilidad_motor_lunes, estabilidad_motor_martes, estabilidad_motor_miercoles, estabilidad_motor_jueves, estabilidad_motor_viernes,
                        temperatura_motor_lunes, temperatura_motor_martes, temperatura_motor_miercoles, temperatura_motor_jueves, temperatura_motor_viernes,
                        sonidos_raros_lunes, sonidos_raros_martes, sonidos_raros_miercoles, sonidos_raros_jueves, sonidos_raros_viernes,
                        observaciones
                    ) VALUES (?, ?, ?, ?, ${Array(85).fill('?').join(', ')}, ?)
                `, [
                    data.maquinaria_id, data.fecha, data.codigo_maquina, data.chofer_id,
                    ...getDailyReportValues(data),
                    data.observaciones
                ]);

                res.json({ success: true, id: result.insertId, updated: false });
            }
        } catch (error) {
            console.error('Error upserting daily report:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}

// Helper function to extract daily report values
function getDailyReportValues(data) {
    const activities = [
        'limpieza_lavado', 'nivel_refrigerante', 'nivel_agua_plumas', 'nivel_liquido_frenos',
        'nivel_liquido_hidraulico', 'nivel_electrolito_bateria', 'presion_neumaticos',
        'fugas_carter', 'fugas_direccion', 'fugas_mangueras_frenos', 'fugas_combustible',
        'fugas_agua', 'luces_interiores', 'luces_exteriores', 'estabilidad_motor',
        'temperatura_motor', 'sonidos_raros'
    ];

    const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
    const values = [];

    activities.forEach(activity => {
        days.forEach(day => {
            values.push(data[`${activity}_${day}`] || null);
        });
    });

    return values;
}

// ============================================
// HISTORIAL DE MANTENIMIENTO
// ============================================

// Obtener historial completo de una maquinaria
export function getMachineryHistory(pool) {
    return async (req, res) => {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.query;

            let query = `
                SELECT m.*,
                       maq.nombre as maquinaria_nombre,
                       maq.codigo as maquinaria_codigo,
                       maq.modelo as modelo_motor
                FROM mantenimientos m
                LEFT JOIN maquinaria maq ON m.maquinaria_id = maq.id
                WHERE m.maquinaria_id = ?
            `;

            const params = [id];

            if (startDate && endDate) {
                query += ` AND m.fecha_ejecucion BETWEEN ? AND ?`;
                params.push(startDate, endDate);
            }

            query += ` ORDER BY m.fecha_ejecucion DESC`;

            const [rows] = await pool.query(query, params);

            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error getting machinery history:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    };
}
