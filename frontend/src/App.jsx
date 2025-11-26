import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Machinery from './pages/Machinery';
import Personnel from './pages/Personnel';
import Maintenance from './pages/Maintenance';
import Inventory from './pages/Inventory';

function App() {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/machinery" element={<Machinery />} />
                    <Route path="/personnel" element={<Personnel />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/inventory" element={<Inventory />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
