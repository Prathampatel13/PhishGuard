import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import About from './pages/About';

import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            },
          }}
        />

        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex pt-16">

          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">

            <main className="flex-1">

              <div className="max-w-7xl mx-auto w-full px-6 py-8">

                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/analyze" element={<Analyze />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </AnimatePresence>

              </div>

            </main>

            <Footer />

          </div>

        </div>

      </div>
    </div>
  );
};

export default App;