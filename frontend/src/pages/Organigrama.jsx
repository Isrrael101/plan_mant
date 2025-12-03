import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import { useToast } from '../components/Toast';
import './Organigrama.css';

function Organigrama() {
    const [selectedCard, setSelectedCard] = useState(null);
    const [personnel, setPersonnel] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        loadPersonnel();
    }, []);

    const loadPersonnel = async () => {
        try {
            setLoading(true);
            const data = await api.getPersonnel();
            if (data && data.success && data.data) {
                setPersonnel(data.data);
            }
        } catch (err) {
            console.error('Error loading personnel:', err);
            toast.error('Error al cargar datos del personal');
        } finally {
            setLoading(false);
        }
    };

    // Mapeo de cargos reales a áreas del organigrama (Empresa Minera)
    const cargoToAreaMap = {
        // Superintendencia
        'Superintendente de Mantenimiento': 'Mantenimiento Mecánico',
        'Superintendente de Seguridad': 'Seguridad',
        // Jefaturas de Mantenimiento
        'Jefe de Taller Mecánico': 'Mantenimiento Mecánico',
        'Jefe de Taller Eléctrico': 'Mantenimiento Eléctrico',
        'Planificador de Mantenimiento': 'Mantenimiento Mecánico',
        'Supervisor de Mantenimiento Mecánico': 'Mantenimiento Mecánico',
        'Supervisor de Mantenimiento Eléctrico': 'Mantenimiento Eléctrico',
        // Operaciones Mineras
        'Jefe de Mina': 'Operaciones Mineras',
        'Supervisor de Producción Minera': 'Operaciones Mineras',
        'Operador de Equipos Mineros': 'Operaciones Mineras',
        // Mantenimiento - Técnicos y Mecánicos
        'Mecánico de Equipos Pesados': 'Mantenimiento Mecánico',
        'Mecánico de Equipos Pesados Senior': 'Mantenimiento Mecánico',
        'Técnico en Hidráulica Industrial': 'Mantenimiento Mecánico',
        'Técnico en Motores Diesel': 'Mantenimiento Mecánico',
        'Electricista Industrial': 'Mantenimiento Eléctrico',
        'Soldador Industrial': 'Mantenimiento Mecánico',
        'Lubricador de Equipos Mineros': 'Mantenimiento Mecánico',
        // Seguridad Minera
        'Jefe de Seguridad Minera': 'Seguridad',
        'Supervisor de Seguridad': 'Seguridad',
        // Administración y Finanzas
        'Jefe de Contabilidad': 'Contabilidad',
        'Contador': 'Contabilidad',
        'Auxiliar Contable': 'Contabilidad',
        'Jefe Administrativo': 'Administración',
        'Administrativo': 'Administración',
        'Recepcionista': 'Administración',
        // Recursos Humanos
        'Jefe de RRHH': 'RRHH',
        'Especialista en RRHH': 'RRHH',
        'Asistente de RRHH': 'RRHH'
    };

    // Función para obtener empleados por cargo específico
    const getEmployeesByCargo = (cargoName) => {
        if (!personnel || personnel.length === 0) return [];
        if (!cargoName) return [];
        
        const cargoLower = cargoName.toLowerCase();
        return personnel.filter(emp => {
            const empCargo = (emp.cargo || '').toLowerCase();
            return empCargo === cargoLower || empCargo.includes(cargoLower) || cargoLower.includes(empCargo);
        });
    };

    // Función para obtener empleados por área basada en cargos reales (Empresa Minera)
    const getEmployeesByArea = (area) => {
        if (!personnel || personnel.length === 0) return [];
        if (!area) return [];
        
        const areaLower = area.toLowerCase();
        return personnel.filter(emp => {
            const cargo = (emp.cargo || '').toLowerCase();
            const mappedArea = cargoToAreaMap[emp.cargo] || '';
            const mappedAreaLower = mappedArea.toLowerCase();
            
            // Buscar por área mapeada o por coincidencia directa
            return mappedAreaLower === areaLower ||
                   (areaLower === 'mantenimiento mecánico' && (
                       cargo.includes('mecánico') || 
                       cargo.includes('mecanico') ||
                       cargo.includes('técnico en hidráulica') ||
                       cargo.includes('técnico en motores') ||
                       cargo.includes('soldador') ||
                       cargo.includes('lubricador') ||
                       cargo.includes('jefe de taller mecánico') ||
                       cargo.includes('supervisor de mantenimiento mecánico') ||
                       cargo.includes('planificador')
                   )) ||
                   (areaLower === 'mantenimiento eléctrico' && (
                       cargo.includes('electricista') ||
                       cargo.includes('jefe de taller eléctrico') ||
                       cargo.includes('supervisor de mantenimiento eléctrico')
                   )) ||
                   (areaLower === 'operaciones mineras' && (
                       cargo.includes('operador') ||
                       cargo.includes('jefe de mina') ||
                       cargo.includes('supervisor de producción')
                   )) ||
                   (areaLower === 'seguridad' && (
                       cargo.includes('seguridad') ||
                       cargo.includes('superintendente de seguridad')
                   )) ||
                   (areaLower === 'rrhh' && (cargo.includes('rrhh') || cargo.includes('recursos humanos'))) ||
                   (areaLower === 'contabilidad' && (cargo.includes('contabilidad') || cargo.includes('contador') || cargo.includes('auxiliar contable'))) ||
                   (areaLower === 'administración' && (cargo.includes('administrativo') || cargo.includes('recepcionista')));
        });
    };

    // Función para obtener empleados por tipo de cargo/rol
    const getEmployeesByRole = (role) => {
        if (!personnel || personnel.length === 0) return [];
        if (!role) return [];
        
        const roleLower = (role || '').toLowerCase();
        return personnel.filter(emp => {
            const cargo = (emp.cargo || '').toLowerCase();
            return cargo.includes(roleLower) || roleLower.includes(cargo);
        });
    };

    // Agrupar empleados por cargo
    const groupEmployeesByCargo = () => {
        if (!personnel || personnel.length === 0) return {};
        
        const grouped = {};
        personnel.forEach(emp => {
            const cargo = emp.cargo || 'Sin Cargo';
            if (!grouped[cargo]) {
                grouped[cargo] = [];
            }
            grouped[cargo].push(emp);
        });
        return grouped;
    };

    // Estructura del organigrama de Empresa Minera Profesional
    const organigrama = {
        nivel1: {
            nombre: 'Gerencia General',
            cargo: 'Gerente General',
            nombrePersona: 'Ing. Juan Pérez',
            color: '#667eea',
            responsabilidades: [
                'Dirección estratégica de la empresa minera',
                'Toma de decisiones ejecutivas',
                'Relaciones con stakeholders y autoridades',
                'Supervisión general de operaciones mineras',
                'Cumplimiento de normativas mineras y ambientales'
            ]
        },
        nivel2: [
            {
                nombre: 'Superintendencia de Operaciones Mineras',
                cargo: 'Superintendente de Operaciones',
                nombrePersona: 'Ing. María González',
                color: '#764ba2',
                responsabilidades: [
                    'Planificación y ejecución de operaciones mineras',
                    'Gestión de producción y extracción',
                    'Optimización de procesos mineros',
                    'Supervisión de operaciones de mina'
                ],
                nivel3: [
                    { 
                        nombre: 'Operaciones de Mina', 
                        cargo: 'Jefe de Mina',
                        nombrePersona: 'Ing. Carlos Ramírez',
                        color: '#f093fb',
                        area: 'Operaciones Mineras',
                        cargosNivel3: [
                            'Jefe de Mina',
                            'Supervisor de Producción Minera'
                        ],
                        cargosNivel4: [
                            'Operador de Equipos Mineros'
                        ],
                        cargosReales: [
                            'Jefe de Mina',
                            'Supervisor de Producción Minera',
                            'Operador de Equipos Mineros'
                        ]
                    }
                ]
            },
            {
                nombre: 'Superintendencia de Mantenimiento',
                cargo: 'Superintendente de Mantenimiento',
                nombrePersona: 'Ing. Luis Martínez',
                color: '#f5576c',
                responsabilidades: [
                    'Gestión integral de mantenimiento de equipos mineros',
                    'Planificación de mantenimientos preventivos y correctivos',
                    'Optimización de disponibilidad de equipos',
                    'Gestión de repuestos y recursos de mantenimiento'
                ],
                nivel3: [
                    { 
                        nombre: 'Mantenimiento Mecánico', 
                        cargo: 'Jefe de Taller Mecánico',
                        nombrePersona: 'Ing. Diego Morales',
                        color: '#f093fb',
                        area: 'Mantenimiento Mecánico',
                        cargosNivel3: [
                            'Jefe de Taller Mecánico',
                            'Supervisor de Mantenimiento Mecánico',
                            'Planificador de Mantenimiento'
                        ],
                        cargosNivel4: [
                            'Mecánico de Equipos Pesados',
                            'Mecánico de Equipos Pesados Senior',
                            'Técnico en Hidráulica Industrial',
                            'Técnico en Motores Diesel',
                            'Soldador Industrial',
                            'Lubricador de Equipos Mineros'
                        ]
                    },
                    { 
                        nombre: 'Mantenimiento Eléctrico', 
                        cargo: 'Jefe de Taller Eléctrico',
                        nombrePersona: 'Ing. Francisco López',
                        color: '#f093fb',
                        area: 'Mantenimiento Eléctrico',
                        cargosNivel3: [
                            'Jefe de Taller Eléctrico',
                            'Supervisor de Mantenimiento Eléctrico'
                        ],
                        cargosNivel4: [
                            'Electricista Industrial'
                        ]
                    }
                ]
            },
            {
                nombre: 'Superintendencia de Seguridad y Salud Ocupacional',
                cargo: 'Superintendente de Seguridad',
                nombrePersona: 'Ing. Laura Méndez',
                color: '#f59e0b',
                responsabilidades: [
                    'Gestión integral de seguridad minera',
                    'Prevención de accidentes e incidentes',
                    'Cumplimiento de normativas de seguridad',
                    'Capacitación en seguridad minera'
                ],
                nivel3: [
                    { 
                        nombre: 'Seguridad Minera', 
                        cargo: 'Jefe de Seguridad Minera',
                        nombrePersona: 'Téc. Ricardo López',
                        color: '#fbbf24',
                        area: 'Seguridad',
                        cargosNivel3: [
                            'Jefe de Seguridad Minera',
                            'Supervisor de Seguridad'
                        ],
                        cargosNivel4: [
                            'Inspector de Seguridad Minera',
                            'Técnico en Seguridad Minera'
                        ],
                        cargosReales: [
                            'Jefe de Seguridad Minera',
                            'Supervisor de Seguridad',
                            'Inspector de Seguridad Minera',
                            'Técnico en Seguridad Minera'
                        ]
                    }
                ]
            },
            {
                nombre: 'Gerencia Administrativa y Finanzas',
                cargo: 'Gerente Administrativo y Financiero',
                nombrePersona: 'Lic. Patricia López',
                color: '#48bb78',
                responsabilidades: [
                    'Administración financiera y contable',
                    'Control presupuestario y costos',
                    'Gestión administrativa',
                    'Relaciones comerciales y proveedores'
                ],
                nivel3: [
                    { 
                        nombre: 'Contabilidad y Finanzas', 
                        cargo: 'Jefe de Contabilidad',
                        nombrePersona: 'C.P. Miguel Ángel Herrera',
                        color: '#38b2ac',
                        area: 'Contabilidad',
                        cargosNivel3: [
                            'Jefe de Contabilidad'
                        ],
                        cargosNivel4: [
                            'Contador',
                            'Auxiliar Contable'
                        ]
                    },
                    { 
                        nombre: 'Administración', 
                        cargo: 'Jefe Administrativo',
                        nombrePersona: 'Lic. Carmen Ruiz',
                        color: '#38b2ac',
                        area: 'Administración',
                        cargosNivel3: [
                            'Jefe Administrativo'
                        ],
                        cargosNivel4: [
                            'Administrativo',
                            'Recepcionista'
                        ]
                    }
                ]
            },
            {
                nombre: 'Gerencia de Recursos Humanos',
                cargo: 'Gerente de Recursos Humanos',
                nombrePersona: 'Lic. Sofía Torres',
                color: '#8b5cf6',
                responsabilidades: [
                    'Gestión del capital humano',
                    'Reclutamiento y selección',
                    'Desarrollo y capacitación',
                    'Relaciones laborales'
                ],
                nivel3: [
                    { 
                        nombre: 'Recursos Humanos', 
                        cargo: 'Jefe de RRHH',
                        nombrePersona: 'Lic. Sofía Torres',
                        color: '#a78bfa',
                        area: 'RRHH',
                        cargosNivel3: [
                            'Jefe de RRHH'
                        ],
                        cargosNivel4: [
                            'Especialista en RRHH',
                            'Asistente de RRHH'
                        ]
                    }
                ]
            }
        ]
    };

    const handleCardClick = (cardData) => {
        setSelectedCard(selectedCard === cardData ? null : cardData);
    };

    if (loading) return <Loading message="Cargando organigrama" />;

    return (
        <div className="organigrama-container">
            <div className="organigrama-header">
                <h1>⛏️ Organigrama Organizacional - Empresa Minera</h1>
                <p>Estructura jerárquica y responsabilidades de la empresa minera</p>
            </div>

            <div className="organigrama-content">
                {/* Nivel 1 - Gerencia General */}
                <div className="organigrama-level level-1">
                    <div 
                        className={`org-card level-1-card ${selectedCard === organigrama.nivel1 ? 'expanded' : ''}`}
                        style={{ background: `linear-gradient(135deg, ${organigrama.nivel1.color} 0%, ${organigrama.nivel1.color}dd 100%)` }}
                        onClick={() => handleCardClick(organigrama.nivel1)}
                    >
                        <div className="org-icon">👔</div>
                        <div className="org-info">
                            <h3>{organigrama.nivel1.cargo}</h3>
                            <p className="org-name">{organigrama.nivel1.nombrePersona}</p>
                            <p className="org-department">{organigrama.nivel1.nombre}</p>
                        </div>
                        <div className="org-expand-icon">▼</div>
                    </div>
                    
                    {/* Detalles expandidos */}
                    {selectedCard === organigrama.nivel1 && (
                        <div className="org-details">
                            <h4>Responsabilidades:</h4>
                            <ul>
                                {organigrama.nivel1.responsabilidades.map((resp, idx) => (
                                    <li key={idx}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Conexión principal */}
                <div className="org-connector">
                    <div className="connector-line"></div>
                    <div className="connector-branches">
                        {organigrama.nivel2.map((_, idx) => (
                            <div key={idx} className="branch-line"></div>
                        ))}
                    </div>
                </div>

                {/* Nivel 2 - Gerencias */}
                <div className="organigrama-level level-2">
                    {organigrama.nivel2.map((gerencia, index) => (
                        <div key={index} className="org-branch">
                            {/* Card de Gerencia */}
                            <div 
                                className={`org-card level-2-card ${selectedCard === gerencia ? 'expanded' : ''}`}
                                style={{ background: `linear-gradient(135deg, ${gerencia.color} 0%, ${gerencia.color}dd 100%)` }}
                                onClick={() => handleCardClick(gerencia)}
                            >
                                <div className="org-icon">💼</div>
                                <div className="org-info">
                                    <h3>{gerencia.cargo}</h3>
                                    <p className="org-name">{gerencia.nombrePersona}</p>
                                    <p className="org-department">{gerencia.nombre}</p>
                                </div>
                                <div className="org-expand-icon">▼</div>
                            </div>

                                    {/* Detalles expandidos */}
                                    {selectedCard === gerencia && (
                                        <div className="org-details">
                                            <h4>Responsabilidades:</h4>
                                            <ul>
                                                {gerencia.responsabilidades.map((resp, idx) => (
                                                    <li key={idx}>{resp}</li>
                                                ))}
                                            </ul>
                                            {gerencia.nivel3 && (
                                                <div className="org-employees-summary">
                                                    <h4>Personal a Cargo:</h4>
                                                    <div className="employees-total">
                                                        <strong>Total: {gerencia.nivel3.reduce((sum, dep) => {
                                                            let count = 0;
                                                            if (dep.cargosNivel3) {
                                                                dep.cargosNivel3.forEach(cargo => {
                                                                    count += getEmployeesByCargo(cargo).length;
                                                                });
                                                            }
                                                            if (dep.cargosNivel4) {
                                                                dep.cargosNivel4.forEach(cargo => {
                                                                    count += getEmployeesByCargo(cargo).length;
                                                                });
                                                            }
                                                            return sum + count;
                                                        }, 0)} empleados</strong>
                                                    </div>
                                                    <div className="employees-breakdown">
                                                        {gerencia.nivel3.map((dep, idx) => {
                                                            let employeeCount = 0;
                                                            if (dep.cargosNivel3) {
                                                                dep.cargosNivel3.forEach(cargo => {
                                                                    employeeCount += getEmployeesByCargo(cargo).length;
                                                                });
                                                            }
                                                            if (dep.cargosNivel4) {
                                                                dep.cargosNivel4.forEach(cargo => {
                                                                    employeeCount += getEmployeesByCargo(cargo).length;
                                                                });
                                                            }
                                                            return (
                                                                <div key={idx} className="employee-department">
                                                                    <span className="dept-name">{dep.area}:</span>
                                                                    <span className="dept-count">{employeeCount} empleados</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                            {/* Conexión a nivel 3 */}
                            {gerencia.nivel3 && gerencia.nivel3.length > 0 && (
                                <>
                                    <div className="org-connector-small">
                                        <div className="connector-line-small"></div>
                                        <div className="connector-branches-small">
                                            {gerencia.nivel3.map((_, idx) => (
                                                <div key={idx} className="branch-line-small"></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nivel 3 - Supervisores/Jefes y sus empleados */}
                                    <div className="organigrama-level level-3">
                                        {gerencia.nivel3.map((supervisor, subIndex) => {
                                            // Obtener jefes/supervisores (Nivel 3)
                                            let jefesSupervisores = [];
                                            if (supervisor.cargosNivel3 && supervisor.cargosNivel3.length > 0) {
                                                supervisor.cargosNivel3.forEach(cargo => {
                                                    const employeesByCargo = getEmployeesByCargo(cargo);
                                                    jefesSupervisores.push(...employeesByCargo);
                                                });
                                                jefesSupervisores = Array.from(new Map(jefesSupervisores.map(emp => [emp.codigo || emp.id, emp])).values());
                                            }
                                            
                                            // Obtener empleados operativos (Nivel 4)
                                            let empleadosOperativos = [];
                                            if (supervisor.cargosNivel4 && supervisor.cargosNivel4.length > 0) {
                                                supervisor.cargosNivel4.forEach(cargo => {
                                                    const employeesByCargo = getEmployeesByCargo(cargo);
                                                    empleadosOperativos.push(...employeesByCargo);
                                                });
                                                empleadosOperativos = Array.from(new Map(empleadosOperativos.map(emp => [emp.codigo || emp.id, emp])).values());
                                            }
                                            
                                            // Si no hay cargosNivel3, usar el supervisor como jefe y mostrar empleados operativos
                                            const totalEmpleados = jefesSupervisores.length + empleadosOperativos.length;
                                            
                                            return (
                                                <div key={subIndex} className="org-card-wrapper-small">
                                                    {/* Card del Supervisor/Jefe del área */}
                                                    <div 
                                                        className="org-card-small"
                                                        style={{ background: `linear-gradient(135deg, ${supervisor.color} 0%, ${supervisor.color}dd 100%)` }}
                                                    >
                                                        <div className="org-icon-small">👤</div>
                                                        <div className="org-info-small">
                                                            <h4>{supervisor.cargo}</h4>
                                                            <p className="org-name-small">{supervisor.nombrePersona}</p>
                                                            <p className="org-department-small">{supervisor.area}</p>
                                                            <div className="org-meta">
                                                                <span className="org-employees">👥 {totalEmpleados} empleados</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Nivel 3.5 - Jefes/Supervisores específicos (si existen) */}
                                                    {jefesSupervisores.length > 0 && (
                                                        <>
                                                            <div className="org-connector-employees">
                                                                <div className="connector-line-employees"></div>
                                                            </div>
                                                            <div className="organigrama-level level-3-5">
                                                                {jefesSupervisores.map((jefe, jefeIdx) => (
                                                                    <div key={jefeIdx} className="org-card-wrapper-jefe">
                                                                        <div className="org-card-jefe">
                                                                            <div className="org-info-jefe">
                                                                                <div className="employee-card-name">{jefe.nombre_completo || 'N/A'}</div>
                                                                                <div className="employee-card-code">{jefe.cargo}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                    
                                                    {/* Nivel 4 - Empleados operativos */}
                                                    {empleadosOperativos.length > 0 && (
                                                        <>
                                                            <div className="org-connector-employees">
                                                                <div className="connector-line-employees"></div>
                                                            </div>
                                                            <div className="organigrama-level level-4">
                                                                {empleadosOperativos.map((emp, empIdx) => (
                                                                    <div key={empIdx || emp.id || `emp-${subIndex}-${empIdx}`} className="employee-card">
                                                                        <div className="employee-card-info">
                                                                            <div className="employee-card-name">{emp.nombre_completo || 'N/A'}</div>
                                                                            {emp.cargo && (
                                                                                <div className="employee-card-code">{emp.cargo}</div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                    
                                                    {/* Si no hay empleados */}
                                                    {totalEmpleados === 0 && (
                                                        <div className="organigrama-level level-4">
                                                            <div className="employee-card empty">
                                                                <div className="employee-card-info">
                                                                    <div className="employee-card-name">Sin empleados asignados</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="organigrama-legend">
                <h3>📋 Leyenda Organizacional</h3>
                <div className="legend-items">
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: organigrama.nivel1.color }}></div>
                        <div className="legend-text">
                            <strong>Nivel Directivo</strong>
                            <span>Alta dirección y toma de decisiones estratégicas</span>
                        </div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: organigrama.nivel2[0].color }}></div>
                        <div className="legend-text">
                            <strong>Nivel Gerencial</strong>
                            <span>Gerencias y dirección de áreas funcionales</span>
                        </div>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color" style={{ background: organigrama.nivel2[0].nivel3[0].color }}></div>
                        <div className="legend-text">
                            <strong>Nivel Operativo</strong>
                            <span>Supervisores y jefes de departamento</span>
                        </div>
                    </div>
                </div>
                <p className="legend-note">💡 Haz clic en cualquier cargo para ver más detalles</p>
            </div>
        </div>
    );
}

export default Organigrama;

