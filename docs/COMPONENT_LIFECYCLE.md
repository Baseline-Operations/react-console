# Component Lifecycle

This document describes the component lifecycle in React Console, from React component creation to terminal output.

## Overview

React Console components follow a lifecycle similar to React web components, but adapted for terminal rendering. The lifecycle includes creation, mounting, updates, and unmounting phases.

## Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Component (JSX)                        │
│  <Text>Hello</Text>                                              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              React Reconciler                                    │
│  - Component instantiation                                      │
│  - Props/state management                                        │
│  - Lifecycle hooks                                              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Host Config (createInstance)                        │
│  - Creates ConsoleNode from React element                       │
│  - Initializes node properties                                  │
│  - Sets up event handlers                                       │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              ConsoleNode Tree                                    │
│  {                                                               │
│    type: 'text',                                                 │
│    content: 'Hello',                                             │
│    style: { ... },                                               │
│    children: []                                                  │
│  }                                                               │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Layout Calculation                                  │
│  - Calculates dimensions                                        │
│  - Resolves responsive sizes                                    │
│  - Applies styles                                               │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Node Rendering                                      │
│  - Renders to output buffer                                     │
│  - Generates ANSI codes                                        │
│  - Handles borders, padding, etc.                              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              Terminal Output                                     │
│  - Flushes buffer to stdout                                     │
│  - Updates terminal display                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Lifecycle Phases

### 1. Creation Phase

**Trigger:** Component first rendered

**Process:**
1. React creates element from JSX
2. Reconciler calls `createInstance()`
3. Host config creates ConsoleNode
4. Node added to tree

**Example:**
```tsx
// JSX
<Text>Hello</Text>

// ConsoleNode created
{
  type: 'text',
  content: 'Hello',
  style: {},
  children: []
}
```

### 2. Mounting Phase

**Trigger:** Component added to tree

**Process:**
1. `appendChild()` called
2. Node added to parent's children
3. Component bounds registered
4. Initial render triggered

**Example:**
```tsx
<View>
  <Text>Hello</Text>  // Mounted here
</View>
```

### 3. Update Phase

**Trigger:** Props or state change

**Process:**
1. Reconciler detects change
2. `commitUpdate()` called
3. Node properties updated
4. Layout recalculated
5. Re-render triggered

**Example:**
```tsx
const [color, setColor] = useState('red');

<Text color={color}>Hello</Text>  // Updates when color changes
```

### 4. Unmounting Phase

**Trigger:** Component removed from tree

**Process:**
1. `removeChild()` called
2. Node removed from parent
3. Component bounds unregistered
4. Cleanup performed

**Example:**
```tsx
{show && <Text>Hello</Text>}  // Unmounted when show becomes false
```

## React Hooks Integration

### useState

**Lifecycle:**
```
Initial Render → useState(initial) → State Created → Re-render on setState
```

**Example:**
```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return <Text>Count: {count}</Text>;
}
```

### useEffect

**Lifecycle:**
```
Mount → useEffect runs → Cleanup on unmount
```

**Example:**
```tsx
function Timer() {
  useEffect(() => {
    const timer = setInterval(() => {
      // Update state
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup
  }, []);
  
  return <Text>Timer</Text>;
}
```

### useLayoutEffect

**Lifecycle:**
```
Mount → useLayoutEffect runs (synchronously) → DOM update → Paint
```

**Note:** In React Console, `useLayoutEffect` runs before layout calculation, useful for measurements.

## Component-Specific Lifecycles

### Interactive Components (Input, Button)

**Lifecycle:**
```
Creation → Mount → Focus Management → Input Handling → Updates → Unmount
```

**Phases:**
1. **Creation:** Component created with initial state
2. **Mount:** Added to focusable components list
3. **Focus Management:** Tab index assigned, focus handlers registered
4. **Input Handling:** Keyboard/mouse events connected
5. **Updates:** State changes trigger re-renders
6. **Unmount:** Removed from focusable list, handlers cleaned up

### Selection Components (Radio, Checkbox, Dropdown, List)

**Lifecycle:**
```
Creation → Mount → Options Setup → Selection State → Updates → Unmount
```

**Phases:**
1. **Creation:** Component created with options
2. **Mount:** Options validated, default selection set
3. **Options Setup:** Options rendered, selection state initialized
4. **Selection State:** User interactions update selection
5. **Updates:** Selection changes trigger onChange callbacks
6. **Unmount:** Selection state cleaned up

