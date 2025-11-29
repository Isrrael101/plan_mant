// Test script para verificar que el campo email se guarda correctamente
const API_URL = 'http://localhost:3001/api';

async function testEmailField() {
    console.log('=== TEST: Verificando que el campo email se guarda correctamente ===\n');

    // 1. Login como admin
    console.log('1. Iniciando sesión como admin...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'admin',
            password: 'admin123'
        })
    });

    if (!loginResponse.ok) {
        const errorText = await loginResponse.text();
        console.error('❌ Error al iniciar sesión:', loginResponse.status);
        console.error('   Respuesta:', errorText);
        return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Sesión iniciada correctamente\n');

    // 2. Crear un usuario de prueba con email
    const testEmail = `test${Date.now()}@ejemplo.com`;
    const testUsername = `testuser${Date.now()}`;

    console.log('2. Creando usuario de prueba...');
    console.log(`   Username: ${testUsername}`);
    console.log(`   Email: ${testEmail}`);

    const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            username: testUsername,
            password: 'test123456',
            nombre_completo: 'Usuario de Prueba',
            email: testEmail,
            rol: 'OPERADOR'
        })
    });

    if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error('❌ Error al crear usuario:', errorData);
        return;
    }

    const createData = await createResponse.json();
    console.log('✅ Usuario creado correctamente');
    console.log(`   ID: ${createData.id}\n`);

    // 3. Obtener el usuario creado y verificar que el email se guardó
    console.log('3. Verificando que el email se guardó correctamente...');
    const getUserResponse = await fetch(`${API_URL}/users/${createData.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!getUserResponse.ok) {
        console.error('❌ Error al obtener usuario');
        return;
    }

    const userData = await getUserResponse.json();
    const savedEmail = userData.data.email;

    console.log(`   Email guardado: ${savedEmail}`);

    if (savedEmail === testEmail) {
        console.log('✅ ¡ÉXITO! El email se guardó correctamente\n');
    } else {
        console.log(`❌ ERROR: El email no coincide`);
        console.log(`   Esperado: ${testEmail}`);
        console.log(`   Recibido: ${savedEmail}\n`);
    }

    // 4. Limpiar - eliminar usuario de prueba
    console.log('4. Limpiando usuario de prueba...');
    const deleteResponse = await fetch(`${API_URL}/users/${createData.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (deleteResponse.ok) {
        console.log('✅ Usuario de prueba eliminado\n');
    }

    console.log('=== TEST COMPLETADO ===');
}

// Ejecutar el test
testEmailField().catch(console.error);
