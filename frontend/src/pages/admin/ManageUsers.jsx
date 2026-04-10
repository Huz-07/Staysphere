import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import './AdminPage.css';
import './AdminExtras.css';

export default function ManageUsers() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewUser, setViewUser] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus !== 'all') params.set('status', filterStatus);
    usersAPI.getAll(params.toString())
      .then(({ users }) => setUsers(users))
      .catch(() => setError('Failed to load users.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, [filterStatus]);

  const filtered = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  const openView = async (user) => {
    setViewUser(user);
    setViewLoading(true);
    try {
      const data = await usersAPI.getById(user._id);
      setViewData(data);
    } catch { setViewData(null); }
    finally { setViewLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await usersAPI.updateStatus(id, { status: newStatus });
      fetchUsers();
      if (viewUser?._id === id) setViewUser(p => ({...p, status: newStatus}));
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await usersAPI.delete(id);
      fetchUsers();
      if (viewUser?._id === id) setViewUser(null);
    } catch (err) { alert(err.message); }
  };

  const STATUS_COLORS = { active:'#16a34a', inactive:'#64748b', suspended:'#dc2626' };

  return (
    <div className="admin-page page-enter">
      <div className="admin-page__toolbar">
        <div className="toolbar-search">
          <svg viewBox="0 0 20 20" fill="none" width="16"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-search__input" />
        </div>
        <div className="toolbar-right">
          <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:16,borderRadius:8,marginBottom:16}}>⚠️ {error}</div>}
      {loading && <div style={{textAlign:'center',padding:'60px 0',color:'#64748b'}}>Loading users...</div>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Room</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={7} style={{textAlign:'center',color:'#94a3b8',padding:40}}>No users found.</td></tr>}
              {filtered.map(u => (
                <tr key={u._id}>
                  <td><strong>{u.name}</strong></td>
                  <td style={{fontSize:13}}>{u.email}</td>
                  <td style={{fontSize:13}}>{u.phone||'–'}</td>
                  <td>{u.currentRoom ? <span className="badge badge--available">Room {u.currentRoom}</span> : <span style={{color:'#94a3b8'}}>–</span>}</td>
                  <td style={{fontSize:13}}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><span style={{background:STATUS_COLORS[u.status]+'20',color:STATUS_COLORS[u.status],padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600,textTransform:'capitalize'}}>{u.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6}}>

                      {u.status !== 'suspended' && (
                        <button className="btn btn--danger btn--sm" onClick={()=>handleStatusChange(u._id,'suspended')} disabled={actionLoading===u._id}>
                          {actionLoading===u._id ? '...' : 'Suspend'}
                        </button>
                      )}
                      {u.status === 'suspended' && (
                        <button className="btn btn--success btn--sm" onClick={()=>handleStatusChange(u._id,'active')} disabled={actionLoading===u._id}>
                          {actionLoading===u._id ? '...' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View User Modal */}
      {viewUser && (
        <Modal isOpen={true} title={`Resident – ${viewUser.name}`} onClose={()=>{setViewUser(null);setViewData(null);}}>
          {viewLoading && <p style={{color:'#64748b'}}>Loading details...</p>}
          {!viewLoading && viewData && (
            <>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                {[
                  ['Full Name',   viewData.user.name],
                  ['Email',       viewData.user.email],
                  ['Phone',       viewData.user.phone||'–'],
                  ['Status',      viewData.user.status],
                  ['Current Room',viewData.user.currentRoom||'None'],
                  ['Joined',      new Date(viewData.user.createdAt).toLocaleDateString('en-IN')],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{fontSize:12,color:'#94a3b8',marginBottom:2}}>{label}</div>
                    <div style={{fontWeight:500,textTransform:'capitalize'}}>{val}</div>
                  </div>
                ))}
              </div>
              <h4 style={{marginBottom:10}}>Booking History</h4>
              {viewData.bookings.length === 0 && <p style={{color:'#94a3b8',fontSize:14}}>No bookings found.</p>}
              {viewData.bookings.map(b => (
                <div key={b._id} style={{background:'#f8fafc',padding:'10px 14px',borderRadius:8,marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <strong style={{fontSize:14}}>#{b.bookingId} – {b.roomName}</strong>
                    <span className={`badge badge--${b.status==='confirmed'?'confirmed':b.status==='pending'?'pending':'cancelled'}`}>{b.status}</span>
                  </div>
                  <div style={{fontSize:12,color:'#64748b',marginTop:4}}>
                    Room {b.roomNo} · {new Date(b.checkIn).toLocaleDateString('en-IN')} → {new Date(b.checkOut).toLocaleDateString('en-IN')} · ₹{b.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
              <div style={{display:'flex',gap:8,marginTop:20,justifyContent:'flex-end'}}>
                {viewData.user.status !== 'suspended'
                  ? <button className="btn btn--danger" onClick={()=>handleStatusChange(viewData.user._id,'suspended')}>Suspend User</button>
                  : <button className="btn btn--success" onClick={()=>handleStatusChange(viewData.user._id,'active')}>Activate User</button>}
                <button className="btn btn--ghost" onClick={()=>handleDelete(viewData.user._id)}>Delete User</button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
