import React from 'react';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-dark-800/50 bg-dark-900/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary-500" />
              <div>
                <h3 className="text-lg font-bold text-gradient">PhishGuard</h3>
                <p className="text-xs text-gray-500">Cyber Threat Intelligence</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              A modern phishing URL detection system that analyzes websites 
              in real-time using advanced rule-based threat intelligence 
              techniques to keep you safe online.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Analyze', 'History', 'About'].map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/docs" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">API Docs</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Security Tips</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Threat Report</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} PhishGuard. All rights reserved. Built for Cyber Security and Forensic.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

