import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { safeFormatCurrency, safeParseFloat } from '../utils/formatters';
import './Personnel.css';

function Personnel() {
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        ci: '',
        cargo: '',
        telefono: '',
        celular: '',
        tarifa_hora: ''
    });
    const toast = useToast();

    useEffect(() => {
        loadPersonnel();
    }, []);

    const loadPersonnel = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getPersonnel();
            console.log('Personnel API Response:', data);
            
            if (data && data.success && data.data) {
                console.log('=== PERSONNEL LOAD ===');
                console.log('API Response:', data);
                console.log('Total items received:', data.data.length);
                console.log('First item:', JSON.stringify(data.data[0], null, 2));
                
                // NO filtrar - aceptar todos los items
                const allItems = data.data;
                console.log('Setting personnel state with', allItems.length, 'items');
                console.log('First item to set:', allItems[0]);
                setPersonnel(allItems);
            } else {
                console.warn('No data received or invalid response:', data);
                setPersonnel([]);
            }
        } catch (err) {
            console.error('Error loading personnel:', err);
            setError('Error al cargar personal: ' + (err.message || 'Error desconocido'));
            toast.error('Error al cargar datos del personal');
            setPersonnel([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            codigo: '',
            nombre: '',
            ci: '',
            cargo: '',
            telefono: '',
            celular: '',
            tarifa_hora: ''
        });
        setShowModal(true);
    };

    const handleEdit = (person, index) => {
        setEditingItem(person.id || null);
        setFormData({
            codigo: person.codigo || '',
            nombre: person.nombre_completo || '',
            ci: person.ci || '',
            cargo: person.cargo || '',
            telefono: person.telefono || '',
            celular: person.celular || '',
            tarifa_hora: person.tarifa_hora || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (person) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            try {
                const itemId = person.id;
                if (!itemId) {
                    toast.error('Error: ID no encontrado');
                    return;
                }
                await api.deletePersonnel(itemId);
                toast.success('Empleado eliminado correctamente');
                await loadPersonnel();
            } catch (err) {
                toast.error('Error al eliminar: ' + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                codigo: formData.codigo,
                nombre_completo: formData.nombre,
                ci: formData.ci,
                cargo: formData.cargo,
                telefono: formData.telefono,
                celular: formData.celular,
                tarifa_hora: safeParseFloat(formData.tarifa_hora)
            };
            
            if (editingItem !== null) {
                await api.updatePersonnel(editingItem, data);
                toast.success('Empleado actualizado correctamente');
            } else {
                await api.createPersonnel(data);
                toast.success('Empleado registrado correctamente');
            }
            
            setShowModal(false);
            await loadPersonnel();
        } catch (err) {
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredPersonnel = personnel.filter(person => {
        if (!person) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            (person.codigo || '').toLowerCase().includes(searchLower) ||
            (person.nombre_completo || '').toLowerCase().includes(searchLower) ||
            (person.cargo || '').toLowerCase().includes(searchLower)
        );
    });
    
    console.log('Personnel state:', personnel.length, 'items');
    console.log('Filtered personnel:', filteredPersonnel.length, 'items');

    // Get unique positions for stats
    const positions = [...new Set(personnel.map(p => p.cargo).filter(Boolean))];

    if (loading) return <Loading message="Cargando personal" />;

    if (error) {
        return (
            <div className="container fade-in">
                <div className="error-message">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadPersonnel}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // DEBUG: Mostrar información de estado
    console.log('=== RENDER DEBUG ===');
    console.log('personnel state:', personnel);
    console.log('personnel length:', personnel.length);
    console.log('filteredPersonnel length:', filteredPersonnel.length);
    console.log('loading:', loading);
    console.log('error:', error);

    return (
        <div className="container fade-in">
            {/* DEBUG INFO - REMOVER DESPUÉS */}
            <div style={{background: '#ff0', padding: '10px', marginBottom: '10px', fontSize: '12px'}}>
                <strong>DEBUG:</strong> Personnel: {personnel.length} | Filtered: {filteredPersonnel.length} | Loading: {loading ? 'YES' : 'NO'}
            </div>
            <div className="page-header">
                <div>
                    <h1>👥 Gestión de Personal</h1>
                    <p className="page-subtitle">
                        Directorio de empleados y contactos
                    </p>
                </div>
                <div className="page-actions">
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <span>➕</span> Agregar Empleado
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="personnel-stats-grid">
                <div className="personnel-stat-card primary">
                    <div className="stat-icon-container">
                        <span>👥</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{personnel.length}</span>
                        <span className="stat-label">Total Empleados</span>
                    </div>
                </div>
                <div className="personnel-stat-card info">
                    <div className="stat-icon-container">
                        <span>📋</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-number">{positions.length}</span>
                        <span className="stat-label">Cargos Diferentes</span>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="filters-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar personal por código, nombre o cargo"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{width: '5%'}}>N°</th>
                            <th style={{width: '10%'}}>Código</th>
                            <th style={{width: '25%'}}>Nombre Completo</th>
                            <th style={{width: '12%'}}>C.I.</th>
                            <th style={{width: '18%'}}>Cargo</th>
                            <th style={{width: '10%'}}>Teléfono</th>
                            <th style={{width: '10%'}}>Celular</th>
                            <th style={{width: '10%'}}>Tarifa/Hora</th>
                            <th style={{width: '10%'}}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPersonnel.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="empty-row">
                                    <div className="empty-state">
                                        <div className="empty-icon">👥</div>
                                        <p>No se encontró personal</p>
                                        {searchTerm && (
                                            <button className="btn btn-ghost" onClick={() => setSearchTerm('')}>
                                                Limpiar búsqueda
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredPersonnel.map((person, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className="code-badge">{person.codigo || 'N/A'}</span>
                                    </td>
                                    <td className="personnel-name" title={person.nombre_completo}>
                                        <div className="person-info">
                                            <span className="person-avatar">
                                                {(person.nombre_completo || 'U')[0].toUpperCase()}
                                            </span>
                                            <span className="person-name">{person.nombre_completo || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{person.ci || 'N/A'}</td>
                                    <td>
                                        <span className="cargo-badge">{person.cargo || 'N/A'}</span>
                                    </td>
                                    <td className="contact-cell">
                                        {person.telefono ? (
                                            <span className="phone-number">📞 {person.telefono}</span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="contact-cell">
                                        {person.celular ? (
                                            <span className="phone-number">📱 {person.celular}</span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="cost-cell">
                                        {safeFormatCurrency(person.tarifa_hora) ? (
                                            <span className="cost-value">
                                                {safeFormatCurrency(person.tarifa_hora)}/h
                                            </span>
                                        ) : (
                                            <span className="no-data">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-action btn-edit" 
                                                onClick={() => handleEdit(person, index)}
                                                title="Editar empleado"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                className="btn-action btn-delete" 
                                                onClick={() => handleDelete(person)}
                                                title="Eliminar empleado"
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

            {/* Results count */}
            {filteredPersonnel.length > 0 && (
                <div className="results-count">
                    Mostrando {filteredPersonnel.length} de {personnel.length} empleados
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !isSubmitting && setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem !== null ? '✏️ Editar' : '➕ Agregar'} Empleado</h2>
                            <button 
                                className="modal-close" 
                                onClick={() => !isSubmitting && setShowModal(false)}
                                disabled={isSubmitting}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Código <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.codigo}
                                        onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                                        placeholder="Ej: EMP-001"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>C.I.</label>
                                    <input
                                        type="text"
                                        value={formData.ci}
                                        onChange={(e) => setFormData({...formData, ci: e.target.value})}
                                        placeholder="Número de identificación"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Nombre Completo <span className="required">*</span></label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    placeholder="Apellidos y nombres"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cargo</label>
                                <input
                                    type="text"
                                    value={formData.cargo}
                                    onChange={(e) => setFormData({...formData, cargo: e.target.value})}
                                    placeholder="Ej: Técnico de Mantenimiento"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Teléfono</label>
                                    <input
                                        type="tel"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                        placeholder="Teléfono fijo"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Celular</label>
                                    <input
                                        type="tel"
                                        value={formData.celular}
                                        onChange={(e) => setFormData({...formData, celular: e.target.value})}
                                        placeholder="Teléfono móvil"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Tarifa por Hora (Bs.) <span className="required">*</span></label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.tarifa_hora}
                                    onChange={(e) => setFormData({...formData, tarifa_hora: e.target.value})}
                                    placeholder="0.00"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
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
                                    {isSubmitting ? 'Guardando' : (editingItem !== null ? 'Actualizar' : 'Registrar')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Personnel;
