import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BookOpen, Users, Award, Target, Code, Lock, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-primary-500" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          About <span className="text-gradient">PhishGuard</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          A comprehensive phishing URL detection system built for the modern web,
          combining rule-based analysis with cyber threat intelligence.
        </p>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Project Information</h2>
        </div>
        <div className="grid gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/50">
            <Target className="w-5 h-5 text-primary-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">Subject</h3>
              <p className="text-sm text-gray-400">Cyber Security and Forensic - Cyber Threat Intelligence and Analysis</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/50">
            <Award className="w-5 h-5 text-accent-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">Project Goal</h3>
              <p className="text-sm text-gray-400">
                Develop a modern web application that analyzes website URLs and predicts whether they are Safe, 
                Suspicious, or Dangerous using rule-based phishing detection techniques.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/50">
            <Users className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-1">Target Audience</h3>
              <p className="text-sm text-gray-400">
                College mini project evaluation, viva, and presentation for Cyber Security and Forensic course.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Lock, title: 'HTTPS Validation', desc: 'Checks for secure protocol usage' },
            { icon: Shield, title: 'URL Analysis', desc: '20+ rule-based detection indicators' },
            { icon: Code, title: 'Smart Detection', desc: 'Brand impersonation & keyword analysis' },
            { icon: Award, title: 'Risk Scoring', desc: '0-100 risk score with status classification' },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
              <feature.icon className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-primary-400 mb-3 uppercase tracking-wider">Frontend</h3>
            <ul className="space-y-2">
              {['React 18 with TypeScript', 'Vite 5 (Build Tool)', 'Tailwind CSS 3', 'Framer Motion (Animations)', 'Recharts (Charts)', 'Lucide React (Icons)', 'Axios (HTTP Client)'].map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-accent-400 mb-3 uppercase tracking-wider">Backend</h3>
            <ul className="space-y-2">
              {['Python 3.10+', 'FastAPI Framework', 'SQLAlchemy ORM', 'SQLite Database', 'Pydantic Validation', 'Uvicorn Server', 'RESTful API Design'].map((tech) => (
                <li key={tech} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Detection Engine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-white">Detection Engine</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Our rule-based phishing detection engine analyzes URLs against 20+ indicators:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            'Protocol validation (HTTPS/HTTP)',
            'URL length analysis',
            'Hyphen character detection',
            '@ Symbol detection',
            'IP address detection',
            'Subdomain counting',
            'Dot count analysis',
            'Special character analysis',
            'Number detection',
            'Suspicious keyword matching',
            'Brand impersonation check',
            'Suspicious TLD detection',
          ].map((rule) => (
            <div key={rule} className="flex items-center gap-2 p-2 rounded-lg bg-dark-800/30">
              <Shield className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
              <span className="text-xs text-gray-400">{rule}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;

