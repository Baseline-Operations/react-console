# CLI Framework Architecture

This document describes the architecture and data flow of the React Console CLI framework.

## Overview

The CLI framework provides a React-based routing system for building command-line applications. It handles command parsing, route matching, parameter validation, middleware execution, and component rendering.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLI Application                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CLIApp Component                        │  │
│  │  - Sets app metadata (name, version, description)          │  │
│  │  - Initializes CLI configuration                          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                          │                                        │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │              CommandRouter Component                       │  │
│  │  - Parses command-line arguments                           │  │
│  │  - Matches commands/routes to components                   │  │
│  │  - Executes middleware and lifecycle hooks                 │  │
│  │  - Validates parameters                                    │  │
│  │  - Handles guards and redirects                            │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                          │                                        │
│         ┌────────────────┼────────────────┐                      │
│         │                │                │                      │
│  ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐              │
│  │   Command   │  │   Route    │  │   Default   │              │
│  │  Component  │  │  Component │  │  Component  │              │
│  └─────────────┘  └────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Command Parsing

**Input:** `process.argv` (command-line arguments)

**Process:**
```
process.argv → parseCommandLineArgs() → ParsedArgs
```

**ParsedArgs Structure:**
```typescript
{
  command: string[];      // ['build', 'production']
  options: Record<...>;    // { '--verbose': true, '--output': 'dist' }
  params: (string|number|boolean)[];  // ['arg1', 'arg2']
}
```

**Key Files:**
- `src/utils/cli/parser.ts` - Main parser
- `src/utils/cli/optionResolver.ts` - Option alias resolution
- `src/utils/cli/optionNormalizer.ts` - Option value normalization

### 2. Component Matching

**Input:** `ParsedArgs` + React children

**Process:**
```
ParsedArgs + children → matchComponent() → MatchResult
```

**MatchResult Structure:**
```typescript
{
  component: ReactNode;     // Matched component to render
  route?: string;           // Matched route path (if route)
  routeParams?: Record<...>; // Route parameters (if route)
  isDefault: boolean;        // Whether default component matched
}
```

**Matching Logic:**
1. Try to match `Command` components by name/path
2. Try to match `Route` components by path pattern
3. Fall back to `Default` component if no match

**Key Files:**
- `src/utils/cli/matcher.ts` - Component matching logic
- `src/components/cli/CommandRouter/matching.ts` - Metadata extraction

### 3. Middleware Execution

**Input:** `MatchResult` + `ParsedArgs`

**Process:**
```
MatchResult → executeMiddlewareChain() → MiddlewareResult
```

**MiddlewareResult Structure:**
```typescript
{
  shouldStop: boolean;      // Whether to stop execution
  args: ParsedArgs;         // Modified arguments (after middleware)
}
```

**Middleware Types:**
- **Global Middleware:** Runs for all commands
- **Command Middleware:** Runs for specific commands

**Key Files:**
- `src/utils/cli/middleware.ts` - Middleware registry
- `src/components/cli/CommandRouter/execution.ts` - Middleware execution

### 4. Lifecycle Hooks

**Before Hooks:**
- Execute before component render
- Synchronous execution (useLayoutEffect)
- Can modify arguments

**After Hooks:**
- Execute after component render/unmount
- Asynchronous execution (useEffect)
- Cleanup function support

**Key Files:**
- `src/utils/cli/lifecycle.ts` - Lifecycle hook registry
- `src/components/cli/CommandRouter/execution.ts` - Hook execution

### 5. Parameter Validation

**Input:** `ParsedArgs` + Component metadata

**Process:**
```
ParsedArgs + metadata → validateCommandParameters() → ValidationResult
```

**ValidationResult Structure:**
```typescript
{
  valid: boolean;
  errors: ParamValidationError[];
  params?: Record<...>;     // Validated parameters
  options?: Record<...>;    // Validated options
}
```

**Validation Types:**
- **Type Validation:** string, number, boolean, array
- **Constraint Validation:** min/max, patterns, custom validators
- **Required Validation:** Required vs optional parameters

**Key Files:**
- `src/utils/cli/paramValidator.ts` - Base validator
- `src/utils/cli/paramValidatorEnhanced.ts` - Enhanced validator (constraints)

### 6. Route Guards

**Input:** `MatchResult` + `ParsedArgs`

**Process:**
```
MatchResult → checkRouteGuards() → GuardResult
```

**GuardResult Types:**
- `{ type: 'allow' }` - Allow route
- `{ type: 'block' }` - Block route (show error)
- `{ type: 'redirect', path: string }` - Redirect to different route

