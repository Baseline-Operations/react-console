# State Management Patterns and Best Practices

This document describes the state management patterns and best practices for React Console applications.

## Overview

React Console provides several state management patterns:
- **Component State**: React hooks (`useState`, `useReducer`) for component-local state
- **Terminal-Specific Hooks**: Custom hooks for terminal-specific state (dimensions, focus, input, selection)
- **Context**: React Context for shared state across components
- **Storage**: Persistent storage hooks for state that survives component unmounts
- **React 19 Hooks**: Advanced hooks for optimistic updates, action state, and async operations

## Component State

### Basic State with `useState`

Use `useState` for component-local state that doesn't need to be shared:

```tsx
import { useState } from 'react';
import { View, Text, Button } from 'react-console';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <View>
      <Text>Count: {count}</Text>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
    </View>
  );
}
```

### Complex State with `useReducer`

Use `useReducer` for state with complex update logic:

```tsx
import { useReducer } from 'react';
import { View, Text, Button } from 'react-console';

type State = { count: number; step: number };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'reset':
      return { ...state, count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });
  
  return (
    <View>
      <Text>Count: {state.count}</Text>
      <Button onClick={() => dispatch({ type: 'increment' })}>+</Button>
      <Button onClick={() => dispatch({ type: 'decrement' })}>-</Button>
      <Button onClick={() => dispatch({ type: 'reset' })}>Reset</Button>
    </View>
  );
}
```

## Terminal-Specific State Hooks

### Terminal Dimensions

Use `useTerminalDimensions()` for reactive terminal size:

```tsx
import { useTerminalDimensions } from 'react-console/hooks';
import { View, Text } from 'react-console';

function ResponsiveComponent() {
  const { columns, rows } = useTerminalDimensions();
  
  return (
    <View>
      <Text>Terminal size: {columns}x{rows}</Text>
    </View>
  );
}
```

**Best Practices**:
- Use for responsive layouts that adapt to terminal size
- Automatically updates on terminal resize
- Access via Context: `useTerminalDimensionsContext()` for context-based access

### Focus Management

Use `useFocus()` for component focus state:

```tsx
import { useFocus } from 'react-console/hooks';
import { View, Input, Button } from 'react-console';

function Form() {
  const { focusedComponent, focus, blur } = useFocus();
  
  return (
    <View>
      <Input
        ref={(node) => {
          if (focusedComponent === node) {
            // Component is focused
          }
        }}
      />
      <Button onClick={() => focus(inputRef)}>Focus Input</Button>
    </View>
  );
}
```

**Best Practices**:
- Use for programmatic focus management
- Access via Context: `useFocusContext()` for context-based access
- Focus is automatically managed by the renderer for interactive components

### Input State

Use `useInputState()` for input value and cursor position:

```tsx
import { useInputState } from 'react-console/hooks';
import { View, Input } from 'react-console';

function InputComponent() {
  const [inputNode, setInputNode] = useState(null);
  const { value, cursorPosition, setValue, setCursorPosition } = useInputState(inputNode);
  
  return (
    <View>
      <Input
        ref={setInputNode}
        value={value}
        onChange={(e) => setValue(e.value)}
      />
      <Text>Cursor at: {cursorPosition}</Text>
    </View>
  );
}
```

**Best Practices**:
- Use when you need to programmatically control input state
- Most components handle input state internally - only use this hook for advanced cases

### Selection State

Use `useSelection()` for selection components (Radio, Checkbox, Dropdown, List):

```tsx
import { useSelection } from 'react-console/hooks';
import { View, Radio } from 'react-console';

function SelectionComponent() {
  const [radioNode, setRadioNode] = useState(null);
  const { selected, select, isOpen, open, close } = useSelection(radioNode);
  
  return (
    <View>
      <Radio
        ref={setRadioNode}
        options={['Option 1', 'Option 2', 'Option 3']}
        value={selected}
        onChange={(e) => select(e.value)}
      />
      <Text>Selected: {selected}</Text>
    </View>
  );
}
```

