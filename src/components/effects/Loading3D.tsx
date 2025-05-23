import React from 'react';
import { motion } from 'framer-motion';

const Loading3D: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-sky-50 to-amber-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Pet-themed 3D Loading Animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          animate={{ rotateY: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0 border-4 border-amber-400/40 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-sky-400/60 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 border-4 border-yellow-400/80 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-6 w-20 h-20 bg-gradient-to-r from-amber-400 to-sky-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.span 
              className="text-white font-bold text-2xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🐾
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Pet-themed Loading Text */}
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-4"
          animate={{ 
            opacity: [0.6, 1, 0.6],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Your Pet Paradise...
        </motion.h2>

        {/* Pet Loading Dots */}
        <div className="flex justify-center space-x-3">
          {['🐕', '🐱', '🐦'].map((pet, index) => (
            <motion.div
              key={index}
              className="text-2xl"
              animate={{
                y: [0, -15, 0],
                opacity: [0.4, 1, 0.4],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: index * 0.3
              }}
            >
              {pet}
            </motion.div>
          ))}
        </div>

        {/* Loading Progress Text */}
        <motion.p
          className="text-gray-600 mt-4 text-sm"
          animate={{
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1
          }}
        >
          Preparing the best experience for your furry friends...
        </motion.p>
      </div>
    </div>
  );
};

export default Loading3D;