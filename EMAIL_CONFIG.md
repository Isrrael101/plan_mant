# Configuración de Email para Recuperación de Contraseña

## ⚠️ IMPORTANTE

**El sistema ahora requiere configuración de email para funcionar correctamente.** 

**Nota importante:** El sistema envía emails **desde** una cuenta configurada **hacia** cualquier dirección (Hotmail, Gmail, corporativo, etc.). Los usuarios pueden tener cualquier tipo de email, pero el sistema necesita una cuenta de email configurada para enviar.

## Variables de Entorno Requeridas

Para habilitar el envío de emails, configura las siguientes variables de entorno en `docker-compose.yaml` en la sección `backend` → `environment`:

### Opción 1: SMTP Genérico (Recomendado - Funciona con cualquier proveedor)

Esta opción funciona con **cualquier proveedor de email**: Hotmail, Gmail, Outlook, Yahoo, o servidores corporativos.

Edita `docker-compose.yaml` y descomenta/agrega estas líneas en la sección `backend` → `environment`:

#### Para Hotmail/Outlook:
```yaml
environment:
  # ... otras variables ...
  EMAIL_HOST: smtp-mail.outlook.com
  EMAIL_PORT: 587
  EMAIL_SECURE: false
  EMAIL_USER: tu_email@hotmail.com
  EMAIL_PASSWORD: tu_contraseña
  FRONTEND_URL: http://localhost:8080
```

#### Para Gmail:
```yaml
environment:
  # ... otras variables ...
  EMAIL_HOST: smtp.gmail.com
  EMAIL_PORT: 587
  EMAIL_SECURE: false
  EMAIL_USER: tu_email@gmail.com
  EMAIL_PASSWORD: tu_app_password  # Ver instrucciones abajo
  FRONTEND_URL: http://localhost:8080
```

#### Para Email Corporativo:
```yaml
environment:
  # ... otras variables ...
  EMAIL_HOST: smtp.tu-empresa.com  # Servidor SMTP de tu empresa
  EMAIL_PORT: 587                  # O 465 para SSL
  EMAIL_SECURE: false              # true si usas puerto 465
  EMAIL_USER: sistema@tu-empresa.com
  EMAIL_PASSWORD: tu_contraseña
  EMAIL_TLS_REJECT_UNAUTHORIZED: false  # Solo si tu servidor usa certificado autofirmado
  FRONTEND_URL: http://localhost:8080
```

### Opción 2: Servicio Predefinido (Solo Gmail/Outlook)

Si prefieres usar la configuración predefinida:

```yaml
environment:
  # ... otras variables ...
  EMAIL_SERVICE: gmail  # o 'hotmail', 'outlook'
  EMAIL_USER: tu_email@gmail.com
  EMAIL_PASSWORD: tu_app_password
  FRONTEND_URL: http://localhost:8080
```

## Configuración por Proveedor

### Hotmail/Outlook
- **EMAIL_HOST:** `smtp-mail.outlook.com`
- **EMAIL_PORT:** `587`
- **EMAIL_SECURE:** `false`
- **EMAIL_USER:** Tu email completo (ej: `usuario@hotmail.com`)
- **EMAIL_PASSWORD:** Tu contraseña normal de Hotmail/Outlook

### Gmail
- **EMAIL_HOST:** `smtp.gmail.com`
- **EMAIL_PORT:** `587`
- **EMAIL_SECURE:** `false`
- **EMAIL_USER:** Tu email completo (ej: `usuario@gmail.com`)
- **EMAIL_PASSWORD:** **App Password** (no tu contraseña normal)

**Cómo obtener App Password de Gmail:**
1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Activa la **Verificación en 2 pasos** (si no está activada)
3. Ve a **Seguridad** > **Contraseñas de aplicaciones**
4. Genera una nueva contraseña para "Correo"
5. Usa esa contraseña de 16 caracteres en `EMAIL_PASSWORD`

### Yahoo
- **EMAIL_HOST:** `smtp.mail.yahoo.com`
- **EMAIL_PORT:** `587`
- **EMAIL_SECURE:** `false`
- **EMAIL_USER:** Tu email completo
- **EMAIL_PASSWORD:** App Password (similar a Gmail)

### Email Corporativo
- **EMAIL_HOST:** Servidor SMTP de tu empresa (pregunta a tu administrador IT)
- **EMAIL_PORT:** Generalmente `587` o `465`
- **EMAIL_SECURE:** `false` para 587, `true` para 465
- **EMAIL_USER:** Email corporativo del sistema
- **EMAIL_PASSWORD:** Contraseña del email corporativo
- **EMAIL_TLS_REJECT_UNAUTHORIZED:** `false` si el servidor usa certificado autofirmado

## Configuración en Docker

1. Edita el archivo `docker-compose.yaml`
2. Busca la sección `backend` → `environment`
3. Descomenta y completa las variables de email según tu proveedor (ver ejemplos arriba)
4. Reinicia el backend:
   ```bash
   docker-compose restart backend
   ```

## Ejemplo Completo para Hotmail

```yaml
backend:
  environment:
    NODE_ENV: development
    PORT: 3001
    MYSQL_HOST: mysql
    MYSQL_PORT: 3306
    MYSQL_DATABASE: mtto_db
    MYSQL_USER: mtto_user
    MYSQL_PASSWORD: mtto_password
    EMAIL_HOST: smtp-mail.outlook.com
    EMAIL_PORT: 587
    EMAIL_SECURE: false
    EMAIL_USER: sistema@hotmail.com
    EMAIL_PASSWORD: tu_contraseña_hotmail
    FRONTEND_URL: http://localhost:8080
```

## ¿Cómo Funciona?

- El sistema envía emails **desde** la cuenta configurada (EMAIL_USER)
- Puede enviar **a cualquier dirección**: Hotmail, Gmail, corporativo, etc.
- Los usuarios solo necesitan tener un email registrado en su cuenta
- No importa qué tipo de email tenga el usuario, el sistema puede enviarle emails

## ⚠️ Sin Email Configurado

Si no configuras las variables de email:
- ❌ La recuperación de contraseña **NO funcionará**
- ❌ El sistema mostrará un error indicando que el servicio de email no está disponible
- ✅ Debes configurar el email para que el sistema funcione correctamente

## Verificación

Para verificar que el email está configurado correctamente:
1. Configura las variables de entorno
2. Reinicia el servidor backend
3. Solicita una recuperación de contraseña
4. Revisa la consola del servidor para ver si el email se envió exitosamente

