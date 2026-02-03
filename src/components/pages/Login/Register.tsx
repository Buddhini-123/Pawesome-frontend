import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { AlertCircle, Check, Gift } from 'lucide-react';
import { formatters } from '../../../utils/formatters';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

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
    // Use AuthContext register function which handles authentication state
    await register(formData.email, formData.password, formData.name);

    // Store referral code if present
    if (formData.referralCode) {
      localStorage.setItem('pawsome_referral_code', formData.referralCode);
    }

    // User is now automatically logged in via AuthContext
    // Redirect to home page
    navigate('/');
  } catch (err: any) {
    if (err.message) {
      setError(err.message);
    } else {
      setError('Something went wrong. Please try again.');
    }
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
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">Create Account</h2>
          <p className="text-primary-blue text-base leading-relaxed font-fredoka">
            Join Pawsome to give your pets the best care they deserve!
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            <span className="text-sm text-red-500">{error}</span>
          </div>
        )}

        {/* Existing member link */}
        <div className="text-center mb-6">
          <span className="text-medium-gray text-base font-fredoka">Already a member? </span>
          <Link to="/login" className="text-vibrant-orange font-fredoka font-medium text-base hover:underline">
            Sign In
          </Link>
        </div>

        {/* Referral code banner if present */}
        {formData.referralCode && (
          <div className="mb-4 p-3 bg-mint-green/10 border border-mint-green/20 rounded-lg">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-mint-green mr-2" />
              <div>
                <p className="text-sm font-fredoka font-semibold text-mint-green">
                  Welcome! You'll get {formatters.currency(50)} off your first order
                </p>
                <p className="text-xs text-medium-gray">
                  Referral code: {formData.referralCode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base font-fredoka rounded-full bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
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
              className="w-full px-4 py-3 text-base font-fredoka rounded-full bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
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
              className="w-full px-4 py-3 rounded-full text-base font-fredoka bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password requirements */}
          {formData.password && (
            <div className="px-4 py-2 bg-soft-gray rounded-lg">
              <p className="text-xs text-medium-gray mb-2">Password requirements:</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center text-xs">
                    {req.met ? (
                      <Check className="h-3 w-3 text-mint-green mr-2" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-medium-gray mr-2" />
                    )}
                    <span className={req.met ? 'text-mint-green' : 'text-medium-gray'}>
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
              className="w-full px-4 py-3 rounded-full text-base font-fredoka bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          {/* Referral code field - only show if not already set from URL */}
          {!searchParams.get('ref') && (
            <div>
              <input
                type="text"
                name="referralCode"
                placeholder="Referral Code (Optional)"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full text-base font-fredoka bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          )}
            
          <button 
            type="submit" 
            className="w-full bg-vibrant-orange hover:bg-sunny-yellow hover:text-charcoal text-white text-base font-fredoka font-medium py-3 px-14 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Terms and privacy */}
        <div className="text-center mt-7 space-y-4">
          <p className="text-xs text-primary-blue">
            By creating an account you confirm that you accept our{' '}
            <Link to="/terms" className="underline hover:text-blue-600">
              Terms and Conditions
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

export default Register;