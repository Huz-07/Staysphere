import React, { useState, useEffect, useCallback } from 'react';
import { maintenanceAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import './AdminPage.css';
import './AdminExtras.css';
import './AdminNewPages.css';

const PRIORITY_CONFIG = {
  high:   { cls: 'badge--cancelled' },
  medium: { cls: 'badge--pending'   },
  low:    { cls: 'badge--available' },
};
const STATUS_CONFIG = {
  'open':        { badge: 'badge--cancelled' },
  'in-progress': { badge: 'badge--pending'   },
  'resolved':    { badge: 'badge--confirmed' },
};

export default function ManageMaintenance() {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filterStatus, setFilterStatus]     = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [search, setSearch]         = useState('');
  const [viewReq, setViewReq]       = useState(null);
  const [actionLoading, setActionLoading]   = useState(null);
  const [assignText, setAssignText] = useState('');

  const fetchRequests = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus !== 'all')   params.set('status',   filterStatus);
    if (filterPriority !== 'all') params.set('priority', filterPriority);
    if (search) params.set('search', search);
    maintenanceAPI.getAll(params.toString())
      .then(({ requests }) => setRequests(requests))
      .catch(() => setError('Failed to load requests.'))
      .finally(() => setLoading(false));
  }, [filterStatus, filterPriority, search]);

  useEffect(() => { fetchRequests(); }, [filterStatus, filterPriority]);

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(id + status);
    try {
      const body = { status };
      if (assignText) body.assignedTo = assignText;
      await maintenanceAPI.updateStatus(id, body);
      fetchRequests();
      setViewReq(null);
    } catch (err) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await maintenanceAPI.delete(id);
      fetchRequests();
      setViewReq(null);
    } catch (err) { alert(err.message); }
  };

  const counts = {
    all:         requests.length,
    open:        requests.filter(r=>r.status==='open').length,
    'in-progress': requests.filter(r=>r.status==='in-progress').length,
    resolved:    requests.filter(r=>r.status==='resolved').length,
  };

  return (
    <div className="admin-page page-enter">
      <div className="admin-page__toolbar">
        <div className="toolbar-search">
          <svg viewBox="0 0 20 20" fill="none" width="16"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search by resident, room or category…" value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-search__input" onKeyDown={e=>e.key==='Enter'&&fetchRequests()} />
        </div>
        <div className="toolbar-right">
          <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All ({counts.all})</option>
            <option value="open">Open ({counts.open})</option>
            <option value="in-progress">In Progress ({counts['in-progress']})</option>
            <option value="resolved">Resolved ({counts.resolved})</option>
          </select>
          <select className="filter-select" value={filterPriority} onChange={e=>setFilterPriority(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:16,borderRadius:8,marginBottom:16}}>⚠️ {error}</div>}
      {loading && <div style={{textAlign:'center',padding:'60px 0',color:'#64748b'}}>Loading requests...</div>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Resident</th><th>Room</th><th>Category</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.length === 0 && <tr><td colSpan={8} style={{textAlign:'center',color:'#94a3b8',padding:40}}>No requests found.</td></tr>}
              {requests.map(r => (
                <tr key={r._id}>
                  <td className="dash-table__id">#{r.requestId}</td>
                  <td>{r.residentName}</td>
                  <td>Room {r.roomNo}</td>
                  <td>{r.category}</td>
                  <td><span className={`badge ${PRIORITY_CONFIG[r.priority]?.cls}`}>{r.priority}</span></td>
                  <td><span className={`badge ${STATUS_CONFIG[r.status]?.badge}`}>{r.status}</span></td>
                  <td style={{fontSize:12}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <div style={{display:'flex',gap:6}}>
                      <button className="btn btn--ghost btn--sm" onClick={()=>{setViewReq(r);setAssignText(r.assignedTo||'');}}>View</button>
                      {r.status === 'open' && (
                        <button className="btn btn--primary btn--sm" onClick={()=>handleStatusUpdate(r._id,'in-progress')} disabled={!!actionLoading}>
                          Start
                        </button>
                      )}
                      {r.status === 'in-progress' && (
                        <button className="btn btn--success btn--sm" onClick={()=>handleStatusUpdate(r._id,'resolved')} disabled={!!actionLoading}>
                          Resolve
                        </button>
                      )}
                      <button className="btn btn--danger btn--sm" onClick={()=>handleDelete(r._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {viewReq && (
        <Modal isOpen={true} title={`Request #${viewReq.requestId}`} onClose={()=>setViewReq(null)}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
            {[
              ['Resident', viewReq.residentName],
              ['Room No',  viewReq.roomNo],
              ['Category', viewReq.category],
              ['Priority', viewReq.priority],
              ['Status',   viewReq.status],
              ['Date',     new Date(viewReq.createdAt).toLocaleDateString('en-IN')],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{fontSize:12,color:'#94a3b8',marginBottom:2}}>{label}</div>
                <div style={{fontWeight:500,textTransform:'capitalize'}}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#f8fafc',padding:12,borderRadius:8,marginBottom:16}}>
            <div style={{fontSize:12,color:'#94a3b8',marginBottom:4}}>Issue Description</div>
            <p style={{margin:0}}>{viewReq.issue}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Assign To (technician/team)</label>
            <input type="text" className="form-input" value={assignText} onChange={e=>setAssignText(e.target.value)} placeholder="e.g. Ramesh (Electrician)" />
          </div>
          <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
            {viewReq.status === 'open' && (
              <button className="btn btn--primary" onClick={()=>handleStatusUpdate(viewReq._id,'in-progress')} disabled={!!actionLoading}>
                {actionLoading ? '...' : 'Mark In Progress'}
              </button>
            )}
            {viewReq.status === 'in-progress' && (
              <button className="btn btn--success" onClick={()=>handleStatusUpdate(viewReq._id,'resolved')} disabled={!!actionLoading}>
                {actionLoading ? '...' : 'Mark Resolved'}
              </button>
            )}
            {viewReq.status === 'resolved' && (
              <button className="btn btn--secondary" onClick={()=>handleStatusUpdate(viewReq._id,'closed')} disabled={!!actionLoading}>Close</button>
            )}
            <button className="btn btn--danger" onClick={()=>handleDelete(viewReq._id)}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
