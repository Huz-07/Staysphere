import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validators, validateForm } from '../../utils/validation';
import FormInput from '../../components/common/FormInput';
import './Auth.css';

const RULES = {
  email:    [validators.email],
  password: [validators.required],
};

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setApiError('');
  };
  const handleBlur = (e) => {
    setTouched(p => ({ ...p, [e.target.name]: true }));
    setErrors(validateForm(form, RULES));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { email: true, password: true };
    setTouched(allTouched);
    const errs = validateForm(form, RULES);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate(result.role === 'admin' ? '/admin/dashboard' : '/');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">Sign in to your StaySphere account</p>
        </div>
        {apiError && (
          <div className="form-error-banner">⚠️ {apiError}</div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email}
            required
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            required
          />
          <button
            type="submit"
            className="btn btn--primary btn--lg btn--full"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="auth-card__footer" style={{ marginTop: 4 }}>
          Admin? <Link to="/admin/login">Admin Login →</Link>
        </p>
      </div>
    </div>
  );
}
