import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../../utils/api';
import './AdminPage.css';
import './AdminExtras.css';
import './AdminNewPages.css';

function StatBox({ label, value, icon, color }) {
  const colors = {
    blue:   { bg:'#eff6ff', text:'#1d4ed8' },
    green:  { bg:'#f0fdf4', text:'#15803d' },
    rose:   { bg:'#fff1f2', text:'#be123c' },
    gold:   { bg:'#fffbeb', text:'#b45309' },
    purple: { bg:'#faf5ff', text:'#7e22ce' },
    teal:   { bg:'#f0fdfa', text:'#0f766e' },
  };
  const c = colors[color] || colors.blue;
  return (
    <div style={{background:c.bg,borderRadius:12,padding:'20px 24px',display:'flex',alignItems:'center',gap:16}}>
      <span style={{fontSize:32}}>{icon}</span>
      <div>
        <div style={{fontSize:13,color:'#64748b',marginBottom:2}}>{label}</div>
        <div style={{fontSize:24,fontWeight:700,color:c.text}}>{value}</div>
      </div>
    </div>
  );
}

export default function Reports() {
  const [dashboard, setDashboard] = useState(null);
  const [revenue,   setRevenue]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    Promise.all([reportsAPI.getDashboard(), reportsAPI.getRevenue()])
      .then(([d, r]) => { setDashboard(d); setRevenue(r); })
      .catch(() => setError('Failed to load reports. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-page page-enter" style={{textAlign:'center',padding:'80px 0',color:'#64748b'}}>Loading reports...</div>;
  if (error)   return <div className="admin-page page-enter"><div style={{background:'#fef2f2',color:'#b91c1c',padding:24,borderRadius:12}}>⚠️ {error}</div></div>;

  const { stats } = dashboard;
  const maxRevenue = Math.max(...(revenue?.revenueData.map(d => d.revenue) || [1]), 1);

  return (
    <div className="admin-page page-enter">
      <h2 style={{fontSize:20,fontWeight:700,marginBottom:20,color:'#1e293b'}}>Reports & Analytics</h2>

      {/* Overview stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:32}}>
        <StatBox label="Total Revenue"    value={`₹${(stats.totalRevenue/1000).toFixed(1)}k`}   icon="💰" color="green" />
        <StatBox label="Monthly Revenue"  value={`₹${(stats.monthlyRevenue/1000).toFixed(1)}k`} icon="📈" color="blue" />
        <StatBox label="Occupancy Rate"   value={`${stats.occupancyRate}%`}                      icon="📊" color="teal" />
        <StatBox label="Total Residents"  value={stats.totalUsers}                               icon="👥" color="purple" />
        <StatBox label="Active Bookings"  value={stats.activeBookings}                           icon="📋" color="gold" />
        <StatBox label="Pending Approval" value={stats.pendingBookings}                          icon="⏳" color="rose" />
        <StatBox label="Open Maintenance" value={stats.openMaintenance}                          icon="🔧" color="rose" />
        <StatBox label="Active Notices"   value={stats.activeNoticesCount}                       icon="📢" color="blue" />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
        {/* Revenue bar chart */}
        <div style={{background:'#fff',borderRadius:12,padding:24,border:'1px solid #e2e8f0'}}>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:20,color:'#1e293b'}}>Revenue – Last 6 Months</h3>
          {revenue?.revenueData.map(d => (
            <div key={d.month} style={{marginBottom:12}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#64748b',marginBottom:4}}>
                <span>{d.month}</span>
                <span style={{fontWeight:600,color:'#1e293b'}}>₹{d.revenue.toLocaleString('en-IN')} ({d.bookings} bookings)</span>
              </div>
              <div style={{background:'#f1f5f9',borderRadius:6,height:10,overflow:'hidden'}}>
                <div style={{
                  width: `${(d.revenue / maxRevenue) * 100}%`,
                  background: 'linear-gradient(90deg,#2563eb,#7c3aed)',
                  height:'100%',borderRadius:6,
                  transition:'width 0.6s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Room status breakdown */}
        <div style={{background:'#fff',borderRadius:12,padding:24,border:'1px solid #e2e8f0'}}>
          <h3 style={{fontSize:15,fontWeight:700,marginBottom:20,color:'#1e293b'}}>Room Status Breakdown</h3>
          {[
            { label:'Available',   value: stats.availableRooms,   color:'#16a34a', pct: Math.round(stats.availableRooms/stats.totalRooms*100)||0 },
            { label:'Occupied',    value: stats.occupiedRooms,    color:'#dc2626', pct: Math.round(stats.occupiedRooms/stats.totalRooms*100)||0 },
            { label:'Maintenance', value: stats.maintenanceRooms, color:'#d97706', pct: Math.round(stats.maintenanceRooms/stats.totalRooms*100)||0 },
          ].map(r => (
            <div key={r.label} style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6}}>
                <span style={{color:'#475569'}}>{r.label}</span>
                <span style={{fontWeight:600}}>{r.value} rooms ({r.pct}%)</span>
              </div>
              <div style={{background:'#f1f5f9',borderRadius:6,height:12,overflow:'hidden'}}>
                <div style={{width:`${r.pct}%`,background:r.color,height:'100%',borderRadius:6,transition:'width 0.6s ease'}} />
              </div>
            </div>
          ))}

          <div style={{marginTop:24,paddingTop:16,borderTop:'1px solid #f1f5f9'}}>
            <h4 style={{fontSize:13,fontWeight:600,color:'#64748b',marginBottom:12}}>Booking Status Summary</h4>
            {[
              { label:'Confirmed', value: stats.activeBookings,  color:'#16a34a' },
              { label:'Pending',   value: stats.pendingBookings, color:'#d97706' },
            ].map(b => (
              <div key={b.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:13,color:'#475569'}}>{b.label}</span>
                <span style={{
                  background:b.color+'20',color:b.color,
                  padding:'2px 12px',borderRadius:20,
                  fontWeight:700,fontSize:14
                }}>{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings table */}
      <div style={{background:'#fff',borderRadius:12,padding:24,border:'1px solid #e2e8f0',marginTop:24}}>
        <h3 style={{fontSize:15,fontWeight:700,marginBottom:16,color:'#1e293b'}}>Recent Confirmed Bookings</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Booking ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {dashboard.recentBookings.filter(b=>b.status==='confirmed').length === 0 && (
                <tr><td colSpan={6} style={{textAlign:'center',color:'#94a3b8',padding:24}}>No confirmed bookings yet.</td></tr>
              )}
              {dashboard.recentBookings.filter(b=>b.status==='confirmed').map(b => (
                <tr key={b._id}>
                  <td className="dash-table__id">#{b.bookingId}</td>
                  <td>{b.guestName}</td>
                  <td>{b.roomName} · Room {b.roomNo}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td className="dash-table__amount">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
