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
app.use(express.json());

// Path to Excel file
const EXCEL_FILE = path.join(__dirname, '..', 'Plan_Mant.xlsm');
const PYTHON_VENV = path.join(__dirname, '..', 'venv', 'Scripts', 'python.exe');
const PYTHON_SCRIPT = path.join(__dirname, 'read_sheet.py');

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
        const [sheets, machinery, personnel, tools, supplies] = await Promise.all([
            executePython(['list', EXCEL_FILE]),
            executePython(['read', EXCEL_FILE, 'Maquinaria']),
            executePython(['read', EXCEL_FILE, 'Personal']),
            executePython(['read', EXCEL_FILE, 'Herramientas']),
            executePython(['read', EXCEL_FILE, 'Insumos'])
        ]);

        const stats = {
            success: true,
            totalSheets: sheets.count || 0,
            totalMachinery: machinery.rows || 0,
            totalPersonnel: personnel.rows || 0,
            totalTools: tools.rows || 0,
            totalSupplies: supplies.rows || 0
        };

        res.json(stats);
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
