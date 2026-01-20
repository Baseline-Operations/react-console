# CLI Framework Guide

Complete guide to building CLI applications with React Console.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Concepts](#basic-concepts)
3. [Component-Based Architecture](#component-based-architecture)
4. [Commands](#commands)
5. [Routes](#routes)
6. [Default Components](#default-components)
7. [Parameters and Options](#parameters-and-options)
8. [Help System](#help-system)
9. [Navigation](#navigation)
10. [Examples](#examples)

## Getting Started

### Installation

```bash
npm install react-console react@^19.0.0
```

### Basic Example

```tsx
import { render } from 'react-console';
import { CLIApp, CommandRouter, Command, Default } from 'react-console/cli';
import { Text, View } from 'react-console';

function App() {
  return (
    <CLIApp name="my-app" version="1.0.0" description="My CLI app">
      <CommandRouter>
        <Default>
          <Text>Welcome to my CLI app!</Text>
        </Default>
        <Command name="hello" description="Say hello">
          <Text>Hello, World!</Text>
        </Command>
      </CommandRouter>
    </CLIApp>
  );
}

render(<App />, { mode: 'interactive' });
```

## Basic Concepts

### CLIApp

The root wrapper component that provides application metadata:

```tsx
<CLIApp 
  name="my-app"           // Application name (required)
  version="1.0.0"         // Application version (required)
  description="My app"    // Application description (optional)
  interactive={true}       // Interactive mode (default: true)
  exitCode={0}            // Exit code for non-interactive mode (default: 0)
>
  {/* Your router and components */}
</CLIApp>
```

### CommandRouter / Router

The main router component that handles command and route matching:

```tsx
<CommandRouter 
  description="Main router"  // Router description (optional)
  help={CustomHelp}          // Custom help component (optional)
  helpAutoExit={true}       // Auto-exit after help (default: true)
  noHelp={false}            // Disable help (default: false)
>
  {/* Commands, Routes, Default components */}
</CommandRouter>
```

**Note**: `<Router>` is an alias for `<CommandRouter>` - use whichever name you prefer.

## Component-Based Architecture

All CLI components use React's component-based architecture. Components are defined as **children**, not props:

```tsx
// ✅ Correct - component as child
<Command name="build">
  <BuildComponent />
</Command>

// ❌ Wrong - component as prop
<Command name="build" component={BuildComponent} />
```

## Commands

Commands are CLI operations that users can execute:

```tsx
<Command 
  name="build"                    // Command name (required)
  aliases={['b', 'compile']}      // Command aliases (optional)
  path="/build"                    // Path for route access (optional)
  description="Build project"     // Description for help (optional)
  params={[...]}                   // Parameter definitions (optional)
  options={{...}}                  // Option definitions (optional)
  help={CustomHelp}                // Custom help component (optional)
  exitAfterExecution={false}       // Exit after execution (optional)
  exitCode={0}                    // Exit code (optional)
>
  <BuildComponent />
</Command>
```

### Nested Commands (Subcommands)

Commands can be nested to create subcommands:

```tsx
<Command name="build" description="Build project">
  <BuildComponent />
  
  {/* Subcommand */}
  <Command name="dev" description="Development build">
    <DevBuildComponent />
  </Command>
  
  <Command name="prod" description="Production build">
    <ProdBuildComponent />
  </Command>
</Command>
```

Usage: `my-app build dev` or `my-app build prod`

### Path-Based Commands

Commands with a `path` prop work as both commands and routes:

```tsx
<Command name="build" path="/build" description="Build project">
  <BuildComponent />
</Command>
```

Accessible as:
- Command: `my-app build`
- Route: Navigate to `/build` programmatically

## Routes

Routes provide path-based navigation (similar to web routing):

```tsx
<Route 
  path="/settings"                // Route path (required)
  description="Settings page"     // Description (optional)
  params={[...]}                  // Parameter definitions (optional)
  help={CustomHelp}                // Custom help (optional)
  guard={guardFunction}           // Route guard (optional)
  redirect="/other"                // Auto-redirect (optional)
>
  <SettingsComponent />
</Route>
```

### Path Parameters

Routes support path parameters using `:param` syntax:

```tsx
<Route path="/profile/:id" description="User profile">
  <ProfileComponent />
</Route>
```

Access parameters in your component:

```tsx
import { useRouteParams } from 'react-console/cli';

function ProfileComponent() {
  const params = useRouteParams();
  const id = params.id; // Extracted from path
  return <Text>Profile ID: {id}</Text>;
}
```

## Default Components

Default components render when no command or route matches:

```tsx
<Default description="Default interface">
  <HomeComponent />
</Default>
```

Defaults can be nested:

```tsx
<Command name="build">
  <BuildComponent />
  
  {/* Default for build command when no subcommand matches */}
  <Default>
    <DefaultBuildComponent />
  </Default>
</Command>
```

## Parameters and Options

### Parameters

Positional arguments passed to commands:

```tsx
<Command 
  name="build"
  params={[
    { name: 'target', type: 'string', required: false },
    { name: 'env', type: 'string', required: true },
  ]}
>
  <BuildComponent />
</Command>
```

Access in component:

```tsx
import { useCommandParams } from 'react-console/cli';

function BuildComponent() {
  const params = useCommandParams();
  // params.target (optional)
  // params.env (required)
}
```

### Options

Named flags and options:

```tsx
<Command 
  name="build"
  options={{
    minify: { 
      type: 'boolean', 
      default: false, 
      description: 'Minify output',
      aliases: ['m'],
    },
    output: { 
      type: 'string', 
      description: 'Output directory' 
    },
    port: { 
      type: 'number', 
      default: 8080,
      description: 'Server port',
    },
  }}
>
  <BuildComponent />
</Command>
```

Access in component:

```tsx
import { useCommandOptions } from 'react-console/cli';

function BuildComponent() {
  const options = useCommandOptions();
  // options.minify (boolean)
  // options.output (string | undefined)
  // options.port (number, default: 8080)
}
```

## Help System

### Auto-Generated Help

Help is automatically generated from your component structure:

```bash
my-app --help
my-app build --help
my-app build dev --help
```

### Custom Help

Provide custom help components:

```tsx
<CommandRouter 
  help={(props: HelpProps) => (
    <View>
      <Text bold>Custom App Help</Text>
      <Text>{props.app.description}</Text>
    </View>
  )}
>
  {/* ... */}
</CommandRouter>
```

### Help Props

Help components receive `HelpProps` with all relevant data:

```typescript
interface HelpProps {
  app: HelpAppInfo;           // App metadata
  command?: HelpCommandInfo;  // Current command info
  route?: HelpRouteInfo;      // Current route info
  args: ParsedArgs;           // Parsed arguments
  metadata: ComponentMetadata; // Component metadata
}
```

## Navigation

### useNavigate Hook

Navigate programmatically:

```tsx
import { useNavigate } from 'react-console/cli';

function MyComponent() {
  const navigate = useNavigate();
  
  // Navigate to command
  navigate('build', {
    params: { target: 'production' },
    options: { minify: true },
  });
  
  // Navigate to route
  navigate('/settings', {
    params: { tab: 'general' },
  });
  
  // Navigate with path-based command
  navigate('/build/dev', {
    options: { verbose: true },
    carryOver: true, // Carry over current params/options
  });
}
```

## Examples

See the `examples/cli/` directory for complete examples:

- `basic-cli.tsx` - Simple CLI with commands
- `nested-commands.tsx` - Nested commands (subcommands)
- `commands-with-params.tsx` - Commands with parameters and options
- `routes-only.tsx` - Routes-only application
- `mixed-mode.tsx` - Mixing commands and routes
- `single-component.tsx` - Single component (no routing)
- `path-based-commands.tsx` - Commands with path prop
- `help-customization.tsx` - Custom help components

## Best Practices

1. **Use Default components** for fallback behavior
2. **Provide descriptions** for better help generation
3. **Use aliases** for common commands
4. **Validate parameters** using the validation system
5. **Customize help** for complex commands
6. **Use path-based commands** when you need both CLI and programmatic access

## Advanced Features

- **Middleware** - Pre-execution hooks for commands
- **Lifecycle Hooks** - Before/after execution hooks
- **Route Guards** - Prevent navigation to certain routes
- **Route Redirects** - Auto-redirect functionality
- **Command History** - Track command history in interactive mode
- **Tab Completion** - Generate completion scripts
- **Configuration System** - Manage app configuration

See the [CLI API Documentation](./CLI_API.md) for more details.
