# 🚀 Guía Rápida: Configurar Email

## Paso 1: Elige tu proveedor de email

El sistema necesita **una cuenta de email** para enviar emails a todos los usuarios (pueden tener Hotmail, Gmail, corporativo, etc.).

## Paso 2: Edita docker-compose.yaml

Abre el archivo `docker-compose.yaml` y busca la sección `backend` → `environment`.

### Para Hotmail/Outlook:

Descomenta y completa estas líneas (quita el `#` al inicio):

```yaml
environment:
  NODE_ENV: development
  PORT: 3001
  MYSQL_HOST: mysql
  MYSQL_PORT: 3306
  MYSQL_DATABASE: mtto_db
  MYSQL_USER: mtto_user
  MYSQL_PASSWORD: mtto_password
  
  # Configuración de Email - HOTMAIL/OUTLOOK
  EMAIL_HOST: smtp-mail.outlook.com
  EMAIL_PORT: 587
  EMAIL_SECURE: false
  EMAIL_USER: tu_email@hotmail.com          # ⬅️ Cambia esto por tu email
  EMAIL_PASSWORD: tu_contraseña_hotmail     # ⬅️ Cambia esto por tu contraseña
  FRONTEND_URL: http://localhost:8080
```

### Para Gmail:

```yaml
environment:
  # ... otras variables ...
  
  # Configuración de Email - GMAIL
  EMAIL_HOST: smtp.gmail.com
  EMAIL_PORT: 587
  EMAIL_SECURE: false
  EMAIL_USER: tu_email@gmail.com            # ⬅️ Cambia esto por tu email
  EMAIL_PASSWORD: tu_app_password           # ⬅️ App Password (ver abajo)
  FRONTEND_URL: http://localhost:8080
```

**Para Gmail necesitas App Password:**
1. Ve a https://myaccount.google.com/
2. Activa "Verificación en 2 pasos"
3. Ve a "Seguridad" > "Contraseñas de aplicaciones"
4. Genera una contraseña para "Correo"
5. Usa esa contraseña de 16 caracteres

### Para Email Corporativo:

```yaml
environment:
  # ... otras variables ...
  
  # Configuración de Email - CORPORATIVO
  EMAIL_HOST: smtp.tu-empresa.com           # ⬅️ Servidor SMTP de tu empresa
  EMAIL_PORT: 587                           # O 465
  EMAIL_SECURE: false                       # true si usas puerto 465
  EMAIL_USER: sistema@tu-empresa.com        # ⬅️ Email corporativo
  EMAIL_PASSWORD: tu_contraseña             # ⬅️ Contraseña
  FRONTEND_URL: http://localhost:8080
```

## Paso 3: Reinicia el backend

Después de editar `docker-compose.yaml`, ejecuta:

```bash
docker-compose restart backend
```

## Paso 4: Verifica

1. Intenta recuperar una contraseña
2. Revisa los logs: `docker-compose logs backend`
3. Deberías ver: `✅ Email enviado exitosamente`

## ⚠️ Importante

- El sistema envía emails **desde** la cuenta que configures
- Puede enviar **a cualquier dirección** (Hotmail, Gmail, corporativo, etc.)
- Los usuarios solo necesitan tener un email registrado en su cuenta

