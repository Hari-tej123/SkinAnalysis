import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/upload';
import Results from './pages/Results';
import Chat from './pages/chat';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import Progress from './pages/Progress';
import Scanner from './pages/Scanner';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<Chat />} />

          {/* Protected routes (require login) */}
          <Route path="/history" element={
            <ProtectedRoute><History /></ProtectedRoute>
          } />
          <Route path="/progress" element={
            <ProtectedRoute><Progress /></ProtectedRoute>
          } />
          <Route path="/scanner" element={<Scanner />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}