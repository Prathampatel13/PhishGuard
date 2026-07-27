import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Server, Tag, Type, Hash, Lock, Unlock, Link2 } from 'lucide-react';
import type { AnalysisDetails } from '../types';

interface TechnicalDetailsProps {
  details: AnalysisDetails;
  url: string;
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({ details, url }) => {
  let domain = '';
  let tld = '';
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    domain = urlObj.hostname;
    const parts = domain.split('.');
    tld = parts[parts.length - 1];
  } catch {
    domain = 'Unable to parse';
    tld = 'Unknown';
  }

  const items = [
    { label: 'Protocol', value: details.has_https ? 'HTTPS (Secure)' : details.has_http ? 'HTTP (Insecure)' : 'Unknown', icon: details.has_https ? Lock : Unlock, safe: details.has_https },
    { label: 'Domain', value: domain, icon: Globe, safe: true },
    { label: 'Top Level Domain', value: `.${tld}`, icon: Tag, safe: !details.suspicious_tld },
    { label: 'Subdomains', value: `${details.subdomain_count} subdomain${details.subdomain_count !== 1 ? 's' : ''}`, icon: Server, safe: details.subdomain_count <= 2 },
    { label: 'URL Length', value: `${details.url_length} characters`, icon: Link2, safe: details.url_length < 100 },
    { label: 'Special Characters', value: `${details.special_char_count} found`, icon: Type, safe: details.special_char_count < 10 },
    { label: 'Numbers', value: `${details.number_count} found`, icon: Hash, safe: details.number_count < 5 },
    { label: 'IP Address', value: details.has_ip ? 'Yes' : 'No', icon: Server, safe: !details.has_ip },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Technical Details</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-dark-700/30"
          >
            <div className="flex items-center gap-3">
              <item.icon className={`w-4 h-4 ${item.safe ? 'text-gray-400' : 'text-red-400'}`} />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{item.value}</span>
              <div className={`w-2 h-2 rounded-full ${item.safe ? 'bg-accent-500' : 'bg-red-500'}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TechnicalDetails;

