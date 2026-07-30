import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, History, FileText, Download, BarChart3, Shield, Activity, Zap } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Real-Time Detection',
    description: 'Analyze any URL using 20+ rule-based phishing detection indicators for comprehensive threat assessment in milliseconds.',
    color: 'text-primary-400',
    bgColor: 'bg-primary-500/10',
    borderColor: 'border-primary-500/20',
  },
  {
    icon: Brain,
    title: 'Threat Intelligence',
    description: 'Advanced pattern matching detects suspicious keywords, brand impersonation, malicious TLDs, and phishing indicators.',
    color: 'text-accent-400',
    bgColor: 'bg-accent-500/10',
    borderColor: 'border-accent-500/20',
  },
  {
    icon: BarChart3,
    title: 'Risk Analysis',
    description: 'Comprehensive risk scoring from 0-100 with detailed breakdown of security indicators and threat levels.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  {
    icon: History,
    title: 'Scan History',
    description: 'Track all your URL analyses with detailed reports, risk scores, and historical trends over time.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  {
    icon: Activity,
    title: 'Analytics Dashboard',
    description: 'Visual insights with interactive charts showing threat distribution, daily trends, and risk patterns.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get analysis results in under 100ms with detailed reasons, recommendations, and technical breakdown.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/20',
  },
  {
    icon: FileText,
    title: 'Detailed Reports',
    description: 'Comprehensive analysis reports with risk scores, detection reasons, and actionable recommendations.',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/20',
  },
  {
    icon: Download,
    title: 'Export & Share',
    description: 'Download PDF reports, export CSV data, and share analysis results with your team or faculty.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
];

const FeatureCards: React.FC = () => {
  return (
    <section className="py-20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
            <Shield className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-400">Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Stay Safe</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enterprise-grade phishing detection with real-time analysis, detailed reporting, and actionable insights
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass-card p-6 border ${feature.borderColor} hover:shadow-xl transition-all duration-300 glow-card`}
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
