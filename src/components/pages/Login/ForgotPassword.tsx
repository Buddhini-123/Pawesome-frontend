import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {api} from "../../../services/api"

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        { email }
      );

      if ((response.data as any).success) {
        setMessage((response.data as any).message);
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-fredoka mb-6">
          Forgot Password
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
            <span className="text-sm">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base font-fredoka rounded-full bg-soft-gray focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="bg-vibrant-orange hover:bg-sunny-yellow hover:text-charcoal text-white text-base font-fredoka font-medium py-3 px-14 rounded-full transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-primary-blue font-medium hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
