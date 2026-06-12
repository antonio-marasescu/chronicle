---
name: primeng-helper
description: Use this skill whenever the user mentions PrimeNG, Angular UI components, or needs help creating, updating, suggesting, or troubleshooting PrimeNG components in their Angular application. This includes questions like "add a PrimeNG table", "how do I use the DatePicker", "fix this dialog", "what PrimeNG component should I use for X", or any task involving PrimeNG's 100+ components (forms, tables, dialogs, menus, charts, etc.). Always prefer this skill over generic Angular guidance when PrimeNG is involved.
---

# PrimeNG Helper

You are helping the user work with PrimeNG, the comprehensive Angular UI component library. This skill uses **progressive disclosure** to provide efficient assistance: start with quick reference documentation, then escalate to detailed documentation only when needed.

## How Progressive Disclosure Works

1. **Always start with the lightweight documentation** (`references/llms-lightweight.txt`) when the user first mentions a PrimeNG task
2. **Escalate to full documentation** (`references/llms-full.txt`) only when you need:
   - Detailed API signatures (specific props, events, methods)
   - Complex component configuration or advanced features
   - Template syntax or content projection patterns
   - Troubleshooting specific errors or edge cases
   - Migration guidance between versions

The lightweight doc provides component names, descriptions, and links. This is sufficient for understanding what components exist and their general purpose. The full doc contains complete API details, examples, and implementation specifics.

## When to Use Which Documentation

### Use Lightweight Documentation For:
- Understanding what components are available
- Getting a high-level overview of a component's purpose
- Recommending which component fits a use case
- Initial setup and configuration questions
- General theming and styling guidance

### Escalate to Full Documentation For:
- Implementing a specific component (need prop names, types, events)
- Debugging component behavior or errors
- Advanced features like templating, virtualization, lazy loading
- Specific API questions ("what props does Table accept?")
- Complex integrations (forms, validation, custom styling)

## Workflow

When the user asks for help with PrimeNG:

1. **Read the lightweight documentation first** to understand the relevant components and general approach
2. **Answer if possible** using the lightweight information plus your general Angular/PrimeNG knowledge
3. **If you need specific details** (prop names, event handlers, template syntax), read the relevant sections of the full documentation
4. **Provide complete, working code** with proper imports, component usage, and TypeScript types

## Key PrimeNG Concepts

Based on the lightweight documentation, here are essential concepts to keep in mind:

- **Installation**: PrimeNG is installed via npm and configured using `providePrimeNG` in app configuration
- **Theming**: Supports styled mode (pre-built themes like Aura, Material, Lara, Nora) and unstyled mode (Tailwind CSS or custom)
- **Icons**: Uses PrimeIcons by default (250+ icons), but supports custom icons
- **Pass Through Props**: Allows direct access to underlying DOM elements for complete customization
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA support
- **100+ Components**: Including forms, tables, dialogs, menus, charts, layouts, and utilities

## Implementation Guidelines

When writing PrimeNG code:

- Import components from `primeng/{component-name}` (e.g., `import { Table } from 'primeng/table'`)
- Use standalone components approach (PrimeNG v17+)
- Include PrimeIcons CSS for icon support: `import 'primeicons/primeicons.css'`
- Apply theme CSS from `primeng/resources/themes/{theme-name}/theme.css`
- Use Angular's reactive forms or template-driven forms with PrimeNG form components
- Leverage two-way binding with `[(ngModel)]` for form components when appropriate

## Response Format

Structure your responses this way:

1. **Acknowledge the task** and mention which component(s) you'll use
2. **Explain the approach** briefly (why this component fits)
3. **Provide the code** with necessary imports and implementation
4. **Highlight key props/features** the user should know about
5. **Mention when you consulted full docs** (if applicable) so the user understands the depth of research

## Example Interaction Pattern

**User**: "Add a data table with sorting and pagination"

**Your process**:
1. Read `llms-lightweight.txt` → see that Table component exists
2. Recognize you need specific props for sorting/pagination → read Table section in `llms-full.txt`
3. Provide complete implementation with imports, template, and explanation

**Your response should show**:
- Which component you're using (Table)
- The code implementation
- Key features explained (sorting via `[sortField]`, pagination via `[paginator]`)
- Any important configuration notes

## Remember

- **Start lightweight, escalate when needed** — this saves context window space and speeds up simple requests
- **Always read the lightweight doc first** when a new PrimeNG topic comes up
- **Trust the documentation** over assumptions — PrimeNG has specific APIs that may differ from generic expectations
- **Provide working, complete examples** — users should be able to copy and use your code
- **Mention the documentation source** when you escalate to full docs, so users understand the thoroughness of your research
