import React, { useState, useEffect } from 'react';
import { noticesAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import './AdminPage.css';
import './AdminExtras.css';
import './AdminNewPages.css';

const PRIORITY_CONFIG = {
  urgent: { cls: 'badge--cancelled', label: 'Urgent' },
  high:   { cls: 'badge--pending',   label: 'High'   },
  normal: { cls: 'badge--confirmed', label: 'Normal' },
  low:    { cls: 'badge--available', label: 'Low'    },
};

const EMPTY_FORM = {
  title: '', content: '', category: 'General',
  priority: 'normal', targetAudience: 'all', isActive: true, expiresAt: '',
};

export default function ManageNotices() {
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId]   = useState(null);

  const fetchNotices = () => {
    setLoading(true);
    noticesAPI.getAll()
      .then(({ notices }) => setNotices(notices))
      .catch(() => setError('Failed to load notices.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchNotices(); }, []);

  const filtered = notices.filter(n => {
    const q = search.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
  });

  const openAdd = () => {
    setEditNotice(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (notice) => {
    setEditNotice(notice);
    setForm({
      title:          notice.title,
      content:        notice.content,
      category:       notice.category,
      priority:       notice.priority,
      targetAudience: notice.targetAudience,
      isActive:       notice.isActive,
      expiresAt:      notice.expiresAt ? notice.expiresAt.split('T')[0] : '',
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and Content are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form, expiresAt: form.expiresAt || null };
      if (editNotice) await noticesAPI.update(editNotice._id, payload);
      else            await noticesAPI.create(payload);
      setShowForm(false);
      fetchNotices();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (notice) => {
    try {
      await noticesAPI.update(notice._id, { isActive: !notice.isActive });
      fetchNotices();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await noticesAPI.delete(deleteId);
      setDeleteId(null);
      fetchNotices();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="admin-page page-enter">
      {/* Toolbar */}
      <div className="admin-page__toolbar">
        <div className="toolbar-search">
          <svg viewBox="0 0 20 20" fill="none" width="16">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by title or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="toolbar-search__input"
          />
        </div>
        <div className="toolbar-right">
          <button className="btn btn--primary btn--sm" onClick={openAdd}>+ New Notice</button>
        </div>
      </div>

      {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:16,borderRadius:8,marginBottom:16}}>⚠️ {error}</div>}
      {loading && <div style={{textAlign:'center',padding:'60px 0',color:'#64748b'}}>Loading notices...</div>}

      {!loading && (
        <div className="notices-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:16,marginTop:8}}>
          {filtered.length === 0 && (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'#94a3b8'}}>
              No notices found. Click "+ New Notice" to create one.
            </div>
          )}
          {filtered.map(n => (
            <div key={n._id} className="notice-card" style={{
              background:'#fff', borderRadius:12, padding:20,
              border:`1px solid #e2e8f0`,
              borderLeft: `4px solid ${n.priority==='urgent'?'#dc2626':n.priority==='high'?'#d97706':n.priority==='normal'?'#2563eb':'#94a3b8'}`,
              opacity: n.isActive ? 1 : 0.55,
            }}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  <span className={`badge ${PRIORITY_CONFIG[n.priority]?.cls}`}>{n.priority}</span>
                  <span className="badge badge--available">{n.category}</span>
                  {!n.isActive && <span className="badge badge--cancelled">Inactive</span>}
                </div>
                <div style={{display:'flex',gap:4}}>
                  <button className="btn btn--ghost btn--sm" onClick={()=>openEdit(n)}>✏️</button>
                  <button className="btn btn--ghost btn--sm" onClick={()=>handleToggleActive(n)} title={n.isActive?'Deactivate':'Activate'}>
                    {n.isActive ? '🔇' : '📢'}
                  </button>
                  <button className="btn btn--ghost btn--sm" onClick={()=>setDeleteId(n._id)} title="Delete">🗑️</button>
                </div>
              </div>
              <h3 style={{fontSize:15,fontWeight:700,margin:'0 0 6px',color:'#1e293b'}}>{n.title}</h3>
              <p style={{fontSize:13,color:'#475569',margin:'0 0 10px',lineHeight:1.5}}>
                {n.content.length > 120 ? n.content.slice(0, 120) + '…' : n.content}
              </p>
              <div style={{fontSize:12,color:'#94a3b8',display:'flex',justifyContent:'space-between'}}>
                <span>By {n.postedByName}</span>
                <span>{new Date(n.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              {n.expiresAt && (
                <div style={{fontSize:12,color:'#d97706',marginTop:4}}>
                  Expires: {new Date(n.expiresAt).toLocaleDateString('en-IN')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <Modal isOpen={true} title={editNotice ? 'Edit Notice' : 'Create New Notice'} onClose={() => setShowForm(false)}>
          {formError && <div className="form-error-banner" style={{marginBottom:12}}>⚠️ {formError}</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input type="text" className="form-input" value={form.title}
                onChange={e => setForm(p=>({...p, title: e.target.value}))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className="form-textarea" rows={4} value={form.content}
                onChange={e => setForm(p=>({...p, content: e.target.value}))} required />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category}
                  onChange={e => setForm(p=>({...p, category: e.target.value}))}>
                  {['General','Maintenance','Payment','Rules','Event','Emergency'].map(c =>
                    <option key={c} value={c}>{c}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-select" value={form.priority}
                  onChange={e => setForm(p=>({...p, priority: e.target.value}))}>
                  {['low','normal','high','urgent'].map(p =>
                    <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Expires On (optional)</label>
                <input type="date" className="form-input" value={form.expiresAt}
                  onChange={e => setForm(p=>({...p, expiresAt: e.target.value}))} />
              </div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:8,paddingTop:28}}>
                <input type="checkbox" id="isActive" checked={form.isActive}
                  onChange={e => setForm(p=>({...p, isActive: e.target.checked}))} />
                <label htmlFor="isActive" style={{margin:0,cursor:'pointer'}}>Active (visible to residents)</label>
              </div>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
              <button type="button" className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : editNotice ? 'Update Notice' : 'Post Notice'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <Modal isOpen={true} title="Delete Notice?" onClose={() => setDeleteId(null)}>
          <p>This notice will be permanently deleted and removed from resident view.</p>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
            <button className="btn btn--secondary" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
