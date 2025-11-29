/**
 * Utilidades para formatear valores en la aplicación
 */

/**
 * Formatea un valor numérico como moneda
 * Si el valor es 0, null, undefined o NaN, retorna null para ocultarlo
 */
export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
        return null;
    }
    if (num === 0) {
        return null;
    }
    return num.toLocaleString('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

/**
 * Formatea un valor numérico como moneda con prefijo Bs.
 * Retorna null si el valor es 0, null, undefined o NaN
 */
export const formatCurrencyBs = (value) => {
    const formatted = formatCurrency(value);
    if (formatted === null) {
        return null;
    }
    return `Bs. ${formatted}`;
};

/**
 * Formatea un número entero
 * Retorna null si el valor es 0, null, undefined o NaN
 */
export const formatNumber = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const num = parseInt(value);
    if (isNaN(num) || !isFinite(num)) {
        return null;
    }
    if (num === 0) {
        return null;
    }
    return num.toLocaleString('es-BO');
};
export const validateNonZero = (value, fieldName = 'Valor') => {
    const num = parseFloat(value);
    if (isNaN(num) || num === 0) {
        throw new Error(`${fieldName} debe ser mayor a cero`);
    }
    return num;
};

/**
 * Obtiene un valor seguro de un objeto, retornando null si es 0, null, undefined o NaN
 */
export const getSafeValue = (obj, key, defaultValue = null) => {
    if (!obj) return defaultValue;
    const value = obj[key];
    if (value === null || value === undefined || value === '' || value === 0 || value === '0' || value === '0.00') {
        return defaultValue;
    }
    if (typeof value === 'number' && (isNaN(value) || !isFinite(value) || value === 0)) {
        return defaultValue;
    }
    return value;
};

/**
 * Formatea un valor de costo para mostrar en la UI
 * Si es 0 o inválido, retorna un guión
 */
export const displayCost = (value) => {
    const formatted = formatCurrencyBs(value);
    return formatted || '-';
};

/**
 * Parsea un valor de forma segura, retornando 0 si es inválido
 */
export const safeParseFloat = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const num = parseFloat(value);
    if (isNaN(num) || !isFinite(num)) {
        return defaultValue;
    }
    return num;
};

/**
 * Parsea un entero de forma segura, retornando 0 si es inválido
 */
export const safeParseInt = (value, defaultValue = 0) => {
    if (value === null || value === undefined || value === '') {
        return defaultValue;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || !isFinite(num)) {
        return defaultValue;
    }
    return num;
};

/**
 * Formatea un número de forma segura para mostrar
 * Nunca retorna NaN, siempre retorna un string válido o null
 */
export const safeFormatNumber = (value, options = {}) => {
    const num = safeParseFloat(value);
    if (num === 0 && !options.allowZero) {
        return null;
    }
    try {
        return num.toLocaleString('es-BO', {
            minimumFractionDigits: options.decimals || 2,
            maximumFractionDigits: options.decimals || 2,
            ...options
        });
    } catch (e) {
        return null;
    }
};

/**
 * Formatea un costo de forma segura con prefijo Bs.
 * Nunca muestra NaN
 */
export const safeFormatCurrency = (value) => {
    const formatted = safeFormatNumber(value, { decimals: 2, allowZero: false });
    if (formatted === null) {
        return null;
    }
    return `Bs. ${formatted}`;
};

/**
 * Formatea un número entero de forma segura
 */
export const safeFormatInteger = (value) => {
    const num = safeParseInt(value);
    if (num === 0) {
        return null;
    }
    try {
        return num.toLocaleString('es-BO');
    } catch (e) {
        return null;
    }
};

