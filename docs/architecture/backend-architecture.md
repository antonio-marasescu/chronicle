# Chronicle - Backend Architecture

Campaign and world management tool for tabletop RPGs - Backend infrastructure.

## Tech Stack
- **Runtime**: AWS Lambda (Node.js/TypeScript)
- **API Gateway**: AWS API Gateway (REST/HTTP)
- **Database**: AWS DynamoDB
- **Authentication**: AWS Cognito

## Lambda Functions

### 1. Authorization Lambda (`/chronicle-auth`)
- Handles Cognito authentication flow
- Validates user credentials
- Issues and refreshes JWT tokens
- User registration and password management
- Standalone function, not behind API Gateway authorization

### 2. API Lambda(s) (`/chronicle-api`)
- Business logic for campaigns, worlds, characters, timelines, maps
- Protected by API Gateway JWT authorizer
- Receives authenticated user context from validated token
- CRUD operations on DynamoDB
- Domain-driven function separation (per feature/resource)

## Architecture Principles

### API Design
- Serverless functions per endpoint/domain
- RESTful API conventions
- Separation of auth concerns from business logic

### Data Validation
- **All DTOs defined using Zod schemas**
- Validation performed using Zod's `.parse()` or `.safeParse()` methods
- Type-safe request/response contracts
- Runtime validation ensures data integrity at API boundaries

### Data Layer
- DynamoDB single-table design (following Alex DeBrie's principles)
- OneTable ODM for schema modeling and data access
- Access patterns designed around query requirements
- Composite keys for hierarchical data relationships (campaigns → worlds → characters → timelines)

## Deployment & DevOps

**Hosting**: AWS infrastructure (Lambda, API Gateway, DynamoDB, Cognito, S3/CloudFront for frontend)
**CI/CD**: _(To be documented)_
**Testing**: _(To be documented)_

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
