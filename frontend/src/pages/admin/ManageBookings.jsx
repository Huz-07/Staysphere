import React, { useState, useEffect, useCallback } from 'react';
import { bookingsAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import './AdminPage.css';
import './AdminExtras.css';

export default function ManageBookings() {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewBooking, setViewBooking]   = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.set('status', filterStatus);
    if (search) params.set('search', search);
    bookingsAPI.getAll(params.toString())
      .then(({ bookings }) => setBookings(bookings))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, [filterStatus, search]);

  useEffect(() => { fetchBookings(); }, [filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this booking?')) return;
    setActionLoading(id + '_approve');
    try {
      await bookingsAPI.approve(id);
      fetchBookings();
      if (viewBooking?._id === id) setViewBooking(null);
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const handleCancel = async (id) => {
    const reason = window.prompt('Reason for cancellation (optional):') ?? '';
    if (reason === null) return; // user pressed Cancel on prompt
    setActionLoading(id + '_cancel');
    try {
      await bookingsAPI.cancel(id, { cancelReason: reason });
      fetchBookings();
      if (viewBooking?._id === id) setViewBooking(null);
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="admin-page page-enter">
      <div className="admin-page__toolbar">
        <form onSubmit={handleSearch} style={{display:'flex',gap:8,flex:1}}>
          <div className="toolbar-search" style={{flex:1}}>
            <svg viewBox="0 0 20 20" fill="none" width="16"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <input type="text" placeholder="Search by booking ID, room or guest…" value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-search__input" />
          </div>
          <button type="submit" className="btn btn--secondary btn--sm">Search</button>
        </form>
        <div className="toolbar-right">
          <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All ({counts.all})</option>
            <option value="pending">Pending ({counts.pending})</option>
            <option value="confirmed">Confirmed ({counts.confirmed})</option>
            <option value="cancelled">Cancelled ({counts.cancelled})</option>
          </select>
        </div>
      </div>

      {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:16,borderRadius:8,marginBottom:16}}>⚠️ {error}</div>}
      {loading && <div style={{textAlign:'center',padding:'60px 0',color:'#64748b'}}>Loading bookings...</div>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Booking ID</th><th>Guest</th><th>Room</th><th>Check-In</th><th>Check-Out</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {bookings.length === 0 && (
                <tr><td colSpan={8} style={{textAlign:'center',color:'#94a3b8',padding:40}}>No bookings found.</td></tr>
              )}
              {bookings.map(b => (
                <tr key={b._id}>
                  <td className="dash-table__id">#{b.bookingId}</td>
                  <td>
                    <div style={{fontWeight:600}}>{b.guestName}</div>
                    <div style={{fontSize:12,color:'#94a3b8'}}>{b.user?.email}</div>
                  </td>
                  <td>
                    <div>{b.roomName}</div>
                    <div style={{fontSize:12,color:'#94a3b8'}}>Room {b.roomNo}</div>
                  </td>
                  <td>{new Date(b.checkIn).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td className="dash-table__amount">₹{b.totalAmount.toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge--${b.status==='confirmed'?'confirmed':b.status==='pending'?'pending':'cancelled'}`}>{b.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn--ghost btn--sm" onClick={()=>setViewBooking(b)}>View</button>
                      {b.status === 'pending' && (
                        <>
                          <button className="btn btn--success btn--sm" onClick={()=>handleApprove(b._id)} disabled={!!actionLoading}>
                            {actionLoading===b._id+'_approve' ? '...' : 'Approve'}
                          </button>
                          <button className="btn btn--danger btn--sm" onClick={()=>handleCancel(b._id)} disabled={!!actionLoading}>
                            {actionLoading===b._id+'_cancel' ? '...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button className="btn btn--danger btn--sm" onClick={()=>handleCancel(b._id)} disabled={!!actionLoading}>Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewBooking && (
        <Modal isOpen={true} title={`Booking #${viewBooking.bookingId}`} onClose={()=>setViewBooking(null)}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[
              ['Guest Name',    viewBooking.guestName],
              ['Email',         viewBooking.guestEmail],
              ['Phone',         viewBooking.guestPhone],
              ['Room',          `${viewBooking.roomName} (${viewBooking.roomNo})`],
              ['Check-In',      new Date(viewBooking.checkIn).toLocaleDateString('en-IN')],
              ['Check-Out',     new Date(viewBooking.checkOut).toLocaleDateString('en-IN')],
              ['Total Amount',  `₹${viewBooking.totalAmount.toLocaleString('en-IN')}`],
              ['Payment',       viewBooking.paymentStatus],
              ['Status',        viewBooking.status],
              ['ID Proof',      `${viewBooking.idProof?.type} – ${viewBooking.idProof?.number}`],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{fontSize:12,color:'#94a3b8',marginBottom:2}}>{label}</div>
                <div style={{fontWeight:500,textTransform:'capitalize'}}>{val||'–'}</div>
              </div>
            ))}
          </div>
          {viewBooking.specialRequests && (
            <div style={{marginTop:16,background:'#f8fafc',padding:12,borderRadius:8}}>
              <div style={{fontSize:12,color:'#94a3b8',marginBottom:4}}>Special Requests</div>
              <div>{viewBooking.specialRequests}</div>
            </div>
          )}
          {viewBooking.adminNote && (
            <div style={{marginTop:16,background:'#eff6ff',padding:12,borderRadius:8}}>
              <div style={{fontSize:12,color:'#94a3b8',marginBottom:4}}>Admin Note</div>
              <div>{viewBooking.adminNote}</div>
            </div>
          )}
          {viewBooking.status === 'pending' && (
            <div style={{display:'flex',gap:8,marginTop:20}}>
              <button className="btn btn--success" onClick={()=>handleApprove(viewBooking._id)} disabled={!!actionLoading}>
                {actionLoading ? '...' : '✅ Approve Booking'}
              </button>
              <button className="btn btn--danger" onClick={()=>handleCancel(viewBooking._id)} disabled={!!actionLoading}>
                {actionLoading ? '...' : '❌ Reject Booking'}
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