**Key Files:**
- `src/utils/cli/routeGuards.ts` - Guard utilities
- `src/components/cli/CommandRouter/guards.ts` - Guard checking

### 7. Component Rendering

**Input:** Matched component + validated context

**Process:**
```
Component + Context → React Reconciliation → Console Output
```

**Context Provided:**
```typescript
{
  command: string[];
  options: Record<...>;
  params: (string|number|boolean)[];
  route?: string;
  routeParams?: Record<...>;
  isDefault: boolean;
  navigate: (path: string) => void;
}
```

## Component Hierarchy

```
CLIApp
  └── CommandRouter
       ├── Default (fallback)
       ├── Command (name="build")
       │    └── BuildComponent
       ├── Command (name="test")
       │    └── TestComponent
       └── Route (path="/settings")
            └── SettingsComponent
```

## Key Concepts

### Commands vs Routes

**Commands:**
- Matched by name: `my-app build`
- Hierarchical: `my-app build production`
- Defined with `<Command name="build">`

**Routes:**
- Matched by path pattern: `my-app /settings`
- Supports parameters: `my-app /user/:id`
- Defined with `<Route path="/settings">`

### Middleware

Middleware functions run before component rendering and can:
- Modify arguments
- Stop execution
- Add logging
- Perform authentication checks

```typescript
registerCommandMiddleware('build', (args) => {
  // Modify args
  args.options.verbose = true;
  return { shouldStop: false, args };
});
```

### Lifecycle Hooks

**Before Hooks:**
- Run synchronously before render
- Can modify arguments
- Useful for setup/preparation

**After Hooks:**
- Run asynchronously after render
- Support cleanup functions
- Useful for teardown/cleanup

### Parameter Validation

Parameters can be validated with:
- **Type checking:** string, number, boolean, array
- **Constraints:** min/max, patterns, custom validators
- **Required flags:** required vs optional

```typescript
<Command 
  name="build"
  params={[
    { name: 'target', type: 'string', required: true },
    { name: 'port', type: 'number', min: 1, max: 65535 }
  ]}
>
```

## File Organization

```
src/
├── components/cli/
│   ├── CLIApp.tsx              # Root CLI app component
│   ├── CommandRouter.tsx       # Main router component
│   │   ├── routing.ts          # Navigation logic
│   │   ├── matching.ts          # Component matching
│   │   ├── execution.ts        # Middleware & hooks
│   │   └── guards.ts           # Route guards
│   ├── Command.tsx             # Command component
│   ├── Route.tsx               # Route component
│   └── Default.tsx             # Default component
│
└── utils/cli/
    ├── parser.ts               # Argument parsing
    ├── matcher.ts              # Component matching
    ├── paramValidator.ts       # Parameter validation
    ├── middleware.ts          # Middleware system
    ├── lifecycle.ts            # Lifecycle hooks
    ├── routeGuards.ts          # Route guards
    ├── optionResolver.ts       # Option alias resolution
    ├── optionNormalizer.ts     # Option normalization
    ├── commandExecutor.ts      # Command execution
    ├── help/                   # Help system
    └── components/              # CLI-specific components
```

## Usage Example

```tsx
import { CLIApp, CommandRouter, Command, Default } from 'react-console/cli';

function App() {
  return (
    <CLIApp name="my-app" version="1.0.0">
      <CommandRouter>
        <Default>
          <HomeComponent />
        </Default>
        
        <Command 
          name="build"
          params={[
            { name: 'target', type: 'string', required: true }
          ]}
          options={{
            verbose: { type: 'boolean', alias: 'v' }
          }}
        >
          <BuildComponent />
        </Command>
        
        <Route path="/settings">
          <SettingsComponent />
        </Route>
      </CommandRouter>
    </CLIApp>
  );
}
```

## Best Practices

1. **Use Commands for Actions:** Commands are best for actions (build, test, deploy)
2. **Use Routes for Navigation:** Routes are best for navigation (settings, profile)
3. **Validate Parameters:** Always validate user input with parameter definitions
4. **Use Middleware for Cross-Cutting Concerns:** Logging, auth, error handling
5. **Use Lifecycle Hooks for Setup/Teardown:** Database connections, file operations
6. **Provide Help:** Always include help text for commands and options

## Performance Considerations

- **Lazy Matching:** Components are matched on-demand, not pre-loaded
- **Memoization:** Parsed arguments and match results are memoized
- **Tree-Shaking:** Import only what you need from subpaths
- **Minimal Re-renders:** React reconciliation handles efficient updates
