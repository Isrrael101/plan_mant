import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../components/Toast';
import './Users.css';

function Users() {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nombre_completo: '',
        email: '',
        rol: 'OPERADOR',
        estado: true
    });

    useEffect(() => {
        if (user?.rol === 'ADMIN') {
            loadUsers();
        }
    }, [user]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await api.getUsers();
            if (response.success) {
                setUsers(response.data);
            }
        } catch (err) {
            showError('Error al cargar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (userToEdit = null) => {
        if (userToEdit) {
            setEditingUser(userToEdit);
            setFormData({
                username: userToEdit.username,
                password: '',
                nombre_completo: userToEdit.nombre_completo || '',
                email: userToEdit.email || '',
                rol: userToEdit.rol,
                estado: userToEdit.estado
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                password: '',
                nombre_completo: '',
                email: '',
                rol: 'OPERADOR',
                estado: true
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            username: '',
            password: '',
            nombre_completo: '',
            email: '',
            rol: 'OPERADOR',
            estado: true
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username) {
            showError('El usuario es requerido');
            return;
        }

        if (!editingUser && !formData.password) {
            showError('La contraseña es requerida para nuevos usuarios');
            return;
        }

        try {
            if (editingUser) {
                const updateData = { ...formData };
                if (!updateData.password) {
                    delete updateData.password;
                }
                const response = await api.updateUser(editingUser.id, updateData);
                if (response.success) {
                    success('Usuario actualizado exitosamente');
                    loadUsers();
                    handleCloseModal();
                }
            } else {
                const response = await api.createUser(formData);
                if (response.success) {
                    success('Usuario creado exitosamente');
                    loadUsers();
                    handleCloseModal();
                }
            }
        } catch (err) {
            showError(err.message || 'Error al guardar usuario');
        }
    };

    const handleDelete = async (userId, username) => {
        if (!window.confirm(`¿Estás seguro de eliminar al usuario "${username}"?`)) {
            return;
        }

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

    if (user?.rol !== 'ADMIN') {
        return (
            <div className="users-container">
                <div className="access-denied">
                    <h2>Acceso Denegado</h2>
                    <p>Solo los administradores pueden acceder a esta sección.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="users-container">
                <div className="loading">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Gestión de Usuarios</h1>
                <button className="btn-primary" onClick={() => handleOpenModal()}>
                    + Nuevo Usuario
                </button>
            </div>

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Nombre Completo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Fecha Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="no-data">No hay usuarios registrados</td>
                            </tr>
                        ) : (
                            users.map((usr) => (
                                <tr key={usr.id}>
                                    <td>{usr.id}</td>
                                    <td>{usr.username}</td>
                                    <td>{usr.nombre_completo || '-'}</td>
                                    <td>
                                        <span className={`role-badge role-${usr.rol.toLowerCase()}`}>
                                            {usr.rol}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${usr.estado ? 'active' : 'inactive'}`}>
                                            {usr.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>{new Date(usr.created_at).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleOpenModal(usr)}
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        {usr.id !== user.id && (
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(usr.id, usr.username)}
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="user-form">
                            <div className="form-group">
                                <label>Usuario *</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    disabled={!!editingUser}
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Contraseña {!editingUser && '*'}
                                    {editingUser && <span className="hint">(dejar en blanco para no cambiar)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                />
                            </div>

                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.nombre_completo}
                                    onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email (Opcional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>Rol *</label>
                                <select
                                    value={formData.rol}
                                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
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
                                        checked={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                                    />
                                    {' '}Usuario Activo
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
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
        </div>
    );
}

export default Users;

