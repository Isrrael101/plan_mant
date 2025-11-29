import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ charset: 'utf-8' }));
app.use(express.urlencoded({ extended: true, charset: 'utf-8' }));

// Set UTF-8 headers for all responses
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

// Path to Excel file
const EXCEL_FILE = path.join(__dirname, '..', 'Plan_Mant.xlsm');
const PYTHON_VENV = path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe');
const PYTHON_SCRIPT = path.join(__dirname, 'read_sheet.py');
const WRITE_SCRIPT = path.join(__dirname, 'write_sheet.py');

// Helper function to execute Python script
function executePython(args) {
    return new Promise((resolve, reject) => {
        const python = spawn(PYTHON_VENV, [PYTHON_SCRIPT, ...args]);
        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(errorString || 'Python script failed'));
            } else {
                try {
                    const result = JSON.parse(dataString);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Failed to parse JSON: ' + dataString));
                }
            }
        });
    });
}

// Routes

// Get all sheet names
app.get('/api/sheets', async (req, res) => {
    try {
        const result = await executePython(['list', EXCEL_FILE]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific sheet data
app.get('/api/sheet/:name', async (req, res) => {
    try {
        const sheetName = req.params.name;
        const result = await executePython(['read', EXCEL_FILE, sheetName]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get machinery data
app.get('/api/machinery', async (req, res) => {
    try {
        const result = await executePython(['read', EXCEL_FILE, 'Maquinaria']);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get personnel data
app.get('/api/personnel', async (req, res) => {
    try {
        const result = await executePython(['read', EXCEL_FILE, 'Personal']);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get tools data
app.get('/api/tools', async (req, res) => {
    try {
        const result = await executePython(['read', EXCEL_FILE, 'Herramientas']);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get supplies/insumos data
app.get('/api/supplies', async (req, res) => {
    try {
        const result = await executePython(['read', EXCEL_FILE, 'Insumos']);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get dashboard statistics
app.get('/api/stats', async (req, res) => {
    try {
        // Leer todas las hojas primero
        const sheets = await executePython(['list', EXCEL_FILE]);
        
        // Función helper para leer datos de forma segura
        const safeRead = async (sheetName) => {
            try {
                const result = await executePython(['read', EXCEL_FILE, sheetName]);
                return result.rows || 0;
            } catch (err) {
                console.warn(`Warning: Could not read sheet ${sheetName}:`, err.message);
                return 0;
            }
        };

        // Leer datos en paralelo con manejo de errores individual
        const [machinery, personnel, tools, supplies] = await Promise.allSettled([
            safeRead('Maquinaria'),
            safeRead('Personal'),
            safeRead('Herramientas'),
            safeRead('Insumos')
        ]);

        const stats = {
            success: true,
            totalSheets: sheets.count || sheets.sheets?.length || 0,
            totalMachinery: machinery.status === 'fulfilled' ? machinery.value : 0,
            totalPersonnel: personnel.status === 'fulfilled' ? personnel.value : 0,
            totalTools: tools.status === 'fulfilled' ? tools.value : 0,
            totalSupplies: supplies.status === 'fulfilled' ? supplies.value : 0
        };

        res.json(stats);
    } catch (error) {
        console.error('Error in /api/stats:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            totalSheets: 0,
            totalMachinery: 0,
            totalPersonnel: 0,
            totalTools: 0,
            totalSupplies: 0
        });
    }
});

// Helper function to execute write Python script
function executeWritePython(args) {
    return new Promise((resolve, reject) => {
        const python = spawn(PYTHON_VENV, [WRITE_SCRIPT, ...args]);
        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(errorString || 'Python script failed'));
            } else {
                try {
                    const result = JSON.parse(dataString);
                    resolve(result);
                } catch (e) {
                    reject(new Error('Failed to parse JSON: ' + dataString));
                }
            }
        });
    });
}

// CRUD Operations for Machinery
app.post('/api/machinery', async (req, res) => {
    try {
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['create', EXCEL_FILE, 'Maquinaria', JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/machinery/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['update', EXCEL_FILE, 'Maquinaria', rowIndex.toString(), JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/machinery/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const result = await executeWritePython(['delete', EXCEL_FILE, 'Maquinaria', rowIndex.toString()]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CRUD Operations for Personnel
app.post('/api/personnel', async (req, res) => {
    try {
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['create', EXCEL_FILE, 'Personal', JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/personnel/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['update', EXCEL_FILE, 'Personal', rowIndex.toString(), JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/personnel/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const result = await executeWritePython(['delete', EXCEL_FILE, 'Personal', rowIndex.toString()]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CRUD Operations for Tools
app.post('/api/tools', async (req, res) => {
    try {
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['create', EXCEL_FILE, 'Herramientas', JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/tools/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['update', EXCEL_FILE, 'Herramientas', rowIndex.toString(), JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/tools/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const result = await executeWritePython(['delete', EXCEL_FILE, 'Herramientas', rowIndex.toString()]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// CRUD Operations for Supplies
app.post('/api/supplies', async (req, res) => {
    try {
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['create', EXCEL_FILE, 'Insumos', JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/supplies/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const rowData = Object.values(req.body);
        const result = await executeWritePython(['update', EXCEL_FILE, 'Insumos', rowIndex.toString(), JSON.stringify(rowData)]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/supplies/:id', async (req, res) => {
    try {
        const rowIndex = parseInt(req.params.id);
        const result = await executeWritePython(['delete', EXCEL_FILE, 'Insumos', rowIndex.toString()]);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Excel file: ${EXCEL_FILE}`);
    console.log(`🐍 Python: ${PYTHON_VENV}`);
});
