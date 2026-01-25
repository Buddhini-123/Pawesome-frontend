# Changelog

All notable changes to the Pawsome frontend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.2] - 2026-01-23

### Fixed
- **React Object Rendering Error**: Fixed "Objects are not valid as a React child" error in Subscriptions page
  - Fixed ProductCard component rendering brand object instead of brand name
  - Added type checking: `typeof product.brand === 'string' ? product.brand : product.brand?.name`
  - Handles both string and object brand types from backend
  - Replaced product.currency (undefined) with 'LKR' in ProductCard and modal

## [0.5.1] - 2026-01-23

### Fixed
- **TypeScript Compilation Errors**: Resolved 25 TypeScript errors blocking app compilation
  - Fixed Product interface field name mismatches (category_id → category, brand_id → brand, rating_avg → rating)
  - Fixed type errors with price field (removed unnecessary parseFloat on number type)
  - Fixed Deal interface property access errors (discount_type → discountType, buy_qty/get_qty)
  - Fixed Checkout type mismatches (productId, addressType, currency field)
  - Fixed Subscriptions component type errors (brand.name, category.name object access)
  - Fixed DealForm and dealHelpers missing Deal properties

### Technical
- Improved type safety across Product and Deal interfaces
- Consistent field naming between backend responses and frontend types
- Enhanced Deal interface with all required backend fields
- Product interface now correctly reflects backend data structure

## [0.5.0] - 2026-01-23

### Added
- **Backend Search API Integration**: Complete integration with backend search endpoint
  - Connected searchbar to `/api/search/products` backend endpoint
  - SearchResults page component with grid layout
  - URL-based search with shareable search query links
  - Real-time search functionality from header searchbar
  - Loading states with skeleton grid for better UX
  - Error handling with retry functionality
  - Empty state with category suggestions for no results
  - Search result count display
  - Responsive design for mobile and desktop

### Enhanced
- **Header Search Functionality**: Searchbar now navigates to search results page
  - Desktop and mobile search bars navigate to `/search?q={query}`
  - URL encoding for search queries
  - Mobile search overlay closes after search submission

- **Products Service**: Backend API integration for search
  - Replaced mock search filtering with backend API call
  - Proper error handling with fallback to empty array
  - TypeScript type safety for API responses

### Technical Improvements
- **Route Addition**: New `/search` route added to App.tsx router
- **Component Reusability**: SearchResults page reuses existing ProductCard component
- **Type Safety**: Full TypeScript support for search functionality
- **Performance**: Backend search for accurate and fast product discovery
- **URL Parameters**: Query parameter handling with `useSearchParams` hook

### Fixed
- Header search functionality now fully operational with backend integration
- Mobile search overlay closes properly after search submission

## [0.4.0] - 2026-01-22

### Added
- **Admin Customer Loyalty Integration**: Complete integration with backend API for customer loyalty data
  - New `AdminCustomer` TypeScript interface with embedded loyalty balance information
  - Single optimized API call to `/api/admin/customers?include=loyalty`
  - Loyalty Card column displaying card numbers or "No Card" status
  - Points column with thousand separator formatting and sortable functionality
  - Tier column with color-coded badges (BRONZE, SILVER, GOLD, PLATINUM)
  - Click-to-sort functionality for loyalty points (ascending/descending)
  - Award icon for tier badges with appropriate color coding
- Backend API integration for loyalty balance (GET /api/loyalty/balance)
- Dynamic points expiry date display from backend
- Expiring soon warning when points are about to expire
- `LoyaltyBalance` TypeScript interface for API response
- Loading and error states for balance API calls

### Enhanced
- **User Management Table**: Comprehensive loyalty data display
  - Points displayed with green highlighting for better visibility
  - Responsive error handling with retry functionality
  - Loading states with informative messages
  - Error display banner for failed API requests
- Loyalty Dashboard now fetches expiry date from backend API (was hardcoded)
- Expiry notice displays dynamic date from server
- Enhanced user experience with loading skeleton and error retry functionality

