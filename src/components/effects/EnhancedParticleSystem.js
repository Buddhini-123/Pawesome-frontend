import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const EnhancedParticleSystem = ({ 
  intensity = 0.5, // Reduced default intensity
  mouseInteractive = false // Disabled by default for performance
}) => {
  const [particles, setParticles] = useState([]);

  // Reduced color palette for better performance
  const colors = useMemo(() => [
    '#F59E0B', '#87CEEB', '#EC4899'
  ], []);

  // Simplified particle generation
  const generateParticle = useCallback(() => {
    if (!window || !window.innerWidth || !window.innerHeight) {
      return null;
    }
    
    const life = 3 + Math.random() * 3; // Shorter life
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 2 + Math.random() * 2, // Smaller particles
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life,
      maxLife: life,
      type: 'sparkle',
      opacity: 0.1 + Math.random() * 0.2, // Lower opacity
    };
  }, [colors]);

  // Generate fewer initial particles
  useEffect(() => {
    const generateInitialParticles = () => {
      try {
        if (!window || !window.innerWidth || !window.innerHeight) return;
        
        const newParticles = [];
        const baseCount = Math.floor(8 * intensity); // Reduced from 15 to 8
        
        for (let i = 0; i < baseCount; i++) {
          const particle = generateParticle();
          if (particle) {
            newParticles.push(particle);
          }
        }
        
        setParticles(newParticles);
      } catch (error) {
        console.warn('Initial particles error:', error);
      }
    };

    generateInitialParticles();
  }, [generateParticle, intensity]);

  // Slower particle animation with cleanup
  useEffect(() => {
    const animationLoop = setInterval(() => {
      setParticles(prev => {
        try {
          const updated = prev.map(particle => {
            let newX = particle.x + particle.vx;
            let newY = particle.y + particle.vy;

            // Simple boundary checking
            if (window && window.innerWidth && window.innerHeight) {
              if (newX < 0 || newX > window.innerWidth) newX = Math.random() * window.innerWidth;
              if (newY < 0 || newY > window.innerHeight) newY = Math.random() * window.innerHeight;
            }

            return {
              ...particle,
              x: newX,
              y: newY,
              life: particle.life - 0.05, // Faster decay
            };
          }).filter(particle => particle.life > 0);

          // Add new particle occasionally
          if (updated.length < 5 && Math.random() < 0.1) {
            const newParticle = generateParticle();
            if (newParticle) {
              updated.push(newParticle);
            }
          }

          return updated;
        } catch (error) {
          return prev;
        }
      });
    }, 50); // Slower animation loop (20fps instead of 30fps)

    return () => clearInterval(animationLoop);
  }, [generateParticle]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: (particle.life / particle.maxLife) * particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
      
      {/* Reduced ambient pet elements */}
      <div className="absolute inset-0 pointer-events-none">
        {['🐕', '🐱'].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-xl opacity-5"
            style={{
              left: `${30 + index * 40}%`,
              top: `${40}%`,
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.02, 0.08, 0.02],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              delay: index * 3,
              ease: "easeInOut",
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedParticleSystem;