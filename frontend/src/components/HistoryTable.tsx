import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2, Search, ExternalLink, Clock, Shield, ShieldCheck, ShieldOff,
  AlertTriangle, ArrowUpDown, ChevronLeft, ChevronRight, Download,
  FileText, Filter, X
} from 'lucide-react';
import type { HistoryRecord } from '../types';
import { getSeverityClass, getStatusLabel, getRiskColor, formatDate, exportToCSV } from '../utils/helpers';

interface HistoryTableProps {
  data: HistoryRecord[];
  onDelete: (id: number) => void;
  onClearAll: () => void;
  loading?: boolean;
}

const ITEMS_PER_PAGE = 10;

const HistoryTable: React.FC<HistoryTableProps> = ({ data, onDelete, onClearAll, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'risk' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return ShieldCheck;
      case 'suspicious': return AlertTriangle;
      case 'dangerous': return ShieldOff;
      default: return Shield;
    }
  };

  const filteredAndSorted = useMemo(() => {
    let items = [...data];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter((item) =>
        item.url.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term) ||
        (item.reasons && item.reasons.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== 'all') {
      items = items.filter((item) => item.status === statusFilter);
    }

    items.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy === 'risk') {
        comparison = (a.risk_score ?? 0) - (b.risk_score ?? 0);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [data, searchTerm, sortBy, sortOrder, statusFilter]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: 'date' | 'risk' | 'status') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredAndSorted.map((item) => ({
      URL: item.url,
      'Risk Score': item.risk_score,
      Status: getStatusLabel(item.status),
      Date: formatDate(item.created_at),
    }));
    exportToCSV(csvData, `phishguard-history-${new Date().toISOString().split('T')[0]}`);
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
      <div className="p-4 sm:p-6 border-b border-dark-700/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Scan History</h3>
            <span className="text-xs text-gray-500 bg-dark-800 px-2 py-1 rounded-lg">
              {filteredAndSorted.length} record{filteredAndSorted.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-8 py-2.5 bg-dark-800 border border-dark-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-8 py-2.5 bg-dark-800 border border-dark-700/50 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 transition-colors appearance-none"
              >
                <option value="all">All Status</option>
                <option value="safe">Safe</option>
                <option value="suspicious">Suspicious</option>
                <option value="dangerous">Dangerous</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleExportCSV} className="btn-ghost text-xs" title="Export CSV">
                <Download className="w-4 h-4" />
              </button>
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
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">
            {searchTerm || statusFilter !== 'all' ? 'No results found.' : 'No scan history yet.'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {searchTerm ? 'Try a different search term.' : 'Start by analyzing a URL!'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('risk')} className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                      Score <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-left px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('date')} className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                      Date <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right px-4 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/50">
                {paginatedData.map((item, index) => {
                  const StatusIcon = getStatusIcon(item.status);
                  const riskColor = getRiskColor(item.risk_score);
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-dark-800/30 transition-colors group"
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[250px] sm:max-w-[350px]">
                          <ExternalLink className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-300 truncate">{item.url}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: riskColor }}>{item.risk_score}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getSeverityClass(item.status)}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {getStatusLabel(item.status)}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
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

          {/* Pagination */}
          <div className="p-4 sm:p-6 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSorted.length)} of {filteredAndSorted.length} records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'hover:bg-dark-800 text-gray-400 border border-transparent'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-dark-800 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default HistoryTable;
