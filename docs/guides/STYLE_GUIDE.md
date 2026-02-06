# 🎨 Pawsome Style Guide

## Table of Contents
1. [Brand Identity](#brand-identity)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Styling](#component-styling)
6. [Animations & Transitions](#animations--transitions)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Code Style Conventions](#code-style-conventions)

---

## Brand Identity

### Brand Personality
- **Playful & Friendly**: Fun, approachable design for pet lovers
- **Trustworthy**: Professional yet warm aesthetic
- **Modern**: Clean, contemporary interface
- **Colorful**: Vibrant colors reflecting pet energy

### Design Principles
1. **Pet-First**: Every design decision should enhance the pet shopping experience
2. **Simplicity**: Clean, uncluttered interfaces
3. **Consistency**: Uniform styling across all components
4. **Delight**: Subtle animations and playful elements

---

## Color Palette

### Primary Colors
```css
/* Defined in tailwind.config.js */
primary-blue: #2196F3      /* Bright, trustworthy blue */
vibrant-orange: #FF6B35    /* Playful orange for CTAs */
sunny-yellow: #FFD93D      /* Happy yellow for highlights */
```

### Secondary Colors
```css
mint-green: #1AB4A5        /* Fresh, calming green */
lavender: #B19CD9          /* Soft purple accent */
soft-pink: #FFB5B5         /* Gentle pink for favorites */
crimson: #FF5252           /* Alert/error red */
```

### Neutral Colors
```css
charcoal: #2C3E50         /* Primary text color */
medium-gray: #6C757D      /* Secondary text */
light-gray: #E5E5E5       /* Borders and dividers */
soft-gray: #F8F9FA        /* Background tints */
warm-white: #FFFAF0       /* Main background */
```

### Usage Guidelines

#### Primary Actions
- **Buttons**: `bg-vibrant-orange hover:bg-sunny-yellow`
- **Links**: `text-primary-blue hover:text-vibrant-orange`
- **Active States**: `bg-primary-blue text-white`

#### Status Colors
- **Success**: `bg-mint-green text-white`
- **Warning**: `bg-sunny-yellow text-charcoal`
- **Error**: `bg-crimson text-white`
- **Info**: `bg-primary-blue text-white`

---

## Typography

### Font Families
```css
/* Primary Font */
font-fredoka: ['Fredoka', 'Comic Sans MS', 'sans-serif']

/* Secondary Font (deprecated - use sparingly) */
font-nunito: ['Nunito', 'Segoe UI', 'sans-serif']

/* Decorative Font */
font-pacifico: ['Pacifico', 'cursive']
```

### Font Sizes
```css
/* Headings */
text-7xl: 4.5rem    /* Hero titles */
text-6xl: 3.75rem   /* Page titles */
text-5xl: 3rem      /* Section titles */
text-4xl: 2.25rem   /* Subsection titles */
text-3xl: 1.875rem  /* Card titles */
text-2xl: 1.5rem    /* Component headers */
text-xl: 1.25rem    /* Large body text */

/* Body Text */
text-lg: 1.125rem   /* Emphasized body */
text-base: 1rem     /* Default body */
text-sm: 0.875rem   /* Secondary text */
text-xs: 0.75rem    /* Captions */
```

### Font Weights
```css
font-light: 300
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

### Text Styling Examples
```jsx
/* Hero Title */
<h1 className="text-6xl md:text-7xl font-fredoka font-bold text-vibrant-orange">
  Welcome to Pawsome!
</h1>

/* Section Title */
<h2 className="text-4xl font-fredoka font-semibold text-charcoal">
  Featured Products
</h2>

/* Body Text */
<p className="text-base font-fredoka text-medium-gray leading-relaxed">
  Discover the best products for your pets
</p>

/* Button Text */
<button className="font-fredoka font-semibold text-lg">
  Shop Now
</button>
```

---

## Spacing System

### Base Unit: 4px (0.25rem)

```css
/* Spacing Scale */
space-1: 0.25rem   /* 4px */
space-2: 0.5rem    /* 8px */
space-3: 0.75rem   /* 12px */
space-4: 1rem      /* 16px */
space-6: 1.5rem    /* 24px */
space-8: 2rem      /* 32px */
space-10: 2.5rem   /* 40px */
space-12: 3rem     /* 48px */
space-16: 4rem     /* 64px */
space-20: 5rem     /* 80px */
space-24: 6rem     /* 96px */
```

### Component Spacing
```css
/* Padding */
p-2: 0.5rem        /* Small components */
p-4: 1rem          /* Default padding */
p-6: 1.5rem        /* Cards */
p-8: 2rem          /* Sections */

/* Margins */
mb-4: 1rem         /* Between elements */
mb-8: 2rem         /* Between sections */
gap-4: 1rem        /* Grid/flex gaps */
```

---

## Component Styling

### Buttons

#### Primary Button
```jsx
<button className="
  bg-vibrant-orange 
  hover:bg-sunny-yellow 
  text-white 
  font-fredoka 
  font-semibold 
  px-6 py-3 
  rounded-full 
  shadow-lg 
  hover:shadow-xl 
  transform 
  hover:scale-105 
  transition-all 
  duration-300
">
  Shop Now
</button>
```

#### Secondary Button
```jsx
<button className="
  bg-white 
  border-2 
  border-primary-blue 
  text-primary-blue 
  hover:bg-primary-blue 
  hover:text-white 
  font-fredoka 
  font-medium 
  px-6 py-3 
  rounded-full 
  transition-all 
  duration-300
">
  Learn More
</button>
```

### Cards

#### Product Card
```jsx
<div className="
  bg-white 
  rounded-3xl 
  shadow-lg 
  hover:shadow-2xl 
  p-6 
  transition-all 
  duration-300 
  transform 
  hover:-translate-y-2
">
  {/* Card content */}
</div>
```

#### Feature Card
```jsx
<div className="
  bg-gradient-to-br 
  from-primary-blue 
  to-vibrant-orange 
  rounded-3xl 
  p-8 
  text-white 
  shadow-xl 
  relative 
  overflow-hidden
">
  {/* Feature content */}
</div>
```

### Forms

#### Input Field
```jsx
<input
  type="text"
  className="
    w-full 
    px-4 py-3 
    rounded-full 
    bg-soft-gray 
    border-2 
    border-transparent 
    focus:border-primary-blue 
    focus:bg-white 
    transition-all 
    duration-300 
    font-fredoka 
    outline-none
  "
  placeholder="Search for products..."
/>
```

#### Select Dropdown
```jsx
<select className="
  w-full 
  px-4 py-3 
  rounded-lg 
  bg-white 
  border-2 
  border-light-gray 
  focus:border-primary-blue 
  font-fredoka 
  outline-none 
  cursor-pointer
">
  <option>Select Category</option>
</select>
```

---

## Animations & Transitions

### Standard Durations
```css
duration-150: 150ms  /* Micro interactions */
duration-300: 300ms  /* Default transitions */
duration-500: 500ms  /* Complex animations */
duration-700: 700ms  /* Page transitions */
```

### Easing Functions
```css
ease-linear
ease-in
ease-out
ease-in-out      /* Default */
```

### Common Animations

#### Hover Effects
```css
/* Scale */
transform hover:scale-105

/* Lift */
transform hover:-translate-y-2

/* Glow */
hover:shadow-2xl

/* Color Transition */
transition-colors duration-300
```

#### Framer Motion Patterns
```jsx
/* Fade In */
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}

/* Scale In */
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.5, ease: "easeOut" }}

