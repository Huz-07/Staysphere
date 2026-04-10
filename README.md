# 🏠 StaySphere — Full-Stack PG Management System

A complete, production-ready PG (Paying Guest) accommodation management system with:
- **React** frontend (your original UI, fully preserved)
- **Node.js + Express** REST API backend
- **MongoDB** database (works with MongoDB Compass)
- **JWT** authentication + **bcrypt** password hashing
- **Role-based access control** (Admin & Resident)

---

## 📁 Project Structure

```
staysphere/
├── frontend/          ← React app (your original UI + API integration)
│   ├── src/
│   │   ├── context/AuthContext.jsx   ← JWT-based auth (replaces mock)
│   │   ├── utils/api.js              ← All API calls centralised here
│   │   ├── pages/client/             ← Home, Booking, MyBookings, Profile...
│   │   └── pages/admin/              ← Dashboard, ManageRooms, ManageBookings...
│   └── .env                          ← REACT_APP_API_URL
│
└── backend/           ← Express REST API
    ├── config/db.js           ← MongoDB connection
    ├── models/                ← User, Room, Booking, Maintenance, Notice
    ├── controllers/           ← Business logic
    ├── routes/                ← API routes
    ├── middleware/            ← JWT protect, adminOnly, errorHandler
    ├── server.js              ← Entry point + DB seed
    └── .env                   ← MongoDB URI, JWT secret
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js v16+
- MongoDB running locally (via MongoDB Compass or `mongod`)

### Step 1 — Start MongoDB
Open **MongoDB Compass** and connect to `mongodb://localhost:27017`
(The database `staysphere` will be created automatically on first run)

### Step 2 — Setup Backend

```bash
cd staysphere/backend
npm install
npm run dev
```

Backend starts at: **http://localhost:5000**

On first run it automatically seeds:
- ✅ Admin user: `admin@staysphere.com` / `Admin@123`
- ✅ 6 sample rooms

### Step 3 — Setup Frontend

```bash
cd staysphere/frontend
npm install
npm start
```

Frontend starts at: **http://localhost:3000**

---

## 🔑 Login Credentials

| Role     | Email                    | Password    |
|----------|--------------------------|-------------|
| Admin    | admin@staysphere.com     | Admin@123   |
| Resident | Register a new account   | Your choice |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint                    | Access    |
|--------|-----------------------------|-----------|
| POST   | /api/auth/register          | Public    |
| POST   | /api/auth/login             | Public    |
| GET    | /api/auth/me                | Protected |
| PUT    | /api/auth/update-profile    | Protected |
| PUT    | /api/auth/change-password   | Protected |

### Rooms
| Method | Endpoint        | Access    |
|--------|-----------------|-----------|
| GET    | /api/rooms      | Public    |
| GET    | /api/rooms/:id  | Public    |
| POST   | /api/rooms      | Admin     |
| PUT    | /api/rooms/:id  | Admin     |
| DELETE | /api/rooms/:id  | Admin     |

### Bookings
| Method | Endpoint                     | Access    |
|--------|------------------------------|-----------|
| POST   | /api/bookings                | Resident  |
| GET    | /api/bookings/my             | Resident  |
| GET    | /api/bookings                | Admin     |
| PUT    | /api/bookings/:id/approve    | Admin     |
| PUT    | /api/bookings/:id/cancel     | Both      |

### Maintenance
| Method | Endpoint                        | Access    |
|--------|---------------------------------|-----------|
| POST   | /api/maintenance                | Resident  |
| GET    | /api/maintenance/my             | Resident  |
| GET    | /api/maintenance                | Admin     |
| PUT    | /api/maintenance/:id/status     | Admin     |

### Notices
| Method | Endpoint            | Access    |
|--------|---------------------|-----------|
| GET    | /api/notices/public | Public    |
| GET    | /api/notices        | Protected |
| POST   | /api/notices        | Admin     |
| PUT    | /api/notices/:id    | Admin     |
| DELETE | /api/notices/:id    | Admin     |

### Reports (Admin only)
| Method | Endpoint               |
|--------|------------------------|
| GET    | /api/reports/dashboard |
| GET    | /api/reports/revenue   |

---

## ✅ Key Features

### Resident Flow
1. Register → JWT issued → logged in
2. Browse rooms → click Book Now
3. Fill booking form → submitted as **Pending**
4. Admin approves/rejects → status updates in **My Bookings**
5. Submit maintenance complaints → Admin assigns & resolves
6. View notices posted by Admin
7. Update profile & change password

### Admin Flow
1. Login at `/admin/login`
2. **Dashboard** — live stats from MongoDB (rooms, bookings, revenue, occupancy)
3. **Manage Rooms** — Add/Edit/Delete rooms, change status
4. **Manage Bookings** — Approve or Reject pending bookings
5. **Manage Users** — View all residents, their bookings, suspend/activate
6. **Manage Maintenance** — Assign technicians, update resolution status
7. **Manage Notices** — Post/edit/deactivate notices with priority levels
8. **Reports** — Revenue charts (last 6 months), occupancy breakdown

### Data Sync (100% accurate)
- When admin **approves** a booking → room status → `occupied`, user gets `currentRoom`
- When admin **cancels** a booking → room status → `available`, user `currentRoom` cleared
- When user **cancels** pending booking → instantly removed from admin view
- Maintenance requests submitted by user → immediately visible in admin panel
- Notices posted by admin → instantly visible on resident profile

---

## 🔒 Security
- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT** tokens (7-day expiry) stored in localStorage
- All admin routes protected by `adminOnly` middleware
- Suspended accounts blocked at middleware level
- Input validation on both frontend and backend

---

## 🛠️ Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/staysphere
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@staysphere.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```
