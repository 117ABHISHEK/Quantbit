# Smart Factory Maintenance Tracker

## Overview

The Smart Factory Maintenance Tracker is a web application designed to help factories track machine maintenance logs and schedules to prevent equipment breakdowns. The application provides automated status monitoring, maintenance logging capabilities, and PDF report generation for factory floor personnel.

**Core Functionality:**
- Machine management (CRUD operations for factory equipment)
- Maintenance log tracking with automatic status updates
- Dashboard with real-time metrics (healthy machines, due soon, overdue)
- Automated maintenance scheduling based on configurable intervals
- PDF report generation for maintenance schedules

**Tech Stack:**
- Frontend: React with TypeScript, Vite build system
- UI Framework: shadcn/ui components (Radix UI primitives) with Tailwind CSS
- Backend: Node.js with Express
- Database: PostgreSQL with Drizzle ORM
- State Management: TanStack Query (React Query)
- Form Handling: React Hook Form with Zod validation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure:**
- Pages are organized by feature (`Dashboard`, `Machines`, `NotFound`)
- Shared UI components use shadcn/ui library built on Radix UI primitives
- Custom business components (`MachineTable`, `StatusBadge`, `MetricCard`, `AddMaintenanceModal`)
- Client-side routing implemented with Wouter (lightweight React router)

**State Management Pattern:**
- TanStack Query handles server state with query key constants (`QUERY_KEYS`)
- React Hook Form manages form state with Zod schema validation
- Toast notifications for user feedback via custom toast hook

**Design System:**
- Tailwind CSS with custom configuration for spacing, colors, and theming
- Support for light/dark mode via CSS custom properties
- Industrial dashboard aesthetic with Bootstrap-inspired patterns
- Responsive design with mobile breakpoints

**Form Validation:**
- Zod schemas derived from Drizzle database schemas using `drizzle-zod`
- Client-side validation synchronized with backend validation
- Type-safe form inputs with TypeScript inference

### Backend Architecture

**API Structure:**
- RESTful endpoints under `/api` namespace
- Express.js middleware for JSON parsing and request logging
- Route handlers in `server/routes.ts` with explicit error handling

**Data Storage Strategy:**
- In-memory storage implementation (`MemStorage` class) for development
- Interface-based storage abstraction (`IStorage`) allows easy database migration
- Seeded sample data for development and testing

**Business Logic:**
- Status calculation logic in `client/src/services/status.ts`
- Automatic maintenance scheduling: `nextMaintenance = lastMaintenance + intervalDays`
- Status determination: Overdue (past due), Due Soon (≤3 days), OK (>3 days)
- PDF generation using PDFKit library for maintenance reports

### Data Model

**Machine Schema:**
- Fields: id, name, type, lastMaintenance, nextMaintenance, status, maintenanceIntervalDays
- Status is calculated field (not user-editable)
- Dates stored as ISO-8601 strings for storage compatibility
- Default maintenance interval: 30 days

**Maintenance Log Schema:**
- Fields: id, machineId, performedBy, date, notes
- Foreign key relationship to machines
- Automatically updates machine's lastMaintenance and nextMaintenance on creation

**Type Safety:**
- Shared schema definitions in `shared/schema.ts`
- Zod validation schemas for insert/update operations
- TypeScript types inferred from Drizzle schemas

### External Dependencies

**Database (Prepared for PostgreSQL):**
- Drizzle ORM configured for PostgreSQL dialect
- Connection via `@neondatabase/serverless` driver
- Currently using in-memory storage; database URL expected in `DATABASE_URL` environment variable
- Migration files output to `./migrations` directory

**UI Component Libraries:**
- Radix UI primitives for accessible headless components
- shadcn/ui configuration with "new-york" style variant
- Lucide React for icons throughout the application

**Build & Development:**
- Vite for frontend bundling and HMR
- esbuild for backend bundling in production
- tsx for TypeScript execution in development
- Replit-specific plugins for development environment integration

**Form & Validation:**
- React Hook Form for form state management
- Zod for runtime schema validation
- @hookform/resolvers for integration between the two

**Date Handling:**
- date-fns library for date parsing, formatting, and calculations
- ISO-8601 date strings as storage format
- Timezone-agnostic date comparisons for status calculation

**PDF Generation:**
- PDFKit library for generating maintenance schedule reports
- Endpoint: `/api/reports/pdf` (returns PDF document)

**Session Management:**
- connect-pg-simple for PostgreSQL-backed sessions (when database is connected)
- Express session middleware ready for authentication features