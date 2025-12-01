import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Machinery from './pages/Machinery';
import Personnel from './pages/Personnel';
import Maintenance from './pages/Maintenance';
import Inventory from './pages/Inventory';
import MachineryForms from './pages/MachineryForms';
import WorkOrders from './pages/WorkOrders';
import Login from './pages/Login';
import Users from './pages/Users';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import Organigrama from './pages/Organigrama';
import MissionVision from './pages/MissionVision';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '1.2rem',
                color: '#666'
            }}>
                Cargando...
            </div>
        );
    }

    if (!user) {
        // Guardar la ruta a la que intentó acceder
        if (location.pathname !== '/login') {
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
        }
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

function AppContent() {
    const { user } = useAuth();

    return (
        <div className="app">
            {user && <Navbar />}
            <main className={user ? "main-content" : "login-content"}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/machinery" element={
                        <ProtectedRoute>
                            <Machinery />
                        </ProtectedRoute>
                    } />
                    <Route path="/machinery/:id/forms" element={
                        <ProtectedRoute>
                            <MachineryForms />
                        </ProtectedRoute>
                    } />
                    <Route path="/personnel" element={
                        <ProtectedRoute>
                            <Personnel />
                        </ProtectedRoute>
                    } />
                    <Route path="/maintenance" element={
                        <ProtectedRoute>
                            <Maintenance />
                        </ProtectedRoute>
                    } />
                    <Route path="/inventory" element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    } />
                    <Route path="/work-orders" element={
                        <ProtectedRoute>
                            <WorkOrders />
                        </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                        <ProtectedRoute>
                            <Users />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/organigrama" element={
                        <ProtectedRoute>
                            <Organigrama />
                        </ProtectedRoute>
                    } />
                    <Route path="/mision-vision" element={
                        <ProtectedRoute>
                            <MissionVision />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
