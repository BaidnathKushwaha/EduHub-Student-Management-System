import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />

                <div className="flex-1 min-w-0">
                    <Navbar />

                    <main className="p-6">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/students" element={<Students />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;