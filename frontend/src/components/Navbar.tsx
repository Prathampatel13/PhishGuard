import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Menu, Moon, Sun } from 'lucide-react';
import type { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, onMenuClick }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-dark-800/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-8 h-8 text-primary-500" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gradient">PhishGuard</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase hidden sm:block">
                Threat Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/analyze', label: 'Analyze' },
              { path: '/history', label: 'History' },
              { path: '/about', label: 'About' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-800/50'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 border border-dark-700/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-400" />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-xl bg-dark-800/50 hover:bg-dark-700/50 border border-dark-700/50 transition-all duration-200 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

