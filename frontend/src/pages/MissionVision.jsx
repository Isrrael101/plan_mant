import './MissionVision.css';

function MissionVision() {
    const mision = {
        titulo: 'Misión',
        contenido: 'Ser líderes en la gestión de mantenimiento de maquinaria pesada, proporcionando soluciones integrales que maximicen la eficiencia operativa, garanticen la seguridad de nuestros colaboradores y contribuyan al desarrollo sostenible de nuestros clientes, mediante la aplicación de tecnologías innovadoras y el compromiso con la excelencia en el servicio.',
        icono: '🎯'
    };

    const vision = {
        titulo: 'Visión',
        contenido: 'Ser reconocidos como la empresa de referencia en mantenimiento preventivo y correctivo de maquinaria pesada, caracterizándonos por nuestra innovación tecnológica, compromiso con la calidad, responsabilidad ambiental y el desarrollo continuo de nuestro capital humano, estableciendo relaciones de largo plazo basadas en la confianza y el valor agregado.',
        icono: '👁️'
    };

    const valores = [
        { nombre: 'Excelencia', descripcion: 'Buscamos la perfección en cada tarea que realizamos', icono: '⭐' },
        { nombre: 'Integridad', descripcion: 'Actuamos con honestidad y transparencia en todas nuestras acciones', icono: '🤝' },
        { nombre: 'Innovación', descripcion: 'Aplicamos tecnologías y métodos modernos para mejorar continuamente', icono: '💡' },
        { nombre: 'Seguridad', descripcion: 'Priorizamos el bienestar de nuestro personal y el cuidado del medio ambiente', icono: '🛡️' },
        { nombre: 'Compromiso', descripcion: 'Cumplimos nuestros compromisos con dedicación y responsabilidad', icono: '💪' },
        { nombre: 'Trabajo en Equipo', descripcion: 'Valoramos la colaboración y el esfuerzo conjunto', icono: '👥' }
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

