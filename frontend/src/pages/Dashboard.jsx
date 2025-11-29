import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await api.getStats();
            
            if (data && data.success !== false) {
                setStats(data);
                setError(null);
            } else {
                if (data) {
                setStats({
                    totalMachinery: data.totalMachinery || 0,
                    totalPersonnel: data.totalPersonnel || 0,
                    totalTools: data.totalTools || 0,
                    totalSupplies: data.totalSupplies || 0
                });
                    setError(null);
                } else {
                    throw new Error('No se recibieron datos');
                }
            }
        } catch (err) {
            console.error('Error loading stats:', err);
            setStats({
                totalMachinery: 0,
                totalPersonnel: 0,
                totalTools: 0,
                totalSupplies: 0
            });
            setError('Error al conectar con el servidor. Verifica que el backend esté ejecutándose.');
            toast.error('Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading message="Cargando dashboard" />;

    if (error) {
        return (
            <div className="container fade-in">
                <div className="error-message">
                    <div className="error-icon">⚠️</div>
                    <h2>Error de Conexión</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadStats}>
                        Reintentar Conexión
                    </button>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Maquinaria',
            value: stats?.totalMachinery || 0,
            icon: '🚜',
            color: 'primary',
            description: 'Equipos registrados',
            link: '/machinery',
            trend: '+12%'
        },
        {
            title: 'Personal',
            value: stats?.totalPersonnel || 0,
            icon: '👥',
            color: 'info',
            description: 'Empleados activos',
            link: '/personnel',
            trend: '+3%'
        },
        {
            title: 'Herramientas',
            value: stats?.totalTools || 0,
            icon: '🔧',
            color: 'success',
            description: 'En inventario',
            link: '/inventory',
            trend: '+5%'
        },
        {
            title: 'Insumos',
            value: stats?.totalSupplies || 0,
            icon: '📦',
            color: 'warning',
            description: 'Stock disponible',
            link: '/inventory',
            trend: '-2%'
        }
    ];

    const quickActions = [
        { label: 'Ver Maquinaria', icon: '🚜', path: '/machinery', color: 'primary' },
        { label: 'Gestionar Personal', icon: '👥', path: '/personnel', color: 'info' },
        { label: 'Cronogramas', icon: '📅', path: '/maintenance', color: 'success' },
        { label: 'Inventario', icon: '🔧', path: '/inventory', color: 'warning' }
    ];

    return (
        <div className="container fade-in">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard de Mantenimiento</h1>
                    <p className="dashboard-subtitle">
                        Sistema de gestión integral para maquinaria pesada
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={loadStats}>
                        🔄 Actualizar
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="stats-section">
                <div className="stats-grid">
                    {statCards.map((stat, index) => (
                        <Link 
                            key={index} 
                            to={stat.link} 
                            className={`stat-card stat-${stat.color}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="stat-header">
                                <span className="stat-icon">{stat.icon}</span>
                                <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="stat-body">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-title">{stat.title}</span>
                                <span className="stat-description">{stat.description}</span>
                            </div>
                            <div className="stat-footer">
                                <span className="stat-link">Ver detalles →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Info Cards */}
            <section className="info-section">
                <div className="info-grid">
                    {/* System Status Card */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h3>📊 Estado del Sistema</h3>
                        </div>
                        <div className="info-card-body">
                            <div className="status-list">
                                <div className="status-item">
                                    <span className="status-label">Backend API</span>
                                    <span className="status-badge online">
                                        <span className="status-dot"></span>
                                        Conectado
                                    </span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Base de datos</span>
                                    <span className="status-badge online">
                                        <span className="status-dot"></span>
                                        MySQL
                                    </span>
                                </div>
                                <div className="status-item">
                                    <span className="status-label">Última actualización</span>
                                    <span className="status-value">{new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="info-card">
                        <div className="info-card-header">
                            <h3>🎯 Acciones Rápidas</h3>
                        </div>
                        <div className="info-card-body">
                            <div className="quick-actions-grid">
                                {quickActions.map((action, index) => (
                                    <Link 
                                        key={index}
                                        to={action.path}
                                        className={`quick-action-btn action-${action.color}`}
                                    >
                                        <span className="action-icon">{action.icon}</span>
                                        <span className="action-label">{action.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Overview */}
            <section className="features-section">
                <h2 className="section-title">Características del Sistema</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h4>Gestión de Activos</h4>
                        <p>Control completo del inventario de maquinaria, herramientas e insumos.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📅</div>
                        <h4>Planes de Mantenimiento</h4>
                        <p>Cronogramas preventivos organizados por horas de operación.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h4>Directorio de Personal</h4>
                        <p>Gestión del equipo técnico y contactos de emergencia.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h4>Reportes en Tiempo Real</h4>
                        <p>Estadísticas y métricas actualizadas del sistema.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
