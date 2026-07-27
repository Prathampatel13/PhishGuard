import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import URLInput from '../components/URLInput';
import RiskMeter from '../components/RiskMeter';
import RiskBadge from '../components/RiskBadge';
import ReasonList from '../components/ReasonList';
import RecommendationCard from '../components/RecommendationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/api';
import type { ScanResult } from '../types';

const Analyze: React.FC = () => {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        {/* Show URL input only when no result or when reset */}
        {!result && (
          <URLInput onAnalyze={handleAnalyze} loading={loading} />
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-12"
          >
            <LoadingSpinner size="lg" text="Analyzing URL..." />
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 text-center border-red-500/20 bg-red-500/5"
          >
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Analysis Failed</h3>
            <p className="text-sm text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors"
            >
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
            className="space-y-8"
          >
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: TrendingUp,
                      label: 'Confidence',
                      value: `${result.confidence}%`,
                      color: 'text-accent-400',
                      bg: 'bg-accent-500/10',
                    },
                    {
                      icon: AlertTriangle,
                      label: 'Risk Score',
                      value: `${Math.round(result.risk_score)}/100`,
                      color: 'text-yellow-400',
                      bg: 'bg-yellow-500/10',
                    },
                    {
                      icon: CheckCircle,
                      label: 'Indicators',
                      value: `${result.reasons.length}`,
                      color: 'text-primary-400',
                      bg: 'bg-primary-500/10',
                    },
                    {
                      icon: Shield,
                      label: 'HTTPS',
                      value: result.analysis_details.has_https ? 'Yes' : 'No',
                      color: result.analysis_details.has_https ? 'text-accent-400' : 'text-red-400',
                      bg: result.analysis_details.has_https ? 'bg-accent-500/10' : 'bg-red-500/10',
                    },
                    {
                      icon: Clock,
                      label: 'URL Length',
                      value: `${result.analysis_details.url_length} chars`,
                      color: 'text-purple-400',
                      bg: 'bg-purple-500/10',
                    },
                    {
                      icon: TrendingUp,
                      label: 'Subdomains',
                      value: `${result.analysis_details.subdomain_count}`,
                      color: 'text-cyan-400',
                      bg: 'bg-cyan-500/10',
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/30"
                    >
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

            {/* Analysis Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detailed Analysis Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Technical Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'URL Protocol', value: result.analysis_details.has_https ? 'HTTPS (Secure)' : result.analysis_details.has_http ? 'HTTP (Insecure)' : 'Unknown', status: result.analysis_details.has_https ? 'safe' : 'dangerous' },
                    { label: 'IP Address Detected', value: result.analysis_details.has_ip ? 'Yes' : 'No', status: result.analysis_details.has_ip ? 'dangerous' : 'safe' },
                    { label: '@ Symbol Present', value: result.analysis_details.has_at_symbol ? 'Yes' : 'No', status: result.analysis_details.has_at_symbol ? 'dangerous' : 'safe' },
                    { label: 'Hyphens in Domain', value: result.analysis_details.has_hyphens ? 'Yes' : 'No', status: result.analysis_details.has_hyphens ? 'suspicious' : 'safe' },
                    { label: 'Suspicious TLD', value: result.analysis_details.suspicious_tld ? 'Yes' : 'No', status: result.analysis_details.suspicious_tld ? 'dangerous' : 'safe' },
                    { label: 'Subdomain Count', value: `${result.analysis_details.subdomain_count}`, status: result.analysis_details.subdomain_count > 2 ? 'suspicious' : 'safe' },
                    { label: 'Special Characters', value: `${result.analysis_details.special_char_count}`, status: result.analysis_details.special_char_count > 10 ? 'suspicious' : 'safe' },
                  ].map((detail) => (
                    <div
                      key={detail.label}
                      className="flex items-center justify-between p-3 rounded-xl bg-dark-800/50 border border-dark-700/30"
                    >
                      <span className="text-sm text-gray-400">{detail.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{detail.value}</span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            detail.status === 'safe' ? 'bg-accent-500' :
                            detail.status === 'dangerous' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Keywords & Brands Found */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                {/* Suspicious Keywords */}
                {result.analysis_details.suspicious_keywords.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Suspicious Keywords Found</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis_details.suspicious_keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium rounded-lg"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brand Impersonation */}
                {result.analysis_details.brand_impersonation.length > 0 && (
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Brand Impersonation Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis_details.brand_impersonation.map((brand) => (
                        <span
                          key={brand}
                          className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium rounded-lg"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* No threats found */}
                {result.analysis_details.suspicious_keywords.length === 0 &&
                 result.analysis_details.brand_impersonation.length === 0 && (
                  <div className="glass-card p-6 border-accent-500/20 bg-accent-500/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-accent-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-accent-400">No Threats Detected</h3>
                        <p className="text-sm text-gray-400">No suspicious keywords or brand impersonation found.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Detection Reasons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ReasonList reasons={result.reasons} status={result.status} />
            </motion.div>

            {/* Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <RecommendationCard
                recommendation={result.recommendation}
                status={result.status}
                confidence={result.confidence}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all duration-200 cyber-glow"
              >
                <RefreshCw className="w-4 h-4" />
                Analyze Another URL
              </button>

              <button
                onClick={() => {
                  // Copy results as JSON
                  const text = JSON.stringify(result, null, 2);
                  navigator.clipboard.writeText(text).then(() => {
                    toast.success('Results copied to clipboard');
                  }).catch(() => {
                    toast.error('Failed to copy results');
                  });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-dark-800 hover:bg-dark-700 text-gray-300 font-medium rounded-xl border border-dark-700/50 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State (no result, no loading, no error) */}
      {!result && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-dark-800/50 border border-dark-700/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-dark-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Ready to Analyze</h3>
            <p className="text-sm text-gray-500">
              Enter a URL above to scan it for phishing indicators. Our engine will check for suspicious patterns, brand impersonation, and other threats.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              {[
                { label: 'Safe Example', url: 'https://google.com' },
                { label: 'Suspicious Example', url: 'http://secure-login.xyz/auth' },
                { label: 'Dangerous Example', url: 'https://paypal-verify-account.tk/login' },
                { label: 'Long URL Example', url: 'https://facebook.com/profile.php?id=123456789012345&ref=notifications&source=email' },
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

