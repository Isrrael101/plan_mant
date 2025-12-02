import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import { safeFormatCurrency, safeFormatInteger, safeParseFloat, safeParseInt } from '../utils/formatters';
import './Inventory.css';

function Inventory() {
    const [tools, setTools] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('tools');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('tool');
    const [editingItem, setEditingItem] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '',
        nombre: '',
        marca: '',
        estado: 'OPERATIVO',
        unidad: '',
        precio: '',
        cantidad: ''
    });
    const toast = useToast();

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setLoading(true);
            const [toolsData, suppliesData] = await Promise.all([
                api.getTools(),
                api.getSupplies()
            ]);

            if (toolsData.success && toolsData.data) {
                const filtered = toolsData.data.filter(item =>
                    (item.nombre || item['Unnamed: 3']) && (item.nombre || item['Unnamed: 3']) !== 'HERRAMIENTA'
                );
                setTools(filtered);
            }

            if (suppliesData.success && suppliesData.data) {
                const filtered = suppliesData.data.filter(item =>
                    (item.nombre || item['Unnamed: 3']) && (item.nombre || item['Unnamed: 3']) !== 'INSUMOS'
                );
                setSupplies(filtered);
            }

            setError(null);
        } catch (err) {
            setError('Error al cargar inventario');
            toast.error('Error al cargar datos del inventario');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterItems = (items) => {
        if (!searchTerm) return items;
        const term = searchTerm.toLowerCase();
        return items.filter(item => {
            const name = ((item.nombre || item['Unnamed: 3']) || '').toLowerCase();
            const code = ((item.codigo || item['Unnamed: 2']) || '').toLowerCase();
            return name.includes(term) || code.includes(term);
        });
    };

    const handleCreate = (type) => {
        setModalType(type);
        setEditingItem(null);
        setEditingIndex(null);
        setFormData({
            codigo: '',
            nombre: '',
            marca: '',
            estado: 'OPERATIVO',
            unidad: '',
            precio: '',
            cantidad: ''
        });
        setShowModal(true);
    };

    const handleEdit = (item, index, type) => {
        setModalType(type);
        setEditingItem(item.id || item['id'] || null);
        setEditingIndex(index);
        if (type === 'tool') {
            setFormData({
                codigo: item.codigo || item['Unnamed: 2'] || '',
                nombre: item.nombre || item['Unnamed: 3'] || '',
                marca: item.marca || item['Unnamed: 4'] || '',
                estado: item.estado || item['Unnamed: 5'] || 'OPERATIVO',
                unidad: '',
                precio: '',
                cantidad: '',
                costo: item['costo'] || ''
            });
        } else {
            setFormData({
                codigo: item.codigo || item['Unnamed: 2'] || '',
                nombre: item.nombre || item['Unnamed: 3'] || '',
                marca: '',
                estado: '',
                unidad: item.unidad || item['Unnamed: 4'] || '',
                precio: item.precio_unitario || item['Unnamed: 5'] || '',
                cantidad: item.cantidad || item['Unnamed: 6'] || ''
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (item, type) => {
        const itemType = type === 'tool' ? 'herramienta' : 'insumo';
        if (window.confirm(`¿Estás seguro de que deseas eliminar este ${itemType}?`)) {
            try {
                const itemId = item.id || item['id'];
                if (!itemId) {
                    toast.error('Error: ID no encontrado');
                    return;
                }
                if (type === 'tool') {
                    await api.deleteTool(itemId);
                } else {
                    await api.deleteSupply(itemId);
                }
                toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} eliminado correctamente`);
                await loadInventory();
            } catch (err) {
                toast.error('Error al eliminar: ' + err.message);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let data;
            if (modalType === 'tool') {
                data = {
                    codigo: formData.codigo,
                    nombre: formData.nombre,
                    marca: formData.marca,
                    estado: formData.estado,
                    costo: safeParseFloat(formData.costo)
                };
            } else {
                data = {
                    codigo: formData.codigo,
                    nombre: formData.nombre,
                    unidad: formData.unidad,
                    precio_unitario: safeParseFloat(formData.precio),
                    cantidad: safeParseInt(formData.cantidad)
                };
            }
            
            if (editingItem !== null) {
                if (modalType === 'tool') {
                    await api.updateTool(editingItem, data);
                } else {
                    await api.updateSupply(editingItem, data);
                }
                toast.success(`${modalType === 'tool' ? 'Herramienta' : 'Insumo'} actualizado correctamente`);
            } else {
                if (modalType === 'tool') {
                    await api.createTool(data);
                } else {
                    await api.createSupply(data);
                }
                toast.success(`${modalType === 'tool' ? 'Herramienta' : 'Insumo'} creado correctamente`);
            }
            
            setShowModal(false);
            await loadInventory();
        } catch (err) {
            toast.error('Error al guardar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredTools = filterItems(tools);
    const filteredSupplies = filterItems(supplies);

    const getToolStatusCount = (status) => {
        return tools.filter(item => (item.estado || item['Unnamed: 5'] || 'OPERATIVO') === status).length;
    };

    if (loading) return <Loading message="Cargando inventario" />;

    if (error) {
        return (
            <div className="container fade-in">
                <div className="error-message">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadInventory}>
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
                    <h1>🔧 Inventario</h1>
                    <p className="page-subtitle">
                        Gestión de herramientas e insumos
                    </p>
                </div>
                <div className="page-actions">
                    <button className="btn btn-secondary" onClick={() => handleCreate('tool')}>
                        <span>🔧</span> Nueva Herramienta
                    </button>
                    <button className="btn btn-primary" onClick={() => handleCreate('supply')}>
                        <span>📦</span> Nuevo Insumo
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="inventory-stats">
                <div className="inv-stat-card">
                    <span className="inv-stat-icon">🔧</span>
                    <div className="inv-stat-content">
                        <span className="inv-stat-value">{tools.length}</span>
                        <span className="inv-stat-label">Herramientas</span>
                    </div>
                </div>
                <div className="inv-stat-card">
                    <span className="inv-stat-icon">📦</span>
                    <div className="inv-stat-content">
                        <span className="inv-stat-value">{supplies.length}</span>
                        <span className="inv-stat-label">Insumos</span>
                    </div>
                </div>
                <div className="inv-stat-card success">
                    <span className="inv-stat-icon">✅</span>
                    <div className="inv-stat-content">
                        <span className="inv-stat-value">{getToolStatusCount('OPERATIVO')}</span>
                        <span className="inv-stat-label">Operativos</span>
                    </div>
                </div>
                <div className="inv-stat-card warning">
                    <span className="inv-stat-icon">🔄</span>
                    <div className="inv-stat-content">
                        <span className="inv-stat-value">{getToolStatusCount('MANTENIMIENTO')}</span>
                        <span className="inv-stat-label">En Mantención</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="inventory-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tools')}
                >
                    <span>🔧</span> Herramientas ({tools.length})
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'supplies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('supplies')}
                >
                    <span>📦</span> Insumos ({supplies.length})
                </button>
            </div>

            {/* Search */}
            <div className="filters-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar herramienta o insumo por nombre o código"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
                    )}
                </div>
            </div>

            {/* Tools Table */}
            {activeTab === 'tools' && (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{width: '5%'}}>N°</th>
                                <th style={{width: '10%'}}>Código</th>
                                <th style={{width: '28%'}}>Herramienta</th>
                                <th style={{width: '15%'}}>Marca</th>
                                <th style={{width: '12%'}}>Estado</th>
                                <th style={{width: '13%'}}>Costo (Bs.)</th>
                                <th style={{width: '12%'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTools.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-row">
                                        <div className="empty-state">
                                            <div className="empty-icon">🔧</div>
                                            <p>No se encontraron herramientas</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTools.map((tool, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span className="code-badge">{tool.codigo || tool['Unnamed: 2'] || 'N/A'}</span>
                                        </td>
                                        <td className="item-name" title={tool.nombre || tool['Unnamed: 3']}>
                                            {tool.nombre || tool['Unnamed: 3'] || 'N/A'}
                                        </td>
                                        <td>{tool.marca || tool['Unnamed: 4'] || 'N/A'}</td>
                                        <td>
                                            <span className={`badge ${
                                                (tool.estado || tool['Unnamed: 5']) === 'OPERATIVO' ? 'badge-success' : 
                                                (tool.estado || tool['Unnamed: 5']) === 'MANTENIMIENTO' ? 'badge-warning' : 
                                                'badge-error'
                                            }`}>
                                                {tool.estado || tool['Unnamed: 5'] || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="cost-cell">
                                            {safeFormatCurrency(tool['costo']) ? (
                                                <span className="cost-value">
                                                    {safeFormatCurrency(tool['costo'])}
                                                </span>
                                            ) : (
                                                <span className="no-data">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-action btn-edit" 
                                                    onClick={() => handleEdit(tool, index, 'tool')}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-action btn-delete" 
                                                    onClick={() => handleDelete(tool, 'tool')}
                                                    title="Eliminar"
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
            )}

            {/* Supplies Table */}
            {activeTab === 'supplies' && (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{width: '5%'}}>N°</th>
                                <th style={{width: '12%'}}>Código</th>
                                <th style={{width: '30%'}}>Insumo</th>
                                <th style={{width: '13%'}}>Unidad</th>
                                <th style={{width: '15%'}}>P. Unitario</th>
                                <th style={{width: '10%'}}>Cantidad</th>
                                <th style={{width: '15%'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSupplies.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-row">
                                        <div className="empty-state">
                                            <div className="empty-icon">📦</div>
                                            <p>No se encontraron insumos</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSupplies.map((supply, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span className="code-badge">{supply.codigo || supply['Unnamed: 2'] || 'N/A'}</span>
                                        </td>
                                        <td className="item-name" title={supply.nombre || supply['Unnamed: 3']}>
                                            {supply.nombre || supply['Unnamed: 3'] || 'N/A'}
                                        </td>
                                        <td>{supply.unidad || supply['Unnamed: 4'] || 'N/A'}</td>
                                        <td className="price-cell">
                                            {safeFormatCurrency(supply.precio_unitario || supply['Unnamed: 5']) ? (
                                                <span>{safeFormatCurrency(supply.precio_unitario || supply['Unnamed: 5'])}</span>
                                            ) : (
                                                <span className="no-data">-</span>
                                            )}
                                        </td>
                                        <td>
                                            {safeFormatInteger(supply.cantidad || supply['Unnamed: 6']) ? (
                                                <span className="quantity-badge">
                                                    {safeFormatInteger(supply.cantidad || supply['Unnamed: 6'])}
                                                </span>
                                            ) : (
                                                <span className="no-data">-</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-action btn-edit" 
                                                    onClick={() => handleEdit(supply, index, 'supply')}
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-action btn-delete" 
                                                    onClick={() => handleDelete(supply, 'supply')}
                                                    title="Eliminar"
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
            )}

            {/* Results count */}
            <div className="results-count">
                Mostrando {activeTab === 'tools' ? filteredTools.length : filteredSupplies.length} de {activeTab === 'tools' ? tools.length : supplies.length} {activeTab === 'tools' ? 'herramientas' : 'insumos'}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !isSubmitting && setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {editingIndex !== null ? '✏️ Editar' : '➕ Agregar'} {modalType === 'tool' ? 'Herramienta' : 'Insumo'}
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
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Código <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.codigo}
                                        onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                                        placeholder={modalType === 'tool' ? 'Ej: HER-001' : 'Ej: INS-001'}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{modalType === 'tool' ? 'Herramienta' : 'Insumo'} <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                        placeholder="Nombre del item"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            
                            {modalType === 'tool' ? (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Marca</label>
                                            <input
                                                type="text"
                                                value={formData.marca}
                                                onChange={(e) => setFormData({...formData, marca: e.target.value})}
                                                placeholder="Marca de la herramienta"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <select
                                                value={formData.estado}
                                                onChange={(e) => setFormData({...formData, estado: e.target.value})}
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
                                            <label>Costo (Bs.)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.costo}
                                                onChange={(e) => setFormData({...formData, costo: e.target.value})}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Unidad</label>
                                            <input
                                                type="text"
                                                value={formData.unidad}
                                                onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                                                placeholder="Ej: Litros, Unidad, Kg"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Precio Unitario (Bs.)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.precio}
                                                onChange={(e) => setFormData({...formData, precio: e.target.value})}
                                                placeholder="0.00"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Cantidad</label>
                                        <input
                                            type="number"
                                            value={formData.cantidad}
                                            onChange={(e) => setFormData({...formData, cantidad: e.target.value})}
                                            placeholder="Cantidad en stock"
                                            disabled={isSubmitting}
                                        />
                                    </div>
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

export default Inventory;
