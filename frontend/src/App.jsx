import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import OrdersPage from './pages/OrdersPage';
import ScriptsPage from './pages/ScriptsPage';
import CreatorsPage from './pages/CreatorsPage';
import ShootsPage from './pages/ShootsPage';
import VideosPage from './pages/VideosPage';
import ClientPortalPage from './pages/ClientPortalPage';
import PaymentsPage from './pages/PaymentsPage';
import ExpensesPage from './pages/ExpensesPage';
import PayoutsPage from './pages/PayoutsPage';
import TasksPage from './pages/TasksPage';
import SupportPage from './pages/SupportPage';
import EmployeesPage from './pages/EmployeesPage';
import ActivityLogsPage from './pages/ActivityLogsPage';

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-amber-500 font-mono text-xs">
        Authenticating LEADYFY OS Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#09090B]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to={user.role === 'CLIENT' ? '/client-portal' : '/dashboard'} replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/scripts" element={<ScriptsPage />} />
            <Route path="/creators" element={<CreatorsPage />} />
            <Route path="/shoots" element={<ShootsPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/client-portal" element={<ClientPortalPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/payouts" element={<PayoutsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/activity-logs" element={<ActivityLogsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}
