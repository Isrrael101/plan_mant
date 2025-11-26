import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import './Maintenance.css';

function Maintenance() {
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSheets();
    }, []);

    const loadSheets = async () => {
        try {
            setLoading(true);
            const data = await api.getSheets();
            if (data.success && data.sheets) {
                // Filter maintenance-related sheets
                const maintenanceSheets = data.sheets.filter(sheet =>
                    sheet.includes('HORAS') ||
                    sheet.includes('CRONOGRAMA') ||
                    sheet.includes('CHECK LIST') ||
                    sheet.includes('REPORTE')
                );
                setSheets(maintenanceSheets);
            }
            setError(null);
        } catch (err) {
            setError('Error al cargar cronogramas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="container fade-in">
                <div className="error-message">
                    <h2>⚠️ Error</h2>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadSheets}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const categories = {
        'Planes por Horas': sheets.filter(s => s.includes('HORAS') && !s.includes('CRONOGRAMA')),
        'Cronogramas': sheets.filter(s => s.includes('CRONOGRAMA')),
        'Check Lists': sheets.filter(s => s.includes('CHECK LIST')),
        'Reportes Diarios': sheets.filter(s => s.includes('REPORTE'))
    };

    return (
        <div className="container fade-in">
            <div className="page-header">
                <h1>📅 Planes de Mantenimiento</h1>
                <p className="page-subtitle">
                    Cronogramas, checklists y reportes de mantenimiento
                </p>
            </div>

            {Object.entries(categories).map(([category, items]) => (
                items.length > 0 && (
                    <div key={category} className="maintenance-section">
                        <h2 className="section-title">{category}</h2>
                        <div className="maintenance-grid">
                            {items.map((sheet, index) => (
                                <div key={index} className="maintenance-card card">
                                    <div className="maintenance-icon">
                                        {category === 'Planes por Horas' && '⏱️'}
                                        {category === 'Cronogramas' && '📅'}
                                        {category === 'Check Lists' && '✅'}
                                        {category === 'Reportes Diarios' && '📝'}
                                    </div>
                                    <h3 className="maintenance-title">{sheet}</h3>
                                    <button className="btn btn-primary btn-sm">
                                        Ver Detalles
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}

            <div className="maintenance-summary card">
                <h3>📊 Resumen</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <span className="summary-value">{categories['Planes por Horas'].length}</span>
                        <span className="summary-label">Planes por Horas</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-value">{categories['Cronogramas'].length}</span>
                        <span className="summary-label">Cronogramas</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-value">{categories['Check Lists'].length}</span>
                        <span className="summary-label">Check Lists</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-value">{categories['Reportes Diarios'].length}</span>
                        <span className="summary-label">Reportes</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Maintenance;
