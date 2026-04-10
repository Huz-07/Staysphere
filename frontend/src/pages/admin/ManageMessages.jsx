import React, { useState, useEffect } from 'react';
import { contactAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import './AdminPage.css';
import './AdminExtras.css';
import './AdminNewPages.css';

const STATUS_CONFIG = {
  unread:  { cls: 'badge--cancelled', label: 'Unread', color: '#dc2626' },
  read:    { cls: 'badge--pending',   label: 'Read',   color: '#d97706' },
  replied: { cls: 'badge--confirmed', label: 'Replied', color: '#16a34a' },
};

export default function ManageMessages() {
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMsg, setViewMsg]       = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    const params = filterStatus !== 'all' ? `status=${filterStatus}` : '';
    contactAPI.getAll(params)
      .then(({ messages }) => setMessages(messages))
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchMessages(); }, [filterStatus]);

  const filtered = messages.filter(m => {
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q)
    );
  });

  const handleMarkRead = async (msg) => {
    try {
      await contactAPI.updateStatus(msg._id, { status: 'read' });
      fetchMessages();
      if (viewMsg && viewMsg._id === msg._id) {
        setViewMsg({ ...viewMsg, status: 'read' });
      }
    } catch (err) { alert(err.message); }
  };

  const handleMarkReplied = async (msg) => {
    try {
      await contactAPI.updateStatus(msg._id, { status: 'replied' });
      fetchMessages();
      if (viewMsg && viewMsg._id === msg._id) {
        setViewMsg({ ...viewMsg, status: 'replied' });
      }
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await contactAPI.delete(deleteId);
      setDeleteId(null);
      fetchMessages();
    } catch (err) { alert(err.message); }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="admin-page page-enter">
      {/* Header with unread badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
          📬 Contact Messages
        </h2>
        {unreadCount > 0 && (
          <span style={{
            background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700,
            padding: '2px 10px', borderRadius: 20, lineHeight: '20px',
          }}>
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="admin-page__toolbar">
        <div className="toolbar-search">
          <svg viewBox="0 0 20 20" fill="none" width="16">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, or subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="toolbar-search__input"
          />
        </div>
        <div className="toolbar-right">
          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 16, borderRadius: 8, marginBottom: 16 }}>⚠️ {error}</div>}
      {loading && <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Loading messages...</div>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>No messages found.</td></tr>
              )}
              {filtered.map(m => {
                const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.unread;
                return (
                  <tr key={m._id} style={{ fontWeight: m.status === 'unread' ? 600 : 400 }}>
                    <td style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
                      {new Date(m.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td>{m.name}</td>
                    <td style={{ fontSize: 13 }}>{m.email}</td>
                    <td>{m.subject}</td>
                    <td>
                      <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--ghost btn--sm" onClick={() => { setViewMsg(m); if (m.status === 'unread') handleMarkRead(m); }}>
                          View
                        </button>
                        <button className="btn btn--danger btn--sm" onClick={() => setDeleteId(m._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Message Modal */}
      {viewMsg && (
        <Modal isOpen={true} title={`Message from ${viewMsg.name}`} onClose={() => setViewMsg(null)}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>From</div>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{viewMsg.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Email</div>
                <div style={{ color: '#2563eb' }}>{viewMsg.email}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Phone</div>
                <div style={{ color: '#1e293b' }}>{viewMsg.phone || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Date</div>
                <div style={{ color: '#1e293b' }}>
                  {new Date(viewMsg.createdAt).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Subject</div>
              <div style={{
                fontWeight: 600, fontSize: 15, color: '#1e293b',
                padding: '8px 12px', background: '#f1f5f9', borderRadius: 8,
              }}>
                {viewMsg.subject}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Message</div>
              <div style={{
                color: '#334155', lineHeight: 1.7, padding: '12px 14px',
                background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0',
                whiteSpace: 'pre-wrap', fontSize: 14,
              }}>
                {viewMsg.message}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
              {viewMsg.status !== 'replied' && (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => handleMarkReplied(viewMsg)}
                >
                  ✅ Mark as Replied
                </button>
              )}
              <button className="btn btn--secondary btn--sm" onClick={() => setViewMsg(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal isOpen={true} title="Delete Message?" onClose={() => setDeleteId(null)}>
          <p>Are you sure you want to delete this message? This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn--secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
