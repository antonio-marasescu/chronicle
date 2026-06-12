---
name: feature-doc
description: Manual-trigger skill for documenting business features in docs/business/. The user presents a feature concept, and you help them think it through by asking targeted questions about use cases, technical constraints, and domain modeling. Creates or updates markdown files organized by domain (e.g., campaigns.md, characters.md, auth.md).
disable-model-invocation: true
---

# Feature Documentation Skill

Your role is to help the user think through and document feature ideas for the Chronicle app. This is a collaborative process - ask questions, reference the architecture, and produce clean, scannable markdown.

## Process

### 1. Understand the Feature

When the user presents a feature idea, your first job is to understand what they want to build. Ask clarifying questions:

**Core concept:**
- What problem does this solve for the user (the tabletop RPG player/DM)?
- What's the happy path - how would someone use this?
- What value does this add to the experience?

**Scope boundaries:**
- What's explicitly in scope for this feature?
- What's explicitly out of scope (maybe for a future version)?
- Are there related features this connects to?

### 2. Drill Down with Architecture-Aware Questions

Reference the architecture docs at `@docs/architecture/` to ask informed questions. The user has a serverless AWS stack (Lambda + API Gateway + DynamoDB + Cognito) with an Angular frontend.

**Frontend considerations:**
- How does this show up in the UI? (PrimeNG components? PixiJS for maps?)
- Is this part of an existing feature module or a new one under `/features`?
- What user interactions are involved?
- Does this need real-time updates or is request/response sufficient?

**Backend considerations:**
- What API endpoints are needed? (RESTful design)
- What Lambda function(s) will handle this? (domain-driven separation)
- How does this fit into the DynamoDB single-table design?
- What are the access patterns? (queries, scans, relationships)

**Domain model for database:**
- What entities are involved? (campaigns, worlds, characters, timelines, maps, etc.)
- What's the primary key structure? (hierarchical relationships via composite keys)
- What attributes does each entity need?
- How do entities relate to each other? (one-to-many, many-to-many via GSI?)
- What queries will users need to make?

**Data validation:**
- What DTOs are needed in `chronicle-shared`?
- What Zod schemas should be defined?
- What validation rules apply?

**Authentication & Authorization:**
- Is this user-specific data?
- Who can read/write this data? (owner only, campaign members, public?)
- Are there permission rules beyond authentication?

**Other constraints:**
- Are there performance considerations? (large datasets, complex queries)
- File uploads or media involved?
- Integration with existing features?

### 3. Determine the Right Documentation File

Features are organized by domain, not by individual implementation. Ask yourself:

- **Is this about campaigns?** → `campaigns.md`
- **Is this about characters?** → `characters.md`
- **Is this about maps?** → `campaign-map.md` or `maps.md`
- **Is this about authentication/users?** → `auth.md`
- **Is this about timelines?** → `timelines.md`
- **Is this about worlds/worldbuilding?** → `worlds.md`
- **Is this a new domain?** → Create a new file named after the domain

If the feature spans multiple domains, pick the primary one and reference the others.

### 4. Check for Existing Documentation

Before creating a new file, check if documentation already exists:

```bash
ls docs/business/
```

If the file exists, read it to understand what's already documented. You'll be updating/extending it, not overwriting it.

### 5. Write or Update the Documentation

Structure your documentation for scannability - use simple text and lists, not heavy chapter hierarchies.

**Good structure:**

```markdown
# Campaign Management

Quick overview of what campaigns are and why they matter.

## Core Concepts

- **Campaign**: A collection of sessions, characters, and story arcs
- **Session**: A single game session with date/time and notes
- **Story Arc**: A narrative thread across multiple sessions

## Use Cases

**Create a new campaign**
- User creates a campaign with name and optional description
- System generates unique campaign ID
- User becomes campaign owner/DM

**Invite players to campaign**
- DM shares campaign link or invitation code
- Players join via link and select/create their character
- System tracks campaign membership

## Domain Model

**Campaign Entity**
- PK: `CAMPAIGN#<campaignId>`
- SK: `METADATA`
- Attributes: name, description, createdBy, createdAt, status
- Access pattern: Get campaign by ID

**Campaign Membership**
- PK: `CAMPAIGN#<campaignId>`
- SK: `MEMBER#<userId>`
- Attributes: userId, role (DM/Player), joinedAt, characterId
- Access pattern: List members of campaign, list campaigns for user (GSI)

## API Endpoints

**POST /campaigns**
- Creates new campaign
- DTO: CreateCampaignDto (name, description?)
- Returns: Campaign object

**GET /campaigns/:id**
- Retrieves campaign details
- Auth: Must be campaign member
- Returns: Campaign object

**POST /campaigns/:id/members**
- Adds user to campaign
- DTO: AddMemberDto (userId, role)
- Auth: Must be campaign DM
- Returns: Membership object

## Frontend

**Campaign List View**
- Feature: `/features/campaigns`
- Component: `CampaignListComponent`
- Shows user's campaigns (as DM or player)
- PrimeNG DataView component

**Campaign Detail View**
- Component: `CampaignDetailComponent`
- Tabs: Overview, Characters, Sessions, Timeline, Map
- Uses PrimeNG TabView

## Technical Considerations

- Campaign deletion: soft delete (set status=archived) to preserve history
- Large campaigns: paginate session lists
- Real-time updates: not needed for v1, consider WebSocket later
```

**Avoid:**
- Deep chapter nesting (###, ####, #####)
- Long prose paragraphs
- Exhaustive technical specs (keep it high-level)
- Implementation details (this is business docs, not code specs)

**Aim for:**
- Scannable bullets and short paragraphs
- Clear headers that act as landmarks
- Enough detail to understand scope and approach
- References to architecture constraints
- User-centric language (what problem does this solve?)

### 6. Cross-Reference When Needed

If a feature touches multiple domains, add a note:

```markdown
## Related Features

See also:
- **Characters** (`characters.md`) - Character selection when joining campaign
- **Timeline** (`timelines.md`) - Campaign events feed into timeline view
```

### 7. Present the Result

After writing or updating documentation:
1. Show the user what you created/changed
2. Ask if anything is missing or unclear
3. Offer to iterate if needed

## Remember

- This is idea generation AND documentation - help the user think through implications
- Be architecture-aware but not architecture-constrained
- Keep the markdown clean and scannable
- One file per domain, organized by concern
- Update existing docs rather than creating duplicates
- Focus on the "what" and "why", not exhaustive "how"
