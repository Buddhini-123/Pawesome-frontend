import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MouseTrailEffect: React.FC = () => {
  const trailRef = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Create trail effect
      trailRef.current.forEach((dot, index) => {
        if (dot) {
          setTimeout(() => {
            dot.style.left = `${e.clientX - 5}px`;
            dot.style.top = `${e.clientY - 5}px`;
            dot.style.opacity = `${1 - index * 0.1}`;
          }, index * 20);
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.div
          key={index}
          ref={(el) => {
            if (el) trailRef.current[index] = el;
          }}
          className="absolute w-3 h-3 bg-gradient-to-r from-amber-400 to-sky-400 rounded-full opacity-0"
          style={{
            transform: 'translate(-50%, -50%)',
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
};

export default MouseTrailEffect;