import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { validators, validateForm, monthsBetween } from '../../utils/validation';
import FormInput from '../../components/common/FormInput';
import './Booking.css';

const INITIAL = {
  fullName:'', email:'', phone:'',
  checkIn:'', checkOut:'',
  idType:'aadhar', idNumber:'',
  specialRequests:'', agreeTerms: false,
};

const RULES = {
  fullName: [validators.name],
  email:    [validators.email],
  phone:    [validators.phone],
  checkIn:  [validators.futureDate],
  checkOut: [(val, vals) => validators.checkOutAfterCheckIn(val, vals.checkIn)],
  idNumber: [validators.required, validators.minLength(6)],
};

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom]       = useState(null);
  const [roomLoading, setRoomLoading] = useState(true);
  const [form, setForm]       = useState({ ...INITIAL, fullName: user?.name||'', email: user?.email||'', phone: user?.phone||'' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError]   = useState('');

  useEffect(() => {
    roomsAPI.getById(id)
      .then(({ room }) => setRoom(room))
      .catch(() => setRoom(null))
      .finally(() => setRoomLoading(false));
  }, [id]);

  useEffect(() => {
    if (Object.keys(touched).length > 0) setErrors(validateForm(form, RULES));
  }, [form]);

  const months   = form.checkIn && form.checkOut ? monthsBetween(form.checkIn, form.checkOut) : 0;
  const totalAmt = room ? room.price * months : 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
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
    if (Object.keys(errs).length > 0 || !form.agreeTerms) return;

    setLoading(true);
    setApiError('');
    try {
      await bookingsAPI.create({
        roomId:          room._id,
        checkIn:         form.checkIn,
        checkOut:        form.checkOut,
        guestName:       form.fullName,
        guestEmail:      form.email,
        guestPhone:      form.phone,
        idProof:         { type: form.idType, number: form.idNumber },
        specialRequests: form.specialRequests,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (roomLoading) return <div style={{textAlign:'center',padding:'80px 0',color:'#64748b'}}>Loading...</div>;

  if (!room) return (
    <div className="booking-page page-enter">
      <div className="container">
        <div className="not-found-box" style={{textAlign:'center',padding:'80px 0'}}>
          <span style={{fontSize:48}}>🏠</span>
          <h2>Room Not Found</h2>
          <Link to="/" className="btn btn--primary" style={{marginTop:16,display:'inline-flex'}}>Back to Rooms</Link>
        </div>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="booking-page page-enter">
      <div className="container">
        <div className="booking-success">
          <div className="booking-success__icon">✅</div>
          <h2>Booking Request Submitted!</h2>
          <p>Your booking for <strong>{room.name}</strong> (Room {room.roomNo}) has been submitted and is <strong>pending admin approval</strong>.</p>
          <p style={{color:'#64748b',marginTop:8}}>You will see the status update in My Bookings once the admin reviews it.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',marginTop:24}}>
            <Link to="/my-bookings" className="btn btn--primary">View My Bookings</Link>
            <Link to="/" className="btn btn--secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="booking-page page-enter">
      <div className="container">
        <Link to={`/rooms/${room._id}`} className="back-link">← Back to Room</Link>
        <div className="booking-grid">
          {/* Form */}
          <div className="booking-form-wrap">
            <h2 className="booking-form-title">Complete Your Booking</h2>
            {apiError && <div className="form-error-banner">⚠️ {apiError}</div>}
            <form onSubmit={handleSubmit} className="booking-form" noValidate>
              <div className="form-section">
                <h3 className="form-section-title">Personal Details</h3>
                <FormInput label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} onBlur={handleBlur} error={touched.fullName && errors.fullName} required />
                <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && errors.email} required />
                <FormInput label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} onBlur={handleBlur} error={touched.phone && errors.phone} required />
              </div>
              <div className="form-section">
                <h3 className="form-section-title">Stay Duration</h3>
                <FormInput label="Check-In Date" name="checkIn" type="date" value={form.checkIn} onChange={handleChange} onBlur={handleBlur} error={touched.checkIn && errors.checkIn} required />
                <FormInput label="Check-Out Date" name="checkOut" type="date" value={form.checkOut} onChange={handleChange} onBlur={handleBlur} error={touched.checkOut && errors.checkOut} required />
              </div>
              <div className="form-section">
                <h3 className="form-section-title">ID Proof</h3>
                <div className="form-group">
                  <label className="form-label">ID Type</label>
                  <select name="idType" value={form.idType} onChange={handleChange} className="form-select">
                    <option value="aadhar">Aadhar Card</option>
                    <option value="pan">PAN Card</option>
                    <option value="passport">Passport</option>
                    <option value="dl">Driving Licence</option>
                  </select>
                </div>
                <FormInput label="ID Number" name="idNumber" value={form.idNumber} onChange={handleChange} onBlur={handleBlur} error={touched.idNumber && errors.idNumber} required />
              </div>
              <div className="form-group">
                <label className="form-label">Special Requests (optional)</label>
                <textarea name="specialRequests" value={form.specialRequests} onChange={handleChange} className="form-textarea" rows={3} placeholder="Any special requirements..." />
              </div>
              <label className="checkbox-label">
                <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                I agree to the <Link to="/terms-of-service" target="_blank">Terms of Service</Link> and <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>
              </label>
              <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading || !form.agreeTerms}>
                {loading ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            {room.images?.[0] && <img src={room.images[0]} alt={room.name} className="booking-summary__img" />}
            <div className="booking-summary__room">
              <strong>{room.name}</strong>
              <span>Room {room.roomNo} · Floor {room.floor}</span>
            </div>
            <div className="booking-summary__detail"><span>Type</span><span>{room.type}</span></div>
            <div className="booking-summary__detail"><span>Capacity</span><span>{room.capacity} person(s)</span></div>
            <div className="booking-summary__detail"><span>Monthly Rent</span><span>₹{room.price.toLocaleString('en-IN')}</span></div>
            {months > 0 && <>
              <div className="booking-summary__detail"><span>Duration</span><span>{months} month(s)</span></div>
              <div className="booking-summary__total"><span>Total Amount</span><span>₹{totalAmt.toLocaleString('en-IN')}</span></div>
            </>}
            <p className="booking-summary__note">⏳ Booking is subject to admin approval</p>
          </div>
        </div>
      </div>
    </div>
  );
}
