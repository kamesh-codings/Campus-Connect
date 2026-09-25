# CampusConnect – College Community Portal

A full-stack centralized college community platform connecting students, student clubs, faculty members, and campus administrators in a unified digital ecosystem.

---

## 🌟 Key Features

1. **Centralized Campus Feed:** Prioritized campus announcements, upcoming workshops, hackathons, and real-time community engagement statistics.
2. **Dynamic Event Discovery & QR Passes:** Discover technical hackathons, guest seminars, and cultural fests with capacity tracking and 1-tap digital QR ticket verification.
3. **Clubs & Student Mandrams:** Browse college clubs and cultural societies, view faculty advisors, explore active projects, join communities, and charter new clubs.
4. **Broadcast & Announcement Center:** Departmental notices, academic circulars, placement alerts, and critical/urgent emergency broadcasts with target audience filtering.
5. **Peer-to-Peer Discussions & Q&A:** Category-tagged campus forums with upvoting, nested reply threads, community reporting, and verified faculty endorsements.
6. **Campus Resource Hub & File Sharing:** Centralized academic repository for semester notes, lab manuals, code templates, and question banks with branch/semester filtering and download tracking.
7. **Role-Tailored Profile Portfolios:** Distinct profile dashboards for **Students** (CGPA, Rep tier, honors), **Faculty** (courses, office hours, publications), **Club Leads** (metrics, leadership controls), and **Admins** (governance).
8. **Institutional Analytics:** Interactive Recharts visual dashboards tracking active users, RSVP velocity, and club membership distributions.
9. **Content Moderation & Governance:** Admin moderation queue to review reported forum threads, manage user roles, and enforce campus digital safety.
10. **Real-time Notifications:** Socket.io integration delivering instant live alerts when announcements, events, or discussion replies are published.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, React Router v6, Tailwind CSS v4, Lucide React, Recharts, React Hot Toast
- **Backend:** Node.js, Express.js, Socket.io, JWT Authentication, bcryptjs, Multer
- **Database:** MongoDB with Mongoose ODM
- **Design:** Modern glassmorphism, responsive dark theme, and micro-animations

---

## 🚀 Getting Started & Terminal Commands

### 💻 How to Open the Webpage via New Terminal

#### Step 1: Terminal 1 — Start the Backend API Server
Open a new terminal window:
```powershell
cd "c:\Users\kamesh\OneDrive\Desktop\Campus Connect"
npm run dev:backend
```
*(Runs the Express REST API and Socket.io server on `http://localhost:5000`)*

#### Step 2: Terminal 2 — Start the Frontend & Open in Browser
Open a second terminal window:
```powershell
cd "c:\Users\kamesh\OneDrive\Desktop\Campus Connect"
npm run dev:frontend -- --open
```
*(Starts the Vite dev server and automatically launches the webpage in your default browser at `http://localhost:5173`)*

---

### 🌐 Instant Browser Launch (If Servers Are Already Running)

If the backend and frontend are already running in the background, open the website immediately with:

- **Windows PowerShell:**
  ```powershell
  Start-Process "http://localhost:5173"
  ```
- **Windows Command Prompt (CMD):**
  ```cmd
  start http://localhost:5173
  ```

---

### 1. Prerequisites
- **Node.js** (v18 or above recommended)
- **npm** (v8 or above)
- **MongoDB** running locally (`mongodb://localhost:27017/campusconnect`) or MongoDB Atlas connection string in `backend/.env`.

---

### 2. Backend Setup & Seeding

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Verify environment settings in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGO_URI=mongodb://localhost:27017/campusconnect
   JWT_SECRET=campusconnect_jwt_secret_2024_hackathon
   JWT_EXPIRE=7d
   ```
4. Populate demo campus dataset (100+ Indian & Tamil campus records):
   ```bash
   npm run seed:tamil
   # or from database directory:
   # cd ../database && npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5000` with WebSocket handlers active.*

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   # or to auto-open in browser:
   npm run dev -- --open
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🔑 Demo Accounts (Evaluation Mode)

