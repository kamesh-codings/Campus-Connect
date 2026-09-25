const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Club = require('../models/Club');
const Resource = require('../models/Resource');
const Discussion = require('../models/Discussion');

const seedResourcesAndExtracurriculars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusconnect');
    console.log('Connected to MongoDB for Resources & Profile enhancements...');

    const admin = await User.findOne({ role: 'admin' });
    const faculty = await User.findOne({ role: 'faculty' });
    const clubLead = await User.findOne({ role: 'club_admin' });
    const muthamilClub = await Club.findOne({ name: /Muthamil/i }) || await Club.findOne();

    // 1. Seed Campus Resources (Content & File Sharing)
    await Resource.deleteMany({});
    const sampleResources = [
      {
        title: 'Pongal Thiruvizha 2026 Official Event Poster',
        description: 'High-resolution official banner and guidelines for the statewide Pongal Cultural Festival hosted by Muthamil Mandram.',
        fileUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        fileName: 'pongal_thiruvizha_2026_poster.png',
        fileType: 'image/png',
        fileSize: 2450000,
        category: 'Event Poster',
        uploadedBy: clubLead?._id || admin?._id,
        club: muthamilClub?._id,
        downloads: 142,
      },
      {
        title: 'Odd Semester 2026 End-Semester Exam Schedule & Timetable',
        description: 'Official Anna University / Autonomous end-semester examination time table across all engineering departments.',
        fileUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80',
        fileName: 'semester_exam_timetable_2026.pdf',
        fileType: 'application/pdf',
        fileSize: 890000,
        category: 'Academic Notice',
        uploadedBy: admin?._id,
        downloads: 512,
      },
      {
        title: 'Campus Hackathon 2026 Problem Statements & Starter Kit',
        description: 'Comprehensive problem statements, API specifications, and cloud sandbox credits guide for the 24-Hour Hackathon.',
        fileUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
        fileName: 'hackathon_2026_starter_pack.pdf',
        fileType: 'application/pdf',
        fileSize: 1750000,
        category: 'Club Resource',
        uploadedBy: clubLead?._id || admin?._id,
        club: muthamilClub?._id,
        downloads: 289,
      },
      {
        title: 'CS8601 - Mobile Computing Syllabus & Question Bank',
        description: 'Department of Computer Science unit-wise study materials, lecture slides, and previous year university question papers.',
        fileUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        fileName: 'cs8601_question_bank_units1_5.pdf',
        fileType: 'application/pdf',
        fileSize: 3400000,
        category: 'Syllabus & Material',
        uploadedBy: faculty?._id || admin?._id,
        downloads: 378,
      },
      {
        title: 'Campus Code of Conduct & Anti-Ragging Handbook 2026',
        description: 'UGC and AICTE mandated campus guidelines, grievance redressal committee contacts, and student safety directives.',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
        fileName: 'campus_student_handbook_2026.pdf',
        fileType: 'application/pdf',
        fileSize: 1200000,
        category: 'General',
        uploadedBy: admin?._id,
        downloads: 620,
      }
    ];

    await Resource.insertMany(sampleResources);
    console.log(`✅ Seeded ${sampleResources.length} campus shared resources!`);

    // 2. Enhance Student Profiles with Extracurricular Activities & Academic Info
    const students = await User.find({ role: 'student' });
    const sampleExtracurriculars = [
      ['Tamil Debate Team', 'Rotaract Club Volunteer', 'Inter-College Basketball'],
      ['Robotics Society', 'NSS Campus Lead', 'Badminton Doubles Finalist'],
      ['Music Band Keyboardist', 'Open Source Contributor', 'Chess Club Captain'],
      ['Kavithai Mandram Poet', 'Technical Paper Presenter', 'Campus Green Volunteer'],
      ['Quiz Club Lead', 'Google Developer Student Club Core Member', 'Table Tennis'],
    ];

    for (let i = 0; i < students.length; i++) {
      const s = students[i];
      s.extracurricularActivities = sampleExtracurriculars[i % sampleExtracurriculars.length];
      s.academicInfo = {
        gpa: (8.2 + (i % 15) * 0.1).toFixed(2) + ' / 10',
        specialization: i % 2 === 0 ? 'Full Stack & Indic NLP' : 'Cloud Architecture & DevOps',
        semester: s.yearOfStudy ? s.yearOfStudy * 2 : 6,
      };
      if (!s.achievements || s.achievements.length === 0) {
        s.achievements = [
          { title: '1st Prize Hackathon 2025', icon: '🏆', description: 'Winner of State-Level Smart Tamil Nadu Hackathon' },
          { title: 'Centum in Data Structures', icon: '⭐', description: 'Academic excellence certificate from HOD' },
          { title: 'Best Campus Volunteer', icon: '🎖️', description: 'Recognized for organizing Pongal Thiruvizha 2025' }
        ];
      }
      await s.save();
    }
    console.log(`✅ Updated ${students.length} student profiles with extracurricular activities and academic records!`);

    // 3. Ensure at least one discussion has a reported state for admin moderation demo
    const sampleDisc = await Discussion.findOne();
    if (sampleDisc) {
      sampleDisc.isReported = true;
      sampleDisc.reportReason = 'Flagged for off-topic advertisement in academic thread';
      sampleDisc.reportedBy = [students[0]?._id];
      await sampleDisc.save();
      console.log('✅ Marked sample discussion as reported for Admin Content Moderation testing!');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding resources:', err);
    process.exit(1);
  }
};

seedResourcesAndExtracurriculars();
