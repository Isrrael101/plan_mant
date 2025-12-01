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
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [twoFactorLoading, setTwoFactorLoading] = useState(false);
    const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [twoFactorSecret, setTwoFactorSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [disablePassword, setDisablePassword] = useState('');

    useEffect(() => {
        loadProfile();
        loadTwoFactorStatus();
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

    const loadTwoFactorStatus = async () => {
        try {
            const response = await api.getTwoFactorStatus();
            if (response.success) {
                setTwoFactorEnabled(response.enabled);
            }
        } catch (err) {
            console.error('Error cargando estado 2FA:', err);
        }
    };

    const handleSetupTwoFactor = async () => {
        try {
            setTwoFactorLoading(true);
            const response = await api.getTwoFactorSetup();
            if (response.success) {
                setQrCode(response.qrCode);
                setTwoFactorSecret(response.secret);
                setShowTwoFactorSetup(true);
                setTwoFactorEnabled(response.enabled);
            }
        } catch (err) {
            showError(err.message || 'Error al generar código QR');
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const handleVerifyTwoFactor = async (e) => {
        e.preventDefault();
        if (!verificationCode || verificationCode.length !== 6) {
            showError('Ingresa un código de 6 dígitos');
            return;
        }

        try {
            setTwoFactorLoading(true);
            const response = await api.verifyTwoFactorCode(verificationCode);
            if (response.success) {
                success('Autenticación de dos factores activada exitosamente');
                setShowTwoFactorSetup(false);
                setVerificationCode('');
                setQrCode('');
                setTwoFactorSecret('');
                setTwoFactorEnabled(true);
            }
        } catch (err) {
            showError(err.message || 'Código inválido');
        } finally {
            setTwoFactorLoading(false);
        }
    };

    const handleDisableTwoFactor = async (e) => {
        e.preventDefault();
        if (!disablePassword) {
            showError('Ingresa tu contraseña para desactivar 2FA');
            return;
        }

        try {
            setTwoFactorLoading(true);
            const response = await api.disableTwoFactor(disablePassword);
            if (response.success) {
                success('Autenticación de dos factores desactivada');
                setTwoFactorEnabled(false);
                setDisablePassword('');
            }
        } catch (err) {
            showError(err.message || 'Error al desactivar 2FA');
        } finally {
            setTwoFactorLoading(false);
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

                <div className="profile-section">
                    <h2>Autenticación de Dos Factores (2FA)</h2>
                    <div className="two-factor-section">
                        <div className="two-factor-status">
                            <div className="status-info">
                                <span className="status-label">Estado:</span>
                                <span className={`status-badge ${twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                                    {twoFactorEnabled ? '🔒 Activado' : '🔓 Desactivado'}
                                </span>
                            </div>
                            <p className="two-factor-description">
                                La autenticación de dos factores añade una capa adicional de seguridad a tu cuenta.
                                Necesitarás un código de tu aplicación Google Authenticator cada vez que inicies sesión.
                            </p>
                        </div>

                        {!twoFactorEnabled ? (
                            <div className="two-factor-setup">
                                {!showTwoFactorSetup ? (
                                    <button
                                        onClick={handleSetupTwoFactor}
                                        className="btn-primary"
                                        disabled={twoFactorLoading}
                                    >
                                        {twoFactorLoading ? 'Generando...' : '🔐 Activar 2FA'}
                                    </button>
                                ) : (
                                    <div className="qr-setup">
                                        <h3>Configurar Google Authenticator</h3>
                                        <ol className="setup-steps">
                                            <li>Descarga la aplicación <strong>Google Authenticator</strong> en tu teléfono</li>
                                            <li>Escanea este código QR con la aplicación:</li>
                                        </ol>
                                        {qrCode && (
                                            <div className="qr-code-container">
                                                <img src={qrCode} alt="QR Code" className="qr-code" />
                                            </div>
                                        )}
                                        <p className="secret-note">
                                            <strong>O ingresa manualmente:</strong> {twoFactorSecret}
                                        </p>
                                        <form onSubmit={handleVerifyTwoFactor} className="verify-form">
                                            <div className="form-group">
                                                <label>Código de Verificación</label>
                                                <input
                                                    type="text"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="000000"
                                                    maxLength={6}
                                                    required
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: '1.5rem',
                                                        letterSpacing: '0.5rem',
                                                        fontFamily: 'monospace',
                                                        width: '200px',
                                                        margin: '0 auto'
                                                    }}
                                                />
                                                <p className="field-note">Ingresa el código de 6 dígitos de Google Authenticator</p>
                                            </div>
                                            <div className="form-actions">
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => {
                                                        setShowTwoFactorSetup(false);
                                                        setVerificationCode('');
                                                        setQrCode('');
                                                        setTwoFactorSecret('');
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
                                                <button type="submit" className="btn-primary" disabled={twoFactorLoading}>
                                                    {twoFactorLoading ? 'Verificando...' : 'Verificar y Activar'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="two-factor-disable">
                                <form onSubmit={handleDisableTwoFactor} className="disable-form">
                                    <div className="form-group">
                                        <label>Contraseña Actual *</label>
                                        <input
                                            type="password"
                                            value={disablePassword}
                                            onChange={(e) => setDisablePassword(e.target.value)}
                                            placeholder="Ingresa tu contraseña para desactivar 2FA"
                                            required
                                        />
                                        <p className="field-note">Se requiere tu contraseña para desactivar la autenticación de dos factores</p>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-secondary"
                                        disabled={twoFactorLoading}
                                    >
                                        {twoFactorLoading ? 'Desactivando...' : 'Desactivar 2FA'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
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