CampusConnect uses a secure closed institutional portal with 1-click demo logins on the Login page:

| Role | Name | Email | Password | Pre-configured Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | Dr. S. K. Jayaraman | `admin@campus.edu` | `Admin@123` | Full governance, content moderation, user directory, system analytics |
| **Faculty Member** | Dr. K. Radhakrishnan | `radhakrishnan.cse@campus.edu` | `Faculty@123` | Broadcast circulars, endorse Q&A answers, course guidance, event oversight |
| **Club Lead** | Karthikeyan Natarajan | `karthik.lead@campus.edu` | `Lead@123` | Host events, verify attendee QR passes, post club announcements |
| **Student** | Kaviya Ramasamy | `kaviya.student@campus.edu` | `Student@123` | Event RSVPs, QR passes, join clubs, forum Q&A, download resources |

*(Legacy fallback aliases: `sharma.cse@campus.edu`, `gdsc.lead@campus.edu`, `alex.student@campus.edu`)*

---

## 📁 Project Architecture

```text
Campus-Connect/
├── frontend/                    # React Frontend (Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/common/   # Navbar, Sidebar, Layout, Modals
│   │   ├── context/             # AuthContext, SocketContext
│   │   ├── pages/
│   │   │   ├── Feed.jsx         # Personalized campus dashboard & quick stats
│   │   │   ├── Events.jsx       # Event exploration, RSVP & QR ticket generation
│   │   │   ├── Clubs.jsx        # Clubs & cultural mandrams directory
│   │   │   ├── Announcements.jsx# Official circulars & priority broadcasts
│   │   │   ├── Discussions.jsx  # Forum Q&A, voting, reporting & faculty endorsements
│   │   │   ├── Resources.jsx    # Study material, lab manuals & file repository
│   │   │   ├── Profile.jsx      # Role-tailored student, faculty, lead & admin profiles
│   │   │   ├── Analytics.jsx    # Visual attendance & engagement charts (Recharts)
│   │   │   ├── AdminDashboard.jsx# Content moderation queue & governance actions
│   │   │   └── Login.jsx        # 4-role institutional single sign-on portal
│   │   ├── services/            # Axios API client with JWT interceptor
│   │   ├── App.jsx              # Application router & role-based route guards
│   │   ├── index.css            # Tailwind CSS v4 design system & glassmorphism
│   │   └── main.jsx             # React DOM root entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js / Express Backend & WebSocket Hub
│   ├── config/                  # MongoDB connection (Mongoose)
│   ├── controllers/             # REST controllers:
│   │   ├── authController.js    # JWT authentication & alias resolver
│   │   ├── userController.js    # User profiles & directory search
│   │   ├── clubController.js    # Clubs management & memberships
│   │   ├── eventController.js   # Events, RSVPs & QR pass generator
│   │   ├── announcementController.js # Campus broadcasts & priority alerts
│   │   ├── discussionController.js   # Forum threads, replies & moderation reporting
│   │   ├── notificationController.js # User notifications
│   │   ├── feedController.js    # Aggregated campus feed & analytics
│   │   └── uploadController.js  # File uploads (PDF, DOCX, Images)
│   ├── middleware/              # JWT auth verification & role-based access control
│   ├── models/                  # Mongoose schemas (User, Club, Event, Announcement,
│   │                            # Discussion, Resource, Notification)
│   ├── routes/                  # Express REST route endpoints
│   ├── seed/                    # Database seed scripts & Tamil/Indian dataset
│   │   ├── seed.js              # Standard seed dataset
│   │   ├── seedTamil.js         # Comprehensive 117+ item Tamil campus dataset
│   │   ├── seedResources.js     # Campus study material seed
│   │   └── tamil_indian_seed_data.json
│   ├── socket/                  # Socket.io real-time event triggers
│   ├── server.js                # Express & Socket.io server entry point
│   └── package.json
│
├── implementation.md            # Master technical blueprint & system design
└── README.md                    # Project overview & quickstart guide
```
