import React from 'react';
import { useLocation } from 'react-router-dom';
import './AdminHeader.css';

const PAGE_TITLES = {
  '/admin/dashboard':   { title: 'Dashboard',    sub: 'Welcome back, Admin' },
  '/admin/rooms':       { title: 'Manage Rooms', sub: 'Add, edit, and monitor room inventory' },
  '/admin/users':       { title: 'Manage Users', sub: 'View and manage resident accounts' },
  '/admin/bookings':    { title: 'Manage Bookings', sub: 'Track and control all booking requests' },
  '/admin/notices':     { title: 'Notices',      sub: 'Post announcements and alerts for residents' },
  '/admin/maintenance': { title: 'Maintenance',  sub: 'Track and resolve resident maintenance requests' },
  '/admin/reports':     { title: 'Reports',      sub: 'Revenue, occupancy, and booking analytics' },
};

export default function AdminHeader({ onMenuClick }) {
  const { pathname } = useLocation();
  const info = PAGE_TITLES[pathname] || { title: 'Admin Panel', sub: '' };
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button className="admin-header__menu-btn" onClick={onMenuClick} aria-label="Open sidebar">
          <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div>
          <h1 className="admin-header__title">{info.title}</h1>
          {info.sub && <p className="admin-header__sub">{info.sub}</p>}
        </div>
      </div>
      <div className="admin-header__right">
        <div className="admin-header__date">
          <svg viewBox="0 0 18 18" fill="none" width="15" height="15">
            <rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M6 1.5v3M12 1.5v3M2 8h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {today}
        </div>
      </div>
    </header>
  );
}
