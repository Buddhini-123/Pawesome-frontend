import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the page the user was trying to access
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      // Redirect to the page they were trying to access or home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundImage: "url('/logo/login-back.jpg')" }}
    >
      {/* Main login card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-14">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo/logo.png" 
              alt="Pawsome Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <p className="text-primary-blue text-base leading-relaxed font-fredoka">
            Sign in to your Pawsome pet care account to order your pet food, manage your rewards, get advises and more !
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* New member link */}
        <div className="text-center mb-6">
          <span className="text-medium-gray text-base font-fredoka">New Member? </span>
          <Link to="/register" className="text-vibrant-orange font-fredoka font-medium text-base hover:underline">
            Create Account
          </Link>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base font-fredoka rounded-full bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-base font-fredoka bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
            
          <div className="flex items-center mt-4 px-8">
            <Link 
              to="/forgot-password" 
              className="text-vibrant-orange text-base font-fredoka font-medium hover:underline whitespace-nowrap"
            >
              Forgot Password ?
            </Link>

            <button 
              type="submit" 
              className="bg-vibrant-orange hover:bg-sunny-yellow hover:text-charcoal text-white text-base font-fredoka font-medium py-3 px-14 rounded-full transition-colors ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-medium-gray font-fredoka font-medium mb-2">Demo Credentials:</p>
          <p className="text-xs text-medium-gray">Email: demo@pawsome.com</p>
          <p className="text-xs text-medium-gray">Password: demo123</p>
        </div>

        {/* Terms and privacy */}
        <div className="text-center mt-7 space-y-4">
          <p className="text-xs text-primary-blue">
            By signing in you confirm that you accept our{' '}
            <Link to="/terms" className="underline hover:text-blue-600">
              Account Terms and Conditions
            </Link>.
          </p>
          <p className="text-xs text-primary-blue">
            You also acknowledge{' '}
            <Link to="/privacy" className="underline hover:text-blue-600">
              Pawsome's privacy policy
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;