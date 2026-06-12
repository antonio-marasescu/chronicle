# Chronicle

Campaign and world management tool for tabletop RPGs with interactive map visualization, timeline tracking, and world-building capabilities.

## Project Structure

```
chronicle/
├── chronicle-ui/          # Angular frontend (signals-based, zoneless)
├── chronicle-api/         # API Lambda functions (Node.js/TypeScript)
├── chronicle-auth/        # Authentication Lambda
└── docs/
    └── architecture/      # Detailed architecture documentation
```

## Architecture

**Pattern**: Serverless, cloud-native  
**Frontend**: Angular SPA (DaisyUI + Tailwind CSS + PixiJS)  
**Backend**: AWS Lambda + API Gateway + DynamoDB + Cognito  
**Type Management**: Each service maintains its own types and models

## Key Principles

- **Independent services**: Frontend and backend manage their own types
- **API contracts**: OpenAPI/REST conventions ensure consistency
- **Runtime validation**: Backend validates all inputs using Zod
- **Type safety**: Backend uses Zod schema inference for TypeScript types
- **Signals-based**: Angular frontend uses signals (zoneless, OnPush)
- **Serverless**: Lambda functions per endpoint/domain
- **DynamoDB**: Single-table design with OneTable ODM

## Detailed Documentation

For architecture details, see:
- `docs/architecture/general-architecture.md` - System overview and patterns
- `docs/architecture/frontend-architecture.md` - Angular patterns and structure  
- `docs/architecture/backend-architecture.md` - Lambda functions, API design, data layer
