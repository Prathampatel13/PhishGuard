import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, RefreshCw } from 'lucide-react';
import StatisticsCards from '../components/StatisticsCards';
import Charts from '../components/Charts';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import type { Statistics, HistoryRecord } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, historyData] = await Promise.all([
        apiService.getStatistics(),
        apiService.getHistory({ limit: 100 }),
      ]);
      setStats(statsData);
      if (historyData && 'records' in historyData) {
        setHistory(historyData.records);
      }
    } catch (err) {
      setError('Failed to load dashboard data. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Dashboard
            </h1>
          </div>
          <p className="text-gray-400 ml-[52px]">
            Real-time analytics and threat intelligence overview
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 text-sm font-medium rounded-xl border border-dark-700/50 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center border-yellow-500/20 bg-yellow-500/5"
        >
          <p className="text-yellow-400 mb-4">{error}</p>
          <button onClick={fetchData} className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </motion.div>
      )}

      {/* Statistics */}
      {!error && (
        <>
          <StatisticsCards stats={stats || undefined} />
          
          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Charts stats={stats || undefined} history={history} />
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent-500" />
                <h3 className="text-sm font-semibold text-white">Safe Percentage</h3>
              </div>
              <div className="text-3xl font-bold text-accent-400">
                {stats?.safe_percentage?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">of all scanned URLs</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <h3 className="text-sm font-semibold text-white">Suspicious Percentage</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                {stats?.suspicious_percentage?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">of all scanned URLs</p>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-sm font-semibold text-white">Dangerous Percentage</h3>
              </div>
              <div className="text-3xl font-bold text-red-400">
                {stats?.dangerous_percentage?.toFixed(1) || 0}%
              </div>
              <p className="text-xs text-gray-500 mt-1">of all scanned URLs</p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

