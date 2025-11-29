import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import './WorkOrders.css';

function WorkOrders() {
    const navigate = useNavigate();
    const toast = useToast();

    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOT, setEditingOT] = useState(null);
    const [filterEstado, setFilterEstado] = useState('');
    const [filterPrioridad, setFilterPrioridad] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        maquinaria_id: '',
        solicitante_id: '',
        descripcion_trabajo: '',
        prioridad: 'MEDIA',
        tipo_trabajo: 'CORRECTIVO',
        horometro: '',
        valor_materiales: '',
        cargo_a: '',
        responsable_id: '',
        fecha_inicio: '',
        fecha_termino: '',
        observaciones: ''
    });

    const [machinery, setMachinery] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [mechanics, setMechanics] = useState([]);
    const [selectedMechanics, setSelectedMechanics] = useState([]);

    useEffect(() => {
        loadData();
        loadMachinery();
        loadPersonnel();
    }, [filterEstado, filterPrioridad]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterEstado) params.append('estado', filterEstado);
            if (filterPrioridad) params.append('prioridad', filterPrioridad);

            const response = await fetch(`http://localhost:3001/api/work-orders?${params}`);
            const data = await response.json();
            if (data.success) {
                setWorkOrders(data.data);
            }
        } catch (error) {
            toast.error('Error al cargar órdenes de trabajo');
        } finally {
            setLoading(false);
        }
    };

    const loadMachinery = async () => {
        try {
            const response = await api.getMachinery();
            if (response.success) {
                setMachinery(response.data);
            }
        } catch (error) {
            console.error('Error loading machinery:', error);
        }
    };

    const loadPersonnel = async () => {
        try {
            const response = await api.getPersonnel();
            if (response.success) {
                setPersonnel(response.data);
                // Filter mechanics (assuming mechanics have specific cargo)
                const mecList = response.data.filter(p =>
                    p.cargo && (
                        p.cargo.toLowerCase().includes('mecánico') ||
                        p.cargo.toLowerCase().includes('mecanico') ||
                        p.cargo.toLowerCase().includes('técnico') ||
                        p.cargo.toLowerCase().includes('tecnico')
                    )
                );
                setMechanics(mecList);
            }
        } catch (error) {
            console.error('Error loading personnel:', error);
        }
    };

    const handleCreate = () => {
        setEditingOT(null);
        setFormData({
            maquinaria_id: '',
            solicitante_id: '',
            descripcion_trabajo: '',
            prioridad: 'MEDIA',
            tipo_trabajo: 'CORRECTIVO',
            horometro: '',
            valor_materiales: '',
            cargo_a: '',
            responsable_id: '',
            fecha_inicio: '',
            fecha_termino: '',
            observaciones: ''
        });
        setSelectedMechanics([]);
        setShowModal(true);
    };

    const handleEdit = (ot) => {
        setEditingOT(ot);
        setFormData({
            maquinaria_id: ot.maquinaria_id || '',
            solicitante_id: ot.solicitante_id || '',
            descripcion_trabajo: ot.descripcion_trabajo || '',
            prioridad: ot.prioridad || 'MEDIA',
            tipo_trabajo: ot.tipo_trabajo || 'CORRECTIVO',
            horometro: ot.horometro || '',
            valor_materiales: ot.valor_materiales || '',
            cargo_a: ot.cargo_a || '',
            responsable_id: ot.responsable_id || '',
            fecha_inicio: ot.fecha_inicio || '',
            fecha_termino: ot.fecha_termino || '',
            observaciones: ot.observaciones || ''
        });
        setSelectedMechanics(ot.mecanicos || []);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                mecanicos: selectedMechanics.map(m => ({
                    mecanico_id: m.mecanico_id || m.id,
                    horas_trabajadas: m.horas_trabajadas || 0
                }))
            };

            if (editingOT) {
                const response = await fetch(`http://localhost:3001/api/work-orders/${editingOT.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (data.success) {
                    toast.success('OT actualizada correctamente');
                    setShowModal(false);
                    loadData();
                }
            } else {
                const response = await fetch('http://localhost:3001/api/work-orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                if (data.success) {
                    toast.success(`OT creada: ${data.numero_ot}`);
                    setShowModal(false);
                    loadData();
                }
            }
        } catch (error) {
            toast.error('Error al guardar OT');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta OT?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/work-orders/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            if (data.success) {
                toast.success('OT eliminada');
                loadData();
            }
        } catch (error) {
            toast.error('Error al eliminar OT');
        }
    };

    const addMechanic = () => {
        setSelectedMechanics([...selectedMechanics, { mecanico_id: '', horas_trabajadas: 0 }]);
    };

    const removeMechanic = (index) => {
        setSelectedMechanics(selectedMechanics.filter((_, i) => i !== index));
    };

    const updateMechanic = (index, field, value) => {
        const updated = [...selectedMechanics];
        updated[index][field] = value;
        setSelectedMechanics(updated);
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            'SOLICITADA': 'badge-warning',
            'APROBADA': 'badge-info',
            'EN_PROCESO': 'badge-primary',
            'COMPLETADA': 'badge-success',
            'CANCELADA': 'badge-danger'
        };
        return badges[estado] || 'badge-secondary';
    };

    const getPrioridadBadge = (prioridad) => {
        const badges = {
            'ALTA': 'badge-danger',
            'MEDIA': 'badge-warning',
            'BAJA': 'badge-info'
        };
        return badges[prioridad] || 'badge-secondary';
    };

    return (
        <div className="work-orders-page">
            <header className="page-header">
                <h1>📋 Órdenes de Trabajo</h1>
                <button className="btn btn-primary" onClick={handleCreate}>
                    ➕ Nueva OT
                </button>
            </header>

            <div className="filters">
                <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)}>
                    <option value="">Todos los estados</option>
                    <option value="SOLICITADA">Solicitada</option>
                    <option value="APROBADA">Aprobada</option>
                    <option value="EN_PROCESO">En Proceso</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="CANCELADA">Cancelada</option>
                </select>

                <select value={filterPrioridad} onChange={(e) => setFilterPrioridad(e.target.value)}>
                    <option value="">Todas las prioridades</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                </select>
            </div>

            {loading ? (
                <Loading />
            ) : (
                <div className="work-orders-grid">
                    {workOrders.length === 0 ? (
                        <div className="empty-state">
                            <p>No hay órdenes de trabajo</p>
                            <button className="btn btn-primary" onClick={handleCreate}>
                                Crear Primera OT
                            </button>
                        </div>
                    ) : (
                        workOrders.map(ot => (
                            <div key={ot.id} className="ot-card">
                                <div className="ot-header">
                                    <h3>{ot.numero_ot}</h3>
                                    <div className="badges">
                                        <span className={`badge ${getEstadoBadge(ot.estado)}`}>
                                            {ot.estado}
                                        </span>
                                        <span className={`badge ${getPrioridadBadge(ot.prioridad)}`}>
                                            {ot.prioridad}
                                        </span>
                                    </div>
                                </div>

                                <div className="ot-body">
                                    <p><strong>Maquinaria:</strong> {ot.maquinaria_nombre || 'N/A'}</p>
                                    <p><strong>Solicitante:</strong> {ot.solicitante_nombre || 'N/A'}</p>
                                    <p><strong>Tipo:</strong> {ot.tipo_trabajo}</p>
                                    <p><strong>Fecha:</strong> {new Date(ot.fecha_solicitud).toLocaleDateString()}</p>
                                    <p className="description">{ot.descripcion_trabajo}</p>
                                    {ot.mecanicos && ot.mecanicos.length > 0 && (
                                        <p><strong>Mecánicos:</strong> {ot.mecanicos.length}</p>
                                    )}
                                </div>

                                <div className="ot-actions">
                                    <button className="btn btn-sm" onClick={() => handleEdit(ot)}>
                                        ✏️ Editar
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ot.id)}>
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingOT ? 'Editar OT' : 'Nueva Orden de Trabajo'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="ot-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Maquinaria *</label>
                                    <select
                                        value={formData.maquinaria_id}
                                        onChange={(e) => setFormData({ ...formData, maquinaria_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {machinery.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.codigo} - {m.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Solicitante *</label>
                                    <select
                                        value={formData.solicitante_id}
                                        onChange={(e) => setFormData({ ...formData, solicitante_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {personnel.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Horómetro</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.horometro}
                                        onChange={(e) => setFormData({ ...formData, horometro: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Prioridad</label>
                                    <select
                                        value={formData.prioridad}
                                        onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                                    >
                                        <option value="BAJA">Baja</option>
                                        <option value="MEDIA">Media</option>
                                        <option value="ALTA">Alta</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Tipo de Trabajo</label>
                                    <select
                                        value={formData.tipo_trabajo}
                                        onChange={(e) => setFormData({ ...formData, tipo_trabajo: e.target.value })}
                                    >
                                        <option value="PREVENTIVO">Preventivo</option>
                                        <option value="CORRECTIVO">Correctivo</option>
                                        <option value="PROACTIVO">Proactivo</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Responsable</label>
                                    <select
                                        value={formData.responsable_id}
                                        onChange={(e) => setFormData({ ...formData, responsable_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {personnel.map(p => (
                                            <option key={p.id} value={p.id}>{p.nombre_completo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Valor Materiales</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.valor_materiales}
                                        onChange={(e) => setFormData({ ...formData, valor_materiales: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Cargo a</label>
                                    <input
                                        type="text"
                                        value={formData.cargo_a}
                                        onChange={(e) => setFormData({ ...formData, cargo_a: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha Inicio</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_inicio}
                                        onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Fecha Término</label>
                                    <input
                                        type="date"
                                        value={formData.fecha_termino}
                                        onChange={(e) => setFormData({ ...formData, fecha_termino: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Descripción del Trabajo *</label>
                                <textarea
                                    value={formData.descripcion_trabajo}
                                    onChange={(e) => setFormData({ ...formData, descripcion_trabajo: e.target.value })}
                                    required
                                    rows="4"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Observaciones</label>
                                <textarea
                                    value={formData.observaciones}
                                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div className="mechanics-section">
                                <div className="section-header">
                                    <h3>Mecánicos Asignados</h3>
                                    <button type="button" className="btn btn-sm" onClick={addMechanic}>
                                        ➕ Agregar Mecánico
                                    </button>
                                </div>

                                {selectedMechanics.map((mec, index) => (
                                    <div key={index} className="mechanic-row">
                                        <select
                                            value={mec.mecanico_id || mec.id}
                                            onChange={(e) => updateMechanic(index, 'mecanico_id', e.target.value)}
                                        >
                                            <option value="">Seleccionar mecánico...</option>
                                            {mechanics.map(m => (
                                                <option key={m.id} value={m.id}>{m.nombre_completo}</option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            step="0.5"
                                            placeholder="Horas"
                                            value={mec.horas_trabajadas || ''}
                                            onChange={(e) => updateMechanic(index, 'horas_trabajadas', e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => removeMechanic(index)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingOT ? 'Actualizar' : 'Crear'} OT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WorkOrders;
