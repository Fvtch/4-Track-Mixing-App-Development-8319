import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSliders, FiTarget, FiHeadphones } = FiIcons;

const Navigation = ({ currentPage, setCurrentPage }) => {
  const location = useLocation();

  const navItems = [
    { id: 'mixer', label: 'Mixer', icon: FiSliders, path: '/mixer' },
    { id: 'challenges', label: 'Mix Challenges', icon: FiTarget, path: '/challenges' }
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <SafeIcon icon={FiHeadphones} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Balancing Act</h1>
              <p className="text-xs text-gray-400">4-Track Mixer</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setCurrentPage(item.id)}
              >
                <motion.button
                  className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                    location.pathname === item.path || (location.pathname === '/' && item.path === '/mixer')
                      ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SafeIcon icon={item.icon} className="text-lg" />
                  <span className="hidden sm:block font-medium">{item.label}</span>
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;