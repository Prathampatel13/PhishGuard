import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Shield } from 'lucide-react';
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
          apiService.getHistory({ limit: 50 }),
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

    fetchData().catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <FeatureCards />

      {/* Dashboard Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient">Real-Time Analytics</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Monitor your scanning activity with interactive charts and statistics
            </p>
          </motion.div>

          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center max-w-2xl mx-auto">
              <p className="text-yellow-400 mb-2">{error}</p>
              <p className="text-sm text-gray-500">
                Start the backend server with: <code className="text-primary-400 bg-dark-800 px-2 py-1 rounded">uvicorn app.main:app --reload</code>
              </p>
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
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 text-center"
      >
        <div className="max-w-2xl mx-auto px-4">
          <div className="glass-card p-12">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to <span className="text-gradient">Secure</span> Your Browsing?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Start analyzing URLs now and protect yourself from phishing attacks. 
              Our advanced detection engine analyzes 20+ security indicators in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl transition-all duration-200 cyber-glow"
              >
                <Search className="w-5 h-5" />
                Start Analyzing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 bg-dark-800/80 hover:bg-dark-700/80 text-gray-300 font-semibold rounded-2xl border border-dark-700/50 transition-all duration-200"
              >
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
