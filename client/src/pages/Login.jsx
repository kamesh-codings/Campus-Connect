import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@campus.edu', password: 'Admin@123', label: 'Admin', color: 'badge-danger' },
    { email: 'gdsc.lead@campus.edu', password: 'Lead@123', label: 'Club Lead', color: 'badge-primary' },
    { email: 'sharma.cse@campus.edu', password: 'Faculty@123', label: 'Faculty', color: 'badge-warning' },
    { email: 'alex.student@campus.edu', password: 'Student@123', label: 'Student', color: 'badge-success' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center gradient-mesh p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-primary-light bg-clip-text text-transparent">
            CampusConnect
          </h1>
          <p className="text-text-secondary mt-2">Sign in to your campus portal</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@campus.edu"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-light hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-accent" />
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Quick Demo Login
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.password);
                }}
                className="glass-card px-3 py-2.5 text-left hover:border-primary/30 transition-all"
              >
                <span className={`badge ${acc.color} text-[10px] mb-1`}>{acc.label}</span>
                <p className="text-xs text-text-muted truncate">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
