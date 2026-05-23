import React from 'react';
import FooterColumns from './FooterColumns';
import FooterExtras from './FooterExtras';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-soft-gray">
      {/* Floating Paw Prints Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-primary-blue/10 text-6xl animate-float" style={{ top: '20%', left: '10%' }}>🐾</span>
        <span className="absolute text-vibrant-orange/10 text-4xl animate-bounce-slow" style={{ top: '60%', left: '80%' }}>🐾</span>
        <span className="absolute text-sunny-yellow/10 text-5xl animate-float" style={{ top: '40%', left: '50%', animationDelay: '1s' }}>🐾</span>
      </div>

      <div className="relative z-10">
        <FooterColumns />
        <FooterExtras />
      </div>
    </footer>
  );
};

export default Footer;
