# Testing Guide

This document provides guidance for testing React Console applications and the library itself.

## Testing React Console Applications

### Unit Testing

React Console components can be tested like regular React components:

```tsx
import { render } from '@testing-library/react';
import { Text, View } from 'react-console';

test('renders text component', () => {
  const { getByText } = render(<Text>Hello</Text>);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

**Note:** You may need a custom renderer for terminal-specific testing. Consider mocking the renderer or using a test environment that simulates terminal output.

### Integration Testing

Test complete user flows:

```tsx
import { render } from 'react-console';
import { CLIApp, CommandRouter, Command } from 'react-console/cli';

test('CLI command execution', () => {
  let output = '';
  const originalLog = console.log;
  console.log = (msg) => { output += msg + '\n'; };
  
  render(
    <CLIApp name="test-app">
      <CommandRouter>
        <Command name="test">
          <Text>Test command executed</Text>
        </Command>
      </CommandRouter>
    </CLIApp>
  );
  
  expect(output).toContain('Test command executed');
  console.log = originalLog;
});
```

### E2E Testing

For end-to-end testing of CLI applications:

1. **Use process mocking:**
   ```tsx
   // Mock process.argv
   const originalArgv = process.argv;
   process.argv = ['node', 'app.js', 'build', '--verbose'];
   
   // Run app
   render(<App />);
   
   // Restore
   process.argv = originalArgv;
   ```

2. **Capture stdout:**
   ```tsx
   let output = '';
   const originalWrite = process.stdout.write;
   process.stdout.write = (chunk: any) => {
     output += chunk.toString();
     return true;
   };
   
   render(<App />);
   
   // Assert output
   expect(output).toContain('Expected text');
   
   process.stdout.write = originalWrite;
   ```

## Testing the Library

### Tree-Shaking Verification

Test that tree-shaking works correctly with different bundlers:

#### esbuild

```bash
# Create test file
echo "import { Text } from 'react-console'; console.log(Text);" > test-tree-shake.mjs

# Build with esbuild
npx esbuild test-tree-shake.mjs --bundle --format=esm --outfile=test-output.mjs

# Check output size
wc -c test-output.mjs
```

**Expected:** Only Text component and its dependencies should be included.

#### Webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: false,
  },
  entry: './test-entry.js',
  output: {
    filename: 'bundle.js',
  },
};
```

```bash
# Build
npx webpack

# Analyze bundle
npx webpack-bundle-analyzer dist/bundle.js
```

#### Rollup

```javascript
// rollup.config.js
export default {
  input: 'test-entry.js',
  output: {
    file: 'bundle.js',
    format: 'es',
  },
  treeshake: {
    moduleSideEffects: false,
  },
};
```

```bash
# Build
npx rollup -c

# Check bundle size
wc -c bundle.js
```

### npm Command Registry Testing

Test the `create-react-console-app` command locally:

#### 1. Build the Package

```bash
npm run build
```

#### 2. Link Locally

```bash
# From react-console directory
npm link

# In a test directory
npm link react-console
```

#### 3. Test the Command

```bash
# Test with npx (local)
npx -y react-console@file:./path/to/react-console create-react-console-app test-app

# Or if linked globally
create-react-console-app test-app
```

#### 4. Verify Output

```bash
cd test-app
ls -la  # Should see generated files
cat package.json  # Should have react-console dependency
```

### Performance Testing

#### Renderer Performance

Test with large component trees:

```tsx
function LargeTree({ depth, width }: { depth: number; width: number }) {
  if (depth === 0) return <Text>Leaf</Text>;
  
  return (
    <View>
      {Array(width).fill(0).map((_, i) => (
        <LargeTree key={i} depth={depth - 1} width={width} />
      ))}
    </View>
  );
}

// Test performance
const start = performance.now();
render(<LargeTree depth={5} width={10} />);
const end = performance.now();
console.log(`Render time: ${end - start}ms`);
```

#### Memory Profiling

Use Node.js memory profiling:

```bash
# Run with memory profiling
node --inspect-brk your-app.js

# Or use heap snapshots
node --heapsnapshot-signal=SIGUSR2 your-app.js
```

### Edge Case Testing

#### Terminal Edge Cases

1. **Very Small Terminal:**
   ```tsx
   // Mock small terminal
   process.stdout.columns = 10;
   process.stdout.rows = 5;
   
   render(<App />);
   ```