**Best Practices**:
- Use for programmatic control of selection components
- Most components handle selection state internally - only use this hook for advanced cases

### Terminal Configuration

Use `useTerminalConfig()` for terminal capabilities:

```tsx
import { useTerminalConfig } from 'react-console/hooks';
import { View, Text } from 'react-console';

function TerminalInfo() {
  const { supportsColor, supportsMouse, dimensions } = useTerminalConfig();
  
  return (
    <View>
      <Text>Color support: {supportsColor ? 'Yes' : 'No'}</Text>
      <Text>Mouse support: {supportsMouse ? 'Yes' : 'No'}</Text>
      <Text>Size: {dimensions.columns}x{dimensions.rows}</Text>
    </View>
  );
}
```

## Context-Based State

### Theme Context

Use `ThemeProvider` and `useTheme()` for theme state:

```tsx
import { ThemeProvider, useTheme, View, Text } from 'react-console';
import { darkTheme } from 'react-console/theme';

function ThemedApp() {
  return (
    <ThemeProvider initialTheme={darkTheme}>
      <ThemedComponent />
    </ThemeProvider>
  );
}

function ThemedComponent() {
  const { theme, colors, setTheme } = useTheme();
  
  return (
    <View>
      <Text color={colors.text}>Themed text</Text>
      <Button onClick={() => setTheme(lightTheme)}>Switch Theme</Button>
    </View>
  );
}
```

**Best Practices**:
- Wrap your app with `ThemeProvider` at the root
- Use `useTheme()` or `useThemeColors()` to access theme
- Theme automatically syncs with renderer

## Persistent Storage

### Storage Hooks

Use `useStorage()` for state that persists across component unmounts:

```tsx
import { useStorage } from 'react-console/hooks';
import { View, Input, Text } from 'react-console';

function PersistentForm() {
  const [username, setUsername, removeUsername] = useStorage('username', 'guest');
  
  return (
    <View>
      <Text>Username: {username}</Text>
      <Input
        value={username}
        onChange={(e) => setUsername(e.value)}
      />
      <Button onClick={removeUsername}>Clear</Button>
    </View>
  );
}
```

**Best Practices**:
- Use for user preferences, settings, and data that should persist
- Storage is automatically namespaced per application
- Changes sync across all components using the same key
- Use `useStorageWithTTL()` for data with expiration

## React 19 Advanced Hooks

### Optimistic Updates

Use `useOptimisticTerminal()` for optimistic UI updates:

```tsx
import { useOptimisticTerminal } from 'react-console/hooks';
import { View, Button, Text } from 'react-console';
import { useState } from 'react';

function SaveButton() {
  const [data, setData] = useState('initial');
  const [optimisticData, addOptimisticUpdate] = useOptimisticTerminal(
    data,
    (current, update) => update
  );
  
  const handleSave = async () => {
    addOptimisticUpdate('saving...');
    try {
      await saveToStorage(data);
      setData('saved');
    } catch {
      // Optimistic update will revert on error
    }
  };
  
  return (
    <View>
      <Text>{optimisticData}</Text>
      <Button onClick={handleSave}>Save</Button>
    </View>
  );
}
```

**Best Practices**:
- Use for actions that may take time (network requests, file I/O)
- Provides immediate UI feedback
- Automatically reverts on error

### Action State

Use `useActionStateTerminal()` for form submissions and actions:

```tsx
import { useActionStateTerminal } from 'react-console/hooks';
import { View, Input, Button, Text } from 'react-console';

async function submitForm(prevState: { message: string }, formData: FormData) {
  const name = formData.get('name');
  if (!name) {
    return { message: 'Name is required' };
  }
  await saveToStorage(name);
  return { message: 'Saved successfully' };
}

function FormComponent() {
  const [state, formAction, isPending] = useActionStateTerminal(
    submitForm,
    { message: '' }
  );
  
  return (
    <View>
      <Text>{state.message}</Text>
      {isPending && <Text>Saving...</Text>}
      <Input name="name" />
      <Button onClick={() => formAction(new FormData())}>
        Submit
      </Button>
    </View>
  );
}
```

