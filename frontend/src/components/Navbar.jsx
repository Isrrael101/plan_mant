import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: '📊 Dashboard', icon: '📊' },
        { path: '/machinery', label: '🚜 Maquinaria', icon: '🚜' },
        { path: '/personnel', label: '👥 Personal', icon: '👥' },
        { path: '/maintenance', label: '📅 Mantenimiento', icon: '📅' },
        { path: '/inventory', label: '🔧 Inventario', icon: '🔧' }
    ];

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <div className="navbar-brand">
                        <h2 className="brand-title">⚙️ Plan de Mantenimiento</h2>
                        <p className="brand-subtitle">Sistema de Gestión</p>
                    </div>

                    <ul className="nav-links">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label.split(' ')[1]}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
