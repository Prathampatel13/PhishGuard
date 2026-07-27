import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';

interface AnalyzeButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  onClick,
  loading,
  disabled = false,
  label = 'Analyze URL',
  loadingLabel = 'Analyzing...',
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-2xl transition-all duration-200 ${
        disabled || loading
          ? 'bg-dark-600 text-gray-500 cursor-not-allowed'
          : 'bg-primary-600 hover:bg-primary-700 text-white cyber-glow'
      }`}
    >
      {loading ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.span>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5" />
          <span>{label}</span>
        </>
      )}
    </motion.button>
  );
};

export default AnalyzeButton;

