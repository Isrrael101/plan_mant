@echo off
echo ========================================
echo Configurando Email - Reiniciando Backend
echo ========================================
docker-compose restart backend
echo.
echo Esperando 5 segundos...
timeout /t 5 /nobreak >nul
echo.
echo Verificando logs del backend...
docker-compose logs backend --tail 10
echo.
echo ========================================
echo Si ves "Email enviado exitosamente" = OK
echo Si ves "EMAIL_NOT_CONFIGURED" = Revisa la configuracion
echo ========================================
pause

