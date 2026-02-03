# Event Handling Guide

This guide covers all aspects of event handling in React Console, including keyboard events, mouse events, focus management, and event propagation.

## Overview

React Console provides a comprehensive event system with:

- **Keyboard Events**: Key presses, shortcuts, navigation
- **Mouse Events**: Clicks, drags, movement
- **Input Events**: Value changes, form submission
- **Focus Events**: Focus and blur handling
- **Event Propagation**: preventDefault and stopPropagation support

## Event Types

### Keyboard Events

Keyboard events are triggered when keys are pressed:

```tsx
import { Button, TextInput } from 'react-console';

function KeyboardExample() {
  return (
    <Button
      onKeyDown={(e) => {
        if (e.key.return) {
          console.log('Enter pressed');
        } else if (e.key.escape) {
          console.log('Escape pressed');
        } else if (e.key.ctrl && e.key.char === 's') {
          e.preventDefault(); // Prevent default behavior
          console.log('Ctrl+S pressed');
        }
      }}
    >
      Press Keys
    </Button>
  );
}
```

### Mouse Events

Mouse events are triggered on clicks and movement:

```tsx
import { Button, View } from 'react-console';

function MouseExample() {
  return (
    <Button
      onClick={(e) => {
        console.log(`Clicked at (${e.x}, ${e.y})`);
      }}
      onMouseDown={(e) => {
        console.log('Mouse down');
      }}
      onMouseUp={(e) => {
        console.log('Mouse up');
      }}
    >
      Click Me
    </Button>
  );
}
```

### Input Events

Input events are triggered when input values change:

```tsx
import { TextInput } from 'react-console';

function InputExample() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      value={value}
      onChangeText={(text) => {
        console.log('Value changed:', text);
        setValue(text);
      }}
      onSubmitEditing={(e) => {
        console.log('Form submitted with value:', e.nativeEvent.text);
      }}
    />
  );
}
```

### Focus Events

Focus events are triggered when components gain or lose focus:

```tsx
import { TextInput, Button } from 'react-console';

function FocusExample() {
  return (
    <View>
      <TextInput
        onFocus={() => {
          console.log('Input focused');
        }}
        onBlur={() => {
          console.log('Input blurred');
        }}
      />
    </View>
  );
}
```

## Keyboard Events

### KeyPress Interface

The `KeyPress` interface provides information about pressed keys:

```tsx
interface KeyPress {
  name?: string; // Key name (if available)
  ctrl: boolean; // Ctrl key pressed
  meta: boolean; // Meta/Command key pressed
  shift: boolean; // Shift key pressed
  return: boolean; // Enter/Return key
  escape: boolean; // Escape key
  tab: boolean; // Tab key
  backspace: boolean; // Backspace key
  delete: boolean; // Delete key
  upArrow: boolean; // Up arrow
  downArrow: boolean; // Down arrow
  leftArrow: boolean; // Left arrow
  rightArrow: boolean; // Right arrow
  pageUp?: boolean; // Page Up
  pageDown?: boolean; // Page Down
  home?: boolean; // Home key
  end?: boolean; // End key
  char?: string; // Character typed or Ctrl+key name
}
```

### Special Keys

```tsx
<TextInput
  onKeyDown={(e) => {
    // Arrow keys
    if (e.key.upArrow) {
      moveUp();
    } else if (e.key.downArrow) {
      moveDown();
    }

    // Modifier keys
    if (e.key.ctrl && e.key.char === 'c') {
      handleCopy();
    } else if (e.key.ctrl && e.key.char === 'v') {
      handlePaste();
    }

    // Navigation keys
    if (e.key.pageUp) {
      scrollUp();
    } else if (e.key.pageDown) {
      scrollDown();
    } else if (e.key.home) {
      goToStart();
    } else if (e.key.end) {
      goToEnd();
    }
  }}
/>
```

### Keyboard Shortcuts

```tsx
function App() {
  return (
    <View
      onKeyDown={(e) => {
        // Global shortcuts
        if (e.key.ctrl && e.key.char === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key.escape) {
          handleCancel();
        }
      }}
    >
      {/* App content */}
    </View>
  );
}
```

## Mouse Events

### MouseEvent Interface

The `MouseEvent` interface provides mouse information:

```tsx
interface MouseEvent {
  x: number; // X coordinate (0-based)
  y: number; // Y coordinate (0-based)
  button?: number; // Button (0=left, 1=middle, 2=right)
  ctrl?: boolean; // Ctrl key pressed
  shift?: boolean; // Shift key pressed
  meta?: boolean; // Meta key pressed
  isDragging?: boolean; // True if dragging
  startX?: number; // X where drag started
  startY?: number; // Y where drag started
  deltaX?: number; // X change since drag start
  deltaY?: number; // Y change since drag start
  eventType?: 'press' | 'drag' | 'release';
}
```

