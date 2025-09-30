# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Defensis Web Core is a cybersecurity platform frontend built with React, TypeScript, and Vite. It's a Lovable.dev project that provides AI-powered security scanning and vulnerability detection capabilities.

## Development Commands

### Core Development
```bash
# Start development server (runs on localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Installation
```bash
# Install frontend dependencies
npm i

# Install backend dependencies (in server directory)
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Start both frontend and backend
./start-dev.sh

# Or start individually:
# Backend: cd server && python app.py
# Frontend: npm run dev
```

## Full Stack Architecture

### Frontend (React + TypeScript)
- **Port**: 8080
- **Framework**: React 18 with TypeScript and Vite
- **API Integration**: Real-time communication with FastAPI backend

### Backend (FastAPI + Python)
- **Port**: 3001
- **Framework**: FastAPI with SQLite database
- **CLI Integration**: DefenSys security scanner from IasTam repository
- **Authentication**: JWT tokens with bcrypt password hashing
- **Real-time**: WebSocket support for live scan updates

### DefenSys CLI Integration
- **Location**: `../IasTam/src/defensys_cli_api_enhanced.py`
- **Features**: AI-powered security scanning, vulnerability detection
- **Fallback**: Mock data when CLI is unavailable

## Tech Stack & Architecture

### Core Technologies
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with Radix UI primitives
- **Routing**: React Router DOM
- **State Management**: React Context API + TanStack Query
- **Form Handling**: React Hook Form with Zod validation

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (accordion, button, etc.)
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Header.tsx      # Main navigation header
│   ├── Hero.tsx        # Landing page hero section
│   └── Dashboard*.tsx  # Dashboard-related components
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── hooks/             # Custom React hooks
├── lib/              # Utilities and configurations
│   └── utils.ts      # Common utility functions
├── pages/            # Main application pages
│   ├── Index.tsx     # Landing page
│   ├── Dashboard.tsx # User dashboard
│   ├── Pricing.tsx   # Pricing page
│   └── NotFound.tsx  # 404 page
├── App.tsx           # Main app component with routing
└── main.tsx          # Application entry point
```

### Key Architecture Patterns

**Component Architecture**:
- Landing page built with modular sections (Hero, Features, DashboardPreview)
- Dashboard uses tab-based navigation with Overview, Pre-Deploy, and Post-Deploy sections
- Extensive use of compound components and Radix UI patterns

**State Management**:
- Authentication handled via `AuthContext` with localStorage persistence
- Mock authentication system (no real backend integration)
- TanStack Query for server state management (ready for API integration)

**Styling System**:
- Tailwind CSS with custom theme configuration
- CSS variables for consistent theming
- Component variants using `class-variance-authority`
- Custom gradient backgrounds and animations

**Routing**:
- Client-side routing with React Router
- Protected routes via authentication context
- Catch-all route for 404 handling

### Configuration Files

- `vite.config.ts`: Vite configuration with path aliases (`@/` -> `./src/`)
- `tsconfig.json`: TypeScript configuration with relaxed settings (allows JS, no strict null checks)
- `tailwind.config.ts`: Custom Tailwind theme with design tokens
- `components.json`: shadcn/ui configuration

### Development Notes

**Path Aliases**: Use `@/` prefix for imports from `src/` directory

**Component Development**: 
- All UI components are based on shadcn/ui system
- Custom components follow the existing pattern structure
- Modals and overlays use Radix UI primitives

**Authentication Flow**:
- Mock authentication with localStorage persistence
- User object includes plan tiers (free, developer, team, enterprise, custom)
- Dashboard redirect handling after successful auth

**Lovable Integration**:
- Project is connected to Lovable.dev platform
- Changes via Lovable are auto-committed to repository
- `lovable-tagger` plugin for development mode component tagging

### API Endpoints

**Authentication**:
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

**Dashboard**:
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/alerts` - Security alerts
- `GET /api/dashboard/recent-scans` - Recent scan history

**Repository Management**:
- `GET /api/repositories/` - List user repositories
- `POST /api/repositories/` - Add repository
- `POST /api/repositories/github/connect` - Connect GitHub account

**Security Scanning**:
- `POST /api/scans/start` - Start new security scan
- `GET /api/scans/{scan_id}/status` - Get scan status
- `GET /api/scans/{scan_id}/results` - Get scan vulnerabilities

**WebSocket**:
- `WS /ws/{user_id}` - Real-time scan updates

### Database Schema

**SQLite Tables**:
- `users` - User accounts and authentication
- `repositories` - Connected repositories
- `scans` - Security scan records
- `vulnerabilities` - Detected security issues
- `security_alerts` - User notifications

### Development Workflow

**Adding New Features**:
1. **Backend**: Add API endpoints in `server/routes.py`
2. **Frontend**: Update API client in `src/lib/api.ts`
3. **Components**: Connect UI components to real data
4. **Testing**: Use `http://localhost:3001/api/docs` for API testing

**Security Scanning Process**:
1. User starts scan via frontend
2. Backend receives request and creates scan record
3. DefenSys CLI executes security analysis
4. Results parsed and saved to database
5. Real-time updates sent via WebSocket
6. Frontend displays live progress and results

### Security Context

This is a cybersecurity platform with features for:
- **Real-time Security Scanning**: AI-powered vulnerability detection
- **GitHub Integration**: Connect and scan repositories
- **Live Dashboard**: Real-time metrics and security scores
- **Alert System**: Immediate notifications for critical issues
- **Multi-tier Access**: Free, developer, team, and enterprise plans

### Troubleshooting

**Backend Issues**:
- Check if IasTam CLI is available at `../IasTam/src/`
- Verify Python dependencies are installed
- Database is automatically created on first run

**Frontend Issues**:
- Ensure backend is running on port 3001
- Check browser console for API errors
- Verify environment variables in `.env`
