import React from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, AlertTriangle, Shield, ShieldCheck, ShieldOff } from 'lucide-react';

interface ChartsProps {
  stats?: {
    total_scans: number;
    safe_count: number;
    dangerous_count: number;
    suspicious_count: number;
    safe_percentage?: number;
    suspicious_percentage?: number;
    dangerous_percentage?: number;
    daily_scan_counts?: { date: string; count: number }[];
    risk_trend?: { date: string; avg_risk: number }[];
  };
  history?: Array<{
    risk_score: number;
    status: string;
    created_at?: string | null;
  }>;
}

const COLORS = {
  safe: '#22C55E',
  suspicious: '#F59E0B',
  dangerous: '#EF4444',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-dark-700/50 rounded-xl p-3 shadow-xl backdrop-blur-xl">
        <p className="text-sm text-gray-300 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Charts: React.FC<ChartsProps> = ({ stats, history = [] }) => {
  const pieData = [
    { name: 'Safe', value: stats?.safe_count || 0, color: COLORS.safe, icon: ShieldCheck },
    { name: 'Suspicious', value: stats?.suspicious_count || 0, color: COLORS.suspicious, icon: AlertTriangle },
    { name: 'Dangerous', value: stats?.dangerous_count || 0, color: COLORS.dangerous, icon: ShieldOff },
  ].filter((item) => item.value > 0);

  // Top Threat Indicators from history
  const threatMap = new Map<string, number>();
  history.forEach((item) => {
    const status = item.status === 'safe' ? 'Safe' : item.status === 'suspicious' ? 'Suspicious' : 'Dangerous';
    threatMap.set(status, (threatMap.get(status) || 0) + 1);
  });
  const barData = Array.from(threatMap.entries()).map(([name, value]) => ({ name, value }));

  // Process history for daily scans
  const dailyMap = new Map<string, number>();
  history.forEach((item) => {
    if (item.created_at) {
      const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    }
  });
  const lineData = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, scans: count }))
    .slice(-14);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pie Chart - Threat Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Threat Distribution</h3>
        </div>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-400">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bar Chart - Threat Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Top Threat Indicators</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData.length > 0 ? barData : [{ name: 'Safe', value: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Safe' ? COLORS.safe : entry.name === 'Suspicious' ? COLORS.suspicious : COLORS.dangerous} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Line Chart - Scan History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Daily Scan History</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData.length > 0 ? lineData : [{ date: 'No data', scans: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="scans"
              stroke="#2563EB"
              strokeWidth={2}
              dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Charts;

