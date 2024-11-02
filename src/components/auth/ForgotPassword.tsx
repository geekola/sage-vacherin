import React, { useState } from 'react';
import { Layers, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface ForgotPasswordProps {
  onViewChange: (view: 'login' | 'signup' | 'forgot-password') => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onViewChange }) => {
  const { resetPassword, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await resetPassword(email);
    if (result) {
      setSuccess(true);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-2xl shadow-lg">
            <Layers className="w-16 h-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600">
          Enter your email to receive reset instructions
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                Password reset instructions have been sent to your email.
                Please check your inbox.
              </p>
            </div>
            <button
              onClick={() => onViewChange('login')}
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Send Reset Instructions'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => onViewChange('login')}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};