import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Shield, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Mail, 
  Lock, 
  Sparkles,
  MessageSquare,
  QrCode,
  Zap,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('kaviya.student@campus.edu');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const demoRoles = [
    {
      id: 'student',
      dbRole: 'student',
      title: 'Student',
      badge: 'Student',
      icon: GraduationCap,
      description: 'Campus feed, events, clubs, study notes & peer Q&A',
      demoEmail: 'kaviya.student@campus.edu',
      demoPassword: 'Student@123',
      activeClass: 'border-emerald-500 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/50',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'lead',
      dbRole: 'club_admin',
      title: 'Club Lead',
      badge: 'Club Admin',
      icon: Users,
      description: 'Manage club events, publish announcements & verify QR passes',
      demoEmail: 'karthik.lead@campus.edu',
      demoPassword: 'Lead@123',
      activeClass: 'border-indigo-500 bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/50',
      tagColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'faculty',
      dbRole: 'faculty',
      title: 'Faculty',
      badge: 'Faculty',
      icon: BookOpen,
      description: 'Post official alerts & verify academic discussion answers',
      demoEmail: 'radhakrishnan.cse@campus.edu',
      demoPassword: 'Faculty@123',
      activeClass: 'border-amber-500 bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/50',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'admin',
      dbRole: 'admin',
      title: 'Admin',
      badge: 'System Admin',
      icon: Shield,
      description: 'Campus governance, user roles & content moderation',
      demoEmail: 'admin@campus.edu',
      demoPassword: 'Admin@123',
      activeClass: 'border-rose-500 bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/50',
      tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setEmail(role.demoEmail);
    setPassword(role.demoPassword);
    toast.success(`Selected role: ${role.title}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      return toast.error('Please enter both email and password');
    }

    setLoading(true);
    try {
      const activeRoleObj = demoRoles.find((r) => r.id === selectedRole);
      await login(email.trim(), password.trim(), activeRoleObj ? activeRoleObj.dbRole : null);
      toast.success('Welcome back to CampusConnect!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const activeRoleData = demoRoles.find((r) => r.id === selectedRole) || demoRoles[0];

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-grid-pattern">
      {/* Background Aurora Lighting Orbs */}
      <div className="absolute -top-36 -left-36 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[480px] h-[480px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 left-1/3 w-[500px] h-[400px] bg-purple-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        
        {/* ── LEFT HERO: BRANDING & PLATFORM HIGHLIGHTS ─────────────────── */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 lg:pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold w-fit">
            <Sparkles size={14} className="animate-pulse text-indigo-400" />
            <span>Digital Campus Operating System</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white font-['Outfit']">
              Campus<span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">Connect</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
              The unified digital platform for student clubs, campus hackathons, 1-tap digital QR passes, official broadcasts, and peer Q&A.
            </p>
          </div>

          {/* Floating Feature Highlight Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="glass p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <QrCode size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">QR Passes</p>
                <p className="text-[11px] text-slate-400">1-Tap RSVP</p>
              </div>
            </div>

            <div className="glass p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Live Feed</p>
                <p className="text-[11px] text-slate-400">Personalized</p>
              </div>
            </div>

            <div className="glass p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Peer Q&A</p>
                <p className="text-[11px] text-slate-400">Faculty Verified</p>
              </div>
            </div>
          </div>

          {/* Live System Status Tag */}
          <div className="glass p-4 rounded-2xl border border-white/10 hidden sm:flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-300">Live Institutional System • All Roles Active</span>
            </div>
            <span className="font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              v2.5 Ready
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL: ROLE-BASED LOGIN CARD ──────────────────────── */}
        <div className="lg:col-span-6 w-full">
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Top Gradient Accent Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-['Outfit']">Sign In to Campus</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                  <ShieldCheck size={14} className="text-indigo-400" />
                  Single Sign-On
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                Select your campus role to load credentials and sign in
              </p>
            </div>

            {/* 4 Role Selector Buttons */}
            <div className="mb-6 bg-slate-900/90 p-3 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={12} className="text-indigo-400" />
                  Select Campus Role
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${activeRoleData.tagColor}`}>
                  {activeRoleData.badge}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {demoRoles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleSelectRole(role)}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? role.activeClass
                          : 'border-white/5 bg-[#0D111A]/80 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon size={18} className={isSelected ? 'text-inherit' : 'text-slate-400'} />
                      <span className="truncate w-full text-center text-xs font-medium">{role.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Role Description Hint */}
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-slate-400 px-1">
                <CheckCircle2 size={13} className="text-indigo-400 shrink-0" />
                <span className="truncate">{activeRoleData.description}</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  College Email Address
                </label>
                <div className="flex items-center bg-[#080B12] border border-white/10 rounded-xl px-3.5 h-11 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <Mail size={18} className="text-slate-400 shrink-0 mr-3 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your college email"
                    className="w-full bg-transparent border-none p-0 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 font-sans"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <span className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                    Institutional Reset
                  </span>
                </div>
                <div className="flex items-center bg-[#080B12] border border-white/10 rounded-xl px-3.5 h-11 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                  <Lock size={18} className="text-slate-400 shrink-0 mr-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-transparent border-none p-0 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-0 font-sans"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-slate-400 hover:text-slate-200 ml-2.5 shrink-0 cursor-pointer p-0.5 rounded-lg hover:bg-white/5 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 text-xs text-slate-400 hover:text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#080B12] border-white/20 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer accent-indigo-600"
                  />
                  <span>Remember this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In as {activeRoleData.title}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Institutional Security Notice Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Authorized Campus Access Only</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Student, Faculty, Club Lead, and Admin accounts are managed by the Campus Academic Office.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
