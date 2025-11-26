import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import './Personnel.css';

function Personnel() {
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadPersonnel();
    }, []);

    const loadPersonnel = async () => {
        try {
            setLoading(true);
            const data = await api.getPersonnel();
            if (data.success && data.data) {
                // Filter out header row and empty rows
                const filtered = data.data.filter(item =>
                    item['Unnamed: 3'] && item['Unnamed: 3'] !== 'APELLIDOS Y NOMBRES'
                );
                setPersonnel(filtered);
            }
            setError(null);
        } catch (err) {
            setError('Error al cargar personal');
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
                <h1>👥 Gestión de Personal</h1>
                <p className="page-subtitle">
                    Directorio de empleados y contactos
                </p>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>N°</th>
                            <th>Código</th>
                            <th>Nombre Completo</th>
                            <th>C.I.</th>
                            <th>Cargo</th>
                            <th>Teléfono</th>
                            <th>Celular</th>
                        </tr>
                    </thead>
                    <tbody>
                        {personnel.map((person, index) => (
                            <tr key={index}>
                                <td>{person['INVENTARIO PERSONAL'] || index + 1}</td>
                                <td><span className="badge badge-success">{person['Unnamed: 2'] || 'N/A'}</span></td>
                                <td className="personnel-name">{person['Unnamed: 3'] || 'N/A'}</td>
                                <td>{person['Unnamed: 4'] || 'N/A'}</td>
                                <td>{person['Unnamed: 5'] || 'N/A'}</td>
                                <td>{person['Unnamed: 6'] || 'N/A'}</td>
                                <td>{person['Unnamed: 7'] || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {personnel.length === 0 && (
                <div className="empty-state">
                    <p>No se encontró personal registrado</p>
                </div>
            )}

            <div className="personnel-stats">
                <div className="card">
                    <h3>📊 Estadísticas</h3>
                    <p className="stat-large">{personnel.length}</p>
                    <p className="stat-label">Total de Empleados</p>
                </div>
            </div>
        </div>
    );
}

export default Personnel;
