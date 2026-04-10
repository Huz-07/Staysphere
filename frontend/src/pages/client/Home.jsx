import React, { useState, useEffect } from 'react';
import RoomCard from '../../components/client/RoomCard';
import { roomsAPI } from '../../utils/api';
import './Home.css';

export default function Home() {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    roomsAPI.getAll()
      .then(({ rooms }) => setRooms(rooms))
      .catch(() => setError('Failed to load rooms. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__blob hero__blob--1"></div>
          <div className="hero__blob hero__blob--2"></div>
          <div className="hero__grid"></div>
        </div>
        <div className="container">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot"></span>
              Now accepting bookings
            </div>
            <h1 className="hero__heading">
              Your Home<br/>Away From <em className="hero__accent">Home</em>
            </h1>
            <p className="hero__sub">
              Premium PG accommodation with modern amenities, transparent pricing,
              and a community that feels like family.
            </p>
            <div className="hero__cta">
              <a href="#rooms" className="btn btn--gold btn--lg">Explore Rooms</a>
              <a href="#rooms" className="btn btn--outline btn--lg">View Floor Plans</a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>200+</strong>
                <span>Happy Residents</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <strong>50+</strong>
                <span>Premium Rooms</span>
              </div>
              <div className="hero__stat-divider"></div>
              <div className="hero__stat">
                <strong>4.8★</strong>
                <span>Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            {[
              { icon:'🏠', title:'Fully Furnished',   desc:'All rooms come with bed, cupboard, and study table.' },
              { icon:'📶', title:'High-Speed WiFi',    desc:'Seamless internet connectivity throughout the building.' },
              { icon:'🔒', title:'24/7 Security',      desc:'CCTV surveillance and secure entry for your safety.' },
              { icon:'🍽️', title:'Meals Available',    desc:'Hygienic and nutritious meals served daily.' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <span className="feature-card__icon">{f.icon}</span>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="rooms-section" id="rooms">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Rooms</h2>
            <p className="section-subtitle">Choose from our range of comfortable, affordable rooms</p>
          </div>

          {loading && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#64748b' }}>
              Loading rooms...
            </div>
          )}
          {error && (
            <div style={{
              textAlign:'center', padding:'40px', background:'#fef2f2',
              borderRadius:12, color:'#b91c1c', margin:'20px 0'
            }}>
              ⚠️ {error}
            </div>
          )}
          {!loading && !error && rooms.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#64748b' }}>
              No rooms available at the moment.
            </div>
          )}
          {!loading && !error && (
            <div className="rooms-grid">
              {rooms.map(room => (
                <RoomCard key={room._id} room={{ ...room, id: room._id }} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
