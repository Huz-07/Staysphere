import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validators, validateForm } from '../../utils/validation';
import FormInput from '../../components/common/FormInput';
import './Auth.css';

const RULES = {
  name:            [validators.name],
  email:           [validators.email],
  phone:           [validators.phone],
  password:        [validators.password],
  confirmPassword: [(val, vals) => validators.confirmPassword(val, vals.password)],
};

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]       = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' });
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
    const allTouched = Object.fromEntries(Object.keys(RULES).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validateForm(form, RULES);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const result = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setApiError(result.error);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1 className="auth-card__title">Create Account</h1>
          <p className="auth-card__subtitle">Join StaySphere today — it's free</p>
        </div>
        {apiError && <div className="form-error-banner">⚠️ {apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <FormInput label="Full Name"   name="name"            type="text"     value={form.name}            onChange={handleChange} onBlur={handleBlur} error={touched.name            && errors.name}            required />
          <FormInput label="Email"       name="email"           type="email"    value={form.email}           onChange={handleChange} onBlur={handleBlur} error={touched.email           && errors.email}           required />
          <FormInput label="Phone"       name="phone"           type="tel"      value={form.phone}           onChange={handleChange} onBlur={handleBlur} error={touched.phone           && errors.phone}           required />
          <FormInput label="Password"    name="password"        type="password" value={form.password}        onChange={handleChange} onBlur={handleBlur} error={touched.password        && errors.password}        required />
          <FormInput label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={touched.confirmPassword && errors.confirmPassword} required />
          <button
            type="submit"
            className="btn btn--primary btn--lg btn--full"
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
