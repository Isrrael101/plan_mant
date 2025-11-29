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
            const data = await api.getPersonnel();
            if (data.success && data.data) {
                const filtered = data.data.filter(item =>
                    item['Unnamed: 3'] && item['Unnamed: 3'] !== 'APELLIDOS Y NOMBRES'
                );
                setPersonnel(filtered);
            }
            setError(null);
        } catch (err) {
            setError('Error al cargar personal');
            toast.error('Error al cargar datos del personal');
            console.error(err);
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
        setEditingItem(person.id || person['id'] || null);
        setFormData({
            codigo: person['Unnamed: 2'] || '',
            nombre: person['Unnamed: 3'] || '',
            ci: person['Unnamed: 4'] || '',
            cargo: person['Unnamed: 5'] || '',
            telefono: person['Unnamed: 6'] || '',
            celular: person['Unnamed: 7'] || '',
            tarifa_hora: person['tarifa_hora'] || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (person) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            try {
                const itemId = person.id || person['id'];
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
        const searchLower = searchTerm.toLowerCase();
        return (
            (person['Unnamed: 2'] || '').toLowerCase().includes(searchLower) ||
            (person['Unnamed: 3'] || '').toLowerCase().includes(searchLower) ||
            (person['Unnamed: 5'] || '').toLowerCase().includes(searchLower)
        );
    });

    // Get unique positions for stats
    const positions = [...new Set(personnel.map(p => p['Unnamed: 5']).filter(Boolean))];

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

    return (
        <div className="container fade-in">
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
                                    <td>{person['INVENTARIO PERSONAL'] || index + 1}</td>
                                    <td>
                                        <span className="code-badge">{person['Unnamed: 2'] || 'N/A'}</span>
                                    </td>
                                    <td className="personnel-name" title={person['Unnamed: 3']}>
                                        <div className="person-info">
                                            <span className="person-avatar">
                                                {(person['Unnamed: 3'] || 'U')[0].toUpperCase()}
                                            </span>
                                            <span className="person-name">{person['Unnamed: 3'] || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td>{person['Unnamed: 4'] || 'N/A'}</td>
                                    <td>
                                        <span className="cargo-badge">{person['Unnamed: 5'] || 'N/A'}</span>
                                    </td>
                                    <td className="contact-cell">
                                        {person['Unnamed: 6'] ? (
                                            <span className="phone-number">📞 {person['Unnamed: 6']}</span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="contact-cell">
                                        {person['Unnamed: 7'] ? (
                                            <span className="phone-number">📱 {person['Unnamed: 7']}</span>
                                        ) : 'N/A'}
                                    </td>
                                    <td className="cost-cell">
                                        {safeFormatCurrency(person['tarifa_hora']) ? (
                                            <span className="cost-value">
                                                {safeFormatCurrency(person['tarifa_hora'])}/h
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
