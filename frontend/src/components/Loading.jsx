import './Loading.css';

function Loading({ message = 'Cargando datos' }) {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="loader">
                    <div className="loader-gear">
                        <svg viewBox="0 0 100 100">
                            <path d="M50 10 L54 10 L56 20 L60 22 L68 16 L72 20 L66 28 L68 32 L78 34 L78 38 L68 40 L66 44 L72 52 L68 56 L60 50 L56 52 L54 62 L50 62 L48 52 L44 50 L36 56 L32 52 L38 44 L36 40 L26 38 L26 34 L36 32 L38 28 L32 20 L36 16 L44 22 L48 20 L50 10 Z" 
                                fill="currentColor"/>
                            <circle cx="50" cy="36" r="10" fill="var(--bg-primary)"/>
                        </svg>
                    </div>
                    <div className="loader-ring"></div>
                </div>
                <div className="loading-text">
                    <span>{message}</span>
                    <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div className="loading-progress">
                    <div className="progress-bar"></div>
                </div>
            </div>
        </div>
    );
}

export default Loading;
