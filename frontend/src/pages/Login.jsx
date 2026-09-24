import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Shield, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Mail, 
  Lock, 
  ChevronLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null); // null = show 4 role boxes view
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      dbRole: 'student',
      title: 'Student',
      badge: 'Student Portal',
      icon: GraduationCap,
      description: 'Access course materials, campus events, and peer discussions',
      demoEmail: 'alex.student@campus.edu',
      demoPassword: 'Student@123',
      colorClass: 'badge-success',
      activeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      btnClass: 'bg-emerald-600 hover:bg-emerald-500',
    },
    {
      id: 'faculty',
      dbRole: 'faculty',
      title: 'Faculty',
      badge: 'Faculty Portal',
      icon: BookOpen,
      description: 'Manage coursework, campus announcements, and student grades',
      demoEmail: 'sharma.cse@campus.edu',
      demoPassword: 'Faculty@123',
      colorClass: 'badge-warning',
      activeColor: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      btnClass: 'bg-amber-600 hover:bg-amber-500',
    },
    {
      id: 'lead',
      dbRole: 'club_admin',
      title: 'Club Lead',
      badge: 'Club Portal',
      icon: Users,
      description: 'Organize campus events, activities, and manage club members',
      demoEmail: 'gdsc.lead@campus.edu',
      demoPassword: 'Lead@123',
      colorClass: 'badge-primary',
      activeColor: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10',
      btnClass: 'bg-indigo-600 hover:bg-indigo-500',
    },
    {
      id: 'admin',
      dbRole: 'admin',
      title: 'Administrator',
      badge: 'Admin Portal',
      icon: Shield,
      description: 'Full administrative control, user audit, and portal configuration',
      demoEmail: 'admin@campus.edu',
      demoPassword: 'Admin@123',
      colorClass: 'badge-danger',
      activeColor: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      btnClass: 'bg-rose-600 hover:bg-rose-500',
    },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(role.demoEmail);
    setPassword(role.demoPassword);
    setIsManualMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requiredRole = isManualMode ? null : selectedRole?.dbRole;
      await login(email, password, requiredRole);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header Layout: Logo Side-by-Side Next to Title */}
        <div className="flex flex-col items-center justify-center mb-10 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3.5 mb-2">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/30 neu-button shrink-0">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight font-['Outfit']">
              CampusConnect
            </h1>
          </div>
          <p className="text-text-secondary text-base font-normal">
            Sign in to your campus portal
          </p>
        </div>

        {/* VIEW 1: 4 ROLE BOXES SELECTION WITH INCREASED SPACING */}
        {!selectedRole && !isManualMode ? (
          <div className="w-full space-y-8 animate-fade-in-up">
            <div className="text-center">
              <span className="text-xs uppercase font-semibold text-text-muted tracking-wider inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Sparkles size={14} className="text-accent" /> Select your role to sign in
              </span>
            </div>

            {/* Grid with Increased Spacing & Neumorphic-Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r)}
                    className="glass-neu-card p-6 sm:p-7 min-h-[200px] cursor-pointer hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-11 h-11 rounded-xl bg-surface-dark/90 border border-white/10 flex items-center justify-center text-primary-light neu-button group-hover:scale-105 transition-transform">
                          <Icon size={22} />
                        </div>
                        <span className={`badge ${r.colorClass} text-xs px-3 py-1 font-semibold`}>
                          {r.badge}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary-light transition-colors mb-2 font-['Outfit']">
                        {r.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed mb-4 font-normal">
                        {r.description}
                      </p>
                    </div>

                    <div className="pt-3.5 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                      <span className="font-mono text-xs truncate max-w-[190px]">
                        {r.demoEmail}
                      </span>
                      <span className="text-primary-light font-semibold text-xs group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Select &rarr;
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsManualMode(true)}
                className="text-xs sm:text-sm font-medium text-text-muted hover:text-white transition-colors underline decoration-dashed underline-offset-4"
              >
                Sign in with custom credentials (General Login)
              </button>
            </div>
          </div>
        ) : (

        /* VIEW 2: DEDICATED LOGIN FORM WITH ZERO-OVERLAP NEUMORPHIC INPUTS */
          <div className="w-full max-w-md mx-auto animate-fade-in-up">
            <button
              onClick={() => {
                setSelectedRole(null);
                setIsManualMode(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-muted hover:text-white mb-5 transition-colors"
            >
              <ChevronLeft size={18} /> Back to Role Selection
            </button>

            <div className="glass-neu-card p-8 shadow-2xl relative">
              
              {/* Form Title & Role Verification Badge */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2 font-['Outfit']">
                  {selectedRole ? (
                    <>
                      <selectedRole.icon size={24} className="text-primary-light" />
                      {selectedRole.title} Login
                    </>
                  ) : (
                    'General Account Login'
                  )}
                </h2>
                {selectedRole && (
                  <p className="text-xs text-emerald-400 font-mono mt-1.5 flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} /> MongoDB Role Validation Enabled
                  </p>
                )}
              </div>

              {/* QUICK DEMO ROLE SWITCHER BOX */}
              <div className="mb-6 bg-slate-950/70 p-2.5 rounded-xl border border-white/10">
                <span className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1 text-center">
                  Quick Auto-Fill Role Box
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all text-center truncate ${
                        selectedRole?.id === r.id
                          ? r.activeColor
                          : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                      title={r.demoEmail}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* LOGIN FORM WITH TACTILE NEUMORPHIC INPUTS */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@campus.edu"
                      className="neu-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="neu-input"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-xl text-white font-semibold text-sm transition-all neu-button flex items-center justify-center gap-2 mt-3 ${
                    selectedRole ? selectedRole.btnClass : 'btn-primary'
                  }`}
                >
                  {loading ? 'Verifying Credentials...' : `Sign In as ${selectedRole ? selectedRole.title : 'User'}`}
                  <ArrowRight size={18} />
                </button>
              </form>

              <p className="text-center text-xs sm:text-sm text-text-muted mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-light hover:underline font-semibold">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
