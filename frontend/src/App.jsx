import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { HeartPulse } from 'lucide-react';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientChart from './pages/PatientChart';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="w-full max-w-sm p-6 bg-white border border-slate-200 rounded-xl shadow-xs text-center flex flex-col items-center space-y-5">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 shadow-inner">
            <div className="absolute inset-0 w-full h-full rounded-full border-2 border-indigo-650 border-t-transparent animate-spin" />
            <HeartPulse className="w-7 h-7 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight">EHR Management Suite</h2>
            <p className="text-[10px] text-slate-500 mt-2 max-w-[280px] leading-relaxed">
              Connecting to secure database container. If server was inactive, waking up Render's cold start can take up to 45 seconds...
            </p>
          </div>
          
          <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider border-t border-slate-100 pt-3.5 w-full">
            Securing Portal Connection
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Routes wrapped in DashboardLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientList />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientChart />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Appointments />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
