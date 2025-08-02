# Auto Arena - Telegram WebApp Car Tycoon Game

## Overview

Auto Arena is a Telegram WebApp car tycoon game built with a full-stack TypeScript architecture. The application features a React frontend with Shadcn/UI components, an Express.js backend, and PostgreSQL database with Drizzle ORM. The game allows users to earn coins through clicking mechanics, manage their car collection in a garage system, purchase detailing services, and track their progress through a profile system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with localStorage persistence for game state
- **HTTP Client**: TanStack Query for server state management
- **Mobile-First**: Designed for Telegram WebApp with mobile navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple
- **API Design**: RESTful API with /api prefix routing
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Build System
- **Development**: tsx for TypeScript execution, Vite dev server with HMR
- **Production**: esbuild for server bundling, Vite for client builds
- **Code Quality**: TypeScript strict mode, ESLint configuration

## Key Components

### Game Logic
- **Game State Management**: Custom useGameState hook managing coins, clicks, level progression, and intro status
- **Local Persistence**: localStorage for offline game state preservation
- **Telegram Integration**: useTelegram hook for WebApp API integration and user identification
- **Reward System**: 12-hour cooldown rewards worth 10x hourly income
- **Level Progression**: 1000 clicks for level 2, 3x multiplier for subsequent levels
- **Boost System**: 1.5x multiplier with daily usage limits

### UI Components
- **Navigation**: Bottom tab navigation with Home, Garage, Detailing, and Profile screens
- **Intro System**: Multi-screen onboarding with auto-advance and completion tracking
- **Interactive Elements**: Animated coin earning buttons with visual feedback and smooth animations
- **Responsive Design**: Mobile-optimized layouts with safe area handling
- **Garage System**: Car carousel with swipeable navigation and upgrade categories
- **Detailing Services**: Service cards with purchase functionality and cost deduction

### Telegram Bot Integration
- **Bot Commands**: /start, /help, /stats commands with inline WebApp buttons
- **WebApp Launch**: Direct game access through Telegram interface
- **Data Communication**: Two-way data exchange between game and bot
- **User Identification**: Automatic user recognition through Telegram API
- **Progress Sharing**: Send game achievements and stats to bot chat

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Game Profiles Table**: Per-user game state including coins, clicks, and intro status
- **Type Safety**: Drizzle-Zod integration for runtime validation
- **Database Integration**: PostgreSQL with Drizzle ORM, using DatabaseStorage for persistent data

## Data Flow

### Client-Side State
1. Game state initialized from localStorage on app load
2. User interactions (coin clicks) update local state immediately
3. State changes automatically persisted to localStorage
4. Telegram user ID retrieved from WebApp API for identification

### Server Integration
- Storage interface designed for CRUD operations on users and game profiles
- PostgreSQL database with DatabaseStorage implementation for production
- Database migrations managed through Drizzle Kit
- API routes ready for game state synchronization

### Session Management
- PostgreSQL-based session storage configured
- Cookie-based authentication ready for implementation
- User identification through Telegram WebApp integration

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive primitive components for accessibility
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

### Data and State
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema definition
- **Date-fns**: Date manipulation utilities

### Database and Backend
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web application framework
- **Connect-pg-simple**: PostgreSQL session store

### Telegram Integration
- **Node Telegram Bot API**: Full-featured Telegram Bot API client
- **Telegram WebApp SDK**: Frontend integration with Telegram Mini Apps
- **Environment Variables**: Secure bot token management

## Recent Changes

### February 2, 2025 - Complete Project Migration & Navigation Improvements
- **Successful Migration**: Completed migration from Replit Agent to standard Replit environment with all packages properly installed
- **Navigation Button Improvements**: Updated intro system navigation with consistent sizing:
  - Back and Next buttons now have equal width (120px) for consistent 1:1 sizing
  - Increased spacing between navigation buttons and pagination circles (mb-8)
  - Reduced pagination circle size from w-3 h-3 to w-2 h-2 for better visual balance
  - Applied consistent styling across all intro screens (welcome, mechanics, car selection, wheel spin, color selection, celebration)
