import React from 'react';
import { useToast } from './Toast';
import { safeParseFloat, safeFormatCurrency, safeFormatNumber, safeParseInt } from '../utils/formatters';
import '../pages/Maintenance.css';

function MaintenancePlanViewer({ plan, onReload, onEdit, onDelete, onCreate }) {
    const toast = useToast();

    if (!plan || !plan.actividades || plan.actividades.length === 0) {
        return (
            <div className="empty-plan">
                <div className="empty-icon">📋</div>
                <h3>Sin actividades de mantenimiento</h3>
                <p>Este plan no tiene actividades registradas</p>
                <button className="btn btn-primary" onClick={() => onEdit && onEdit(plan)}>
                    ➕ Agregar Actividad
                </button>
            </div>
        );
    }

    const calcularCostoTotal = () => {
        try {
            const total = plan.actividades.reduce((total, act) => {
                let costoInsumos = 0;

                // Calcular costo de insumos si existe insumos_data
                if (act.insumos_data && act.insumos_data.trim() !== '') {
                    try {
                        costoInsumos = act.insumos_data.split('||').reduce((sum, insumo) => {
                            if (!insumo || insumo.trim() === '') return sum;
                            const parts = insumo.split(':');
                            if (parts.length < 2) return sum;

                            const cantidad = safeParseFloat(parts[1]);
                            // Nota: parts[3] es especificaciones, no precio
                            // El precio debería venir de otra fuente o calcularse diferente
                            // Por ahora, solo usamos costo_estimado de la actividad

                            return sum; // No sumamos nada de insumos_data por ahora
                        }, 0);
                    } catch (e) {
                        console.warn('Error calculando costo insumos:', e);
                        costoInsumos = 0;
                    }
                }

                // Calcular costo estimado de la actividad
                let costoEstimado = 0;
                if (act.costo_estimado !== null && act.costo_estimado !== undefined && act.costo_estimado !== '') {
                    costoEstimado = safeParseFloat(act.costo_estimado);
                    if (costoEstimado <= 0) {
                        costoEstimado = 0;
                    }
                }

                // Sumar solo si ambos valores son válidos
                const sumaActividad = costoEstimado + (isNaN(costoInsumos) ? 0 : costoInsumos);
                return total + (isNaN(sumaActividad) ? 0 : sumaActividad);
            }, 0);

            // Asegurar que siempre retornamos un número válido
            return isNaN(total) ? 0 : total;
        } catch (error) {
            console.error('Error en calcularCostoTotal:', error);
            return 0;
        }
    };

    return (
        <div className="plan-viewer">
            <div className="plan-header-info">
                <div className="plan-info-card">
                    <h3>{plan.nombre_plan}</h3>
                    <div className="plan-meta">
                        <span className={`plan-type-badge type-${plan.tipo_mantenimiento?.toLowerCase()}`}>
                            {plan.tipo_mantenimiento === 'PREVENTIVO' ? '🛡️ Preventivo' :
                                plan.tipo_mantenimiento === 'CORRECTIVO' ? '🔧 Correctivo' :
                                    '⚡ Proactivo'}
                        </span>
                        {plan.maquinaria_nombre && (
                            <span className="plan-machinery">🚜 {plan.maquinaria_nombre}</span>
                        )}
                    </div>
                </div>
                <div className="plan-stats">
                    <div className="plan-stat">
                        <span className="plan-stat-value">{plan.actividades.length}</span>
                        <span className="plan-stat-label">Actividades</span>
                    </div>
                    {(() => {
                        const costoTotal = calcularCostoTotal();
                        const formatted = safeFormatCurrency(costoTotal);
                        return formatted && (
                            <div className="plan-stat cost-stat">
                                <span className="plan-stat-value">
                                    {formatted}
                                </span>
                                <span className="plan-stat-label">Costo Estimado</span>
                            </div>
                        );
                    })()}
                </div>
                <div className="plan-actions">
                    <button className="btn btn-secondary" onClick={() => onEdit && onEdit(plan)}>
                        ✏️ Editar Plan
                    </button>
                    <button className="btn btn-danger" onClick={() => {
                        if (window.confirm('¿Eliminar este plan de mantenimiento?')) {
                            onDelete && onDelete(plan.id);
                        }
                    }}>
                        🗑️ Eliminar
                    </button>
                </div>
            </div>

            <div className="plan-table-wrapper">
                <div className="table-header-actions">
                    <button className="btn btn-primary" onClick={() => onCreate && onCreate('activity')}>
                        ➕ Agregar Actividad
                    </button>
                </div>
                <table className="plan-table">
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>N°</th>
                            <th style={{ width: '18%' }}>Componente</th>
                            <th style={{ width: '20%' }}>Actividad</th>
                            <th style={{ width: '12%' }}>Tiempo</th>
                            <th style={{ width: '15%' }}>Insumos</th>
                            <th style={{ width: '15%' }}>Herramientas</th>
                            <th style={{ width: '10%' }}>Costo (Bs.)</th>
                            <th style={{ width: '5%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plan.actividades.map((act, idx) => {
                            const tiempoMin = act.tiempo_min;
                            const tiempoProm = act.tiempo_promedio;
                            const tiempoMax = act.tiempo_max;

                            // Parsear insumos - formato: nombre|cantidad|unidad|costo_unitario|costo_total;;...
                            const insumos = act.insumos_data ?
                                act.insumos_data.split(';;').filter(i => i.trim()).map(insumo => {
                                    const parts = insumo.split('|');
                                    return {
                                        nombre: parts[0] || '',
                                        cantidad: parts[1] || '',
                                        unidad: parts[2] || '',
                                        costo_unitario: safeParseFloat(parts[3]),
                                        costo_total: safeParseFloat(parts[4])
                                    };
                                }) : [];

                            // Parsear herramientas - formato: nombre|cantidad|especificaciones;;...
                            const herramientas = act.herramientas_data ?
                                act.herramientas_data.split(';;').filter(h => h.trim()).map(herramienta => {
                                    const parts = herramienta.split('|');
                                    return {
                                        nombre: parts[0] || '',
                                        cantidad: parts[1] || '1',
                                        especificaciones: parts[2] || ''
                                    };
                                }) : [];

                            const costoInsumos = insumos.reduce((sum, insumo) => {
                                return sum + (insumo.costo_total || 0);
                            }, 0);

                            const costoEstimado = safeParseFloat(act.costo_estimado);
                            const costoTotal = costoEstimado;

                            return (
                                <tr key={idx}>
                                    <td className="num-cell">
                                        {idx + 1}
                                    </td>
                                    <td className="desc-cell" title={act.descripcion_componente || '-'}>
                                        {act.descripcion_componente || '-'}
                                    </td>
                                    <td className="act-cell" title={act.actividad || '-'}>
                                        {act.actividad || '-'}
                                    </td>
                                    <td className="time-cell">
                                        <div className="time-values">
                                            {tiempoMin && tiempoMin > 0 && <span className="time-tag min">Mín: {tiempoMin} min</span>}
                                            {tiempoProm && tiempoProm > 0 && <span className="time-tag prom">Prom: {tiempoProm} min</span>}
                                            {tiempoMax && tiempoMax > 0 && <span className="time-tag max">Máx: {tiempoMax} min</span>}
                                            {(!tiempoMin || tiempoMin <= 0) && (!tiempoProm || tiempoProm <= 0) && (!tiempoMax || tiempoMax <= 0) && <span className="no-data">-</span>}
                                        </div>
                                    </td>
                                    <td className="supplies-cell">
                                        {insumos.length > 0 ? (
                                            <div className="supply-info">
                                                {insumos.slice(0, 3).map((insumo, i) => (
                                                    <div key={i} className="supply-item" title={`${insumo.nombre}: ${insumo.cantidad} ${insumo.unidad} - Bs. ${safeFormatNumber(insumo.costo_total, {decimals: 2})}`}>
                                                        <span className="supply-name">
                                                            {insumo.nombre.length > 25 ? insumo.nombre.substring(0, 25) + '...' : insumo.nombre}
                                                        </span>
                                                        <span className="supply-detail">
                                                            {safeParseFloat(insumo.cantidad) > 0 && <span className="supply-qty">{insumo.cantidad}</span>}
                                                            {insumo.unidad && <span className="supply-unit">{insumo.unidad}</span>}
                                                            {insumo.costo_total > 0 && <span className="supply-cost">Bs. {safeFormatNumber(insumo.costo_total, {decimals: 2})}</span>}
                                                        </span>
                                                    </div>
                                                ))}
                                                {insumos.length > 3 && (
                                                    <div className="supply-more">+{insumos.length - 3} más...</div>
                                                )}
                                            </div>
                                        ) : <span className="no-data">-</span>}
                                    </td>
                                    <td className="tools-cell">
                                        {herramientas.length > 0 ? (
                                            <div className="tool-info">
                                                {herramientas.slice(0, 3).map((herramienta, i) => (
                                                    <div key={i} className="tool-item" title={herramienta.nombre}>
                                                        <span className="tool-name">
                                                            {herramienta.nombre.length > 25 ? herramienta.nombre.substring(0, 25) + '...' : herramienta.nombre}
                                                        </span>
                                                        {safeParseInt(herramienta.cantidad) > 1 && <span className="tool-qty">x{herramienta.cantidad}</span>}
                                                    </div>
                                                ))}
                                                {herramientas.length > 3 && (
                                                    <div className="tool-more">+{herramientas.length - 3} más...</div>
                                                )}
                                            </div>
                                        ) : <span className="no-data">-</span>}
                                    </td>
                                    <td className="cost-cell">
                                        {(costoTotal > 0 || costoInsumos > 0) ? (
                                            <div className="cost-info">
                                                <span className="cost-value">
                                                    {safeFormatCurrency(costoTotal) || '-'}
                                                </span>
                                                {costoInsumos > 0 && (
                                                    <span className="cost-breakdown" title="Costo de insumos">
                                                        📦 {safeFormatCurrency(costoInsumos)}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="no-data">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => onEdit && onEdit(plan, 'activity', act)}
                                                title="Editar actividad"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => {
                                                    if (window.confirm('¿Eliminar esta actividad?')) {
                                                        onDelete && onDelete(act.id, 'activity');
                                                    }
                                                }}
                                                title="Eliminar actividad"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MaintenancePlanViewer;
