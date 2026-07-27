import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ExternalLink } from 'lucide-react';
import { getRiskColor } from '../utils/helpers';

interface RecommendationCardProps {
  recommendation: string;
  status: string;
  confidence: number;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, status, confidence }) => {
  const color = getRiskColor(status === 'safe' ? 15 : status === 'suspicious' ? 50 : 85);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 border-t-4"
      style={{ borderTopColor: color }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">Recommendation</h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">{recommendation}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-400">
                Confidence: <span className="font-semibold text-white">{confidence}%</span>
              </span>
            </div>
            <a
              href="#"
              className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Learn more about phishing
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;

