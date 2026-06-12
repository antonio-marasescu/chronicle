---
name: clib-helper
description: Use this skill whenever the user needs help creating, updating, or troubleshooting reusable UI components in the /clib component library. This includes questions like "add a button component", "create a modal wrapper", "how do I implement a dropdown", "fix this card component", "what component should I create for X", or any task involving UI components (forms, navigation, feedback, layout, data display, etc.). This skill helps create Angular wrapper components around the underlying CSS library (currently DaisyUI).
---

# Component Library (clib) Helper

You are helping the user create and maintain the `/clib` component library for the Chronicle Angular application. The `/clib` directory contains Angular wrapper components that encapsulate the underlying CSS library implementation (currently DaisyUI + Tailwind CSS 4).

## Core Principles

When creating wrapper components in `/clib`, always follow these principles:

1. **Abstraction** - Hide underlying CSS library implementation details from features
2. **Library independence** - Make it easy to swap CSS libraries by only changing wrapper internals
3. **Type safety** - Provide strongly-typed Angular component APIs with inputs/outputs
4. **Signals-based** - Use Angular signals for reactivity (zoneless, OnPush compatible)
5. **No custom CSS** - Use existing CSS library classes and Tailwind utilities
6. **Semantic APIs** - Component inputs should use semantic names (variant, size, disabled, etc.)
7. **Consistent patterns** - Follow established wrapper patterns across all components

### Current CSS Library: DaisyUI

The current implementation uses DaisyUI, which provides:
- Semantic color names: `primary`, `secondary`, `accent`, `neutral`, `base-100/200/300`, status colors
- Component CSS classes for common UI patterns
- Tailwind CSS 4 integration
- No custom CSS required

## Documentation Access

Before implementing any wrapper component:

1. **Always read the CSS library documentation first** (`references/llms.txt` - currently DaisyUI docs) to understand available components
2. **Consult the component discovery protocol** - Shortlist candidates, compare 3+ options, select best match
3. **Reference specific component sections** for CSS class names and patterns
4. **Design the Angular wrapper API** - Think about inputs, outputs, and usage patterns
5. **Trust the documentation** over assumptions - CSS libraries have specific class names and patterns

## Component Categories

Create wrapper components in `/clib/components` for these categories:

- **Navigation**: navbar, menu, breadcrumbs, pagination, dock
- **Forms**: input, select, textarea, checkbox, radio, toggle, range, file-input
- **Feedback**: alert, badge, loading, progress, tooltip, modal
- **Layout**: card, drawer, hero, stack, divider, indicator
- **Data Display**: table, timeline, carousel, chat, stat
- **Interactive**: button, dropdown, accordion, tabs, collapse, swap
- **Visual Effects**: mask, hover effects, animations
- **Mockups**: browser, phone, window, code mockups

*Note: The current CSS library (DaisyUI) provides 80+ components across these categories. See `references/llms.txt` for specifics.*

## Wrapper Component Structure

All wrapper components should follow this structure:

```
clib/components/{component-name}/
├── {component-name}.component.ts   # Component implementation
└── {component-name}.component.html # Template (if complex)
```

**Component requirements:**
- Standalone component
- OnPush change detection
- Signals for inputs (use `input()` not `@Input()`)
- Computed signals for CSS class generation
- No component-level styles (use Tailwind/CSS library classes)
- Prefix selector with `chr-` (e.g., `chr-button`, `chr-card`)

## Current CSS Library: DaisyUI

**Installation:**
```bash
npm i -D daisyui@latest
```

**Configuration (CSS file):**
```css
@plugin "daisyui";
```

**Color System:**
- Semantic colors: `primary`, `secondary`, `accent`, `neutral`, `base-100/200/300`
- Status colors: `info`, `success`, `warning`, `error`
- Each has a `-content` variant for text contrast

See `references/llms.txt` for complete DaisyUI documentation.

## Creating Wrapper Components

When creating wrapper components in `/clib/components`:

1. **Wrapper component approach**: Create Angular components in `/clib/components` that wrap CSS library classes
2. **Abstraction layer**: Features should import wrapper components from `/clib`, not use raw CSS classes
3. **Component structure**: Use standalone components (Angular 17+)
4. **No component-level styles**: Apply CSS library classes in wrapper component templates
5. **OnPush change detection**: Required for all components
6. **Tailwind utilities**: Combine with CSS library classes for layout and spacing within wrappers
7. **Responsive design**: Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, etc.)