**Best Practices**:
- Use for form submissions and async actions
- Tracks pending state automatically
- Handles errors gracefully

### Async Operations

Use `useAsync()` for async data loading:

```tsx
import { useAsync } from 'react-console/hooks';
import { View, Text } from 'react-console';

async function loadData() {
  const response = await fetch('/api/data');
  return response.json();
}

function DataComponent() {
  const { data, error, isLoading } = useAsync(loadData);
  
  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;
  
  return (
    <View>
      <Text>Data: {JSON.stringify(data)}</Text>
    </View>
  );
}
```

**Best Practices**:
- Use for loading data from APIs or async operations
- Provides loading and error states
- Use `useAsyncWithFallback()` for fallback data

## State Management Patterns

### Pattern 1: Component-Local State

**When to use**: State that's only needed within a single component.

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  // ... component logic
}
```

### Pattern 2: Lifted State

**When to use**: State that needs to be shared between sibling components.

```tsx
function App() {
  const [value, setValue] = useState('');
  
  return (
    <View>
      <Input value={value} onChange={(e) => setValue(e.value)} />
      <Display value={value} />
    </View>
  );
}
```

### Pattern 3: Context for Global State

**When to use**: State that needs to be accessed by many components at different levels.

```tsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemedApp />
    </ThemeContext.Provider>
  );
}
```

### Pattern 4: Storage for Persistence

**When to use**: State that should persist across sessions.

```tsx
function Settings() {
  const [setting, setSetting] = useStorage('setting', 'default');
  // ... persists across app restarts
}
```

## Best Practices Summary

1. **Start with component-local state**: Use `useState` for state that doesn't need to be shared
2. **Lift state when needed**: Move state up to the nearest common ancestor when siblings need it
3. **Use Context sparingly**: Only for state that's truly global or deeply nested
4. **Use terminal-specific hooks**: For terminal dimensions, focus, and terminal capabilities
5. **Use storage hooks**: For data that should persist across sessions
6. **Use React 19 hooks**: For optimistic updates, action state, and async operations
7. **Avoid prop drilling**: Use Context or state management hooks instead
8. **Keep state minimal**: Only store what's necessary for rendering
9. **Derive state when possible**: Calculate derived values in render rather than storing them
10. **Use error boundaries**: Wrap components with `ErrorBoundary` to catch errors gracefully

## Common Patterns

### Form State Management

```tsx
function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  return (
    <View>
      <Input
        value={formData.name}
        onChange={(e) => handleChange('name', e.value)}
      />
      {errors.name && <Text color="red">{errors.name}</Text>}
    </View>
  );
}
```

### Modal/Dialog State

```tsx
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <View>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      {isModalOpen && (
        <Overlay>
          <View>
            <Text>Modal Content</Text>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </View>
        </Overlay>
      )}
    </View>
  );
}
```

### List State with Selection

```tsx
function ListComponent() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const toggleSelection = (item: string) => {
    setSelectedItems(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };
  
  return (
    <Checkbox
      options={['Item 1', 'Item 2', 'Item 3']}
      value={selectedItems}
      onChange={(e) => setSelectedItems(e.value as string[])}
    />
  );
}
```

## Migration Guide

### From Class Components

If migrating from class components:

1. Convert `this.state` to `useState` or `useReducer`
2. Convert lifecycle methods to `useEffect`
3. Convert `componentDidMount` to `useEffect(() => {}, [])`
4. Convert `componentDidUpdate` to `useEffect(() => {}, [deps])`
5. Convert `componentWillUnmount` to cleanup in `useEffect`

### From Redux

If migrating from Redux:

1. Replace Redux store with Context + `useReducer`
2. Replace `connect()` with `useContext()`
3. Replace actions with `dispatch()` calls
4. Use `useStorage()` for persistence instead of Redux persist

## Further Reading

- [React Hooks Documentation](https://react.dev/reference/react)
- [React 19 Features](https://react.dev/blog/2024/04/25/react-19)
- [State Management in React](https://react.dev/learn/managing-state)
