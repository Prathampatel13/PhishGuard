import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

interface ChartsProps {
  stats?: {
    total_scans: number;
    safe_count: number;
    dangerous_count: number;
    suspicious_count: number;
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
      <div className="bg-dark-800 border border-dark-700/50 rounded-xl p-3 shadow-xl">
        <p className="text-sm text-gray-300">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Charts: React.FC<ChartsProps> = ({ stats, history = [] }) => {
  const pieData = [
    { name: 'Safe', value: stats?.safe_count || 0, color: COLORS.safe },
    { name: 'Suspicious', value: stats?.suspicious_count || 0, color: COLORS.suspicious },
    { name: 'Dangerous', value: stats?.dangerous_count || 0, color: COLORS.dangerous },
  ].filter((item) => item.value > 0);

  // Process history for daily scans
  const dailyData = history.reduce((acc: any, item) => {
    const date = item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown';
    if (!acc[date]) {
      acc[date] = { date, scans: 0, avgRisk: 0, totalRisk: 0 };
    }
    acc[date].scans += 1;
    acc[date].totalRisk += item.risk_score;
    acc[date].avgRisk = Math.round(acc[date].totalRisk / acc[date].scans);
    return acc;
  }, {} as Record<string, { date: string; scans: number; avgRisk: number; totalRisk: number }>);

  const barData = Object.values(dailyData).slice(-7);
  const lineData = barData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pie Chart */}
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
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
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

      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Daily Scans</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="scans" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Line Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h3 className="text-sm font-semibold text-white">Risk Trend</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="avgRisk" stroke="#22C55E" strokeWidth={2} dot={{ fill: '#22C55E' }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Charts;

