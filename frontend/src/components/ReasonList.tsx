import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ReasonListProps {
  reasons: string[];
  status: string;
}

const ReasonList: React.FC<ReasonListProps> = ({ reasons, status }) => {
  const getIcon = (reason: string) => {
    if (reason.toLowerCase().includes('safe') || reason.toLowerCase().includes('secure') || reason.toLowerCase().includes('https')) {
      return CheckCircle;
    }
    if (reason.toLowerCase().includes('danger') || reason.toLowerCase().includes('malicious') || reason.toLowerCase().includes('suspicious')) {
      return XCircle;
    }
    return AlertTriangle;
  };

  const getIconColor = (isWarning: boolean) => {
    if (status === 'safe') return 'text-green-400';
    if (isWarning) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!reasons || reasons.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Detection Results</h3>
        <span className="text-xs text-gray-500 ml-auto">
          {reasons.length} indicator{reasons.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <div className="space-y-2">
        {reasons.map((reason, index) => {
          const Icon = getIcon(reason);
          const isWarning = Icon === AlertTriangle;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/30"
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getIconColor(isWarning)}`} />
              <span className="text-sm text-gray-300">{reason}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ReasonList;

