import './MissionVision.css';

function MissionVision() {
    const mision = {
        titulo: 'Misión',
        contenido: 'Ser una empresa minera de clase mundial, comprometida con la excelencia operativa, la seguridad integral y la sostenibilidad ambiental. Extraemos y procesamos recursos minerales de manera responsable, maximizando la eficiencia productiva, garantizando el bienestar de nuestros colaboradores y comunidades, y generando valor sostenible para nuestros accionistas mediante la aplicación de tecnologías de vanguardia, mejores prácticas internacionales y un compromiso inquebrantable con la responsabilidad social y ambiental.',
        icono: '⛏️'
    };

    const vision = {
        titulo: 'Visión',
        contenido: 'Ser reconocidos como una de las empresas mineras líderes a nivel mundial para el año 2030, destacándonos por nuestra excelencia operativa, innovación tecnológica, sostenibilidad ambiental y responsabilidad social. Aspiramos a establecer nuevos estándares en la industria minera mediante la implementación de procesos de clase mundial, el desarrollo de nuestro capital humano, la adopción de tecnologías de punta y el compromiso con la minería sostenible, posicionándonos como referente global en eficiencia, seguridad y responsabilidad corporativa.',
        icono: '🌍'
    };

    const valores = [
        { nombre: 'Excelencia Operativa', descripcion: 'Buscamos la perfección en cada proceso minero, desde la extracción hasta el procesamiento, estableciendo estándares de clase mundial', icono: '⭐' },
        { nombre: 'Seguridad Integral', descripcion: 'Cero daño a las personas, cero daño al medio ambiente. La seguridad es nuestra prioridad absoluta en todas las operaciones', icono: '🛡️' },
        { nombre: 'Sostenibilidad', descripcion: 'Comprometidos con la minería responsable, el cuidado del medio ambiente y el desarrollo sostenible de las comunidades', icono: '🌱' },
        { nombre: 'Innovación Tecnológica', descripcion: 'Aplicamos tecnologías de vanguardia y mejores prácticas internacionales para optimizar procesos y resultados', icono: '💡' },
        { nombre: 'Integridad y Transparencia', descripcion: 'Actuamos con honestidad, ética y transparencia en todas nuestras relaciones y operaciones', icono: '🤝' },
        { nombre: 'Desarrollo del Capital Humano', descripcion: 'Invertimos en el crecimiento profesional y personal de nuestros colaboradores, reconociendo que son nuestro mayor activo', icono: '👥' },
        { nombre: 'Responsabilidad Social', descripcion: 'Contribuimos al desarrollo de las comunidades donde operamos, generando valor compartido y relaciones de largo plazo', icono: '🌍' }
    ];

    return (
        <div className="mission-vision-container">
            <div className="mv-header">
                <h1>🎯 Misión y Visión</h1>
                <p>Nuestros principios fundamentales y objetivos estratégicos</p>
            </div>

            <div className="mv-content">
                {/* Misión */}
                <div className="mv-card mission-card">
                    <div className="mv-icon-wrapper mission-icon">
                        <span className="mv-icon-large">{mision.icono}</span>
                    </div>
                    <div className="mv-content-wrapper">
                        <h2>{mision.titulo}</h2>
                        <p className="mv-text">{mision.contenido}</p>
                    </div>
                </div>

                {/* Visión */}
                <div className="mv-card vision-card">
                    <div className="mv-icon-wrapper vision-icon">
                        <span className="mv-icon-large">{vision.icono}</span>
                    </div>
                    <div className="mv-content-wrapper">
                        <h2>{vision.titulo}</h2>
                        <p className="mv-text">{vision.contenido}</p>
                    </div>
                </div>
            </div>

            {/* Valores */}
            <div className="valores-section">
                <h2 className="valores-title">💎 Valores Corporativos</h2>
                <p className="valores-subtitle">Los principios que guían nuestro trabajo diario</p>
                
                <div className="valores-grid">
                    {valores.map((valor, index) => (
                        <div key={index} className="valor-card">
                            <div className="valor-icon">{valor.icono}</div>
                            <h3>{valor.nombre}</h3>
                            <p>{valor.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MissionVision;

