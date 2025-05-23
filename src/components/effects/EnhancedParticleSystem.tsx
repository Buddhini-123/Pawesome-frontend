import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'paw' | 'heart' | 'sparkle';
  opacity: number;
}

interface EnhancedParticleSystemProps {
  intensity?: number;
  mouseInteractive?: boolean;
}

const EnhancedParticleSystem: React.FC<EnhancedParticleSystemProps> = ({ 
  intensity = 1,
  mouseInteractive = true 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Simplified color palette
  const colors = useMemo(() => [
    '#F59E0B', '#FBBF24', '#FCD34D',
    '#6CA6CD', '#87CEEB', '#0EA5E9',
    '#EC4899', '#F472B6',
  ], []);

  // Safe particle generation
  const generateParticle = useCallback((type: Particle['type'] = 'sparkle'): Particle => {
    if (!window || !window.innerWidth || !window.innerHeight) {
      return null;
    }
    
    const life = 5 + Math.random() * 8;
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: type === 'paw' ? 8 + Math.random() * 4 : 3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      life,
      maxLife: life,
      type,
      opacity: 0.2 + Math.random() * 0.3,
    };
  }, [colors]);

  // Safe mouse tracking
  useEffect(() => {
    if (!mouseInteractive) return;

    const handleMouseMove = (e: MouseEvent) => {
      try {
        setMousePos({ x: e.clientX, y: e.clientY });
        
        // Occasionally generate particles on mouse movement
        if (Math.random() < 0.1) {
          const particleType = Math.random() < 0.5 ? 'paw' : Math.random() < 0.8 ? 'heart' : 'sparkle';
          const newParticle = generateParticle(particleType);
          if (newParticle) {
            newParticle.x = e.clientX;
            newParticle.y = e.clientY;
            setParticles(prev => [...prev.slice(-20), newParticle]);
          }
        }
      } catch (error) {
        console.warn('Mouse move error:', error);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [mouseInteractive, generateParticle]);

  // Generate initial particles safely
  useEffect(() => {
    const generateInitialParticles = () => {
      try {
        if (!window || !window.innerWidth || !window.innerHeight) return;
        
        const newParticles: Particle[] = [];
        const baseCount = Math.floor(15 * intensity);
        
        for (let i = 0; i < baseCount; i++) {
          const particleTypes: Particle['type'][] = ['sparkle', 'paw', 'heart'];
          const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
          const particle = generateParticle(type);
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
    
    const handleResize = () => generateInitialParticles();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [generateParticle, intensity]);

  // Safe particle animation
  useEffect(() => {
    const animationLoop = setInterval(() => {
      setParticles(prev => {
        try {
          return prev.map(particle => {
            let newX = particle.x + particle.vx;
            let newY = particle.y + particle.vy;
            let newVx = particle.vx * 0.99;
            let newVy = particle.vy * 0.99;

            // Safe boundary checking
            if (window && window.innerWidth && window.innerHeight) {
              if (newX <= 0 || newX >= window.innerWidth) {
                newVx *= -0.8;
                newX = Math.max(0, Math.min(window.innerWidth, newX));
              }
              if (newY <= 0 || newY >= window.innerHeight) {
                newVy *= -0.8;
                newY = Math.max(0, Math.min(window.innerHeight, newY));
              }
            }

            return {
              ...particle,
              x: newX,
              y: newY,
              vx: newVx,
              vy: newVy,
              life: particle.life - 0.02,
            };
          }).filter(particle => particle.life > 0);
        } catch (error) {
          console.warn('Animation loop error:', error);
          return prev;
        }
      });
    }, 32); // ~30fps for better performance

    return () => clearInterval(animationLoop);
  }, []);

  // Safe particle rendering
  const renderParticle = (particle: Particle) => {
    try {
      const baseStyle = {
        left: particle.x,
        top: particle.y,
        opacity: (particle.life / particle.maxLife) * particle.opacity,
      };

      switch (particle.type) {
        case 'paw':
          return (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none select-none"
              style={{
                ...baseStyle,
                fontSize: `${particle.size}px`,
                color: particle.color,
              }}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🐾
            </motion.div>
          );

        case 'heart':
          return (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none select-none"
              style={{
                ...baseStyle,
                fontSize: `${particle.size}px`,
                color: particle.color,
              }}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ♥
            </motion.div>
          );

        case 'sparkle':
        default:
          return (
            <motion.div
              key={particle.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                ...baseStyle,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
              }}
              animate={{
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
      }
    } catch (error) {
      console.warn('Render particle error:', error);
      return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {particles.map(renderParticle).filter(Boolean)}
      
      {/* Simplified mouse interaction effect */}
      {mouseInteractive && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePos.x - 20,
            top: mousePos.y - 20,
            width: 40,
            height: 40,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 blur-lg" />
        </motion.div>
      )}
      
      {/* Static ambient pet elements */}
      <div className="absolute inset-0 pointer-events-none">
        {['🐕', '🐱', '🐦', '🐠'].map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl opacity-8"
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 6 + index * 2,
              repeat: Infinity,
              delay: index * 1.5,
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