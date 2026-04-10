import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, maintenanceAPI } from '../../utils/api';
import { validators, validateForm } from '../../utils/validation';
import FormInput from '../../components/common/FormInput';
import './Profile.css';

const PROFILE_RULES = {
  name:  [validators.name],
  email: [validators.email],
  phone: [validators.phone],
};
const PW_RULES = {
  currentPassword: [validators.required],
  newPassword:     [validators.password],
  confirmPassword: [(val, vals) => validators.confirmPassword(val, vals.newPassword)],
};
const MAINT_RULES = {
  category: [validators.required],
  issue:    [validators.required, validators.minLength(10)],
};

const TABS = ['info','security','bookings','complaints','notices'];

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('info');

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name||'', email: user?.email||'', phone: user?.phone||'' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});
  const [profileSaved, setProfileSaved]   = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileApiError, setProfileApiError] = useState('');

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [pwErrors, setPwErrors]   = useState({});
  const [pwTouched, setPwTouched] = useState({});
  const [pwSaved, setPwSaved]     = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwApiError, setPwApiError] = useState('');

  // Bookings
  const [bookings, setBookings]   = useState([]);
  const [bookLoading, setBookLoading] = useState(false);

  // Maintenance
  const [myRequests, setMyRequests] = useState([]);
  const [maintLoading, setMaintLoading] = useState(false);
  const [maintForm, setMaintForm] = useState({ category:'Plumbing', issue:'', priority:'medium' });
  const [maintErrors, setMaintErrors] = useState({});
  const [maintTouched, setMaintTouched] = useState({});
  const [maintSubmitting, setMaintSubmitting] = useState(false);
  const [maintSuccess, setMaintSuccess] = useState(false);
  const [maintApiError, setMaintApiError] = useState('');

  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'U';

  useEffect(() => {
    if (activeTab === 'bookings' && bookings.length === 0) {
      setBookLoading(true);
      bookingsAPI.getMy().then(({ bookings }) => setBookings(bookings)).catch(()=>{}).finally(()=>setBookLoading(false));
    }
    if (activeTab === 'complaints') {
      setMaintLoading(true);
      maintenanceAPI.getMy().then(({ requests }) => setMyRequests(requests)).catch(()=>{}).finally(()=>setMaintLoading(false));
    }
  }, [activeTab]);

  // Profile handlers
  const handleProfileChange = (e) => { setProfileForm(p=>({...p,[e.target.name]:e.target.value})); setProfileSaved(false); setProfileApiError(''); };
  const handleProfileBlur   = (e) => { setProfileTouched(p=>({...p,[e.target.name]:true})); setProfileErrors(validateForm(profileForm, PROFILE_RULES)); };
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const allT = { name:true, email:true, phone:true };
    setProfileTouched(allT);
    const errs = validateForm(profileForm, PROFILE_RULES);
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;
    setProfileLoading(true);
    const result = await updateProfile(profileForm);
    setProfileLoading(false);
    if (result.success) { setProfileSaved(true); }
    else setProfileApiError(result.error);
  };

  // Password handlers
  const handlePwChange = (e) => { setPwForm(p=>({...p,[e.target.name]:e.target.value})); setPwSaved(false); setPwApiError(''); };
  const handlePwBlur   = (e) => { setPwTouched(p=>({...p,[e.target.name]:true})); setPwErrors(validateForm(pwForm, PW_RULES)); };
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const allT = { currentPassword:true, newPassword:true, confirmPassword:true };
    setPwTouched(allT);
    const errs = validateForm(pwForm, PW_RULES);
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPwLoading(true);
    const result = await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
    setPwLoading(false);
    if (result.success) { setPwSaved(true); setPwForm({ currentPassword:'', newPassword:'', confirmPassword:'' }); }
    else setPwApiError(result.error);
  };

  // Maintenance handlers
  const handleMaintChange = (e) => { setMaintForm(p=>({...p,[e.target.name]:e.target.value})); setMaintApiError(''); };
  const handleMaintBlur   = (e) => { setMaintTouched(p=>({...p,[e.target.name]:true})); setMaintErrors(validateForm(maintForm, MAINT_RULES)); };
  const handleMaintSubmit = async (e) => {
    e.preventDefault();
    const allT = { category:true, issue:true };
    setMaintTouched(allT);
    const errs = validateForm(maintForm, MAINT_RULES);
    setMaintErrors(errs);
    if (Object.keys(errs).length) return;
    setMaintSubmitting(true);
    try {
      await maintenanceAPI.create(maintForm);
      setMaintSuccess(true);
      setMaintForm({ category:'Plumbing', issue:'', priority:'medium' });
      setMaintTouched({});
      // Refresh list
      const { requests } = await maintenanceAPI.getMy();
      setMyRequests(requests);
    } catch (err) { setMaintApiError(err.message); }
    finally { setMaintSubmitting(false); }
  };

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-sidebar__avatar">{initials}</div>
            <div className="profile-sidebar__name">{user?.name}</div>
            <div className="profile-sidebar__email">{user?.email}</div>
            {user?.currentRoom && <div className="profile-sidebar__room">🚪 Room {user.currentRoom}</div>}
            <nav className="profile-sidebar__nav">
              {[
                { key:'info',       label:'My Info',       icon:'👤' },
                { key:'security',   label:'Security',      icon:'🔒' },
                { key:'bookings',   label:'My Bookings',   icon:'📋' },
                { key:'complaints', label:'Complaints',    icon:'🔧' },
                { key:'notices',    label:'Notices',       icon:'📢' },
              ].map(t => (
                <button key={t.key} className={`profile-nav-btn${activeTab===t.key?' active':''}`} onClick={()=>setActiveTab(t.key)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="profile-content">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <div className="profile-card">
                <h2 className="profile-card__title">Personal Information</h2>
                {profileApiError && <div className="form-error-banner">⚠️ {profileApiError}</div>}
                {profileSaved && <div className="form-success-banner">✅ Profile updated successfully!</div>}
                <form onSubmit={handleProfileSubmit} noValidate>
                  <FormInput label="Full Name" name="name" value={profileForm.name} onChange={handleProfileChange} onBlur={handleProfileBlur} error={profileTouched.name && profileErrors.name} required />
                  <FormInput label="Email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} onBlur={handleProfileBlur} error={profileTouched.email && profileErrors.email} required />
                  <FormInput label="Phone" name="phone" type="tel" value={profileForm.phone} onChange={handleProfileChange} onBlur={handleProfileBlur} error={profileTouched.phone && profileErrors.phone} />
                  <button type="submit" className="btn btn--primary" disabled={profileLoading}>{profileLoading ? 'Saving...' : 'Save Changes'}</button>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="profile-card">
                <h2 className="profile-card__title">Change Password</h2>
                {pwApiError && <div className="form-error-banner">⚠️ {pwApiError}</div>}
                {pwSaved && <div className="form-success-banner">✅ Password changed successfully!</div>}
                <form onSubmit={handlePwSubmit} noValidate>
                  <FormInput label="Current Password" name="currentPassword" type="password" value={pwForm.currentPassword} onChange={handlePwChange} onBlur={handlePwBlur} error={pwTouched.currentPassword && pwErrors.currentPassword} required />
                  <FormInput label="New Password" name="newPassword" type="password" value={pwForm.newPassword} onChange={handlePwChange} onBlur={handlePwBlur} error={pwTouched.newPassword && pwErrors.newPassword} required />
                  <FormInput label="Confirm Password" name="confirmPassword" type="password" value={pwForm.confirmPassword} onChange={handlePwChange} onBlur={handlePwBlur} error={pwTouched.confirmPassword && pwErrors.confirmPassword} required />
                  <button type="submit" className="btn btn--primary" disabled={pwLoading}>{pwLoading ? 'Updating...' : 'Update Password'}</button>
                </form>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="profile-card">
                <h2 className="profile-card__title">My Booking History</h2>
                {bookLoading && <p style={{color:'#64748b'}}>Loading...</p>}
                {!bookLoading && bookings.length === 0 && <p style={{color:'#64748b'}}>No bookings found.</p>}
                {bookings.map(b => (
                  <div key={b._id} className="mini-booking-card">
                    <div className="mini-booking-card__top">
                      <strong>{b.roomName}</strong>
                      <span className={`badge badge--${b.status==='confirmed'?'confirmed':b.status==='pending'?'pending':'cancelled'}`}>{b.status}</span>
                    </div>
                    <div style={{fontSize:13,color:'#64748b',marginTop:4}}>
                      Room {b.roomNo} · {new Date(b.checkIn).toLocaleDateString('en-IN')} → {new Date(b.checkOut).toLocaleDateString('en-IN')} · ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                    {b.adminNote && <div style={{fontSize:13,color:'#0369a1',marginTop:4}}>💬 {b.adminNote}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Complaints Tab */}
            {activeTab === 'complaints' && (
              <div className="profile-card">
                <h2 className="profile-card__title">Maintenance Requests</h2>

                {/* Submit form */}
                {!maintSuccess && (
                  <form onSubmit={handleMaintSubmit} style={{marginBottom:32}} noValidate>
                    <h3 style={{fontSize:15,fontWeight:600,marginBottom:12,color:'#334155'}}>Submit New Request</h3>
                    {maintApiError && <div className="form-error-banner">⚠️ {maintApiError}</div>}
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select name="category" value={maintForm.category} onChange={handleMaintChange} className="form-select">
                        {['Plumbing','Electrical','Furniture','Housekeeping','AC/Appliance','Internet/WiFi','Security','Other'].map(c=>(
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select name="priority" value={maintForm.priority} onChange={handleMaintChange} className="form-select">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Describe the Issue *</label>
                      <textarea name="issue" value={maintForm.issue} onChange={handleMaintChange} onBlur={handleMaintBlur} className="form-textarea" rows={4} placeholder="Describe your issue in detail (at least 10 characters)..." />
                      {maintTouched.issue && maintErrors.issue && <span className="form-error">{maintErrors.issue}</span>}
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={maintSubmitting}>{maintSubmitting?'Submitting...':'Submit Request'}</button>
                  </form>
                )}
                {maintSuccess && (
                  <div className="form-success-banner" style={{marginBottom:16}}>
                    ✅ Maintenance request submitted! Admin will review it soon.
                    <button style={{marginLeft:12,background:'none',border:'none',color:'#0369a1',cursor:'pointer'}} onClick={()=>setMaintSuccess(false)}>Submit another</button>
                  </div>
                )}

                {/* History */}
                <h3 style={{fontSize:15,fontWeight:600,marginBottom:12,color:'#334155'}}>My Requests</h3>
                {maintLoading && <p style={{color:'#64748b'}}>Loading...</p>}
                {!maintLoading && myRequests.length === 0 && <p style={{color:'#64748b'}}>No maintenance requests yet.</p>}
                {myRequests.map(r => (
                  <div key={r._id} className="mini-booking-card">
                    <div className="mini-booking-card__top">
                      <strong>{r.category}</strong>
                      <span className={`badge badge--${r.status==='resolved'?'confirmed':r.status==='open'?'cancelled':'pending'}`}>{r.status}</span>
                    </div>
                    <div style={{fontSize:13,color:'#64748b',marginTop:4}}>{r.issue}</div>
                    {r.assignedTo && <div style={{fontSize:12,color:'#0369a1',marginTop:4}}>Assigned to: {r.assignedTo}</div>}
                    {r.adminNote && <div style={{fontSize:12,color:'#16a34a',marginTop:4}}>Admin: {r.adminNote}</div>}
                    <div style={{fontSize:12,color:'#94a3b8',marginTop:4}}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Notices tab placeholder */}
            {activeTab === 'notices' && (
              <div className="profile-card">
                <h2 className="profile-card__title">Notices from Admin</h2>
                <NoticesPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NoticesPanel() {
  const { noticesAPI, maintenanceAPI } = require('../../utils/api');
  const [notices, setNotices] = useState([]);
  const [maintNotices, setMaintNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      noticesAPI.getAll().then(({ notices }) => setNotices(notices)).catch(() => {}),
      maintenanceAPI.getMy().then(({ requests }) => setMaintNotices(requests)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{color:'#64748b'}}>Loading notices...</p>;

  const PRIORITY_COLORS = { urgent:'#dc2626', high:'#d97706', normal:'#2563eb', low:'#64748b', medium:'#d97706' };
  const MAINT_STATUS_COLORS = { open:'#dc2626', 'in-progress':'#d97706', resolved:'#16a34a', closed:'#64748b' };

  const hasNotices = notices.length > 0;
  const hasMaint = maintNotices.length > 0;

  if (!hasNotices && !hasMaint) return <p style={{color:'#64748b'}}>No notices at the moment.</p>;

  return (
    <div>
      {/* Admin Notices */}
      {hasNotices && (
        <>
          <h3 style={{fontSize:15,fontWeight:600,marginBottom:12,color:'#334155'}}>📢 Admin Notices</h3>
          {notices.map(n => (
            <div key={n._id} style={{borderLeft:`3px solid ${PRIORITY_COLORS[n.priority]||'#2563eb'}`, padding:'12px 16px', marginBottom:12, background:'#f8fafc', borderRadius:'0 8px 8px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <strong style={{fontSize:15}}>{n.title}</strong>
                <span style={{fontSize:12,color:PRIORITY_COLORS[n.priority],textTransform:'uppercase',fontWeight:600}}>{n.priority}</span>
              </div>
              <p style={{fontSize:14,color:'#475569',margin:0}}>{n.content}</p>
              <div style={{fontSize:12,color:'#94a3b8',marginTop:6}}>{n.category} · {new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
            </div>
          ))}
        </>
      )}

      {/* Maintenance Updates */}
      {hasMaint && (
        <>
          <h3 style={{fontSize:15,fontWeight:600,margin:'20px 0 12px',color:'#334155'}}>🔧 Maintenance Updates</h3>
          {maintNotices.map(r => (
            <div key={r._id} style={{borderLeft:`3px solid ${MAINT_STATUS_COLORS[r.status]||'#2563eb'}`, padding:'12px 16px', marginBottom:12, background:'#f8fafc', borderRadius:'0 8px 8px 0'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <strong style={{fontSize:15}}>{r.category} — #{r.requestId}</strong>
                <span style={{
                  fontSize:11, fontWeight:700, textTransform:'uppercase',
                  color:'#fff', background:MAINT_STATUS_COLORS[r.status],
                  padding:'2px 8px', borderRadius:10
                }}>{r.status}</span>
              </div>
              <p style={{fontSize:14,color:'#475569',margin:0}}>{r.issue}</p>
              {r.assignedTo && <div style={{fontSize:12,color:'#0369a1',marginTop:4}}>Assigned to: {r.assignedTo}</div>}
              {r.adminNote && <div style={{fontSize:12,color:'#16a34a',marginTop:4}}>Admin note: {r.adminNote}</div>}
              <div style={{fontSize:12,color:'#94a3b8',marginTop:6}}>
                Submitted: {new Date(r.createdAt).toLocaleDateString('en-IN')}
                {r.resolvedAt && ` · Resolved: ${new Date(r.resolvedAt).toLocaleDateString('en-IN')}`}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
