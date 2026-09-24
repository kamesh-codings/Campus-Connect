import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    department: 'CSE', yearOfStudy: 1, studentId: '', role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT', 'CHEM', 'BIO'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4 sm:p-8">
      <div className="w-full max-w-lg mx-auto">
        
        {/* Header Layout: Logo Side-by-Side Next to Title */}
        <div className="flex flex-col items-center justify-center mb-8 text-center animate-fade-in-up">
          <div className="flex items-center justify-center gap-3.5 mb-2">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/30 neu-button shrink-0">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight font-['Outfit']">
              Join CampusConnect
            </h1>
          </div>
          <p className="text-text-secondary text-base font-normal">
            Create your student profile
          </p>
        </div>

        {/* Clean Glassmorphic & Neumorphic Registration Form */}
        <div className="glass-neu-card p-8 shadow-2xl animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="neu-input" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Student ID</label>
                <input name="studentId" value={formData.studentId} onChange={handleChange} placeholder="CS21089" className="neu-input input-field-no-icon" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@campus.edu" className="neu-input" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="neu-input input-field-no-icon cursor-pointer">
                  {departments.map((d) => (
                    <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Year of Study</label>
                <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="neu-input input-field-no-icon cursor-pointer">
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y} className="bg-slate-900 text-white">Year {y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="neu-input" required minLength={6} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="neu-input" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary neu-button w-full justify-center py-3 text-sm mt-3">
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-light hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
