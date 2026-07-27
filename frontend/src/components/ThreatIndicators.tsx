import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Shield, AlertTriangle, Globe, Lock, Unlock, Server, Tag, Type, Key, Hash } from 'lucide-react';
import type { AnalysisDetails } from '../types';

interface ThreatIndicatorsProps {
  details: AnalysisDetails;
}

interface IndicatorItem {
  label: string;
  value: string;
  safe: boolean;
  icon: React.ElementType;
}

const ThreatIndicators: React.FC<ThreatIndicatorsProps> = ({ details }) => {
  const indicators: IndicatorItem[] = [
    { label: 'HTTPS', value: details.has_https ? 'Enabled' : 'Not Enabled', safe: details.has_https, icon: Lock },
    { label: 'HTTP', value: details.has_http ? 'Detected' : 'Not Detected', safe: !details.has_http, icon: Unlock },
    { label: 'IP Address', value: details.has_ip ? 'Detected' : 'Not Detected', safe: !details.has_ip, icon: Server },
    { label: 'Suspicious TLD', value: details.suspicious_tld ? 'Yes' : 'No', safe: !details.suspicious_tld, icon: Globe },
    { label: 'Brand Impersonation', value: details.brand_impersonation.length > 0 ? `${details.brand_impersonation.length} detected` : 'None', safe: details.brand_impersonation.length === 0, icon: Shield },
    { label: 'Login Keywords', value: details.suspicious_keywords.filter(k => k.toLowerCase().includes('login') || k.toLowerCase().includes('signin') || k.toLowerCase().includes('password')).length > 0 ? 'Detected' : 'None', safe: !details.suspicious_keywords.some(k => k.toLowerCase().includes('login') || k.toLowerCase().includes('signin') || k.toLowerCase().includes('password')), icon: Key },
    { label: 'Special Characters', value: `${details.special_char_count}`, safe: details.special_char_count < 10, icon: Type },
    { label: 'Subdomains', value: `${details.subdomain_count}`, safe: details.subdomain_count <= 2, icon: Tag },
    { label: 'Hyphens', value: details.has_hyphens ? 'Found' : 'None', safe: !details.has_hyphens, icon: Hash },
    { label: 'Numbers in URL', value: `${details.number_count}`, safe: details.number_count < 5, icon: AlertTriangle },
  ];

  const safeCount = indicators.filter(i => i.safe).length;
  const dangerousCount = indicators.filter(i => !i.safe).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-semibold text-white">Threat Indicators</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-accent-500" />
            <span className="text-accent-400">{safeCount} Safe</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-400">{dangerousCount} Threats</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
              indicator.safe
                ? 'bg-accent-500/5 border-accent-500/20 hover:bg-accent-500/10'
                : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              indicator.safe ? 'bg-accent-500/10' : 'bg-red-500/10'
            }`}>
              {indicator.safe ? (
                <CheckCircle className="w-4 h-4 text-accent-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <indicator.icon className={`w-3.5 h-3.5 flex-shrink-0 ${
                  indicator.safe ? 'text-accent-400' : 'text-red-400'
                }`} />
                <span className="text-sm text-gray-300 truncate">{indicator.label}</span>
              </div>
            </div>
            <span className={`text-xs font-semibold flex-shrink-0 ${
              indicator.safe ? 'text-accent-400' : 'text-red-400'
            }`}>
              {indicator.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ThreatIndicators;

