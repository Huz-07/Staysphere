import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success && result.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (result.success && result.role !== 'admin') {
      setError('This account does not have admin privileges.');
    } else {
      setError(result.error || 'Invalid credentials.');
    }
  };

  return (
    <div className="admin-login">
      {/* Left Panel */}
      <div className="admin-login__left">
        <div className="admin-login__brand">
          <div className="al-logo">🏠</div>
          <span>StaySphere</span>
        </div>
        <div className="admin-login__pitch">
          <h2>Manage Your Property<br/>With Confidence</h2>
          <p>
            Full control over rooms, bookings, residents, maintenance requests,
            and financial reports — all from one elegant dashboard.
          </p>
          <ul className="admin-login__features">
            <li>📊 Real-time occupancy & revenue dashboards</li>
            <li>📋 Booking approvals & cancellations</li>
            <li>🔧 Maintenance request tracking</li>
            <li>👥 Resident management & histories</li>
            <li>📢 Broadcast notices to all residents</li>
          </ul>
        </div>
        <div className="admin-login__demo-cred">
          <strong>Demo Credentials</strong>
          Email: admin@staysphere.com<br/>
          Password: Admin@123
        </div>
      </div>

      {/* Right Panel */}
      <div className="admin-login__right">
        <div className="admin-login__card">
          <div className="admin-login__shield">🛡️</div>
          <h1 className="admin-login__title">Admin Portal</h1>
          <p className="admin-login__sub">Sign in with your administrator credentials</p>

          {error && (
            <div className="auth-error" style={{ marginBottom: 16, textAlign: 'left' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={e => { setForm(p=>({...p, email: e.target.value})); setError(''); }}
                placeholder="admin@staysphere.com"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={form.password}
                onChange={e => { setForm(p=>({...p, password: e.target.value})); setError(''); }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn--primary btn--lg btn--full"
              style={{ marginTop: 8 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In as Admin'}
            </button>
          </form>

          <Link to="/" className="admin-login__back-link">
            <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
              <path d="M15 10H5M5 10l4-4M5 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Go to User Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
