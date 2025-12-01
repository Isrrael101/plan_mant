import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import './MachineryForms.css';

function MachineryForms() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [machinery, setMachinery] = useState(null);
    const [specs, setSpecs] = useState(null);
    const [activeTab, setActiveTab] = useState('ficha');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    // Data states
    const [checklists, setChecklists] = useState([]);
    const [dailyReports, setDailyReports] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadMachinery();
    }, [id]);

    useEffect(() => {
        loadTabData();
    }, [id, activeTab]);

    const loadMachinery = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/machinery/${id}`);
            const data = await response.json();
            if (data.success) {
                setMachinery(data.data);
            }

            // Cargar especificaciones
            const specsResponse = await fetch(`http://localhost:3001/api/machinery/${id}/specs`);
            const specsData = await specsResponse.json();
            if (specsData.success) {
                setSpecs(specsData.data);
                // Inicializar editData vacío para que los campos estén en blanco
                setEditData({});
            }
        } catch (error) {
            toast.error('Error al cargar maquinaria');
            console.error(error);
        }
    };

    const loadTabData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'checklist') {
                const response = await fetch(`http://localhost:3001/api/machinery/${id}/checklists`);
                const data = await response.json();
                if (data.success) {
                    setChecklists(data.data || []);
                }
            } else if (activeTab === 'daily') {
                const response = await fetch(`http://localhost:3001/api/machinery/${id}/daily-reports`);
                const data = await response.json();
                if (data.success) {
                    setDailyReports(data.data || []);
                }
            } else if (activeTab === 'history') {
                const response = await fetch(`http://localhost:3001/api/machinery/${id}/history`);
                const data = await response.json();
                if (data.success) {
                    setHistory(data.data || []);
                }
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSpecs = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/machinery/${id}/specs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Especificaciones guardadas');
                setSpecs(editData);
                setIsEditing(false);
            } else {
                toast.error('Error al guardar');
            }
        } catch (error) {
            toast.error('Error al guardar especificaciones');
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    if (!machinery) {
        return <Loading message="Cargando maquinaria..." />;
    }

    return (
        <div className="machinery-forms-page">
            <header className="forms-header">
                <button className="btn btn-back" onClick={() => navigate('/machinery')}>
                    ← VOLVER A MAQUINARIA
                </button>
                <div className="machinery-title">
                    <span className="label">MÁQUINA</span>
                    <span className="name">{machinery.nombre}</span>
                </div>
            </header>

            <div className="forms-tabs">
                <button
                    className={`tab ${activeTab === 'ficha' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ficha')}
                >
                    📋 Ficha Técnica
                </button>
                <button
                    className={`tab ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checklist')}
                >
                    ✅ Check List
                </button>
                <button
                    className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
                    onClick={() => setActiveTab('daily')}
                >
                    📅 Reporte Diario
                </button>
                <button
                    className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    📊 Historial
                </button>
            </div>

            <div className="forms-content">
                {activeTab === 'ficha' && (
                    <TechnicalSheet
                        machinery={machinery}
                        specs={specs}
                        isEditing={isEditing}
                        editData={editData}
                        onEdit={() => { setIsEditing(true); setEditData({}); }}
                        onCancel={() => { setIsEditing(false); setEditData({}); }}
                        onSave={handleSaveSpecs}
                        onChange={handleInputChange}
                    />
                )}
                {activeTab === 'checklist' && (
                    <ChecklistView
                        checklists={checklists}
                        machineryId={id}
                        onReload={loadTabData}
                        loading={loading}
                    />
                )}
                {activeTab === 'daily' && (
                    <DailyReportView
                        reports={dailyReports}
                        machineryId={id}
                        onReload={loadTabData}
                        loading={loading}
                    />
                )}
                {activeTab === 'history' && (
                    <HistoryView
                        history={history}
                        machinery={machinery}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}

// Technical Sheet Component
function TechnicalSheet({ machinery, specs, isEditing, editData, onEdit, onCancel, onSave, onChange }) {
    // Cuando está editando, usar editData (que debe estar vacío inicialmente)
    // Cuando no está editando, mostrar specs si existen
    const data = isEditing ? (editData || {}) : (specs || {});

    const renderField = (label, field, unit = '') => {
        // En modo edición, siempre usar editData y si no existe, usar string vacío
        const value = isEditing ? (editData?.[field] ?? '') : (data[field] || '');
        if (isEditing) {
            return (
                <div className="spec-row">
                    <span className="spec-label">{label}</span>
                    <input
                        type="text"
                        className="spec-input"
                        value={value}
                        onChange={(e) => onChange(field, e.target.value)}
                    />
                    {unit && <span className="spec-unit">{unit}</span>}
                </div>
            );
        }
        return (
            <div className="spec-row">
                <span className="spec-label">{label}</span>
                <span className="spec-value">{value || '-'}</span>
                {unit && value && <span className="spec-unit">{unit}</span>}
            </div>
        );
    };

    return (
        <div className="technical-sheet">
            <div className="sheet-actions">
                {isEditing ? (
                    <>
                        <button className="btn btn-success" onClick={onSave}>💾 Guardar</button>
                        <button className="btn btn-secondary" onClick={onCancel}>❌ Cancelar</button>
                    </>
                ) : (
                    <button className="btn btn-primary" onClick={onEdit}>✏️ Editar Ficha</button>
                )}
            </div>

            <div className="sheet-grid">
                {/* Información General */}
                <div className="sheet-section info-general">
                    <div className="section-header">INFORMACIÓN GENERAL</div>
                    <div className="section-body">
                        <div className="spec-row">
                            <span className="spec-label">CÓDIGO</span>
                            <span className="spec-value highlight">{machinery.codigo}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-label">MARCA</span>
                            <span className="spec-value">{machinery.marca}</span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-label">MODELO</span>
                            <span className="spec-value">{machinery.modelo}</span>
                        </div>
                        {renderField('SERIE', 'motor_serie')}
                        {renderField('PLACA DE RODAJE', 'placa_rodaje')}
                        <div className="spec-row">
                            <span className="spec-label">ESTADO</span>
                            <span className={`spec-value status-${machinery.estado?.toLowerCase()}`}>
                                {machinery.estado}
                            </span>
                        </div>
                        <div className="spec-row">
                            <span className="spec-label">AÑO</span>
                            <span className="spec-value">{machinery.anio}</span>
                        </div>
                    </div>
                </div>

                {/* Motor */}
                <div className="sheet-section motor">
                    <div className="section-header motor-header">MOTOR</div>
                    <div className="section-body">
                        {renderField('MARCA', 'motor_marca')}
                        {renderField('MODELO', 'motor_modelo')}
                        {renderField('SERIE', 'motor_serie')}
                        {renderField('POTENCIA NETA', 'potencia_neta_hp', 'HP')}
                        {renderField('POTENCIA BRUTA', 'potencia_bruta_hp', 'HP')}
                        {renderField('NÚMERO DE CILINDROS', 'numero_cilindros')}
                        {renderField('CALIBRE', 'calibre_mm', 'mm')}
                        {renderField('CARRERA', 'carrera_mm', 'mm')}
                        {renderField('CILINDRADA', 'cilindrada_l', 'L')}
                        {renderField('TIPO DE COMBUSTIBLE', 'tipo_combustible')}
                    </div>
                </div>

                {/* Dimensiones */}
                <div className="sheet-section dimensiones">
                    <div className="section-header dim-header">DIMENSIONES</div>
                    <div className="section-body">
                        {renderField('LONGITUD TOTAL', 'longitud_total_m', 'm')}
                        {renderField('ANCHO TOTAL', 'ancho_total_m', 'm')}
                        {renderField('ALTURA TOTAL', 'altura_total_m', 'm')}
                        {renderField('DISTANCIA ENTRE EJES', 'distancia_entre_ejes_m', 'm')}
                        {renderField('TIEMPO DE CARGA', 'tiempo_carga_s', 's')}
                        {renderField('TIEMPO DE SUBIDA', 'tiempo_subida_s', 's')}
                        {renderField('TIEMPO DE BAJADA', 'tiempo_bajada_s', 's')}
                        {renderField('TOTAL TIEMPO UTILIZADO', 'tiempo_total_utilizado_s', 's')}
                        {renderField('PESO TOTAL', 'peso_total_kg', 'Kg')}
                    </div>
                </div>

                {/* Consumo */}
                <div className="sheet-section consumo">
                    <div className="section-header consumo-header">CONSUMO</div>
                    <div className="section-body">
                        {renderField('CONSUMO DE COMBUSTIBLE', 'consumo_combustible_gal_hr', 'gal/hr')}
                        {renderField('TANQUE DE COMBUSTIBLE', 'tanque_combustible_gal', 'gal')}
                    </div>
                </div>

                {/* Transmisión */}
                <div className="sheet-section transmision">
                    <div className="section-header trans-header">TRANSMISIÓN</div>
                    <div className="section-body">
                        {renderField('TIPO', 'transmision_tipo')}
                        {renderField('TRACCIÓN', 'traccion')}
                        {renderField('VELOCIDADES HACIA ADELANTE', 'velocidades_adelante')}
                        {renderField('VELOCIDADES HACIA ATRÁS', 'velocidades_atras')}
                        {renderField('VELOCIDAD MÁX. AVANCE', 'velocidad_max_avance_km_hr', 'Km/hr')}
                        {renderField('VELOCIDAD MÁX. RETROCESO', 'velocidad_max_retroceso_km_hr', 'Km/hr')}
                    </div>
                </div>

                {/* Operacional */}
                <div className="sheet-section operacional">
                    <div className="section-header oper-header">OPERACIONAL</div>
                    <div className="section-body">
                        {renderField('IMPULSO DE PROPULSIÓN', 'impulso_propulsion_m', 'm')}
                        {renderField('PAR DE TORSIÓN', 'par_torsion_kg_m', 'Kg·m')}
                        {renderField('VELOCIDAD DE PROP.', 'velocidad_propulsion_rpm', 'rpm')}
                        {renderField('PROFUNDIDAD DE EXCAVACIÓN', 'profundidad_excavacion_m', 'm')}
                    </div>
                </div>
            </div>

            {/* Observaciones */}
            <div className="sheet-section observaciones">
                <div className="section-header obs-header">OBSERVACIONES</div>
                <div className="section-body">
                    {isEditing ? (
                        <textarea
                            className="obs-input"
                            value={editData?.observaciones ?? ''}
                            onChange={(e) => onChange('observaciones', e.target.value)}
                            rows="3"
                        />
                    ) : (
                        <p className="obs-text">{data.observaciones || 'Sin observaciones'}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Checklist View Component
function ChecklistView({ checklists, machineryId, onReload, loading }) {
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [selectedChecklist, setSelectedChecklist] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        tipo_checklist: 'GENERAL',
        observaciones: '',
        fecha: '',
        codigo_checklist: '',
        realizado_por: user?.id || '',
        revisado_por: ''
    });
    const [editData, setEditData] = useState({});

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const loadMachinery = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/machinery/${machineryId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            return null;
        }
    };

    const [machinery, setMachinery] = useState(null);

    useEffect(() => {
        loadMachinery().then(setMachinery);
    }, [machineryId]);

    const createChecklist = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/checklists', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    maquinaria_id: machineryId,
                    fecha: formData.fecha,
                    tipo_checklist: formData.tipo_checklist,
                    codigo_checklist: formData.codigo_checklist || null,
                    realizado_por: formData.realizado_por || null,
                    revisado_por: formData.revisado_por || null,
                    observaciones: formData.observaciones || null
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Checklist creado exitosamente');
                setShowModal(false);
                onReload();
            } else {
                toast.error(data.error || 'Error al crear');
            }
        } catch (error) {
            toast.error('Error al crear checklist');
        }
    };

    const updateChecklist = async () => {
        try {
            // Filtrar solo los campos que pertenecen a la tabla checklists_maquinaria
            // Excluir campos calculados o de JOIN (maquinaria_nombre, maquinaria_codigo, etc.)
            const fieldsToExclude = ['maquinaria_nombre', 'maquinaria_codigo', 'id'];
            const fieldsToUpdate = Object.keys(editData).reduce((acc, key) => {
                if (!fieldsToExclude.includes(key) && editData[key] !== undefined) {
                    acc[key] = editData[key];
                }
                return acc;
            }, {});
            
            console.log('Updating checklist with filtered data:', fieldsToUpdate);
            const response = await fetch(`http://localhost:3001/api/checklists/${selectedChecklist.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(fieldsToUpdate)
            });

            const data = await response.json();
            console.log('Update response:', data);
            
            if (data.success) {
                toast.success('Checklist actualizado');
                setIsEditing(false);
                // Recargar el checklist actualizado desde el servidor
                const reloadResponse = await fetch(`http://localhost:3001/api/checklists/${selectedChecklist.id}`, {
                    headers: getAuthHeaders()
                });
                const reloadData = await reloadResponse.json();
                if (reloadData.success) {
                    setSelectedChecklist(reloadData.data);
                    setEditData(reloadData.data);
                }
                onReload();
            } else {
                toast.error(data.error || 'Error al actualizar');
            }
        } catch (error) {
            console.error('Error updating checklist:', error);
            toast.error('Error al actualizar checklist');
        }
    };

    const deleteChecklist = async (checklistId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este checklist? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/checklists/${checklistId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Checklist eliminado');
                if (selectedChecklist && selectedChecklist.id === checklistId) {
                    setSelectedChecklist(null);
                    setIsEditing(false);
                }
                onReload();
            } else {
                toast.error(data.error || 'Error al eliminar');
            }
        } catch (error) {
            toast.error('Error al eliminar checklist');
        }
    };

    const handleViewChecklist = (checklist) => {
        setSelectedChecklist(checklist);
        setEditData(checklist);
        setIsEditing(false);
    };

    const handleEditChecklist = (checklist) => {
        setSelectedChecklist(checklist);
        setEditData({ ...checklist });
        setIsEditing(true);
    };

    const handleFieldChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const generatePDF = (checklist) => {
        // Abrir el checklist en una nueva ventana para imprimir
        handleViewChecklist(checklist);
        // Esperar un momento para que se cargue la vista
        setTimeout(() => {
            window.print();
        }, 500);
    };


    if (loading) return <Loading message="Cargando checklists..." />;

    if (selectedChecklist) {
        return (
            <ChecklistDetailView
                checklist={selectedChecklist}
                editData={editData}
                isEditing={isEditing}
                machinery={machinery}
                onBack={() => { setSelectedChecklist(null); setIsEditing(false); setEditData({}); }}
                onSave={updateChecklist}
                onDelete={() => deleteChecklist(selectedChecklist.id)}
                onChange={handleFieldChange}
                onEdit={() => setIsEditing(true)}
                onCancel={() => { setIsEditing(false); setEditData(selectedChecklist); }}
            />
        );
    }

    return (
        <div className="checklist-view">
            <div className="view-header">
                <h2>✅ Checklists de Inspección</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Nuevo Checklist
                </button>
            </div>

            {checklists.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No hay checklists registrados para esta maquinaria</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        Crear Primer Checklist
                    </button>
                </div>
            ) : (
                <div className="checklists-grid">
                    {checklists.map(checklist => (
                        <div key={checklist.id} className="checklist-card">
                            <div className="card-header">
                                <span className="date">{new Date(checklist.fecha).toLocaleDateString('es-BO')}</span>
                                <span className="type">{checklist.tipo_checklist}</span>
                            </div>
                            <div className="card-body">
                                <p><strong>Código:</strong> {checklist.codigo_checklist || 'N/A'}</p>
                                <p><strong>Realizado por:</strong> {checklist.realizado_por_nombre || 'N/A'}</p>
                                <p><strong>Revisado por:</strong> {checklist.revisado_por_nombre || 'N/A'}</p>
                            </div>
                            <div className="card-actions">
                                <button className="btn btn-sm btn-secondary" onClick={() => handleViewChecklist(checklist)}>👁️ Ver</button>
                                <button className="btn btn-sm btn-primary" onClick={() => handleEditChecklist(checklist)}>✏️ Editar</button>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteChecklist(checklist.id)}>🗑️ Eliminar</button>
                                <button className="btn btn-sm btn-info" onClick={() => generatePDF(checklist)}>📄 PDF</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>➕ Nuevo Checklist</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Fecha</label>
                                <input
                                    type="date"
                                    value={formData.fecha}
                                    onChange={e => setFormData({ ...formData, fecha: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de Checklist</label>
                                <select
                                    value={formData.tipo_checklist}
                                    onChange={e => setFormData({ ...formData, tipo_checklist: e.target.value })}
                                >
                                    <option value="GENERAL">General</option>
                                    <option value="DIARIO">Diario</option>
                                    <option value="SEMANAL">Semanal</option>
                                    <option value="MENSUAL">Mensual</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Código Checklist</label>
                                <input
                                    type="text"
                                    value={formData.codigo_checklist}
                                    onChange={e => setFormData({ ...formData, codigo_checklist: e.target.value })}
                                    placeholder="Ej: CHK-001"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={createChecklist}>Crear Checklist</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Checklist Detail View - Formato exacto de la imagen
function ChecklistDetailView({ checklist, editData, isEditing, machinery, onBack, onSave, onDelete, onChange, onEdit, onCancel }) {
    const checklistData = isEditing ? editData : checklist;
    const fechaFormateada = new Date(checklistData.fecha).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-');

    const getAccionTipo = (condicion, accion) => {
        if (condicion === 'MALO') {
            return 'MANTTO. CORRECTIVO';
        }
        return accion || 'MANTTO. PREVENTIVO';
    };

    const renderChecklistRow = (numero, elemento, campoCondicion, campoAccion) => {
        const condicion = checklistData[campoCondicion] || 'BUENO';
        const accionTexto = checklistData[campoAccion] || '';
        const accionTipo = getAccionTipo(condicion, accionTexto);
        
        // Obtener el campo base removiendo el sufijo _accion si existe
        // Ejemplo: sonda_botella_vibradora_accion -> sonda_botella_vibradora
        const campoBase = campoAccion.replace(/_accion$/, '');

        return (
            <tr key={numero}>
                <td className="checklist-num">{numero}</td>
                <td className="checklist-elemento">{elemento}</td>
                <td className={`checklist-condicion ${condicion.toLowerCase()}`}>
                    {condicion}
                </td>
                <td className={`checklist-accion-tipo ${accionTipo.includes('CORRECTIVO') ? 'correctivo' : 'preventivo'}`}>
                    {accionTipo}
                </td>
                <td className="checklist-quien">
                    {isEditing ? (
                        <input
                            type="text"
                            className="checklist-input-small"
                            value={checklistData[`${campoBase}_quien`] || ''}
                            onChange={e => onChange(`${campoBase}_quien`, e.target.value)}
                            placeholder="Quién"
                        />
                    ) : (
                        checklistData[`${campoBase}_quien`] || ''
                    )}
                </td>
                <td className="checklist-cuando">
                    {isEditing ? (
                        <input
                            type="date"
                            className="checklist-input-small"
                            value={checklistData[`${campoBase}_cuando`] || ''}
                            onChange={e => onChange(`${campoBase}_cuando`, e.target.value)}
                            placeholder="Cuándo"
                        />
                    ) : (
                        checklistData[`${campoBase}_cuando`] || ''
                    )}
                </td>
                <td className="checklist-area">
                    {isEditing ? (
                        <select
                            className="checklist-select-small"
                            value={checklistData[`${campoBase}_area`] || ''}
                            onChange={e => onChange(`${campoBase}_area`, e.target.value)}
                        >
                            <option value="">-</option>
                            <option value="MANTENIMIENTO">Mantenimiento</option>
                            <option value="OPERACIONES">Operaciones</option>
                            <option value="TALLER">Taller</option>
                        </select>
                    ) : (
                        checklistData[`${campoBase}_area`] || '-'
                    )}
                </td>
                {isEditing && (
                    <td className="checklist-edit-condicion">
                        <select
                            className="checklist-select-small"
                            value={condicion}
                            onChange={e => onChange(campoCondicion, e.target.value)}
                        >
                            <option value="BUENO">BUENO</option>
                            <option value="MALO">MALO</option>
                        </select>
                    </td>
                )}
            </tr>
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="checklist-detail-view">
            <div className="checklist-actions">
                <button className="btn btn-back" onClick={onBack}>← Volver</button>
                {isEditing ? (
                    <>
                        <button className="btn btn-success" onClick={onSave}>💾 Guardar</button>
                        <button className="btn btn-secondary" onClick={onBack}>❌ Cancelar</button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-primary" onClick={onEdit}>✏️ Editar</button>
                        <button className="btn btn-info" onClick={handlePrint}>📄 Imprimir/PDF</button>
                        <button className="btn btn-danger" onClick={() => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar este checklist? Esta acción no se puede deshacer.')) {
                                onDelete();
                            }
                        }}>🗑️ Eliminar</button>
                    </>
                )}
            </div>

            <div className="checklist-document">
                {/* Header con Logo */}
                <div className="checklist-header">
                    <div className="checklist-logo">
                        <div className="logo-text">PAN AMERICAN SILVER</div>
                    </div>
                    <div className="checklist-title-section">
                        <h1 className="checklist-main-title">FICHAS TÉCNICAS DE MANTENIMIENTO</h1>
                        <h2 className="checklist-subtitle">
                            CHECK LIST {machinery?.nombre?.toUpperCase() || 'MAQUINARIA'}
                        </h2>
                    </div>
                    <div className="checklist-doc-info">
                        <div className="doc-info-row">
                            <span className="doc-label">CÓDIGO:</span>
                            <span className="doc-value">{checklistData.codigo_checklist || machinery?.codigo || 'N/A'}</span>
                        </div>
                        <div className="doc-info-row">
                            <span className="doc-label">ANEXO:</span>
                            <span className="doc-value">{checklistData.anexo || ''}</span>
                        </div>
                        <div className="doc-info-row">
                            <span className="doc-label">REVISIÓN:</span>
                            <span className="doc-value">{checklistData.revision || '0'}</span>
                        </div>
                        <div className="doc-info-row">
                            <span className="doc-label">FECHA:</span>
                            <span className="doc-value">{fechaFormateada}</span>
                        </div>
                    </div>
                </div>

                {/* Tabla Principal */}
                <div className="checklist-table-wrapper">
                    <table className="checklist-main-table">
                        <thead>
                            <tr>
                                <th rowSpan="2" className="col-num">N°</th>
                                <th rowSpan="2" className="col-elemento">ELEMENTOS A INSPECCIONAR</th>
                                <th rowSpan="2" className="col-condicion">CONDICIÓN</th>
                                <th rowSpan="2" className="col-accion-tipo">ACCIÓN A REALIZAR</th>
                                <th colSpan="2" className="col-accion-header">ACCIÓN</th>
                                <th rowSpan="2" className="col-area">ÁREA</th>
                                {isEditing && <th rowSpan="2" className="col-edit">EDITAR</th>}
                            </tr>
                            <tr>
                                <th className="col-quien">QUIÉN</th>
                                <th className="col-cuando">CUÁNDO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Sección 1: SONDA */}
                            <tr className="section-header-row">
                                <td colSpan={isEditing ? 8 : 7} className="section-title">1. SONDA</td>
                            </tr>
                            {renderChecklistRow('1.1', 'BOTELLA VIBRADORA', 'sonda_botella_vibradora', 'sonda_botella_vibradora_accion')}
                            {renderChecklistRow('1.2', 'FLEXIBLE', 'sonda_flexible', 'sonda_flexible_accion')}
                            {renderChecklistRow('1.3', 'CUERPO DE ACOPLE', 'sonda_cuerpo_acople', 'sonda_cuerpo_acople_accion')}

                            {/* Sección 2: UNIDAD MOTRIZ A ENERGÍA ELÉCTRICA */}
                            <tr className="section-header-row">
                                <td colSpan={isEditing ? 8 : 7} className="section-title">2. UNIDAD MOTRIZ A ENERGÍA ELÉCTRICA</td>
                            </tr>
                            {renderChecklistRow('2.1', 'PARTIDOR CON PROTECCIÓN ELÉCTRICA', 'ume_partidor_proteccion', 'ume_partidor_proteccion_accion')}
                            {renderChecklistRow('2.2', 'CONDUCTOR ELÉCTRICO PROTEGIDO', 'ume_conductor_electrodo', 'ume_conductor_electrodo_accion')}
                            {renderChecklistRow('2.3', 'ENCHUFE MACHO ADECUADO AL AMPERAJE', 'ume_enchufe_macho', 'ume_enchufe_macho_accion')}
                            {renderChecklistRow('2.4', 'CONEXIÓN A TIERRA', 'ume_ension_tierra', 'ume_ension_tierra_accion')}
                            {renderChecklistRow('2.5', 'RODAMIENTO DE GIRO (ACOPLE)', 'ume_fundamento_giro', 'ume_fundamento_giro_accion')}

                            {/* Sección 3: UNIDAD MOTRIZ ENERGÍA DE COMBUSTIBLE */}
                            <tr className="section-header-row">
                                <td colSpan={isEditing ? 8 : 7} className="section-title">3. UNIDAD MOTRIZ ENERGÍA DE COMBUSTIBLE</td>
                            </tr>
                            {renderChecklistRow('3.1', 'PARTES MÓVILES A LA VISTA, PROTEGIDOS', 'umc_partes_moviles', 'umc_partes_moviles_accion')}
                            {renderChecklistRow('3.2', 'SECTORES CALIENTES PROTEGIDOS', 'umc_sectores_calientes', 'umc_sectores_calientes_accion')}
                            {renderChecklistRow('3.3', 'TUBO DE ESCAPE ADECUADO Y SILENCIADOR', 'umc_tubo_escape', 'umc_tubo_escape_accion')}
                            {renderChecklistRow('3.4', 'MOTOR', 'umc_motor', 'umc_motor_accion')}
                            {renderChecklistRow('3.5', 'ESTRUCTURA SOPORTE MOTOR', 'umc_soportes_motor', 'umc_soportes_motor_accion')}
                            {renderChecklistRow('3.6', 'ESTRUCTURA MOTOR AISLADA CONTRA CONTACTO ELÉCTRICO', 'umc_estructura_aislada', 'umc_estructura_aislada_accion')}
                            {renderChecklistRow('3.7', 'OTROS', 'umc_otros', 'umc_otros_accion')}
                        </tbody>
                    </table>
                </div>

                {/* Observaciones */}
                <div className="checklist-observaciones">
                    <div className="obs-label">OBSERVACIONES:</div>
                    {isEditing ? (
                        <textarea
                            className="obs-textarea"
                            value={checklistData.observaciones || ''}
                            onChange={e => onChange('observaciones', e.target.value)}
                            rows="4"
                        />
                    ) : (
                        <div className="obs-content">
                            {checklistData.observaciones || '\n\n\n'}
                        </div>
                    )}
                </div>

                {/* Firmas */}
                <div className="checklist-firmas">
                    <div className="firma-section">
                        <div className="firma-title">REALIZÓ</div>
                        <div className="firma-fields">
                            <div className="firma-field">
                                <label>NOMBRE</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="firma-input"
                                        value={checklistData.realizado_por_nombre || ''}
                                        onChange={e => onChange('realizado_por_nombre', e.target.value)}
                                    />
                                ) : (
                                    <div className="firma-value">{checklistData.realizado_por_nombre || ''}</div>
                                )}
                            </div>
                            <div className="firma-field">
                                <label>CARGO</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="firma-input"
                                        value={checklistData.realizado_por_cargo || ''}
                                        onChange={e => onChange('realizado_por_cargo', e.target.value)}
                                    />
                                ) : (
                                    <div className="firma-value">{checklistData.realizado_por_cargo || ''}</div>
                                )}
                            </div>
                            <div className="firma-field">
                                <label>FIRMA</label>
                                <div className="firma-value">{checklistData.realizado_por_firma || ''}</div>
                            </div>
                            <div className="firma-field">
                                <label>FECHA</label>
                                <div className="firma-value">{fechaFormateada}</div>
                            </div>
                        </div>
                    </div>
                    <div className="firma-section">
                        <div className="firma-title">REVISÓ</div>
                        <div className="firma-fields">
                            <div className="firma-field">
                                <label>NOMBRE</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="firma-input"
                                        value={checklistData.revisado_por_nombre || ''}
                                        onChange={e => onChange('revisado_por_nombre', e.target.value)}
                                    />
                                ) : (
                                    <div className="firma-value">{checklistData.revisado_por_nombre || ''}</div>
                                )}
                            </div>
                            <div className="firma-field">
                                <label>CARGO</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="firma-input"
                                        value={checklistData.revisado_por_cargo || ''}
                                        onChange={e => onChange('revisado_por_cargo', e.target.value)}
                                    />
                                ) : (
                                    <div className="firma-value">{checklistData.revisado_por_cargo || ''}</div>
                                )}
                            </div>
                            <div className="firma-field">
                                <label>FIRMA</label>
                                <div className="firma-value">{checklistData.revisado_por_firma || ''}</div>
                            </div>
                            <div className="firma-field">
                                <label>FECHA</label>
                                <div className="firma-value">{fechaFormateada}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Daily Report View Component
