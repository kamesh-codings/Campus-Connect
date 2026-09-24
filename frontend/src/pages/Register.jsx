import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Award,
  Shield,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'CSE',
    yearOfStudy: 1,
    studentId: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'AI&DS', 'CHEM', 'BIO', 'Administration'];

  const roleOptions = [
    { id: 'student', label: 'Student', icon: GraduationCap, activeRing: 'ring-2 ring-emerald-500 bg-emerald-500/20 text-emerald-300 border-emerald-400' },
    { id: 'faculty', label: 'Faculty', icon: BookOpen, activeRing: 'ring-2 ring-amber-500 bg-amber-500/20 text-amber-300 border-amber-400' },
    { id: 'club_admin', label: 'Club Lead', icon: Users, activeRing: 'ring-2 ring-indigo-500 bg-indigo-500/20 text-indigo-300 border-indigo-400' },
    { id: 'admin', label: 'Admin', icon: Shield, activeRing: 'ring-2 ring-rose-500 bg-rose-500/20 text-rose-300 border-rose-400' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (roleId) => {
    setFormData({ ...formData, role: roleId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      await register(data);
      toast.success('Account created successfully! Welcome to CampusConnect.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* LEFT BRANDING & BENEFITS */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold w-fit">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Join 1,200+ Campus Members</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Create your <br />
              <span className="text-indigo-400">Digital Campus Profile</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-1">
              Immediate access to club memberships, instant event RSVPs, AI-ranked campus feeds, and peer discussions.
            </p>
          </div>

          {/* Value Perks */}
          <div className="space-y-2.5 pt-1">
            <div className="p-3.5 rounded-xl bg-[#0D111A] border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 shrink-0">
                <Award size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Instant Event Pass Generation</h4>
                <p className="text-xs text-slate-400">Receive verified QR tickets for rapid check-ins at workshops and hackathons.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D111A] border border-white/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shrink-0">
                <BookOpen size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Academic Q&A & Peer Answers</h4>
                <p className="text-xs text-slate-400">Participate in student discussions with verified faculty endorsements.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: REGISTER FORM */}
        <div className="lg:col-span-7">
          <div className="glass p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Top Gradient Accent Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white tracking-tight font-['Outfit']">Create Account</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Select your role and fill in your campus details</p>
            </div>

            {/* Role Selection Toggle */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Account Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#080B12] p-1.5 rounded-xl border border-white/10">
                {roleOptions.map((r) => {
                  const Icon = r.icon;
                  const isSelected = formData.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleRoleChange(r.id)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                        isSelected
                          ? r.activeRing
                          : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-[11px]">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Full Name</label>
                  <div className="relative flex items-center">
                    <User size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {formData.role === 'student' ? 'Student ID' : 'Faculty / Staff ID'}
                  </label>
                  <input
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder={formData.role === 'student' ? 'CS21089' : 'FAC2024'}
                    className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">College Email Address</label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@campus.edu"
                    className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    {formData.role === 'student' ? 'Year of Study' : 'Experience Level'}
                  </label>
                  {formData.role === 'student' ? (
                    <select
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                      {[1, 2, 3, 4].map((y) => (
                        <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl px-3.5 text-xs text-slate-400 flex items-center">
                      Staff / Academic Lead
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Confirm Password</label>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none z-10" />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full h-11 bg-[#080B12] border border-white/10 rounded-xl pl-10 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1">
                Sign in here
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
