import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useToast } from '../components/Toast';
import './Profile.css';

function Profile() {
    const { user, setUser: setUserContext } = useAuth();
    const { success, error: showError } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        nombre_completo: '',
        email: '',
        rol: '',
        estado: true,
        created_at: null
    });
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await api.getProfile();
            if (response.success) {
                setProfile(response.data);
                // Manejar email - convertir null a string vacío para el formulario
                let emailValue = '';
                if (response.data.email && 
                    response.data.email !== null && 
                    response.data.email !== 'null' && 
                    response.data.email !== 'NULL' &&
                    typeof response.data.email === 'string') {
                    emailValue = response.data.email;
                }
                
                setFormData({
                    nombre_completo: response.data.nombre_completo || '',
                    email: emailValue,
                    password: '',
                    confirmPassword: ''
                });
            }
        } catch (err) {
            showError('Error al cargar perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        console.log('=== HANDLE SUBMIT INICIADO ===');
        e.preventDefault();
        console.log('PreventDefault ejecutado');

        if (formData.password && formData.password !== formData.confirmPassword) {
            console.log('Error: Contraseñas no coinciden');
            showError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            console.log('Error: Contraseña muy corta');
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        console.log('Iniciando actualización...');
        console.log('formData actual:', formData);

        try {
            setSaving(true);
            // Siempre incluir email, incluso si está vacío - convertir a null si está vacío
            let emailValue = null;
            if (formData.email && typeof formData.email === 'string' && formData.email.trim() !== '') {
                emailValue = formData.email.trim();
            }
            
            const updateData = {
                nombre_completo: formData.nombre_completo || '',
                email: emailValue // Siempre incluirlo, puede ser null
            };
            
            if (formData.password) {
                updateData.password = formData.password;
            }

            console.log('=== ENVIANDO ACTUALIZACIÓN DE PERFIL ===');
            console.log('formData.email:', formData.email);
            console.log('emailValue:', emailValue);
            console.log('updateData completo:', JSON.stringify(updateData, null, 2));
            
            const response = await api.updateProfile(updateData);
            console.log('Respuesta del servidor:', response);
            
            if (response.success) {
                success('Perfil actualizado exitosamente');
                await loadProfile();
                // Si cambió la contraseña, limpiar el campo
                if (formData.password) {
                    setFormData({
                        ...formData,
                        password: '',
                        confirmPassword: ''
                    });
                }
                // Actualizar el contexto de autenticación con los nuevos datos
                if (response.data && setUserContext) {
                    const updatedUser = {
                        ...user,
                        nombre: response.data.nombre_completo,
                        email: response.data.email
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    setUserContext(updatedUser);
                }
            }
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            console.error('Error completo:', JSON.stringify(err, null, 2));
            showError(err.message || 'Error al actualizar perfil');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading">Cargando perfil...</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu información personal y configuración de cuenta</p>
            </div>

            <div className="profile-card">
                <div className="profile-section">
                    <h2>Información Personal</h2>
                    <form onSubmit={(e) => {
                        console.log('🚀 FORMULARIO SUBMIT DISPARADO');
                        handleSubmit(e);
                    }} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    disabled
                                    className="disabled-input"
                                />
                                <span className="field-note">El nombre de usuario no puede ser modificado</span>
                            </div>
                            <div className="form-group">
                                <label>Rol</label>
                                <input
                                    type="text"
                                    value={profile.rol}
                                    disabled
                                    className="disabled-input"
                                />
                                <span className="field-note">El rol es asignado por el administrador</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nombre Completo *</label>
                            <input
                                type="text"
                                value={formData.nombre_completo}
                                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                                placeholder="Ingrese su nombre completo"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico</label>
                            <input
                                type="email"
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="correo@ejemplo.com"
                            />
                            <span className="field-note">Usado para recuperación de contraseña y notificaciones</span>
                        </div>

                        <div className="password-section">
                            <h3>Cambiar Contraseña</h3>
                            <p className="section-note">Dejar en blanco si no deseas cambiar la contraseña</p>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Repita la contraseña"
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn-primary" 
                                disabled={saving}
                            >
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="profile-info">
                    <div className="info-card">
                        <h3>Información de Cuenta</h3>
                        <div className="info-item">
                            <span className="info-label">Fecha de Registro:</span>
                            <span className="info-value">
                                {profile.created_at ? new Date(profile.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'N/A'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Estado:</span>
                            <span className={`status-badge ${profile.estado ? 'active' : 'inactive'}`}>
                                {profile.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;

