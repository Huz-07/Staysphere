import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const MANAGEMENT_ITEMS = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>),
  },
  {
    label: 'Rooms',
    to: '/admin/rooms',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.5"/></svg>),
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 17a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M15 8a3 3 0 010 6M18 17a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  },
  {
    label: 'Bookings',
    to: '/admin/bookings',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 2v4M13 2v4M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 13h2M11 13h2M7 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  },
];

const TOOLS_ITEMS = [
  {
    label: 'Notices',
    to: '/admin/notices',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M4 4h12a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M6 13l-2 4M14 13l2 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  },
  {
    label: 'Messages',
    to: '/admin/messages',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3a2 2 0 01-1-1.73V5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 8h6M7 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  },
  {
    label: 'Maintenance',
    to: '/admin/maintenance',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M11.5 3.5a5 5 0 00-6.8 7.1L3 17l6.4-1.7a5 5 0 107.1-6.8l-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>),
  },
  {
    label: 'Reports',
    to: '/admin/reports',
    icon: (<svg viewBox="0 0 20 20" fill="none" width="18" height="18"><path d="M3 3v14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 14V9M11 14V6M15 14v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const renderItem = (item) => (
    <li key={item.to}>
      <NavLink
        to={item.to}
        className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
        onClick={onClose}
      >
        <span className="sidebar__link-icon">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    </li>
  );

  return (
    <aside className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}>

      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <path d="M11 2L3 8v12h6v-6h4v6h6V8L11 2z" fill="currentColor" opacity="0.9"/>
            <circle cx="11" cy="10" r="2" fill="var(--ink-2)" opacity="0.7"/>
          </svg>
        </div>
        <div>
          <span className="sidebar__brand-name">StaySphere</span>
          <span className="sidebar__brand-sub">Admin Panel</span>
        </div>
        <button className="sidebar__close-btn" onClick={onClose} aria-label="Close sidebar">
          <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="sidebar__user">
        <div className="sidebar__avatar">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div>
          <div className="sidebar__user-name">{user?.name || 'Admin'}</div>
          <div className="sidebar__user-role">Administrator</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__nav-label">Management</span>
        <ul>{MANAGEMENT_ITEMS.map(renderItem)}</ul>
        <span className="sidebar__nav-label" style={{ marginTop: 'var(--space-5)' }}>Tools</span>
        <ul>{TOOLS_ITEMS.map(renderItem)}</ul>
      </nav>

      <div className="sidebar__footer">
        <Link to="/" className="sidebar__user-dashboard" onClick={onClose}>
          <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
            <path d="M15 10H5M5 10l4-4M5 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          User Dashboard
        </Link>
        <button className="sidebar__logout" onClick={handleLogout}>
          <svg viewBox="0 0 20 20" fill="none" width="17" height="17">
            <path d="M7 3H5a2 2 0 00-2 2v10a2 2 0 002 2h2M13 7l4 3-4 3M17 10H9"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign Out
        </button>
      </div>

    </aside>
  );
}