/* Slide In */
initial={{ x: -50, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
transition={{ duration: 0.6 }}
```

### Pet-Themed Animations
```css
/* Paw Print Bounce */
@keyframes paw-bounce {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-10px) rotate(10deg); }
}

/* Tail Wag */
@keyframes tail-wag {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

/* Pet Icons */
.pet-icon-bounce {
  animation: bounce 2s infinite;
}
```

---

## Responsive Design

### Breakpoints
```css
/* Tailwind Default Breakpoints */
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Mobile-First Approach
```jsx
/* Example: Responsive Text */
<h1 className="
  text-3xl      /* Mobile */
  sm:text-4xl   /* Small screens */
  md:text-5xl   /* Tablets */
  lg:text-6xl   /* Desktop */
  xl:text-7xl   /* Large screens */
">

/* Example: Responsive Grid */
<div className="
  grid 
  grid-cols-1      /* Mobile: 1 column */
  sm:grid-cols-2   /* Small: 2 columns */
  md:grid-cols-3   /* Medium: 3 columns */
  lg:grid-cols-4   /* Large: 4 columns */
  gap-4
">
```

### Container Widths
```css
container mx-auto px-4
max-w-7xl  /* Main container: 1280px */
max-w-6xl  /* Content container: 1152px */
max-w-4xl  /* Narrow container: 896px */
max-w-2xl  /* Text container: 672px */
```

---

## Accessibility

### Color Contrast
- **Text on Light**: Minimum 4.5:1 ratio
- **Text on Dark**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio

### Focus States
```css
/* Visible focus indicators */
focus:outline-none 
focus:ring-2 
focus:ring-primary-blue 
focus:ring-offset-2

/* Interactive elements */
focus:border-primary-blue
focus:bg-white
```

### ARIA Labels
```jsx
/* Buttons */
<button aria-label="Add to cart">
  <ShoppingCart className="h-6 w-6" />
</button>

/* Forms */
<label htmlFor="email" className="sr-only">
  Email Address
</label>
<input 
  id="email" 
  type="email" 
  aria-label="Email address"
/>
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use nav, main, section, article tags
- Use button for actions, a for navigation
- Include alt text for all images

---

## Code Style Conventions

### Component Structure
```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
}

