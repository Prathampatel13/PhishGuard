import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, ShieldOff } from 'lucide-react';
import { getSeverityClass, getStatusLabel } from '../utils/helpers';

interface RiskBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ status, size = 'md' }) => {
  const icons = {
    safe: ShieldCheck,
    suspicious: AlertTriangle,
    dangerous: ShieldOff,
  };

  const Icon = icons[status as keyof typeof icons] || ShieldCheck;

  const sizeMap = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const iconSizeMap = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center rounded-xl font-semibold border ${getSeverityClass(status)} ${sizeMap[size]}`}
    >
      <Icon size={iconSizeMap[size]} />
      <span>{getStatusLabel(status)}</span>
    </motion.div>
  );
};

export default RiskBadge;

