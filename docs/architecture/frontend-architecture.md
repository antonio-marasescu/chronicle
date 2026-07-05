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

### Feature Component Structure

Each feature follows a consistent structure with sub-features organized by page:

```
features/{feature-name}/
├── components/
│   ├── {page-name}/              # Sub-feature per page (e.g., campaign-list, campaign-detail)
│   │   ├── pages/
│   │   │   └── {page-name}-page/  # Page component in its own folder
│   │   │       ├── {page-name}-page.component.ts
│   │   │       └── {page-name}-page.component.html
│   │   ├── containers/
│   │   │   └── tabs/              # Tab-related containers (if applicable)
│   │   │       └── {container-name}/
│   │   │           └── {container-name}.component.ts
│   │   └── views/
│   │       ├── tabs/              # Tab-related views (if applicable)
│   │       │   └── {view-name}/
│   │       │       ├── {view-name}.component.ts
│   │       │       └── {view-name}.component.html
│   │       └── {view-name}/       # Non-tab views
│   │           ├── {view-name}.component.ts
│   │           └── {view-name}.component.html
│   └── ...
├── services/
└── types/
```

**Component Layer Responsibilities:**

- **Pages**: Route entry points, orchestrate containers and handle navigation
  - Each page component must be in its own folder with separate `.ts` and `.html` files
  - Handle navigation through `AppNavigationService` (never use `Router` or `RouterLink` directly)
  - Manage page-level state and coordinate between containers
  
- **Containers**: Business logic, data fetching, and state management
  - Each container must be in its own folder
  - Bridge between views and services
  - Handle data transformation and business rules
  - Can contain templates inline (no separate HTML file required)
  
- **Views**: Pure presentation components
  - Each view must be in its own folder with separate `.ts` and `.html` files
  - Emit events for user interactions (never navigate directly)
  - Receive data through inputs only
  - No direct service dependencies (except in rare cases like facades)

**Tab Organization:**
- Tab-related containers and views are grouped under a `tabs/` subfolder
- This keeps tab logic separate from other page components

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
- **All components must have separate template files**: Each component must have both a `.ts` and `.html` file (no inline templates)
- **No component-level styles**: No .scss or .css files; use Tailwind CSS classes in templates
- **OnPush change detection required**: All components must use `ChangeDetectionStrategy.OnPush`
- OnPush-compatible component design (zoneless optimization)
- Follows Angular best practices and style guide
- Feature modules are standalone and independently testable

### Navigation Standards
- **All navigation must use `AppNavigationService`**: Never use Angular `Router` or `RouterLink` directly in components
- **Views cannot navigate**: View components emit events; parent pages/containers handle navigation
- **Route paths use constants**: All route paths defined in `app-routes.constants.ts` and used via `AppNavigationService`
- Centralized navigation logic ensures consistency and easier refactoring

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
