const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Club = require('../models/Club');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Discussion = require('../models/Discussion');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await Announcement.deleteMany({});
    await Discussion.deleteMany({});
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ─── USERS ───────────────────────────────────────────────
    const users = await User.create([
      {
        name: 'System Administrator',
        email: 'admin@campus.edu',
        password: 'Admin@123',
        role: 'admin',
        department: 'Administration',
        bio: 'Platform administrator managing all campus operations.',
        skills: ['Management', 'Analytics', 'System Design'],
        interests: ['Campus Development', 'Student Welfare'],
      },
      {
        name: 'Dr. Anita Sharma',
        email: 'sharma.cse@campus.edu',
        password: 'Faculty@123',
        role: 'faculty',
        department: 'CSE',
        bio: 'Associate Professor, Computer Science & Engineering. Research: AI & ML.',
        skills: ['Machine Learning', 'Data Science', 'Python', 'Research'],
        interests: ['AI Research', 'Student Mentorship'],
      },
      {
        name: 'Rahul Verma',
        email: 'gdsc.lead@campus.edu',
        password: 'Lead@123',
        role: 'club_admin',
        department: 'CSE',
        yearOfStudy: 3,
        studentId: 'CS21045',
        bio: 'GDSC Lead | Full-Stack Developer | Open Source Contributor',
        skills: ['React', 'Node.js', 'MongoDB', 'Firebase', 'Flutter'],
        interests: ['Web Development', 'Cloud Computing', 'Open Source'],
      },
      {
        name: 'Alex Johnson',
        email: 'alex.student@campus.edu',
        password: 'Student@123',
        role: 'student',
        department: 'CSE',
        yearOfStudy: 3,
        studentId: 'CS21089',
        bio: 'Aspiring software developer. Love hackathons and competitive coding.',
        skills: ['JavaScript', 'React', 'DSA', 'Git'],
        interests: ['Hackathons', 'Web Dev', 'Competitive Programming'],
      },
      {
        name: 'Priya Patel',
        email: 'priya.student@campus.edu',
        password: 'Student@123',
        role: 'student',
        department: 'ECE',
        yearOfStudy: 2,
        studentId: 'EC22034',
        bio: 'ECE student passionate about IoT and embedded systems.',
        skills: ['Arduino', 'Embedded C', 'IoT', 'PCB Design'],
        interests: ['Robotics', 'IoT', 'Electronics'],
      },
      {
        name: 'Mohammed Arif',
        email: 'arif.student@campus.edu',
        password: 'Student@123',
        role: 'student',
        department: 'MECH',
        yearOfStudy: 4,
        studentId: 'ME20012',
        bio: 'Final year Mechanical student. CAD enthusiast and motorsports fan.',
        skills: ['AutoCAD', 'SolidWorks', 'ANSYS', '3D Printing'],
        interests: ['Automotive Engineering', 'Formula SAE', 'Design'],
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.cultural@campus.edu',
        password: 'Lead@123',
        role: 'club_admin',
        department: 'CSE',
        yearOfStudy: 3,
        studentId: 'CS21078',
        bio: 'Cultural Club Lead | Classical Dancer | Event Organizer',
        skills: ['Event Management', 'Dance', 'Public Speaking', 'Marketing'],
        interests: ['Cultural Events', 'Performing Arts', 'Event Planning'],
      },
    ]);
    console.log(`👥 Created ${users.length} users`);

    const [admin, faculty, gdscLead, alex, priya, arif, sneha] = users;

    // ─── CLUBS ───────────────────────────────────────────────
    const clubs = await Club.create([
      {
        name: 'Google Developer Student Club (GDSC)',
        category: 'Technical',
        tagline: 'Learn. Build. Grow. Together.',
        description:
          'GDSC is a community of student developers powered by Google. We organize workshops, hackathons, and study jams to help students learn cutting-edge technologies like Android, Cloud, ML, and Web.',
        leads: [gdscLead._id],
        facultyAdvisor: faculty._id,
        members: [
          { user: gdscLead._id, role: 'Lead' },
          { user: alex._id, role: 'Core Team' },
          { user: priya._id, role: 'Member' },
        ],
        status: 'active',
        socialLinks: {
          instagram: 'https://instagram.com/gdsc_campus',
          github: 'https://github.com/gdsc-campus',
          linkedin: 'https://linkedin.com/company/gdsc-campus',
        },
      },
      {
        name: 'Cultural Arts Society',
        category: 'Cultural',
        tagline: 'Where creativity meets expression',
        description:
          'The Cultural Arts Society organizes annual fests, dance competitions, music events, drama workshops, and art exhibitions. Join us to showcase your talent!',
        leads: [sneha._id],
        members: [
          { user: sneha._id, role: 'Lead' },
          { user: arif._id, role: 'Member' },
          { user: priya._id, role: 'Member' },
        ],
        status: 'active',
        socialLinks: {
          instagram: 'https://instagram.com/cultural_campus',
        },
      },
      {
        name: 'Robotics & Innovation Lab',
        category: 'Technical',
        tagline: 'Building the future, one bot at a time',
        description:
          'A hands-on club focused on robotics, IoT, drones, and automation. We participate in national-level robotics competitions and host workshops on embedded systems and mechanical design.',
        leads: [arif._id],
        facultyAdvisor: faculty._id,
        members: [
          { user: arif._id, role: 'Lead' },
          { user: priya._id, role: 'Core Team' },
        ],
        status: 'active',
        socialLinks: {
          github: 'https://github.com/robolab-campus',
        },
      },
      {
        name: 'Sports Committee',
        category: 'Sports',
        tagline: 'Champions are made here',
        description:
          'The Sports Committee organizes inter-college tournaments, fitness camps, marathons, and annual sports meets. Stay fit, compete, and represent your college!',
        leads: [admin._id],
        members: [
          { user: alex._id, role: 'Member' },
          { user: arif._id, role: 'Member' },
        ],
        status: 'active',
      },
    ]);
    console.log(`🏛️  Created ${clubs.length} clubs`);

    // Update users' joinedClubs
    await User.findByIdAndUpdate(gdscLead._id, { joinedClubs: [clubs[0]._id] });
    await User.findByIdAndUpdate(alex._id, { joinedClubs: [clubs[0]._id, clubs[3]._id] });
    await User.findByIdAndUpdate(priya._id, {
      joinedClubs: [clubs[0]._id, clubs[1]._id, clubs[2]._id],
    });
    await User.findByIdAndUpdate(arif._id, {
      joinedClubs: [clubs[1]._id, clubs[2]._id, clubs[3]._id],
    });
    await User.findByIdAndUpdate(sneha._id, { joinedClubs: [clubs[1]._id] });

    // ─── EVENTS ──────────────────────────────────────────────
    const now = new Date();
    const events = await Event.create([
      {
        title: 'HackCampus 2024 - 24hr Hackathon',
        club: clubs[0]._id,
        description:
          'The flagship 24-hour hackathon by GDSC! Build innovative solutions around this year\'s theme: "Tech for Social Good". Cash prizes worth ₹50,000. Team size: 2-4 members.',
        category: 'Hackathon',
        venue: 'Main Auditorium & CS Lab Complex',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
        maxCapacity: 200,
        registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        registeredUsers: [
          { user: alex._id, ticketCode: 'CC-HCK2024A' },
          { user: priya._id, ticketCode: 'CC-HCK2024B' },
        ],
        createdBy: gdscLead._id,
      },
      {
        title: 'Web Development Bootcamp - React & Node.js',
        club: clubs[0]._id,
        description:
          'A 3-day intensive bootcamp covering React fundamentals, Node.js REST APIs, MongoDB integration, and deployment. No prior experience needed — just bring your laptop!',
        category: 'Workshop',
        venue: 'CS Lab 301',
        startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 16 * 24 * 60 * 60 * 1000),
        maxCapacity: 60,
        registrationDeadline: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        createdBy: gdscLead._id,
      },
      {
        title: 'Annual Cultural Fest - KALEIDOSCOPE 2024',
        club: clubs[1]._id,
        description:
          'The biggest cultural festival of the year! 3 days of music, dance, drama, art, fashion, and food. Open to all colleges. Participate or just enjoy the vibe!',
        category: 'Cultural Fest',
        venue: 'Main Campus Ground & Amphitheatre',
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 32 * 24 * 60 * 60 * 1000),
        maxCapacity: 1000,
        registeredUsers: [
          { user: alex._id, ticketCode: 'CC-KLDO2024A' },
          { user: arif._id, ticketCode: 'CC-KLDO2024B' },
          { user: priya._id, ticketCode: 'CC-KLDO2024C' },
        ],
        createdBy: sneha._id,
      },
      {
        title: 'RoboWars - Inter-College Robotics Competition',
        club: clubs[2]._id,
        description:
          'Build your battle bot and compete! Categories: Lightweight (under 5kg), Middleweight (5-15kg). Weapons, strategy, and engineering excellence decide the winner.',
        category: 'Competition',
        venue: 'Mechanical Workshop Arena',
        startDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        maxCapacity: 40,
        registrationDeadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
        createdBy: arif._id,
      },
      {
        title: 'AI & Machine Learning Guest Lecture',
        club: clubs[0]._id,
        description:
          'A special guest lecture by Dr. Ramesh Kumar from IIT Madras on "Transformers, LLMs, and the Future of AI in India". Open to all departments.',
        category: 'Seminar',
        venue: 'Seminar Hall A',
        isOnline: true,
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        maxCapacity: 300,
        createdBy: faculty._id,
      },
    ]);
    console.log(`📅 Created ${events.length} events`);

    // ─── ANNOUNCEMENTS ───────────────────────────────────────
    const announcements = await Announcement.create([
      {
        title: 'Mid-Semester Examination Schedule Released',
        content:
          'The mid-semester examination schedule for all departments has been released. Exams begin on 15th November 2024. Download the complete timetable from the academic portal. Contact your respective HOD for any clashes.',
        category: 'Academic',
        priority: 'urgent',
        targetAudience: 'all',
        author: admin._id,
      },
      {
        title: 'Campus WiFi Maintenance - Service Downtime',
        content:
          'Campus WiFi services will be temporarily unavailable on Sunday, 10th November from 2:00 AM to 6:00 AM for scheduled network infrastructure upgrades. Please plan accordingly.',
        category: 'General',
        priority: 'normal',
        targetAudience: 'all',
        author: admin._id,
      },
      {
        title: 'Placement Drive: Google, Microsoft, and Amazon',
        content:
          'Major placement drives are scheduled for December 2024. Eligible students from CSE, ECE, and IT departments must register on the placement portal by 20th November. Minimum 7.0 CGPA required.',
        category: 'Placement & Career',
        priority: 'critical',
        targetAudience: 'students',
        author: faculty._id,
      },
      {
        title: 'GDSC Open Source Contribution Week',
        content:
          'Calling all developers! Join us for a week-long open source contribution sprint. Beginners welcome — we\'ll guide you through your first PR. Starts Monday in CS Lab 301.',
        category: 'Club Activity',
        priority: 'normal',
        targetAudience: 'students',
        author: gdscLead._id,
      },
      {
        title: 'Emergency: Heavy Rainfall Advisory',
        content:
          'Due to heavy rainfall warning issued by IMD, all outdoor activities are suspended until further notice. Classes will continue as per schedule. Students are advised to avoid waterlogged areas.',
        category: 'Emergency',
        priority: 'critical',
        targetAudience: 'all',
        author: admin._id,
      },
    ]);
    console.log(`📢 Created ${announcements.length} announcements`);

    // ─── DISCUSSIONS ─────────────────────────────────────────
    const discussions = await Discussion.create([
      {
        title: 'Best resources to learn React.js from scratch?',
        body: 'I want to start learning React.js for an upcoming hackathon. I have basic HTML/CSS/JS knowledge. What are the best free resources, tutorials, or YouTube channels you recommend? Also, should I learn Redux first or after basics?',
        category: 'Technical',
        author: alex._id,
        tags: ['react', 'webdev', 'learning', 'javascript'],
        upvotes: [priya._id, arif._id, gdscLead._id],
        replies: [
          {
            author: gdscLead._id,
            content:
              'Start with the official React docs (react.dev) — they have an amazing interactive tutorial. Then check out "Full Stack Open" by University of Helsinki. For Redux, learn React basics first, then move to Context API, and finally Redux Toolkit.',
            upvotes: [alex._id, priya._id],
          },
          {
            author: faculty._id,
            content:
              'I recommend building small projects after each concept. Try a todo app, a weather dashboard, and then a full-stack project. Theory without practice won\'t stick.',
            isFacultyEndorsed: true,
            upvotes: [alex._id, gdscLead._id, arif._id],
          },
        ],
      },
      {
        title: 'Tips for cracking Google interviews?',
        body: 'Any seniors who have been through the Google interview process? What topics should I focus on? How many months of preparation did you need? Any specific problem sets or patterns to master?',
        category: 'Career',
        author: priya._id,
        tags: ['placements', 'google', 'dsa', 'interview'],
        upvotes: [alex._id, arif._id],
        replies: [
          {
            author: alex._id,
            content:
              'Focus on: Arrays, Trees, Graphs, Dynamic Programming, and System Design basics. I used LeetCode (top 150) + Striver\'s SDE sheet. Give yourself at least 4-5 months of consistent practice.',
            upvotes: [priya._id],
          },
        ],
      },
      {
        title: 'Looking for teammates for HackCampus 2024!',
        body: 'I\'m a frontend developer (React, Tailwind) looking for 2-3 teammates for HackCampus. Ideally need: 1 backend dev (Node/Python), 1 ML/AI person, and 1 designer. DM me or reply here if interested!',
        category: 'General',
        author: alex._id,
        tags: ['hackathon', 'team', 'hackcampus'],
        upvotes: [priya._id, sneha._id],
      },
      {
        title: 'Hostel mess food quality has dropped significantly',
        body: 'The mess food quality in Block C hostel has been terrible for the past 2 weeks. Stale rotis, cold rice, and practically no vegetables. Has anyone filed a complaint with the warden? Should we collectively approach the administration?',
        category: 'Campus Life',
        author: arif._id,
        tags: ['hostel', 'mess', 'complaint', 'campus-life'],
        upvotes: [alex._id, priya._id, sneha._id],
        replies: [
          {
            author: sneha._id,
            content:
              'Same issue in Block A! I spoke to the warden last week but nothing changed. Maybe we should draft a formal complaint signed by all affected students and submit it to the Dean.',
            upvotes: [arif._id, alex._id],
          },
        ],
      },
    ]);
    console.log(`💬 Created ${discussions.length} discussions`);

    // ─── NOTIFICATIONS ───────────────────────────────────────
    await Notification.create([
      {
        recipient: alex._id,
        title: 'Event Registration Confirmed',
        message: 'You have been successfully registered for HackCampus 2024. Your ticket code: CC-HCK2024A',
        type: 'event_reminder',
        actionUrl: '/events',
      },
      {
        recipient: alex._id,
        title: 'New Placement Announcement',
        message: 'Google, Microsoft, and Amazon placement drives are scheduled for December. Check eligibility and register now.',
        type: 'announcement',
        actionUrl: '/announcements',
      },
      {
        recipient: priya._id,
        title: 'Welcome to Robotics & Innovation Lab',
        message: 'You have been promoted to Core Team member in the Robotics & Innovation Lab!',
        type: 'club_invite',
        actionUrl: '/clubs',
      },
      {
        recipient: arif._id,
        title: 'New Reply on Your Discussion',
        message: 'Sneha Reddy replied to your discussion: "Hostel mess food quality has dropped significantly"',
        type: 'discussion_reply',
        actionUrl: '/discussions',
      },
    ]);
    console.log('🔔 Created sample notifications');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('┌───────────────────────────────────────────────────────┐');
    console.log('│             DEMO ACCOUNTS FOR TESTING                │');
    console.log('├───────────────────────────────────────────────────────┤');
    console.log('│  Admin:      admin@campus.edu       / Admin@123      │');
    console.log('│  Faculty:    sharma.cse@campus.edu   / Faculty@123   │');
    console.log('│  Club Lead:  gdsc.lead@campus.edu    / Lead@123      │');
    console.log('│  Student:    alex.student@campus.edu  / Student@123  │');
    console.log('└───────────────────────────────────────────────────────┘\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
