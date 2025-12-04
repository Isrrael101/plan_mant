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

    // Mapeo de cargos reales a áreas del organigrama (Empresa Minera Profesional)
    const cargoToAreaMap = {
        // Nivel Directivo
        'Gerente General': 'Gerencia General',
        // Nivel Gerencial
        'Gerente de Operaciones Mineras': 'Gerencia de Operaciones',
        'Gerente de Mantenimiento': 'Gerencia de Mantenimiento',
        'Gerente de Seguridad y Salud Ocupacional': 'Gerencia de Seguridad',
        'Gerente Administrativo y Financiero': 'Gerencia Administrativa',
        'Gerente de Recursos Humanos': 'Gerencia de RRHH',
        // Superintendencias
        'Superintendente de Mina': 'Operaciones de Mina',
        'Superintendente de Planta': 'Operaciones de Planta',
        'Superintendente de Mantenimiento': 'Mantenimiento',
        'Superintendente de Seguridad y Salud Ocupacional': 'Seguridad',
        // Jefaturas de Mina
        'Jefe de Mina': 'Operaciones de Mina',
        'Jefe de Operaciones de Mina': 'Operaciones de Mina',
        // Jefaturas de Planta
        'Jefe de Planta de Procesamiento': 'Operaciones de Planta',
        'Jefe de Operaciones de Planta': 'Operaciones de Planta',
        // Jefaturas de Mantenimiento
        'Jefe de Mantenimiento Mecánico': 'Mantenimiento Mecánico',
        'Jefe de Mantenimiento Eléctrico': 'Mantenimiento Eléctrico',
        'Jefe de Taller Mecánico': 'Mantenimiento Mecánico',
        'Jefe de Taller Eléctrico': 'Mantenimiento Eléctrico',
        'Jefe de Planificación de Mantenimiento': 'Mantenimiento',
        // Jefaturas de Seguridad
        'Jefe de Seguridad Minera': 'Seguridad',
        // Jefaturas Administrativas
        'Jefe de Contabilidad': 'Contabilidad',
        'Jefe Administrativo': 'Administración',
        'Jefe de Recursos Humanos': 'RRHH',
        // Supervisores
        'Supervisor de Producción Minera': 'Operaciones de Mina',
        'Supervisor de Operaciones de Planta': 'Operaciones de Planta',
        'Supervisor de Mantenimiento Mecánico': 'Mantenimiento Mecánico',
        'Supervisor de Mantenimiento Eléctrico': 'Mantenimiento Eléctrico',
        'Supervisor de Seguridad': 'Seguridad',
        'Planificador de Mantenimiento': 'Mantenimiento',
        // Operativos - Mina
        'Operador de Equipos Mineros': 'Operaciones de Mina',
        'Ayudante de Operaciones Mineras': 'Operaciones de Mina',
        // Operativos - Planta
        'Operador de Planta de Procesamiento': 'Operaciones de Planta',
        'Ayudante de Planta de Procesamiento': 'Operaciones de Planta',
        // Operativos - Mantenimiento Mecánico
        'Mecánico de Equipos Pesados': 'Mantenimiento Mecánico',
        'Técnico en Hidráulica Industrial': 'Mantenimiento Mecánico',
        'Técnico en Motores Diesel': 'Mantenimiento Mecánico',
        'Soldador Industrial': 'Mantenimiento Mecánico',
        'Lubricador de Equipos Mineros': 'Mantenimiento Mecánico',
        // Operativos - Mantenimiento Eléctrico
        'Electricista Industrial': 'Mantenimiento Eléctrico',
        'Técnico Eléctrico': 'Mantenimiento Eléctrico',
        // Operativos - Seguridad
        'Inspector de Seguridad Minera': 'Seguridad',
        'Técnico en Seguridad Minera': 'Seguridad',
        'Guardia de Seguridad Minera': 'Seguridad',
        // Administrativos
        'Contador': 'Contabilidad',
        'Auxiliar Contable': 'Contabilidad',
        'Administrativo': 'Administración',
        // RRHH
        'Especialista en Recursos Humanos': 'RRHH',
        'Asistente de Recursos Humanos': 'RRHH'
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

    // Función para obtener empleados por área
    const getEmployeesByArea = (area) => {
        if (!personnel || personnel.length === 0) return [];
        if (!area) return [];
        
        const areaLower = area.toLowerCase();
        return personnel.filter(emp => {
            const cargo = (emp.cargo || '').toLowerCase();
            const mappedArea = cargoToAreaMap[emp.cargo] || '';
            const mappedAreaLower = mappedArea.toLowerCase();
            
            return mappedAreaLower === areaLower ||
                   (areaLower === 'operaciones de mina' && (
                       cargo.includes('operador de equipos mineros') ||
                       cargo.includes('ayudante de operaciones mineras') ||
                       cargo.includes('jefe de mina') ||
                       cargo.includes('supervisor de producción minera') ||
                       cargo.includes('superintendente de mina')
                   )) ||
                   (areaLower === 'operaciones de planta' && (
                       cargo.includes('operador de planta') ||
                       cargo.includes('ayudante de planta') ||
                       cargo.includes('jefe de planta') ||
                       cargo.includes('supervisor de operaciones de planta') ||
                       cargo.includes('superintendente de planta')
                   )) ||
                   (areaLower === 'mantenimiento mecánico' && (
                       cargo.includes('mecánico') ||
                       cargo.includes('técnico en hidráulica') ||
                       cargo.includes('técnico en motores') ||
                       cargo.includes('soldador') ||
                       cargo.includes('lubricador') ||
                       cargo.includes('jefe de taller mecánico') ||
                       cargo.includes('supervisor de mantenimiento mecánico')
                   )) ||
                   (areaLower === 'mantenimiento eléctrico' && (
                       cargo.includes('electricista') ||
                       cargo.includes('técnico eléctrico') ||
                       cargo.includes('jefe de taller eléctrico') ||
                       cargo.includes('supervisor de mantenimiento eléctrico')
                   )) ||
                   (areaLower === 'seguridad' && (
                       cargo.includes('seguridad') ||
                       cargo.includes('inspector') ||
                       cargo.includes('guardia')
                   )) ||
                   (areaLower === 'rrhh' && (cargo.includes('rrhh') || cargo.includes('recursos humanos'))) ||
                   (areaLower === 'contabilidad' && (cargo.includes('contabilidad') || cargo.includes('contador') || cargo.includes('auxiliar contable'))) ||
                   (areaLower === 'administración' && cargo.includes('administrativo'));
        });
    };

    // Estructura del organigrama de Empresa Minera Profesional
    const organigrama = {
        nivel1: {
            nombre: 'Gerencia General',
            cargo: 'Gerente General',
            nombrePersona: 'Ing. Juan Pérez',
            color: '#667eea',
            responsabilidades: [
                'Dirección estratégica y visión de la empresa minera',
                'Toma de decisiones ejecutivas de alto nivel',
                'Relaciones con stakeholders, inversionistas y autoridades',
                'Supervisión general de todas las operaciones',
                'Cumplimiento de normativas mineras, ambientales y de seguridad',
                'Desarrollo de estrategias de crecimiento y sostenibilidad'
            ]
        },
        nivel2: [
            {
                nombre: 'Gerencia de Operaciones Mineras',
                cargo: 'Gerente de Operaciones Mineras',
                nombrePersona: 'Ing. María González',
                color: '#764ba2',
                responsabilidades: [
                    'Dirección estratégica de operaciones mineras',
                    'Optimización de producción y extracción',
                    'Gestión de recursos operativos',
                    'Coordinación entre Mina y Planta'
                ],
                nivel3: [
                    {
                        nombre: 'Superintendencia de Mina',
                        cargo: 'Superintendente de Mina',
                        nombrePersona: 'Ing. Carlos Ramírez',
                        color: '#f093fb',
                        area: 'Operaciones de Mina',
                        cargosNivel3: [
                            'Superintendente de Mina',
                            'Jefe de Mina',
                            'Jefe de Operaciones de Mina'
                        ],
                        cargosNivel4: [
                            'Supervisor de Producción Minera',
                            'Operador de Equipos Mineros',
                            'Ayudante de Operaciones Mineras'
                        ]
                    },
                    {
                        nombre: 'Superintendencia de Planta',
                        cargo: 'Superintendente de Planta',
                        nombrePersona: 'Ing. Ana Martínez',
                        color: '#4facfe',
                        area: 'Operaciones de Planta',
                        cargosNivel3: [
                            'Superintendente de Planta',
                            'Jefe de Planta de Procesamiento',
                            'Jefe de Operaciones de Planta'
                        ],
                        cargosNivel4: [
                            'Supervisor de Operaciones de Planta',
                            'Operador de Planta de Procesamiento',
                            'Ayudante de Planta de Procesamiento'
                        ]
                    }
                ]
            },
            {
                nombre: 'Gerencia de Mantenimiento',
                cargo: 'Gerente de Mantenimiento',
                nombrePersona: 'Ing. Luis Martínez',
                color: '#f5576c',
                responsabilidades: [
                    'Dirección estratégica de mantenimiento',
                    'Optimización de disponibilidad de equipos',
                    'Gestión de recursos de mantenimiento',
                    'Planificación y ejecución de mantenimientos'
                ],
                nivel3: [
                    {
                        nombre: 'Superintendencia de Mantenimiento',
                        cargo: 'Superintendente de Mantenimiento',
                        nombrePersona: 'Ing. Diego Morales',
                        color: '#f093fb',
                        area: 'Mantenimiento',
                        cargosNivel3: [
                            'Superintendente de Mantenimiento',
                            'Jefe de Planificación de Mantenimiento'
                        ],
                        cargosNivel4: [
                            'Planificador de Mantenimiento'
                        ]
                    },
                    {
                        nombre: 'Mantenimiento Mecánico',
                        cargo: 'Jefe de Mantenimiento Mecánico',
                        nombrePersona: 'Ing. Francisco López',
                        color: '#f093fb',
                        area: 'Mantenimiento Mecánico',
                        cargosNivel3: [
                            'Jefe de Mantenimiento Mecánico',
                            'Jefe de Taller Mecánico',
                            'Supervisor de Mantenimiento Mecánico'
                        ],
                        cargosNivel4: [
                            'Mecánico de Equipos Pesados',
                            'Técnico en Hidráulica Industrial',
                            'Técnico en Motores Diesel',
                            'Soldador Industrial',
                            'Lubricador de Equipos Mineros'
                        ]
                    },
                    {
                        nombre: 'Mantenimiento Eléctrico',
                        cargo: 'Jefe de Mantenimiento Eléctrico',
                        nombrePersona: 'Ing. Roberto Sánchez',
                        color: '#f093fb',
                        area: 'Mantenimiento Eléctrico',
                        cargosNivel3: [
                            'Jefe de Mantenimiento Eléctrico',
                            'Jefe de Taller Eléctrico',
                            'Supervisor de Mantenimiento Eléctrico'
                        ],
                        cargosNivel4: [
                            'Electricista Industrial',
                            'Técnico Eléctrico'
                        ]
                    }
                ]
            },
            {
                nombre: 'Gerencia de Seguridad y Salud Ocupacional',
                cargo: 'Gerente de Seguridad y Salud Ocupacional',
                nombrePersona: 'Ing. Laura Méndez',
                color: '#f59e0b',
                responsabilidades: [
                    'Dirección estratégica de seguridad minera',
                    'Prevención de accidentes e incidentes',
                    'Cumplimiento de normativas de seguridad',
                    'Gestión de salud ocupacional'
                ],
                nivel3: [
                    {
                        nombre: 'Superintendencia de Seguridad',
                        cargo: 'Superintendente de Seguridad y Salud Ocupacional',
                        nombrePersona: 'Téc. Ricardo López',
                        color: '#fbbf24',
                        area: 'Seguridad',
                        cargosNivel3: [
                            'Superintendente de Seguridad y Salud Ocupacional',
                            'Jefe de Seguridad Minera',
                            'Supervisor de Seguridad'
                        ],
                        cargosNivel4: [
                            'Inspector de Seguridad Minera',
                            'Técnico en Seguridad Minera',
                            'Guardia de Seguridad Minera'
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
                    'Dirección financiera y contable',
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
                            'Administrativo'
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
                    'Dirección del capital humano',
                    'Reclutamiento y selección',
                    'Desarrollo y capacitación',
                    'Relaciones laborales'
                ],
                nivel3: [
                    {
                        nombre: 'Recursos Humanos',
                        cargo: 'Jefe de Recursos Humanos',
                        nombrePersona: 'Lic. Sofía Torres',
                        color: '#a78bfa',
                        area: 'RRHH',
                        cargosNivel3: [
                            'Jefe de Recursos Humanos'
                        ],
                        cargosNivel4: [
                            'Especialista en Recursos Humanos',
                            'Asistente de Recursos Humanos'
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
                <h1>⛏️ Organigrama Organizacional - Empresa Minera de Clase Mundial</h1>
                <p>Estructura jerárquica profesional: Planta, Mina y Administración</p>
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

                                    {/* Nivel 3 - Superintendencias/Jefaturas */}
                                    <div className="organigrama-level level-3">
                                        {gerencia.nivel3.map((supervisor, subIndex) => {
                                            let jefesSupervisores = [];
                                            if (supervisor.cargosNivel3 && supervisor.cargosNivel3.length > 0) {
                                                supervisor.cargosNivel3.forEach(cargo => {
                                                    const employeesByCargo = getEmployeesByCargo(cargo);
                                                    jefesSupervisores.push(...employeesByCargo);
                                                });
                                                jefesSupervisores = Array.from(new Map(jefesSupervisores.map(emp => [emp.codigo || emp.id, emp])).values());
                                            }
                                            
                                            let empleadosOperativos = [];
                                            if (supervisor.cargosNivel4 && supervisor.cargosNivel4.length > 0) {
                                                supervisor.cargosNivel4.forEach(cargo => {
                                                    const employeesByCargo = getEmployeesByCargo(cargo);
                                                    empleadosOperativos.push(...employeesByCargo);
                                                });
                                                empleadosOperativos = Array.from(new Map(empleadosOperativos.map(emp => [emp.codigo || emp.id, emp])).values());
                                            }
                                            
                                            const totalEmpleados = jefesSupervisores.length + empleadosOperativos.length;
                                            
                                            return (
                                                <div key={subIndex} className="org-card-wrapper-small">
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
                            <span>Superintendencias, Jefaturas, Supervisores y Personal Operativo</span>
                        </div>
                    </div>
                </div>
                <p className="legend-note">💡 Haz clic en cualquier cargo para ver más detalles</p>
            </div>
        </div>
    );
}

export default Organigrama;
