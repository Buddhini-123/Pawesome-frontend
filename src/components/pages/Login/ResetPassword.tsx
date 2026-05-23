import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";
import { api } from "../../../services/api";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (!token || !email) {
      setError("Invalid or missing reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if ((response.data as any).success) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      const errors = err.response?.data?.errors;
      if (errors?.token) {
        setError(errors.token[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-soft-gray flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-mint-green/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-mint-green" />
            </div>
          </div>
          <h2 className="text-2xl font-fredoka font-bold text-charcoal mb-2">Password Reset!</h2>
          <p className="text-medium-gray font-fredoka mb-6">
            Your password has been updated successfully. Redirecting you to login…
          </p>
          <Link
            to="/login"
            className="text-primary-blue font-fredoka font-medium hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-gray flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-fredoka font-bold text-charcoal mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-medium-gray font-fredoka mb-6">
          Enter a new password for <span className="text-primary-blue font-medium">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {(!token || !email) && (
          <div className="mb-4 p-3 bg-yellow-50 border border-sunny-yellow rounded-lg">
            <p className="text-sm text-charcoal font-fredoka">
              This reset link is invalid or has expired.{" "}
              <Link to="/forgot-password" className="text-primary-blue font-medium hover:underline">
                Request a new one
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-base font-fredoka rounded-full bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
              minLength={8}
              disabled={isLoading || !token}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-medium-gray hover:text-charcoal"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-3 pr-12 text-base font-fredoka rounded-full bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
              minLength={8}
              disabled={isLoading || !token}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-medium-gray hover:text-charcoal"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !token || !email}
            className="bg-vibrant-orange hover:bg-sunny-yellow hover:text-charcoal text-white text-base font-fredoka font-medium py-3 px-14 rounded-full transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting…" : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-primary-blue font-fredoka font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
