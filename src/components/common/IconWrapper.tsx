import React from 'react';

// Wrapper component to fix React 19 type issues with react-icons
export const IconWrapper: React.FC<{ icon: React.ReactNode; className?: string }> = ({ icon, className }) => {
  return <span className={className}>{icon}</span>;
};

export default IconWrapper;