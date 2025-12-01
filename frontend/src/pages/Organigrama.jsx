import { useState } from 'react';
import './Organigrama.css';

function Organigrama() {
    const [selectedCard, setSelectedCard] = useState(null);

    // Estructura del organigrama mejorada y más completa
    const organigrama = {
        nivel1: {
            nombre: 'Gerencia General',
            cargo: 'Gerente General',
            nombrePersona: 'Ing. Juan Pérez',
            color: '#667eea',
            responsabilidades: [
                'Dirección estratégica de la empresa',
                'Toma de decisiones ejecutivas',
                'Relaciones con stakeholders',
                'Supervisión general de operaciones'
            ]
        },
        nivel2: [
            {
                nombre: 'Gerencia de Operaciones',
                cargo: 'Gerente de Operaciones',
                nombrePersona: 'Ing. María González',
                color: '#764ba2',
                responsabilidades: [
                    'Planificación y ejecución de operaciones',
                    'Gestión de recursos operativos',
                    'Optimización de procesos productivos'
                ],
                nivel3: [
                    { 
                        nombre: 'Supervisor de Producción', 
                        cargo: 'Supervisor de Producción',
                        nombrePersona: 'Téc. Carlos Ramírez',
                        color: '#f093fb',
                        area: 'Producción',
                        empleados: 15,
                        detalleEmpleados: {
                            operarios: 10,
                            tecnicos: 3,
                            ayudantes: 2
                        }
                    },
                    { 
                        nombre: 'Supervisor de Mantenimiento', 
                        cargo: 'Supervisor de Mantenimiento',
                        nombrePersona: 'Ing. Luis Martínez',
                        color: '#f093fb',
                        area: 'Mantenimiento',
                        empleados: 12,
                        detalleEmpleados: {
                            mecanicos: 6,
                            electricistas: 4,
                            ayudantes: 2
                        }
                    },
                    { 
                        nombre: 'Supervisor de Logística', 
                        cargo: 'Supervisor de Logística',
                        nombrePersona: 'Téc. Ana Fernández',
                        color: '#f093fb',
                        area: 'Logística',
                        empleados: 8,
                        detalleEmpleados: {
                            conductores: 5,
                            despachadores: 2,
                            coordinadores: 1
                        }
                    },
                    { 
                        nombre: 'Supervisor de Almacén', 
                        cargo: 'Supervisor de Almacén',
                        nombrePersona: 'Téc. Roberto Silva',
                        color: '#f093fb',
                        area: 'Almacén',
                        empleados: 6,
                        detalleEmpleados: {
                            almacenistas: 4,
                            auxiliares: 2
                        }
                    }
                ]
            },
            {
                nombre: 'Gerencia Administrativa',
                cargo: 'Gerente Administrativo',
                nombrePersona: 'Lic. Patricia López',
                color: '#48bb78',
                responsabilidades: [
                    'Administración financiera',
                    'Gestión de recursos humanos',
                    'Control administrativo'
                ],
                nivel3: [
                    { 
                        nombre: 'Recursos Humanos', 
                        cargo: 'Jefe de RRHH',
                        nombrePersona: 'Lic. Sofía Torres',
                        color: '#38b2ac',
                        area: 'RRHH',
                        empleados: 4,
                        detalleEmpleados: {
                            especialistas: 2,
                            asistentes: 2
                        }
                    },
                    { 
                        nombre: 'Contabilidad', 
                        cargo: 'Jefe de Contabilidad',
                        nombrePersona: 'C.P. Miguel Ángel',
                        color: '#38b2ac',
                        area: 'Contabilidad',
                        empleados: 5,
                        detalleEmpleados: {
                            contadores: 2,
                            auxiliares: 3
                        }
                    },
                    { 
                        nombre: 'Administración', 
                        cargo: 'Jefe Administrativo',
                        nombrePersona: 'Lic. Carmen Ruiz',
                        color: '#38b2ac',
                        area: 'Administración',
                        empleados: 3,
                        detalleEmpleados: {
                            administrativos: 2,
                            recepcionistas: 1
                        }
                    }
                ]
            },
            {
                nombre: 'Gerencia Técnica',
                cargo: 'Gerente Técnico',
                nombrePersona: 'Ing. Diego Morales',
                color: '#ed8936',
                responsabilidades: [
                    'Desarrollo técnico y tecnológico',
                    'Aseguramiento de calidad',
                    'Innovación y mejora continua'
                ],
                nivel3: [
                    { 
                        nombre: 'Ingeniería', 
                        cargo: 'Jefe de Ingeniería',
                        nombrePersona: 'Ing. Jorge Vargas',
                        color: '#f6ad55',
                        area: 'Ingeniería',
                        empleados: 7,
                        detalleEmpleados: {
                            ingenieros: 4,
                            tecnicos: 2,
                            dibujantes: 1
                        }
                    },
                    { 
                        nombre: 'Calidad', 
                        cargo: 'Jefe de Calidad',
                        nombrePersona: 'Ing. Laura Méndez',
                        color: '#f6ad55',
                        area: 'Calidad',
                        empleados: 5,
                        detalleEmpleados: {
                            inspectores: 3,
                            tecnicos: 2
                        }
                    },
                    { 
                        nombre: 'Seguridad Industrial', 
                        cargo: 'Jefe de Seguridad',
                        nombrePersona: 'Téc. Fernando Castro',
                        color: '#f6ad55',
                        area: 'Seguridad',
                        empleados: 4,
                        detalleEmpleados: {
                            supervisores: 2,
                            tecnicos: 2
                        }
                    },
                    { 
                        nombre: 'Proyectos', 
                        cargo: 'Jefe de Proyectos',
                        nombrePersona: 'Ing. Ricardo Sánchez',
                        color: '#f6ad55',
                        area: 'Proyectos',
                        empleados: 6,
                        detalleEmpleados: {
                            ingenieros: 3,
                            coordinadores: 2,
                            asistentes: 1
                        }
                    }
                ]
            },
            {
                nombre: 'Gerencia Comercial',
                cargo: 'Gerente Comercial',
                nombrePersona: 'Lic. Andrea Jiménez',
                color: '#9f7aea',
                responsabilidades: [
                    'Desarrollo comercial',
                    'Relaciones con clientes',
                    'Estrategias de mercado'
                ],
                nivel3: [
                    { 
                        nombre: 'Ventas', 
                        cargo: 'Jefe de Ventas',
                        nombrePersona: 'Lic. Daniel Herrera',
                        color: '#b794f4',
                        area: 'Ventas',
                        empleados: 8,
                        detalleEmpleados: {
                            vendedores: 5,
                            ejecutivos: 2,
                            asistentes: 1
                        }
                    },
                    { 
                        nombre: 'Marketing', 
                        cargo: 'Jefe de Marketing',
                        nombrePersona: 'Lic. Valeria Ríos',
                        color: '#b794f4',
                        area: 'Marketing',
                        empleados: 4,
                        detalleEmpleados: {
                            especialistas: 2,
                            diseñadores: 2
                        }
                    },
                    { 
                        nombre: 'Atención al Cliente', 
                        cargo: 'Jefe de Atención',
                        nombrePersona: 'Lic. Gabriel Peña',
                        color: '#b794f4',
                        area: 'Atención',
                        empleados: 6,
                        detalleEmpleados: {
                            agentes: 4,
                            supervisores: 2
                        }
                    }
                ]
            }
        ]
    };

    const handleCardClick = (cardData) => {
        setSelectedCard(selectedCard === cardData ? null : cardData);
    };

    return (
        <div className="organigrama-container">
            <div className="organigrama-header">
                <h1>📊 Organigrama Organizacional</h1>
                <p>Estructura jerárquica y responsabilidades de la empresa</p>
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
                                                        <strong>Total: {gerencia.nivel3.reduce((sum, dep) => sum + dep.empleados, 0)} empleados</strong>
                                                    </div>
                                                    <div className="employees-breakdown">
                                                        {gerencia.nivel3.map((dep, idx) => (
                                                            <div key={idx} className="employee-department">
                                                                <span className="dept-name">{dep.area}:</span>
                                                                <span className="dept-count">{dep.empleados} empleados</span>
                                                            </div>
                                                        ))}
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

                                    {/* Nivel 3 - Supervisores/Jefes */}
                                    <div className="organigrama-level level-3">
                                        {gerencia.nivel3.map((supervisor, subIndex) => (
                                            <div key={subIndex} className="org-card-wrapper-small">
                                                <div 
                                                    className={`org-card-small ${selectedCard === supervisor ? 'expanded' : ''}`}
                                                    style={{ background: `linear-gradient(135deg, ${supervisor.color} 0%, ${supervisor.color}dd 100%)` }}
                                                    onClick={() => handleCardClick(supervisor)}
                                                >
                                                    <div className="org-icon-small">👤</div>
                                                    <div className="org-info-small">
                                                        <h4>{supervisor.cargo}</h4>
                                                        <p className="org-name-small">{supervisor.nombrePersona}</p>
                                                        <p className="org-department-small">{supervisor.area}</p>
                                                        <div className="org-meta">
                                                            <span className="org-employees">👥 {supervisor.empleados} empleados</span>
                                                        </div>
                                                    </div>
                                                    <div className="org-expand-icon-small">▼</div>
                                                </div>
                                                
                                                {/* Detalles expandidos para nivel 3 */}
                                                {selectedCard === supervisor && (
                                                    <div className="org-details-small">
                                                        <h4>Detalle de Personal:</h4>
                                                        <div className="employees-total-small">
                                                            <strong>Total: {supervisor.empleados} empleados</strong>
                                                        </div>
                                                        {supervisor.detalleEmpleados && (
                                                            <div className="employees-breakdown-small">
                                                                {Object.entries(supervisor.detalleEmpleados).map(([cargo, cantidad], idx) => (
                                                                    <div key={idx} className="employee-role">
                                                                        <span className="role-name">{cargo.charAt(0).toUpperCase() + cargo.slice(1)}:</span>
                                                                        <span className="role-count">{cantidad}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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