### Technical Improvements
- **Type Safety**: Full TypeScript support for admin customer data structures
- **API Integration**: Direct axios integration with backend loyalty endpoints
- **State Management**: Enhanced React state for sorting and error handling
- **Data Transformation**: Proper conversion between AdminCustomer and User types for modal compatibility
- Added JSDoc comments to `LoyaltyBalance` interface and `getLoyaltyBalance()` method
- Implemented authenticated API call with bearer token for balance retrieval
- User-friendly date formatting (e.g., "Dec 31, 2027, 11:59 PM")
- Conditional styling for expiry warnings based on `expiring_soon` count

### Fixed
- Backend API integration replacing mock user service for admin customer list
- Type compatibility between AdminCustomer and User interfaces
- Column header alignment for sortable points column

## [0.3.0] - 2026-01-22

### Added
- **Backend Pricing Calculation API Integration**: Integrated POST /api/pricing/calculate for server-side pricing logic
  - Automatic birthday discount detection via backend (10% on user's birthday)
  - Loyalty points preview from backend calculation (100 LKR = 1 point)
  - Birthday celebration message when discount applies
  - `PricingCalculation` TypeScript interface for API response structure
  - Loading and error states for pricing API calls with retry functionality

### Changed
- **Checkout Pricing Logic**: Moved from frontend to backend calculation
  - Birthday discount now detected server-side using authenticated user's JWT token (more secure)
  - Points calculation handled by backend for accuracy and consistency
  - Pricing updates reactively when cart contents change
  - Debounced API calls to avoid excessive requests (500ms delay)

### Technical Improvements
- Added comprehensive JSDoc documentation to PricingCalculation interface
- Implemented debounced API calls for performance optimization
- Enhanced error handling with user-friendly retry mechanism
- Birthday celebration UI with gradient background and celebration emoji
- Points preview showing current balance, points to earn, and new balance

## [0.1.2] - 2026-01-21

### Changed
- Reordered top navigation: Daily Deals, Gift Boxes, Rewards, Subscriptions
- Updated navigation labels: 'Subscription' → 'Subscriptions', 'Gift Box' → 'Gift Boxes', 'Paw Rewards' → 'Rewards'

## [0.1.1] - 2026-01-21

### Changed
- Renamed 'Pet Subscriptions' to 'Subscriptions' across UI components and data files
- Updated navigation links, homepage feature titles, and code comments

### Added
- **Comprehensive Pet Management System**: Complete CRUD operations for pet management in user accounts
  - Add new pets with detailed information (name, type, breed, age, weight, gender, color, etc.)
  - Edit existing pet information
  - Delete pets from account
  - View pet profiles with comprehensive timeline tracking

- **Advanced Pet Timeline System**: Timeline-based tracking system for pet health and activities
  - Support for 15+ timeline entry types:
    - `vet_visit` - Veterinary appointments with diagnosis and treatment details
    - `vaccination` - Vaccination records with next due dates
    - `medication` - Medication tracking with dosage and frequency
    - `weight_check` - Weight monitoring with body condition assessment
    - `grooming` - Grooming appointments and services
    - `training` - Training sessions with progress tracking
    - `behavior` - Behavior observations and interventions
    - `nutrition` - Diet and nutrition changes
    - `milestone` - Important pet milestones
    - `emergency` - Emergency situations
    - `surgery` - Surgical procedures
    - `dental` - Dental care
    - `boarding` - Boarding and travel records
    - `general` - General notes and observations

- **Timeline Entry Form Modal**: Comprehensive form for adding new timeline entries
  - Dynamic form fields based on entry type
  - Type-specific validation and data collection
  - Responsive design with proper scrolling
  - Fixed header and footer for better UX

- **Enhanced Pet Data Structure**: Advanced TypeScript interfaces for comprehensive pet tracking
  - `Pet` interface with timeline support
  - `PetTimelineEntry` interface with conditional type-specific details
  - Supporting interfaces: `VetVisitDetails`, `MedicationDetails`, `WeightEntry`, `VaccinationDetails`, `TrainingDetails`, `BehaviorEntry`, `GroomingDetails`, `NutritionEntry`
  - Vet information and emergency contact support

- **Sample Pet Data**: Realistic demo data for testing
  - Two sample pets (Buddy the Golden Retriever, Whiskers the Persian cat)
  - Sample timeline entries demonstrating different entry types
  - Comprehensive pet profiles with health indicators

### Enhanced
- **Account Page UI**: Improved pet management section
  - New "My Pets" tab with sunny yellow paw print icon
  - Responsive pet cards with health indicators
  - Quick stats display (timeline entries, weight, vet visits, vaccinations)
  - "View Timeline" buttons for easy access to pet profiles

- **Pet Profile Modal**: Feature-rich pet profile display
  - Pet header with emoji avatar and basic info
  - Quick statistics dashboard
  - Timeline filtering by category (health, medical, wellness, behavior, training, grooming, nutrition)
  - Chronological timeline display with entry details
  - Importance-based color coding (low, medium, high, critical)
  - Type-specific detail cards for each timeline entry

- **Modal Responsiveness**: Comprehensive mobile optimization
  - Responsive layouts for all screen sizes
  - Adaptive padding and spacing (`p-4 sm:p-6 lg:p-8`)
  - Flexible grid systems (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
  - Scalable typography (`text-xs sm:text-sm`, `text-lg sm:text-2xl`)
  - Touch-friendly button and interaction sizes
  - Proper text truncation and overflow handling

- **Mock Database**: Updated sample data structure
  - Enhanced demo user with comprehensive pet profiles
  - Timeline-enabled pet data
  - Realistic veterinary and health information

### Changed
- **Modal Design System**: Removed gradient backgrounds for solid colors
  - Pet Profile Modal: Changed from gradient to solid `bg-sunny-yellow`
  - Timeline Entry Form Modal: Changed from gradient to solid `bg-primary-blue`
  - Updated text colors for better contrast with solid backgrounds
  - Improved hover states and button interactions

- **Timeline Entry Form Layout**: Fixed modal structure for better UX
  - Changed to flex column layout (`flex flex-col`)
  - Fixed header with `flex-shrink-0`
  - Scrollable content area with `flex-1 overflow-y-auto`
  - Fixed footer with always-visible action buttons
  - Resolved button visibility issues on mobile devices

- **Timeline Display**: Improved responsive design
  - Better mobile layout for timeline entries
  - Responsive detail cards with adaptive grid systems
  - Improved spacing and typography for small screens
  - Enhanced filter button design for mobile

### Technical Improvements
- **TypeScript Interfaces**: Comprehensive type safety
  - Full type definitions for all pet-related data structures
  - Conditional types for timeline entry details
  - Form validation types and interfaces

- **State Management**: Enhanced React state handling
  - Pet CRUD operations with proper state updates
  - Timeline entry management with real-time updates
  - Form state management with validation

- **Component Architecture**: Scalable component structure
  - Modular pet management components
  - Reusable timeline entry display logic
  - Conditional rendering for different entry types

- **Responsive Design Patterns**: Mobile-first approach
  - Breakpoint-based responsive classes
  - Flexible layouts that adapt to screen size
  - Optimized touch interactions for mobile devices

### Fixed
- **Timeline Entry Form Buttons**: Resolved visibility issues
  - Fixed modal layout structure to ensure buttons are always visible
  - Improved scrolling behavior within form content
  - Better mobile experience with fixed footer

- **Mobile Responsiveness**: Comprehensive mobile optimization
  - Fixed timeline section responsiveness issues
  - Improved modal sizing on small screens
  - Better text and button sizing for mobile devices
  - Enhanced touch target sizes for better usability

### Developer Experience
- **Code Organization**: Well-structured component hierarchy
- **Type Safety**: Comprehensive TypeScript coverage
- **Reusable Components**: Modular and maintainable code structure
- **Consistent Styling**: Unified design system with Tailwind CSS

---

## Previous Changes
(This changelog was created to document recent comprehensive pet management system implementation)