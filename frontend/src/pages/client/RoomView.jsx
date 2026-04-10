import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roomsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './RoomView.css';

export default function RoomView() {
  const { id }   = useParams();
  const { isLoggedIn } = useAuth();
  const [room, setRoom]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    roomsAPI.getById(id)
      .then(({ room }) => setRoom(room))
      .catch(() => setError('Room not found or server unavailable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{textAlign:'center',padding:'80px 0',color:'#64748b'}}>Loading room details...</div>;
  if (error || !room) return (
    <div className="room-view page-enter">
      <div className="container" style={{textAlign:'center',padding:'80px 0'}}>
        <span style={{fontSize:48}}>🏠</span>
        <h2>{error || 'Room Not Found'}</h2>
        <Link to="/" className="btn btn--primary" style={{marginTop:16,display:'inline-flex'}}>Back to Rooms</Link>
      </div>
    </div>
  );

  const roomId = room._id;
  return (
    <div className="room-view page-enter">
      <div className="container">
        <Link to="/" className="back-link">← Back to Rooms</Link>
        <div className="room-view__grid">
          <div className="room-view__gallery">
            {room.images?.[0]
              ? <img src={room.images[0]} alt={room.name} className="room-view__img" />
              : <div className="room-view__img-placeholder">🏠</div>}
          </div>
          <div className="room-view__info">
            <div className="room-view__badges">
              <span className={`badge badge--${room.status === 'available' ? 'available' : 'occupied'}`}>
                {room.status}
              </span>
              <span className="badge badge--type">{room.type}</span>
            </div>
            <h1 className="room-view__name">{room.name}</h1>
            <div className="room-view__meta">
              <span>🏢 Floor {room.floor}</span>
              <span>👥 Capacity: {room.capacity}</span>
              <span>🚪 Room No: {room.roomNo}</span>
            </div>
            {room.rating > 0 && (
              <div className="room-view__rating">
                {'⭐'.repeat(Math.round(room.rating))} {room.rating} ({room.reviews} reviews)
              </div>
            )}
            <p className="room-view__desc">{room.description}</p>
            <div className="room-view__amenities">
              <h3>Amenities</h3>
              <div className="amenities-list">
                {room.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
              </div>
            </div>
            <div className="room-view__price-box">
              <div className="room-view__price">
                ₹{room.price.toLocaleString('en-IN')}<span>/month</span>
              </div>
              {room.status === 'available' ? (
                isLoggedIn
                  ? <Link to={`/booking/${roomId}`} className="btn btn--primary btn--lg">Book Now</Link>
                  : <Link to="/login" className="btn btn--primary btn--lg">Login to Book</Link>
              ) : (
                <button className="btn btn--secondary btn--lg" disabled>Not Available</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
