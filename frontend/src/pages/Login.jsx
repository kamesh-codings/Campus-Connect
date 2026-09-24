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
      description: 'Access courses, campus events, and peer discussions',
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
      description: 'Manage coursework, announcements, and student grades',
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
      description: 'Organize campus events, activities, and club members',
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
      description: 'Full administrative control, user audit, and platform settings',
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
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Simple Classic Logo Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/30">
            <GraduationCap size={34} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
            CampusConnect
          </h1>
          <p className="text-text-secondary text-sm mt-1.5">
            Sign in to your campus portal
          </p>
        </div>

        {/* VIEW 1: 4 ROLE BOXES SELECTION */}
        {!selectedRole && !isManualMode ? (
          <div className="w-full space-y-6 animate-fade-in-up">
            <div className="text-center mb-2">
              <span className="text-xs uppercase font-semibold text-text-muted tracking-wider flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-accent" /> Select your role to sign in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleSelect(r)}
                    className="glass-card p-5 cursor-pointer hover:border-primary/40 transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-dark border border-white/10 flex items-center justify-center text-primary-light group-hover:scale-105 transition-transform">
                          <Icon size={20} />
                        </div>
                        <span className={`badge ${r.colorClass} text-[10px]`}>
                          {r.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-primary-light transition-colors mb-1">
                        {r.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        {r.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                      <span className="font-mono text-[11px] truncate max-w-[170px]">
                        {r.demoEmail}
                      </span>
                      <span className="text-primary-light font-semibold group-hover:translate-x-1 transition-transform">
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
                className="text-xs text-text-muted hover:text-white transition-colors underline decoration-dashed underline-offset-4"
              >
                Sign in with custom credentials (General Login)
              </button>
            </div>
          </div>
        ) : (

        /* VIEW 2: PERFECTLY CENTERED DEDICATED LOGIN FORM WITH ROLE SWITCHER BOX */
          <div className="w-full max-w-md mx-auto animate-fade-in-up">
            <button
              onClick={() => {
                setSelectedRole(null);
                setIsManualMode(false);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white mb-4 transition-colors"
            >
              <ChevronLeft size={16} /> Back to Role Selection
            </button>

            <div className="glass-card p-7 shadow-2xl relative">
              
              {/* Form Title & Role Verification Badge */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  {selectedRole ? (
                    <>
                      <selectedRole.icon size={22} className="text-primary-light" />
                      {selectedRole.title} Login
                    </>
                  ) : (
                    'General Account Login'
                  )}
                </h2>
                {selectedRole && (
                  <p className="text-xs text-emerald-400 font-mono mt-1 flex items-center justify-center gap-1">
                    <CheckCircle2 size={12} /> MongoDB Role Validation Enabled
                  </p>
                )}
              </div>

              {/* QUICK DEMO ROLE SWITCHER BOX */}
              <div className="mb-6 bg-surface-dark/80 p-2 rounded-xl border border-white/10">
                <span className="block text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1 text-center">
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

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@campus.edu"
                      className="input-field pl-10 text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-field pl-10 text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full btn-primary justify-center py-2.5 text-sm mt-2 ${
                    selectedRole ? selectedRole.btnClass : ''
                  }`}
                >
                  {loading ? 'Verifying...' : `Sign In as ${selectedRole ? selectedRole.title : 'User'}`}
                  <ArrowRight size={16} />
                </button>
              </form>

              <p className="text-center text-xs text-text-muted mt-5">
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
