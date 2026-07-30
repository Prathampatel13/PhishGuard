import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, RefreshCw, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import HistoryTable from '../components/HistoryTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import { exportToCSV, formatDate, getStatusLabel } from '../utils/helpers';
import type { HistoryRecord } from '../types';

const History: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getHistory({ limit: 200 });
      if (data && 'records' in data) {
        setRecords(data.records as HistoryRecord[]);
      } else {
        setRecords([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load history';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteHistoryRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success('Record deleted');
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) return;
    try {
      await apiService.clearAllHistory();
      setRecords([]);
      toast.success('All history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
  };

  const handleExportAllCSV = () => {
    const csvData = records.map((item) => ({
      URL: item.url,
      'Risk Score': item.risk_score,
      Status: getStatusLabel(item.status),
      'Analysis Date': formatDate(item.created_at),
    }));
    exportToCSV(csvData, `phishguard-full-history-${new Date().toISOString().split('T')[0]}`);
    toast.success('CSV exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading history..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <HistoryIcon className="w-5 h-5 text-primary-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Scan History</h1>
          </div>
          <p className="text-gray-400 ml-[52px]">
            View and manage all your past URL analysis results.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <>
              <button
                onClick={handleExportAllCSV}
                className="btn-secondary text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchHistory}
                className="btn-ghost text-sm"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center border-yellow-500/20 bg-yellow-500/5"
        >
          <p className="text-yellow-400 mb-4">{error}</p>
          <button onClick={fetchHistory} className="btn-primary">
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </motion.div>
      )}

      {/* History Table */}
      {!error && (
        <HistoryTable
          data={records}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
          loading={loading}
        />
      )}

      {/* Empty State Info */}
      {!error && records.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-dark-800/50 border border-dark-700/30 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-dark-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No History Yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Start by analyzing a URL on the Analyze page. Your scan history will appear here with detailed results and recommendations.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default History;
