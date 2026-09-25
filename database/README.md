# CampusConnect — Database Layer

This directory centralizes all database-related configurations, schemas, Mongoose models, and dataset seed scripts for CampusConnect.

---

## Directory Structure

```
database/
├── config/
│   └── db.js                 # MongoDB connection handler
├── models/                   # Mongoose data models & schemas
│   ├── Announcement.js       # Campus broadcasts & priority alerts
│   ├── Club.js               # Student clubs & technical chapters
│   ├── Discussion.js         # Community Q&A, threads & replies
│   ├── Event.js              # Campus fests, hackathons & QR registration passes
│   ├── Notification.js       # Real-time alert records
│   ├── Resource.js           # Shared academic files, posters & circulars
│   └── User.js               # Enrolled students, faculty, club leads & admins
└── seed/
    ├── seed.js               # Standard institutional seeder
    └── seedTamil.js          # Tamil Nadu regional campus dataset (100+ entities)
```

---

## Mongoose Collections & Roles

| Collection | Model File | Description |
| :--- | :--- | :--- |
| `users` | [`models/User.js`](./models/User.js) | Stores credentials, institutional roles (`student`, `faculty`, `club_admin`, `admin`), academic GPA, department, and year of study. |
| `events` | [`models/Event.js`](./models/Event.js) | Campus fests, workshops, and registrations with unique pass codes & QR verification. |
| `clubs` | [`models/Club.js`](./models/Club.js) | Student clubs, technical societies, and mandrams with member rosters and faculty advisors. |
| `announcements` | [`models/Announcement.js`](./models/Announcement.js) | Official circulars, exam notifications, and priority broadcast alerts. |
| `discussions` | [`models/Discussion.js`](./models/Discussion.js) | Forum threads, replies, upvotes, and moderation flags. |
| `resources` | [`models/Resource.js`](./models/Resource.js) | Verified event posters, academic circulars, syllabus, and study materials. |

---

## Seeding the Database

To seed or reset the database with the preconfigured institutional demo accounts and regional campus dataset:

```bash
# Run seeder from backend or database folder:
node database/seed/seedTamil.js
```

### Preconfigured Institutional Demo Accounts
* **Admin**: `admin@campus.edu` / `Admin@123` (Dr. S. K. Jayaraman)
* **Faculty Advisor**: `faculty@campus.edu` / `Faculty@123` (Prof. M. Anbarasan)
* **Club Lead**: `clublead@campus.edu` / `Club@123` (Kavitha Ramanathan)
* **Student**: `student@campus.edu` / `Student@123` (Kamesh S)
