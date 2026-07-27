import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Search, ArrowRight, Activity, Zap, Star } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'URLs Scanned', icon: Search },
  { value: '98%', label: 'Detection Accuracy', icon: Zap },
  { value: '<100 ms', label: 'Avg Scan Time', icon: Activity },
  { value: '24/7', label: 'Threat Monitoring', icon: Star },
];

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8"
          >
            <Activity className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-400">
              Cyber Threat Intelligence System
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          >
            <span className="text-gradient">Detect Phishing</span>
            <br />
            <span className="text-white">Before It's Too Late</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            PhishGuard uses advanced rule-based detection to analyze websites 
            and identify phishing attempts. Protect yourself from malicious 
            URLs with real-time threat intelligence.
          </motion.p>

          {/* Search Box - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative flex items-center bg-dark-800/80 backdrop-blur-xl border border-dark-700/40 rounded-2xl overflow-hidden">
                <div className="flex items-center px-5">
                  <Search className="w-6 h-6 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Enter a URL to scan for phishing threats..."
                  className="flex-1 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  readOnly
                  onClick={() => window.location.href = '/analyze'}
                />
                <div className="pr-3">
                  <Link
                    to="/analyze"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 cyber-glow"
                  >
                    <span>Analyze</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800/80 hover:bg-dark-700/80 text-gray-300 hover:text-white font-medium rounded-xl border border-dark-700/50 transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              <span>How It Works</span>
            </Link>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card p-4 md:p-6 text-center hover:border-primary-500/30 transition-all duration-300"
              >
                <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

