import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted:', { email, password });
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
          <p className="text-calm-blue text-base leading-relaxed font-figtree">
            Sign in to your Pawsome pet care account to order your pet food, manage your rewards, get advises and more !
          </p>
        </div>

        {/* New member link */}
        <div className="text-center mb-6">
          <span className="text-gray-700 text-base font-figtree">New Member? </span>
          <Link to="/register" className="text-energetic-orange font-medium text-base hover:underline">
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
              className="w-full px-4 py-3 text-base font-figtree rounded-full bg-off-white focus:outline-none focus:ring-2 focus:ring-calm-blue focus:border-transparent"
              required
              />
          </div>
          
          <div>
            <input
                type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full text-base font-figtree bg-off-white focus:outline-none focus:ring-2 focus:ring-calm-blue focus:border-transparent"
              required
              />
          </div>
            
            <div className="flex items-center mt-4 px-8">
                <Link to="/forgot-password" className="text-energetic-orange text-base font-medium hover:underline whitespace-nowrap"
                >Forgot Password ?
                </Link>

                <button type="submit" className="bg-energetic-orange hover:bg-orange-600 text-white text-base font-medium py-3 px-14 rounded-full transition-colors ml-4"
                >Sign In
                </button>
            </div>

        </form>

        {/* Terms and privacy */}
        <div className="text-center mt-7 space-y-4">
          <p className="text-xs text-calm-blue">
            By signing in you confirm that you accept our{' '}
            <Link to="/terms" className="underline hover:text-blue-600">
              Account Terms and Conditions
            </Link>.
          </p>
          <p className="text-xs text-calm-blue">
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