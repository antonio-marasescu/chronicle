# Chronicle - Backend Architecture

Campaign and world management tool for tabletop RPGs - Backend infrastructure.

## Tech Stack
- **Framework**: NestJS
- **Runtime**: AWS Lambda (Node.js/TypeScript) + Local Express Server
- **Lambda Adapter**: @vendia/serverless-express
- **API Gateway**: AWS API Gateway (REST/HTTP)
- **Database**: AWS DynamoDB
- **Authentication**: AWS Cognito
- **Validation**: Zod

## Folder Structure

### chronicle-api

```
chronicle-api/
├── src/
│   ├── main.ts                   # Local dev server (Express on port 3000)
│   ├── lambda.ts                 # Lambda handler (production)
│   ├── app.module.ts             # Root NestJS module
│   │
│   ├── core/                     # Shared backend infrastructure
│   │   ├── dtos/                 # Request/response DTOs with Zod schemas
│   │   ├── domain/               # Domain models and entities
│   │   ├── database/             # DynamoDB OneTable setup
│   │   ├── guards/               # Auth guards (JWT validation)
│   │   ├── interceptors/         # Logging, response transformation
│   │   └── filters/              # Exception filters
│   │
│   └── features/                 # Feature modules (NestJS modules)
│       ├── campaigns/
│       │   ├── campaigns.module.ts
│       │   ├── campaigns.controller.ts
│       │   ├── campaigns.service.ts
│       │   └── dto/
│       ├── worlds/
│       ├── characters/
│       └── health/               # Health check endpoint
│
├── nest-cli.json                 # NestJS CLI configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

### chronicle-auth

```
chronicle-auth/
├── src/
│   ├── main.ts                   # Local dev server (Express on port 3001)
│   ├── lambda.ts                 # Lambda handler (production)
│   ├── app.module.ts             # Root NestJS module
│   │
│   ├── features/
│   │   └── auth/
│   │       ├── auth.module.ts
│   │       ├── auth.controller.ts
│   │       └── auth.service.ts
│   │
│   ├── dtos/                     # Auth-related DTOs with Zod schemas
│   ├── services/                 # Cognito integration services
│   └── utils/                    # Auth utility functions
│
├── nest-cli.json
├── tsconfig.json
└── package.json
```

## Lambda Functions

### 1. Authorization Lambda (`/chronicle-auth`)
- Handles Cognito authentication flow
- Validates user credentials
- Issues and refreshes JWT tokens
- User registration and password management
- Standalone function, not behind API Gateway authorization

### 2. API Lambda (`/chronicle-api`)
- Business logic for campaigns, worlds, characters, timelines, maps
- Protected by API Gateway JWT authorizer
- Receives authenticated user context from validated token
- CRUD operations on DynamoDB
- Feature-based organization

## Local Development vs Lambda Deployment

Both services run as standard NestJS Express servers locally (`main.ts`) with hot reload and full debugging support. For Lambda deployment, the same NestJS application is wrapped with `@vendia/serverless-express` (`lambda.ts`) which translates API Gateway events to Express requests, with server instances cached across warm starts for optimal performance.

## Architecture Principles

### Code Organization
- **NestJS Modules** - Feature-based organization with dependency injection
- **Core directory** - Shared infrastructure (DTOs, domain models, database, guards, interceptors)
- **Features directory** - NestJS feature modules (module, controller, service)
- Clear separation between infrastructure and business logic

### API Design
- **NestJS Controllers** - Declarative routing with decorators (`@Get()`, `@Post()`, etc.)
- **NestJS Services** - Business logic with dependency injection
- Single Lambda per service (chronicle-api, chronicle-auth)
- RESTful API conventions
- Separation of auth concerns from business logic
- Consistent error handling with exception filters

### Data Validation
- **Zod schemas** define validation rules in `core/dtos/`
- TypeScript types inferred from schemas using `z.infer<typeof Schema>`
- Validation performed at API handler entry points
- Runtime validation ensures data integrity at API boundaries
- Error responses follow consistent format

### Data Layer
- DynamoDB single-table design (following Alex DeBrie's principles)
- OneTable ODM for schema modeling and data access
- Access patterns designed around query requirements
- Composite keys for hierarchical data relationships (campaigns → worlds → characters → timelines)

## Security & Authentication

### Authentication Flow
1. User provides credentials via custom login UI (frontend)
2. AWS Cognito validates credentials and returns JWT token
3. Frontend stores JWT and uses HTTP interceptor to attach it to all outgoing API requests
4. API Gateway validates JWT against Cognito user pool
5. Lambda functions receive authenticated user context

### Security Principles
- JWT-based stateless authentication
- API Gateway enforces authorization before Lambda invocation
- Cognito user pool manages user identity and credentials
