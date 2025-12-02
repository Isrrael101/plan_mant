import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../components/Toast';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const { login, user } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // Habilitar scroll en la página de login
    useEffect(() => {
        document.body.classList.add('login-page-active');
        const root = document.getElementById('root');
        if (root) {
            root.classList.add('login-page-active');
        }
        
        return () => {
            document.body.classList.remove('login-page-active');
            if (root) {
                root.classList.remove('login-page-active');
            }
        };
    }, []);

    // Si el usuario ya está autenticado y no es admin, redirigir al dashboard
    // Si es admin, permitir mostrar gestión de usuarios en el login
    useEffect(() => {
        if (user && user.rol !== 'ADMIN') {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        username: '',
        password: '',
        nombre_completo: '',
        email: '',
        rol: 'OPERADOR',
        estado: true
    });

    useEffect(() => {
        if (user && user.rol === 'ADMIN') {
            loadUsers();
        }
    }, [user]);

    const loadUsers = async () => {
        try {
            setUsersLoading(true);
            const response = await api.getUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (err) {
            showError('Error al cargar usuarios');
        } finally {
            setUsersLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password, requiresTwoFactor ? twoFactorCode : null);

            if (result.requiresTwoFactor) {
                setRequiresTwoFactor(true);
                setError('');
            } else if (!result.success) {
                setError(result.error);
                setRequiresTwoFactor(false);
                setTwoFactorCode('');
            } else {
                // Login exitoso
                setRequiresTwoFactor(false);
                setTwoFactorCode('');
                // Si es admin, no redirigir automáticamente, permitir gestión de usuarios
                if (result.user?.rol !== 'ADMIN') {
                    // La redirección se maneja en AuthContext para no-admin
                }
            }
        } catch (err) {
            setError('Error inesperado. Por favor, intente nuevamente.');
            setRequiresTwoFactor(false);
        } finally {
            setLoading(false);
        }
    };

    const handleUserModal = (userToEdit = null) => {
        if (userToEdit) {
            setEditingUser(userToEdit);
            setUserFormData({
                username: userToEdit.username,
                password: '',
                nombre_completo: userToEdit.nombre_completo || '',
                email: userToEdit.email || '',
                rol: userToEdit.rol,
                estado: userToEdit.estado
            });
        } else {
            setEditingUser(null);
            setUserFormData({
                username: '',
                password: '',
                nombre_completo: '',
                email: '',
                rol: 'OPERADOR',
                estado: true
            });
        }
        setShowUserModal(true);
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const updateData = { ...userFormData };
                if (!updateData.password) delete updateData.password;
                const response = await api.updateUser(editingUser.id, updateData);
                if (response.success) {
                    success('Usuario actualizado exitosamente');
                    loadUsers();
                    setShowUserModal(false);
                }
            } else {
                const response = await api.createUser(userFormData);
                if (response.success) {
                    success('Usuario creado exitosamente');
                    loadUsers();
                    setShowUserModal(false);
                }
            }
        } catch (err) {
            showError(err.message || 'Error al guardar usuario');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`¿Eliminar usuario "${username}"?`)) return;
        try {
            const response = await api.deleteUser(userId);
            if (response.success) {
                success('Usuario eliminado exitosamente');
                loadUsers();
            }
        } catch (err) {
            showError(err.message || 'Error al eliminar usuario');
        }
    };

    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        nombre_completo: '',
        email: ''
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        if (registerData.password !== registerData.confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        if (registerData.password.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const response = await api.register({
                username: registerData.username,
                password: registerData.password,
                nombre_completo: registerData.nombre_completo,
                email: registerData.email
            });

            if (response.success) {
                success('Usuario creado exitosamente. Ahora puedes iniciar sesión.');
                setShowRegisterModal(false);
                setRegisterData({
                    username: '',
                    password: '',
                    confirmPassword: '',
                    nombre_completo: '',
                    email: ''
                });
                // Pre-llenar el campo de usuario
                setUsername(registerData.username);
            }
        } catch (err) {
            showError(err.message || 'Error al crear usuario');
        }
    };


    return (
        <div className="login-container">
            {/* Lado Izquierdo: Visual & Branding */}
            <div className="login-visual">
                <div className="visual-content">
                    <img src="/25-09-21-FT-MTTO-LOGO.webp" alt="Logo" className="visual-logo" />
                    <div className="visual-text">
                        <h1>Gestión de Mantenimiento</h1>
                        <p>Plataforma integral para el control y seguimiento de maquinaria y planes de mantenimiento.</p>
                    </div>
                </div>
            </div>

            {/* Lado Derecho: Formulario o Panel */}
            <div className="login-form-container">
                <div className={`login-wrapper ${user && user.rol === 'ADMIN' ? 'with-admin' : ''}`}>

                    {!user || user.rol !== 'ADMIN' ? (
                        <>
                            <div className="login-header">
                                <h2>Bienvenido</h2>
                                <p>Ingresa tus credenciales para continuar</p>
                            </div>
                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label>Usuario</label>
                                    <input
                                        type="text"
                                        name="login-username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Ingrese su usuario"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contraseña</label>
                                    <input
                                        type="password"
                                        name="login-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Ingrese su contraseña"
                                        autoComplete="new-password"
                                        required
                                        disabled={requiresTwoFactor}
                                    />
                                </div>
                                {requiresTwoFactor && (
                                    <div className="two-factor-container">
                                        <div className="two-factor-header">
                                            <div className="two-factor-icon">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.72-2.77 0-2.1-1.9-2.79-3.65-3.24z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <div className="two-factor-title">
                                                <h3>Verificación en Dos Pasos</h3>
                                                <p>Ingresa el código de 6 dígitos de Google Authenticator</p>
                                            </div>
                                        </div>
                                        <div className="code-input-container">
                                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                                <input
                                                    key={index}
                                                    type="tel"
                                                    inputMode="numeric"
                                                    pattern="[0-9]"
                                                    maxLength={1}
                                                    value={twoFactorCode[index] || ''}
                                                    style={{
                                                        color: '#2d3748',
                                                        WebkitTextFillColor: '#2d3748',
                                                        caretColor: '#667eea',
                                                        backgroundColor: '#ffffff',
                                                        opacity: 1
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, '');
                                                        if (value) {
                                                            const newCode = twoFactorCode.split('');
                                                            newCode[index] = value;
                                                            const updatedCode = newCode.join('').slice(0, 6);
                                                            setTwoFactorCode(updatedCode);

                                                            // Auto-focus siguiente campo
                                                            setTimeout(() => {
                                                                if (index < 5 && value) {
                                                                    const nextInput = e.target.parentElement.children[index + 1];
                                                                    if (nextInput) nextInput.focus();
                                                                }
                                                            }, 10);
                                                        } else {
                                                            // Si se borra, limpiar este campo
                                                            const newCode = twoFactorCode.split('');
                                                            newCode[index] = '';
                                                            setTwoFactorCode(newCode.join(''));
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
                                                            const prevInput = e.target.parentElement.children[index - 1];
                                                            if (prevInput) prevInput.focus();
                                                        }
                                                    }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                                        setTwoFactorCode(pastedData);
                                                        setTimeout(() => {
                                                            const targetIndex = Math.min(pastedData.length - 1, 5);
                                                            const targetInput = e.target.parentElement.children[targetIndex];
                                                            if (targetInput) targetInput.focus();
                                                        }, 10);
                                                    }}
                                                    className="code-digit"
                                                    autoFocus={index === 0 && twoFactorCode.length === 0}
                                                    required
                                                />
                                            ))}
                                        </div>
                                        <div className="two-factor-footer">
                                            <div className="security-badge">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor" />
                                                </svg>
                                                <span>Código seguro y temporal</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {error && <div className="error-message">{error}</div>}
                                <button
                                    type="submit"
                                    className="btn-login"
                                    disabled={loading}
                                >
                                    {loading ? 'Iniciando sesión...' : requiresTwoFactor ? 'Verificar Código' : 'Ingresar'}
                                </button>

                                <div className="login-options">
                                    <p className="login-options-title">¿No tienes cuenta?</p>
                                    <div className="login-actions-grid">
                                        <button
                                            type="button"
                                            className="link-button"
                                            onClick={() => setShowRegisterModal(true)}
                                        >
                                            Crear Usuario
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="admin-panel">
                            <div className="admin-welcome">
                                <p>¡Bienvenido, <strong>{user.nombre || user.username}</strong>!</p>
                                <div className="admin-actions">
                                    <button onClick={() => navigate('/dashboard')} className="btn-primary">
                                        Ir al Dashboard
                                    </button>
                                    <button onClick={() => setShowUserManagement(!showUserManagement)} className="btn-secondary">
                                        {showUserManagement ? 'Ocultar' : 'Gestionar'} Usuarios
                                    </button>
                                </div>
                            </div>

                            {showUserManagement && (
                                <div className="users-management">
                                    <div className="users-header-small">
                                        <h3>Gestión de Usuarios</h3>
                                        <button onClick={() => handleUserModal()} className="btn-small">
                                            + Nuevo Usuario
                                        </button>
                                    </div>

                                    {usersLoading ? (
                                        <div className="loading">Cargando...</div>
                                    ) : (
                                        <div className="users-list">
                                            {users.length === 0 ? (
                                                <p className="no-users">No hay usuarios</p>
                                            ) : (
                                                users.map((usr) => (
                                                    <div key={usr.id} className="user-item">
                                                        <div className="user-info">
                                                            <strong>{usr.username}</strong>
                                                            <span className={`user-role role-${usr.rol.toLowerCase()}`}>{usr.rol}</span>
                                                            {usr.nombre_completo && <span className="user-name">{usr.nombre_completo}</span>}
                                                        </div>
                                                        <div className="user-actions">
                                                            <button onClick={() => handleUserModal(usr)} className="btn-icon" title="Editar">✏️</button>
                                                            {usr.id !== user.id && (
                                                                <button onClick={() => handleDeleteUser(usr.id, usr.username)} className="btn-icon" title="Eliminar">🗑️</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Modal para crear/editar usuarios */}
                {showUserModal && (
                    <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                                <button className="modal-close" onClick={() => setShowUserModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleUserSubmit} className="user-form">
                                <div className="form-group">
                                    <label>Usuario *</label>
                                    <input
                                        type="text"
                                        value={userFormData.username}
                                        onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                                        required
                                        disabled={!!editingUser}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contraseña {!editingUser && '*'}</label>
                                    <input
                                        type="password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={userFormData.nombre_completo}
                                        onChange={(e) => setUserFormData({ ...userFormData, nombre_completo: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email (Opcional)</label>
                                    <input
                                        type="email"
                                        value={userFormData.email}
                                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Rol *</label>
                                    <select
                                        value={userFormData.rol}
                                        onChange={(e) => setUserFormData({ ...userFormData, rol: e.target.value })}
                                        required
                                    >
                                        <option value="OPERADOR">Operador</option>
                                        <option value="MANTENIMIENTO">Mantenimiento</option>
                                        <option value="ADMIN">Administrador</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={userFormData.estado}
                                            onChange={(e) => setUserFormData({ ...userFormData, estado: e.target.checked })}
                                        />
                                        {' '}Usuario Activo
                                    </label>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowUserModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingUser ? 'Actualizar' : 'Crear'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Modal de Registro */}
                {showRegisterModal && (
                    <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>📝 Crear Nuevo Usuario</h3>
                                <button className="modal-close" onClick={() => setShowRegisterModal(false)}>×</button>
                            </div>
                            <form onSubmit={handleRegister} className="user-form">
                                <div className="form-group">
                                    <label>Usuario *</label>
                                    <input
                                        type="text"
                                        value={registerData.username}
                                        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                                        placeholder="Elija un nombre de usuario"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={registerData.nombre_completo}
                                        onChange={(e) => setRegisterData({ ...registerData, nombre_completo: e.target.value })}
                                        placeholder="Ingrese su nombre completo"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email (Opcional)</label>
                                    <input
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contraseña *</label>
                                    <input
                                        type="password"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmar Contraseña *</label>
                                    <input
                                        type="password"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        placeholder="Repita la contraseña"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowRegisterModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Crear Cuenta
                                    </button>
                                </div>
                                <p className="register-note">
                                    Al crear una cuenta, aceptas los términos y condiciones del sistema.
                                    Un administrador debe aprobar tu cuenta para obtener acceso completo.
                                </p>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Login;