function DailyReportView({ reports, machineryId, onReload, loading }) {
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [machinery, setMachinery] = useState(null);

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const loadMachinery = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/machinery/${machineryId}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        loadMachinery().then(setMachinery);
    }, [machineryId]);

    const createReport = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/daily-reports', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    maquinaria_id: machineryId,
                    fecha: new Date().toISOString().split('T')[0]
                })
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Reporte creado exitosamente');
                setShowModal(false);
                onReload();
            } else {
                toast.error(data.error || 'Error al crear');
            }
        } catch (error) {
            toast.error('Error al crear reporte');
        }
    };

    const updateReport = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/daily-reports/${selectedReport.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(editData)
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Reporte actualizado');
                setIsEditing(false);
                // Recargar el reporte actualizado
                const reloadResponse = await fetch(`http://localhost:3001/api/daily-reports/${selectedReport.id}`, {
                    headers: getAuthHeaders()
                });
                const reloadData = await reloadResponse.json();
                if (reloadData.success) {
                    setSelectedReport(reloadData.data);
                    setEditData(reloadData.data);
                }
                onReload();
            } else {
                toast.error(data.error || 'Error al actualizar');
            }
        } catch (error) {
            toast.error('Error al actualizar reporte');
        }
    };

    const deleteReport = async (reportId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este reporte diario? Esta acción no se puede deshacer.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/daily-reports/${reportId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Reporte eliminado');
                if (selectedReport && selectedReport.id === reportId) {
                    setSelectedReport(null);
                    setIsEditing(false);
                }
                onReload();
            } else {
                toast.error(data.error || 'Error al eliminar');
            }
        } catch (error) {
            toast.error('Error al eliminar reporte');
        }
    };

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setEditData(report);
        setIsEditing(false);
    };

    const handleEditReport = (report) => {
        setSelectedReport(report);
        setEditData({ ...report });
        setIsEditing(true);
    };

    const handleFieldChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const generatePDF = (report) => {
        handleViewReport(report);
        setTimeout(() => {
            window.print();
        }, 500);
    };

    if (loading) return <Loading message="Cargando reportes..." />;

    if (selectedReport) {
        return (
            <DailyReportDetailView
                report={selectedReport}
                editData={editData}
                isEditing={isEditing}
                machinery={machinery}
                onBack={() => { setSelectedReport(null); setIsEditing(false); setEditData({}); }}
                onSave={updateReport}
                onDelete={() => deleteReport(selectedReport.id)}
                onChange={handleFieldChange}
                onEdit={() => setIsEditing(true)}
                onCancel={() => { setIsEditing(false); setEditData(selectedReport); }}
            />
        );
    }

    return (
        <div className="daily-report-view">
            <div className="view-header">
                <h2>📅 Reportes Diarios</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    ➕ Nuevo Reporte
                </button>
            </div>

            {reports.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <p>No hay reportes diarios registrados</p>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        Crear Primer Reporte
                    </button>
                </div>
            ) : (
                <div className="reports-list">
                    {reports.map(report => (
                        <div key={report.id} className="report-card">
                            <div className="card-header">
                                <span className="date">{new Date(report.fecha).toLocaleDateString('es-BO')}</span>
                                <span className="chofer">🧑‍✈️ {report.chofer_nombre || 'Sin chofer'}</span>
                            </div>
                            <div className="card-actions">
                                <button className="btn btn-sm btn-secondary" onClick={() => handleViewReport(report)}>👁️ Ver</button>
                                <button className="btn btn-sm btn-primary" onClick={() => handleEditReport(report)}>✏️ Editar</button>
                                <button className="btn btn-sm btn-danger" onClick={() => deleteReport(report.id)}>🗑️ Eliminar</button>
                                <button className="btn btn-sm btn-info" onClick={() => generatePDF(report)}>📄 PDF</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>➕ Nuevo Reporte Diario</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>Se creará un nuevo reporte diario para la fecha de hoy.</p>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                            <button className="btn btn-primary" onClick={createReport}>Crear Reporte</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Daily Report Detail View Component
function DailyReportDetailView({ report, editData, isEditing, machinery, onBack, onSave, onDelete, onChange, onEdit, onCancel }) {
    const reportData = isEditing ? editData : report;
    
    const activities = [
        { key: 'limpieza_lavado', label: 'Limpieza y Lavado' },
        { key: 'nivel_refrigerante', label: 'Nivel de Refrigerante' },
        { key: 'nivel_agua_plumas', label: 'Nivel de Agua Plumas' },
        { key: 'nivel_liquido_frenos', label: 'Nivel de Líquido de Frenos' },
        { key: 'nivel_liquido_hidraulico', label: 'Nivel de Líquido Hidráulico' },
        { key: 'nivel_electrolito_bateria', label: 'Nivel de Electrolito Batería' },
        { key: 'presion_neumaticos', label: 'Presión de Neumáticos' },
        { key: 'fugas_carter', label: 'Fugas de Carter' },
        { key: 'fugas_direccion', label: 'Fugas de Dirección' },
        { key: 'fugas_mangueras_frenos', label: 'Fugas de Mangueras de Frenos' },
        { key: 'fugas_combustible', label: 'Fugas de Combustible' },
        { key: 'fugas_agua', label: 'Fugas de Agua' },
        { key: 'luces_interiores', label: 'Luces Interiores' },
        { key: 'luces_exteriores', label: 'Luces Exteriores' },
        { key: 'estabilidad_motor', label: 'Estabilidad del Motor' },
        { key: 'temperatura_motor', label: 'Temperatura del Motor' },
        { key: 'sonidos_raros', label: 'Sonidos Raros' }
    ];

    const days = [
        { key: 'lunes', label: 'Lunes' },
        { key: 'martes', label: 'Martes' },
        { key: 'miercoles', label: 'Miércoles' },
        { key: 'jueves', label: 'Jueves' },
        { key: 'viernes', label: 'Viernes' }
    ];

    const handlePrint = () => {
        window.print();
    };

    const fechaFormateada = new Date(reportData.fecha).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    // Calcular estadísticas dinámicas
    const getActivityStatus = (value) => {
        if (value === 'R') return { text: 'R', class: 'status-realizado', label: 'Realizado' };
        if (value === 'X') return { text: 'X', class: 'status-no-realizado', label: 'No Realizado' };
        if (value === 'N/A') return { text: 'N/A', class: 'status-na', label: 'N/A' };
        return { text: '-', class: 'status-pendiente', label: 'Pendiente' };
    };

    const getDayStats = (dayKey) => {
        const completed = activities.filter(a => {
            const value = reportData[`${a.key}_${dayKey}`];
            return value === 'R';
        }).length;
        const total = activities.length;
        return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    };

    return (
        <div className="daily-report-detail-view">
            <div className="report-actions">
                <button className="btn btn-back" onClick={onBack}>← Volver</button>
                {isEditing ? (
                    <>
                        <button className="btn btn-success" onClick={onSave}>💾 Guardar</button>
                        <button className="btn btn-secondary" onClick={onCancel}>❌ Cancelar</button>
                    </>
                ) : (
                    <>
                        <button className="btn btn-primary" onClick={onEdit}>✏️ Editar</button>
                        <button className="btn btn-info" onClick={handlePrint}>📄 Imprimir/PDF</button>
                        <button className="btn btn-danger" onClick={() => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar este reporte diario? Esta acción no se puede deshacer.')) {
                                onDelete();
                            }
                        }}>🗑️ Eliminar</button>
                    </>
                )}
            </div>

            <div className="report-document">
                {/* Header Profesional */}
                <div className="report-header">
                    <div className="report-logo-section">
                        <div className="report-logo">
                            <div className="logo-text">PAN AMERICAN SILVER</div>
                        </div>
                    </div>
                    <div className="report-title-section">
                        <h1 className="report-main-title">REPORTE DIARIO DE MANTENIMIENTO</h1>
                        <h2 className="report-subtitle">
                            {machinery?.nombre?.toUpperCase() || reportData.maquinaria_nombre?.toUpperCase() || 'MAQUINARIA'}
                        </h2>
                    </div>
                    <div className="report-doc-info">
                        <div className="doc-info-row">
                            <span className="doc-label">CÓDIGO:</span>
                            <span className="doc-value">{machinery?.codigo || reportData.maquinaria_codigo || 'N/A'}</span>
                        </div>
                        <div className="doc-info-row">
                            <span className="doc-label">FECHA:</span>
                            <span className="doc-value">{fechaFormateada}</span>
                        </div>
                        <div className="doc-info-row">
                            <span className="doc-label">CHOFER:</span>
                            <span className="doc-value">{reportData.chofer_nombre || 'Sin asignar'}</span>
                        </div>
                    </div>
                </div>

                {/* Estadísticas Semanales */}
                <div className="report-stats">
                    {days.map(day => {
                        const stats = getDayStats(day.key);
                        return (
                            <div key={day.key} className="stat-card">
                                <div className="stat-day">{day.label}</div>
                                <div className="stat-progress">
                                    <div className="stat-bar">
                                        <div 
                                            className="stat-bar-fill" 
                                            style={{ width: `${stats.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="stat-text">
                                        {stats.completed}/{stats.total} ({stats.percentage}%)
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Tabla Principal */}
                <div className="report-table-wrapper">
                    <table className="report-main-table">
                        <thead>
                            <tr>
                                <th rowSpan="2" className="col-activity">ACTIVIDAD</th>
                                <th colSpan="5" className="col-days-header">DÍAS DE LA SEMANA</th>
                            </tr>
                            <tr>
                                {days.map(day => {
                                    const stats = getDayStats(day.key);
                                    return (
                                        <th key={day.key} className="col-day">
                                            <div className="day-header">
                                                <span className="day-name">{day.label}</span>
                                                <span className="day-stats">{stats.completed}/{stats.total}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity, index) => (
                                <tr key={activity.key} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                    <td className="activity-name">{activity.label}</td>
                                    {days.map(day => {
                                        const fieldName = `${activity.key}_${day.key}`;
                                        const value = reportData[fieldName] || '';
                                        const status = getActivityStatus(value);
                                        return (
                                            <td key={day.key} className={`activity-day ${status.class}`}>
                                                {isEditing ? (
                                                    <select
                                                        className="report-select"
                                                        value={value}
                                                        onChange={e => onChange(fieldName, e.target.value)}
                                                    >
                                                        <option value="">-</option>
                                                        <option value="R">R (Realizado)</option>
                                                        <option value="X">X (No realizado)</option>
                                                        <option value="N/A">N/A</option>
                                                    </select>
                                                ) : (
                                                    <span className="status-badge" title={status.label}>
                                                        {status.text}
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Observaciones */}
                <div className="report-observaciones">
                    <div className="obs-header">
                        <span className="obs-icon">📝</span>
                        <span className="obs-title">OBSERVACIONES</span>
                    </div>
                    <div className="obs-content-wrapper">
                        {isEditing ? (
                            <textarea
                                className="report-obs-input"
                                value={reportData.observaciones || ''}
                                onChange={e => onChange('observaciones', e.target.value)}
                                rows="4"
                                placeholder="Ingrese observaciones relevantes sobre el mantenimiento..."
                            />
                        ) : (
                            <div className="report-obs-text">
                                {reportData.observaciones || 'Sin observaciones registradas'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Firmas */}
                <div className="report-firmas">
                    <div className="firma-section">
                        <div className="firma-title">REALIZÓ</div>
                        <div className="firma-line"></div>
                        <div className="firma-name">{reportData.realizado_por || ''}</div>
                    </div>
                    <div className="firma-section">
                        <div className="firma-title">REVISÓ</div>
                        <div className="firma-line"></div>
                        <div className="firma-name">{reportData.revisado_por || ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// History View Component
function HistoryView({ history, machinery, loading }) {
    if (loading) return <Loading message="Cargando historial..." />;

    return (
        <div className="history-view">
            <div className="view-header">
                <h2>📊 Historial de Mantenimientos</h2>
            </div>

            {history.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <p>No hay historial de mantenimientos registrados</p>
                </div>
            ) : (
                <div className="history-table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Horómetro</th>
                                <th>Observaciones</th>
                                <th>Costo Total</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(record => (
                                <tr key={record.id}>
                                    <td>{record.fecha_ejecucion ? new Date(record.fecha_ejecucion).toLocaleDateString('es-BO') : '-'}</td>
                                    <td>
                                        <span className={`badge badge-${record.tipo_mantenimiento?.toLowerCase()}`}>
                                            {record.tipo_mantenimiento}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${record.estado?.toLowerCase()}`}>
                                            {record.estado}
                                        </span>
                                    </td>
                                    <td>{record.horas_maquina || '-'}</td>
                                    <td className="obs-cell">{record.observaciones || '-'}</td>
                                    <td className="cost-cell">
                                        {record.costo_total ? `Bs. ${parseFloat(record.costo_total).toLocaleString()}` : '-'}
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn-info">📄 Ver</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MachineryForms;
