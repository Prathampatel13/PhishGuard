import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import HistoryTable from '../components/HistoryTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import type { HistoryRecord } from '../types';

const History: React.FC = () => {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await apiService.getHistory();
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
    if (!window.confirm('Are you sure you want to clear all history?')) return;
    try {
      await apiService.clearAllHistory();
      setRecords([]);
      toast.success('All history cleared');
    } catch (err) {
      toast.error('Failed to clear history');
    }
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
      >
        <h1 className="text-3xl font-bold text-white mb-2">Scan History</h1>
        <p className="text-gray-400">
          View and manage all your past URL analysis results.
        </p>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-yellow-500/20 bg-yellow-500/5"
        >
          <p className="text-yellow-400 text-center mb-4">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchHistory();
              }}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        </motion.div>
      )}

      {/* History Table */}
      {!error && (
        <HistoryTable
          data={records}
          onDelete={handleDelete}
          onClearAll={handleClearAll}
        />
      )}

      {/* Export Buttons */}
      {records.length > 0 && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => {
              const csv = [
                ['URL', 'Risk Score', 'Status', 'Date'],
                ...records.map((r) => [r.url, r.risk_score, r.status, r.created_at]),
              ]
                .map((row) => row.join(','))
                .join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `phishguard-history-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
              URL.revokeObjectURL(url);
              toast.success('CSV exported successfully');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 text-sm font-medium rounded-xl border border-dark-700/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default History;

