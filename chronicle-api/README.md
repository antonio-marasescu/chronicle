# Chronicle API

NestJS-based API Lambda for Chronicle campaign management system.

## Development

```bash
# Install dependencies
pnpm install

# Start local dev server (port 3000)
pnpm start:dev

# Build for Lambda deployment
pnpm build:lambda

# Lint
pnpm lint

# Format code
pnpm format
```

## Local Server

Runs on `http://localhost:3000`

Endpoints:
- `GET /health` - Health check

## Lambda Deployment

Build output: `dist/index.js`
Handler: `index.handler`
Runtime: Node.js 20
Bundle size: ~2.5MB

## Architecture

- **Framework**: NestJS with Express adapter
- **Local**: Express server via `main.ts`
- **Lambda**: Serverless Express wrapper via `lambda.ts`
- **Features**: Modular NestJS architecture in `features/`
- **Shared**: Core infrastructure in `core/`
