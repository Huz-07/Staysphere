import React from 'react';
import './BookingCard.css';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', cls: 'badge--confirmed' },
  pending:   { label: 'Pending',   cls: 'badge--pending'   },
  cancelled: { label: 'Cancelled', cls: 'badge--cancelled'  },
};

export default function BookingCard({ booking, onCancel }) {
  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

  return (
    <div className={`booking-card booking-card--${booking.status}`}>
      <div className="booking-card__header">
        <div>
          <div className="booking-card__id">#{booking.id}</div>
          <h3 className="booking-card__room">{booking.roomName}</h3>
          <div className="booking-card__room-no">Room {booking.roomNo}</div>
        </div>
        <span className={`badge ${status.cls}`}>{status.label}</span>
      </div>

      <div className="booking-card__dates">
        <div className="date-block">
          <span className="date-label">Check-in</span>
          <span className="date-value">{new Date(booking.checkIn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="date-arrow">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div className="date-block">
          <span className="date-label">Check-out</span>
          <span className="date-value">{new Date(booking.checkOut).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="booking-card__footer">
        <div className="booking-card__amount">
          <span className="amount-label">Total Amount</span>
          <span className="amount-value">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="booking-card__actions">
          <span className={`payment-badge payment-badge--${booking.paymentStatus}`}>
            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
          </span>
          {booking.status === 'confirmed' || booking.status === 'pending' ? (
            <button
              className="btn btn--danger btn--sm"
              onClick={() => onCancel && onCancel(booking.id)}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
