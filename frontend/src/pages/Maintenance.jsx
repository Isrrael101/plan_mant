import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { safeParseFloat, safeFormatCurrency, safeFormatNumber, safeFormatInteger, safeParseInt } from '../utils/formatters';
import './Maintenance.css';

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
                                        {act.numero_orden || idx + 1}
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

function Maintenance() {
    const [plans, setPlans] = useState([]);
    const [maintenances, setMaintenances] = useState([]);
    const [machinery, setMachinery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [planData, setPlanData] = useState(null);
    const [activeTab, setActiveTab] = useState('plans');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('plan'); // 'plan', 'activity', 'maintenance'
    const [editingItem, setEditingItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({});
    const toast = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [plansData, maintenancesData, machineryData] = await Promise.all([
                api.getPlans(),
                api.getMaintenance(),
                api.getMachinery()
            ]);

            if (plansData.success) {
                setPlans(plansData.data || []);
            }

            if (maintenancesData.success) {
                setMaintenances(maintenancesData.data || []);
            }

            if (machineryData.success) {
                setMachinery(machineryData.data || []);
            }

            setError(null);
        } catch (err) {
            setError('Error al cargar datos');
            toast.error('Error al cargar planes de mantenimiento');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewPlan = async (planId) => {
        try {
            setLoading(true);
            const data = await api.getPlanById(planId);
            if (data.success) {
                setPlanData(data.data);
                setSelectedPlan(planId);
            }
        } catch (err) {
            toast.error('Error al cargar plan');
            console.error('Error al cargar plan:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = (type) => {
        setModalType(type);
        setEditingItem(null);
        if (type === 'plan') {
            setFormData({
                nombre_plan: '',
                maquinaria_id: '',
                tipo_mantenimiento: 'PREVENTIVO',
                tipo_plan: 'POR_HORAS',
                horas_operacion: '',
                intervalo_dias: '',
                descripcion: '',
                activo: true
            });
        } else if (type === 'activity') {
            setFormData({
                plan_id: selectedPlan || '',
                numero_orden: '',
                descripcion_componente: '',
                actividad: '',
                tiempo_min: '',
                tiempo_promedio: '',
                tiempo_max: '',
                costo_estimado: ''
            });
        } else if (type === 'maintenance') {
            setFormData({
                maquinaria_id: '',
                plan_id: '',
                tipo_mantenimiento: 'PREVENTIVO',
                fecha_programada: '',
                fecha_ejecucion: '',
                horas_maquina: '',
                observaciones: '',
                estado: 'PROGRAMADO',
                costo_mano_obra: '',
                costo_insumos: ''
            });
        }
        setShowModal(true);
    };

    const handleEdit = async (plan, type = 'plan', activity = null, maintenance = null) => {
        if (type === 'activity' && activity) {
            setModalType('activity');
            setEditingItem(activity.id);
            setFormData({
                plan_id: plan.id,
                numero_orden: activity.numero_orden || '',
                descripcion_componente: activity.descripcion_componente || '',
                actividad: activity.actividad || '',
                tiempo_min: activity.tiempo_min || '',
                tiempo_promedio: activity.tiempo_promedio || '',
                tiempo_max: activity.tiempo_max || '',
                costo_estimado: activity.costo_estimado || ''
            });
            setShowModal(true);
        } else if (type === 'plan') {
            setModalType('plan');
            setEditingItem(plan.id);
            setFormData({
                nombre_plan: plan.nombre_plan || '',
                maquinaria_id: plan.maquinaria_id || '',
                tipo_mantenimiento: plan.tipo_mantenimiento || 'PREVENTIVO',
                tipo_plan: plan.tipo_plan || 'POR_HORAS',
                horas_operacion: plan.horas_operacion || '',
                intervalo_dias: plan.intervalo_dias || '',
                descripcion: plan.descripcion || '',
                activo: plan.activo !== undefined ? plan.activo : true
            });
            setShowModal(true);
        } else if (type === 'maintenance' && maintenance) {
            setModalType('maintenance');
            setEditingItem(maintenance.id);
            setFormData({
                maquinaria_id: maintenance.maquinaria_id || '',
                plan_id: maintenance.plan_id || '',
                tipo_mantenimiento: maintenance.tipo_mantenimiento || 'PREVENTIVO',
                fecha_programada: maintenance.fecha_programada ? maintenance.fecha_programada.split('T')[0] : '',
                fecha_ejecucion: maintenance.fecha_ejecucion ? maintenance.fecha_ejecucion.split('T')[0] : '',
                horas_maquina: maintenance.horas_maquina || '',
                observaciones: maintenance.observaciones || '',
                estado: maintenance.estado || 'PROGRAMADO',
                costo_mano_obra: maintenance.costo_mano_obra || '',
                costo_insumos: maintenance.costo_insumos || ''
            });
            setShowModal(true);
        }
    };

    const handleDelete = async (id, type = 'plan') => {
        try {
            if (type === 'plan') {
                await api.deletePlan(id);
                toast.success('Plan eliminado correctamente');
            } else if (type === 'activity') {
                await api.deleteActivity(id);
                toast.success('Actividad eliminada correctamente');
            } else if (type === 'maintenance') {
                await api.deleteMaintenance(id);
                toast.success('Mantenimiento eliminado correctamente');
            }
            await loadData();
            if (selectedPlan === id && type === 'plan') {
                setSelectedPlan(null);
                setPlanData(null);
            } else if (selectedPlan && type === 'activity') {
                await handleViewPlan(selectedPlan);
            }
        } catch (err) {
            toast.error('Error al eliminar: ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (modalType === 'plan') {
                const data = {
                    ...formData,
                    maquinaria_id: formData.maquinaria_id ? safeParseInt(formData.maquinaria_id) : null,
                    horas_operacion: formData.horas_operacion ? safeParseInt(formData.horas_operacion) : null,
                    intervalo_dias: formData.intervalo_dias ? safeParseInt(formData.intervalo_dias) : null
                };

                if (editingItem) {
                    await api.updatePlan(editingItem, data);
                    toast.success('Plan actualizado correctamente');
                } else {
                    await api.createPlan(data);
                    toast.success('Plan creado correctamente');
                }
            } else if (modalType === 'activity') {
                const costo = safeParseFloat(formData.costo_estimado);
                if (costo <= 0) {
                    toast.error('El costo estimado debe ser mayor a cero');
                    setIsSubmitting(false);
                    return;
                }

                const data = {
                    ...formData,
                    plan_id: safeParseInt(formData.plan_id),
                    numero_orden: formData.numero_orden ? safeParseInt(formData.numero_orden) : null,
                    tiempo_min: formData.tiempo_min ? safeParseInt(formData.tiempo_min) : null,
                    tiempo_promedio: formData.tiempo_promedio ? safeParseInt(formData.tiempo_promedio) : null,
                    tiempo_max: formData.tiempo_max ? safeParseInt(formData.tiempo_max) : null,
                    costo_estimado: costo
                };

                if (editingItem) {
                    await api.updateActivity(editingItem, data);
                    toast.success('Actividad actualizada correctamente');
                } else {
                    await api.createActivity(data);
                    toast.success('Actividad creada correctamente');
                }
            } else if (modalType === 'maintenance') {
                // Validar costos si están completados
                let costoManoObra = null;
                let costoInsumos = null;

                if (formData.estado === 'COMPLETADO') {
                    costoManoObra = safeParseFloat(formData.costo_mano_obra);
                    costoInsumos = safeParseFloat(formData.costo_insumos);

                    if (costoManoObra <= 0) {
                        toast.error('El costo de mano de obra debe ser mayor a cero para mantenimientos completados');
                        setIsSubmitting(false);
                        return;
                    }

                    if (costoInsumos <= 0) {
                        toast.error('El costo de insumos debe ser mayor a cero para mantenimientos completados');
                        setIsSubmitting(false);
                        return;
                    }
                } else {
                    // Para estados no completados, permitir valores null o 0
                    costoManoObra = formData.costo_mano_obra ? safeParseFloat(formData.costo_mano_obra) : null;
                    costoInsumos = formData.costo_insumos ? safeParseFloat(formData.costo_insumos) : null;
                }

                const data = {
                    ...formData,
                    maquinaria_id: safeParseInt(formData.maquinaria_id),
                    plan_id: formData.plan_id ? safeParseInt(formData.plan_id) : null,
                    horas_maquina: formData.horas_maquina ? safeParseFloat(formData.horas_maquina) : null,
                    fecha_programada: formData.fecha_programada || null,
                    fecha_ejecucion: formData.fecha_ejecucion || null,
                    costo_mano_obra: costoManoObra,
                    costo_insumos: costoInsumos
                };

                if (editingItem) {
                    await api.updateMaintenance(editingItem, data);
                    toast.success('Mantenimiento actualizado correctamente');
                } else {
                    await api.createMaintenance(data);
                    toast.success('Mantenimiento creado correctamente');
                }
            }

            setShowModal(false);
            await loadData();
            if (selectedPlan && modalType === 'activity') {
                await handleViewPlan(selectedPlan);
            }
        } catch (err) {
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const categorizePlans = (plans) => {
        const categorized = {
            'Preventivo 10 Horas': [],
            'Preventivo 50 Horas': [],
            'Preventivo 250 Horas': [],
            'Preventivo 500 Horas': [],
            'Preventivo 1000 Horas': [],
            'Preventivo 2000 Horas': [],
            'Preventivo (Otros)': [],
            'Correctivos': [],
            'Proactivos': [],
            'Otros': []
        };

        plans.forEach(plan => {
            const tipo = plan.tipo_mantenimiento?.toUpperCase();
            if (tipo === 'PREVENTIVO') {
                const horas = safeParseInt(plan.horas_operacion);
                if (horas === 10) categorized['Preventivo 10 Horas'].push(plan);
                else if (horas === 50) categorized['Preventivo 50 Horas'].push(plan);
                else if (horas === 250) categorized['Preventivo 250 Horas'].push(plan);
                else if (horas === 500) categorized['Preventivo 500 Horas'].push(plan);
                else if (horas === 1000) categorized['Preventivo 1000 Horas'].push(plan);
                else if (horas === 2000) categorized['Preventivo 2000 Horas'].push(plan);
                else categorized['Preventivo (Otros)'].push(plan);
            } else if (tipo === 'CORRECTIVO') {
                categorized['Correctivos'].push(plan);
            } else if (tipo === 'PROACTIVO') {
                categorized['Proactivos'].push(plan);
            } else {
                categorized['Otros'].push(plan);
            }
        });

        // Eliminar categorías vacías EXCEPTO las de preventivos por horas específicas
        const keepCategories = [
            'Preventivo 10 Horas',
            'Preventivo 50 Horas',
            'Preventivo 250 Horas',
            'Preventivo 500 Horas',
            'Preventivo 1000 Horas',
            'Preventivo 2000 Horas'
        ];

        Object.keys(categorized).forEach(key => {
            if (categorized[key].length === 0 && !keepCategories.includes(key)) {
                delete categorized[key];
            }
        });

        return categorized;
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const getIcon = (type) => {
        if (type.startsWith('Preventivo')) return '🛡️';
        const icons = {
            'Correctivos': '🔧',
            'Proactivos': '⚡',
            'Otros': '📋'
        };
        return icons[type] || '📋';
    };

    const filteredPlans = plans.filter(plan =>
        plan.nombre_plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plan.maquinaria_nombre && plan.maquinaria_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredMaintenances = maintenances.filter(maint => {
        const matchesSearch =
            (maint.maquinaria_nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (maint.nombre_plan || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || maint.tipo_mantenimiento === filterType;
        return matchesSearch && matchesType;
    });

    const planCategories = categorizePlans(filteredPlans);

    if (loading && !planData) return <Loading message="Cargando planes de mantenimiento" />;

    if (error) {
        return (
            <div className="container fade-in">
                <div className="error-message">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadData}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container fade-in">
            <div className="page-header">
                <div>
                    <h1>📅 Planes de Mantenimiento</h1>
                    <p className="page-subtitle">
                        Gestión de mantenimiento preventivo, correctivo y proactivo
                    </p>
                </div>
                <div className="page-actions">
                    <button className="btn btn-primary" onClick={() => handleCreate('plan')}>
                        ➕ Nuevo Plan
                    </button>
                    {activeTab === 'executions' && (
                        <button className="btn btn-secondary" onClick={() => handleCreate('maintenance')}>
                            ➕ Nuevo Mantenimiento
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="maintenance-tabs">
                <button
                    className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                >
                    <span>📋</span> Planes ({plans.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'executions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('executions')}
                >
                    <span>🔧</span> Mantenimientos ({maintenances.length})
                </button>
            </div>

            <div className="maintenance-layout">
                {/* Sidebar */}
                <aside className="maintenance-sidebar">
                    <div className="sidebar-header">
                        <h3>
                            {activeTab === 'plans' ? '📋 Planes' : '🔧 Mantenimientos'}
                        </h3>
                        <span className="doc-count">
                            {activeTab === 'plans' ? plans.length : maintenances.length}
                        </span>
                    </div>

                    <div className="sidebar-search">
                        <input
                            type="text"
                            placeholder={activeTab === 'plans' ? 'Buscar plan...' : 'Buscar mantenimiento...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="sidebar-search-input"
                        />
                    </div>

                    {activeTab === 'executions' && (
                        <div className="sidebar-filters">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Todos los tipos</option>
                                <option value="PREVENTIVO">Preventivo</option>
                                <option value="CORRECTIVO">Correctivo</option>
                                <option value="PROACTIVO">Proactivo</option>
                            </select>
                        </div>
                    )}

                    <nav className="sidebar-nav">
                        {activeTab === 'plans' ? (
                            Object.keys(planCategories).length > 0 ? (
                                Object.entries(planCategories)
                                    .sort(([a], [b]) => {
                                        const order = [
                                            'Preventivo 10 Horas',
                                            'Preventivo 50 Horas',
                                            'Preventivo 250 Horas',
                                            'Preventivo 500 Horas',
                                            'Preventivo 1000 Horas',
                                            'Preventivo 2000 Horas',
                                            'Preventivo (Otros)',
                                            'Correctivos',
                                            'Proactivos',
                                            'Otros'
                                        ];
                                        const indexA = order.indexOf(a);
                                        const indexB = order.indexOf(b);

                                        // Si ambos están en la lista, ordenar por índice
                                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                        // Si solo A está en la lista, A va primero
                                        if (indexA !== -1) return -1;
                                        // Si solo B está en la lista, B va primero
                                        if (indexB !== -1) return 1;
                                        // Si ninguno está, ordenar alfabéticamente
                                        return a.localeCompare(b);
                                    })
                                    .map(([category, categoryPlans]) => {
                                        const isExpanded = expandedCategories[category];
                                        return (
                                            <div key={category} className="nav-category">
                                                <button
                                                    className={`category-header ${isExpanded ? 'expanded' : ''}`}
                                                    onClick={() => toggleCategory(category)}
                                                >
                                                    <span className="category-icon">{getIcon(category)}</span>
                                                    <span className="category-name">{category}</span>
                                                    <span className="category-count">{categoryPlans.length}</span>
                                                    <span className="category-arrow">▼</span>
                                                </button>

                                                {isExpanded && (
                                                    <ul className="category-items">
                                                        {categoryPlans.map((plan) => (
                                                            <li key={plan.id}>
                                                                <button
                                                                    className={`sheet-btn ${selectedPlan === plan.id ? 'active' : ''}`}
                                                                    onClick={() => handleViewPlan(plan.id)}
                                                                >
                                                                    <span className="sheet-icon">📄</span>
                                                                    <span className="sheet-name">{plan.nombre_plan}</span>
                                                                    {plan.maquinaria_nombre && (
                                                                        <span className="sheet-machinery">{plan.maquinaria_nombre}</span>
                                                                    )}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className="no-results">
                                    <p>No se encontraron planes</p>
                                </div>
                            )
                        ) : (
                            <div className="no-results">
                                <p>Selecciona un mantenimiento para ver detalles</p>
                            </div>
                        )}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="maintenance-content">
                    {selectedPlan && planData ? (
                        <div className="sheet-view">
                            <header className="sheet-header">
                                <div className="sheet-info">
                                    <h2>{planData.nombre_plan}</h2>
                                    <p>
                                        {planData.tipo_mantenimiento === 'PREVENTIVO' ? '🛡️ Mantenimiento Preventivo' :
                                            planData.tipo_mantenimiento === 'CORRECTIVO' ? '🔧 Mantenimiento Correctivo' :
                                                '⚡ Mantenimiento Proactivo'}
                                        {planData.maquinaria_nombre && ` - ${planData.maquinaria_nombre}`}
                                    </p>
                                </div>
                                <button className="btn btn-secondary" onClick={() => {
                                    setSelectedPlan(null);
                                    setPlanData(null);
                                }}>
                                    ← Volver
                                </button>
                            </header>

                            <MaintenancePlanViewer
                                plan={planData}
                                onReload={() => handleViewPlan(selectedPlan)}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onCreate={handleCreate}
                            />
                        </div>
                    ) : activeTab === 'executions' ? (
                        <div className="maintenances-table-view">
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '5%' }}>N°</th>
                                            <th style={{ width: '12%' }}>Tipo</th>
                                            <th style={{ width: '18%' }}>Maquinaria</th>
                                            <th style={{ width: '15%' }}>Plan</th>
                                            <th style={{ width: '10%' }}>Fecha Prog.</th>
                                            <th style={{ width: '10%' }}>Fecha Ejec.</th>
                                            <th style={{ width: '8%' }}>Estado</th>
                                            <th style={{ width: '10%' }}>Costo Total</th>
                                            <th style={{ width: '12%' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMaintenances.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="empty-row">
                                                    <div className="empty-state">
                                                        <div className="empty-icon">🔧</div>
                                                        <p>No se encontraron mantenimientos</p>
                                                        <button className="btn btn-primary" onClick={() => handleCreate('maintenance')}>
                                                            ➕ Crear Mantenimiento
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredMaintenances.map((maint, index) => (
                                                <tr key={maint.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <span className={`badge ${maint.tipo_mantenimiento === 'PREVENTIVO' ? 'badge-info' :
                                                            maint.tipo_mantenimiento === 'CORRECTIVO' ? 'badge-warning' :
                                                                'badge-success'
                                                            }`}>
                                                            {maint.tipo_mantenimiento === 'PREVENTIVO' ? '🛡️ Preventivo' :
                                                                maint.tipo_mantenimiento === 'CORRECTIVO' ? '🔧 Correctivo' :
                                                                    '⚡ Proactivo'}
                                                        </span>
                                                    </td>
                                                    <td className="item-name" title={maint.maquinaria_nombre || 'Sin maquinaria'}>
                                                        {maint.maquinaria_nombre || 'Sin maquinaria'}
                                                    </td>
                                                    <td>{maint.nombre_plan || '-'}</td>
                                                    <td>
                                                        {maint.fecha_programada ?
                                                            new Date(maint.fecha_programada).toLocaleDateString('es-BO') :
                                                            '-'}
                                                    </td>
                                                    <td>
                                                        {maint.fecha_ejecucion ?
                                                            new Date(maint.fecha_ejecucion).toLocaleDateString('es-BO') :
                                                            '-'}
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${maint.estado === 'COMPLETADO' ? 'badge-success' :
                                                            maint.estado === 'EN_PROCESO' ? 'badge-warning' :
                                                                maint.estado === 'CANCELADO' ? 'badge-error' :
                                                                    'badge-info'
                                                            }`}>
                                                            {maint.estado === 'COMPLETADO' ? '✅' :
                                                                maint.estado === 'EN_PROCESO' ? '🔄' :
                                                                    maint.estado === 'CANCELADO' ? '❌' :
                                                                        '📅'} {maint.estado}
                                                        </span>
                                                    </td>
                                                    <td className="cost-cell">
                                                        {safeFormatCurrency(maint.costo_total) ? (
                                                            <span className="cost-value">
                                                                {safeFormatCurrency(maint.costo_total)}
                                                            </span>
                                                        ) : (
                                                            <span className="no-data">-</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-action btn-edit"
                                                                onClick={() => handleEdit(null, 'maintenance', null, maint)}
                                                                title="Editar mantenimiento"
                                                            >
                                                                ✏️
                                                            </button>
                                                            <button
                                                                className="btn-action btn-delete"
                                                                onClick={() => {
                                                                    if (window.confirm('¿Eliminar este mantenimiento?')) {
                                                                        handleDelete(maint.id, 'maintenance');
                                                                    }
                                                                }}
                                                                title="Eliminar mantenimiento"
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredMaintenances.length > 0 && (
                                <div className="results-count">
                                    Mostrando {filteredMaintenances.length} mantenimiento(s)
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="welcome-view">
                            {activeTab === 'plans' ? (
                                <>
                                    <div className="welcome-icon">📋</div>
                                    <h3>Selecciona un plan</h3>
                                    <p>Elige un plan de mantenimiento del menú lateral para visualizarlo o crea uno nuevo</p>
                                    <div className="quick-stats">
                                        <div className="quick-stat">
                                            <span className="qs-value">{Object.keys(planCategories).length}</span>
                                            <span className="qs-label">Categorías</span>
                                        </div>
                                        <div className="quick-stat">
                                            <span className="qs-value">{plans.length}</span>
                                            <span className="qs-label">Planes</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="maintenances-table-container">
                                        <div className="table-header-actions">
                                            <h3>Mantenimientos Ejecutados</h3>
                                        </div>
                                        {filteredMaintenances.length > 0 ? (
                                            <>
                                                <div className="table-container">
                                                    <table className="data-table">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: '5%' }}>N°</th>
                                                                <th style={{ width: '15%' }}>Maquinaria</th>
                                                                <th style={{ width: '12%' }}>Tipo</th>
                                                                <th style={{ width: '12%' }}>Plan</th>
                                                                <th style={{ width: '10%' }}>Fecha Prog.</th>
                                                                <th style={{ width: '10%' }}>Fecha Ejec.</th>
                                                                <th style={{ width: '8%' }}>Horas</th>
                                                                <th style={{ width: '10%' }}>Estado</th>
                                                                <th style={{ width: '10%' }}>Costo Total</th>
                                                                <th style={{ width: '8%' }}>Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredMaintenances.map((maint, index) => (
                                                                <tr key={maint.id}>
                                                                    <td>{index + 1}</td>
                                                                    <td className="item-name" title={maint.maquinaria_nombre || 'Sin maquinaria'}>
                                                                        {maint.maquinaria_nombre || '-'}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge ${maint.tipo_mantenimiento === 'PREVENTIVO' ? 'badge-success' :
                                                                            maint.tipo_mantenimiento === 'CORRECTIVO' ? 'badge-warning' :
                                                                                'badge-info'
                                                                            }`}>
                                                                            {maint.tipo_mantenimiento === 'PREVENTIVO' ? '🛡️ Preventivo' :
                                                                                maint.tipo_mantenimiento === 'CORRECTIVO' ? '🔧 Correctivo' :
                                                                                    '⚡ Proactivo'}
                                                                        </span>
                                                                    </td>
                                                                    <td title={maint.nombre_plan || '-'}>
                                                                        {maint.nombre_plan ? (maint.nombre_plan.length > 20 ? maint.nombre_plan.substring(0, 20) + '...' : maint.nombre_plan) : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {maint.fecha_programada ? new Date(maint.fecha_programada).toLocaleDateString('es-BO') : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {maint.fecha_ejecucion ? new Date(maint.fecha_ejecucion).toLocaleDateString('es-BO') : '-'}
                                                                    </td>
                                                                    <td>
                                                                        {safeFormatNumber(maint.horas_maquina, { decimals: 1, allowZero: true }) || '-'}
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge ${maint.estado === 'COMPLETADO' ? 'badge-success' :
                                                                            maint.estado === 'EN_PROCESO' ? 'badge-warning' :
                                                                                maint.estado === 'CANCELADO' ? 'badge-error' :
                                                                                    'badge-info'
                                                                            }`}>
                                                                            {maint.estado || 'PROGRAMADO'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="cost-cell">
                                                                        {safeFormatCurrency(maint.costo_total) ? (
                                                                            <span className="cost-value">
                                                                                {safeFormatCurrency(maint.costo_total)}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="no-data">-</span>
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <div className="action-buttons">
                                                                            <button
                                                                                className="btn-action btn-edit"
                                                                                onClick={() => handleEdit(null, 'maintenance', null, maint)}
                                                                                title="Editar mantenimiento"
                                                                            >
                                                                                ✏️
                                                                            </button>
                                                                            <button
                                                                                className="btn-action btn-delete"
                                                                                onClick={() => {
                                                                                    if (window.confirm('¿Eliminar este mantenimiento?')) {
                                                                                        handleDelete(maint.id, 'maintenance');
                                                                                    }
                                                                                }}
                                                                                title="Eliminar mantenimiento"
                                                                            >
                                                                                🗑️
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="maintenances-summary">
                                                    <div className="summary-grid">
                                                        <div className="summary-item">
                                                            <span className="summary-label">Total</span>
                                                            <span className="summary-value">{filteredMaintenances.length}</span>
                                                        </div>
                                                        <div className="summary-item">
                                                            <span className="summary-label">Costo Total</span>
                                                            <span className="summary-value">
                                                                {safeFormatCurrency(filteredMaintenances.reduce((sum, m) => {
                                                                    const costo = safeParseFloat(m.costo_total);
                                                                    return sum + (costo > 0 ? costo : 0);
                                                                }, 0)) || 'Bs. 0,00'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="empty-state">
                                                <div className="empty-icon">🔧</div>
                                                <p>No se encontraron mantenimientos</p>
                                                <button className="btn btn-primary" onClick={() => handleCreate('maintenance')}>
                                                    ➕ Crear Mantenimiento
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal para Planes y Actividades */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !isSubmitting && setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {editingItem ? '✏️ Editar' : '➕ Crear'} {
                                    modalType === 'plan' ? 'Plan de Mantenimiento' :
                                        modalType === 'activity' ? 'Actividad' :
                                            'Mantenimiento'
                                }
                            </h2>
                            <button
                                className="modal-close"
                                onClick={() => !isSubmitting && setShowModal(false)}
                                disabled={isSubmitting}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            {modalType === 'plan' && (
                                <>
                                    <div className="form-group">
                                        <label>Nombre del Plan <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.nombre_plan}
                                            onChange={(e) => setFormData({ ...formData, nombre_plan: e.target.value })}
                                            placeholder="Ej: Preventivo Bulldozer D6T 250 Horas"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Maquinaria</label>
                                            <select
                                                value={formData.maquinaria_id}
                                                onChange={(e) => setFormData({ ...formData, maquinaria_id: e.target.value })}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {machinery.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m['Unnamed: 4']} ({m['Unnamed: 3']})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Tipo de Mantenimiento <span className="required">*</span></label>
                                            <select
                                                value={formData.tipo_mantenimiento}
                                                onChange={(e) => setFormData({ ...formData, tipo_mantenimiento: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            >
                                                <option value="PREVENTIVO">🛡️ Preventivo</option>
                                                <option value="CORRECTIVO">🔧 Correctivo</option>
                                                <option value="PROACTIVO">⚡ Proactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tipo de Plan</label>
                                            <select
                                                value={formData.tipo_plan}
                                                onChange={(e) => setFormData({ ...formData, tipo_plan: e.target.value })}
                                                disabled={isSubmitting}
                                            >
                                                <option value="POR_HORAS">Por Horas</option>
                                                <option value="CRONOGRAMA">Cronograma</option>
                                                <option value="CHECKLIST">Checklist</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Horas de Operación</label>
                                            <input
                                                type="number"
                                                value={formData.horas_operacion}
                                                onChange={(e) => setFormData({ ...formData, horas_operacion: e.target.value })}
                                                placeholder="Ej: 250"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            value={formData.descripcion}
                                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                            placeholder="Descripción del plan de mantenimiento"
                                            rows="3"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </>
                            )}

                            {modalType === 'activity' && (
                                <>
                                    <div className="form-group">
                                        <label>Plan de Mantenimiento <span className="required">*</span></label>
                                        <select
                                            value={formData.plan_id}
                                            onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                                            required
                                            disabled={isSubmitting || !!selectedPlan}
                                        >
                                            <option value="">Seleccionar...</option>
                                            {plans.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre_plan}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Número de Orden</label>
                                            <input
                                                type="number"
                                                value={formData.numero_orden}
                                                onChange={(e) => setFormData({ ...formData, numero_orden: e.target.value })}
                                                placeholder="Ej: 1"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Componente</label>
                                            <input
                                                type="text"
                                                value={formData.descripcion_componente}
                                                onChange={(e) => setFormData({ ...formData, descripcion_componente: e.target.value })}
                                                placeholder="Ej: Sistema de Lubricación"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Actividad <span className="required">*</span></label>
                                        <textarea
                                            value={formData.actividad}
                                            onChange={(e) => setFormData({ ...formData, actividad: e.target.value })}
                                            placeholder="Descripción de la actividad"
                                            required
                                            rows="3"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tiempo Mínimo (min)</label>
                                            <input
                                                type="number"
                                                value={formData.tiempo_min}
                                                onChange={(e) => setFormData({ ...formData, tiempo_min: e.target.value })}
                                                placeholder="Ej: 15"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tiempo Promedio (min)</label>
                                            <input
                                                type="number"
                                                value={formData.tiempo_promedio}
                                                onChange={(e) => setFormData({ ...formData, tiempo_promedio: e.target.value })}
                                                placeholder="Ej: 20"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tiempo Máximo (min)</label>
                                            <input
                                                type="number"
                                                value={formData.tiempo_max}
                                                onChange={(e) => setFormData({ ...formData, tiempo_max: e.target.value })}
                                                placeholder="Ej: 25"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Costo Estimado (Bs.) <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            value={formData.costo_estimado}
                                            onChange={(e) => setFormData({ ...formData, costo_estimado: e.target.value })}
                                            placeholder="Ej: 125.50"
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <small className="form-hint">Debe ser mayor a cero</small>
                                    </div>
                                </>
                            )}

                            {modalType === 'maintenance' && (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Maquinaria <span className="required">*</span></label>
                                            <select
                                                value={formData.maquinaria_id}
                                                onChange={(e) => setFormData({ ...formData, maquinaria_id: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {machinery.map(m => (
                                                    <option key={m.id} value={m.id}>
                                                        {m['Unnamed: 4']} ({m['Unnamed: 3']})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Plan de Mantenimiento</label>
                                            <select
                                                value={formData.plan_id}
                                                onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Sin plan (Correctivo)</option>
                                                {plans.map(p => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.nombre_plan}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Tipo de Mantenimiento <span className="required">*</span></label>
                                            <select
                                                value={formData.tipo_mantenimiento}
                                                onChange={(e) => setFormData({ ...formData, tipo_mantenimiento: e.target.value })}
                                                required
                                                disabled={isSubmitting}
                                            >
                                                <option value="PREVENTIVO">🛡️ Preventivo</option>
                                                <option value="CORRECTIVO">🔧 Correctivo</option>
                                                <option value="PROACTIVO">⚡ Proactivo</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <select
                                                value={formData.estado}
                                                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                                disabled={isSubmitting}
                                            >
                                                <option value="PROGRAMADO">📅 Programado</option>
                                                <option value="EN_PROCESO">🔄 En Proceso</option>
                                                <option value="COMPLETADO">✅ Completado</option>
                                                <option value="CANCELADO">❌ Cancelado</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha Programada</label>
                                            <input
                                                type="date"
                                                value={formData.fecha_programada}
                                                onChange={(e) => setFormData({ ...formData, fecha_programada: e.target.value })}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Fecha de Ejecución</label>
                                            <input
                                                type="date"
                                                value={formData.fecha_ejecucion}
                                                onChange={(e) => setFormData({ ...formData, fecha_ejecucion: e.target.value })}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Horas de Máquina</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.horas_maquina}
                                            onChange={(e) => setFormData({ ...formData, horas_maquina: e.target.value })}
                                            placeholder="Ej: 250.00"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Observaciones</label>
                                        <textarea
                                            value={formData.observaciones}
                                            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                            placeholder="Observaciones del mantenimiento"
                                            rows="3"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {formData.estado === 'COMPLETADO' && (
                                        <>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Costo Mano de Obra (Bs.) <span className="required">*</span></label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={formData.costo_mano_obra}
                                                        onChange={(e) => setFormData({ ...formData, costo_mano_obra: e.target.value })}
                                                        placeholder="Ej: 250.00"
                                                        required={formData.estado === 'COMPLETADO'}
                                                        disabled={isSubmitting}
                                                    />
                                                    <small className="form-hint">Debe ser mayor a cero</small>
                                                </div>
                                                <div className="form-group">
                                                    <label>Costo Insumos (Bs.) <span className="required">*</span></label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0.01"
                                                        value={formData.costo_insumos}
                                                        onChange={(e) => setFormData({ ...formData, costo_insumos: e.target.value })}
                                                        placeholder="Ej: 350.00"
                                                        required={formData.estado === 'COMPLETADO'}
                                                        disabled={isSubmitting}
                                                    />
                                                    <small className="form-hint">Debe ser mayor a cero</small>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Guardando...' : (editingItem ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Maintenance;
