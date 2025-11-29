import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import './ResetPassword.css';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [username, setUsername] = useState('');
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (token) {
            verifyToken();
        } else {
            setVerifying(false);
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            const response = await api.verifyResetToken(token);
            if (response.success) {
                setTokenValid(true);
                setUsername(response.username);
            } else {
                setTokenValid(false);
            }
        } catch (err) {
            setTokenValid(false);
            showError('Token inválido o expirado');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.newPassword) {
            showError('La nueva contraseña es requerida');
            return;
        }

        if (formData.newPassword.length < 6) {
            showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);
            const response = await api.resetPassword(token, formData.newPassword);
            if (response.success) {
                success('Contraseña restablecida exitosamente. Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            showError(err.message || 'Error al restablecer contraseña');
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="loading">Verificando token...</div>
                </div>
            </div>
        );
    }

    if (!token || !tokenValid) {
        return (
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="error-state">
                        <h2>Token Inválido</h2>
                        <p>El token de recuperación es inválido o ha expirado.</p>
                        <button onClick={() => navigate('/login')} className="btn-primary">
                            Volver al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <div className="reset-password-header">
                    <img src="/25-09-21-FT-MTTO-LOGO.webp" alt="Logo" className="reset-logo" />
                    <h2>Restablecer Contraseña</h2>
                    <p>Usuario: <strong>{username}</strong></p>
                </div>
                
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="info-box">
                        <p>Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.</p>
                    </div>
                    
                    <div className="form-group">
                        <label>Nueva Contraseña *</label>
                        <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Confirmar Nueva Contraseña *</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            placeholder="Repita la contraseña"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/login')} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;

