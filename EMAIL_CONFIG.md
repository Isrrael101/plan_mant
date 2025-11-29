# Configuración de Email para Recuperación de Contraseña

## Variables de Entorno Requeridas

Para habilitar el envío de emails, configura las siguientes variables de entorno en tu archivo `.env` del backend:

### Opción 1: Gmail (Recomendado para desarrollo)

```env
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_gmail
FRONTEND_URL=http://localhost:5173
```

**Cómo obtener App Password de Gmail:**
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Activa la **Verificación en 2 pasos** (si no está activada)
3. Ve a **Seguridad** > **Contraseñas de aplicaciones**
4. Genera una nueva contraseña para "Correo"
5. Usa esa contraseña de 16 caracteres en `EMAIL_PASSWORD`

### Opción 2: SMTP Genérico

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña
FRONTEND_URL=http://localhost:5173
```

### Opción 3: Otros Proveedores

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@outlook.com
EMAIL_PASSWORD=tu_contraseña
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@yahoo.com
EMAIL_PASSWORD=tu_app_password
```

## Modo Desarrollo

Si no configuras las variables de email, el sistema funcionará en **modo desarrollo**:
- El token se mostrará en la consola del servidor
- El token también se devolverá en la respuesta de la API (solo en desarrollo)
- No se enviará ningún email real

## Verificación

Para verificar que el email está configurado correctamente:
1. Configura las variables de entorno
2. Reinicia el servidor backend
3. Solicita una recuperación de contraseña
4. Revisa la consola del servidor para ver si el email se envió exitosamente

