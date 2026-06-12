# Chronicle

Campaign and world management tool for tabletop RPGs with interactive map visualization, timeline tracking, and world-building capabilities.

## Project Structure

```
chronicle/
├── chronicle-ui/          # Angular frontend (signals-based, zoneless)
├── chronicle-api/         # API Lambda functions (Node.js/TypeScript)
├── chronicle-auth/        # Authentication Lambda
├── chronicle-shared/      # Shared DTOs and Zod schemas
└── docs/
    └── architecture/      # Detailed architecture documentation
```

## Architecture

**Pattern**: Serverless, cloud-native  
**Frontend**: Angular SPA (PrimeNG + Tailwind CSS + PixiJS)  
**Backend**: AWS Lambda + API Gateway + DynamoDB + Cognito  
**Shared Types**: Zod schemas in `chronicle-shared` package

## Key Principles

- **Single source of truth**: All DTOs defined with Zod schemas in `chronicle-shared`
- **Type safety**: Frontend and backend share types via monorepo workspace
- **Runtime validation**: Backend validates all inputs with Zod
- **Signals-based**: Angular frontend uses signals (zoneless, OnPush)
- **Serverless**: Lambda functions per endpoint/domain
- **DynamoDB**: Single-table design with OneTable ODM

## Detailed Documentation

For architecture details, see:
- `docs/architecture/general-architecture.md` - System overview, shared types
- `docs/architecture/frontend-architecture.md` - Angular patterns and structure  
- `docs/architecture/backend-architecture.md` - Lambda functions, API design, data layer

## Package Management

This is a monorepo using npm/pnpm workspaces. Reference `chronicle-shared` via:

```json
{
  "dependencies": {
    "@chronicle/shared": "workspace:*"
  }
}
```
