import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import './Machinery.css';

function Machinery() {
    const [machinery, setMachinery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadMachinery();
    }, []);

    const loadMachinery = async () => {
        try {
            setLoading(true);
            const data = await api.getMachinery();
            if (data.success && data.data) {
                // Filter out rows with null or empty values
                const filtered = data.data.filter(item =>
                    item['Unnamed: 3'] && item['Unnamed: 4']
                );
                setMachinery(filtered);
            }
            setError(null);
        } catch (err) {
            setError('Error al cargar maquinaria');
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
                    <button className="btn btn-primary" onClick={loadMachinery}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container fade-in">
            <div className="page-header">
                <h1>🚜 Inventario de Maquinaria</h1>
                <p className="page-subtitle">
                    Gestión y control de equipos pesados
                </p>
            </div>

            <div className="machinery-grid">
                {machinery.map((item, index) => (
                    <div key={index} className="machinery-card card">
                        <div className="machinery-header">
                            <div className="machinery-icon">🚜</div>
                            <div className="machinery-badge">
                                <span className="badge badge-success">{item['Unnamed: 8'] || 'OPERATIVO'}</span>
                            </div>
                        </div>

                        <div className="machinery-content">
                            <h3 className="machinery-name">{item['Unnamed: 4'] || 'N/A'}</h3>
                            <div className="machinery-details">
                                <div className="detail-item">
                                    <span className="detail-label">Código:</span>
                                    <span className="detail-value">{item['Unnamed: 3'] || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Marca:</span>
                                    <span className="detail-value">{item['Unnamed: 5'] || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Modelo:</span>
                                    <span className="detail-value">{item['Unnamed: 6'] || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Año:</span>
                                    <span className="detail-value">{item['Unnamed: 7'] || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {machinery.length === 0 && (
                <div className="empty-state">
                    <p>No se encontró maquinaria registrada</p>
                </div>
            )}
        </div>
    );
}

export default Machinery;
