# CampusConnect – College Community Portal
## Master Implementation Blueprint & Technical Architecture

---

## 1. Executive Summary & Vision

**CampusConnect** is a centralized college community portal designed to bridge communication gaps between students, student clubs, faculty members, and campus administrators. 

### Core Value Propositions for Hackathons:
- **Centralized Digital Identity:** Unified student portfolios showcasing verified co-curricular achievements, club memberships, and event participation.
- **Dynamic Event Discovery & RSVP Passes:** Real-time seat reservation with instant digital QR pass generation.
- **Urgent & Academic Announcement Broadcasts:** Real-time broadcast system utilizing WebSockets (`Socket.io`) for instant alerts.
- **Decentralized Club Portfolios:** Dedicated club microsites for recruitment, member rosters, and activity management.
- **Peer-to-Peer Campus Forums:** Category-tagged and upvote-driven discussion boards for campus inquiries, academics, and career guidance.
- **Executive Engagement Analytics:** Visual dashboards tracking club growth, department engagement, and event turnout.

---

## 2. Technology Stack & Tooling

Strictly JavaScript / TypeScript & MERN stack:

| Component | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), React Router v6 | High-performance Single Page Application (SPA) |
| **Styling** | Tailwind CSS, Lucide React Icons | Modern, responsive, glassmorphic UI |
| **State & API** | Context API / Redux Toolkit, Axios | Client state & asynchronous REST communications |
| **Real-time Layer**| Socket.io-client | Live notifications, active updates, real-time alerts |
| **Backend Runtime**| Node.js & Express.js | Scalable REST API gateway & WebSocket server |
| **Database** | MongoDB & Mongoose ODM | Flexible document store for campus resources |
| **Authentication**| JSON Web Tokens (JWT) & bcryptjs | Stateless, secure role-based authentication |
| **File Storage** | Cloudinary & Multer | Secure cloud uploads for banners, avatars, and circulars |

---

## 3. System Prerequisites & Environment Specifications

To ensure smooth development, execution, and testing of the CampusConnect web application, certain system prerequisites must be met across software, environment setup, and hardware specifications.

### 3.1 Software Requirements
Essential tools, runtimes, and platforms required to develop, test, and run the application efficiently:

- **Operating System:** Windows 10/11, macOS, or Linux (supports cross-platform development and deployment).
- **Node.js (v16 or above):** Provides the runtime environment for building frontend bundles and powers the server-side REST API logic and WebSocket management.
- **npm (v8 or above):** Package manager required to manage and install dependencies for React, Express, and related libraries.
- **React.js:** Modern frontend library for building dynamic, responsive, and component-driven user interfaces.
- **Express.js:** Fast, unopinionated, lightweight Node.js web framework for routing, middlewares, and RESTful APIs.
- **MongoDB (v5.0 or above / MongoDB Atlas):** Flexible NoSQL document database used to store structured and unstructured data across core campus collections:
  - `Users` (Authentication, roles, student/faculty profiles)
  - `Clubs` (Organization details, members, leadership)
  - `Events` (Workshops, hackathons, RSVPs, attendance tracking)
  - `Announcements` (Urgent alerts, notices, circulars)
  - `Discussions` (Community Q&A threads, replies, upvotes)
  - `Notifications` (User-specific alerts and real-time triggers)
- **Browser:** Google Chrome or Mozilla Firefox (latest version) for debugging and rendering modern CSS/WebSockets in real-time.
- **Postman:** Dedicated API client for testing, validating, and debugging HTTP endpoints and payloads.
- **Visual Studio Code:** Recommended IDE with built-in Git, terminal integration, and MERN stack extensions.
- **Git & GitHub:** Distributed version control and remote repository management for collaborative development.

### 3.2 Hardware Requirements
Minimum and recommended hardware specifications needed to support local development and multitasking:

- **Processor:** Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or better — ensures fast bundling, hot-reloading, and compilation.
- **RAM:** Minimum 8 GB (16 GB recommended) — handles concurrent execution of Node.js server, React Vite dev server, MongoDB daemon/Compass, browser tabs, and VS Code.
- **Storage:** At least 1 GB free disk space — required for `node_modules` caches, database storage, and project assets.
- **Display Resolution:** 1366 × 768 or higher (1920 × 1080 recommended) — optimal for responsive UI testing and side-by-side split screen coding.

