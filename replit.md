# CouponChecker - Replit Configuration

## Overview

CouponChecker is a futuristic fintech-style web application for verifying prepaid coupons and tickets. The platform allows users to submit coupon verification requests for services like Transcash, PCS, Neosurf, and Paysafecard. The application features a premium, modern UI inspired by 2025-2026 design trends with glassmorphism, neon gradients, and smooth animations.

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (compiled with tsx for development, esbuild for production)
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Static Serving**: Express static middleware serves built frontend in production

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
├── client/src/          # React frontend application
│   ├── components/ui/   # shadcn/ui components
│   ├── pages/           # Route components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and configuration
├── server/              # Express backend
├── shared/              # Shared types and schemas
├── script/              # Build scripts
└── attached_assets/     # Design prompts and assets
```

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@assets` → `./attached_assets`

## External Dependencies

### Database
- **PostgreSQL**: Primary database (configured via `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL

### Email Service
- **Brevo (Sendinblue)**: Planned integration for email verification and admin notifications
- **Nodemailer**: Email sending capability

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