# Chronicle - General Architecture

Campaign and world management tool for tabletop RPGs, featuring interactive map visualization, timeline tracking, and world-building capabilities.

## System Overview

**Architecture Pattern**: Serverless, cloud-native
**Authentication**: AWS Cognito with custom UI
**Frontend**: Angular SPA
**Backend**: AWS Lambda + API Gateway
**Database**: AWS DynamoDB

## Repository Structure

```
chronicle/
├── chronicle-ui/          # Angular frontend application
├── chronicle-api/         # API Lambda functions
├── chronicle-auth/        # Authentication Lambda
└── docs/
    └── architecture/      # Architecture documentation
```

## High-Level Architecture

```
┌─────────────────┐
│   Angular SPA   │
│  (Chronicle UI) │
└────────┬────────┘
         │ HTTPS + JWT
         ▼
┌─────────────────┐
│  API Gateway    │
│  + JWT Auth     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌──────────────┐
│  Lambda         │◄──────┤  DynamoDB    │
│  Functions      │       │  Single Table│
└─────────────────┘       └──────────────┘
         │
         ▼
┌─────────────────┐
│  AWS Cognito    │
│  User Pool      │
└─────────────────┘
```

## Technology Stack

### Frontend (`/chronicle-ui`)
- Angular (signals-based, zoneless)
- DaisyUI + Tailwind CSS
- PixiJS (maps)
- TypeScript (strict mode)

### Backend (`/chronicle-api`, `/chronicle-auth`)
- AWS Lambda (Node.js/TypeScript)
- AWS API Gateway
- AWS DynamoDB (with OneTable ODM)
- AWS Cognito

## Type Management

This project uses a **simple, independent approach** where each service manages its own types and models.

### Approach

- **Frontend** (`chronicle-ui`) - Maintains TypeScript interfaces for API responses and domain models
- **Backend** (`chronicle-api`, `chronicle-auth`) - Defines types and performs runtime validation
- **API Contract** - REST conventions and consistent naming ensure alignment
- **No shared package** - Simplifies development and deployment

### Backend Pattern

Backend Lambda functions use **Zod schemas** for validation and type inference within each service.

### Frontend Pattern

Frontend services define TypeScript interfaces matching API contracts.

### Benefits

- **Simple** - No shared package or monorepo workspace complexity
- **Independent** - Frontend and backend can be developed and deployed separately
- **Runtime safety** - Backend uses Zod for robust validation
- **Type safety** - Backend gets TypeScript types inferred from Zod schemas
- **Flexible** - Each service optimizes its own types for its use case
- **Clear contracts** - REST conventions and documentation keep services aligned

## Security & Authentication

### Authentication Flow
1. User provides credentials via custom login UI
2. AWS Cognito validates credentials and returns JWT token
3. Frontend stores JWT and uses HTTP interceptor to attach it to all outgoing API requests
4. API Gateway validates JWT against Cognito user pool
5. Lambda functions receive authenticated user context

### Security Principles
- Custom authentication UI using DaisyUI components
- Direct Cognito SDK integration (AWS SDK for JavaScript)
- No Amplify framework dependency
- JWT-based stateless authentication
- Token automatically attached via Angular HTTP interceptor
- API Gateway enforces authorization before Lambda invocation
- All incoming data validated at API boundaries

## Detailed Architecture Documentation

- **[Frontend Architecture](./frontend-architecture.md)** - Angular application structure, principles, and patterns
- **[Backend Architecture](./backend-architecture.md)** - AWS Lambda functions, API design, and data layer
