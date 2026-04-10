import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

// Client Pages
import Home from './pages/client/Home';
import RoomView from './pages/client/RoomView';
import Booking from './pages/client/Booking';
import MyBookings from './pages/client/MyBookings';
import Profile from './pages/client/Profile';
import Login from './pages/client/Login';
import Register from './pages/client/Register';

// ── New Client Info Pages ──
import FAQ from './pages/client/FAQ';
import ContactUs from './pages/client/ContactUs';
import PrivacyPolicy from './pages/client/PrivacyPolicy';
import TermsOfService from './pages/client/TermsOfService';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManageRooms from './pages/admin/ManageRooms';
import ManageUsers from './pages/admin/ManageUsers';
import ManageBookings from './pages/admin/ManageBookings';

// ── New Admin Pages ──
import ManageNotices from './pages/admin/ManageNotices';
import ManageMaintenance from './pages/admin/ManageMaintenance';
import ManageMessages from './pages/admin/ManageMessages';
import Reports from './pages/admin/Reports';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Client Routes ── */}
          <Route path="/" element={<ClientLayout />}>
            <Route index element={<Home />} />
            <Route path="rooms/:id" element={<RoomView />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Info Pages – public */}
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />

            {/* Protected client routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="booking/:id" element={<Booking />} />
              <Route path="my-bookings" element={<MyBookings />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ── Admin Routes ── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rooms" element={<ManageRooms />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="notices" element={<ManageNotices />} />
            <Route path="maintenance" element={<ManageMaintenance />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
