# CampusConnect – College Community Portal

A full-stack centralized college community platform connecting students, student clubs, faculty members, and campus administrators in a unified digital ecosystem.

---

## 🌟 Key Features

1. **Centralized Campus Feed:** Prioritized campus announcements, upcoming workshops, hackathons, and community statistics.
2. **Dynamic Event Discovery & RSVP:** Discover workshops, technical hackathons, guest seminars, and cultural fests with capacity tracking and real-time digital pass generation.
3. **Clubs & Student Organizations:** Browse college clubs, view faculty advisors, explore active projects, join communities, and charter new clubs.
4. **Broadcast & Announcement Center:** Departmental notices, academic circulars, placement drives, and critical/urgent emergency alerts with target audience filtering.
5. **Peer-to-Peer Discussions & Q&A:** Category-tagged campus forums with upvoting, nested reply threads, and faculty endorsement badges.
6. **Student Community Profiles:** Personalized student profiles showcasing department, year, skills tags, academic interests, joined clubs, and attended events.
7. **Institutional Analytics:** Interactive Recharts visual dashboards tracking active users, RSVP velocity, and club membership distributions.
8. **Super Admin Governance:** User role management (Student, Club Lead, Faculty, Admin), club moderation, and campus directory oversight.
9. **Real-time Notifications:** Socket.io integration delivering instant live alerts when announcements, events, or replies are published.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Lucide React, Recharts, React Hot Toast
- **Backend:** Node.js, Express.js, Socket.io, JWT Authentication, bcryptjs
- **Database:** MongoDB with Mongoose ODM (models, schemas, seeders)
- **Design:** Modern glassmorphism, responsive dark theme, and micro-animations

---

## 📁 Repository Structure

The project is cleanly structured into dedicated folders:

```text
Campus Connect/
├── frontend/                    # Client Application (React 18 + Vite)
│   ├── src/
│   │   ├── components/common/   # Navbar, Sidebar, Layout, Modals
│   │   ├── context/             # AuthContext, SocketContext
│   │   ├── pages/               # Feed, Events, Clubs, Announcements,
│   │   │                        # Discussions, Profile, Analytics, Admin,
│   │   │                        # Login, Register
│   │   ├── services/            # Axios API client with JWT interceptor
│   │   ├── App.jsx              # Routing & role guards
│   │   ├── index.css            # Dark glassmorphic design system
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # API & WebSocket Server (Node.js + Express)
│   ├── config/                  # Cloudinary, database delegator
│   ├── controllers/             # Auth, User, Club, Event, Announcement,
│   │                            # Discussion, Notification, Upload
│   ├── middleware/              # JWT auth & role authorization
│   ├── models/                  # Backend model proxies referencing database/models
│   ├── routes/                  # Express REST route handlers
│   ├── socket/                  # Real-time Socket.io handlers
│   ├── server.js                # Server entry point
│   └── package.json
│
├── database/                    # Database Schemas, Models & Seeding
│   ├── models/                  # Canonical Mongoose Schemas (User, Club, Event, etc.)
│   ├── seed/                    # Database seed scripts & comprehensive datasets
│   │   ├── seedTamil.js         # 100+ realistic Tamil & Indian campus records
│   │   ├── seedResources.js     # Extracurriculars & resource uploads
│   │   └── seed.js              # Standard initial seed
│   ├── config/                  # MongoDB connection configuration (db.js)
│   ├── package.json             # Database helper scripts
│   └── README.md                # Schema documentation & collections guide
│
├── package.json                 # Root convenience scripts
├── implementation.md            # Detailed technical blueprint
└── README.md                    # Project documentation & quickstart
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or above recommended)
- **npm** (v8 or above)
- **MongoDB** running locally (`mongodb://localhost:27017/campusconnect`) or MongoDB Atlas URI in `backend/.env`.

---

### 2. Root Quickstart Commands

From the workspace root directory:

```bash
# Start backend server (port 5000)
npm run dev:backend

# Start frontend application (port 5173)
npm run dev:frontend

# Build frontend for production
npm run build:frontend

# Seed database with realistic Indian & Tamil campus records (100+ items)
npm run seed:db
```

---

### 3. Individual Folder Setup

#### Backend (`/backend`)
```bash
cd backend
npm install
npm run dev
```

#### Frontend (`/frontend`)
```bash
cd frontend
npm install
npm run dev
```

#### Database (`/database`)
```bash
cd database
npm run seed
```

---

## 🔑 Demo Accounts

The database seed provides pre-configured accounts across all campus roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@campus.edu` | `Admin@123` | Full governance, role assignment, club moderation, system analytics |
| **Faculty Advisor** | `sharma.cse@campus.edu` | `Faculty@123` | Broadcast circulars, endorse discussions, event oversight |
| **Club Lead** | `gdsc.lead@campus.edu` | `Lead@123` | Host events, manage club members, post club updates |
| **Student** | `priya.patel@campus.edu` | `Student@123` | RSVP to events, join clubs, ask in forums, edit profile |

*Quick-fill demo buttons are also integrated into the Login page for one-click testing.*
