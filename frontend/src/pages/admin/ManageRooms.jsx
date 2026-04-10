import React, { useState, useEffect } from 'react';
import { roomsAPI } from '../../utils/api';
import Modal from '../../components/common/Modal';
import './AdminPage.css';
import './AdminExtras.css';

const EMPTY_FORM = {
  name:'', roomNo:'', type:'Single', floor:1, capacity:1,
  price:'', status:'available',
  amenities:'WiFi, Fan, Bed',
  description:'', images:'',
};

export default function ManageRooms() {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchRooms = () => {
    setLoading(true);
    roomsAPI.getAll()
      .then(({ rooms }) => setRooms(rooms))
      .catch(() => setError('Failed to load rooms.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchRooms(); }, []);

  const filtered = rooms.filter(r => {
    const q = search.toLowerCase();
    const matchS = r.name.toLowerCase().includes(q) || r.roomNo.includes(q);
    const matchF = filterStatus === 'all' || r.status === filterStatus;
    return matchS && matchF;
  });

  const openAdd = () => { setEditRoom(null); setForm(EMPTY_FORM); setFormError(''); setShowForm(true); };
  const openEdit = (room) => {
    setEditRoom(room);
    setForm({
      name: room.name, roomNo: room.roomNo, type: room.type,
      floor: room.floor, capacity: room.capacity, price: room.price,
      status: room.status, amenities: room.amenities.join(', '),
      description: room.description, images: room.images.join(', '),
    });
    setFormError('');
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.roomNo || !form.price) { setFormError('Name, Room No and Price are required.'); return; }
    setSaving(true);
    setFormError('');
    try {
      const payload = {
        ...form,
        floor: Number(form.floor), capacity: Number(form.capacity), price: Number(form.price),
        amenities: form.amenities.split(',').map(a=>a.trim()).filter(Boolean),
        images:    form.images.split(',').map(i=>i.trim()).filter(Boolean),
      };
      if (editRoom) await roomsAPI.update(editRoom._id, payload);
      else          await roomsAPI.create(payload);
      setShowForm(false);
      fetchRooms();
    } catch (err) { setFormError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await roomsAPI.delete(deleteId);
      setDeleteId(null);
      fetchRooms();
    } catch (err) { alert(err.message); }
  };

  const handleToggleStatus = async (room) => {
    const newStatus = room.status === 'available' ? 'occupied' : 'available';
    try {
      await roomsAPI.update(room._id, { status: newStatus });
      fetchRooms();
    } catch (err) { alert(err.message); }
  };

  const STATUS_COLORS = { available:'#16a34a', occupied:'#dc2626', maintenance:'#d97706', reserved:'#9333ea' };

  return (
    <div className="admin-page page-enter">
      <div className="admin-page__toolbar">
        <div className="toolbar-search">
          <svg viewBox="0 0 20 20" fill="none" width="16"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <input type="text" placeholder="Search by name or room no…" value={search} onChange={e=>setSearch(e.target.value)} className="toolbar-search__input" />
        </div>
        <div className="toolbar-right">
          <select className="filter-select" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="btn btn--primary btn--sm" onClick={openAdd}>+ Add Room</button>
        </div>
      </div>

      {error && <div style={{background:'#fef2f2',color:'#b91c1c',padding:16,borderRadius:8,marginBottom:16}}>⚠️ {error}</div>}
      {loading && <div style={{textAlign:'center',padding:'60px 0',color:'#64748b'}}>Loading rooms...</div>}

      {!loading && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Room No</th><th>Name</th><th>Type</th><th>Floor</th><th>Capacity</th><th>Price/mo</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={8} style={{textAlign:'center',color:'#94a3b8',padding:40}}>No rooms found.</td></tr>}
              {filtered.map(r => (
                <tr key={r._id}>
                  <td><strong>{r.roomNo}</strong></td>
                  <td>{r.name}</td>
                  <td>{r.type}</td>
                  <td>Floor {r.floor}</td>
                  <td>{r.capacity} person(s)</td>
                  <td className="dash-table__amount">₹{r.price.toLocaleString('en-IN')}</td>
                  <td><span style={{background:STATUS_COLORS[r.status]+'20',color:STATUS_COLORS[r.status],padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600,textTransform:'capitalize'}}>{r.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      <button className="btn btn--ghost btn--sm" onClick={()=>openEdit(r)}>Edit</button>
                      {(r.status === 'available' || r.status === 'occupied') && (
                        <button
                          className={`btn btn--sm ${r.status === 'available' ? 'btn--danger' : 'btn--success'}`}
                          onClick={()=>handleToggleStatus(r)}
                        >
                          {r.status === 'available' ? 'Mark Occupied' : 'Mark Available'}
                        </button>
                      )}
                      <button className="btn btn--danger btn--sm" onClick={()=>setDeleteId(r._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <Modal isOpen={true} title={editRoom ? `Edit Room – ${editRoom.roomNo}` : 'Add New Room'} onClose={()=>setShowForm(false)}>
          {formError && <div className="form-error-banner" style={{marginBottom:12}}>⚠️ {formError}</div>}
          <form onSubmit={handleSave} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[
              ['name','Room Name','text',true],
              ['roomNo','Room Number','text',true],
              ['price','Price / Month','number',true],
              ['floor','Floor','number',false],
              ['capacity','Capacity','number',false],
            ].map(([field,label,type,req]) => (
              <div key={field} className="form-group">
                <label className="form-label">{label}{req&&' *'}</label>
                <input type={type} className="form-input" value={form[field]} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))} required={req} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                {['Single','Double','Triple','Dorm','Suite'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                {['available','occupied','maintenance','reserved'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label className="form-label">Amenities (comma-separated)</label>
              <input type="text" className="form-input" value={form.amenities} onChange={e=>setForm(p=>({...p,amenities:e.target.value}))} placeholder="WiFi, AC, Bed, Cupboard" />
            </div>
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label className="form-label">Image URLs (comma-separated)</label>
              <input type="text" className="form-input" value={form.images} onChange={e=>setForm(p=>({...p,images:e.target.value}))} placeholder="https://..." />
            </div>
            <div className="form-group" style={{gridColumn:'1/-1'}}>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
            </div>
            <div style={{gridColumn:'1/-1',display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button type="button" className="btn btn--secondary" onClick={()=>setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={saving}>{saving?'Saving...':editRoom?'Update Room':'Add Room'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal isOpen={true} title="Delete Room?" onClose={()=>setDeleteId(null)}>
          <p>Are you sure you want to delete this room? This action cannot be undone.</p>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:16}}>
            <button className="btn btn--secondary" onClick={()=>setDeleteId(null)}>Cancel</button>
            <button className="btn btn--danger" onClick={handleDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
