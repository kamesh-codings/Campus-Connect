# CampusConnect – College Community Portal
## Master Implementation Blueprint & Technical Architecture

---

## 1. Executive Summary & Vision

**CampusConnect** is a centralized college community portal designed to bridge communication gaps between students, student clubs, faculty members, and campus administrators. 

### Core Value Propositions for Hackathons:
- **Centralized Digital Identity & Role-Tailored Profiles:** Unified portfolios showcasing verified co-curricular achievements, course details, club leadership, and institutional governance.
- **Dynamic Event Discovery & QR Passes:** Real-time seat reservation with instant digital QR pass generation and 1-tap attendee verification.
- **Urgent & Academic Announcement Broadcasts:** Real-time broadcast system utilizing WebSockets (`Socket.io`) for instant alerts.
- **Decentralized Club Portfolios:** Dedicated club microsites for recruitment, member rosters, and activity management.
- **Peer-to-Peer Campus Forums & Faculty Endorsements:** Category-tagged and upvote-driven discussion boards for campus inquiries, academics, and career guidance.
- **Campus Resource Hub & File Sharing:** Searchable repository for lecture notes, lab manuals, code templates, and semester question banks.
- **Content Moderation & Governance:** Admin moderation queue to review reported forum threads and maintain digital community safety.
- **Executive Engagement Analytics:** Visual dashboards tracking club growth, department engagement, and event turnout.

---

## 2. Technology Stack & Tooling

Strictly JavaScript / TypeScript & MERN stack:

| Component | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite), React Router v6 | High-performance Single Page Application (SPA) |
| **Styling** | Tailwind CSS v4, Lucide React Icons | Modern, responsive, glassmorphic UI design system |
| **State & API** | Context API, Axios | Client state & asynchronous REST communications |
| **Real-time Layer**| Socket.io-client | Live notifications, active updates, real-time alerts |
| **Backend Runtime**| Node.js & Express.js | Scalable REST API gateway & WebSocket server |
| **Database** | MongoDB & Mongoose ODM | Flexible document store for campus collections |
| **Authentication**| JSON Web Tokens (JWT) & bcryptjs | Stateless, secure role-based authentication |
| **File Storage** | Multer & Static Asset Pipeline | Local & cloud uploads for PDF notes, circulars, and media |

---

## 3. System Prerequisites & Environment Specifications

### 3.1 Software Requirements
- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js (v16 or above):** Powers the server-side REST API logic, WebSocket hub, and Vite dev server.
- **npm (v8 or above):** Package manager for React, Express, and ecosystem libraries.
- **MongoDB (v5.0 or above / MongoDB Atlas):** Database engine storing core collections:
  - `Users` (Authentication, roles, student/faculty profiles)
  - `Clubs` (Organization details, members, leadership)
  - `Events` (Workshops, hackathons, RSVPs, attendance tracking)
  - `Announcements` (Urgent alerts, notices, circulars)
  - `Discussions` (Community Q&A threads, replies, upvotes, moderation reports)
  - `Resources` (Lecture notes, lab manuals, code templates, question papers)
  - `Notifications` (User-specific alerts and real-time triggers)
- **Browser:** Google Chrome, Firefox, or Edge.

---

## 4. High-Level System Architecture

```
                                  CAMPUSCONNECT ARCHITECTURE
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                                     CLIENT LAYER                                       │
   │                     React 18 SPA (Vite) + Tailwind CSS v4 Engine                       │
   │   ┌────────────────────┬────────────────────┬────────────────────┬─────────────────┐   │
   │   │   Student Portal   │  Club Lead Studio  │   Faculty Hub      │ Master Admin UI │   │
   │   └─────────┬──────────┴─────────┬──────────┴─────────┬──────────┴────────┬────────┘   │
   └─────────────┼────────────────────┼────────────────────┼───────────────────┼────────────┘
                 │                    │                    │                   │
                 ▼                    ▼                    ▼                   ▼
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                               API GATEWAY & REAL-TIME SERVER                           │
   │                                   (Node.js + Express)                                  │
   │   • JWT Authentication & RBAC Middleware (Student | ClubAdmin | Faculty | Admin)      │
   │   • REST Endpoints: Users, Clubs, Events, Announcements, Discussions, Resources        │
   │   • WebSocket Hub (Socket.io): Room-based broadcasts (Campus, Clubs, User Alert)       │
   │   • Media Pipeline: Multer buffer -> Static Upload Pipeline                            │
   └───────────────────────────────────────────┬────────────────────────────────────────────┘
                                               │
                                               ▼
   ┌────────────────────────────────────────────────────────────────────────────────────────┐
   │                                      DATA LAYER                                        │
   │                                MongoDB Database (Atlas)                                │
   │   Collections: Users | Clubs | Events | Announcements | Discussions | Resources        │
   └────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Core Data Models

### 5.1 `User` Model
- `name`, `email`, `password` (hashed with bcrypt), `role` (`student`, `club_admin`, `faculty`, `admin`)
- `department`, `yearOfStudy`, `studentId`, `bio`, `avatar`, `skills`, `interests`, `extracurricularActivities`
- `academicInfo` (`gpa`, `specialization`, `semester`), `achievements`, `points`, `joinedClubs`

### 5.2 `Resource` Model
```javascript
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  category: { type: String, enum: ['Notes', 'Question Paper', 'Lab Manual', 'Reference Book', 'Code / Project'] },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String },
  fileSize: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 6. Comprehensive API Specifications

