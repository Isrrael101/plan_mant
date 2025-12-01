import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Loading from './components/Loading';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Machinery = lazy(() => import('./pages/Machinery'));
const Personnel = lazy(() => import('./pages/Personnel'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const Inventory = lazy(() => import('./pages/Inventory'));
const MachineryForms = lazy(() => import('./pages/MachineryForms'));
const WorkOrders = lazy(() => import('./pages/WorkOrders'));
const Login = lazy(() => import('./pages/Login'));
const Users = lazy(() => import('./pages/Users'));
const Profile = lazy(() => import('./pages/Profile'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Organigrama = lazy(() => import('./pages/Organigrama'));
const MissionVision = lazy(() => import('./pages/MissionVision'));

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
                <Suspense fallback={<Loading />}>
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
                </Suspense>
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