### Click Events

```tsx
<Button
  onClick={(e) => {
    console.log(`Clicked at (${e.x}, ${e.y})`);
    console.log(`Button: ${e.button}`); // 0=left, 1=middle, 2=right
  }}
>
  Click Me
</Button>
```

### Mouse Button Types

```tsx
<Button
  onClick={(e) => {
    if (e.button === 0) {
      console.log('Left click');
    } else if (e.button === 1) {
      console.log('Middle click');
    } else if (e.button === 2) {
      console.log('Right click');
    }
  }}
>
  Multi-Button
</Button>
```

### Mouse Drag Events

```tsx
<View
  onMouseDrag={(e) => {
    console.log(`Dragging from (${e.startX}, ${e.startY}) to (${e.x}, ${e.y})`);
    console.log(`Delta: (${e.deltaX}, ${e.deltaY})`);
  }}
  onMouseUp={(e) => {
    if (e.isDragging) {
      console.log('Drag ended');
    } else {
      console.log('Click ended');
    }
  }}
>
  Draggable Area
</View>
```

### Mouse Modifiers

```tsx
<Button
  onClick={(e) => {
    if (e.ctrl) {
      console.log('Ctrl+Click');
    } else if (e.shift) {
      console.log('Shift+Click');
    } else if (e.meta) {
      console.log('Meta+Click');
    }
  }}
>
  Modifier Click
</Button>
```

## Input Events

### onChange Event

Triggered when input value changes:

```tsx
<TextInput
  value={value}
  onChangeText={(text) => {
    // text is the new value
    setValue(text);
  }}
  onKeyDown={(e) => {
    // e.key contains key information
    if (e.key.return) {
      handleSubmit();
    }
  }}
/>
```

### onSubmit Event

Triggered when Enter is pressed in input:

```tsx
<TextInput
  value={value}
  onSubmitEditing={(e) => {
    // e.value is the current value
    handleSubmit(e.value);
  }}
/>
```

## Focus Management

### Focus Events

```tsx
<TextInput
  onFocus={() => {
    console.log('Input gained focus');
  }}
  onBlur={() => {
    console.log('Input lost focus');
  }}
/>
```

### Programmatic Focus

```tsx
import { focusComponent } from 'react-console';

function FocusExample() {
  const [inputRef, setInputRef] = useState<ConsoleNode | null>(null);

  return (
    <View>
      <TextInput ref={setInputRef} />
      <Button
        onClick={() => {
          if (inputRef) {
            const components: ConsoleNode[] = [];
            collectInteractiveComponents(rootNode, components);
            focusComponent(inputRef, components, () => {
              // Trigger re-render
            });
          }
        }}
      >
        Focus Input
      </Button>
    </View>
  );
}
```

### Tab Navigation

Tab navigation is handled automatically:

- **Tab**: Move to next focusable component
- **Shift+Tab**: Move to previous focusable component
- Disabled components are skipped
- Focus trapping in overlays

```tsx
// Tab navigation works automatically
<View>
  <TextInput autoFocus /> {/* First focusable */}
  <Button /> {/* Second focusable */}
  <TextInput /> {/* Third focusable */}
  <Button disabled /> {/* Skipped (disabled) */}
  <TextInput /> {/* Fourth focusable */}
</View>
```

## Event Propagation

### preventDefault

Prevent default behavior:

```tsx
<TextInput
  onKeyDown={(e) => {
    if (e.key.ctrl && e.key.char === 's') {
      e.preventDefault(); // Prevent default save behavior
      handleCustomSave();
    }
  }}
/>
```

### stopPropagation

Stop event from continuing to default handling:

```tsx
<TextInput
  onKeyDown={(e) => {
    if (e.key.return) {
      e.stopPropagation(); // Prevent default Enter handling
      handleCustomSubmit();
    }
  }}
/>
```

**Note**: `stopPropagation()` prevents the default component handler from running, but the event handler itself still executes.

## Component-Specific Events

### Button Events

```tsx
<Button
  onClick={(e) => {
    console.log('Button clicked');
  }}
  onKeyDown={(e) => {
    if (e.key.return || e.key.char === ' ') {
      console.log('Button activated via keyboard');
    }
  }}
>
  Click Me
</Button>
```

### Input Events

```tsx
<TextInput
  onChangeText={(text) => {
    setValue(text);
  }}
  onKeyDown={(e) => {
    if (e.key.escape) {
      handleCancel();
    }
  }}
  onSubmitEditing={(e) => {
    handleSubmit(e.nativeEvent.text);
  }}
/>
```

### Selection Component Events

```tsx
<Radio
  options={options}
  value={selected}
  onChange={(e) => {
    setSelected(e.value);
  }}
  onKeyDown={(e) => {
    if (e.key.upArrow || e.key.downArrow) {
      // Navigation handled automatically
    }
  }}
/>
```

