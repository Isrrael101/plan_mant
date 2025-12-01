import { useState } from 'react';
import api from '../services/api';
import { useToast } from '../components/Toast';
import './ResetPasswordForm.css';

function ResetPasswordForm({ token, onSuccess, onCancel }) {
    const { success, error: showError } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

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
                success('Contraseña restablecida exitosamente');
                onSuccess();
            }
        } catch (err) {
            showError(err.message || 'Error al restablecer contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
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

            {token && (
                <div className="token-display">
                    <div className="token-header">
                        <p className="token-label">🔑 Token de Recuperación de Contraseña</p>
                        <button
                            type="button"
                            className="btn-copy-token"
                            onClick={() => {
                                navigator.clipboard.writeText(token);
                                success('Token copiado al portapapeles');
                            }}
                            title="Copiar token"
                        >
                            📋 Copiar
                        </button>
                    </div>
                    <div className="token-value" onClick={() => {
                        navigator.clipboard.writeText(token);
                        success('Token copiado al portapapeles');
                    }} style={{ cursor: 'pointer' }} title="Clic para copiar">
                        {token}
                    </div>
                    <p className="token-note">
                        ✅ <strong>Token generado exitosamente.</strong> Usa este token para restablecer tu contraseña. 
                        El token expira en 1 hora. Puedes copiarlo haciendo clic en el botón o en el token mismo.
                    </p>
                </div>
            )}

            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
                    Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </button>
            </div>
        </form>
    );
}

export default ResetPasswordForm;

