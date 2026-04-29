import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Database, Plus, LogOut, Activity, BarChart2 } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await axios.get('/api/datasets');
        setDatasets(res.data);
      } catch (err) {
        console.error("Failed to fetch datasets", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Navbar */}
      <nav className="bg-surface border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl">ModelForge</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Your Datasets</h1>
          <button 
            onClick={() => navigate('/upload')}
            className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : datasets.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-gray-800 rounded-2xl p-12 text-center"
          >
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No datasets yet</h3>
            <p className="text-gray-400 mb-6">Upload your first CSV file to start training models.</p>
            <button 
              onClick={() => navigate('/upload')}
              className="bg-secondary hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Upload Data
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((ds, index) => (
              <motion.div
                key={ds.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors cursor-pointer group"
                onClick={() => navigate(`/eda/${ds.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:scale-110 transition-transform">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg truncate w-40" title={ds.file_name}>{ds.file_name}</h3>
                      <p className="text-xs text-gray-500">{new Date(ds.upload_time).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 bg-[#0f172a]/50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Rows</p>
                    <p className="font-mono text-sm">{ds.number_of_rows.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Columns</p>
                    <p className="font-mono text-sm">{ds.number_of_columns.toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
