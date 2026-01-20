# React Console - Architecture & Design Patterns

## Overview

This document describes the architecture and design patterns used in React Console. It explains the rationale behind key decisions and how different parts of the system work together.

For detailed analysis of pattern evaluation, see `ARCHITECTURE_ANALYSIS.md`.

---

## Core Architecture Principles

### 1. React Native-like Patterns

React Console follows React Native patterns where applicable:
- **Component API**: Components use similar prop names and patterns (`View`, `Text`, `ScrollView`)
- **Style API**: StyleSheet API similar to React Native
- **Event Handlers**: JSX-style event handlers (`onChange`, `onClick`, `onKeyDown`)
- **Functional Components**: All components are function components (no classes)

**Rationale**: Familiar API reduces learning curve for developers coming from React Native or React DOM.

### 2. Custom React Renderer

React Console uses `react-reconciler` to create a custom React renderer that maps React components to terminal output using ANSI escape codes.

**Rationale**: 
- Enables full React 19+ features (hooks, concurrent features, React Compiler)
- Maintains compatibility with React ecosystem
- Leverages React's reconciliation for efficient updates

### 3. Host Component Pattern

Components are "host components" that return `ConsoleNode` data structures rather than React elements:
- Components return `ConsoleNode` objects (terminal-specific representation)
- React reconciler converts these to React elements via `hostConfig`
- No component lifecycle hooks - components are pure data structures

**Rationale**: Efficient mapping to terminal, allows custom renderer to control rendering lifecycle.

---

## Design Patterns

### 1. Function Components with Generic Factories

**Pattern**: Function-based components using generic factory helpers.

**Implementation**:
```typescript
// Component factory helper
export function createConsoleNode<T extends ConsoleNode['type']>(
  type: T,
  props: { ... }
): ReactElement

// Component implementation
export function Input(props: InputProps) {
  return createConsoleNode('input', { ... });
}
```

**Rationale**:
- ✅ Simple and lightweight (no React component overhead)
- ✅ Type-safe with generics (reduces type assertions)
- ✅ Works well with React Compiler (no special handling needed)
- ✅ Maintains compatibility with React reconciler

**When to use**: All components follow this pattern.

---

### 2. Generic Type System

**Pattern**: Generics for type safety in utilities and handlers.

**Implementation**:
```typescript
// Generic validation
type Validator<T> = (value: string) => ValidationResult<T>;
function validateNumber(input: string, constraints?: NumberConstraints): ValidationResult<number>

// Generic handler registry
type HandlerRegistry = { [K in ConsoleNode['type']]?: ComponentHandler };
function dispatchHandler(registry: HandlerRegistry, component: ConsoleNode, ...): void
```

**Rationale**:
- ✅ Eliminates `as any` assertions
- ✅ Provides compile-time type safety
- ✅ Better IDE autocomplete and error checking
- ✅ No runtime overhead (TypeScript compile-time only)

**When to use**: 
- Validation utilities
- Handler registries
- Component factories
- Type guards

---

### 3. Procedural Renderer with Functional Utilities

**Pattern**: Procedural rendering orchestration with pure function utilities.

**Structure**:
- `render.ts`: Procedural orchestration (state management, coordination)
- `layout/`: Pure function modules (core, borders, flexbox, grid, nodes)
- `utils/`: Pure function utilities (measure, responsive, terminal, mouse)

**Rationale**:
- ✅ Clear separation of concerns (orchestration vs. calculations)
- ✅ Easy to test (pure functions)
- ✅ Easy to understand (linear flow)
- ✅ No hidden state (explicit state management)

**Module Organization**:
```
src/renderer/layout/
├── core.ts         # Main rendering entry point
├── borders.ts      # Border rendering utilities
├── flexbox.ts      # Flexbox layout calculations
├── grid.ts         # Grid layout calculations
├── nodes.ts        # Individual node renderers
└── index.ts        # Re-exports
```

---

### 4. Component Co-location

**Pattern**: Component-specific logic kept with components.

