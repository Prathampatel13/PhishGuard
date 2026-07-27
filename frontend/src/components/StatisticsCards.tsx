import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldOff, Search, TrendingUp, Calendar } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface StatItem {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  prefix?: string;
  suffix?: string;
}

interface StatisticsCardsProps {
  stats?: {
    total_scans: number;
    safe_count: number;
    dangerous_count: number;
    suspicious_count: number;
    average_risk_score?: number;
    today_scans?: number;
  };
}

const AnimatedCounter: React.FC<{ value: number; duration?: number; prefix?: string; suffix?: string }> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <span className="text-2xl sm:text-3xl font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
  const defaultStats: StatItem[] = [
    {
      label: 'Total Scans',
      value: stats?.total_scans || 0,
      icon: Search,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/10',
    },
    {
      label: 'Safe URLs',
      value: stats?.safe_count || 0,
      icon: ShieldCheck,
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/10',
    },
    {
      label: 'Dangerous URLs',
      value: stats?.dangerous_count || 0,
      icon: ShieldOff,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Suspicious URLs',
      value: stats?.suspicious_count || 0,
      icon: Shield,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Avg Risk Score',
      value: Math.round(stats?.average_risk_score || 0),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      suffix: '%',
    },
    {
      label: "Today's Scans",
      value: stats?.today_scans || 0,
      icon: Calendar,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {defaultStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card p-4 sm:p-5 hover:border-primary-500/30 transition-all duration-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          <div className={stat.color}>
            <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatisticsCards;

