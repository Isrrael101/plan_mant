// -*- coding: utf-8 -*-
import nodemailer from 'nodemailer';

// Configuración del servicio de email
const createTransporter = () => {
    // Si hay configuración SMTP personalizada, usarla
    if (process.env.EMAIL_HOST) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
            auth: {
                user: process.env.EMAIL_USER || '',
                pass: process.env.EMAIL_PASSWORD || ''
            }
        });
    }

    // Configuración para Gmail (puedes cambiar a otro proveedor)
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER || '',
            pass: process.env.EMAIL_PASSWORD || '' // Para Gmail, usar "App Password"
        }
    });

    return transporter;
};

// Plantilla HTML para email de recuperación de contraseña
const getResetPasswordEmailTemplate = (username, resetUrl, resetToken) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #0056b3 0%, #004494 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">MTTO Pro</h1>
        <p style="color: #e0e0e0; margin: 5px 0 0 0;">Sistema de Gestión de Mantenimiento</p>
    </div>
    
    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Recuperación de Contraseña</h2>
        
        <p>Hola <strong>${username}</strong>,</p>
        
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en MTTO Pro.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Tu token de recuperación:</p>
            <div style="background: white; padding: 15px; border: 2px dashed #0056b3; border-radius: 6px; font-family: monospace; font-size: 18px; font-weight: bold; color: #0056b3; word-break: break-all;">
                ${resetToken}
            </div>
        </div>
        
        <p>O haz clic en el siguiente botón para restablecer tu contraseña:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #0056b3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Restablecer Contraseña
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
            <strong>Importante:</strong>
        </p>
        <ul style="color: #666; font-size: 14px;">
            <li>Este token expira en <strong>1 hora</strong></li>
            <li>Si no solicitaste este cambio, ignora este email</li>
            <li>Nunca compartas este token con nadie</li>
        </ul>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            Este es un email automático, por favor no respondas a este mensaje.
        </p>
    </div>
</body>
</html>
    `;
};

// Función para enviar email de recuperación de contraseña
export const sendPasswordResetEmail = async (userEmail, username, resetToken, resetUrl) => {
    try {
        // Si no hay configuración de email, usar modo desarrollo (solo log)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('═══════════════════════════════════════════════════════');
            console.log('📧 EMAIL DE RECUPERACIÓN DE CONTRASEÑA (MODO DESARROLLO)');
            console.log('═══════════════════════════════════════════════════════');
            console.log(`Para: ${userEmail || 'No especificado'}`);
            console.log(`Usuario: ${username}`);
            console.log(`Token: ${resetToken}`);
            console.log(`URL: ${resetUrl}`);
            console.log('═══════════════════════════════════════════════════════');
            return { success: true, sent: false, mode: 'development' };
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: `"MTTO Pro" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Recuperación de Contraseña - MTTO Pro',
            html: getResetPasswordEmailTemplate(username, resetUrl, resetToken),
            text: `Hola ${username},\n\nHas solicitado restablecer tu contraseña.\n\nTu token de recuperación es: ${resetToken}\n\nO visita: ${resetUrl}\n\nEste token expira en 1 hora.\n\nSi no solicitaste este cambio, ignora este email.`
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email enviado exitosamente:', info.messageId);
        return { success: true, sent: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        // En desarrollo, no fallar si no se puede enviar el email
        if (process.env.NODE_ENV === 'development') {
            console.log('Modo desarrollo: continuando sin enviar email');
            return { success: true, sent: false, mode: 'development', error: error.message };
        }
        throw error;
    }
};

export default {
    sendPasswordResetEmail
};

