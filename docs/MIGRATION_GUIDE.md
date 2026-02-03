# Migration Guide

This guide helps you migrate from other terminal UI libraries to React Console, with a focus on migrating from Ink.

## Overview

React Console is a React renderer for terminal UIs, similar to Ink but with some key differences:

- **React 19+ Support**: Full support for React 19 features including hooks, concurrent features, and React Compiler
- **Custom Renderer**: Built on `react-reconciler` for full React compatibility
- **Component API**: React Native-like component API (`View`, `Text`, `Box`, etc.)
- **Event System**: JSX-style event handlers (`onClick`, `onChange`, `onKeyDown`)
- **Layout System**: Flexbox and Grid layout support
- **Focus Management**: Built-in focus management with tab navigation

## Migrating from Ink

### 1. Installation

**Ink:**

```bash
npm install ink react
```

**React Console:**

```bash
npm install react-console react
```

### 2. Basic Setup

**Ink:**

```tsx
import React from 'react';
import { render, Text, Box } from 'ink';

function App() {
  return (
    <Box>
      <Text>Hello World</Text>
    </Box>
  );
}

render(<App />);
```

**React Console:**

```tsx
import React from 'react';
import { render, Text, View } from 'react-console';

function App() {
  return (
    <View>
      <Text>Hello World</Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
```

**Key Differences:**

- `Box` → `View` (or `Box` - both work)
- `render()` requires `mode` option for interactive apps
- Import from `react-console` instead of `ink`

### 3. Text Rendering

**Ink:**

```tsx
import { Text } from 'ink';

<Text color="green" bold>Success!</Text>
<Text>
  Normal text <Text color="red">red text</Text> more normal
</Text>
```

**React Console:**

```tsx
import { Text } from 'react-console';

<Text color="green" bold>Success!</Text>
<Text>
  Normal text <Text color="red">red text</Text> more normal
</Text>
```

**Notes:**

- Text API is very similar
- Nested Text for inline styling works the same
- Color names are compatible

### 4. Layout Components

**Ink:**

```tsx
import { Box } from 'ink';

<Box flexDirection="row" justifyContent="space-between">
  <Text>Left</Text>
  <Text>Right</Text>
</Box>;
```

**React Console:**

```tsx
import { View } from 'react-console';

<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>;
```

**Key Differences:**

- Use `style` prop for layout properties (React Native pattern)
- `Box` is also available (alias for `View`)
- Flexbox properties work the same

### 5. Input Handling

**Ink:**

```tsx
import { useInput } from 'ink';

function App() {
  useInput((input, key) => {
    if (key.return) {
      // Handle Enter
    }
  });

  return <Text>Press keys</Text>;
}
```

**React Console:**

```tsx
import { View, Text } from 'react-console';

function App() {
  return (
    <View
      onKeyDown={(e) => {
        if (e.key.return) {
          // Handle Enter
        }
      }}
    >
      <Text>Press keys</Text>
    </View>
  );
}
```

**Key Differences:**

- Use JSX event handlers instead of hooks
- Event objects are similar but use `e.key` instead of separate `key` parameter
- Event handlers work on any component

### 6. Focus Management

**Ink:**

```tsx
import { useFocus } from 'ink';

function Button() {
  const { isFocused } = useFocus();
  return <Text>{isFocused ? '> ' : '  '}Button</Text>;
}
```

**React Console:**

```tsx
import { Button } from 'react-console';

function App() {
  return (
    <Button onFocus={() => console.log('Focused')} onBlur={() => console.log('Blurred')}>
      Button
    </Button>
  );
}
```

**Key Differences:**

- Built-in focus management (no hooks needed)
- Components automatically handle focus indicators
- Use `onFocus`/`onBlur` event handlers
- Tab navigation works automatically

### 7. User Input

**Ink:**

```tsx
import { TextInput } from 'ink-text-input';

function App() {
  const [value, setValue] = useState('');

  return <TextInput value={value} onChange={setValue} />;
}
```

**React Console:**

```tsx
import { TextInput } from 'react-console';

function App() {
  const [value, setValue] = useState('');

  return <TextInput value={value} onChangeText={setValue} />;
}
```

**Key Differences:**

- `TextInput` component is built-in with React Native-compatible API
- Uses `onChangeText` for simple string callback (similar to React Native)
- Also supports `onChange` with event object for more detailed info
- Supports validation, formatting, multiline (`numberOfLines`), and more

### 8. Styling

**Ink:**

```tsx
<Box borderStyle="single" borderColor="green" padding={1}>
  <Text>Content</Text>
</Box>
```

**React Console:**

```tsx
<View
  style={{
    border: 'single',
    borderColor: 'green',
    padding: 1,
  }}
>
  <Text>Content</Text>
</View>
```

**Key Differences:**

- Use `style` prop (React Native pattern)
- Style properties are the same
- Supports CSS-like styling with StyleSheet API

### 9. Render Options

**Ink:**

