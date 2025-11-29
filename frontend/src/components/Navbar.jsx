import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/machinery', label: 'Maquinaria', icon: '🚜' },
        { path: '/personnel', label: 'Personal', icon: '👥' },
        { path: '/maintenance', label: 'Mantenimiento', icon: '📅' },
        { path: '/inventory', label: 'Inventario', icon: '🔧' }
    ];

    // Agregar Administración solo para ADMIN
    if (user?.rol === 'ADMIN') {
        navItems.push({ path: '/users', label: 'Usuarios', icon: '👤' });
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <span className="logo-icon">⚙️</span>
                        <div className="logo-pulse"></div>
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">MTTO Pro</span>
                        <span className="brand-subtitle">Sistema de Mantenimiento</span>
                    </div>
                </Link>

                <button 
                    className={`mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                    {isActive && <span className="nav-indicator"></span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="navbar-actions">
                    <div className="navbar-user">
                        <Link to="/profile" className="user-link">
                            <span className="user-name">{user?.nombre || user?.username}</span>
                            <span className="user-role">{user?.rol}</span>
                        </Link>
                    </div>
                    <button onClick={logout} className="btn-logout" title="Cerrar sesión">
                        <span className="logout-icon">🚪</span>
                        <span className="logout-text">Salir</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
