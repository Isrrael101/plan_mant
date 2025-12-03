// -*- coding: utf-8 -*-
/**
 * Script para exportar todas las tablas de MySQL a CSV con UTF-8
 */
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la base de datos
const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'mtto_user',
    password: process.env.MYSQL_PASSWORD || 'mtto_password',
    database: process.env.MYSQL_DATABASE || 'mtto_db',
    charset: 'utf8mb4'
};

// Directorio de exportación - desde la raíz del proyecto
const projectRoot = path.resolve(__dirname, '../../');
const EXPORT_DIR = path.join(projectRoot, 'database/csv_exports');

// Crear directorio si no existe
if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

// Función para escapar valores CSV
function escapeCSV(value) {
    if (value === null || value === undefined) {
        return '';
    }
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Función para exportar tabla a CSV
async function exportTableToCSV(connection, tableName) {
    try {
        // Obtener nombres de columnas
        const [columns] = await connection.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        `, [dbConfig.database, tableName]);
        
        if (columns.length === 0) {
            console.log(`⚠ Tabla ${tableName} no encontrada`);
            return false;
        }
        
        const columnNames = columns.map(col => col.COLUMN_NAME);
        
        // Obtener datos
        const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
        
        if (rows.length === 0) {
            console.log(`⚠ Tabla ${tableName} está vacía`);
            return false;
        }
        
        // Escribir CSV con BOM UTF-8
        const csvFile = path.join(EXPORT_DIR, `${tableName}.csv`);
        const stream = fs.createWriteStream(csvFile, { encoding: 'utf8' });
        
        // Escribir BOM UTF-8
        stream.write('\ufeff');
        
        // Escribir headers
        stream.write(columnNames.map(escapeCSV).join(',') + '\n');
        
        // Escribir datos
        for (const row of rows) {
            const values = columnNames.map(col => escapeCSV(row[col]));
            stream.write(values.join(',') + '\n');
        }
        
        stream.end();
        
        console.log(`✓ ${tableName}: ${rows.length} registros exportados`);
        return true;
    } catch (error) {
        console.error(`✗ Error exportando ${tableName}:`, error.message);
        return false;
    }
}

// Función principal
async function main() {
    let connection;
    try {
        // Conectar a MySQL
        connection = await mysql.createConnection(dbConfig);
        await connection.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
        
        console.log('✓ Conectado a MySQL');
        console.log(`Exportando tablas a: ${EXPORT_DIR}\n`);
        
        // Obtener lista de tablas (excluyendo vistas)
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        `, [dbConfig.database]);
        
        const tableNames = tables.map(t => t.TABLE_NAME);
        console.log(`Encontradas ${tableNames.length} tablas para exportar\n`);
        
        // Exportar cada tabla
        let exported = 0;
        for (const tableName of tableNames) {
            if (await exportTableToCSV(connection, tableName)) {
                exported++;
            }
        }
        
        await connection.end();
        
        console.log(`\n✓ Exportación completada: ${exported}/${tableNames.length} tablas`);
        console.log(`Archivos guardados en: ${EXPORT_DIR}`);
        
    } catch (error) {
        console.error('✗ Error:', error.message);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

// Ejecutar
main();