## Event Handler Patterns

### Inline Handlers

```tsx
<Button onClick={(e) => console.log('Clicked')} />
```

### Handler Functions

```tsx
function handleClick(e: MouseEvent) {
  console.log('Clicked at', e.x, e.y);
}

<Button onClick={handleClick} />;
```

### Conditional Handlers

```tsx
<Button onClick={enabled ? handleClick : undefined} />
```

### Handler with State

```tsx
function App() {
  const [count, setCount] = useState(0);

  return <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>;
}
```

## Common Patterns

### Form Submission

```tsx
function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = () => {
    // Submit form
  };

  return (
    <View>
      <TextInput
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        onSubmitEditing={handleSubmit}
      />
      <TextInput
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        onSubmitEditing={handleSubmit}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </View>
  );
}
```

### Keyboard Shortcuts

```tsx
function App() {
  return (
    <View
      onKeyDown={(e) => {
        if (e.key.ctrl && e.key.char === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key.ctrl && e.key.char === 'q') {
          e.preventDefault();
          handleQuit();
        }
      }}
    >
      {/* App content */}
    </View>
  );
}
```

### Click Outside Detection

```tsx
// Click outside to close is handled automatically for dropdowns
<Dropdown
  options={options}
  isOpen={isOpen}
  // Automatically closes when clicking outside
/>
```

### Drag and Drop

```tsx
function Draggable() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <View
      onMouseDrag={(e) => {
        setPosition({
          x: e.x - e.startX!,
          y: e.y - e.startY!,
        });
      }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
      }}
    >
      Draggable
    </View>
  );
}
```

### Focus Management

```tsx
function FocusExample() {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        border: focused ? 'single' : undefined,
        borderColor: focused ? 'cyan' : undefined,
      }}
    />
  );
}
```

## Event Handling Best Practices

### 1. Use Type-Safe Event Handlers

```tsx
// Good: Type-safe
<Button onClick={(e: MouseEvent) => handleClick(e)} />

// Avoid: Using any
<Button onClick={(e: any) => handleClick(e)} />
```

### 2. Handle Events at Appropriate Level

```tsx
// Good: Handle at component level
<TextInput onChangeText={(text) => setValue(text)} />

// Also good: Handle at form level for validation
<View onKeyDown={(e) => handleFormKeyDown(e)}>
  <TextInput />
</View>
```

### 3. Use preventDefault for Custom Behavior

```tsx
<TextInput
  onKeyDown={(e) => {
    if (e.key.ctrl && e.key.char === 's') {
      e.preventDefault(); // Prevent default
      handleCustomSave();
    }
  }}
/>
```

### 4. Use stopPropagation to Override Defaults

```tsx
<TextInput
  onKeyDown={(e) => {
    if (e.key.return) {
      e.stopPropagation(); // Prevent default Enter handling
      handleCustomSubmit();
    }
  }}
/>
```

### 5. Handle Focus Appropriately

```tsx
// Good: Use autoFocus for first input
<TextInput autoFocus />

// Good: Handle focus events for UI feedback
<TextInput
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
```

### 6. Use Event Information

```tsx
// Good: Use event properties
<Button
  onClick={(e) => {
    if (e.ctrl) {
      handleCtrlClick();
    } else {
      handleNormalClick();
    }
  }}
/>
```

## Disabled Components

Disabled components don't receive events:

```tsx
<Button
  disabled
  onClick={(e) => {
    // This handler will never be called when disabled
  }}
>
  Disabled Button
</Button>
```

## Event Propagation Flow

1. **Keyboard Events**:
   - `onKeyDown` fires on focused component
   - If `stopPropagation()` is called, default handling stops
   - Otherwise, default component handler runs

2. **Mouse Events**:
   - Hit testing finds component at click position
   - `onClick`/`onPress` fires on target component
   - Disabled components are skipped

3. **Input Events**:
   - `onChange` fires when value changes
   - `onSubmit` fires on Enter key
   - `onKeyDown` fires before value change

## Troubleshooting

### Events Not Firing

1. Check component is not disabled
2. Verify event handler is provided
3. Ensure component is focusable (for keyboard events)
4. Check component bounds are registered (for mouse events)

### Default Behavior Not Prevented

1. Use `preventDefault()` to prevent default behavior
2. Use `stopPropagation()` to prevent default handler
3. Check event handler executes before default

### Focus Issues

1. Verify `autoFocus` is set for initial focus
2. Check `tabIndex` is not negative
3. Ensure component is not disabled
4. Use `focusComponent()` for programmatic focus

## Further Reading

- [Input Handling Guide](./INPUT_HANDLING_GUIDE.md) - Detailed input handling
- [State Management Guide](./STATE_MANAGEMENT.md) - State management patterns
- [Styling Guide](./STYLING_GUIDE.md) - Component styling
