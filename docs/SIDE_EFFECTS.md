# Side-Effect Analysis

This document identifies which imports have side effects and which are side-effect free, helping bundlers optimize tree-shaking.

## Side-Effect Free Imports

Most imports in React Console are **side-effect free** and can be safely tree-shaken:

### Type-Only Imports
All type-only imports are side-effect free:
```typescript
import type { TextProps } from 'react-console';
import type { CommandRouterProps } from 'react-console/cli';
```

### Pure Function Imports
These modules export only pure functions (no side effects):
- `react-console/cli` - CLI utilities (parser, validator, etc.)
- `react-console/router` - Router utilities
- `react-console/selection` - Selection components
- `react-console/layout` - Layout components
- `react-console/animations` - Animation utilities
- `react-console/theme` - Theme utilities (pure functions)
- `react-console/storage` - Storage utilities (pure functions)
- `react-console/hooks` - React hooks (side-effect free when imported)

### Component Imports
Component imports are side-effect free:
```typescript
import { Text, Box, View } from 'react-console';
import { CommandRouter, Command, Route } from 'react-console/cli';
```

## Imports with Side Effects

### Main Renderer (`react-console` or `react-console/renderer`)

**Side Effects:**
- Initializes global terminal state (`terminal` object)
- Sets up process listeners (SIGINT, SIGTERM)
- Registers global event handlers

**When Imported:**
```typescript
import { render } from 'react-console';
// Side effect: terminal object initialized, process listeners set up
```

**Note:** The side effects occur when the module is first imported, not when `render()` is called.

### Global Terminal (`react-console/utils/globalTerminal`)

**Side Effects:**
- Creates singleton `terminal` instance
- Attaches `terminal` to `globalThis`
- Initializes terminal dimensions

**When Imported:**
```typescript
import { terminal } from 'react-console';
// Side effect: terminal object created and attached to globalThis
```

### Storage Initialization (`react-console/storage`)

**Side Effects:**
- Initializes storage backend (localStorage/Node.js fs)
- Sets up storage event listeners (if applicable)

**When Imported:**
```typescript
import { useStorage, getStorage } from 'react-console/storage';
// Side effect: storage backend initialized
```

**Note:** Storage initialization is lazy - side effects occur on first use, not on import.

### CLI App Component (`react-console/cli` - CLIApp)

**Side Effects:**
- Registers global CLI app metadata
- Sets up process.argv parsing
- Initializes CLI configuration

**When Imported:**
```typescript
import { CLIApp } from 'react-console/cli';
// Side effect: CLI app metadata registered globally
```

**Note:** Side effects occur when CLIApp component is rendered, not on import.

## Best Practices for Tree-Shaking

### 1. Use Subpath Imports
Import only what you need from subpaths:
```typescript
// ✅ Good - tree-shakeable
import { Text, Box } from 'react-console';
import { CommandRouter } from 'react-console/cli';
import { useStorage } from 'react-console/storage';

// ❌ Avoid - pulls in entire library
import * as ReactConsole from 'react-console';
```

### 2. Use Type-Only Imports
Use `import type` for types to ensure they're tree-shaken:
```typescript
// ✅ Good - types are tree-shaken
import type { TextProps } from 'react-console';

// ⚠️ Less optimal - types may not be tree-shaken
import { type TextProps } from 'react-console';
```

### 3. Lazy Load Side-Effect Modules
If you need side-effect modules, import them only when needed:
```typescript
// ✅ Good - lazy load renderer
async function initApp() {
  const { render } = await import('react-console');
  render(<App />);
}

// ⚠️ Less optimal - immediate side effects
import { render } from 'react-console';
render(<App />);
```

### 4. Use Feature-Based Imports
Import from feature subpaths to minimize bundle size:
```typescript
// ✅ Good - only CLI utilities
import { parseCommandLineArgs } from 'react-console/cli';

// ❌ Avoid - pulls in entire library
import { parseCommandLineArgs } from 'react-console';
```

## Bundler Configuration

### Webpack
Add to `webpack.config.js`:
```javascript
module.exports = {
  optimization: {
    sideEffects: [
      // Mark side-effect modules
      'react-console/dist/renderer/render.js',
      'react-console/dist/utils/globalTerminal.js',
    ],
  },
};
```

### Rollup
Add to `rollup.config.js`:
```javascript
export default {
  treeshake: {
    moduleSideEffects: (id) => {
      // Mark side-effect modules
      if (id.includes('renderer/render') || id.includes('globalTerminal')) {
        return true;
      }
      return false;
    },
  },
};
```

### esbuild
Side-effect detection is automatic. No configuration needed.

## Summary

| Module | Side Effects | Tree-Shakeable |
|--------|--------------|----------------|
| `react-console` (main) | ✅ Yes (renderer init) | ✅ Yes (subpath imports) |
| `react-console/cli` | ❌ No | ✅ Yes |
| `react-console/router` | ❌ No | ✅ Yes |
| `react-console/selection` | ❌ No | ✅ Yes |
| `react-console/layout` | ❌ No | ✅ Yes |
| `react-console/animations` | ❌ No | ✅ Yes |
| `react-console/theme` | ❌ No | ✅ Yes |
| `react-console/storage` | ⚠️ Lazy (on first use) | ✅ Yes |
| `react-console/hooks` | ❌ No | ✅ Yes |

**Key Takeaway:** Most imports are side-effect free. Only the main renderer and global terminal have immediate side effects. Use subpath imports to maximize tree-shaking.
