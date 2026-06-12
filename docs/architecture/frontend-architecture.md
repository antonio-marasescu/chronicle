# Chronicle - Frontend Architecture

Campaign and world management tool for tabletop RPGs, featuring interactive map visualization, timeline tracking, and world-building capabilities.

## Tech Stack
- **Framework**: Angular (signals-based, zoneless)
- **UI Library**: PrimeNG + Tailwind CSS
- **Graphics**: PixiJS (interactive map rendering)
- **Language**: TypeScript (strict mode)

## Folder Structure

```
chronicle-ui/
├── src/
│   ├── app/
│   │   ├── core/                    # General-purpose shared code
│   │   │   ├── components/          # All custom reusable components
│   │   │   ├── services/            # Singleton services (HTTP, config, logging)
│   │   │   ├── auth/                # Authentication (services, guards, interceptors)
│   │   │   ├── interceptors/        # HTTP interceptors (error handling, logging)
│   │   │   ├── guards/              # Route guards (authorization, feature flags)
│   │   │   ├── types/               # Shared TypeScript types and interfaces
│   │   │   └── utils/               # Utility functions and helpers
│   │   │
│   │   ├── features/                # Feature modules (lazy-loaded)
│   │   │   ├── {feature-name}/      # Example: campaigns, worlds, characters, etc.
│   │   │   │   ├── components/      # Feature-specific components
│   │   │   │   ├── services/        # Feature business logic and state
│   │   │   │   ├── types/           # Feature domain types
│   │   │   │   └── utils/           # Feature-specific utilities
│   │   │   └── ...
│   │   │
│   │   └── app.component.ts         # Root component
│   │
│   └── assets/
│       ├── config/
│       │   └── app.config.json      # Runtime environment configuration
│       └── ...
```

## Core vs Features

**Core Directory** (`/core`)
- General-purpose, application-wide functionality
- Singleton services instantiated once at application startup
- Shared components used across multiple features (e.g., header, footer, error pages)
- Cross-cutting concerns (auth, HTTP, logging, error handling)
- Never imports from `/features`

**Features Directory** (`/features`)
- Self-contained feature modules with domain-specific logic
- Lazy-loaded via Angular routing for optimal bundle size
- Each feature can import from `/core` but not from other features
- Feature-based code splitting for performance optimization

## Architecture Principles

### State Management
- Signal-based reactivity only (zoneless change detection)
- Services act as state stores (no external state library)
- Feature services manage local feature state
- Core services manage global application state

### Styling
- PrimeNG components for all UI elements
- Tailwind CSS exclusively for layout and positioning
- No custom SCSS; leverage PrimeNG theming system

### Code Organization
- Lazy-loaded feature modules under `/features`
- Feature-based routing and code splitting
- Strict TypeScript with ESLint enforcement
- Clear separation between core (shared) and feature-specific code

### Configuration
- Runtime environment variables via `app.config.json` asset
- Configuration loaded before Angular application bootstrap
- `AppEnvironment` injection token provides app-specific settings to services and components
- No build-time environment substitution

### Communication
- HTTP-based API integration (Angular HttpClient)
- HTTP interceptor attaches JWT token to all API requests
- Core services handle API communication
- Feature services consume core HTTP services

### Authentication Integration
- AWS Amplify UI Angular components for Cognito connection
- No Amplify framework or backend management
- Direct Cognito SDK integration via Amplify UI helpers
- Auth guards protect feature routes

### Custom Components
- PixiJS-based interactive map with touch/mouse interaction
- Mobile-first responsive design

### Component Standards
- Components consist of TypeScript (.ts) and HTML (.html) files only
- **No component-level styles**: No .scss or .css files; use Tailwind CSS classes in templates
- **OnPush change detection required**: All components must use `ChangeDetectionStrategy.OnPush`
- OnPush-compatible component design (zoneless optimization)
- Follows Angular best practices and style guide
- Feature modules are standalone and independently testable

## Security

### Authentication Flow (Frontend)
1. User provides credentials via custom login UI
2. AWS Cognito validates credentials and returns JWT token
3. Frontend stores JWT and uses HTTP interceptor to attach it to all outgoing API requests

### Security Principles
- Custom authentication UI using Amplify UI Angular components
- Direct Cognito SDK integration (Amplify framework not used for backend/hosting)
- JWT-based stateless authentication
- Token automatically attached via Angular HTTP interceptor
