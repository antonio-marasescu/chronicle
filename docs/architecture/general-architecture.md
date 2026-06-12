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
├── chronicle-shared/      # Shared DTOs and types
│   └── src/
│       ├── dtos/          # Zod schemas for data validation
│       └── index.ts       # Public exports
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
- PrimeNG + Tailwind CSS
- PixiJS (maps)
- TypeScript (strict mode)

### Backend (`/chronicle-api`, `/chronicle-auth`)
- AWS Lambda (Node.js/TypeScript)
- AWS API Gateway
- AWS DynamoDB
- AWS Cognito

### Shared (`/chronicle-shared`)
- Zod (schema validation and type inference)
- TypeScript (strict mode)

## Shared Types & DTOs

### Monorepo Structure

The project uses a **monorepo with a shared package** to maintain type safety across frontend and backend.

**Package:** `chronicle-shared`

This package contains:
- **Zod schemas** - Define data structure and validation rules
- **TypeScript types** - Inferred from Zod schemas using `z.infer<>`
- Single source of truth for all DTOs

### Setup

Use npm/pnpm workspaces to manage the monorepo:

```json
// package.json (root)
{
  "workspaces": [
    "chronicle-ui",
    "chronicle-api",
    "chronicle-auth",
    "chronicle-shared"
  ]
}
```

### Usage Pattern

**1. Define schema in `chronicle-shared`:**

```typescript
// chronicle-shared/src/dtos/campaign.dto.ts
import { z } from 'zod';

export const CreateCampaignSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
});

export type CreateCampaignDto = z.infer<typeof CreateCampaignSchema>;
```

**2. Backend validates with Zod:**

```typescript
// chronicle-api/src/handlers/campaigns.ts
import { CreateCampaignSchema, CreateCampaignDto } from '@chronicle/shared';

export async function createCampaign(event: APIGatewayEvent) {
  // Runtime validation
  const dto = CreateCampaignSchema.parse(JSON.parse(event.body));
  
  // dto is now type-safe and validated
  // ...
}
```

**3. Frontend uses inferred types:**

```typescript
// chronicle-ui/src/app/features/campaigns/services/campaign.service.ts
import { CreateCampaignDto } from '@chronicle/shared';

createCampaign(dto: CreateCampaignDto): Observable<Campaign> {
  return this.http.post<Campaign>('/api/campaigns', dto);
}
```

**4. Optional: Frontend validation (reuse schemas):**

```typescript
// chronicle-ui/src/app/features/campaigns/components/create-campaign.component.ts
import { CreateCampaignSchema } from '@chronicle/shared';

validateForm(formData: unknown) {
  const result = CreateCampaignSchema.safeParse(formData);
  if (!result.success) {
    // Handle validation errors
    console.error(result.error);
  }
}
```

### Benefits

- **Single source of truth** - DTOs defined once, used everywhere
- **Type safety** - TypeScript compiler ensures correct usage
- **Runtime validation** - Backend validates all incoming data
- **No code generation** - Direct TypeScript imports
- **Optional frontend validation** - Can reuse Zod schemas for client-side validation
- **Lightweight** - Zod is ~8kb gzipped and tree-shakeable

### Package Management

Reference the shared package in `package.json`:

```json
// chronicle-api/package.json
{
  "dependencies": {
    "@chronicle/shared": "workspace:*"
  }
}

// chronicle-ui/package.json
{
  "dependencies": {
    "@chronicle/shared": "workspace:*"
  }
}
```

## Security & Authentication

### Authentication Flow
1. User provides credentials via custom login UI
2. AWS Cognito validates credentials and returns JWT token
3. Frontend stores JWT and uses HTTP interceptor to attach it to all outgoing API requests
4. API Gateway validates JWT against Cognito user pool
5. Lambda functions receive authenticated user context

### Security Principles
- Custom authentication UI using Amplify UI Angular components
- Direct Cognito SDK integration (Amplify framework not used for backend/hosting)
- JWT-based stateless authentication
- Token automatically attached via Angular HTTP interceptor
- API Gateway enforces authorization before Lambda invocation
- **All incoming data validated using Zod schemas** at API boundaries

## Detailed Architecture Documentation

- **[Frontend Architecture](./frontend-architecture.md)** - Angular application structure, principles, and patterns
- **[Backend Architecture](./backend-architecture.md)** - AWS Lambda functions, API design, and data layer
