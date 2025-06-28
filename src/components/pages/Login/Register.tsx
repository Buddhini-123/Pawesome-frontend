import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AlertCircle, Check } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validatePassword = (password: string) => {
    const requirements = [
      { met: password.length >= 8, text: 'At least 8 characters' },
      { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
      { met: /[a-z]/.test(password), text: 'One lowercase letter' },
      { met: /[0-9]/.test(password), text: 'One number' }
    ];
    return requirements;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    const passwordReqs = validatePassword(formData.password);
    if (passwordReqs.some(req => !req.met)) {
      setError('Password does not meet all requirements');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.name);
      // Redirect to home after successful registration
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = validatePassword(formData.password);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundImage: "url('/logo/login-back.jpg')" }}
    >
      {/* Main registration card */}
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-calm-blue text-base leading-relaxed font-figtree">
            Join Pawsome to give your pets the best care they deserve!
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Existing member link */}
        <div className="text-center mb-6">
          <span className="text-gray-700 text-base font-figtree">Already a member? </span>
          <Link to="/login" className="text-energetic-orange font-medium text-base hover:underline">
            Sign In
          </Link>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base font-figtree rounded-full bg-off-white focus:outline-none focus:ring-2 focus:ring-calm-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base font-figtree rounded-full bg-off-white focus:outline-none focus:ring-2 focus:ring-calm-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full text-base font-figtree bg-off-white focus:outline-none focus:ring-2 focus:ring-calm-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password requirements */}
          {formData.password && (
            <div className="px-4 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Password requirements:</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center text-xs">
                    {req.met ? (
                      <Check className="h-3 w-3 text-green-500 mr-2" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-gray-400 mr-2" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-600'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full text-base font-figtree bg-off-white focus:outline-none focus:ring-2 focus:ring-calm-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>
            
          <button 
            type="submit" 
            className="w-full bg-energetic-orange hover:bg-orange-600 text-white text-base font-medium py-3 px-14 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Terms and privacy */}
        <div className="text-center mt-7 space-y-4">
          <p className="text-xs text-calm-blue">
            By creating an account you confirm that you accept our{' '}
            <Link to="/terms" className="underline hover:text-blue-600">
              Terms and Conditions
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

export default Register;