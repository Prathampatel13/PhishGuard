import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { getRiskColor } from '../utils/helpers';

interface RiskMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const RiskMeter: React.FC<RiskMeterProps> = ({ score, size = 'md' }) => {
  const color = getRiskColor(score);
  const circumference = 2 * Math.PI * 70;
  const progress = (score / 100) * circumference;

  const sizeMap = {
    sm: { width: 120, height: 120, strokeWidth: 6, fontSize: 'text-lg', iconSize: 20 },
    md: { width: 160, height: 160, strokeWidth: 8, fontSize: 'text-2xl', iconSize: 28 },
    lg: { width: 200, height: 200, strokeWidth: 10, fontSize: 'text-3xl', iconSize: 36 },
  };

  const s = sizeMap[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={s.width} height={s.height} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={s.width / 2}
          cy={s.height / 2}
          r={70}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.strokeWidth}
          className="text-dark-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={s.width / 2}
          cy={s.height / 2}
          r={70}
          fill="none"
          stroke={color}
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="drop-shadow-lg"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Shield size={s.iconSize} style={{ color }} />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`${s.fontSize} font-bold mt-1`}
          style={{ color }}
        >
          {Math.round(score)}
        </motion.span>
        <span className="text-[10px] text-gray-500 font-medium">RISK SCORE</span>
      </div>
    </motion.div>
  );
};

export default RiskMeter;

