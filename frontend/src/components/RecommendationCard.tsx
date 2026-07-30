import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ExternalLink, CheckCircle, Shield, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { getRiskColor } from '../utils/helpers';

interface RecommendationCardProps {
  recommendation: string;
  status: string;
  confidence: number;
  recommendations?: string[];
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  status,
  confidence,
  recommendations = [],
}) => {
  const color = getRiskColor(status === 'safe' ? 15 : status === 'suspicious' ? 50 : 85);

  const statusConfig = {
    safe: {
      icon: CheckCircle,
      color: 'text-accent-400',
      bg: 'bg-accent-500/10',
      border: 'border-accent-500/20',
      label: 'Safe to Browse',
    },
    suspicious: {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      label: 'Proceed with Caution',
    },
    dangerous: {
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      label: 'Dangerous - Leave Immediately',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.safe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-dark-700/50">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center`}>
            <config.icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Recommendation</h3>
            </div>
            <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700/30">
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400">
              Confidence: <span className="font-semibold text-white">{confidence}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Recommendation */}
      <div className="p-6 bg-dark-800/30">
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{recommendation}</p>

        {/* Dynamic Recommendations List */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {status === 'safe' ? 'Best Practices' : 'Security Actions'}
            </p>
            {recommendations.map((rec, index) => {
              const isWarning = status !== 'safe';
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/30"
                >
                  {isWarning ? (
                    <ArrowRight className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  )}
                  <span className="text-sm text-gray-400">{rec}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-dark-800/20 border-t border-dark-700/30">
        <a
          href="https://www.cisa.gov/topics/cyber-threats-advisories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
        >
          Learn more about phishing protection
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;

