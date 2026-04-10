# 🏠 StaySphere – Hostel & PG Management Portal

> Advanced Web Technology University Project  
> Design and Development of a Secured Full-Stack Web Application using MERN Stack

---

## 📋 Project Overview

**StaySphere** is a full-stack web application for managing hostel and paying-guest (PG) accommodations. This repository contains the **complete React frontend** for Phase 1, structured and ready for MongoDB + Express.js backend integration in Phase 2.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/staysphere.git
cd staysphere

# Install dependencies
npm install

# Start development server
npm start
```

App runs at **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role      | Email                     | Password    |
|-----------|---------------------------|-------------|
| Resident  | arjun@email.com           | Test@1234   |
| Admin     | admin@staysphere.com      | Admin@123   |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared: Navbar, Footer, FormInput, Modal
│   ├── client/          # Client: RoomCard, BookingCard
│   └── admin/           # Admin: AdminSidebar, AdminHeader, StatsCard
├── pages/
│   ├── client/          # Home, Login, Register, RoomView, Booking, MyBookings, Profile
│   └── admin/           # AdminLogin, Dashboard, ManageRooms, ManageUsers, ManageBookings
├── layouts/
│   ├── ClientLayout.jsx # Navbar + Footer wrapper
│   └── AdminLayout.jsx  # Sidebar + Header wrapper
├── routes/
│   ├── ProtectedRoute.jsx   # Auth guard for residents
│   └── AdminRoute.jsx       # Auth guard for admins
├── context/
│   └── AuthContext.jsx  # Global auth state (mock → replace with JWT)
├── hooks/
│   ├── useForm.jsx      # Reusable form state + validation
│   └── useLocalStorage.jsx
└── utils/
    ├── mockData.jsx     # Mock rooms, bookings, users (→ replace with API)
    └── validation.jsx   # All form validators
```

---

## ✨ Features Implemented

### Client Side
- ✅ Home page with room listings, search, filter, sort
- ✅ Room detail page with image gallery
- ✅ Booking form with full JS validation
- ✅ My Bookings page with cancel functionality
- ✅ Profile page with edit + password change + stats
- ✅ Login & Register with validation
- ✅ Protected routes (redirect if not logged in)

### Admin Panel
- ✅ Secure Admin Login (separate from resident login)
- ✅ Dashboard with 8 stats cards + tables
- ✅ Manage Rooms – CRUD with modal forms + validation
- ✅ Manage Users – view, edit, toggle status, delete
- ✅ Manage Bookings – confirm, cancel, view details

### Technical
- ✅ React Router v6 with nested routes
- ✅ Role-based route protection
- ✅ Reusable component architecture
- ✅ JavaScript form validation (no external library)
- ✅ Password strength indicator
- ✅ Fully responsive design (mobile + tablet + desktop)
- ✅ CSS variables for consistent theming
- ✅ Page animations and transitions

---

## 🔮 Phase 2 – Backend Integration Checklist

When adding Node.js + Express + MongoDB:

- [ ] Replace `src/utils/mockData.jsx` with Axios API calls
- [ ] Replace `AuthContext` mock login with `/api/auth/login` JWT endpoint
- [ ] Connect `Booking.jsx` form submit to `POST /api/bookings`
- [ ] Connect Room CRUD in `ManageRooms.jsx` to `/api/rooms`
- [ ] Add `.env` file with `REACT_APP_API_URL=http://localhost:5000`
- [ ] Install `axios`: `npm install axios`
- [ ] Create `src/utils/api.jsx` as the Axios instance

---

## 🛠 Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, React Router v6     |
| Styling   | Pure CSS with CSS Variables   |
| Auth      | Context API (→ JWT)           |
| State     | useState, useContext          |
| Validation| Custom JS validators          |
| Database  | MongoDB (Phase 2)             |
| Backend   | Node.js + Express (Phase 2)   |

---

## 📌 Validation Rules

All forms use the `validators` utility (`src/utils/validation.jsx`):

- **Name** – letters & spaces only, min 2 chars
- **Email** – standard email regex
- **Password** – min 8 chars, uppercase, lowercase, number, special char
- **Phone** – 10-digit Indian mobile (starts with 6–9)
- **Dates** – check-out must be after check-in; check-in must be today or future

---

## 📸 Pages

| Page           | Route                  | Access    |
|----------------|------------------------|-----------|
| Home           | `/`                    | Public    |
| Room Detail    | `/rooms/:id`           | Public    |
| Login          | `/login`               | Public    |
| Register       | `/register`            | Public    |
| Booking        | `/booking/:id`         | Auth only |
| My Bookings    | `/my-bookings`         | Auth only |
| Profile        | `/profile`             | Auth only |
| Admin Login    | `/admin/login`         | Public    |
| Admin Dashboard| `/admin/dashboard`     | Admin only|
| Manage Rooms   | `/admin/rooms`         | Admin only|
| Manage Users   | `/admin/users`         | Admin only|
| Manage Bookings| `/admin/bookings`      | Admin only|

---

## 👨‍💻 Author

**University Project** – Advanced Web Technology  
Subject: Design and Development of a Secured Full-Stack Web Application using MERN Stack

---

## 📄 License

MIT – For educational purposes.
