# Architecture Guide

This guide explains the architecture of React Console, including design patterns, extensibility, and how the system works internally.

## Overview

React Console is a custom React renderer for terminal UIs built on top of `react-reconciler`. It provides:

- **React Components**: JSX-based component API
- **Terminal Rendering**: ANSI escape code output
- **Layout System**: Flexbox and Grid layouts
- **Event System**: Keyboard and mouse event handling
- **Focus Management**: Tab navigation and focus tracking

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   User Application                       │
│  (React Components: Text, View, Input, Button, etc.)    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              react-reconciler                           │
│  (React's custom renderer API - reconciliation logic)   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           React Console Renderer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Host Config│  │   Layout     │  │   Events     │ │
│  │   (Core API) │  │   System     │  │   Handling   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Terminal Output                            │
│  (ANSI escape codes, stdout, buffering)                 │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Host Config (`src/renderer/hostConfig.ts`)

The host config implements React's custom renderer API. It defines:

- **createInstance**: Creates `ConsoleNode` objects from React elements
- **appendChild/removeChild**: Manages component tree structure
- **updateProperties**: Updates component props
- **commitUpdate**: Commits changes to terminal
- **prepareUpdate**: Prepares updates for reconciliation

```typescript
// Simplified example
const hostConfig = {
  createInstance(type, props) {
    return createConsoleNode(type, props);
  },
  
  appendChild(parent, child) {
    parent.children.push(child);
  },
  
  commitUpdate(instance, updatePayload) {
    performRender(instance);
  },
};
```

### 2. Layout System (`src/renderer/layout/`)

The layout system calculates positions and renders components:

#### Core Module (`core.ts`)
- Main entry point (`renderNodeToBuffer`)
- Dispatches to node renderers
- Error handling and bounds registration

#### Node Renderers (`nodes.ts`)
- Individual render functions for each node type
- `renderTextNode`, `renderBoxNode`, `renderInputNode`, etc.
- Handles ANSI styling and content rendering

#### Flexbox (`flexbox.ts`)
- Flexbox layout calculations
- Supports row/column, justify, align, gap
- Calculates child positions and sizes

#### Grid (`grid.ts`)
- CSS Grid layout calculations
- Template parsing (columns/rows)
- Fractional units (fr) and fixed sizes
- Grid item placement

#### Borders (`borders.ts`)
- Border style calculation
- Border character rendering
- Corner and edge handling

### 3. Event System (`src/renderer/utils/navigation.ts`)

Handles keyboard and mouse events:

- **Component Collection**: Recursively finds interactive components
- **Tab Navigation**: Keyboard focus management
- **Mouse Events**: Click detection and hit testing
- **Focus Management**: Focus/blur handling

### 4. Component System (`src/components/`)

Components are organized by type:

#### Primitives (`primitives/`)
- `Text`, `View`, `Box`, `LineBreak`, `Newline`
- Basic building blocks

#### Interactive (`interactive/`)
- `Input`, `Button`, `Pressable`, `Focusable`
- User input and interaction

#### Selection (`selection/`)
- `Radio`, `Checkbox`, `Dropdown`, `List`
- Selection-based components

#### Layout (`layout/`)
- `Scrollable`, `ScrollView`, `Overlay`
- Layout and scrolling components

## Design Patterns

### 1. Component Co-location

Related code is kept together:

```
src/components/interactive/
├── Input.tsx          # Component + handler
├── Button.tsx         # Component + handler
└── inputHelpers.ts    # Shared utilities
```

**Benefits**:
- Easy to find related code
- Clear ownership
- Reduced coupling

### 2. Pure Functions

Layout calculations are pure functions:

```typescript
// Pure function - no side effects
function renderFlexboxLayout(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number
): { x: number; y: number } {
  // Calculate layout
  // Return position
}
```

**Benefits**:
- Predictable behavior
- Easy to test
- No hidden dependencies

### 3. Type-Safe Handlers

Generic handler types for type safety:

```typescript
type ComponentHandler = (
  component: ConsoleNode,
  chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
) => void;

type HandlerRegistry = {
  [K in ConsoleNode['type']]?: ComponentHandler;
};
```

**Benefits**:
- Type safety
- No `as any` assertions
- Better IDE support

### 4. Functional Utilities

Utilities are functional and composable:

```typescript
// Pure function utilities
export function resolveWidth(size: ResponsiveSize, maxWidth: number): number | undefined;
export function measureText(text: string): number;
export function validateNumberInput(value: string, component: ConsoleNode): ValidationResult;
```

**Benefits**:
- Reusable
- Testable
- Composable

### 5. Error Boundaries

Error handling with React Error Boundaries:

```typescript
export class ErrorBoundary extends Component<ErrorBoundaryProps> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    reportError(error, ErrorType.COMPONENT, errorInfo);
  }
}
```

**Benefits**:
- Graceful error handling
- User-friendly error messages
- Error reporting integration

## Data Flow

### Rendering Flow

1. **React Reconciliation**: React updates component tree
2. **Host Config**: Creates/updates `ConsoleNode` objects
3. **Layout Calculation**: Calculates positions and sizes
4. **Node Rendering**: Converts to ANSI output
5. **Output Buffering**: Buffers ANSI codes
6. **Terminal Output**: Flushes to stdout

### Event Flow

1. **Input Received**: Terminal input (keyboard/mouse)
2. **Event Parsing**: Parse ANSI escape sequences
3. **Component Detection**: Find target component (hit testing)
4. **Event Dispatch**: Call component event handlers
5. **State Update**: Update component state
6. **Re-render**: React reconciliation triggers re-render

### Focus Management

1. **Tab Navigation**: User presses Tab
2. **Component Collection**: Find all interactive components
3. **Tab Index Assignment**: Assign/update tab indexes
4. **Focus Change**: Update focused component
5. **Visual Update**: Re-render with focus indicators
6. **Event Routing**: Route keyboard events to focused component

## Extensibility

### Adding New Components

1. **Create Component**: Create component file in appropriate directory

```typescript
// src/components/custom/MyComponent.tsx
export function MyComponent({ children, ...props }: MyComponentProps) {
  return createConsoleNode('custom', {
    componentType: 'my-component',
    ...props,
    children,
  });
}
```

2. **Add Renderer**: Add render function in `nodes.ts`

```typescript
// src/renderer/layout/nodes.ts
export function renderCustomNode(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number
): { x: number; y: number } {
  // Render logic
  return { x, y: y + 1 };
}
```

3. **Register in Core**: Add to switch in `core.ts`

```typescript
// src/renderer/layout/core.ts
case 'custom':
  return renderCustomNode(node, buffer, x, y, maxWidth, maxHeight);
```

4. **Add Event Handler** (if interactive): Create handler

```typescript
// src/components/custom/MyComponent.tsx
export function handleMyComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  // Handle input
}
```

5. **Register Handler**: Add to handler registry

```typescript
// src/renderer/render.ts
const componentHandlers: HandlerRegistry = {
  // ...
  custom: handleMyComponent,
};
```

### Adding New Layout Types

1. **Create Layout Function**: Create new layout calculation function

```typescript
// src/renderer/layout/custom.ts
export function renderCustomLayout(
  node: ConsoleNode,
  buffer: OutputBuffer,
  x: number,
  y: number,
  maxWidth: number,
  style: ViewStyle | undefined
): { x: number; y: number } {
  // Layout calculation
  return { x, y: y + height };
}
```

2. **Add Style Properties**: Extend `ViewStyle` interface

```typescript
// src/types/index.ts
export interface ViewStyle {
  // ... existing properties
  customLayout?: 'my-layout';
  customProperty?: string;
}
```

3. **Use in Box Node**: Add to `renderBoxNode`

```typescript
// src/renderer/layout/nodes.ts
if (style?.customLayout === 'my-layout') {
  return renderCustomLayout(node, buffer, x, y, maxWidth, style);
}
```

### Adding New Event Types

1. **Extend Event Interfaces**: Add new event types

```typescript
// src/types/index.ts
export interface ComponentEventHandlers {
  // ... existing handlers
  onCustomEvent?: (event: CustomEvent) => void;
}

export interface CustomEvent {
  data: any;
}
```

2. **Handle in Components**: Add event handling logic

```typescript
// src/components/custom/MyComponent.tsx
export function handleMyComponent(
  component: ConsoleNode,
  _chunk: string,
  key: KeyPress,
  scheduleUpdate: () => void
): void {
  if (component.onCustomEvent) {
    component.onCustomEvent({ data: 'custom' });
  }
}
```

## Type System

### ConsoleNode

Core data structure representing components:

```typescript
export interface ConsoleNode {
  type: NodeType;
  content?: string | number;
  children?: ConsoleNode[];
  style?: ViewStyle | TextStyle;
  // ... component-specific properties
}
```

### Style Types

- **ViewStyle**: Layout and visual styles for containers
- **TextStyle**: Text styling (color, bold, etc.)
- **ResponsiveSize**: Number or percentage string

### Event Types

- **InputEvent**: Value change events
- **KeyboardEvent**: Keyboard input events
- **MouseEvent**: Mouse click/move events

## Testing Architecture

### Unit Tests

Test pure functions and utilities:

```typescript
// src/__tests__/utils/input.test.ts
describe('validateNumberInput', () => {
  it('should validate positive numbers', () => {
    expect(validateNumberInput('123', {})).toBeValid();
  });
});
```

### Integration Tests

Test component rendering and interaction:

```typescript
// src/__tests__/integration/components.test.tsx
describe('Button Component', () => {
  it('should render button', () => {
    const node = { type: 'button', content: 'Click' };
    const buffer = createOutputBuffer();
    renderNodeToBuffer(node, buffer, 0, 0, 80);
    expect(buffer.lines[0]).toContain('Click');
  });
});
```

### E2E Tests

Test full application workflows:

```typescript
// e2e/app.test.ts
describe('App E2E', () => {
  it('should handle user interaction', async () => {
    // Test full workflow
  });
});
```

## Performance Considerations

### Layout Calculations

- Layout calculations are pure functions (cacheable)
- Flexbox/Grid calculations are optimized for terminal constraints
- Responsive sizes are resolved once per render

### Rendering

- Output buffering prevents flicker
- ANSI codes are generated efficiently
- Component bounds are registered for hit testing

### Event Handling

- Component collection is cached
- Event handlers are type-safe (no runtime overhead)
- Focus management is efficient

## Future Architecture Improvements

1. **Render Batching**: Automatic batching of updates
2. **Layout Caching**: Cache layout calculations
3. **Virtual Scrolling**: Built-in virtual scrolling
4. **Component Lazy Loading**: Lazy load components
5. **Plugin System**: Extensibility via plugins

## Further Reading

- [State Management Guide](./STATE_MANAGEMENT.md) - State management patterns
- [Styling Guide](./STYLING_GUIDE.md) - Styling architecture
- [Layout Guide](./LAYOUT_GUIDE.md) - Layout system details
- [Performance Guide](./PERFORMANCE_GUIDE.md) - Performance optimization
