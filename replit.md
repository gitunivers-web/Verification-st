# Koupon Trust - Replit Configuration

## Overview

Koupon Trust is a futuristic fintech-style web application for verifying prepaid coupons and tickets. The platform allows users to submit coupon verification requests for services like Transcash, PCS, Neosurf, and Paysafecard. The application features a premium, modern UI inspired by 2025-2026 design trends with glassmorphism, neon gradients, and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Admin Credentials
- Email: admin@koupontrust.com
- Password: admin123

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with custom theme variables
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for fluid transitions
- **Carousel**: Embla Carousel with autoplay plugin
- **Internationalization**: Custom i18n context with FR, NL, DE, IT, EN support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Static Serving**: Express static middleware serves built frontend in production
- **WebSocket**: Real-time updates for verification status and online user tracking

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Migrations**: Drizzle Kit for database migrations (`./migrations` directory)
- **Development Storage**: In-memory storage class for rapid prototyping

### Build System
- **Frontend Build**: Vite with React plugin
- **Backend Build**: esbuild bundling to CommonJS
- **Development**: Concurrent client (Vite dev server) and server (tsx watch)
- **Production**: Single `dist/` output with `public/` for static assets

### Project Structure
```
client/src/
  components/ui/   # shadcn/ui components
  pages/           # Route components (home, admin, dashboard, terms, privacy, cookies)
  hooks/           # Custom React hooks
  lib/             # Utilities, config, auth, i18n
server/              # Express backend
shared/              # Shared types and schemas
attached_assets/     # Design assets and generated images
```

### Path Aliases
- `@/*` -> `./client/src/*`
- `@shared/*` -> `./shared/*`
- `@assets` -> `./attached_assets`

## Features

### Core Features
- Coupon verification form with multiple coupon types
- User registration and authentication
- Admin dashboard for managing verifications
- Real-time status updates via WebSocket
- Email notifications for verification results

### Legal Pages
- `/terms` - Conditions d'utilisation
- `/privacy` - Politique de confidentialite
- `/cookies` - Politique des cookies

### Multilingual Support
Languages supported: French (FR), Dutch (NL), German (DE), Italian (IT), English (EN)

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL

### Email Service
- **Resend**: Primary email service for transactional emails (configured via `RESEND_API_KEY` secret)
- Functions: sendVerificationEmail, sendAdminNotification, sendStatusUpdateEmail

### UI/Design Libraries
- **Radix UI**: Accessible component primitives (dialog, select, tabs, etc.)
- **Lucide React**: Icon library
- **Google Fonts**: Inter and Poppins typography

### Development Tools
- **Replit Plugins**: Cartographer, dev banner, runtime error overlay
- **Vite**: Development server with HMR

### Deployment
- **Vercel**: Configured via `vercel.json` for static frontend deployment
- **Replit**: Primary development and hosting platform with custom Vite plugins

## Recent Changes (December 2024)

### Post-Login Redirect
- After successful login, users are automatically redirected to `/dashboard`
- Admins are automatically redirected to `/admin`
- No intermediate steps required

### Nova AI Engine Component
- New animated component at `client/src/components/nova-ai-engine.tsx`
- Features dynamic statistics: codes analyzed, frauds detected, neural network status
- Processing power bar with real-time updates
- Cryptographic validation stream animation
- SSL/TLS security indicator

### Enhanced Dashboards
- Both user and admin dashboards include the Nova AI Engine visualization
- Clear "Accueil" (Home) and "Deconnexion" (Logout) buttons in headers
- Improved statistics cards and layout
- Real-time WebSocket updates for verification status
