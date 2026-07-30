import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, TrendingUp, Clock, AlertTriangle, CheckCircle, RefreshCw,
  Download, Copy, FileText, Search, Globe, Zap, BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';
import URLInput from '../components/URLInput';
import RiskMeter from '../components/RiskMeter';
import RiskBadge from '../components/RiskBadge';
import ReasonList from '../components/ReasonList';
import RecommendationCard from '../components/RecommendationCard';
import ThreatIndicators from '../components/ThreatIndicators';
import TechnicalDetails from '../components/TechnicalDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import { generatePDFReport, getRecommendations } from '../utils/helpers';
import type { ScanResult } from '../types';

const Analyze: React.FC = () => {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'details' | 'indicators'>('report');

  const handleAnalyze = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await apiService.analyzeUrl(url);
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze URL';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const handleDownloadPDF = useCallback(() => {
    if (result) {
      generatePDFReport(result);
      toast.success('PDF report downloaded');
    }
  }, [result]);

  const handleCopyResults = useCallback(() => {
    if (result) {
      const text = `PhishGuard Analysis Report\n${'='.repeat(40)}\nURL: ${result.url}\nRisk Score: ${Math.round(result.risk_score)}/100\nStatus: ${result.status}\nConfidence: ${result.confidence}%\n\nReasons:\n${result.reasons.map(r => `  • ${r}`).join('\n')}\n\nRecommendation: ${result.recommendation}`;
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Results copied to clipboard');
      }).catch(() => {
        toast.error('Failed to copy');
      });
    }
  }, [result]);

  return (
    <div className="space-y-8">
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
          URL <span className="text-gradient">Analysis</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Enter any URL below to scan for phishing indicators. Our engine analyzes
          20+ detection rules to determine the threat level.
        </p>
      </motion.div>

      {/* URL Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto"
      >
        {!result && (
          <URLInput onAnalyze={handleAnalyze} loading={loading} />
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-12"
          >
            <LoadingSpinner size="lg" text="Analyzing URL..." />
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center border-red-500/20 bg-red-500/5"
          >
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Analysis Failed</h3>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button onClick={handleReset} className="btn-primary">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-6 max-w-6xl mx-auto"
          >
            {/* URL Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4 flex items-center gap-3"
            >
              <Globe className="w-5 h-5 text-primary-400 flex-shrink-0" />
              <span className="text-sm text-gray-300 truncate font-mono">{result.url}</span>
              <button onClick={handleReset} className="ml-auto btn-ghost text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                New Scan
              </button>
            </motion.div>

            {/* Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Meter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6 flex flex-col items-center justify-center col-span-1"
              >
                <RiskMeter score={result.risk_score} size="lg" />
                <div className="mt-4">
                  <RiskBadge status={result.status} size="lg" />
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 col-span-1 lg:col-span-2"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Analysis Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Zap, label: 'Confidence', value: `${result.confidence}%`, color: 'text-accent-400', bg: 'bg-accent-500/10' },
                    { icon: BarChart3, label: 'Risk Score', value: `${Math.round(result.risk_score)}/100`, color: 'text-warning-400', bg: 'bg-warning-500/10' },
                    { icon: CheckCircle, label: 'Indicators', value: `${result.reasons.length}`, color: 'text-primary-400', bg: 'bg-primary-500/10' },
                    { icon: Shield, label: 'HTTPS', value: result.analysis_details.has_https ? 'Yes' : 'No', color: result.analysis_details.has_https ? 'text-accent-400' : 'text-red-400', bg: result.analysis_details.has_https ? 'bg-accent-500/10' : 'bg-red-500/10' },
                    { icon: Clock, label: 'URL Length', value: `${result.analysis_details.url_length} chars`, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { icon: TrendingUp, label: 'Subdomains', value: `${result.analysis_details.subdomain_count}`, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/30">
                      <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-sm font-semibold text-white">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Analysis Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-dark-700/50 pb-2">
              {[
                { id: 'report' as const, label: 'Analysis Report', icon: FileText },
                { id: 'indicators' as const, label: 'Threat Indicators', icon: Shield },
                { id: 'details' as const, label: 'Technical Details', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all ${
                    activeTab === tab.id
                      ? 'text-primary-400 bg-primary-500/10 border-b-2 border-primary-500'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800/30'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'report' && (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Detection Reasons */}
                  <ReasonList reasons={result.reasons} status={result.status} />

                  {/* Recommendations */}
                  <RecommendationCard
                    recommendation={result.recommendation}
                    status={result.status}
                    confidence={result.confidence}
                    recommendations={getRecommendations(result.status)}
                  />
                </motion.div>
              )}

              {activeTab === 'indicators' && (
                <motion.div
                  key="indicators"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ThreatIndicators details={result.analysis_details} />
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TechnicalDetails details={result.analysis_details} url={result.url} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-3 pt-4"
            >
              <button onClick={handleReset} className="btn-primary">
                <Search className="w-4 h-4" />
                Analyze Another URL
              </button>

              <button onClick={handleDownloadPDF} className="btn-secondary">
                <Download className="w-4 h-4" />
                Download PDF
              </button>

              <button onClick={handleCopyResults} className="btn-secondary">
                <Copy className="w-4 h-4" />
                Copy Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-dark-800/50 border border-dark-700/30 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-dark-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Analyze</h3>
            <p className="text-sm text-gray-500">
              Enter a URL above to scan it for phishing indicators.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-left">
              {[
                { label: 'Safe Example', url: 'https://google.com' },
                { label: 'Suspicious', url: 'http://secure-login.xyz/auth' },
                { label: 'Dangerous', url: 'https://paypal-verify-account.tk/login' },
                { label: 'Long URL', url: 'https://facebook.com/profile.php?id=1234567890' },
              ].map((example) => (
                <button
                  key={example.label}
                  onClick={() => handleAnalyze(example.url)}
                  className="p-3 rounded-xl bg-dark-800/30 hover:bg-dark-800/50 border border-dark-700/30 hover:border-primary-500/30 text-left transition-all group"
                >
                  <p className="text-xs text-gray-500 mb-1">{example.label}</p>
                  <p className="text-xs text-gray-400 truncate font-mono group-hover:text-primary-400 transition-colors">
                    {example.url}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analyze;

