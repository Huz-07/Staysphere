# 🏠 StaySphere — Full-Stack PG Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v16%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A production-ready MERN-stack Paying Guest (PG) accommodation management platform with dual portals for residents and administrators.**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Default Credentials](#-default-credentials)
- [Features](#-features)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Environment Variables](#-environment-variables)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

StaySphere is a comprehensive PG (Paying Guest) management system designed to streamline the entire accommodation lifecycle — from room browsing and booking to maintenance requests and admin analytics. It features two distinct portals:

- **Resident Portal** — Browse rooms, book stays, track bookings, submit maintenance requests, view notices, and manage profile/settings.
- **Admin Portal** — Full management dashboard with live statistics, room/booking/user management, maintenance tracking, notice broadcasting, contact message handling, and revenue/occupancy reports.

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework (SPA with component-based architecture) |
| React Router DOM | 6.22 | Client-side routing with nested layouts |
| React Scripts | 5.0.1 | Build tooling (Create React App) |
| Vanilla CSS | — | Custom styling with modular CSS files per component |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 16+ | Runtime environment |
| Express | 4.18 | REST API framework |
| Mongoose | 8.0 | MongoDB ODM with schema validation |
| bcryptjs | 2.4 | Password hashing (12 salt rounds) |
| jsonwebtoken | 9.0 | JWT-based authentication |
| express-validator | 7.0 | Request body validation |
| morgan | 1.10 | HTTP request logging (dev mode) |
| cors | 2.8 | Cross-origin resource sharing |
| dotenv | 16.3 | Environment variable management |
| nodemon | 3.0 | Auto-restart on file changes (dev) |

### Database
| Technology | Purpose |
|---|---|
| MongoDB | NoSQL document database (local via MongoDB Compass or `mongod`) |

---

## 📁 Project Structure

```
staysphere/
├── .editorconfig                  ← Editor formatting rules (2-space indent)
├── .gitignore                     ← Git exclusions (node_modules, .env, builds)
├── CONTRIBUTING.md                ← Contributor guidelines
├── LICENSE                        ← MIT License
├── README.md                      ← This file
│
├── backend/                       ← Express REST API
│   ├── config/
│   │   └── db.js                  ← MongoDB connection (Mongoose)
│   ├── controllers/
│   │   ├── authController.js      ← Register, login, profile, password
│   │   ├── bookingController.js   ← CRUD + approve/cancel bookings
│   │   ├── contactController.js   ← Contact form message management
│   │   ├── maintenanceController.js ← Maintenance request handling
│   │   ├── noticeController.js    ← Notice CRUD + public endpoint
│   │   ├── reportController.js    ← Dashboard stats & revenue reports
│   │   ├── roomController.js      ← Room CRUD operations
│   │   └── userController.js      ← Admin user management
│   ├── middleware/
│   │   ├── auth.js                ← JWT protect, adminOnly, residentOnly
│   │   └── errorHandler.js        ← Global error handler
│   ├── models/
│   │   ├── Booking.js             ← Booking schema (auto-generated IDs)
│   │   ├── ContactMessage.js      ← Contact form submissions
│   │   ├── Maintenance.js         ← Maintenance request schema
│   │   ├── Notice.js              ← Admin notice/announcement schema
│   │   ├── Room.js                ← Room schema with amenities & occupants
│   │   └── User.js                ← User schema with bcrypt hashing
│   ├── routes/
│   │   ├── auth.js                ← /api/auth/*
│   │   ├── bookings.js            ← /api/bookings/*
│   │   ├── contact.js             ← /api/contact/*
│   │   ├── maintenance.js         ← /api/maintenance/*
│   │   ├── notices.js             ← /api/notices/*
│   │   ├── reports.js             ← /api/reports/*
│   │   ├── rooms.js               ← /api/rooms/*
│   │   └── users.js               ← /api/users/*
│   ├── resetDB.js                 ← Database reset utility script
│   ├── server.js                  ← App entry point + DB seed logic
│   ├── .env.example               ← Environment variable template
│   └── package.json
│
└── frontend/                      ← React SPA (Create React App)
    ├── public/                    ← Static assets & index.html
    ├── src/
    │   ├── components/
    │   │   ├── admin/             ← AdminHeader, AdminSidebar, StatsCard
    │   │   ├── client/            ← RoomCard, BookingCard
    │   │   └── common/            ← Navbar, Footer, FormInput, Modal
    │   ├── context/
    │   │   └── AuthContext.jsx    ← JWT auth state (login, logout, register)
    │   ├── hooks/
    │   │   ├── useForm.jsx        ← Reusable form state management
    │   │   └── useLocalStorage.jsx ← localStorage persistence hook
    │   ├── layouts/
    │   │   ├── AdminLayout.jsx    ← Admin sidebar + header layout
    │   │   └── ClientLayout.jsx   ← Navbar + footer layout
    │   ├── pages/
    │   │   ├── admin/             ← Dashboard, ManageRooms, ManageUsers,
    │   │   │                         ManageBookings, ManageNotices,
    │   │   │                         ManageMaintenance, ManageMessages,
    │   │   │                         Reports, AdminLogin
    │   │   └── client/            ← Home, RoomView, Booking, MyBookings,
    │   │                             Profile, Login, Register, FAQ,
    │   │                             ContactUs, PrivacyPolicy, TermsOfService
    │   ├── routes/
    │   │   ├── AdminRoute.jsx     ← Admin-only route guard
    │   │   └── ProtectedRoute.jsx ← Auth-required route guard
    │   ├── utils/
    │   │   ├── api.js             ← Centralised API call functions
    │   │   ├── mockData.jsx       ← Fallback mock data
    │   │   └── validation.jsx     ← Client-side form validation
    │   ├── App.jsx                ← Root component with all route definitions
    │   ├── index.jsx              ← React DOM entry point
    │   └── index.css              ← Global styles & design system
    ├── .env.example               ← Frontend env template
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** running locally (via [MongoDB Compass](https://www.mongodb.com/products/compass) or the `mongod` daemon)
- **npm** (comes with Node.js)

### Step 1 — Start MongoDB

Open **MongoDB Compass** and connect to:
```
mongodb://localhost:27017
```
> The `staysphere` database will be created automatically on first run.

### Step 2 — Setup Backend

```bash
cd backend
npm install
npm run dev
```

✅ Backend starts at: **http://localhost:5000**

On first startup, the server automatically seeds:
- 🔐 **Admin account**: `admin@staysphere.com` / `Admin@123`
- 🛏️ **6 sample rooms**: Single (AC/Non-AC), Double (AC/Non-AC), Triple, and Dorm

### Step 3 — Setup Frontend

```bash
cd frontend
npm install
npm start
```

✅ Frontend starts at: **http://localhost:3000**

> **Note**: Both servers must be running simultaneously. The frontend proxies API calls to `http://localhost:5000/api`.

---

## 🔑 Default Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| Admin | `admin@staysphere.com` | `Admin@123` | `/admin/login` → Admin Dashboard |
| Resident | Register a new account | Your choice | `/register` → Resident Portal |

---

## ✨ Features

### 🏡 Resident Portal

| Feature | Description |
|---|---|
| **Home & Room Browsing** | Browse all available rooms with images, amenities, ratings, and pricing |
| **Room Details** | View detailed room info — type, floor, capacity, amenities, description |
| **Online Booking** | Book rooms with check-in/out dates, guest info, ID proof, and special requests |
| **My Bookings** | Track all bookings with real-time status updates (Pending → Confirmed/Cancelled) |
| **Maintenance Requests** | Submit complaints by category (Plumbing, Electrical, AC, WiFi, etc.) with priority levels |
| **Notices & Announcements** | View notices posted by admin with category and priority indicators |
| **Profile Management** | Update personal info, address, emergency contact, and ID proof details |
| **Password Change** | Securely change password from profile settings |
| **Contact Us** | Submit inquiries via contact form (name, email, phone, subject, message) |
| **Info Pages** | FAQ, Privacy Policy, and Terms of Service pages |

### 🛡️ Admin Portal

| Feature | Description |
|---|---|
| **Dashboard** | Live statistics — total rooms, active bookings, revenue, occupancy rate (data from MongoDB) |
| **Manage Rooms** | Create, edit, and delete rooms; update status (available/occupied/maintenance/reserved) |
| **Manage Bookings** | View all bookings, approve or reject pending requests, add admin notes |
| **Manage Users** | View all residents, see their booking history, suspend/activate/delete accounts |
| **Manage Maintenance** | View all requests, assign technicians, update status (open → in-progress → resolved → closed) |
| **Manage Notices** | Create/edit/delete notices with categories (General, Maintenance, Payment, Rules, Event, Emergency) and priority levels (low/normal/high/urgent) |
| **Manage Messages** | View/reply to contact form submissions, mark as read/replied, delete messages |
| **Reports** | Revenue charts (last 6 months) and room occupancy breakdown |

### 🔄 Real-Time Data Sync

- Booking **approved** → room status becomes `occupied`, resident gets `currentRoom` assigned
- Booking **cancelled** → room status reverts to `available`, resident `currentRoom` cleared
- Resident **cancels** pending booking → instantly removed from admin view
- Maintenance requests → immediately visible in admin panel upon submission
- Notices posted by admin → instantly visible on resident profile
- Contact messages → appear in admin Messages panel in real time

---

## 🌐 API Reference

**Base URL**: `http://localhost:5000/api`

All protected routes require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new resident account |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/auth/me` | Protected | Get current user profile |
| `PUT` | `/api/auth/update-profile` | Protected | Update profile details |
| `PUT` | `/api/auth/change-password` | Protected | Change password |

### Rooms (`/api/rooms`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/rooms` | Public | List all rooms |
| `GET` | `/api/rooms/:id` | Public | Get room details by ID |
| `POST` | `/api/rooms` | Admin | Create a new room |
| `PUT` | `/api/rooms/:id` | Admin | Update room details |
| `DELETE` | `/api/rooms/:id` | Admin | Delete a room |

### Bookings (`/api/bookings`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Protected | Create a new booking |
| `GET` | `/api/bookings/my` | Protected | Get current user's bookings |
| `GET` | `/api/bookings` | Admin | Get all bookings |
| `GET` | `/api/bookings/:id` | Protected | Get booking by ID |
| `PUT` | `/api/bookings/:id/approve` | Admin | Approve a pending booking |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel a booking |
| `PUT` | `/api/bookings/:id/admin-note` | Admin | Add/update admin note on a booking |

### Maintenance (`/api/maintenance`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/maintenance` | Protected | Submit a maintenance request |
| `GET` | `/api/maintenance/my` | Protected | Get current user's maintenance requests |
| `GET` | `/api/maintenance` | Admin | Get all maintenance requests |
| `PUT` | `/api/maintenance/:id/status` | Admin | Update request status & assign technician |
| `DELETE` | `/api/maintenance/:id` | Admin | Delete a maintenance request |

### Notices (`/api/notices`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/notices/public` | Public | Get all active public notices |
| `GET` | `/api/notices` | Protected | Get all notices (logged-in users) |
| `POST` | `/api/notices` | Admin | Create a new notice |
| `PUT` | `/api/notices/:id` | Admin | Update a notice |
| `DELETE` | `/api/notices/:id` | Admin | Delete a notice |

### Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | Get all users |
| `GET` | `/api/users/:id` | Admin | Get user by ID |
| `PUT` | `/api/users/:id` | Admin | Update user details |
| `PUT` | `/api/users/:id/status` | Admin | Change user status (active/suspended) |
| `DELETE` | `/api/users/:id` | Admin | Delete a user |

### Contact Messages (`/api/contact`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit a contact message |
| `GET` | `/api/contact` | Admin | Get all contact messages |
| `GET` | `/api/contact/:id` | Admin | Get message by ID |
| `PUT` | `/api/contact/:id/status` | Admin | Update message status (unread/read/replied) |
| `DELETE` | `/api/contact/:id` | Admin | Delete a contact message |

### Reports (`/api/reports`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/reports/dashboard` | Admin | Dashboard summary statistics |
| `GET` | `/api/reports/revenue` | Admin | Revenue report (last 6 months) |

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | API status check |

---

## 📦 Data Models

### User
| Field | Type | Details |
|---|---|---|
| `name` | String | Required, 2–60 characters |
| `email` | String | Required, unique, validated |
| `password` | String | Required, min 6 chars, hashed with bcrypt (12 rounds), excluded from queries |
| `phone` | String | Optional, validated for 10-digit Indian format |
| `role` | String | `resident` (default) or `admin` |
| `status` | String | `active` (default), `inactive`, or `suspended` |
| `currentRoom` | String | Assigned when booking is approved |
| `address` | String | Optional |
| `emergencyContact` | Object | `{ name, phone, relation }` |
| `idProof` | Object | `{ type, number }` |

### Room
| Field | Type | Details |
|---|---|---|
| `name` | String | Required (e.g., "Single Room (AC)") |
| `roomNo` | String | Required, unique |
| `type` | String | `Single`, `Double`, `Triple`, `Dorm`, `Suite` |
| `floor` | Number | Required, min 0 |
| `capacity` | Number | Required, min 1 |
| `price` | Number | Required, monthly rent in ₹ |
| `status` | String | `available`, `occupied`, `maintenance`, `reserved` |
| `amenities` | [String] | Array of amenity names |
| `description` | String | Room description |
| `images` | [String] | Array of image URLs |
| `rating` | Number | 0–5 rating |
| `reviews` | Number | Review count |
| `currentOccupants` | [ObjectId] | References to User documents |

### Booking
| Field | Type | Details |
|---|---|---|
| `bookingId` | String | Auto-generated (`BK0001`, `BK0002`, …) |
| `user` / `room` | ObjectId | References to User and Room |
| `roomName`, `roomNo`, `roomPrice` | — | Snapshot fields (preserved if room changes) |
| `checkIn` / `checkOut` | Date | Required |
| `status` | String | `pending`, `confirmed`, `cancelled`, `completed` |
| `totalAmount` | Number | Calculated total |
| `paymentStatus` | String | `pending`, `paid`, `refunded`, `failed` |
| `guestName`, `guestEmail`, `guestPhone` | String | Guest info snapshot |
| `idProof` | Object | `{ type, number }` |
| `specialRequests` | String | Optional |
| `adminNote`, `approvedBy`, `approvedAt`, `cancelledAt`, `cancelReason` | — | Admin action tracking |

### Maintenance
| Field | Type | Details |
|---|---|---|
| `requestId` | String | Auto-generated (`MR0001`, `MR0002`, …) |
| `user` | ObjectId | Submitting resident |
| `residentName` / `roomNo` | String | Snapshot fields |
| `category` | String | `Plumbing`, `Electrical`, `Furniture`, `Housekeeping`, `AC/Appliance`, `Internet/WiFi`, `Security`, `Other` |
| `issue` | String | Required, min 10 characters |
| `priority` | String | `low`, `medium` (default), `high` |
| `status` | String | `open`, `in-progress`, `resolved`, `closed` |
| `assignedTo` | String | Technician name |
| `adminNote` | String | Admin comments |

### Notice
| Field | Type | Details |
|---|---|---|
| `title` | String | Required, max 120 characters |
| `content` | String | Required |
| `category` | String | `General`, `Maintenance`, `Payment`, `Rules`, `Event`, `Emergency` |
| `priority` | String | `low`, `normal`, `high`, `urgent` |
| `isActive` | Boolean | Default `true` |
| `expiresAt` | Date | Optional expiration |
| `postedBy` / `postedByName` | — | Admin who posted |
| `targetAudience` | String | Default `all` |

### ContactMessage
| Field | Type | Details |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required |
| `phone` | String | Optional |
| `subject` | String | Required |
| `message` | String | Required |
| `status` | String | `unread`, `read`, `replied` |
| `adminNote` | String | Admin response notes |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/staysphere

# JWT
JWT_SECRET=your_secret_here              # Change in production!
JWT_EXPIRES_IN=7d

# Admin Seed (created on first run)
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@staysphere.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (`frontend/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

> Copy the `.env.example` files to `.env` in both directories to get started quickly:
> ```bash
> cp backend/.env.example backend/.env
> cp frontend/.env.example frontend/.env
> ```

---

## 🔒 Security

| Measure | Implementation |
|---|---|
| **Password Hashing** | bcrypt with 12 salt rounds; passwords excluded from query results by default |
| **JWT Authentication** | Bearer tokens with configurable expiry (default: 7 days), stored in localStorage |
| **Role-Based Access** | `protect` middleware (all logged-in users), `adminOnly` middleware (admin routes), `residentOnly` middleware (resident routes) |
| **Account Suspension** | Suspended users are blocked at middleware level — token verification fails with 403 |
| **Input Validation** | Server-side validation via express-validator + Mongoose schema validators; client-side validation in `validation.jsx` |
| **CORS** | Restricted to `localhost:3000` and `localhost:3001` origins |
| **Error Handling** | Centralised global error handler; no stack traces leaked in production |

---

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide for:
- Setup instructions
- Development workflow
- Commit message conventions
- Pull request process

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using the MERN Stack**

**MongoDB • Express • React • Node.js**

</div>
