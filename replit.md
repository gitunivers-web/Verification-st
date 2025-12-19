# Koupon Trust - Replit Configuration

## Overview

Koupon Trust is a futuristic fintech-style web application for verifying prepaid coupons and tickets. The platform allows users to submit coupon verification requests for services like Transcash, PCS, Neosurf, and Paysafecard. The application features a premium, modern UI inspired by 2025-2026 design trends with glassmorphism, neon gradients, and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Admin Credentials
- Email: admin@koupontrust.com
- Password: Configured via ADMIN_PASSWORD secret

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

### Multiple Coupon Codes Support (December 19, 2024)
- **Verification Form**: Now supports up to 3 coupon codes per submission
- Users can submit 1, 2, or 3 codes in one request
- Each code generates a separate verification request to the backend
- Show/Hide toggle applies to all code fields
- Improved toast notification shows how many codes were submitted
- Code fields have data-testid attributes for testing

### Footer Navigation (December 19, 2024)
- **Liens Rapides**: Navigation links corrected and properly linked:
  - "Vérifier un coupon" → Scrolls to top (verification form)
  - "Marques supportées" → Links to #emetteurs section
  - "Questions fréquentes" → Links to #faq section
- **Contact Email**: Mail icon now links to support@koupontrust.com
- All footer links have data-testid attributes for testing

### Post-Login Redirect
- After successful login, users are automatically redirected to `/dashboard`
- Admins are automatically redirected to `/admin`
- No intermediate steps required

### Nova AI Engine Component - Persistent State (December 19, 2024)
- New animated component at `client/src/components/nova-ai-engine.tsx`
- Features dynamic statistics: codes analyzed, frauds detected, neural network status
- Processing power bar with real-time updates
- Cryptographic validation stream animation
- SSL/TLS security indicator
- **NEW**: Persistent state using localStorage - counters survive page refreshes and deploys
- **NEW**: Custom hook `useNovaAIState` at `client/src/hooks/use-nova-ai-state.ts` manages state persistence
- **NEW**: Daily counter resets automatically at midnight
- Applied to all instances: home page, user dashboard, and admin dashboard

### Centralized Nova AI Engine Implementation (December 2024)
- **Server-Side Simulation**: NovaSimulationService at `server/nova-simulation.ts` manages shared state
- **Persisted State**: MemStorage stores `codesAnalyzed`, `fraudsDetected`, `todayIncrement`, `processingPower`, `lastResetDate`
- **REST Endpoint**: `/api/nova/stats` provides initial state for all clients
- **WebSocket Broadcast**: `nova_state` events push updates to all connected clients in real-time
- **Frontend Hook**: `useNovaLiveStats` at `client/src/hooks/use-nova-live-stats.ts` combines React Query + WebSocket
- **Fraud Ratio Logic**: 
  - Strictly enforces 1-3 frauds per 10-15 codes analyzed
  - First fraud emits immediately when threshold reached
  - Remaining frauds emit every 2+ ticks
  - Excess codes carry over to next batch
- **Synchronization**: All devices, pages, and users see identical statistics in real-time

### Real-Time WebSocket Updates (December 19, 2024)
- **Authenticated WebSocket**: Clients authenticate with token on connection (message type: "auth")
- **Targeted Broadcasting**: Events sent only to relevant users (admins receive all events, users receive their own)
- **Event Types**:
  - `new_verification`: Broadcast to all admins when a new verification is submitted
  - `verification_created`: Sent to the user who created the verification
  - `verification_updated`: Broadcast to all admins when status changes
  - `verification_status_changed`: Sent to the user when their verification status is updated
  - `online_count`: Broadcast to all clients showing connected user count
- **Frontend Integration**:
  - Dashboard and Admin Dashboard send auth token on WebSocket connection
  - QueryClient cache is automatically invalidated on relevant events
  - UI updates in real-time without page refresh
  - Recent activity log updated on every event

### Enhanced Dashboards
- Both user and admin dashboards include the Nova AI Engine visualization with persistent state
- Clear "Accueil" (Home) and "Deconnexion" (Logout) buttons in headers
- Improved statistics cards and layout
- Real-time WebSocket updates for verification status (no refresh needed)
- Bidirectional communication: user actions appear in admin dashboard instantly, admin actions appear in user dashboard instantly

### Security Hardening (December 19, 2024)
- **Strict CORS Policy**: Rejects requests without Origin header in production; uses exact origin matching (not prefix)
- **CSRF Protection**: Origin/Referer header validation for all mutative requests (POST/PUT/PATCH/DELETE)
- **Password Reset**: Complete forgot-password and reset-password flow with secure token generation (expires after 1 hour)
- **Stronger Password Policy**: Minimum 12 characters with uppercase, lowercase, and number requirements
- **Granular Rate Limiting**:
  - Login/Register: 5 attempts per 15 minutes
  - Password Reset: 3 requests per hour
  - Verification Submissions: 10 per hour
  - General API: 100 requests per 15 minutes
- **Email Notifications**: Password reset emails via Resend with secure token links
