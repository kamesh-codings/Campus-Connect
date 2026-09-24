import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
            Join CampusConnect
          </h1>
          <p className="text-text-secondary mt-2">Create your campus profile</p>
        </div>

        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="input-field pl-10" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Student ID</label>
                <input name="studentId" value={formData.studentId} onChange={handleChange} placeholder="CS21089" className="input-field" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@campus.edu" className="input-field pl-10" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="input-field">
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Year of Study</label>
                <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="input-field">
                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>Year {y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••" className="input-field pl-10" required minLength={6} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" className="input-field pl-10" required />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-light hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
