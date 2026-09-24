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
- **Database:** MongoDB with Mongoose ODM
- **Design:** Modern glassmorphism, responsive dark theme, and micro-animations

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16 or above)
- **npm** (v8 or above)
- **MongoDB** running locally (`mongodb://localhost:27017/campusconnect`) or MongoDB Atlas connection string in `server/.env`.

---

### 2. Backend Setup & Seeding

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Verify environment settings in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/campusconnect
   JWT_SECRET=campusconnect_jwt_secret_2024_hackathon
   JWT_EXPIRE=7d
   ```
3. Populate demo campus data (users, clubs, events, announcements, discussions):
   ```bash
   npm run seed
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The server will run on `http://localhost:5000` with WebSocket handlers active.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:5173
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

---

## 📁 Project Architecture

```
Campus Connect/
├── client/                      # React Frontend (Vite)
│   ├── src/
│   │   ├── components/common/   # Navbar, Sidebar, Layout
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
├── server/                      # Node.js / Express Backend
│   ├── config/                  # MongoDB connection
│   ├── controllers/             # Auth, User, Club, Event, Announcement,
│   │                            # Discussion, Notification controllers
│   ├── middleware/              # JWT auth & role authorization
│   ├── models/                  # Mongoose schemas (User, Club, Event, etc.)
│   ├── routes/                  # Express REST routes
│   ├── seed/                    # Database seeder with realistic campus data
│   ├── socket/                  # Real-time Socket.io event triggers
│   ├── server.js                # Server entry point
│   └── package.json
├── implementation.md            # Comprehensive system blueprint
└── README.md                    # Project documentation & quickstart
```
