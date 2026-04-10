import React from 'react';
import { Link } from 'react-router-dom';
import './RoomCard.css';

const AMENITY_ICONS = {
  'WiFi': '📶', 'AC': '❄️', 'Attached Bath': '🚿', 'Common Bath': '🚿',
  'Study Table': '📚', 'Wardrobe': '🪞', 'Balcony': '🌿', 'Mini Kitchen': '🍳',
  'Smart TV': '📺', 'Mini Fridge': '🧊', 'Fan': '🌀',
};

export default function RoomCard({ room }) {
  const isAvailable = room.status === 'available';
  const roomId = room._id || room.id;

  return (
    <article className="room-card">
      <div className="room-card__img-wrap">
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=75'}
          alt={room.name}
          className="room-card__img"
          loading="lazy"
        />
        <div className="room-card__badges">
          <span className={`badge ${isAvailable ? 'badge--available' : 'badge--occupied'}`}>
            {isAvailable ? '● Available' : '● Occupied'}
          </span>
          <span className="badge badge--gold">{room.type}</span>
        </div>
        <div className="room-card__floor">Floor {room.floor}</div>
      </div>

      <div className="room-card__body">
        <div className="room-card__top">
          <h3 className="room-card__name">{room.name}</h3>
          <div className="room-card__price">
            <span className="price-amount">₹{room.price.toLocaleString('en-IN')}</span>
            <span className="price-period">/mo</span>
          </div>
        </div>

        <div className="room-card__meta">
          <span className="meta-item">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 8a3 3 0 100-6 3 3 0 000 6zm-5 6a5 5 0 0110 0H3z" fill="currentColor"/></svg>
            Up to {room.capacity} {room.capacity === 1 ? 'person' : 'persons'}
          </span>
          <span className="meta-item">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.25"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
            Room {room.roomNo}
          </span>
          {room.rating > 0 && (
            <span className="meta-item meta-item--star">★ {room.rating} ({room.reviews})</span>
          )}
        </div>

        <div className="room-card__amenities">
          {room.amenities.slice(0, 4).map(a => (
            <span key={a} className="amenity-chip">{AMENITY_ICONS[a] || '✓'} {a}</span>
          ))}
          {room.amenities.length > 4 && (
            <span className="amenity-chip amenity-chip--more">+{room.amenities.length - 4}</span>
          )}
        </div>

        <div className="room-card__footer">
          <Link to={`/rooms/${roomId}`} className="btn btn--outline btn--sm">View Details</Link>
          {isAvailable ? (
            <Link to={`/booking/${roomId}`} className="btn btn--primary btn--sm">Book Now</Link>
          ) : (
            <button className="btn btn--sm" disabled>Unavailable</button>
          )}
        </div>
      </div>
    </article>
  );
}
