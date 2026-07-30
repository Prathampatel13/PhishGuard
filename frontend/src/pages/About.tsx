

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield, BookOpen, Users, Award, Target, Code, Lock, Zap,
  Search, AlertTriangle, CheckCircle, Globe, Server, Brain,
BarChart3, Download, FileText, Activity, ExternalLink, Database
} from 'lucide-react';

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

      {/* What is Phishing? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <h2 className="text-xl font-bold text-white">What is Phishing?</h2>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-400 leading-relaxed">
            Phishing is a type of cyber attack where attackers create fake websites or send deceptive messages
            that appear to be from legitimate sources. The goal is to trick users into revealing sensitive
            information such as usernames, passwords, credit card numbers, or other personal data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="text-2xl font-bold text-red-400 mb-1">3.4B+</div>
              <p className="text-xs text-gray-400">Phishing emails sent daily</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="text-2xl font-bold text-red-400 mb-1">1.2M+</div>
              <p className="text-xs text-gray-400">Phishing sites created monthly</p>
            </div>
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="text-2xl font-bold text-red-400 mb-1">$12B+</div>
              <p className="text-xs text-gray-400">Annual losses due to phishing</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How Detection Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">How Detection Works</h2>
        </div>
        <div className="space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed">
            PhishGuard uses a sophisticated rule-based detection engine that analyzes URLs against
            20+ security indicators. Each indicator is evaluated and contributes to an overall risk score.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { step: '1', title: 'URL Parsing', desc: 'Extract protocol, domain, path, and parameters from the URL', icon: Search },
              { step: '2', title: 'Rule Analysis', desc: 'Apply 20+ detection rules to identify phishing patterns', icon: CheckCircle },
              { step: '3', title: 'Risk Scoring', desc: 'Calculate weighted risk score from 0 (safe) to 100 (dangerous)', icon: BarChart3 },
              { step: '4', title: 'Report Generation', desc: 'Generate detailed analysis report with recommendations', icon: FileText },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-400">{item.step}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-4 h-4 text-primary-400" />
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detection Rules */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Detection Rules Engine</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { icon: Lock, label: 'HTTPS Check', color: 'text-accent-400' },
            { icon: Globe, label: 'Suspicious TLD', color: 'text-red-400' },
            { icon: Server, label: 'IP Address', color: 'text-yellow-400' },
            { icon: Target, label: 'Brand Impersonation', color: 'text-red-400' },
            { icon: Search, label: 'Keyword Analysis', color: 'text-yellow-400' },
            { icon: Code, label: 'URL Length', color: 'text-primary-400' },
            { icon: Shield, label: 'Subdomain Count', color: 'text-cyan-400' },
            { icon: AlertTriangle, label: 'Special Chars', color: 'text-purple-400' },
          ].map((rule) => (
            <div key={rule.label} className="flex items-center gap-2 p-3 rounded-xl bg-dark-800/30 border border-dark-700/30">
              <rule.icon className={`w-4 h-4 ${rule.color} flex-shrink-0`} />
              <span className="text-xs text-gray-400">{rule.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Project Information</h2>
        </div>
        <div className="grid gap-4">
          {[
            { icon: Target, title: 'Subject', desc: 'Cyber Security and Forensic - Cyber Threat Intelligence and Analysis', color: 'text-primary-400' },
            { icon: Award, title: 'Project Goal', desc: 'Develop a modern web application that analyzes website URLs and predicts whether they are Safe, Suspicious, or Dangerous using rule-based phishing detection techniques.', color: 'text-accent-400' },
            { icon: Users, title: 'Target Audience', desc: 'College mini project evaluation, viva, and presentation for Cyber Security and Forensic course.', color: 'text-purple-400' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/30">
              <item.icon className={`w-5 h-5 ${item.color} mt-0.5 flex-shrink-0`} />
              <div>
                <h3 className="font-semibold text-white mb-1 text-sm">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-primary-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Frontend
            </h3>
            <div className="space-y-3">
              {[
                { name: 'React 18', desc: 'UI library with TypeScript' },
                { name: 'Vite 5', desc: 'Next-gen build tool' },
                { name: 'Tailwind CSS 3', desc: 'Utility-first CSS framework' },
                { name: 'Framer Motion', desc: 'Animation library' },
                { name: 'Recharts', desc: 'Charting library' },
                { name: 'Lucide React', desc: 'Icon library' },
                { name: 'Axios', desc: 'HTTP client' },
                { name: 'jsPDF', desc: 'PDF generation' },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30 border border-dark-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    <span className="text-sm text-gray-300">{tech.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{tech.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-accent-400 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4" />
              Backend
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Python 3.10+', desc: 'Programming language' },
                { name: 'FastAPI', desc: 'Web framework' },
                { name: 'SQLAlchemy', desc: 'ORM' },
                { name: 'SQLite', desc: 'Database' },
                { name: 'Pydantic', desc: 'Data validation' },
                { name: 'Uvicorn', desc: 'ASGI server' },
                { name: 'RESTful API', desc: 'API design' },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center justify-between p-3 rounded-xl bg-dark-800/30 border border-dark-700/30">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                    <span className="text-sm text-gray-300">{tech.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{tech.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Architecture */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-white">Project Architecture</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Presentation Layer', desc: 'React SPA with Tailwind CSS, Framer Motion animations, and responsive design', icon: Globe },
            { title: 'API Layer', desc: 'FastAPI RESTful endpoints with Pydantic validation and async operations', icon: Server },
            { title: 'Data Layer', desc: 'SQLite database with SQLAlchemy ORM for scan history and analytics', icon: Database },
          ].map((layer) => (
            <div key={layer.title} className="p-5 rounded-xl bg-dark-800/50 border border-dark-700/30 text-center">
              <layer.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-2">{layer.title}</h3>
              <p className="text-xs text-gray-400">{layer.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center py-8"
      >
        <p className="text-sm text-gray-500">
          Built with ❤️ for Cyber Security and Forensic Education
        </p>
      </motion.div>
    </div>
  );
};

export default About;
