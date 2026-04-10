import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { validators, validateForm } from '../../utils/validation';
import { contactAPI } from '../../utils/api';
import FormInput from '../../components/common/FormInput';
import './InfoPages.css';

const RULES = {
  name:    [validators.name],
  email:   [validators.email],
  phone:   [validators.phone],
  subject: [validators.required],
  message: [validators.required, validators.minLength(20)],
};

export default function ContactUs() {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    setErrors(validateForm(form, RULES));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validateForm(form, RULES);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await contactAPI.send(form);
      setSubmitted(true);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-page page-enter">

      {/* ── Hero ── */}
      <div className="info-hero info-hero--contact">
        <div className="container">
          <div className="info-hero__badge">📬 Get In Touch</div>
          <h1 className="info-hero__title">Contact Us</h1>
          <p className="info-hero__sub">
            Have a question or need help? We'd love to hear from you.
            Our team responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="container info-body">
        <div className="contact-layout">

          {/* ── Left: Info Cards ── */}
          <div className="contact-info-col">
            <h2 className="contact-info-col__title">Reach Us Directly</h2>
            <p className="contact-info-col__sub">
              Whether you have a question about rooms, bookings, or anything else —
              our team is ready to help.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-card__icon">📍</div>
                <div className="contact-card__body">
                  <div className="contact-card__label">Address</div>
                  <div className="contact-card__value">
                    StaySphere, Near City Mall<br />
                    Rajkot – 360001, Gujarat, India
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card__icon">📞</div>
                <div className="contact-card__body">
                  <div className="contact-card__label">Phone Number</div>
                  <div className="contact-card__value">
                    +91 12345 54321<br />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Mon–Sat, 9 AM to 7 PM</span>
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card__icon">📧</div>
                <div className="contact-card__body">
                  <div className="contact-card__label">Email Address</div>
                  <div className="contact-card__value">
                    hello@staysphere.com<br />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>We reply within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card__icon">⏰</div>
                <div className="contact-card__body">
                  <div className="contact-card__label">Office Hours</div>
                  <div className="contact-card__value">
                    Monday – Saturday: 9 AM – 7 PM<br />
                    Sunday: Closed
                  </div>
                </div>
              </div>
            </div>

            {/* Map box */}
            <div className="contact-map-box">
              <div className="contact-map-box__header">
                <span>🗺️</span>
                <div>
                  <div className="contact-map-box__title">Find Us on Map</div>
                  <div className="contact-map-box__sub">Near City Mall, Rajkot, Gujarat</div>
                </div>
              </div>
              <div className="contact-map-box__embed">
                <span className="contact-map-box__placeholder">🗺️</span>
                <p>Google Maps Embed — Add your property location here</p>
                <small>Replace this block with a Google Maps iframe when deploying</small>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="contact-form-col">
            {submitted ? (
              <div className="contact-success">
                <div className="contact-success__icon">✅</div>
                <h3>Message Sent!</h3>
                <p>
                  Thank you, <strong>{form.name}</strong>! We have received your message
                  and will reply to <strong>{form.email}</strong> within 24 hours.
                </p>
                <button
                  className="btn btn--outline"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
                    setTouched({});
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="contact-form-col__title">Send Us a Message</h2>
                <p className="contact-form-col__sub">
                  Fill in the form below and we'll get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} noValidate className="contact-form">
                  <div className="form-grid form-grid--2">
                    <FormInput
                      label="Full Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name ? errors.name : ''}
                      placeholder="Arjun Mehta"
                      required
                    />
                    <FormInput
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone ? errors.phone : ''}
                      placeholder="9876543210"
                      required
                    />
                  </div>

                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email ? errors.email : ''}
                    placeholder="you@example.com"
                    required
                  />

                  <div className="form-field">
                    <label className="form-field__label">
                      Subject <span className="form-field__required">*</span>
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-field__input"
                    >
                      <option value="">Select a subject…</option>
                      <option value="Room Enquiry">Room Enquiry</option>
                      <option value="Booking Help">Booking Help</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Maintenance Request">Maintenance Request</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                    {touched.subject && errors.subject && (
                      <p className="form-field__error">{errors.subject}</p>
                    )}
                  </div>

                  <div className="form-field">
                    <label className="form-field__label">
                      Message <span className="form-field__required">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      placeholder="Describe your query or issue in detail (minimum 20 characters)…"
                      className="form-field__input"
                    />
                    {touched.message && errors.message && (
                      <p className="form-field__error">{errors.message}</p>
                    )}
                    <p className="form-field__hint">{form.message.length} characters</p>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary btn--lg w-full"
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="spinner" /> Sending…</>
                      : <><span>📨</span> Send Message</>
                    }
                  </button>

                  <p className="contact-form__note">
                    By submitting, you agree to our{' '}
                    <Link to="/privacy-policy">Privacy Policy</Link>.
                  </p>
                </form>
              </>
            )}
          </div>

        </div>

        {/* ── Bottom CTA ── */}
        <div className="info-cta">
          <h3>Looking for quick answers?</h3>
          <p>Browse our FAQ section — most common questions are answered there instantly.</p>
          <div className="info-cta__btns">
            <Link to="/faq" className="btn btn--gold btn--lg">View FAQ</Link>
            <Link to="/" className="btn btn--outline btn--lg">Browse Rooms</Link>
          </div>
        </div>

      </div>
    </div>
  );
}