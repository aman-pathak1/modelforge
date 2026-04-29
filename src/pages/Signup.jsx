import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BrainCircuit, Mail, Lock, UserPlus } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      setSuccess("Account created successfully! Please check your email (or backend console) to verify your account.");
      setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <BrainCircuit className="w-16 h-16 text-secondary" />
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-text">
          Join ModelForge
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="font-medium text-secondary hover:text-purple-400 transition-colors">Sign in here</Link>
        </p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-surface py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg text-sm text-center">
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-300">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background block w-full pl-10 sm:text-sm border-gray-700 rounded-lg text-white focus:ring-secondary focus:border-secondary py-3 px-4 border"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background block w-full pl-10 sm:text-sm border-gray-700 rounded-lg text-white focus:ring-secondary focus:border-secondary py-3 px-4 border"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-secondary hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary focus:ring-offset-background transition-all disabled:opacity-50 gap-2 items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
