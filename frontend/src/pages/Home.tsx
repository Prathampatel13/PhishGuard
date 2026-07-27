import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FeatureCards from '../components/FeatureCards';
import StatisticsCards from '../components/StatisticsCards';
import Charts from '../components/Charts';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import type { HistoryRecord, Statistics } from '../types';

const Home: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          apiService.getStatistics(),
          apiService.getHistory(),
        ]);
        setStats(statsData);
        if (historyData && 'records' in historyData) {
          setHistory(historyData.records);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    // Try fetching, but don't block if server is down
    fetchData().catch(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <Hero />

      {/* Statistics Cards */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
          <p className="text-gray-400">Real-time statistics and analytics</p>
        </motion.div>
        {error ? (
          <div className="glass-card p-8 text-center">
            <p className="text-yellow-400 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Start the backend server with: <code className="text-primary-400 bg-dark-800 px-2 py-1 rounded">uvicorn app.main:app --reload</code></p>
          </div>
        ) : (
          <>
            <StatisticsCards stats={stats || undefined} />
            {stats && (
              <div className="mt-8">
                <Charts stats={stats} history={history} />
              </div>
            )}
          </>
        )}
      </section>

      {/* Features */}
      <FeatureCards />

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center py-16"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to <span className="text-gradient">Secure</span> Your Browsing?
          </h2>
          <p className="text-gray-400 mb-8">
            Start analyzing URLs now and protect yourself from phishing attacks.
          </p>
          <a
            href="/analyze"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all duration-200 cyber-glow"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Start Analyzing
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

