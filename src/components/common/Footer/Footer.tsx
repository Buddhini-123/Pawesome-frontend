import React from 'react';
import NewsletterSection from './NewsletterSection';
import FooterColumns from './FooterColumns';
import FooterExtras from './FooterExtras';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden bg-soft-gray mt-20">
      {/* Wave Pattern SVG */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#FFFAF0"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
      
      {/* Floating Paw Prints Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute text-primary-blue/10 text-6xl animate-float" style={{ top: '20%', left: '10%' }}>🐾</span>
        <span className="absolute text-vibrant-orange/10 text-4xl animate-bounce-slow" style={{ top: '60%', left: '80%' }}>🐾</span>
        <span className="absolute text-sunny-yellow/10 text-5xl animate-float" style={{ top: '40%', left: '50%', animationDelay: '1s' }}>🐾</span>
      </div>

      <div className="relative z-10">
        <NewsletterSection />
        
        <FooterColumns />
        <FooterExtras />
      </div>
    </footer>
  );
};

export default Footer;
