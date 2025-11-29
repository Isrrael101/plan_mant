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
                    <p className="token-label">Token de recuperación:</p>
                    <div className="token-value">{token}</div>
                    <p className="token-note">Guarda este token si necesitas usarlo más tarde. Expira en 1 hora.</p>
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