---

## 4. High-Level System Architecture

```
                                  CAMPUSCONNECT ARCHITECTURE
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                                     CLIENT LAYER                                       │
   │                          React 18 SPA (Vite) + Tailwind CSS                            │
   │   ┌────────────────────┬────────────────────┬────────────────────┬─────────────────┐   │
   │   │   Student Hub      │  Club Admin Studio │   Faculty Portal   │ Master Admin UI │   │
   │   └─────────┬──────────┴─────────┬──────────┴─────────┬──────────┴────────┬────────┘   │
   └─────────────┼────────────────────┼────────────────────┼───────────────────┼────────────┘
                 │                    │                    │                   │
                 ▼                    ▼                    ▼                   ▼
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                               API GATEWAY & REAL-TIME SERVER                           │
   │                                   (Node.js + Express)                                  │
   │   • JWT Authentication & RBAC Middleware (Student | ClubAdmin | Faculty | Admin)      │
   │   • REST Endpoints: Users, Clubs, Events, Announcements, Discussions, Analytics        │
   │   • WebSocket Hub (Socket.io): Room-based broadcasts (Campus, Clubs, User Alert)       │
   │   • Media Pipeline: Multer buffer -> Cloudinary Storage Upload                         │
   └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                               │
                                               ▼
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                                      DATA LAYER                                        │
   │                                MongoDB Database (Atlas)                                │
   │   Collections: Users | Clubs | Events | Announcements | Discussions | Notifications   │
   └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Role-Based Access Control (RBAC) Matrix

| Module | Student | Club Admin | Faculty | System Admin |
| :--- | :---: | :---: | :---: | :---: |
| **User Profile** | Self (Edit/View) | Self (Edit/View) | Self (Edit/View) | Full Access (Manage All) |
| **Club Showcase** | Browse & Apply to Join | Manage Assigned Club | Mentor / Endorse Club | Full CRUD & Admin Assignment |
| **Event System** | Discover & RSVP Ticket | Create/Host & Scan QR | Co-Host & Approve | Site-wide Event Moderation |
| **Announcements** | View & Bookmark | Post Club Notices | Post Dept Academic Notices | High-Priority Global Broadcasts |
| **Discussion Board**| Create, Reply, Upvote | Moderate Club Threads | Verified Faculty Answers | Site-wide Post Moderation |
| **Analytics** | Personal Stats & Badges | Club Growth & RSVPs | Departmental Metrics | Campus-Wide Health Dashboard |

---

## 6. Detailed Database Schema Design (Mongoose)

### 5.1 `User` Model
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { 
    type: String, 
    enum: ['student', 'club_admin', 'faculty', 'admin'], 
    default: 'student' 
  },
  department: { type: String, required: true }, // e.g. 'CSE', 'ECE', 'MECH'
  yearOfStudy: { type: Number, min: 1, max: 5 }, // 1, 2, 3, 4
  studentId: { type: String }, // College Roll Number
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  bio: { type: String, maxlength: 300, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  joinedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  createdAt: { type: Date, default: Date.now }
});
```

### 5.2 `Club` Model
```javascript
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  category: { 
    type: String, 
    enum: ['Technical', 'Cultural', 'Sports', 'Social & Outreach', 'Academic'], 
    required: true 
  },
  tagline: { type: String, maxlength: 120 },
  description: { type: String, required: true },
  logo: { type: String },
  coverImage: { type: String },
  leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  facultyAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['Member', 'Core Team', 'Lead'], default: 'Member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['active', 'pending_approval'], default: 'active' },
  socialLinks: {
    instagram: String,
    linkedin: String,
    github: String,
    website: String
  },
  createdAt: { type: Date, default: Date.now }
});
```

