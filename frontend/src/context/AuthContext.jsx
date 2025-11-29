import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Función auxiliar para obtener la ruta de destino
    const getRedirectPath = () => {
        // Intentar obtener la ruta de destino del state de navegación
        const savedPath = sessionStorage.getItem('redirectAfterLogin');
        if (savedPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            return savedPath;
        }
        return '/dashboard';
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);
                // Guardar user con email si está disponible
                const userData = {
                    ...data.user,
                    email: data.user.email || null
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                const redirectPath = getRedirectPath();
                navigate(redirectPath, { replace: true });
                return { success: true, user: userData };
            } else {
                return { success: false, error: data.error || 'Credenciales inválidas' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Error de conexión con el servidor' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        setUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