- **Image Optimization**: Enhanced car intro image performance and visibility:
  - Increased image size from max-w-sm max-h-80 to max-w-lg max-h-96 for better visibility
  - Added preloading mechanism with opacity transition for smoother loading experience
  - Implemented loading="eager" attribute for immediate loading priority
  - Added imageLoaded state management for smooth fade-in effect
- **Technical Improvements**: Fixed tsx package installation, confirmed Telegram bot integration working
- **Project Structure**: Confirmed all dependencies properly installed and server running on port 5000

### January 29, 2025 - Complete Futuristic Intro System Redesign
- **Dark Futurism + Minimalism**: Completely new intro system with dark gradient backgrounds (indigo-purple-blue) and neon accents
- **Multi-Stage Flow**: Welcome → 5 Game Mechanics → Car Selection → Wheel Fortune → Color Selection → Celebration
- **Advanced Sound System**: Intro loop music, engine start, wheel tick sounds, and victory celebration audio
- **Probabilistic Wheel**: 5 Economy cars (19% each) + 1 Budget Honda Accord 7 (5% chance) with realistic spinning physics
- **Neon Animations**: Glow effects, pulse animations, floating mechanics icons, fireworks celebration
- **Color Customization**: Individual color palettes for each car model with visual preview
- **Professional Navigation**: Dot indicators, back/forward buttons, smooth state transitions
- **Asset Organization**: Created structured folders for sounds and car logos with comprehensive documentation
- **Responsive Design**: Mobile-optimized layouts with proper spacing and touch interactions
- **State Management**: Complete intro progress tracking with localStorage persistence for selected car

### January 2025 - Migration & Bug Fixes
- **Project Migration**: Successfully migrated from Replit Agent to standard Replit environment with clean deployment
- **Security Enhancement**: Fixed null pointer errors in image error handling for CarConfiguration and AutoSalon components
- **Code Quality**: Added proper null checks to prevent runtime crashes when parent elements are not available
- **UI Improvements**: Replaced wide blocked car buttons with small round red containers with shield icons for better layout
- **Currency Update**: Replaced all dollar symbols (💵) with ruble symbols (₽) across all components
- **Budget Display**: Updated AutoSalon budget container to show actual user balance instead of static value
- **Detailing Cards**: Reduced green shadow opacity from 15% to 5% for subtle visual enhancement
- **Type Safety**: Added proper TypeScript interfaces for AutoSalon component props

### January 2025 - Previous Updates
- **Replaced Factories with Garage**: Removed factory system and implemented car management interface
- **Car Carousel**: Added swipeable car navigation with dots indicator and smooth transitions
- **Upgrade Categories**: Created 8 upgrade categories (Engine, Transmission, Suspension, Brakes, Exhaust, Electronics, Body, Interior) with gradient backgrounds
- **Enhanced Animations**: Improved coin animations to be smoother without size changes
- **Visual Updates**: Changed coin icons to 💵, improved boost button layout to match energy container
- **Detailing Services**: Added comprehensive car detailing section with service cards and purchase functionality

## Deployment Strategy

### Development Environment
- Vite dev server with hot module replacement
- tsx for TypeScript execution without compilation
- Replit-specific plugins for development tooling
- File system restrictions for security

### Production Build
- Client bundle optimized with Vite and served from dist/public
- Server bundle created with esbuild for Node.js execution
- Static file serving integrated with Express
- Environment-based configuration for database connections

### Database Management
- Drizzle migrations stored in /migrations directory
- Schema definitions in shared directory for type consistency
- Environment variable configuration for database URL
- Push-based deployment strategy with drizzle-kit

### Hosting Considerations
- Designed for Replit deployment with banner integration
- Environment variable management for production secrets
- CORS and security headers configured for Telegram WebApp
- Mobile-optimized serving with proper viewport configuration