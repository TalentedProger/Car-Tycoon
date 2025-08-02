# Auto Arena - Telegram WebApp Car Tycoon Game

## Overview
Auto Arena is a Telegram WebApp car tycoon game built with a full-stack TypeScript architecture. The game allows users to earn coins through clicking mechanics, manage their car collection in a garage system, purchase detailing services, and track their progress through a profile system. The project's vision is to create an engaging mobile-first car tycoon experience within the Telegram ecosystem, leveraging its social features and reach.

## User Preferences
Preferred communication style: Simple, everyday language.

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