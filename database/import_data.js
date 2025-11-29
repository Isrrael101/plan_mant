// Script para importar datos CSV a MySQL
import fs from 'fs';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de MySQL
const dbConfig = {
    host: process.env.MYSQL_HOST || 'mysql',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'mtto_user',
    password: process.env.MYSQL_PASSWORD || 'mtto_password',
    database: process.env.MYSQL_DATABASE || 'mtto_db',
    charset: 'utf8mb4',
    multipleStatements: true
};

function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());
        
        const row = {};
        headers.forEach((header, idx) => {
            let val = values[idx] || '';
            val = val.replace(/^"|"$/g, '');
            // Manejar valores booleanos
            if (val === 'TRUE' || val === 'true' || val === '1') {
                row[header] = 1;
            } else if (val === 'FALSE' || val === 'false' || val === '0') {
                row[header] = 0;
            } else if (val === 'NULL' || val === '') {
                row[header] = null;
            } else {
                row[header] = val;
            }
        });
        rows.push(row);
    }
    
    return { headers, rows };
}

async function importCSV(conn, csvFile, tableName, nullColumns = []) {
    try {
        const { headers, rows } = parseCSV(csvFile);
        
        if (rows.length === 0) {
            console.log(`⚠️  ${tableName}: Archivo vacío`);
            return;
        }
        
        const placeholders = headers.map(() => '?').join(', ');
        const columns = headers.join(', ');
        const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
        
        let inserted = 0;
        for (const row of rows) {
            const values = headers.map(h => {
                const val = row[h];
                if (nullColumns.includes(h) && (val === null || val === 'NULL' || val === '')) {
                    return null;
                }
                return val;
            });
            
            try {
                // Validar que los costos no sean 0 para tablas de costos
                if (tableName.includes('mantenimiento') || tableName.includes('actividad') || tableName === 'maquinaria' || tableName === 'herramientas' || tableName === 'insumos') {
                    const costFields = ['costo_estimado', 'costo_mano_obra', 'costo_insumos', 'costo_total', 'costo_adquisicion', 'costo', 'precio_unitario'];
                    const hasZeroCost = headers.some((h, idx) => {
                        if (costFields.includes(h)) {
                            const val = values[idx];
                            return val === 0 || val === '0' || val === '0.00' || parseFloat(val) === 0;
                        }
                        return false;
                    });
                    if (hasZeroCost) {
                        console.log(`⚠️  Omitiendo fila en ${tableName}: contiene costo en cero`);
                        continue;
                    }
                }
                await conn.execute(query, values);
                inserted++;
            } catch (error) {
                console.log(`⚠️  Error insertando fila en ${tableName}: ${error.message}`);
            }
        }
        
        console.log(`✅ ${tableName}: ${inserted} registros insertados`);
    } catch (error) {
        console.log(`❌ Error importando ${tableName}: ${error.message}`);
    }
}

async function main() {
    console.log('📊 Importando datos CSV a MySQL...');
    console.log('');
    
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
        
        const dataDir = join(__dirname, 'data');
        
        // 1. Maquinaria
        await importCSV(conn, join(dataDir, '01_maquinaria.csv'), 'maquinaria');
        
        // 2. Personal
        await importCSV(conn, join(dataDir, '02_personal.csv'), 'personal');
        
        // 3. Herramientas
        await importCSV(conn, join(dataDir, '03_herramientas.csv'), 'herramientas');
        
        // 4. Insumos
        await importCSV(conn, join(dataDir, '04_insumos.csv'), 'insumos');
        
        // 5. Planes de Mantenimiento
        await importCSV(conn, join(dataDir, '05_planes_mantenimiento.csv'), 'planes_mantenimiento', ['horas_operacion', 'intervalo_dias']);
        
        // 6. Actividades
        await importCSV(conn, join(dataDir, '06_actividades_mantenimiento.csv'), 'actividades_mantenimiento');
        
        // 7. Actividad Insumos
        await importCSV(conn, join(dataDir, '07_actividad_insumos.csv'), 'actividad_insumos', ['insumo_id']);
        
        // 8. Actividad Herramientas
        await importCSV(conn, join(dataDir, '08_actividad_herramientas.csv'), 'actividad_herramientas', ['herramienta_id']);
        
        // 9. Mantenimientos
        await importCSV(conn, join(dataDir, '09_mantenimientos.csv'), 'mantenimientos', ['plan_id', 'fecha_programada', 'fecha_ejecucion', 'observaciones']);
        
        // 10. Mantenimiento Personal
        await importCSV(conn, join(dataDir, '10_mantenimiento_personal.csv'), 'mantenimiento_personal');
        
        // 11. Mantenimiento Insumos
        await importCSV(conn, join(dataDir, '11_mantenimiento_insumos.csv'), 'mantenimiento_insumos');
        
        // 12. Mantenimiento Actividades
        await importCSV(conn, join(dataDir, '12_mantenimiento_actividades.csv'), 'mantenimiento_actividades', ['actividad_id', 'observaciones']);
        
        await conn.execute('SET FOREIGN_KEY_CHECKS = 1');
        
        // Verificar datos
        console.log('');
        console.log('📊 Verificando datos cargados...');
        const [results] = await conn.execute(`
            SELECT 'Maquinaria' as tabla, COUNT(*) as registros FROM maquinaria
            UNION ALL SELECT 'Personal', COUNT(*) FROM personal
            UNION ALL SELECT 'Herramientas', COUNT(*) FROM herramientas
            UNION ALL SELECT 'Insumos', COUNT(*) FROM insumos
            UNION ALL SELECT 'Planes', COUNT(*) FROM planes_mantenimiento
            UNION ALL SELECT 'Actividades', COUNT(*) FROM actividades_mantenimiento
            UNION ALL SELECT 'Mantenimientos', COUNT(*) FROM mantenimientos
        `);
        
        results.forEach(row => {
            console.log(`   ${row.tabla}: ${row.registros} registros`);
        });
        
        await conn.end();
        
        console.log('');
        console.log('✅ Importación completada!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (conn) await conn.end();
        process.exit(1);
    }
}

main();

