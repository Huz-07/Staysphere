import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2L3 8v12h6v-6h4v6h6V8L11 2z" fill="currentColor"/>
                  <circle cx="11" cy="10" r="2" fill="var(--ink-2)" opacity="0.7"/>
                </svg>
              </div>
              <span>StaySphere</span>
            </div>
            <p className="footer__tagline">Your home away from home. Seamless hostel & PG management for modern living.</p>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Browse Rooms</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__contact">
              <li>
                <svg viewBox="0 0 20 20" fill="none"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 0l6 5 6-5" stroke="currentColor" strokeWidth="1.5"/></svg>
                hello@staysphere.com
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="none"><path d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 16.352V17.5a1.5 1.5 0 01-1.5 1.5H15C7.268 19 2 13.732 2 6V3.5z" stroke="currentColor" strokeWidth="1.5"/></svg>
                +91 98765 43210
              </li>
              <li>
                <svg viewBox="0 0 20 20" fill="none"><path d="M9 11a2 2 0 100-4 2 2 0 000 4zm4.243-4.243A6 6 0 113.757 14.243M15 9a6 6 0 01-6 6" stroke="currentColor" strokeWidth="1.5"/></svg>
                Rajkot, Gujarat, India
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} StaySphere. Built with React & MERN Stack.</p>
          <p className="footer__credits">By - Huzaifa Hakimi</p>
        </div>
      </div>
    </footer>
  );
}
