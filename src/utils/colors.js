/**
 * Pawsome Brand Colors
 * Global color palette for consistent theming across the application
 */

export const pawsomeColors = {
  // Primary Colors - CTAs, Branding, Highlights
  primary: {
    energeticOrange: '#FF914D',
    naturalSage: '#9DB47C',
    calmBlue: '#6CA6CD',
    warmOrange: '#FFB657',
  },
  
  // Secondary Colors - Cards, Backgrounds, Hover states
  secondary: {
    softYellow: '#FFE066',
    periwinkle: '#D6CDEA',
    warmTaupe: '#A1866F',
    mint: '#1AB487',
    crimson: '#F64E4E',
  },
  
  // Background Colors - Text, Borders
  background: {
    offWhite: '#F9FAFB',
    lightGray: '#E5E7EB',
    charcoalGray: '#3C3D3C',
  },
  
  // Semantic Mappings
  semantic: {
    primary: '#FF914D',     // Energetic Orange
    secondary: '#9DB47C',   // Natural Sage
    accent: '#6CA6CD',      // Calm Blue
    highlight: '#FFB657',   // Warm Orange
    success: '#1AB487',     // Mint
    warning: '#FFE066',     // Soft Yellow
    error: '#F64E4E',       // Crimson
    neutral: {
      light: '#F9FAFB',     // Off White
      medium: '#E5E7EB',    // Light Gray
      dark: '#3C3D3C',      // Charcoal Gray
    }
  },
  
  // Hover States
  hover: {
    yellow: '#FFE066',      // Soft Yellow
    purple: '#D6CDEA',      // Periwinkle
    taupe: '#A1866F',       // Warm Taupe
  }
};

// Hover States
export const pawsomeHoverColors = {
  yellow: '#FFE066',      // Soft Yellow
  purple: '#D6CDEA',      // Periwinkle
  taupe: '#A1866F',       // Warm Taupe
};

// CSS Variable Names (for dynamic usage)
export const pawsomeCSSVars = {
  primary: {
    energeticOrange: 'var(--pawsome-energetic-orange)',
    naturalSage: 'var(--pawsome-natural-sage)',
    calmBlue: 'var(--pawsome-calm-blue)',
    warmOrange: 'var(--pawsome-warm-orange)',
  },
  secondary: {
    softYellow: 'var(--pawsome-soft-yellow)',
    periwinkle: 'var(--pawsome-periwinkle)',
    warmTaupe: 'var(--pawsome-warm-taupe)',
    mint: 'var(--pawsome-mint)',
    crimson: 'var(--pawsome-crimson)',
  },
  background: {
    offWhite: 'var(--pawsome-off-white)',
    lightGray: 'var(--pawsome-light-gray)',
    charcoalGray: 'var(--pawsome-charcoal-gray)',
  }
};

// Tailwind Class Names (for className usage)
export const pawsomeTailwindClasses = {
  // Colors
  colors: {
    'energetic-orange': 'energetic-orange',
    'natural-sage': 'natural-sage', 
    'calm-blue': 'calm-blue',
    'warm-orange': 'warm-orange',
    'soft-yellow': 'soft-yellow',
    'periwinkle': 'periwinkle',
    'warm-taupe': 'warm-taupe',
    'mint': 'mint',
    'crimson': 'crimson',
    'off-white': 'off-white',
    'light-gray': 'light-gray',
    'charcoal-gray': 'charcoal-gray',
  },
  
  // Buttons
  buttons: {
    primary: 'btn-pawsome-primary',
    secondary: 'btn-pawsome-secondary',
    accent: 'btn-pawsome-accent',
    success: 'btn-pawsome-success',
    warning: 'btn-pawsome-warning',
    error: 'btn-pawsome-error',
  },
  
  // Cards
  cards: {
    default: 'card-pawsome',
    highlight: 'card-pawsome-highlight',
  },
  
  // Text Colors
  text: {
    primary: 'text-pawsome-primary',
    secondary: 'text-pawsome-secondary',
    accent: 'text-pawsome-accent',
  },
  
  // Backgrounds
  backgrounds: {
    gradient: 'bg-pawsome-gradient',
    gradientSecondary: 'bg-pawsome-gradient-secondary',
    gradientSoft: 'bg-pawsome-gradient-soft',
  }
};

// Helper function to get color by name
export const getPawsomeColor = (category, colorName) => {
  return pawsomeColors[category]?.[colorName] || null;
};

// Helper function to generate inline styles
export const getPawsomeStyle = (property, category, colorName) => {
  const color = getPawsomeColor(category, colorName);
  return color ? { [property]: color } : {};
};

export default pawsomeColors;