### Layout Components (Scrollable, Overlay)

**Lifecycle:**
```
Creation → Mount → Layout Calculation → Scroll/Overlay Setup → Updates → Unmount
```

**Phases:**
1. **Creation:** Component created with dimensions
2. **Mount:** Added to layout tree
3. **Layout Calculation:** Dimensions calculated, scroll area determined
4. **Scroll/Overlay Setup:** Scroll handlers or overlay z-index set
5. **Updates:** Content changes trigger scroll recalculation
6. **Unmount:** Scroll state cleaned up, overlay removed

## Event Handler Lifecycle

### Keyboard Events

**Flow:**
```
Key Press → Input Parser → Event Object → Component Handler → State Update → Re-render
```

**Example:**
```tsx
<Input
  onKeyDown={(e) => {
    if (e.key.return) {
      handleSubmit();  // Triggers state update
    }
  }}
/>
```

### Mouse Events

**Flow:**
```
Mouse Click → Mouse Parser → Event Object → Component Handler → State Update → Re-render
```

**Example:**
```tsx
<Button
  onClick={(e) => {
    handleClick();  // Triggers state update
  }}
/>
```

### Focus Events

**Flow:**
```
Focus Change → Focus Manager → Component Handlers → State Update → Re-render
```

**Example:**
```tsx
<Input
  onFocus={() => {
    setIsFocused(true);  // Triggers re-render with focus style
  }}
  onBlur={() => {
    setIsFocused(false);
  }}
/>
```

## Update Triggers

### Props Change

**Trigger:** Parent component updates props

**Process:**
1. Reconciler detects prop change
2. `commitUpdate()` called
3. Node properties updated
4. Layout recalculated if needed
5. Re-render triggered

**Example:**
```tsx
function Parent() {
  const [color, setColor] = useState('red');
  
  return <Text color={color}>Hello</Text>;  // Updates when color changes
}
```

### State Change

**Trigger:** Component's own state updates

**Process:**
1. `setState()` called
2. Reconciler detects state change
3. Component re-renders
4. `commitUpdate()` called
5. Layout recalculated if needed
6. Re-render triggered

**Example:**
```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return <Text>Count: {count}</Text>;  // Updates when count changes
}
```

### Context Change

**Trigger:** Context value updates

**Process:**
1. Context provider updates value
2. Consuming components re-render
3. `commitUpdate()` called for affected nodes
4. Layout recalculated if needed
5. Re-render triggered

**Example:**
```tsx
const ThemeContext = createContext('light');

function ThemedText() {
  const theme = useContext(ThemeContext);
  return <Text style={{ color: theme === 'dark' ? 'white' : 'black' }}>Hello</Text>;
}
```

## Performance Considerations

### Memoization

**Purpose:** Prevent unnecessary re-renders

**Methods:**
- `React.memo()` - Memoize component
- `useMemo()` - Memoize computed values
- `useCallback()` - Memoize callbacks

**Example:**
```tsx
const MemoizedText = memo(({ text }) => {
  return <Text>{text}</Text>;
});
```

### Batching

**Purpose:** Batch multiple updates

**Behavior:**
- Multiple `setState()` calls batched
- Single re-render for batch
- Reduces render cycles

**Example:**
```tsx
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  
  const handleClick = () => {
    setA(1);  // Batched
    setB(2);  // Batched
    // Single re-render
  };
}
```

### Lazy Evaluation

**Purpose:** Defer expensive operations

**Methods:**
- Conditional rendering
- `useMemo()` for expensive calculations
- `React.lazy()` for code splitting

**Example:**
```tsx
function App() {
  const [show, setShow] = useState(false);
  
  return (
    <View>
      {show && <ExpensiveComponent />}  // Only rendered when show is true
    </View>
  );
}
```

## Summary

React Console components follow a React-like lifecycle:

1. **Creation:** Component created from JSX
2. **Mounting:** Added to component tree
3. **Updates:** Props/state changes trigger updates
4. **Unmounting:** Removed from tree with cleanup

The lifecycle is managed by:
- **React Reconciler:** Component lifecycle management
- **Host Config:** ConsoleNode creation and updates
- **Layout System:** Layout calculation and rendering
- **Event System:** Input handling and event propagation

Understanding the lifecycle helps with:
- Performance optimization
- State management
- Event handling
- Memory management
- Debugging
