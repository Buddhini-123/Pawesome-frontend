import React, { useEffect, useRef, useState } from 'react';

const MouseTrailEffect = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const trailRef = useRef([]);
  const mousePos = useRef({ x: 0, y: 0 });

  // Detect mobile/low-end devices and disable trail
  useEffect(() => {
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    if (isMobile || isLowEnd) {
      setIsEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    let animationId;
    
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Throttle trail updates for better performance
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      animationId = requestAnimationFrame(() => {
        // Reduced trail effect with fewer dots
        trailRef.current.forEach((dot, index) => {
          if (dot && index < 5) { // Only use first 5 dots
            setTimeout(() => {
              dot.style.left = `${e.clientX - 3}px`;
              dot.style.top = `${e.clientY - 3}px`;
              dot.style.opacity = `${0.6 - index * 0.12}`;
            }, index * 30); // Slower trail
          }
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {Array.from({ length: 5 }).map((_, index) => ( // Reduced from 10 to 5
        <div
          key={index}
          ref={(el) => {
            if (el) trailRef.current[index] = el;
          }}
          className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-sky-400 rounded-full opacity-0"
          style={{
            transform: 'translate(-50%, -50%)',
            filter: 'blur(0.5px)', // Reduced blur
          }}
        />
      ))}
    </div>
  );
};

export default MouseTrailEffect;