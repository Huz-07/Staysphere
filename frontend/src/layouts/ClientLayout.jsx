import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './ClientLayout.css';

export default function ClientLayout() {
  return (
    <div className="client-layout">
      <Navbar />
      <main className="client-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