### 5.3 `Event` Model
```javascript
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  description: { type: String, required: true },
  banner: { type: String },
  category: { 
    type: String, 
    enum: ['Workshop', 'Hackathon', 'Seminar', 'Cultural Fest', 'Competition', 'Sports Meet'], 
    required: true 
  },
  venue: { type: String, required: true },
  isOnline: { type: Boolean, default: false },
  meetingUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxCapacity: { type: Number, default: 100 },
  registrationDeadline: { type: Date },
  registeredUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ticketCode: { type: String, unique: true }, // Unique QR Code hash
    registeredAt: { type: Date, default: Date.now },
    attended: { type: Boolean, default: false }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 5.4 `Announcement` Model
```javascript
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Emergency', 'General', 'Club Activity', 'Placement & Career'], 
    default: 'General' 
  },
  priority: { 
    type: String, 
    enum: ['normal', 'urgent', 'critical'], 
    default: 'normal' 
  },
  targetAudience: { 
    type: String, 
    enum: ['all', 'students', 'faculty', 'specific_dept'], 
    default: 'all' 
  },
  targetDepartment: { type: String },
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});
```

### 5.5 `Discussion` (Community Q&A / Forum) Model
```javascript
const replySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isFacultyEndorsed: { type: Boolean, default: false },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, default: 'General' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [replySchema],
  isPinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

### 5.6 `Notification` Model
```javascript
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['event_reminder', 'announcement', 'club_invite', 'discussion_reply', 'system_alert'] 
  },
  actionUrl: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 7. Comprehensive API Specifications

### 6.1 Authentication (`/api/auth`)
- `POST /register`: Registers student/faculty; hashes password, generates JWT.
- `POST /login`: Validates credentials, issues JWT token in response.
- `GET /me`: Returns currently authenticated user context and role permissions.

### 6.2 Users & Profiles (`/api/users`)
- `GET /profile/:id`: Public portfolio showing student/faculty details, skills, clubs, and co-curricular badges.
- `PUT /profile`: Update bio, skills, interests, and avatar.
- `GET /analytics/dashboard`: Aggregated engagement metrics for the master overview.

### 6.3 Clubs (`/api/clubs`)
- `GET /`: List all clubs with filter queries (`?category=Technical`).
- `POST /`: Create club (Admin/Faculty authorization required).
- `GET /:id`: Retrieve club details, active leadership, members, and upcoming events.
- `PUT /:id`: Update club description, social links, or banner.
- `POST /:id/join`: Request to join or instantly join club.
- `POST /:id/members/manage`: Update member role or remove member (Club Admin only).

### 6.4 Events & Ticketing (`/api/events`)
- `GET /`: List events with category and date filtering (`?type=upcoming`).
- `POST /`: Create event (Requires `club_admin` or `faculty`).
- `GET /:id`: Full event overview with RSVP status.
- `POST /:id/register`: Secure RSVP with capacity validation; returns unique ticket identifier.
- `POST /:id/check-in`: Validates student ticket code/QR for attendance check-off.

### 6.5 Announcements (`/api/announcements`)
- `GET /`: Fetch announcements with filters (`?priority=urgent&category=Academic`).
- `POST /`: Publish announcement; triggers real-time Socket.io broadcast.
- `DELETE /:id`: Remove announcement (System Admin only).

### 6.6 Discussions (`/api/discussions`)
- `GET /`: Feed of discussion posts (filter by tag, trending, or recency).
- `POST /`: Create a new discussion thread.
- `POST /:id/reply`: Add a reply to a thread.
- `POST /:id/upvote`: Toggle upvote on thread or reply.

### 6.7 Notifications (`/api/notifications`)
- `GET /`: Retrieve recipient's notifications.
- `PUT /:id/read`: Mark single notification as read.
- `PUT /mark-all-read`: Clear all unread badges.

---

## 8. Real-Time Socket.io Architecture

Socket.io connects clients upon authentication to receive targeted updates:

| Socket Event | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `connection` | Client -> Server | Handshake Auth (JWT) | Authenticates socket and joins private user room `user_<id>` |
| `join_room` | Client -> Server | Room Name (`club_<id>`, `campus_all`) | Subscribes to room-specific streams |
| `NEW_ANNOUNCEMENT` | Server -> All Clients | `{ id, title, priority, category }` | Triggers top alert notification bar |
| `NEW_EVENT` | Server -> Campus | `{ eventId, title, clubName, date }` | Updates event feed in real-time |
| `USER_NOTIFICATION` | Server -> Single Client| `{ title, message, actionUrl }` | Bumps personal notification counter |
| `DISCUSSION_REPLY` | Server -> Thread Room | `{ discussionId, reply, author }` | Appends reply to open forum thread |

---

## 9. Frontend Structure & Routing Plan

```
src/
├── assets/                  # Logos, illustrations, placeholder assets
├── components/
│   ├── common/              # Navbar, Sidebar, Modal, Badge, Button, Input
│   ├── feed/                # FeedCard, AnnouncementBanner, QuickStats
│   ├── events/              # EventCard, TicketModal, QRPass, EventFilters
│   ├── clubs/               # ClubCard, MemberRoster, JoinRequestModal
│   ├── discussions/         # ThreadCard, ReplyBox, TagSelector
│   └── analytics/           # StatCard, EngagementChart, DepartmentBreakdown
├── context/
│   ├── AuthContext.jsx      # User state, JWT decoding, logout
│   ├── SocketContext.jsx    # Persistent Socket.io connection & listener hub
│   └── ThemeContext.jsx     # Dark / Light mode toggle
├── pages/
│   ├── Login.jsx            # Sign in with role preview credentials
│   ├── Register.jsx         # Sign up with department, year, role selector
│   ├── Feed.jsx             # Unified campus dashboard
│   ├── EventsPage.jsx       # Event exploration, RSVP, calendar
│   ├── EventDetails.jsx     # Event deep dive & QR pass checkout
│   ├── ClubsPage.jsx        # Directory of clubs & organizations
│   ├── ClubDetails.jsx      # Club microsite & leadership board
│   ├── Announcements.jsx    # Formal college notice board
│   ├── Discussions.jsx      # Interactive campus forum & Q&A
│   ├── Profile.jsx          # Personalized student/faculty portfolio
│   └── AdminDashboard.jsx   # Master analytics & platform control center
├── services/
│   ├── api.js               # Axios instance with interceptor for Bearer token
│   ├── eventService.js
│   ├── clubService.js
│   └── forumService.js
├── App.jsx                  # Main router setup
└── main.jsx                 # Entry point with Tailwind CSS
```

---

## 10. Step-by-Step Implementation Roadmap

### Step 1: Backend Foundation
1. Initialize Node project: `npm init -y` inside `/server`.
2. Install core packages:
   ```bash
   npm install express mongoose dotenv cors jsonwebtoken bcryptjs socket.io multer cloudinary
   npm install -D nodemon
   ```
3. Establish MongoDB connection in `server/config/db.js`.
4. Implement JWT authentication middlewares (`protect`, `authorizeRoles`).
5. Seed database with mock colleges, users, clubs, and events for immediate testing.

### Step 2: Frontend Foundation
1. Initialize Vite React app: `npm create vite@latest client -- --template react`.
2. Install client dependencies:
   ```bash
   cd client
   npm install lucide-react react-router-dom axios socket.io-client recharts
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Configure `tailwind.config.js` with modern primary, secondary, and dark surface palettes.
4. Setup `AuthContext` to persist tokens in `localStorage`.

