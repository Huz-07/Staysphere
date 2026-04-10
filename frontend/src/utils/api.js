// ── StaySphere API Utility ───────────────────────────────
// All calls go through here so base URL & auth header are handled once.

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  try {
    return localStorage.getItem('ss_token') || null;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────────
export const authAPI = {
  register:       (body) => request('/auth/register',        { method: 'POST', body: JSON.stringify(body) }),
  login:          (body) => request('/auth/login',           { method: 'POST', body: JSON.stringify(body) }),
  getMe:          ()     => request('/auth/me'),
  updateProfile:  (body) => request('/auth/update-profile',  { method: 'PUT',  body: JSON.stringify(body) }),
  changePassword: (body) => request('/auth/change-password', { method: 'PUT',  body: JSON.stringify(body) }),
};

// ── Rooms ────────────────────────────────────────────────
export const roomsAPI = {
  getAll:   (params = '') => request(`/rooms${params ? '?' + params : ''}`),
  getById:  (id)          => request(`/rooms/${id}`),
  create:   (body)        => request('/rooms',     { method: 'POST',   body: JSON.stringify(body) }),
  update:   (id, body)    => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:   (id)          => request(`/rooms/${id}`, { method: 'DELETE' }),
};

// ── Bookings ─────────────────────────────────────────────
export const bookingsAPI = {
  create:         (body)          => request('/bookings',                { method: 'POST',   body: JSON.stringify(body) }),
  getMy:          ()              => request('/bookings/my'),
  getAll:         (params = '')   => request(`/bookings${params ? '?' + params : ''}`),
  getById:        (id)            => request(`/bookings/${id}`),
  approve:        (id, body = {}) => request(`/bookings/${id}/approve`,  { method: 'PUT', body: JSON.stringify(body) }),
  cancel:         (id, body = {}) => request(`/bookings/${id}/cancel`,   { method: 'PUT', body: JSON.stringify(body) }),
  updateNote:     (id, body)      => request(`/bookings/${id}/admin-note`,{ method: 'PUT', body: JSON.stringify(body) }),
};

// ── Maintenance ──────────────────────────────────────────
export const maintenanceAPI = {
  create:       (body)        => request('/maintenance',              { method: 'POST',   body: JSON.stringify(body) }),
  getMy:        ()            => request('/maintenance/my'),
  getAll:       (params = '') => request(`/maintenance${params ? '?' + params : ''}`),
  updateStatus: (id, body)    => request(`/maintenance/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:       (id)          => request(`/maintenance/${id}`,        { method: 'DELETE' }),
};

// ── Notices ──────────────────────────────────────────────
export const noticesAPI = {
  getPublic: ()            => request('/notices/public'),
  getAll:    ()            => request('/notices'),
  create:    (body)        => request('/notices',     { method: 'POST',   body: JSON.stringify(body) }),
  update:    (id, body)    => request(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:    (id)          => request(`/notices/${id}`, { method: 'DELETE' }),
};

// ── Users (admin) ────────────────────────────────────────
export const usersAPI = {
  getAll:         (params = '') => request(`/users${params ? '?' + params : ''}`),
  getById:        (id)          => request(`/users/${id}`),
  update:         (id, body)    => request(`/users/${id}`,         { method: 'PUT',    body: JSON.stringify(body) }),
  updateStatus:   (id, body)    => request(`/users/${id}/status`,  { method: 'PUT',    body: JSON.stringify(body) }),
  delete:         (id)          => request(`/users/${id}`,         { method: 'DELETE' }),
};

// ── Reports (admin) ──────────────────────────────────────
export const reportsAPI = {
  getDashboard: () => request('/reports/dashboard'),
  getRevenue:   () => request('/reports/revenue'),
};

// ── Contact Messages ─────────────────────────────────────
export const contactAPI = {
  send:           (body)        => request('/contact',              { method: 'POST', body: JSON.stringify(body) }),
  getAll:         (params = '') => request(`/contact${params ? '?' + params : ''}`),
  getById:        (id)          => request(`/contact/${id}`),
  updateStatus:   (id, body)    => request(`/contact/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
  delete:         (id)          => request(`/contact/${id}`,        { method: 'DELETE' }),
};