2. **Very Large Terminal:**
   ```tsx
   process.stdout.columns = 1000;
   process.stdout.rows = 1000;
   
   render(<App />);
   ```

3. **No TTY:**
   ```tsx
   // Simulate non-TTY
   const originalIsTTY = process.stdout.isTTY;
   process.stdout.isTTY = false;
   
   render(<App />);
   
   process.stdout.isTTY = originalIsTTY;
   ```

#### Input Edge Cases

1. **Very Long Input:**
   ```tsx
   const longText = 'a'.repeat(10000);
   <Input value={longText} onChange={handleChange} />
   ```

2. **Special Characters:**
   ```tsx
   <Input value="测试 🎉 \n\t" onChange={handleChange} />
   ```

3. **Rapid Input:**
   ```tsx
   // Simulate rapid key presses
   for (let i = 0; i < 100; i++) {
     simulateKeyPress('a');
   }
   ```

#### Error Scenarios

1. **Invalid Props:**
   ```tsx
   // Should handle gracefully
   <Text color="invalid-color">Test</Text>
   <View width="invalid-size">Test</View>
   ```

2. **Missing Required Props:**
   ```tsx
   // Should provide defaults or error clearly
   <Input /> // No value, no onChange
   ```

3. **Circular References:**
   ```tsx
   // Should not crash
   const circular: any = {};
   circular.self = circular;
   <Text>{circular}</Text>
   ```

## Test Checklist

### Library Tests

- [ ] **Tree-shaking works** with esbuild, webpack, and rollup
- [ ] **Type-only imports** are properly tree-shaken
- [ ] **Side-effect free imports** don't pull in unnecessary code
- [ ] **Subpath imports** work correctly (`react-console/cli`, etc.)

### CLI Command Registry

- [ ] **Build includes** `create-app.js` in dist
- [ ] **Shebang is preserved** in compiled output
- [ ] **npm link works** locally
- [ ] **Command executes** correctly when linked
- [ ] **Generated project** has correct structure
- [ ] **Generated project** can be built and run

### Component Tests

- [ ] **All components render** without errors
- [ ] **Event handlers fire** correctly
- [ ] **State updates** trigger re-renders
- [ ] **Focus management** works (Tab navigation)
- [ ] **Mouse events** work (if terminal supports)

### Integration Tests

- [ ] **CLI app** parses arguments correctly
- [ ] **Command routing** works (Command, Route, Default)
- [ ] **Parameter validation** works
- [ ] **Middleware** executes correctly
- [ ] **Lifecycle hooks** fire at correct times
- [ ] **Help system** displays correctly

### Performance Tests

- [ ] **Large component trees** render in reasonable time (< 1s for 1000 nodes)
- [ ] **Memory usage** is reasonable (no leaks)
- [ ] **Re-renders** are efficient (only changed nodes)
- [ ] **Layout calculations** are memoized correctly

### Edge Case Tests

- [ ] **Small terminal** (10x5) handles gracefully
- [ ] **Large terminal** (1000x1000) handles correctly
- [ ] **No TTY** falls back gracefully
- [ ] **Very long text** wraps/truncates correctly
- [ ] **Special characters** render correctly
- [ ] **Invalid props** error clearly
- [ ] **Missing props** use defaults

## Test Tools

### Recommended Testing Libraries

- **Vitest** - Fast unit testing (already configured)
- **@testing-library/react** - Component testing
- **tsx** - TypeScript execution for E2E tests

### Performance Tools

- **Node.js Inspector** - Memory profiling
- **clinic.js** - Performance profiling
- **0x** - Flamegraph generation

### Bundle Analysis

- **webpack-bundle-analyzer** - Webpack bundle analysis
- **rollup-plugin-visualizer** - Rollup bundle analysis
- **esbuild-bundle-analyzer** - esbuild analysis (if available)

## Continuous Integration

### CI Test Setup

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npm run lint
```

## Summary

Testing React Console involves:

1. **Unit Testing** - Component behavior
2. **Integration Testing** - Complete flows
3. **E2E Testing** - Full application scenarios
4. **Performance Testing** - Render speed and memory
5. **Edge Case Testing** - Boundary conditions
6. **Bundle Testing** - Tree-shaking verification

Focus on testing:
- Component rendering and updates
- Event handling (keyboard, mouse)
- CLI argument parsing and routing
- Layout calculations
- Terminal edge cases
- Bundle size and tree-shaking
