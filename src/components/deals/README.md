# Deals Components Documentation

## Overview
This module provides a complete deals system for the Pawsome frontend application, matching the design specifications provided. The system is modular, type-safe, and easily extendable.

## Components

### 1. DealCard (`/components/deals/DealCard.tsx`)
Individual deal card component with:
- Orange-to-blue gradient background
- Dog image positioning
- Offer type badges
- Interactive hover effects
- Click navigation to deal details

### 2. DealSection (`/components/deals/DealSection.tsx`)
Section wrapper component featuring:
- Section titles and subtitles
- Responsive grid layout
- Animation delays for staggered appearance
- Mobile horizontal scroll fallback

### 3. DealDetail (`/components/deals/DealDetail.tsx`)
Detailed deal page with:
- Hero section with deal information
- Related products display
- Action buttons (Claim Deal, Learn More)
- Back navigation

### 4. Updated Deals Page (`/pages/Features/Deals.tsx`)
Main deals page that:
- Uses the new component system
- Implements the three-section layout from design
- Includes newsletter signup section
- Handles navigation to detail pages

## Data Structure

### Types (`/types/deals.ts`)
- `Deal`: Core deal interface with all necessary properties
- `DealSection`: Section grouping interface
- `DealsPageData`: Complete page data structure
- Component prop types for type safety

### Mock Data (`/data/mockDeals.ts`)
Three sections matching the design:
1. "Bark-Worthy Deals This Week Only!"
2. "Stock Up & Save on Pawsome Dog Food!"
3. "Loyal Pup? Earn Rewards Every Time You Buy!"

Each section contains 4 deals with different offer types.

## Routing
- `/deals` - Main deals page
- `/deals/:slug` - Individual deal detail page

## Features

### Responsive Design
- Desktop: 4 cards per row
- Tablet: 3 cards per row
- Mobile: 2 cards per row with horizontal scroll fallback

### Interactive Elements
- Hover effects on cards
- Smooth animations using Framer Motion
- Click navigation to detail pages
- Newsletter signup functionality

### Offer Types Supported
- `buy-get-free`: Buy X, Get Y Free offers
- `free-shipping`: Free shipping promotions
- `referral`: Referral discounts
- `upgrade`: Upgrade promotions
- `discount`: Percentage-based discounts
- `bundle`: Bundle deal offers

### Styling
- Uses existing Tailwind color scheme
- Consistent with app design patterns
- Proper gradient backgrounds matching design
- Responsive typography and spacing

## Usage

```tsx
import { Deal } from '../../types/deals';
import { mockDealsData } from '../../data/mockDeals';
import DealSection from '../deals/DealSection';

const handleDealClick = (deal: Deal) => {
  navigate(`/deals/${deal.slug}`);
};

<DealSection 
  section={mockDealsData.sections[0]} 
  onDealClick={handleDealClick}
/>
```

## Future Enhancements
- API integration (replace mockDealsData)
- Real product integration
- Shopping cart integration
- Deal favoriting
- Social sharing
- Deal expiration timers
- Filter and search functionality

## Notes
- All components are TypeScript-based
- Uses existing app patterns and styling
- Easily replaceable mock data for API integration
- Fully responsive and accessible
- Follows existing code organization patterns