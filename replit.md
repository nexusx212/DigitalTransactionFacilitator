# DTFS - Digital Trade Finance System

## Overview

DTFS (Digital Trade Finance System) is a comprehensive full-stack web application designed to facilitate digital trade and finance across African markets. The platform serves as a marketplace connecting exporters, buyers, logistics providers, and financiers while providing integrated AI assistance, real-time communication, and blockchain-based smart contracts for secure transactions.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React Context for global state
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Passport.js with local strategy and session management
- **Session Store**: In-memory store for development (should be replaced with Redis in production)

### Development Environment
- **Platform**: Replit with Node.js 20
- **Hot Reload**: Vite dev server with HMR
- **Error Handling**: Runtime error overlay for development
- **Code Quality**: TypeScript strict mode with comprehensive type checking

## Key Components

### 1. User Management & Authentication
- Multi-role system supporting exporters, buyers, logistics providers, financiers, and agents
- KYC/KYB verification system with document upload and review workflow
- Two-factor authentication support
- Session-based authentication with secure cookie handling

### 2. Trade Finance Module
- Invoice factoring and trade finance request management
- Smart contract integration for automated trade finance operations
- Multiple finance types: factoring, export finance, supply chain finance
- Ethereum blockchain integration using ethers.js

### 3. Marketplace
- Product listing and management system
- Category-based product organization
- Advanced search and filtering capabilities
- Seller verification and badge system

### 4. Communication System
- Real-time chat with multi-language support
- AI-powered voice assistant for trade guidance
- Translation services for cross-language communication
- File sharing and multimedia messaging

### 5. Training & Education
- Course management system with progress tracking
- Certification and badge issuance
- Interactive learning materials

### 6. Digital Wallet
- Multi-currency support including PADC (Pan-African Digital Currency)
- Transaction history and analytics
- Integration with payment providers

## Data Flow

### Authentication Flow
1. User registration with role selection and document verification
2. Session creation with secure cookie storage
3. Route protection based on authentication status and user roles
4. Automatic session refresh and logout handling

### Trade Finance Flow
1. Finance request creation with document upload
2. Smart contract deployment for automated processing
3. Multi-party approval workflow
4. Blockchain-based payment and settlement

### Marketplace Flow
1. Product listing with category assignment and verification
2. Search and discovery with AI-enhanced recommendations
3. Inquiry management and seller communication
4. Order processing and fulfillment tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **ethers**: Ethereum blockchain interaction library
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **lucide-react**: Icon library

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundler for production builds
- **vite**: Development server and build tool

## Deployment Strategy

### Production Build
- Frontend: Vite build with static asset optimization
- Backend: esbuild bundle with external package handling
- Assets: Public directory serving with Express static middleware

### Environment Configuration
- Development: Local development with Vite dev server
- Production: Node.js server with built assets
- Database: Environment-based connection string configuration

### Hosting
- **Platform**: Replit with autoscale deployment target
- **Port Configuration**: Internal port 5000, external port 80
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Changelog

```
Changelog:
- June 15, 2025. Initial setup
- June 15, 2025. Added PostgreSQL database with Drizzle ORM
- June 15, 2025. Implemented Firebase authentication with Google OAuth
- June 15, 2025. Created role-based dashboards for all user types
- June 15, 2025. Added OTP verification support for registration
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```