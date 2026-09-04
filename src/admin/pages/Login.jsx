import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSetupMessage('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleSetupInitialAdmin = async () => {
    try {
      setLoading(true);
      setError('');
      setSetupMessage('');

      const res = await fetch('http://localhost:5000/api/admin/auth/setup-initial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Super Admin',
          email: 'admin@aham.com',
          password: 'Admin@123456',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSetupMessage('Initial Super Admin created! Email: admin@aham.com / Pass: Admin@123456');
        setEmail('admin@aham.com');
        setPassword('Admin@123456');
      } else {
        setError(data.message || 'Setup failed');
      }
    } catch (err) {
      console.error('Setup initial admin error:', err);
      setError('Backend API is unreachable. Please make sure server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-brand-primary/40 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Branding */}
        <div className="bg-brand-primary p-8 text-center text-brand-cream relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3 text-brand-accent">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-white">AHAM ADMIN</h1>
          <p className="text-xs text-brand-cream/80 uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <ShieldAlert size={20} className="shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {setupMessage && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              {setupMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aham.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Initial Setup Bootstrap Helper */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 mb-2">First time setting up the environment?</p>
            <button
              onClick={handleSetupInitialAdmin}
              type="button"
              className="text-xs font-medium text-brand-primary hover:underline"
            >
              Click here to Seed Initial Super Admin Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
