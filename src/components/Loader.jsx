import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-primary-600/20 bg-white"
        >
          <img src={logo} alt="Le Focus" className="w-full h-full object-cover" />
        </motion.div>
        
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary-600"
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