// 3. Component Definition
const Component: React.FC<ComponentProps> = ({ title, variant = 'primary' }) => {
  // 4. State
  const [isActive, setIsActive] = useState(false);
  
  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    setIsActive(!isActive);
  };
  
  // 7. Render
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};

// 8. Export
export default Component;
```

### CSS Class Organization
```jsx
<div className="
  {/* Layout */}
  flex items-center justify-between
  
  {/* Spacing */}
  p-6 mb-4
  
  {/* Styling */}
  bg-white rounded-3xl shadow-lg
  
  {/* Typography */}
  font-fredoka text-charcoal
  
  {/* Interactions */}
  hover:shadow-2xl transition-all duration-300
  
  {/* Responsive */}
  sm:p-8 md:mb-6 lg:flex-row
">
```

### Naming Conventions
- **Components**: PascalCase (ProductCard, HeaderNav)
- **Functions**: camelCase (handleSubmit, calculateTotal)
- **Constants**: UPPER_SNAKE_CASE (MAX_ITEMS, API_URL)
- **CSS Classes**: kebab-case (pet-card, nav-menu)
- **Props**: camelCase (isActive, backgroundColor)

---

## Pet-Specific Elements

### Pet Emojis
```
Dogs: 🐕 🐕‍🦺 🦮 🐩 🐶
Cats: 🐱 🐈 🐈‍⬛ 😺 😻
Birds: 🦜 🦅 🦆 🐦 🦉
Small Pets: 🐹 🐰 🐭 🦦 🦔
Fish: 🐠 🐟 🦈 🐡 🦑
```

### Pet Colors Association
- **Dogs**: Vibrant Orange (#FF6B35)
- **Cats**: Primary Blue (#2196F3)
- **Birds**: Sunny Yellow (#FFD93D)
- **Small Pets**: Lavender (#B19CD9)
- **Fish**: Mint Green (#1AB4A5)

### Pet-Themed Decorations
```css
/* Paw prints background */
background-image: url("data:image/svg+xml,%3Csvg...");
background-size: 30px 30px;
background-repeat: repeat;
opacity: 0.05;

/* Bone shape buttons */
border-radius: 100px;
position: relative;
&::before, &::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  /* Create bone shape */
}
```

---

*Style Guide Version: 1.0*  
*Last Updated: January 7, 2025*  
*Maintained by: Pawsome Design Team*