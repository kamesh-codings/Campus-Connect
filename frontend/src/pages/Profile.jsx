import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Building,
  Edit3,
  X,
  Tag,
  Users,
  Ticket,
  Sparkles,
  Trophy,
  Shield,
  BookOpen,
  Activity,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquare,
  BarChart3,
  ExternalLink,
  QrCode,
  FileText,
  Clock,
  Briefcase,
  Layers,
  Flame,
  ShieldAlert,
  Server
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    yearOfStudy: '',
    bio: '',
    skills: '',
    interests: '',
    extracurricularActivities: '',
    gpa: '',
    specialization: '',
    officeHours: '',
    designation: '',
  });

  useEffect(() => {
    fetchProfile();
  }, [user?._id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/users/profile/${user?._id || ''}`);
      setProfileData(res.data);
      setFormData({
        name: res.data.name || '',
        department: res.data.department || '',
        yearOfStudy: res.data.yearOfStudy || '',
        bio: res.data.bio || '',
        skills: res.data.skills?.join(', ') || '',
        interests: res.data.interests?.join(', ') || '',
        extracurricularActivities: res.data.extracurricularActivities?.join(', ') || '',
        gpa: res.data.academicInfo?.gpa || '8.8 / 10',
        specialization: res.data.academicInfo?.specialization || 'Full Stack & AI',
        officeHours: res.data.officeHours || 'Tue & Thu 2:00 PM - 4:00 PM',
        designation: res.data.designation || 'Professor & Head of Department',
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        yearOfStudy: formData.yearOfStudy ? Number(formData.yearOfStudy) : undefined,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
        extracurricularActivities: formData.extracurricularActivities.split(',').map((a) => a.trim()).filter(Boolean),
        academicInfo: {
          gpa: formData.gpa,
          specialization: formData.specialization,
          semester: formData.yearOfStudy ? Number(formData.yearOfStudy) * 2 : 6,
        },
      };

      const res = await API.put('/users/profile', payload);
      setProfileData(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Profile updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const p = profileData || user;
  const role = p?.role || 'student';
  const userPoints = p?.points || 75;

  const getTier = (pts) => {
    if (pts >= 150) return { name: 'Campus Legend', badge: 'Tier 3 Gold', color: 'text-amber-300 bg-amber-500/15 border-amber-500/30' };
    if (pts >= 75) return { name: 'Campus Contributor', badge: 'Tier 2 Silver', color: 'text-slate-200 bg-slate-500/15 border-slate-500/30' };
    return { name: 'Campus Explorer', badge: 'Tier 1 Bronze', color: 'text-amber-500 bg-amber-700/15 border-amber-700/30' };
  };

  const tier = getTier(userPoints);

  // Role Theme Styling
  const roleThemes = {
    student: {
      gradient: 'from-emerald-600 to-teal-500',
      badge: 'Student Member',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      idLabel: 'Student Roll No',
      icon: GraduationCap,
    },
    faculty: {
      gradient: 'from-amber-600 to-orange-500',
      badge: 'Faculty Member',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      idLabel: 'Faculty ID',
      icon: BookOpen,
    },
    club_admin: {
      gradient: 'from-indigo-600 to-purple-500',
      badge: 'Club Lead / Admin',
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      idLabel: 'Lead ID',
      icon: Users,
    },
    admin: {
      gradient: 'from-rose-600 to-pink-500',
      badge: 'System Administrator',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      idLabel: 'Admin ID',
      icon: Shield,
    },
  };

  const currentTheme = roleThemes[role] || roleThemes.student;
  const RoleIcon = currentTheme.icon;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up pb-12 font-sans">
      
      {/* ── 1. UNIFIED HERO IDENTITY BANNER ──────────────────── */}
      <div className="p-6 sm:p-7 rounded-xl bg-[#0D111A] border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${currentTheme.gradient} flex items-center justify-center text-3xl font-bold text-white shadow-xl shrink-0 ring-4 ring-white/5`}>
            {p?.name?.charAt(0) || 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">
                    {p?.name}
                  </h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentTheme.badgeClass}`}>
                    <RoleIcon size={12} />
                    {currentTheme.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {p?.email} • {currentTheme.idLabel}: {p?.studentId || (role === 'faculty' ? 'FAC-CSE-042' : role === 'admin' ? 'ADM-CAMPUS-01' : 'CS21098')}
                </p>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-semibold transition-colors cursor-pointer self-center sm:self-start"
              >
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mt-2">
              {p?.bio || (
                role === 'faculty'
                  ? 'Professor & Academic Advisor. Guiding student research in Artificial Intelligence, NLP, and campus development.'
                  : role === 'club_admin'
                  ? 'Club Administrator organizing campus hackathons, technical workshops, and student networking sessions.'
                  : role === 'admin'
                  ? 'Platform administrator managing institutional governance, user moderation, and campus digital operations.'
                  : 'Campus student participating in hackathons, open source clubs, and technical workshops.'
              )}
            </p>

            {/* Quick Badges Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3.5 pt-3 border-t border-white/5 text-xs text-slate-400">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                <Building size={13} className="text-indigo-400" />
                {p?.department || 'CSE'} Department
              </span>

              {role === 'student' && (
                <>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <GraduationCap size={13} className="text-cyan-400" />
                    Year {p?.yearOfStudy || '3'} of 4 (Sem {p?.academicInfo?.semester || (p?.yearOfStudy ? p.yearOfStudy * 2 : 6)})
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <BookOpen size={13} className="text-emerald-400" />
                    CGPA: {p?.academicInfo?.gpa || '8.8 / 10'}
                  </span>
                </>
              )}

              {role === 'faculty' && (
                <>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <Briefcase size={13} className="text-amber-400" />
                    Professor & HOD
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <Clock size={13} className="text-cyan-400" />
                    Office: Room 304, CSE Block
                  </span>
                </>
              )}

              {role === 'club_admin' && (
                <>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <Users size={13} className="text-indigo-400" />
                    President & Event Organizer
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <QrCode size={13} className="text-purple-400" />
                    Pass Verifier Authorized
                  </span>
                </>
              )}

              {role === 'admin' && (
                <>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <ShieldAlert size={13} className="text-rose-400" />
                    Platform Governance Lead
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5">
                    <Server size={13} className="text-emerald-400" />
                    Root Admin Clearance
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. ROLE-SPECIFIC CONTENT DASHBOARD
          ══════════════════════════════════════════════════════════════════ */}

      {/* ── [A] STUDENT ROLE VIEW ────────────────────────────────────── */}
      {role === 'student' && (
        <>
          {/* Academic Profile & Reputation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Academic Information
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">Current CGPA:</span>
                  <span className="font-bold text-white font-mono">{p?.academicInfo?.gpa || '8.8 / 10'}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">Specialization:</span>
                  <span className="font-semibold text-indigo-300 truncate max-w-[150px]">{p?.academicInfo?.specialization || 'Full Stack & AI'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Enrolled Clubs:</span>
                  <span className="font-semibold text-cyan-300 font-mono">{p?.joinedClubs?.length || 2} active</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 p-4 rounded-xl bg-[#0D111A] border border-indigo-500/20 shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">Campus Reputation Tier</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${tier.color}`}>
                        {tier.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Awarded for hackathon RSVP check-ins and forum contributions.</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold text-white">{userPoints}</span>
                  <span className="text-xs text-indigo-300 ml-1 font-mono font-medium">pts</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5 mt-2">
                <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
                  <span className="text-xs font-bold text-white block">Pioneer</span>
                  <span className="text-[11px] text-slate-400">Verified</span>
                </div>
                <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
                  <span className="text-xs font-bold text-white block">Passes</span>
                  <span className="text-[11px] text-slate-400">QR Ready</span>
                </div>
                <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
                  <span className="text-xs font-bold text-white block">Member</span>
                  <span className="text-[11px] text-slate-400">Active</span>
                </div>
                <div className="text-center p-1.5 rounded-lg bg-slate-900 border border-white/5">
                  <span className="text-xs font-bold text-white block">Top +25</span>
                  <span className="text-[11px] text-slate-400">Contributor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills, Interests & Extracurriculars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Tag size={13} className="text-indigo-400" />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(p?.skills && p.skills.length > 0 ? p.skills : ['React', 'Node.js', 'Python', 'TailwindCSS']).map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Sparkles size={13} className="text-cyan-400" />
                Campus Interests
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(p?.interests && p.interests.length > 0 ? p.interests : ['Hackathons', 'Robotics', 'AI Research']).map((i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-xs font-medium">
                    {i}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Activity size={13} className="text-emerald-400" />
                Extracurriculars
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(p?.extracurricularActivities && p.extracurricularActivities.length > 0 ? p.extracurricularActivities : ['Tamil Debate Team', 'NSS Volunteer', 'Basketball']).map((act) => (
                  <span key={act} className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs font-medium">
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Student Achievements */}
          <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award size={14} className="text-amber-400" />
              Verified Student Achievements & Honors
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(p?.achievements && p.achievements.length > 0 ? p.achievements : [
                { title: '1st Prize Hackathon 2025', icon: '🏆', description: 'Winner of State-Level Smart Tamil Nadu Hackathon' },
                { title: 'Centum in Data Structures', icon: '⭐', description: 'Academic excellence certificate from HOD' },
                { title: 'Best Campus Volunteer', icon: '🎖️', description: 'Recognized for organizing Pongal Thiruvizha' }
              ]).map((ach, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ach.icon || '🏆'}</span>
                    <h4 className="text-xs font-bold text-white truncate">{ach.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── [B] FACULTY ROLE VIEW ────────────────────────────────────── */}
      {role === 'faculty' && (
        <>
          {/* Faculty Authority & Mentorship Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0D111A] border border-amber-500/20 shadow-md">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Verified Answers</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">34</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Academic Q&A Endorsements</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">Broadcasts</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">12</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Official Announcements</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Projects Mentored</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">18</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Final Year Student Teams</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Club Advisory</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">2</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Faculty Guided Chapters</span>
            </div>
          </div>

          {/* Courses & Office Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={14} className="text-amber-400" />
                Courses Taught (Current Semester)
              </h3>
              <div className="space-y-2">
                {[
                  { code: 'CS301', name: 'Data Structures & Algorithms', credits: '4 Credits', students: '120 Students' },
                  { code: 'CS702', name: 'Deep Learning & Indic NLP', credits: '3 Credits', students: '65 Students' },
                  { code: 'CS504', name: 'Compiler Design & Automata', credits: '4 Credits', students: '110 Students' },
                ].map((c) => (
                  <div key={c.code} className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-indigo-400 mr-2">{c.code}</span>
                      <span className="text-white font-medium">{c.name}</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{c.students}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                Office Hours & Academic Guidance
              </h3>
              <div className="p-3.5 rounded-lg bg-slate-900 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Office Hours:</span>
                  <span className="text-white font-medium">Tue & Thu • 2:00 PM – 4:30 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Cabin Location:</span>
                  <span className="text-white font-medium">Room 304, Department of CSE</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Research Supervision:</span>
                  <span className="text-emerald-400 font-medium">4 Ph.D. Scholars • 12 M.E. Theses</span>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  to="/discussions"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  <MessageSquare size={13} />
                  <span>Review & Endorse Academic Discussion Answers →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Research Publications */}
          <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Award size={14} className="text-amber-400" />
              Recent Research Publications & Grants
            </h3>
            <div className="space-y-2.5">
              {[
                { title: 'IndicBERT: Low-Resource Tamil NLP via Transformer Models', journal: 'IEEE Transactions on Artificial Intelligence', year: '2025' },
                { title: 'Optimized Memory Hierarchy in Distributed Edge AI Systems', journal: 'ACM Computing Surveys', year: '2024' },
                { title: 'Tamil Classical Script Digitization via Convolutional Neural Networks', journal: 'Springer AI & Language Processing', year: '2024' },
              ].map((pub, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/5 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">{pub.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{pub.journal}</p>
                  </div>
                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                    {pub.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── [C] CLUB LEAD ROLE VIEW ──────────────────────────────────── */}
      {role === 'club_admin' && (
        <>
          {/* Club Management Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0D111A] border border-indigo-500/20 shadow-md">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">Club Members</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">140+</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Active Chapter Students</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">Events Hosted</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">6</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Workshops & Hackathons</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">QR Passes Scanned</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">320+</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Verified Check-Ins</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Chapter Rating</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">4.9 ★</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Campus Standing</span>
            </div>
          </div>

          {/* Quick Leadership Actions */}
          <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400" />
              Club Leadership Controls & Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/events"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 transition-all group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Calendar size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Publish Event</h4>
                  <p className="text-[11px] text-slate-400">Launch hackathon or workshop</p>
                </div>
              </Link>

              <Link
                to="/events"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-purple-500/30 transition-all group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                  <QrCode size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Scan QR Tickets</h4>
                  <p className="text-[11px] text-slate-400">Rapid attendee check-in</p>
                </div>
              </Link>

              <Link
                to="/announcements"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/30 transition-all group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">Club Broadcast</h4>
                  <p className="text-[11px] text-slate-400">Post update to all members</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Club Chapter Milestones */}
          <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Trophy size={14} className="text-amber-400" />
              Club Chapter Milestones & Awards
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Best Student Chapter 2025', icon: '🏆', description: 'Awarded for highest active membership and technical projects.' },
                { title: 'State-Level Hackathon 1st Place', icon: '🥇', description: 'Club members secured victory at Smart Campus Summit.' },
                { title: '100% Digital Check-In Rate', icon: '⚡', description: 'Streamlined zero-paper QR entry across all 6 events.' },
              ].map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{m.icon}</span>
                    <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── [D] ADMINISTRATOR ROLE VIEW ──────────────────────────────── */}
      {role === 'admin' && (
        <>
          {/* Institutional Governance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0D111A] border border-rose-500/20 shadow-md">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">System Health</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono block mt-1">99.98%</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">All Microservices Online</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">Campus Users</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">1,250+</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Active Accounts</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Campus Clubs</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">10</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Registered Societies</span>
            </div>
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 shadow-md">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Moderation Queue</span>
              <span className="text-2xl font-bold text-white font-mono block mt-1">Clean</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">0 Pending Violations</span>
            </div>
          </div>

          {/* Admin Control Hub */}
          <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={14} className="text-rose-400" />
              Institutional Administrative Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                to="/admin"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-rose-500/30 transition-all group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">Admin Dashboard</h4>
                  <p className="text-[11px] text-slate-400">Content moderation & actions</p>
                </div>
              </Link>

              <Link
                to="/analytics"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 transition-all group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">Campus Analytics</h4>
                  <p className="text-[11px] text-slate-400">Attendance, engagement & RSVP stats</p>
                </div>
              </Link>

              <Link
                to="/announcements"
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-amber-500/30 transition-all group flex items-center gap-3"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">Official Broadcasts</h4>
                  <p className="text-[11px] text-slate-400">University-wide alerts</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Audit & Security Policy */}
          <div className="p-5 rounded-xl bg-[#0D111A] border border-white/10 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Campus System Governance & Privileges
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Closed Institutional Portal Security</span>
                  <span className="text-slate-400 text-[11px]">Public registration disabled. Role-based access controlled via institutional directory.</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[10px]">
                  ENFORCED
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Content Moderation & Report Review</span>
                  <span className="text-slate-400 text-[11px]">Community-reported discussion threads automatically queued for admin adjudication.</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono text-[10px]">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── 5. EDIT PROFILE MODAL ────────────────────────── */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
          <div className="bg-[#0D111A] max-w-lg w-full rounded-xl p-6 relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl font-sans">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              Edit {currentTheme.badge} Profile
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Update your biographical details, skills, and personal information.
            </p>

            <form onSubmit={handleUpdate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {role === 'student' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Technical Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="React, Node.js, Python, Tailwind"
                        className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Campus Interests</label>
                      <input
                        type="text"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        placeholder="Hackathons, Robotics, AI"
                        className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Extracurricular Activities</label>
                    <input
                      type="text"
                      value={formData.extracurricularActivities}
                      onChange={(e) => setFormData({ ...formData, extracurricularActivities: e.target.value })}
                      placeholder="Tamil Debate Team, NSS Volunteer, Chess Club"
                      className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </>
              )}

              {['admin', 'faculty', 'club_admin'].includes(role) && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Areas of Expertise / Specializations</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Machine Learning, Indic NLP, Distributed Systems"
                    className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Statement</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your role description, academic focus, or interests..."
                  className="w-full bg-[#080B12] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
