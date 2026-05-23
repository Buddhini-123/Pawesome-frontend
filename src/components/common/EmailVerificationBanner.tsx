import React, { useState, useEffect } from 'react';
import { emailVerificationService } from '../../services/emailVerification.service';
import { useAuth } from '../../hooks/useAuth';
import { AlertCircle, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmailVerificationBanner: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check verification status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        console.log('[EmailVerificationBanner] Checking verification status...');
        const status = await emailVerificationService.getVerificationStatus();
        console.log('[EmailVerificationBanner] Status from API:', status);

        if (status.is_verified && !user.email_verified_at) {
          // Backend says verified but frontend doesn't know - update it
          console.log('[EmailVerificationBanner] Updating user with verified status');
          updateUser({ email_verified_at: status.verified_at || new Date().toISOString() });
        }
      } catch (error) {
        console.error('[EmailVerificationBanner] Failed to check status:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [user?.id]); // Only run when user ID changes

  // Debug logging
  useEffect(() => {
    console.log('[EmailVerificationBanner] User:', user);
    console.log('[EmailVerificationBanner] email_verified_at:', user?.email_verified_at);
    console.log('[EmailVerificationBanner] Should show banner:', !user || !user.email_verified_at);
  }, [user]);

  // Don't show banner if email is already verified or user is not logged in
  if (!user || user.email_verified_at || isDismissed) {
    return null;
  }

  // Don't show while checking status
  if (isCheckingStatus) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage(null);

    try {
      const response = await emailVerificationService.resendVerificationEmail();
      setMessage(response.message);
      setMessageType('success');
    } catch (error: any) {
      setMessage(
        error.message || 'Failed to resend verification email'
      );
      setMessageType('error');
    } finally {
      setIsResending(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-sunny-yellow/20 border-b-2 border-sunny-yellow"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <AlertCircle className="h-5 w-5 text-vibrant-orange mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-charcoal font-fredoka font-semibold">
                  Please verify your email address
                </p>
                <p className="text-xs text-medium-gray mt-1">
                  We sent a verification link to <strong>{user?.email}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 ml-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center space-x-2 px-4 py-2 bg-vibrant-orange hover:bg-vibrant-orange/90 text-white rounded-xl text-sm font-fredoka font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail className="h-4 w-4" />
                <span>{isResending ? 'Sending...' : 'Resend Email'}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-charcoal/10 rounded-lg transition-colors"
                title="Dismiss"
              >
                <X className="h-5 w-5 text-medium-gray" />
              </button>
            </div>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 text-sm font-fredoka ${
                messageType === 'success' ? 'text-mint-green' : 'text-coral-red'
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailVerificationBanner;
