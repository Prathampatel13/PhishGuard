import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  History,
  Info,
  X,
  Shield,
  Activity,
  FileText,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/analyze', label: 'Analyze URL', icon: Search },
  { path: '/history', label: 'Scan History', icon: History },
  { path: '/about', label: 'About', icon: Info },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{
          x: window.innerWidth >= 1024 ? 0 : isOpen ? 0 : -300,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed top-16 left-0 bottom-0 w-64 z-50 bg-dark-900/95 backdrop-blur-xl border-r border-dark-800/50 overflow-y-auto"
      >
        <div className="p-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary-500" />
              <span className="font-semibold text-sm text-gray-300">
                Navigation
              </span>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-dark-800"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />

                <span>{item.label}</span>

                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="mt-8 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50">

            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-accent-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase">
                Quick Actions
              </span>
            </div>

            <div className="space-y-2">
              <Link
                to="/analyze"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-xs font-medium"
              >
                <Search className="w-3.5 h-3.5" />
                New Scan
              </Link>

              <Link
                to="/history"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 hover:bg-dark-700 text-gray-300 text-xs font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                View Reports
              </Link>
            </div>

          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;