```tsx
render(<App />, {
  stdout: process.stdout,
  stdin: process.stdin,
  exitOnCtrlC: true,
  patchConsole: true,
});
```

**React Console:**

```tsx
render(<App />, {
  mode: 'interactive', // 'static' | 'interactive' | 'fullscreen'
  fullscreen: false,
  onUpdate: () => {},
});
```

**Key Differences:**

- Different options API
- `mode` controls rendering behavior
- No `stdout`/`stdin` options (uses process streams automatically)
- No `exitOnCtrlC` (handled automatically, can be prevented)

### 10. Hooks

**Ink Hooks:**

- `useInput` - Keyboard input
- `useFocus` - Focus management
- `useFocusManager` - Focus control
- `useApp` - App instance
- `useStdin` - stdin stream
- `useStdout` - stdout stream

**React Console Hooks:**

- `useTerminalDimensions` - Terminal size
- `useFocus` - Focus management
- `useInputState` - Input value state
- `useSelection` - Selection component state
- `useTerminalConfig` - Terminal capabilities
- `useTheme` - Theme access
- `useStorage` - Persistent storage

**Migration:**

- Replace `useInput` with `onKeyDown` event handlers
- Replace `useFocus` with `onFocus`/`onBlur` handlers or `useFocus` hook
- Use `useTerminalDimensions` instead of `useStdout` for terminal size
- Use `useTerminalConfig` for terminal capabilities

## Component Mapping

| Ink           | React Console                | Notes                                 |
| ------------- | ---------------------------- | ------------------------------------- |
| `<Box>`       | `<View>` or `<Box>`          | Both work, `View` is preferred        |
| `<Text>`      | `<Text>`                     | Same API                              |
| `<TextInput>` | `<TextInput>`                | Built-in, React Native-compatible API |
| `<Static>`    | `<Scrollable>`               | Scrollable container                  |
| `<Transform>` | Not needed                   | Use style props directly              |
| `<Newline>`   | `<LineBreak>` or `<Newline>` | Both work                             |

## Event Handling Migration

**Ink Pattern:**

```tsx
useInput((input, key) => {
  if (key.return) {
    handleSubmit();
  }
});
```

**React Console Pattern:**

```tsx
<View
  onKeyDown={(e) => {
    if (e.key.return) {
      handleSubmit();
    }
  }}
>
  {/* Content */}
</View>
```

## Layout Migration

**Ink:**

```tsx
<Box flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</Box>
```

**React Console:**

```tsx
<View
  style={{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
  }}
>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

## Common Patterns

### 1. Conditional Rendering

**Both libraries:**

```tsx
{
  condition && <Text>Visible</Text>;
}
{
  condition ? <Text>True</Text> : <Text>False</Text>;
}
```

### 2. Lists

**Ink:**

```tsx
{
  items.map((item) => <Text key={item.id}>{item.name}</Text>);
}
```

**React Console:**

```tsx
{
  items.map((item) => <Text key={item.id}>{item.name}</Text>);
}
```

### 3. State Management

**Both libraries:**

```tsx
const [state, setState] = useState(initial);
```

## Migration Checklist

- [ ] Replace `ink` import with `react-console`
- [ ] Replace `Box` with `View` (or keep `Box`)
- [ ] Move layout props to `style` prop
- [ ] Replace `useInput` with `onKeyDown` handlers
- [ ] Replace `useFocus` with `onFocus`/`onBlur` handlers
- [ ] Update `render()` call with `mode` option
- [ ] Replace `Input` with `TextInput` component
- [ ] Update event handler signatures (use event objects)
- [ ] Test focus management (tab navigation)
- [ ] Test input handling (keyboard events)
- [ ] Test layout rendering (flexbox/grid)

## Benefits of React Console

1. **React 19+ Support**: Full support for latest React features
2. **Better Type Safety**: Comprehensive TypeScript types
3. **Built-in Components**: Input, Button, Radio, Checkbox, Dropdown, List
4. **Event System**: JSX-style event handlers
5. **Layout System**: Flexbox and Grid support
6. **Focus Management**: Automatic tab navigation
7. **Theme System**: Built-in theming support
8. **Storage**: Persistent storage hooks
9. **Error Handling**: Error boundaries and error reporting
10. **Performance**: Optimized rendering

## Getting Help

- Check the [Architecture Guide](./ARCHITECTURE_GUIDE.md) for system overview
- Review [Event Handling Guide](./EVENT_HANDLING_GUIDE.md) for event patterns
- See [Styling Guide](./STYLING_GUIDE.md) for styling options
- Read [Layout Guide](./LAYOUT_GUIDE.md) for layout system
- Consult [Input Handling Guide](./INPUT_HANDLING_GUIDE.md) for input components

## Examples

See the `examples/` directory for complete examples:

- `examples/basic.tsx` - Basic usage
- `examples/forms.tsx` - Form handling
- `examples/input-types.tsx` - Input types
- `examples/selection.tsx` - Selection components
- `examples/layout.tsx` - Layout examples
