import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await api.getStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar estadísticas. Asegúrate de que el backend esté ejecutándose.');
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
                    <button className="btn btn-primary" onClick={loadStats}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Hojas',
            value: stats?.totalSheets || 0,
            icon: '📄',
            color: 'primary',
            description: 'Hojas en el sistema'
        },
        {
            title: 'Maquinaria',
            value: stats?.totalMachinery || 0,
            icon: '🚜',
            color: 'secondary',
            description: 'Equipos registrados'
        },
        {
            title: 'Personal',
            value: stats?.totalPersonnel || 0,
            icon: '👥',
            color: 'accent',
            description: 'Empleados activos'
        },
        {
            title: 'Herramientas',
            value: stats?.totalTools || 0,
            icon: '🔧',
            color: 'success',
            description: 'Herramientas disponibles'
        },
        {
            title: 'Insumos',
            value: stats?.totalSupplies || 0,
            icon: '📦',
            color: 'warning',
            description: 'Insumos en inventario'
        }
    ];

    return (
        <div className="container fade-in">
            <div className="dashboard-header">
                <h1>Dashboard de Mantenimiento</h1>
                <p className="dashboard-subtitle">
                    Sistema de gestión integral de maquinaria pesada
                </p>
            </div>

            <div className="stats-grid grid grid-3">
                {statCards.map((stat, index) => (
                    <div key={index} className={`stat-card card stat-${stat.color}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-content">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-title">{stat.title}</p>
                            <p className="stat-description">{stat.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-info">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">📊 Información del Sistema</h3>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Estado del Backend:</span>
                            <span className="badge badge-success">✓ Conectado</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Archivo Excel:</span>
                            <span className="info-value">Plan_Mant.xlsm</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Total de Hojas:</span>
                            <span className="info-value">{stats?.totalSheets || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">🎯 Acciones Rápidas</h3>
                    </div>
                    <div className="quick-actions">
                        <a href="/machinery" className="btn btn-primary">
                            Ver Maquinaria
                        </a>
                        <a href="/personnel" className="btn btn-secondary">
                            Gestionar Personal
                        </a>
                        <a href="/maintenance" className="btn btn-primary">
                            Cronogramas
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
