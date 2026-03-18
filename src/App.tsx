import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarList from './pages/CarList';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MarketerLayout from './components/MarketerLayout';
import MarketerDashboard from './pages/marketer/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import AdminCars from './pages/admin/Cars';
import AdminLeads from './pages/admin/Leads';
import AdminMarketers from './pages/admin/Marketers';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #3f3f46',
              borderRadius: '12px',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/cars" element={<Layout><CarList /></Layout>} />
          <Route path="/cars/:id" element={<Layout><CarDetails /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />

          {/* Marketer Routes */}
          <Route path="/marketer" element={
            <ProtectedRoute allowedRoles={['marketer']}>
              <MarketerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<MarketerDashboard />} />
            <Route path="leads" element={<div className="p-8 text-center text-zinc-500">قريباً: إدارة العملاء</div>} />
            <Route path="reports" element={<div className="p-8 text-center text-zinc-500">قريباً: التقارير المالية</div>} />
            <Route path="notifications" element={<div className="p-8 text-center text-zinc-500">قريباً: الإشعارات</div>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="marketers" element={<AdminMarketers />} />
            <Route path="settings" element={<div className="p-8 text-center text-zinc-500">قريباً: الإعدادات</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}
