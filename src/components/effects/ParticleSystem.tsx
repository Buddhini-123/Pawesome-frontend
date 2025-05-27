import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  type: 'normal' | 'interactive' | 'magical';
}

interface ParticleSystemProps {
  interactive?: boolean;
  intensity?: number;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  interactive = false, 
  intensity = 1 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const generateParticle = useCallback((type: Particle['type'] = 'normal'): Particle => {
    // Enhanced color palette with more vibrant options
    const colors = [
      '#F59E0B', '#FBBF24', '#FCD34D', // Warm yellows/ambers
      '#6CA6CD', '#87CEEB', '#0EA5E9', // Sky blues
      '#EC4899', '#F472B6', '#FB7185', // Playful pinks
      '#10B981', '#34D399', '#6EE7B7', // Fresh greens
      '#8B5CF6', '#A78BFA', '#C4B5FD', // Magic purples
    ];

    const isInteractive = type === 'interactive';
    const isMagical = type === 'magical';
    const life = isMagical ? 20 : 15;

    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: isInteractive ? 8 + Math.random() * 12 : 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: isMagical ? 15 + Math.random() * 10 : 8 + Math.random() * 12,
      delay: Math.random() * 3,
      vx: (Math.random() - 0.5) * (isInteractive ? 3 : 1),
      vy: (Math.random() - 0.5) * (isInteractive ? 3 : 1),
      life,
      maxLife: life,
      type,
    };
  }, []);

  // Mouse tracking for interactive particles
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Generate initial particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const baseCount = Math.floor(30 * intensity);
      
      // Normal particles
      for (let i = 0; i < baseCount; i++) {
        newParticles.push(generateParticle('normal'));
      }
      
      // Interactive particles (when interactive mode is on)
      if (interactive) {
        for (let i = 0; i < Math.floor(10 * intensity); i++) {
          newParticles.push(generateParticle('interactive'));
        }
        
        // Magical particles (special effects)
        for (let i = 0; i < Math.floor(5 * intensity); i++) {
          newParticles.push(generateParticle('magical'));
        }
      }
      
      setParticles(newParticles);
    };

    generateParticles();
    
    const handleResize = () => generateParticles();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [generateParticle, interactive, intensity]);

  // Particle animation loop
  useEffect(() => {
    if (!interactive) return;

    const animationLoop = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => {
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;

          // Interactive particles are attracted to mouse
          if (particle.type === 'interactive') {
            const dx = mousePos.x - newX;
            const dy = mousePos.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
              const force = (200 - distance) / 200;
              newVx += (dx / distance) * force * 0.1;
              newVy += (dy / distance) * force * 0.1;
            }
          }

          // Magical particles have special behavior
          if (particle.type === 'magical') {
            const time = Date.now() * 0.001;
            newVx += Math.sin(time + particle.id) * 0.5;
            newVy += Math.cos(time + particle.id) * 0.5;
          }

          // Apply damping
          newVx *= 0.98;
          newVy *= 0.98;

          // Boundary bouncing
          if (newX <= 0 || newX >= window.innerWidth) {
            newVx *= -0.8;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            newVy *= -0.8;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            life: particle.life - 0.016, // Decrease life
          };
        }).filter(particle => particle.life > 0)
      );
    }, 16); // ~60fps

    return () => clearInterval(animationLoop);
  }, [interactive, mousePos]);

  // Add new particles periodically when interactive
  useEffect(() => {
    if (!interactive) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        if (prev.length < 100) { // Max particle limit
          return [...prev, generateParticle(Math.random() > 0.7 ? 'interactive' : 'normal')];
        }
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [interactive, generateParticle]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            left: interactive ? particle.x : particle.x,
            top: interactive ? particle.y : particle.y,
            opacity: interactive ? particle.life / particle.maxLife : 0.3,
            boxShadow: particle.type === 'magical' 
              ? `0 0 ${particle.size * 3}px ${particle.color}` 
              : `0 0 ${particle.size * 2}px ${particle.color}40`,
            filter: particle.type === 'magical' ? 'blur(1px)' : 'none',
          }}
          animate={!interactive ? {
            y: [particle.y, particle.y - 120, particle.y],
            x: [particle.x, particle.x + Math.sin(particle.id) * 40, particle.x],
            opacity: [0, 0.7, 0],
            scale: [0.3, 1.2, 0.3],
          } : undefined}
          transition={!interactive ? {
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          } : undefined}
        />
      ))}
      
      {/* Mouse interaction effect */}
      {interactive && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePos.x - 25,
            top: mousePos.y - 25,
            width: 50,
            height: 50,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20 blur-xl" />
        </motion.div>
      )}
      
      {/* Pet-themed floating elements */}
      {interactive && (
        <div className="absolute inset-0 pointer-events-none">
          {['🐾', '💖', '⭐', '🌟'].map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl opacity-20"
              style={{
                left: `${20 + index * 20}%`,
                top: `${30 + index * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [0.8, 1.3, 0.8],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticleSystem;