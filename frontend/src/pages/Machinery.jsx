import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { safeFormatCurrency, safeParseFloat } from '../utils/formatters';
import './Machinery.css';

function Machinery() {
    const [machinery, setMachinery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        marca: '',
        modelo: '',
        año: '',
        estado: 'OPERATIVO',
        costo_adquisicion: '',
        horas_totales: ''
    });
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        loadMachinery();
    }, []);

    const loadMachinery = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getMachinery();
            console.log('API Response:', data);
            
            if (data && data.success && data.data) {
                console.log('=== MACHINERY LOAD ===');
                console.log('API Response:', data);
                console.log('Total items received:', data.data.length);
                console.log('First item:', JSON.stringify(data.data[0], null, 2));
                
                // NO filtrar - aceptar todos los items
                const allItems = data.data;
                console.log('Setting machinery state with', allItems.length, 'items');
                console.log('First item to set:', allItems[0]);
                setMachinery(allItems);
            } else {
                console.warn('No data received or invalid response:', data);
                setMachinery([]);
            }
        } catch (err) {
            console.error('Error loading machinery:', err);
            setError('Error al cargar maquinaria: ' + (err.message || 'Error desconocido'));
            toast.error('Error al cargar datos de maquinaria');
            setMachinery([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({
            codigo: '',
            nombre: '',
            marca: '',
            modelo: '',
            año: '',
            estado: 'OPERATIVO',
            costo_adquisicion: '',
            horas_totales: ''
        });
        setShowModal(true);
    };

    const handleEdit = (item, index) => {
        setEditingItem(item.id || null);
        setFormData({
            codigo: item.codigo || '',
            nombre: item.nombre || '',
            marca: item.marca || '',
            modelo: item.modelo || '',
            año: item.anio || '',
            estado: item.estado || 'OPERATIVO',
            costo_adquisicion: item.costo_adquisicion || '',
            horas_totales: item.horas_totales || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (item) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
            try {
                const itemId = item.id;
                if (!itemId) {
                    toast.error('Error: ID no encontrado');
                    return;
                }
                await api.deleteMachinery(itemId);
                toast.success('Equipo eliminado correctamente');
                await loadMachinery();
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
                nombre: formData.nombre,
                marca: formData.marca,
                modelo: formData.modelo,
                anio: formData.año,
                estado: formData.estado,
                costo_adquisicion: safeParseFloat(formData.costo_adquisicion),
                horas_totales: safeParseFloat(formData.horas_totales) || 0
            };

            if (editingItem !== null) {
                await api.updateMachinery(editingItem, data);
                toast.success('Equipo actualizado correctamente');
            } else {
                await api.createMachinery(data);
                toast.success('Equipo creado correctamente');
            }

            setShowModal(false);
            await loadMachinery();
        } catch (err) {
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredMachinery = machinery.filter(item => {
        if (!item) return false;
        const matchesSearch =
            (item.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.marca || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' ||
            (item.estado || 'OPERATIVO') === filterStatus;

        return matchesSearch && matchesFilter;
    });
    
    console.log('Machinery state:', machinery.length, 'items');
    console.log('Filtered machinery:', filteredMachinery.length, 'items');

    const getStatusCount = (status) => {
        return machinery.filter(item => (item.estado || 'OPERATIVO') === status).length;
    };

    if (loading) return <Loading message="Cargando maquinaria" />;

    if (error) {
        return (
            <div className="container fade-in">
                <div className="error-message">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadMachinery}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // DEBUG: Mostrar información de estado
    console.log('=== RENDER DEBUG ===');
    console.log('machinery state:', machinery);
    console.log('machinery length:', machinery.length);
    console.log('filteredMachinery length:', filteredMachinery.length);
    console.log('loading:', loading);
    console.log('error:', error);

    return (
        <div className="container fade-in">
            {/* DEBUG INFO - REMOVER DESPUÉS */}
            <div style={{background: '#ff0', padding: '10px', marginBottom: '10px', fontSize: '12px'}}>
                <strong>DEBUG:</strong> Machinery: {machinery.length} | Filtered: {filteredMachinery.length} | Loading: {loading ? 'YES' : 'NO'}
            </div>
            <div className="page-header">
                <div>
                    <h1>🚜 Inventario de Maquinaria</h1>
                    <p className="page-subtitle">
                        Gestión y control de equipos pesados
                    </p>
                </div>
                <div className="page-actions">
                    <button className="btn btn-primary" onClick={handleCreate}>
                        <span>➕</span> Agregar Equipo
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="stats-summary">
                <div className="summary-item">
                    <span className="summary-value">{machinery.length}</span>
                    <span className="summary-label">Total Equipos</span>
                </div>
                <div className="summary-item success">
                    <span className="summary-value">{getStatusCount('OPERATIVO')}</span>
                    <span className="summary-label">Operativos</span>
                </div>
                <div className="summary-item warning">
                    <span className="summary-value">{getStatusCount('MANTENIMIENTO')}</span>
                    <span className="summary-label">En Mantenimiento</span>
                </div>
                <div className="summary-item error">
                    <span className="summary-value">{getStatusCount('INACTIVO')}</span>
                    <span className="summary-label">Inactivos</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar equipo por código, nombre o marca"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
                    )}
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        Todos
                    </button>
                    <button
                        className={`filter-btn success ${filterStatus === 'OPERATIVO' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('OPERATIVO')}
                    >
                        Operativos
                    </button>
                    <button
                        className={`filter-btn warning ${filterStatus === 'MANTENIMIENTO' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('MANTENIMIENTO')}
                    >
                        Mantenimiento
                    </button>
                    <button
                        className={`filter-btn error ${filterStatus === 'INACTIVO' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('INACTIVO')}
                    >
                        Inactivos
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '8%' }}>Código</th>
                            <th style={{ width: '18%' }}>Nombre</th>
                            <th style={{ width: '10%' }}>Marca</th>
                            <th style={{ width: '10%' }}>Modelo</th>
                            <th style={{ width: '6%' }}>Año</th>
                            <th style={{ width: '10%' }}>Estado</th>
                            <th style={{ width: '10%' }}>Costo (Bs.)</th>
                            <th style={{ width: '14%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMachinery.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="empty-row">
                                    <div className="empty-state">
                                        <div className="empty-icon">🚜</div>
                                        <p>No se encontraron equipos</p>
                                        {searchTerm && (
                                            <button className="btn btn-ghost" onClick={() => setSearchTerm('')}>
                                                Limpiar búsqueda
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredMachinery.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className="code-badge">{item.codigo || 'N/A'}</span>
                                    </td>
                                    <td className="item-name" title={item.nombre}>
                                        {item.nombre || 'N/A'}
                                    </td>
                                    <td title={item.marca}>{item.marca || 'N/A'}</td>
                                    <td title={item.modelo}>{item.modelo || 'N/A'}</td>
                                    <td>{item.anio || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${item.estado === 'OPERATIVO' ? 'badge-success' :
                                                item.estado === 'MANTENIMIENTO' ? 'badge-warning' :
                                                    'badge-error'
                                            }`}>
                                            {item.estado || 'OPERATIVO'}
                                        </span>
                                    </td>
                                    <td className="cost-cell">
                                        {safeFormatCurrency(item.costo_adquisicion) ? (
                                            <span className="cost-value">
                                                {safeFormatCurrency(item.costo_adquisicion)}
                                            </span>
                                        ) : (
                                            <span className="no-data">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-action btn-forms"
                                                onClick={() => navigate(`/machinery/${item.id}/forms`)}
                                                title="Fichas y Checklists"
                                            >
                                                📋
                                            </button>
                                            <button
                                                className="btn-action btn-edit"
                                                onClick={() => handleEdit(item, index)}
                                                title="Editar equipo"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => handleDelete(item)}
                                                title="Eliminar equipo"
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
            {filteredMachinery.length > 0 && (
                <div className="results-count">
                    Mostrando {filteredMachinery.length} de {machinery.length} equipos
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !isSubmitting && setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingItem !== null ? '✏️ Editar' : '➕ Agregar'} Equipo</h2>
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
                                        onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                                        placeholder="Ej: EQ-001"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nombre <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        placeholder="Nombre del equipo"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input
                                        type="text"
                                        value={formData.marca}
                                        onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                                        placeholder="Ej: Caterpillar"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Modelo</label>
                                    <input
                                        type="text"
                                        value={formData.modelo}
                                        onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                                        placeholder="Ej: D6T"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Año</label>
                                    <input
                                        type="text"
                                        value={formData.año}
                                        onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                                        placeholder="Ej: 2020"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        disabled={isSubmitting}
                                    >
                                        <option value="OPERATIVO">✅ Operativo</option>
                                        <option value="MANTENIMIENTO">🔧 En Mantenimiento</option>
                                        <option value="INACTIVO">⛔ Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Costo de Adquisición (Bs.)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.costo_adquisicion}
                                        onChange={(e) => setFormData({ ...formData, costo_adquisicion: e.target.value })}
                                        placeholder="0.00"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Horas Totales</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.horas_totales}
                                        onChange={(e) => setFormData({ ...formData, horas_totales: e.target.value })}
                                        placeholder="0.00"
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
                                    {isSubmitting ? 'Guardando' : (editingItem !== null ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Machinery;
