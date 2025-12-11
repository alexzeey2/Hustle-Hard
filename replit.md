# Naija Wealth Sim - Financial Freedom Game

## Overview

Naija Wealth Sim is a gamified financial literacy simulation game that teaches players about building wealth through income streams, investments, and smart spending decisions. The game draws inspiration from platforms like Duolingo for gamification, financial apps like Mint/YNAB for data clarity, and idle simulation games like AdVenture Capitalist for engagement mechanics.

Players manage money, health, and various income sources (salary, skills, mini-businesses, investments) while navigating expenses and lifestyle purchases. The goal is to achieve financial freedom through strategic decision-making.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: React Query (@tanstack/react-query) for server state, React useState for local game state
- **Styling**: Tailwind CSS with custom design tokens defined in CSS variables
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Development**: Vite middleware for HMR during development
- **Production**: Static file serving from built assets

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Generated via `drizzle-kit push`
- **Current Storage**: In-memory storage implementation (`MemStorage` class) with interface for easy database swap

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Data access layer
│   └── static.ts     # Static file serving
├── shared/           # Shared code between client/server
│   └── schema.ts     # Database schema and types
└── migrations/       # Drizzle database migrations
```

### Design System
- Dark mode by default (class-based toggle)
- Custom CSS variables for theming (defined in `client/src/index.css`)
- Game-focused visual hierarchy: large currency displays, progress indicators, reward animations
- Mobile-responsive with breakpoint at 768px

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: Session storage for PostgreSQL

### UI Libraries
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component
- **Recharts**: Charting library for data visualization
- **class-variance-authority**: Variant-based component styling

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation (integrated via drizzle-zod)

### Development Tools
- **Vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Production bundling for server code