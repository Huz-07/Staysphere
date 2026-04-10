import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/admin/StatsCard';
import { reportsAPI } from '../../utils/api';
import './Dashboard.css';
import './AdminPage.css';
import './AdminExtras.css';

export default function Dashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    reportsAPI.getDashboard()
      .then(d => setData(d))
      .catch(() => setError('Failed to load dashboard. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard page-enter" style={{textAlign:'center',padding:'80px 0',color:'#64748b'}}>Loading dashboard...</div>;
  if (error)   return <div className="dashboard page-enter"><div style={{background:'#fef2f2',color:'#b91c1c',padding:24,borderRadius:12,margin:24}}>⚠️ {error}</div></div>;

  const { stats, recentBookings, recentMaintenance } = data;

  return (
    <div className="dashboard page-enter">
      <div className="dashboard__stats">
        <StatsCard label="Total Rooms"      value={stats.totalRooms}      color="blue"   icon="🏠" trend="up" trendValue="Live from DB" />
        <StatsCard label="Available Rooms"  value={stats.availableRooms}  color="green"  icon="✅" />
        <StatsCard label="Occupied Rooms"   value={stats.occupiedRooms}   color="rose"   icon="🔑" />
        <StatsCard label="Total Residents"  value={stats.totalUsers}       color="teal"   icon="👥" />
        <StatsCard label="Active Bookings"  value={stats.activeBookings}  color="purple" icon="📋" />
        <StatsCard label="Pending Approval" value={stats.pendingBookings} color="gold"   icon="⏳" />
        <StatsCard label="Monthly Revenue"  value={`₹${(stats.monthlyRevenue/1000).toFixed(1)}k`} color="green" trend="up" trendValue="This month" icon="💰" />
        <StatsCard label="Occupancy Rate"   value={`${stats.occupancyRate}%`} color="blue" icon="📊" />
        <StatsCard label="Unread Messages"  value={stats.unreadMessages || 0} color="rose" icon="📬" />
      </div>

      <div className="dashboard__grid">
        {/* Recent Bookings */}
        <div className="dash-card">
          <div className="dash-card__header">
            <h3>Recent Bookings</h3>
            <Link to="/admin/bookings" className="dash-card__link">View All →</Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>ID</th><th>Room</th><th>Guest</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign:'center',color:'#94a3b8',padding:24}}>No bookings yet</td></tr>
                )}
                {recentBookings.map(b => (
                  <tr key={b._id}>
                    <td className="dash-table__id">#{b.bookingId}</td>
                    <td>
                      <div className="dash-table__room-name">{b.roomName}</div>
                      <div className="dash-table__room-no">Room {b.roomNo}</div>
                    </td>
                    <td>{b.guestName}</td>
                    <td className="dash-table__amount">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                    <td><span className={`badge badge--${b.status==='confirmed'?'confirmed':b.status==='pending'?'pending':'cancelled'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Maintenance */}
        <div className="dash-card">
          <div className="dash-card__header">
            <h3>Recent Maintenance</h3>
            <Link to="/admin/maintenance" className="dash-card__link">View All →</Link>
          </div>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>ID</th><th>Resident</th><th>Category</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {recentMaintenance.length === 0 && (
                  <tr><td colSpan={5} style={{textAlign:'center',color:'#94a3b8',padding:24}}>No requests yet</td></tr>
                )}
                {recentMaintenance.map(r => (
                  <tr key={r._id}>
                    <td className="dash-table__id">#{r.requestId}</td>
                    <td>{r.residentName}</td>
                    <td>{r.category}</td>
                    <td><span className={`badge badge--${r.priority==='high'?'cancelled':r.priority==='medium'?'pending':'available'}`}>{r.priority}</span></td>
                    <td><span className={`badge badge--${r.status==='resolved'?'confirmed':r.status==='open'?'cancelled':'pending'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
