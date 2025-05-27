# Pawsome Color System Documentation

## Overview
The Pawsome brand color system provides a consistent and cohesive color palette across the entire application. Colors are organized into three main categories based on their intended usage.

## Color Categories

### Primary Colors (CTAs, Branding, Highlights)
- **Energetic Orange** (`#FF914D`) - Main brand color, primary CTAs
- **Natural Sage** (`#9DB47C`) - Secondary brand color, nature theme
- **Calm Blue** (`#6CA6CD`) - Trust and reliability, accent color
- **Warm Orange** (`#FFB657`) - Highlighting and warmth

### Secondary Colors (Cards, Backgrounds, Hover States)
- **Soft Yellow** (`#FFE066`) - Cheerful backgrounds, warnings
- **Periwinkle** (`#D6CDEA`) - Gentle hover states, soft accents
- **Warm Taupe** (`#A1866F`) - Elegant neutrals, hover states
- **Mint** (`#1AB487`) - Success states, positive actions
- **Crimson** (`#F64E4E`) - Error states, urgent actions

### Background Colors (Text, Borders)
- **Off White** (`#F9FAFB`) - Main background color
- **Light Gray** (`#E5E7EB`) - Borders, subtle backgrounds
- **Charcoal Gray** (`#3C3D3C`) - Text color, dark accents

## Usage Examples

### 1. Tailwind Classes
```jsx
// Primary CTA Button
<button className="btn-pawsome-primary">Shop Now</button>

// Secondary Button
<button className="btn-pawsome-secondary">Learn More</button>

// Product Card
<div className="card-pawsome">
  <h3 className="text-pawsome-primary">Product Name</h3>
  <p className="text-charcoal-gray">Description here</p>
</div>

// Background Colors
<div className="bg-energetic-orange text-white">
  Featured Content
</div>
```

### 2. JavaScript/React Usage
```jsx
import { pawsomeColors, getPawsomeColor, getPawsomeStyle } from './utils/colors';

// Direct color usage
const buttonStyle = {
  backgroundColor: pawsomeColors.primary.energeticOrange,
  color: 'white'
};

// Helper function usage
const textColor = getPawsomeColor('semantic', 'primary');
const styleObject = getPawsomeStyle('backgroundColor', 'primary', 'energeticOrange');
```

### 3. CSS Variables
```css
.custom-component {
  background-color: var(--pawsome-energetic-orange);
  border: 1px solid var(--pawsome-light-gray);
  color: var(--pawsome-charcoal-gray);
}
```

## Pre-built Utility Classes

### Buttons
- `.btn-pawsome-primary` - Energetic orange button with hover effects
- `.btn-pawsome-secondary` - Natural sage button with hover effects  
- `.btn-pawsome-accent` - Calm blue button with hover effects
- `.btn-pawsome-success` - Mint green button for positive actions
- `.btn-pawsome-warning` - Soft yellow button for warnings
- `.btn-pawsome-error` - Crimson button for errors/dangerous actions

### Cards
- `.card-pawsome` - Standard card with off-white background and subtle shadow
- `.card-pawsome-highlight` - Featured card with gradient background

### Text Colors
- `.text-pawsome-primary` - Energetic orange text
- `.text-pawsome-secondary` - Natural sage text
- `.text-pawsome-accent` - Calm blue text

### Background Gradients
- `.bg-pawsome-gradient` - Orange to warm orange gradient
- `.bg-pawsome-gradient-secondary` - Sage to blue gradient
- `.bg-pawsome-gradient-soft` - Soft multi-color gradient

## Design Guidelines

### When to Use Each Color

**Energetic Orange (#FF914D)**
- Primary call-to-action buttons
- Brand elements and logos
- Important highlights and notifications

**Natural Sage (#9DB47C)**
- Secondary buttons and actions
- Nature-related content
- Calming, trustworthy elements

**Calm Blue (#6CA6CD)**
- Links and interactive elements
- Information and help sections
- Professional, reliable content

**Warm Orange (#FFB657)**
- Highlighting special offers
- Warm, welcoming elements
- Secondary CTAs

**Soft Yellow (#FFE066)**
- Warning messages (non-critical)
- Highlighting new features
- Cheerful, optimistic content

**Mint (#1AB487)**
- Success messages
- Positive confirmations
- Environmental/healthy themes

**Crimson (#F64E4E)**
- Error messages
- Urgent actions
- Critical warnings

## Accessibility Notes
- All color combinations maintain WCAG AA contrast ratios
- Colors include semantic meaning beyond visual appearance
- Text alternatives provided for color-coded information
- Focus states use high contrast combinations

## Implementation Checklist
- [ ] Tailwind config updated with Pawsome colors
- [ ] CSS variables defined in index.css
- [ ] Utility classes created for common patterns
- [ ] JavaScript color utilities available
- [ ] Design system documented
- [ ] Components updated to use new color system
