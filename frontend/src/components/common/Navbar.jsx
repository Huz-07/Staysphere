import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2L3 8v12h6v-6h4v6h6V8L11 2z" fill="currentColor" opacity="0.9"/>
              <circle cx="11" cy="10" r="2" fill="white" opacity="0.8"/>
            </svg>
          </div>
          <span className="navbar__logo-text">StaySphere</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar__links">
          <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/faq" className={({isActive}) => isActive ? 'active' : ''}>FAQ</NavLink></li>
          <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
          {isLoggedIn && (
            <li><NavLink to="/my-bookings" className={({isActive}) => isActive ? 'active' : ''}>My Bookings</NavLink></li>
          )}
          <li><NavLink to="/admin/login" className={({isActive}) => isActive ? 'active' : ''}>Admin</NavLink></li>
        </ul>

        {/* Actions */}
        <div className="navbar__actions">
          {isLoggedIn ? (
            <div className="navbar__user" ref={dropRef}>
              <button className="navbar__avatar" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="User menu">
                <span className="avatar-initials">{initials}</span>
              </button>
              {dropdownOpen && (
                <div className="navbar__dropdown animate-scale-in">
                  <div className="dropdown__user-info">
                    <span className="dropdown__name">{user.name}</span>
                    <span className="dropdown__email">{user.email}</span>
                  </div>
                  <hr className="dropdown__divider" />
                  <Link to="/profile" className="dropdown__item">
                    <svg viewBox="0 0 20 20" fill="none"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0H4z" fill="currentColor"/></svg>
                    My Profile
                  </Link>
                  <Link to="/my-bookings" className="dropdown__item">
                    <svg viewBox="0 0 20 20" fill="none"><path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 4h6M7 10h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    My Bookings
                  </Link>
                  <Link to="/admin/login" className="dropdown__item">
                    <svg viewBox="0 0 20 20" fill="none"><path d="M10 2a4 4 0 014 4v2h1a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V9a1 1 0 011-1h1V6a4 4 0 014-4zm-2 6h4V6a2 2 0 10-4 0v2z" fill="currentColor"/></svg>
                    Admin Portal
                  </Link>
                  <hr className="dropdown__divider" />
                  <button onClick={handleLogout} className="dropdown__item dropdown__item--danger">
                    <svg viewBox="0 0 20 20" fill="none"><path d="M7 3H5a2 2 0 00-2 2v10a2 2 0 002 2h2M13 7l4 3-4 3M17 10H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost">Sign In</Link>
              <Link to="/register" className="btn btn--primary">Get Started</Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile ${menuOpen ? 'navbar__mobile--open' : ''}`}>
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/faq">FAQ</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
          {isLoggedIn && <li><NavLink to="/my-bookings">My Bookings</NavLink></li>}
          {isLoggedIn && <li><NavLink to="/profile">Profile</NavLink></li>}
          <li><NavLink to="/admin/login">Admin Portal</NavLink></li>
          <li className="mobile-auth">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="btn btn--outline-dark w-full">Sign Out</button>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost">Sign In</Link>
                <Link to="/register" className="btn btn--primary">Register</Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
