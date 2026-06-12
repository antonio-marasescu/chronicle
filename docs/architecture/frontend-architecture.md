# Chronicle - Frontend Architecture

Campaign and world management tool for tabletop RPGs, featuring interactive map visualization, timeline tracking, and world-building capabilities.

## Tech Stack
- **Framework**: Angular (signals-based, zoneless)
- **UI Library**: DaisyUI + Tailwind CSS
- **Graphics**: PixiJS (interactive map rendering)
- **Language**: TypeScript (strict mode)

## Folder Structure

```
chronicle-ui/
├── src/
│   ├── app/
│   │   ├── clib/                    # Reusable component library
│   │   │   ├── components/          # All reusable UI components
│   │   │   ├── directives/          # Shared directives
│   │   │   └── types/               # Component-related types
│   │   │
│   │   ├── core/                    # General-purpose shared code
│   │   │   ├── services/            # Singleton services (HTTP, config, logging)
│   │   │   ├── auth/                # Authentication (services, guards, interceptors)
│   │   │   ├── interceptors/        # HTTP interceptors (error handling, logging)
│   │   │   ├── guards/              # Route guards (authorization, feature flags)
│   │   │   ├── types/               # Shared TypeScript types
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

## Directory Organization

**Component Library** (`/clib`)
- Angular wrapper components around DaisyUI CSS classes
- Provides abstraction layer for easy library replacement
- Shared directives and component utilities
- Component-related types
- Never imports from `/core` or `/features`
- **Purpose**: Encapsulate DaisyUI implementation details so features use custom Angular components, not raw CSS classes

**Core Directory** (`/core`)
- General-purpose, application-wide functionality
- Singleton services instantiated once at application startup
- Cross-cutting concerns (auth, HTTP, logging, error handling)
- Never imports from `/features`
- Can import from `/clib` for UI components

**Features Directory** (`/features`)
- Self-contained feature modules with domain-specific logic
- Lazy-loaded via Angular routing for optimal bundle size
- Each feature can import from `/core` and `/clib` but not from other features
- **Should use `/clib` components instead of raw DaisyUI classes**
- Feature-based code splitting for performance optimization

## Architecture Principles

### State Management
- Signal-based reactivity only (zoneless change detection)
- Services act as state stores (no external state library)
- Feature services manage local feature state
- Core services manage global application state

### Styling
- DaisyUI CSS classes wrapped in Angular components (`/clib`)
- Features consume Angular wrapper components, not raw DaisyUI classes
- Tailwind CSS for styling and layout
- No custom SCSS; use Tailwind utility classes and DaisyUI component classes within wrapper components

### Code Organization
- Lazy-loaded feature modules under `/features`
- Feature-based routing and code splitting
- Strict TypeScript with ESLint enforcement
- Clear separation between core (shared) and feature-specific code
- **Use `type` instead of `interface`** for all type definitions
- **No barrel exports/re-exports** - Import directly from source files, not index.ts

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
- Direct Cognito SDK integration (AWS SDK for JavaScript)
- No Amplify framework or backend management
- Auth guards protect feature routes
- Custom login components built with DaisyUI

### Custom Components
- **Component library approach**: Wrap DaisyUI CSS classes in Angular components (`/clib`)
- **Abstraction layer**: Features use wrapper components, not raw CSS classes
- **Library independence**: Easy to replace DaisyUI by updating wrapper implementations
- PixiJS-based interactive map with touch/mouse interaction (in `/clib/components`)
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
1. User provides credentials via custom login UI (DaisyUI components)
2. AWS Cognito validates credentials and returns JWT token
3. Frontend stores JWT and uses HTTP interceptor to attach it to all outgoing API requests

### Security Principles
- Custom authentication UI using DaisyUI components
- Direct Cognito SDK integration (AWS SDK for JavaScript)
- No Amplify framework dependency
- JWT-based stateless authentication
- Token automatically attached via Angular HTTP interceptor