### Step 3: Core Modules Integration
1. **Events Module:** Build event cards, RSVP state with local QR generation using `qrcode.react`.
2. **Club Showcase:** Build filterable club directory and detail pages with joined status toggle.
3. **Discussions Forum:** Upvote mechanism, reply cascades, and filter tags.
4. **Notice Board:** Categorized urgent, academic, and general notices with priority flags.

### Step 4: Real-Time Engine Integration
1. Attach Socket.io server to Node HTTP server in `server/server.js`.
2. Configure client-side Socket listener in `SocketContext.jsx`.
3. Dispatch instant toaster notifications when events or announcements are created.

### Step 5: Executive Analytics Dashboard
1. Implement `/api/analytics` endpoint aggregating:
   - Total students, clubs, and active events.
   - Event RSVP counts per category.
   - Department-wise student participation.
2. Render responsive Bar and Donut charts with `recharts`.

---

## 11. Sample Seed Accounts (For Demo & Hackathon Judging)

| Role | Email | Password | Pre-configured Access |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@campus.edu` | `Admin@123` | Full control, site metrics, announcements |
| **Club Admin** | `gdsc.lead@campus.edu` | `Lead@123` | Leads Developer Student Club, manages RSVPs |
| **Faculty Member** | `sharma.cse@campus.edu` | `Faculty@123` | CSE Department, posts academic circulars |
| **Student** | `alex.student@campus.edu` | `Student@123` | Year 3 CSE, RSVPs events, forum active |

---
*Created for CampusConnect Hackathon Development*
