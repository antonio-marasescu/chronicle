# Chronicle Auth

NestJS-based authentication Lambda for Chronicle using AWS Cognito.

## Development

```bash
# Install dependencies
pnpm install

# Start local dev server (port 3001)
pnpm start:dev

# Build for Lambda deployment
pnpm build:lambda

# Lint
pnpm lint

# Format code
pnpm format
```

## Local Server

Runs on `http://localhost:3001`

Endpoints:
- `GET /auth/health` - Health check
- `POST /auth/login` - User login (to be implemented)
- `POST /auth/register` - User registration (to be implemented)

## Lambda Deployment

Build output: `dist/index.js`
Handler: `index.handler`
Runtime: Node.js 20
Bundle size: ~2.5MB

## Architecture

- **Framework**: NestJS with Express adapter
- **Local**: Express server via `main.ts`
- **Lambda**: Serverless Express wrapper via `lambda.ts`
- **Features**: Authentication module in `features/auth/`
- **Cognito**: AWS JWT verification with `aws-jwt-verify`