**Structure**:
```
src/components/
├── primitives/      # Text, View, Box, LineBreak, Newline
├── interactive/     # Input, Button, Pressable, Focusable
│   ├── inputHelpers.ts  # Shared input utilities
├── selection/       # Radio, Checkbox, Dropdown, List
│   └── shared.ts    # Shared selection utilities
└── layout/          # Scrollable, ScrollView, Overlay
```

**Rationale**:
- ✅ Related code stays together (easier to find and modify)
- ✅ Clear ownership (component owns its logic)
- ✅ Reduces coupling (components don't depend on global state)
- ✅ Shared utilities co-located with components that use them

**Exceptions**: 
- Truly global utilities go in `src/utils/`
- Cross-cutting concerns (error handling, validation) in shared modules

---

### 5. Type-Safe Event Handling

**Pattern**: Generic event handler types with type-safe dispatch.

**Implementation**:
```typescript
// Event handler interface
interface ComponentEventHandlers {
  onChange?: (event: InputEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onClick?: (event: MouseEvent) => void;
  // ... more handlers
}

// Type-safe handler dispatch
type HandlerRegistry = { [K in ConsoleNode['type']]?: ComponentHandler };
function dispatchHandler(registry: HandlerRegistry, component: ConsoleNode, ...): void
```

**Rationale**:
- ✅ Eliminates `as any` assertions in event handlers
- ✅ Type-safe event objects with proper properties
- ✅ Better IDE support and error checking
- ✅ Clear event handler signatures

---

### 6. Pure Function Utilities

**Pattern**: Pure functions for utilities (no side effects, testable).

**Examples**:
- `measure.ts`: Text measurement and wrapping
- `responsive.ts`: Responsive size resolution
- `mouse.ts`: Mouse event parsing
- `terminal.ts`: Terminal dimension utilities
- `validation.ts`: Generic validation utilities

**Rationale**:
- ✅ Testable (no dependencies on state)
- ✅ Predictable (same input = same output)
- ✅ Composable (can combine functions)
- ✅ Easy to reason about (no hidden state)

**When to use**: All utilities that don't need state should be pure functions.

---

### 7. State Management Strategy

**Pattern**: Module-level state for renderer, ConsoleNode properties for component state.

**Implementation**:
```typescript
// Renderer state (module-level)
let rootContainer: ConsoleNode | null = null;
let rootFiber: FiberRoot | null = null;
let isInteractive = false;

// Component state (ConsoleNode properties)
interface ConsoleNode {
  value?: string | number | boolean | string[] | number[];
  focused?: boolean;
  disabled?: boolean;
  scrollTop?: number;
  scrollLeft?: number;
  // ... more state
}
```

**Rationale**:
- ✅ Renderer state centralized (easy to manage)
- ✅ Component state co-located (clear ownership)
- ✅ No global state pollution (module-scoped)
- ✅ React state for user components (via hooks)

**Global State Exception**: `terminal` object on `globalThis` for terminal dimensions and focused component (similar to `window` in browsers).

---

### 8. Error Handling Pattern

**Pattern**: Centralized error reporting with context.

**Implementation**:
```typescript
// Error reporting utility
export function reportError(
  error: Error | unknown,
  type: ErrorType,
  context?: Record<string, unknown>
): void

// Error wrapper for functions
export function withErrorHandling<T extends (...args: unknown[]) => unknown>(
  fn: T,
  type: ErrorType,
  context?: Record<string, unknown>
): T
```

**Rationale**:
- ✅ Consistent error handling across codebase
- ✅ Error context for debugging
- ✅ Graceful degradation (errors don't crash app)
- ✅ Optional error handler for custom logging

---

## Architecture Decisions

### Why Function Components, Not Classes?

**Decision**: Use function components exclusively.

**Rationale**:
- ✅ Simpler syntax and less boilerplate
- ✅ Better React Compiler support
- ✅ Aligns with React 19 patterns
- ✅ Easier to test (pure functions)
- ✅ No need for lifecycle methods (host components)

### Why Custom Renderer (`react-reconciler`)?

**Decision**: Use `react-reconciler` instead of custom React implementation.

**Rationale**:
- ✅ Full React 19+ feature support (hooks, concurrent features)
- ✅ React Compiler compatibility
- ✅ Maintains React ecosystem compatibility
- ✅ Official React team support
- ❌ Cannot be removed without breaking React features (analyzed and confirmed)

### Why Procedural Renderer?

**Decision**: Use procedural functions for renderer orchestration.

**Rationale**:
- ✅ Clear flow (easy to follow)
- ✅ Explicit state management (no hidden state)
- ✅ Easy to debug (linear execution)
- ⚠️ Alternative (classes) adds complexity without clear benefit

**Note**: Pure function utilities (layout, measurement) are separated from procedural orchestration.

### Why Generics Over Classes for Utilities?

**Decision**: Use generics in utilities, not class-based utilities.

**Rationale**:
- ✅ Type safety at compile-time
- ✅ No runtime overhead
- ✅ Composable (functions can be combined)
- ✅ Easy to test (pure functions)
- ❌ Classes add complexity without clear state management benefit

**Exception**: `ComponentBoundsRegistry` is a class because it manages stateful position tracking.

### Why Not Decorators?

**Decision**: Avoid decorators for cross-cutting concerns.

**Rationale**:
- ⚠️ Decorators still experimental in TypeScript
- ❌ React Compiler compatibility unknown
- ❌ Adds complexity without clear benefit
- ✅ Pure functions and composition work well

**Future**: Re-evaluate when decorators are stable and React Compiler support is confirmed.

---

## File Organization

### Directory Structure

```
src/
├── components/          # React components (host components)
│   ├── primitives/      # Text, View, Box, LineBreak, Newline
│   ├── interactive/     # Input, Button, Pressable, Focusable
│   │   └── inputHelpers.ts  # Shared input logic
│   ├── selection/       # Radio, Checkbox, Dropdown, List
│   │   └── shared.ts    # Shared selection logic
│   ├── layout/          # Scrollable, ScrollView, Overlay
│   └── utils.ts         # Component factory helpers
├── renderer/            # Custom React renderer
│   ├── render.ts        # Main renderer (orchestration)
│   ├── hostConfig.ts    # React reconciler host config
│   ├── input.ts         # Input parsing
│   ├── output.ts        # Output buffering
│   ├── layout/          # Layout rendering (split by concern)
│   │   ├── core.ts      # Main entry point
│   │   ├── borders.ts   # Border rendering
│   │   ├── flexbox.ts   # Flexbox layout
│   │   ├── grid.ts      # Grid layout
│   │   └── nodes.ts     # Node renderers
│   └── utils/           # Renderer utilities
│       ├── componentBounds.ts  # Position tracking
│       ├── navigation.ts       # Focus/navigation
│       └── types.ts            # Internal types
├── types/               # TypeScript type definitions
│   ├── index.ts         # Public types
│   ├── handlers.ts      # Handler types
│   └── guards.ts        # Type guards
├── utils/               # Pure function utilities
│   ├── ansi.ts          # ANSI code utilities
│   ├── measure.ts       # Text measurement
│   ├── responsive.ts    # Responsive sizing
│   ├── input.ts         # Input validation
│   ├── mouse.ts         # Mouse event parsing
│   ├── terminal.ts      # Terminal utilities
│   ├── StyleSheet.ts    # StyleSheet API
│   ├── validation.ts    # Generic validation
│   ├── errors.ts        # Error handling
│   └── globalTerminal.ts # Global terminal object
└── index.ts             # Public API exports
```

### Organization Principles

1. **Component Co-location**: Component-specific logic stays with components
2. **Shared Utilities**: Cross-cutting utilities in `utils/` or component `shared.ts`
3. **Renderer Separation**: Renderer code separate from component code
4. **Type Organization**: Types organized by scope (public vs. internal)

---

## Type Safety Strategy

### Generic Types

Generics are used for:
- Component factories (`createConsoleNode<T>`)
- Validation utilities (`Validator<T>`, `ValidationResult<T>`)
- Handler registries (`HandlerRegistry`)
- Renderer functions (`NodeRenderFunction<T>`)

### Type Guards

Runtime type checking with type guards:
```typescript
export function isArrayValue(value: unknown): value is (string | number)[] {
  return Array.isArray(value) && (value.length === 0 || typeof value[0] === 'string' || typeof value[0] === 'number');
}
```

### Type Assertions

Minimal use of type assertions:
- ✅ `as unknown as ReactElement` in `createConsoleNode` (bridge for reconciler)
- ✅ Component-specific casts with type guards (e.g., `isArrayValue()`)
- ❌ No `as any` in new code (eliminated where possible)

---

## Event System Architecture

### Event Flow

1. **Input Capture**: Raw input parsed by `renderer/input.ts`
2. **Event Creation**: Parsed input converted to typed event objects
3. **Event Propagation**: Events propagate from focused component
4. **Handler Dispatch**: Type-safe handler dispatch via `HandlerRegistry`
5. **Component Update**: Component updates via React reconciliation

### Event Types

```typescript
// Input events
interface InputEvent {
  value: string | number | boolean | string[] | number[];
  key?: KeyPress;
}

// Keyboard events
interface KeyboardEvent {
  key: KeyPress;
  preventDefault(): void;
  stopPropagation(): void;
}

// Mouse events
interface MouseEvent {
  x: number;
  y: number;
  button?: number;
  isDragging?: boolean;
  // ... more properties
}
```

---

## Layout System Architecture

### Rendering Pipeline

1. **React Reconciliation**: React updates component tree
2. **Layout Calculation**: Pure functions calculate layout (flexbox, grid, borders)
3. **Node Rendering**: Node renderers convert `ConsoleNode` to ANSI output
4. **Output Buffering**: ANSI output buffered and flushed to terminal

### Layout Modules

- **core.ts**: Main rendering entry point, dispatches to node renderers
- **borders.ts**: Border style calculation and rendering
- **flexbox.ts**: Flexbox layout calculations
- **grid.ts**: Grid layout calculations
- **nodes.ts**: Individual node type renderers

---

## Performance Considerations

### Current Optimizations

1. **React Compiler**: Automatic memoization of components
2. **Output Buffering**: Prevents flicker during updates
3. **Layout Caching**: (Future) Layout calculations can be cached
4. **Virtual Scrolling**: (Future) List component can use virtual scrolling

### Future Optimizations

1. **Render Batching**: Batch rapid state changes
2. **Debounced Resize**: Debounce terminal resize events
3. **Memoization**: Cache expensive style calculations
4. **Virtual Scrolling**: Only render visible list items

---

## Testing Strategy

### Unit Tests

- Pure function utilities (measure, responsive, validation)
- Type guards and utilities
- Component factories

### Integration Tests

- Component rendering
- Event handling
- Layout calculations
- Input validation

### E2E Tests

- Example applications
- Full user workflows
- Terminal interaction

---

## Extensibility

### Adding New Components

1. Create component file in appropriate directory (`primitives/`, `interactive/`, etc.)
2. Use `createConsoleNode` factory helper
3. Add node renderer in `renderer/layout/nodes.ts`
4. Add handler in component file (if interactive)
5. Register handler in `HandlerRegistry` (if interactive)

### Adding New Utilities

1. Create utility file in `src/utils/`
2. Use pure function pattern (if possible)
3. Add generics for type safety (if applicable)
4. Export from `src/index.ts`

---

## Migration Notes

### From Ink

React Console follows different patterns:
- React Native-like API (not HTML-like)
- Custom renderer (not DOM-based)
- Function components (not class components)
- Different event system (JSX-style handlers)

See migration guide (when available) for detailed comparison.

---

## Summary

React Console uses a **functional, type-safe, modular architecture** with:

- ✅ Function components with generic factories
- ✅ Procedural renderer with pure function utilities
- ✅ Generic type system for type safety
- ✅ Component co-location for maintainability
- ✅ Centralized error handling
- ✅ React Native-like API for familiarity

This architecture provides a **balance between simplicity, type safety, and extensibility** while maintaining compatibility with React 19+ and React Compiler.
