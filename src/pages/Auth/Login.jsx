import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Destination path after successful authentication
  const redirectPath = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password. Please verify your credentials.');
    }
  };

  const handleGoogleAuth = () => {
    if (toast?.info) {
      toast.info('Google OAuth Sign-In (UI Demo): Google Client ID can be configured for live backend OAuth.', 'Google Auth');
    }
  };

  return (
    <div className="bg-brand-cream-light py-16 min-h-[calc(100vh-80px)] flex items-center">
      <Container className="max-w-md">
        <div className="bg-white p-8 md:p-10 border border-brand-border shadow-sm rounded-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif text-brand-primary mb-2">Welcome Back</h1>
            <p className="text-sm text-brand-muted">
              {location.state?.from?.pathname === '/checkout'
                ? 'Sign in to your AHAM account to complete your order.'
                : 'Sign in to your AHAM account.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed rounded space-y-2">
              <p className="font-semibold">{error}</p>
              {error.includes('sign up') && (
                <div className="pt-2">
                  <Link
                    to="/register"
                    className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
                  >
                    Create Account (Sign Up)
                  </Link>
                </div>
              )}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <a href="#" className="text-xs font-medium text-brand-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <Button className="w-full mt-2" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying Credentials...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-brand-border after:h-px after:flex-1 after:bg-brand-border">
            <span className="text-xs text-brand-muted uppercase tracking-wide">Or</span>
          </div>

          <div className="mt-8">
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleAuth}>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-brand-muted">
            Don't have an account?{' '}
            <Link to="/register" state={{ from: location.state?.from }} className="font-medium text-brand-primary hover:underline font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Login;