### 6.1 Authentication (`/api/auth`)
- `POST /login`: Validates credentials, issues JWT token in response. Supports demo alias resolution.
- `GET /me`: Returns currently authenticated user context and role permissions.

### 6.2 Users & Profiles (`/api/users`)
- `GET /profile/:id`: Public portfolio showing role-tailored details (Student, Faculty, Club Lead, Admin).
- `PUT /profile`: Update bio, skills, interests, and profile details.
- `GET /directory`: Search and filter campus students, faculty, and club leads.

### 6.3 Clubs (`/api/clubs`)
- `GET /`: List all clubs with filter queries (`?category=Technical`).
- `POST /`: Create club (Admin/Faculty authorization required).
- `GET /:id`: Retrieve club details, leadership, members, and upcoming events.
- `POST /:id/join`: Join or leave club community.

### 6.4 Events & Ticketing (`/api/events`)
- `GET /`: List events with category and date filtering.
- `POST /`: Create event (Requires `club_admin` or `faculty`).
- `POST /:id/register`: 1-Tap RSVP with QR pass generation.
- `POST /:id/check-in`: Validates student QR pass code for event check-in.

### 6.5 Announcements (`/api/announcements`)
- `GET /`: Fetch announcements with priority and category filters.
- `POST /`: Publish announcement; triggers real-time Socket.io broadcast.

### 6.6 Discussions (`/api/discussions`)
- `GET /`: Feed of discussion posts (filter by tag, trending, or recency).
- `POST /`: Create a new discussion thread.
- `POST /:id/reply`: Add a reply to a thread (with faculty endorsement tagging).
- `POST /:id/upvote`: Toggle upvote on thread or reply.
- `POST /:id/report`: Report inappropriate or violating content for admin review.
- `PUT /:id/moderate`: Admin action to dismiss reports or remove content.

### 6.7 File Uploads (`/api/upload`)
- `POST /`: Multipart file upload handler (PDF, DOCX, Images).

---

## 7. Real-Time Socket.io Architecture

| Socket Event | Direction | Payload | Description |
| :--- | :---: | :--- | :--- |
| `connection` | Client -> Server | Handshake Auth (JWT) | Authenticates socket and joins private user room `user_<id>` |
| `join_room` | Client -> Server | Room Name (`club_<id>`, `campus_all`) | Subscribes to room-specific streams |
| `NEW_ANNOUNCEMENT` | Server -> All Clients | `{ id, title, priority, category }` | Triggers top alert notification bar |
| `NEW_EVENT` | Server -> Campus | `{ eventId, title, clubName, date }` | Updates event feed in real-time |
| `USER_NOTIFICATION` | Server -> Single Client| `{ title, message, actionUrl }` | Bumps personal notification counter |
| `DISCUSSION_REPLY` | Server -> Thread Room | `{ discussionId, reply, author }` | Appends reply to open forum thread |

---

## 8. Frontend Structure & Routing Plan

```
frontend/
├── src/
│   ├── components/common/   # Navbar, Sidebar, Layout
│   ├── context/             # AuthContext, SocketContext
│   ├── pages/
│   │   ├── Feed.jsx         # Unified campus dashboard & stats
│   │   ├── Events.jsx       # Event exploration, RSVP & QR pass generation
│   │   ├── Clubs.jsx        # Directory of clubs & cultural mandrams
│   │   ├── Announcements.jsx# Formal college circulars & urgent alerts
│   │   ├── Discussions.jsx  # Campus forum Q&A, reporting & faculty endorsements
│   │   ├── Resources.jsx    # Campus study material & file sharing hub
│   │   ├── Profile.jsx      # Role-tailored student, faculty, lead & admin profiles
│   │   ├── Analytics.jsx    # Visual attendance & engagement charts (Recharts)
│   │   ├── AdminDashboard.jsx# Content moderation queue & governance actions
│   │   └── Login.jsx        # 4-role institutional single sign-on portal
│   ├── services/            # Axios API client with JWT interceptor
│   ├── App.jsx              # Main router setup & role guards
│   ├── index.css            # Tailwind CSS v4 design system
│   └── main.jsx             # React DOM entry point
├── package.json
└── vite.config.js
```

---

## 9. Sample Seed Accounts (For Demo & Hackathon Judging)

| Role | Name | Email | Password | Pre-configured Access |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | Dr. S. K. Jayaraman | `admin@campus.edu` | `Admin@123` | Full governance, content moderation, analytics |
| **Faculty Member** | Dr. K. Radhakrishnan | `radhakrishnan.cse@campus.edu` | `Faculty@123` | Endorse Q&A, broadcast circulars, academic courses |
| **Club Lead** | Karthikeyan Natarajan | `karthik.lead@campus.edu` | `Lead@123` | Muthamil Mandram President, QR pass verification |
| **Student** | Kaviya Ramasamy | `kaviya.student@campus.edu` | `Student@123` | Year 3 CSE, RSVPs, study material downloads, forum active |

---
*Created for CampusConnect Hackathon Development*
