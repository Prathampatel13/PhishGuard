import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Search, ExternalLink, Clock, Shield, ShieldCheck, ShieldOff, AlertTriangle } from 'lucide-react';
import type { HistoryRecord } from '../types';
import { getSeverityClass, getStatusLabel, getRiskColor, formatDate } from '../utils/helpers';

interface HistoryTableProps {
  data: HistoryRecord[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
  loading?: boolean;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ data, onDelete, onClearAll, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'risk'>('date');

  const filtered = data
    .filter((item) => item.url.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      return (b.risk_score ?? 0) - (a.risk_score ?? 0);
    });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return ShieldCheck;
      case 'suspicious': return AlertTriangle;
      case 'dangerous': return ShieldOff;
      default: return Shield;
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-gray-400">Loading history...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-dark-700/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Scan History</h3>
            <span className="text-xs text-gray-500 bg-dark-800 px-2 py-1 rounded-lg">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 pl-9 pr-3 py-2 bg-dark-800 border border-dark-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'risk')}
              className="px-3 py-2 bg-dark-800 border border-dark-700/50 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 transition-colors"
            >
              <option value="date">Latest</option>
              <option value="risk">Risk Score</option>
            </select>
            {/* Clear All */}
            {data.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">
            {searchTerm ? 'No results found for your search.' : 'No scan history yet.'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm ? 'Try a different search term.' : 'Start by analyzing a URL!'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/50">
              {filtered.map((item, index) => {
                const StatusIcon = getStatusIcon(item.status);
                const riskColor = getRiskColor(item.risk_score);
                
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-dark-800/30 transition-colors group"
                  >
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-300 truncate max-w-[200px] sm:max-w-[300px]">
                          {item.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: riskColor }}>
                        {item.risk_score}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getSeverityClass(item.status)}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {getStatusLabel(item.status)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default HistoryTable;

