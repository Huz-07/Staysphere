import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingsAPI } from '../../utils/api';
import './MyBookings.css';

const STATUS_COLORS = {
  confirmed: '#16a34a', pending: '#d97706', cancelled: '#dc2626', completed: '#64748b',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [cancelling, setCancelling] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    bookingsAPI.getMy()
      .then(({ bookings }) => setBookings(bookings))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking request?')) return;
    setCancelling(id);
    try {
      await bookingsAPI.cancel(id, { cancelReason: 'Cancelled by resident' });
      fetchBookings();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="my-bookings page-enter"><div className="container" style={{textAlign:'center',padding:'80px 0',color:'#64748b'}}>Loading bookings...</div></div>;

  return (
    <div className="my-bookings page-enter">
      <div className="container">
        <div className="my-bookings__header">
          <h1>My Bookings</h1>
          <Link to="/" className="btn btn--primary">Book a Room</Link>
        </div>

        {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:16,borderRadius:8,marginBottom:20}}>⚠️ {error}</div>}

        {!loading && bookings.length === 0 && (
          <div className="my-bookings__empty">
            <span>📋</span>
            <h3>No Bookings Yet</h3>
            <p>You haven't made any booking requests.</p>
            <Link to="/" className="btn btn--primary">Browse Rooms</Link>
          </div>
        )}

        <div className="bookings-list">
          {bookings.map(b => (
            <div key={b._id} className="booking-card">
              <div className="booking-card__header">
                <div>
                  <span className="booking-card__id">#{b.bookingId}</span>
                  <h3 className="booking-card__room">{b.roomName}</h3>
                  <span className="booking-card__room-no">Room {b.roomNo}</span>
                </div>
                <span className="booking-card__status" style={{ background: STATUS_COLORS[b.status] + '20', color: STATUS_COLORS[b.status] }}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </div>
              <div className="booking-card__details">
                <div><label>Check-In</label><span>{new Date(b.checkIn).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
                <div><label>Check-Out</label><span>{new Date(b.checkOut).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
                <div><label>Amount</label><span>₹{b.totalAmount.toLocaleString('en-IN')}</span></div>
                <div><label>Payment</label><span style={{textTransform:'capitalize'}}>{b.paymentStatus}</span></div>
              </div>
              {b.adminNote && (
                <div className="booking-card__note">
                  <strong>Admin Note:</strong> {b.adminNote}
                </div>
              )}
              <div className="booking-card__footer">
                <span style={{fontSize:13,color:'#94a3b8'}}>
                  Submitted: {new Date(b.createdAt).toLocaleDateString('en-IN')}
                </span>
                {b.status === 'pending' && (
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleCancel(b._id)}
                    disabled={cancelling === b._id}
                  >
                    {cancelling === b._id ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
