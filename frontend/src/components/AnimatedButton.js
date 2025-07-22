import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: '0 4px 24px 0 rgba(99,102,241,0.15)' }}
    whileTap={{ scale: 0.97 }}
    className={`transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton; 