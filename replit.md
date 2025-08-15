# Auto Arena - Telegram WebApp Car Tycoon Game

## Overview
Auto Arena is a Telegram WebApp car tycoon game built with a full-stack TypeScript architecture. The game allows users to earn coins through clicking mechanics, manage their car collection in a garage system, purchase detailing services, and track their progress through a profile system. The project's vision is to create an engaging mobile-first car tycoon experience within the Telegram ecosystem, leveraging its social features and reach.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes
- **Date: August 15, 2025** - Successfully completed migration from Replit Agent to standard Replit environment and implemented upgrade cards system and Telegram avatar integration:
  - Fixed missing tsx dependency and reinstalled all packages
  - Created PostgreSQL database with proper schema setup
  - Updated button label from "Автосалон" to "Карточки" to match functionality
  - Redesigned UpgradeCards page with dark purple neon background (#310046)
  - Moved hourly income display to header alongside balance in single line
  - Implemented complete upgrade cards system with 15 cards across 5 rarity levels:
    - Обычная (3 cards): +1-3 income boost, prices 1,322-5,222 ₽
    - Необычная (3 cards): +4-6 income boost, prices 7,481-12,419 ₽  
    - Редкая (3 cards): +7-10 income boost, prices 15,058-23,518 ₽
    - Эпическая (3 cards): +11-15 income boost, prices 26,493-39,040 ₽
    - Легендарная (3 cards): +16-20 income boost, prices 42,320-55,935 ₽
  - Cards feature dynamic pricing logic with rarity-based cost multipliers
  - Added proper rarity-based visual styling with neon glow effects
  - Integrated Telegram WebApp API for user profile photo display in Profile section
  - Created fallback system for avatar loading with API endpoint for photo retrieval
  - Redesigned achievement category buttons layout to 2 columns × 3 rows format
  - Removed green background from achievement progress indicators ("0/x") for cleaner UI
  - All buttons now occupy 50% width with proper spacing and consistent sizing
- **Date: August 9, 2025** - Previous migration work completed
- Fixed missing tsx dependency causing startup failures
- Created PostgreSQL database with proper schema setup and migrations
- Completely reworked hourly income system based on 0.025% of car price including configuration:
  - Updated frontend calculation logic in AutoSalon and Home pages
  - Implemented backend API endpoint for hourly income updates
  - Examples: Audi 100 at 140,000 (Base) = 350 ₽/hour, Sport configuration at 350,000 = 875 ₽/hour
  - Dynamic calculation based on selected car and trim configuration
- Implemented comprehensive image preloading system:
  - Added ImagePreloader singleton class for efficient image caching
  - Created preloading screen with progress bar and loading animation
  - Preloads all hero images before app starts to prevent loading delays
  - Optimized image loading with eager loading and sync decoding
  - Ensures smooth transitions between intro states with instant image display
- Removed neon glow effects from intro screen texts:
  - Welcome screen main text: removed neon glow, preserved golden color
  - Car intro screen title: removed pink neon glow, changed to clean white
- Improved UI consistency in color selection screen:
  - Standardized 5-color palette (White, Black, Blue, Red, Gray) for all cars
  - Fixed color selection behavior to work as radio buttons (selection only highlights, confirm button proceeds)
  - Made car characteristic containers uniform with consistent sizing and spacing
  - Updated headers for better mobile responsiveness
  - Removed unwanted blue border from card container
- Enhanced button responsiveness for mobile devices with adaptive sizing and text truncation

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn/UI (on Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React hooks with localStorage persistence
- **HTTP Client**: TanStack Query
- **Design Principle**: Mobile-first, optimized for Telegram WebApp
- **UI/UX Decisions**: Bottom tab navigation, multi-screen onboarding, animated interactive elements, car carousel with swipe, service cards. Emphasis on dark futurism, minimalism, neon accents, and professional design elements like 3D metallic effects, glowing elements, and dynamic gradient backgrounds.

### Backend
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Session Storage**: PostgreSQL-based sessions (connect-pg-simple)
- **API Design**: RESTful API
- **Error Handling**: Centralized error middleware

### Game Logic & Core Features
- **Game State**: Manages coins, clicks, level progression, and intro status, persisted locally.
- **Telegram Integration**: WebApp API for user identification and seamless game launch.
- **Reward System**: 12-hour cooldown rewards.
- **Level Progression**: Click-based progression with multipliers.
- **Boost System**: Daily usage limits for multipliers.
- **Intro System**: Multi-stage flow (Welcome, Game Mechanics, Car Selection, Wheel Fortune, Color Selection, Celebration) with advanced sound system, probabilistic wheel, and neon animations.
- **Garage System**: Car management with upgrade categories.
- **Detailing Services**: Purchase functionality for car services.

### Build & Deployment
- **Development**: tsx for TypeScript, Vite dev server.
- **Production**: esbuild for server, Vite for client.
- **Code Quality**: TypeScript strict mode, ESLint.
- **Database Management**: Drizzle migrations.
- **Hosting**: Designed for Replit deployment, with environment variable management and CORS/security headers for Telegram WebApp.

## External Dependencies

### UI and Styling
- **Radix UI**: Primitive components for accessibility.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Class Variance Authority**: Type-safe component variants.

### Data and State
- **TanStack Query**: Server state management and caching.
- **React Hook Form**: Form handling with validation.
- **Zod**: Runtime type validation and schema definition.
- **Date-fns**: Date manipulation utilities.

### Database and Backend
- **Neon Database**: Serverless PostgreSQL provider.
- **Drizzle ORM**: Type-safe database operations.
- **Express.js**: Web application framework.
- **Connect-pg-simple**: PostgreSQL session store.

### Telegram Integration
- **Node Telegram Bot API**: Telegram Bot API client.
- **Telegram WebApp SDK**: Frontend integration with Telegram Mini Apps.