import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Landing page for email verification redirects.
 *
 * The backend now redirects to:
 *   /verify-email?status=success&message=Email+verified+successfully
 *   /verify-email?status=error&message=Verification+link+has+expired
 *
 * We simply read those params and show the appropriate UI.
 */
const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const status = searchParams.get('status') ?? 'error';
  const message = searchParams.get('message') ?? 'Something went wrong. Please try again.';
  const isSuccess = status === 'success';

  useEffect(() => {
    if (isSuccess) {
      // Mark the user as verified locally so UI updates immediately
      updateUser({ email_verified_at: new Date().toISOString() });

      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, updateUser]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/logo/login-back.jpg')" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/logo/logo.png"
              alt="Pawsome Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-fredoka font-bold text-charcoal mb-6">
            Email Verification
          </h2>
        </div>

        <div className="text-center py-6">
          {isSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-mint-green/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-mint-green" />
              </div>
              <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">
                Email Verified Successfully!
              </h3>
              <p className="text-medium-gray mb-4">{message}</p>
              <p className="text-sm text-medium-gray">Redirecting you to home page...</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-coral-red/20 rounded-full flex items-center justify-center">
                <XCircle className="h-12 w-12 text-coral-red" />
              </div>
              <h3 className="text-xl font-fredoka font-bold text-charcoal mb-2">
                Verification Failed
              </h3>
              <p className="text-coral-red mb-6">{message}</p>
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white rounded-xl font-fredoka font-medium transition-colors"
              >
                Go to Home
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
