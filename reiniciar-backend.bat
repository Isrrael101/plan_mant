@echo off
echo Reiniciando backend para aplicar configuracion de email...
docker-compose restart backend
echo.
echo Esperando 5 segundos...
timeout /t 5 /nobreak >nul
echo.
echo Verificando configuracion...
docker-compose logs backend --tail 10
echo.
echo Si ves "Email enviado exitosamente" = Configuracion correcta
echo Si ves "EMAIL_NOT_CONFIGURED" = Revisa que hayas cambiado los valores en docker-compose.yaml
pause

