import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import './Inventory.css';

function Inventory() {
    const [tools, setTools] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('tools');

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
                    item['Unnamed: 3'] && item['Unnamed: 3'] !== 'HERRAMIENTA'
                );
                setTools(filtered);
            }

            if (suppliesData.success && suppliesData.data) {
                const filtered = suppliesData.data.filter(item =>
                    item['Unnamed: 3'] && item['Unnamed: 3'] !== 'INSUMOS'
                );
                setSupplies(filtered);
            }

            setError(null);
        } catch (err) {
            setError('Error al cargar inventario');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

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
                <h1>🔧 Inventario</h1>
                <p className="page-subtitle">
                    Herramientas e insumos disponibles
                </p>
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'tools' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tools')}
                >
                    🔧 Herramientas ({tools.length})
                </button>
                <button
                    className={`tab ${activeTab === 'supplies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('supplies')}
                >
                    📦 Insumos ({supplies.length})
                </button>
            </div>

            {activeTab === 'tools' && (
                <div className="inventory-section fade-in">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Código</th>
                                    <th>Herramienta</th>
                                    <th>Marca</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tools.map((tool, index) => (
                                    <tr key={index}>
                                        <td>{tool['Unnamed: 1'] || index + 1}</td>
                                        <td><span className="badge badge-success">{tool['Unnamed: 2'] || 'N/A'}</span></td>
                                        <td className="item-name">{tool['Unnamed: 3'] || 'N/A'}</td>
                                        <td>{tool['Unnamed: 4'] || 'N/A'}</td>
                                        <td>
                                            <span className={`badge ${tool['Unnamed: 5'] === 'OPERATIVO' ? 'badge-success' : 'badge-warning'}`}>
                                                {tool['Unnamed: 5'] || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'supplies' && (
                <div className="inventory-section fade-in">
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>Código</th>
                                    <th>Insumo</th>
                                    <th>Unidad</th>
                                    <th>P. Unitario</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplies.map((supply, index) => (
                                    <tr key={index}>
                                        <td>{supply['Unnamed: 1'] || index + 1}</td>
                                        <td><span className="badge badge-success">{supply['Unnamed: 2'] || 'N/A'}</span></td>
                                        <td className="item-name">{supply['Unnamed: 3'] || 'N/A'}</td>
                                        <td>{supply['Unnamed: 4'] || 'N/A'}</td>
                                        <td>${supply['Unnamed: 5'] || '0'}</td>
                                        <td><strong>{supply['Unnamed: 6'] || '0'}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Inventory;
