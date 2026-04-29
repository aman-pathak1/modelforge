import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.get(`/auth/verify?token=${token}`);
        setStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 items-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface p-8 rounded-2xl shadow-xl border border-gray-800 text-center max-w-sm w-full"
      >
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-display text-text">Verifying Email...</h2>
            <p className="text-gray-400 mt-2 text-sm">Please wait while we verify your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-display text-text">Email Verified!</h2>
            <p className="text-gray-400 mt-2 text-sm">Redirecting you to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-display text-text">Verification Failed</h2>
            <p className="text-gray-400 mt-2 text-sm">The link might be invalid or expired.</p>
            <button 
              onClick={() => navigate('/login')}
              className="mt-6 bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
