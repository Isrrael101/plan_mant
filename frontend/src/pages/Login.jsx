import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../components/Toast';
import ResetPasswordForm from './ResetPasswordForm';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const { login, user } = useAuth();
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

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
            const result = await login(username, password);
            if (!result.success) {
                setError(result.error);
            }
            // Si es admin, no redirigir automáticamente, permitir gestión de usuarios
            if (result.success && result.user?.rol !== 'ADMIN') {
                // La redirección se maneja en AuthContext para no-admin
            }
        } catch (err) {
            setError('Error inesperado. Por favor, intente nuevamente.');
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

    const [forgotPasswordData, setForgotPasswordData] = useState({
        username: '',
        email: ''
    });
    const [forgotPasswordStep, setForgotPasswordStep] = useState('request'); // 'request' o 'token'
    const [resetToken, setResetToken] = useState('');

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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        
        if (!forgotPasswordData.username && !forgotPasswordData.email) {
            showError('Debe proporcionar usuario o email');
            return;
        }

        try {
            const response = await api.forgotPassword(forgotPasswordData);
            if (response.success) {
                if (response.resetToken) {
                    // En desarrollo, mostrar el token directamente
                    setResetToken(response.resetToken);
                    setForgotPasswordStep('token');
                    success('Token de recuperación generado. Revisa tu email o usa el token mostrado.');
                } else {
                    // En producción, solo confirmar que se envió el email
                    success(response.message || 'Si el usuario existe, recibirás un email con las instrucciones.');
                    setShowForgotPasswordModal(false);
                    setForgotPasswordData({ username: '', email: '' });
                }
            }
        } catch (err) {
            showError(err.message || 'Error al solicitar recuperación de contraseña');
        }
    };

    return (
        <div className="login-container">
            <div className={`login-wrapper ${user && user.rol === 'ADMIN' ? 'with-admin' : ''}`}>
                <div className="login-card">
                    <div className="login-header">
                        <img src="/25-09-21-FT-MTTO-LOGO.webp" alt="Logo" className="login-logo" />
                        <h2>Bienvenido</h2>
                        <p>Sistema de Gestión de Mantenimiento</p>
                    </div>
                    {!user || user.rol !== 'ADMIN' ? (
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Ingrese su usuario"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Ingrese su contraseña"
                                    required
                                />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button
                                type="submit"
                                className="btn-login"
                                disabled={loading}
                            >
                                {loading ? 'Iniciando sesión...' : 'Ingresar'}
                            </button>

                            <div className="login-options">
                                <button
                                    type="button"
                                    className="link-button"
                                    onClick={() => setShowForgotPasswordModal(true)}
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                                <div className="divider">
                                    <span>o</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn-register"
                                    onClick={() => setShowRegisterModal(true)}
                                >
                                    Crear nueva cuenta
                                </button>
                            </div>
                        </form>
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
                                                            <span className="user-role role-{usr.rol.toLowerCase()}">{usr.rol}</span>
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
                                <h3>Crear Nueva Cuenta</h3>
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

                {/* Modal de Recuperación de Contraseña */}
                {showForgotPasswordModal && (
                    <div className="modal-overlay" onClick={() => {
                        setShowForgotPasswordModal(false);
                        setForgotPasswordStep('request');
                        setResetToken('');
                        setForgotPasswordData({ username: '', email: '' });
                    }}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Recuperar Contraseña</h3>
                                <button className="modal-close" onClick={() => {
                                    setShowForgotPasswordModal(false);
                                    setForgotPasswordStep('request');
                                    setResetToken('');
                                    setForgotPasswordData({ username: '', email: '' });
                                }}>×</button>
                            </div>
                            
                            {forgotPasswordStep === 'request' ? (
                                <form onSubmit={handleForgotPassword} className="user-form">
                                    <div className="info-box">
                                        <p>Ingresa tu usuario o email y te enviaremos un correo electrónico con las instrucciones para restablecer tu contraseña.</p>
                                    </div>
                                    <div className="form-group">
                                        <label>Usuario</label>
                                        <input
                                            type="text"
                                            value={forgotPasswordData.username}
                                            onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, username: e.target.value })}
                                            placeholder="Ingrese su nombre de usuario"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={forgotPasswordData.email}
                                            onChange={(e) => setForgotPasswordData({ ...forgotPasswordData, email: e.target.value })}
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>
                                    <p className="field-note">Debe proporcionar al menos uno: usuario o email</p>
                                    <div className="form-actions">
                                        <button type="button" className="btn-secondary" onClick={() => {
                                            setShowForgotPasswordModal(false);
                                            setForgotPasswordStep('request');
                                            setResetToken('');
                                            setForgotPasswordData({ username: '', email: '' });
                                        }}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn-primary">
                                            Solicitar Token
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <ResetPasswordForm 
                                    token={resetToken}
                                    onSuccess={() => {
                                        setShowForgotPasswordModal(false);
                                        setForgotPasswordStep('request');
                                        setResetToken('');
                                        setForgotPasswordData({ username: '', email: '' });
                                        success('Contraseña restablecida exitosamente. Ahora puedes iniciar sesión.');
                                    }}
                                    onCancel={() => {
                                        setShowForgotPasswordModal(false);
                                        setForgotPasswordStep('request');
                                        setResetToken('');
                                        setForgotPasswordData({ username: '', email: '' });
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