**Example wrapper pattern:**
```typescript
// clib/components/button/button.component.ts
@Component({
  selector: 'chr-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button [class]="buttonClasses()" [disabled]="disabled()">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'accent'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input<boolean>(false);
  
  buttonClasses = computed(() => {
    const classes = ['btn'];
    classes.push(`btn-${this.variant()}`);
    if (this.size() !== 'md') classes.push(`btn-${this.size()}`);
    return classes.join(' ');
  });
}
```

**Usage in features:**
```typescript
// features/campaigns/components/campaign-list.component.ts
import { ButtonComponent } from '../../../clib/components/button/button.component';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <chr-button variant="primary" (click)="create()">
      Create Campaign
    </chr-button>
  `
})
export class CampaignListComponent { ... }
```

## Workflow

When the user asks for help creating a UI component:

1. **Read the CSS library documentation** (`references/llms.txt`) to find relevant CSS components
2. **Follow component discovery protocol** - Compare multiple options before selecting
3. **Design the wrapper API** - Determine inputs, outputs, and usage patterns
4. **Create wrapper component in `/clib/components/{name}/`** - Use proper Angular structure
5. **Implement with CSS library classes** - Currently DaisyUI classes, but keep abstracted
6. **Provide complete, working code** - Component file(s) and example usage
7. **Explain the approach** - Why this CSS component fits, key classes used
8. **Highlight customization options** - How wrapper accepts inputs for variants, sizes, etc.
9. **Show usage in features** - How features import and use the wrapper component

## Response Format

Structure your responses this way:

1. **Acknowledge the task** and mention which wrapper component you'll create
2. **Explain the approach** - Why this CSS component fits, what it will abstract
3. **Design the API** - Show the inputs/outputs the wrapper will expose
4. **Provide the wrapper code** - Complete Angular component with TypeScript and template
5. **Explain key implementation details** - CSS classes used, computed signals, etc.
6. **Show feature usage** - Example of how features import and use the wrapper
7. **Mention customization options** - How to extend or customize the wrapper

## Example Interaction Pattern

**User**: "Create a card component for the component library"

**Your process**:
1. Read `references/llms.txt` → find Card CSS component patterns
2. Design the wrapper API (inputs for title, actions, etc.)
3. Create Angular wrapper component in `/clib/components/card/`
4. Show how features use the wrapper

**Your response should show**:
- Which CSS component you're wrapping (Card)
- The wrapper API design (inputs, outputs, content projection)
- The Angular wrapper component code in `/clib/components/card/`
- Key CSS classes used internally (e.g., `card`, `card-body`)
- Example usage in a feature component
- How the abstraction makes it easy to swap CSS libraries later

## Best Practices

- **Abstraction first** - Wrapper API should hide CSS library implementation details
- **Semantic APIs** - Use semantic input names (variant, size) not CSS class names
- **Signals-based** - Use `input()` for inputs, `computed()` for derived values
- **Default variants** - Provide sensible defaults for all inputs
- **Type safety** - Use union types for variants, sizes, etc. (e.g., `'primary' | 'secondary'`)
- **Content projection** - Use `<ng-content>` for flexible composition
- **Responsive by default** - Apply mobile-first responsive patterns
- **No custom CSS** - Use CSS library classes and Tailwind utilities only
- **Prefix selectors** - All wrapper components use `chr-` prefix (e.g., `chr-button`)

## Remember

- **Always consult CSS library documentation first** - Read `references/llms.txt` before creating wrappers
- **Follow component discovery protocol** - Compare options before selecting CSS component
- **Design wrapper API first** - Think about inputs, outputs, and usage before implementing
- **Create wrapper components in `/clib/components`** - Never use raw CSS classes in features
- **Provide working Angular wrapper examples** - Users should be able to copy and use your code
- **Explain abstraction benefits** - Help users understand how wrappers enable library swapping
- **Leverage Tailwind utilities** - For spacing, layout, sizing within wrapper templates
- **Think library independence** - Wrappers should hide all CSS library implementation details
- **Use proper Angular patterns** - Signals, OnPush, standalone components, type safety
