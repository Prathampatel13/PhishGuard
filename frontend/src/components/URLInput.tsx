import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, AlertCircle } from 'lucide-react';

interface URLInputProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

const URLInput: React.FC<URLInputProps> = ({ onAnalyze, loading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError('Please enter a URL');
      return false;
    }
    
    try {
      // Add a dummy protocol if missing just for validation purposes
      const urlToValidate = value.trim().match(/^https?:\/\//i) 
        ? value.trim() 
        : `https://${value.trim()}`;
        
      new URL(urlToValidate);
      setError('');
      return true;
    } catch (err) {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(url)) {
      onAnalyze(url.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Input Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            <Link2 className="w-5 h-5 text-gray-500" />
          </div>

          {/* URL Input */}
          <input
            type="text"
            value={url}
            onChange={handleChange}
            placeholder="Enter a URL to analyze (e.g., https://example.com)"
            disabled={loading}
            className={`w-full pl-12 pr-36 py-4 bg-dark-800/80 border ${
              error ? 'border-red-500/50' : 'border-dark-700/50'
            } rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 disabled:opacity-50`}
          />

          {/* Analyze Button */}
          <div className="absolute right-2">
            <motion.button
              type="submit"
              disabled={loading || !url.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 cyber-glow"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                  />
                  Scanning...
                </span>
              ) : (
                'Scan URL'
              )}
            </motion.button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-2 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}

        {/* Helper text */}
        <p className="mt-3 text-xs text-gray-500">
          Enter any website URL to check for phishing indicators. Results include risk score, detection reasons, and recommendations.
        </p>
      </form>
    </motion.div>
  );
};

export default URLInput;

