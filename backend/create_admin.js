import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'mtto_user',
    password: process.env.MYSQL_PASSWORD || 'mtto_password',
    database: process.env.MYSQL_DATABASE || 'mtto_db'
};

async function createAdmin() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Intentar insertar o actualizar
        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
        
        if (rows.length > 0) {
            console.log('Actualizando usuario admin existente...');
            await connection.query('UPDATE users SET password = ?, rol = "ADMIN", estado = 1 WHERE username = ?', [hashedPassword, 'admin']);
        } else {
            console.log('Creando nuevo usuario admin...');
            await connection.query('INSERT INTO users (username, password, nombre_completo, rol, estado) VALUES (?, ?, ?, ?, ?)', 
                ['admin', hashedPassword, 'Administrador Sistema', 'ADMIN', 1]);
        }
        
        console.log('Usuario admin configurado exitosamente.');
        console.log('Usuario: admin');
        console.log('Password: admin123');
        
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();