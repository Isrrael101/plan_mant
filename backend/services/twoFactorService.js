// -*- coding: utf-8 -*-
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Genera un secreto para autenticación de dos factores (2FA)
 * @param {string} username - Nombre de usuario
 * @param {string} serviceName - Nombre del servicio (ej: "MTTO Pro")
 * @returns {Object} Objeto con el secreto y la URL para el QR code
 */
export const generateSecret = (username, serviceName = 'MTTO Pro') => {
    const secret = speakeasy.generateSecret({
        name: `${serviceName} (${username})`,
        issuer: serviceName,
        length: 32
    });

    return {
        secret: secret.base32,
        otpauth_url: secret.otpauth_url
    };
};

/**
 * Genera un código QR en formato base64 para mostrar al usuario
 * @param {string} otpauthUrl - URL del secreto OTP
 * @returns {Promise<string>} QR code en base64
 */
export const generateQRCode = async (otpauthUrl) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generando QR code:', error);
        throw new Error('Error al generar código QR');
    }
};

/**
 * Verifica un código TOTP (Time-based One-Time Password)
 * @param {string} secret - Secreto base32 del usuario
 * @param {string} token - Código ingresado por el usuario
 * @returns {boolean} true si el código es válido
 */
export const verifyToken = (secret, token) => {
    try {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 2 // Permite códigos con 2 períodos de tolerancia (60 segundos antes/después)
        });
    } catch (error) {
        console.error('Error verificando token:', error);
        return false;
    }
};

