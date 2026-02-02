# React Console

React 19+ TypeScript library for building console/terminal applications using JSX and React components.

> **Alpha Notice**: This library is currently in alpha (v0.x). The API may change between versions without notice. We do not guarantee backwards compatibility until v1.0.0. Please pin your dependency to a specific version if stability is important for your project.

## Overview

React Console allows you to build terminal/console applications using React 19+ with JSX, components, hooks, and all the modern React features - but for console output instead of HTML.

## Features

- ✅ **React 19+ support** with all modern hooks (`use`, `useOptimistic`, `useActionState`, `useFormStatus`, etc.)
- ✅ **React Compiler integration** (automatic memoization)
- ✅ **TypeScript** with strict mode
- ✅ **ESLint 9+** configuration
- ✅ **Component-based architecture** (Text, View, Input, Button, and more)
- ✅ **ANSI color and styling support** (foreground, background, text styles)
- ✅ **Layout system** with padding, margin, responsive sizing
- ✅ **Interactive components** with JSX-style event handlers
- ✅ **Mouse support** for terminals that support it
- ✅ **Tab navigation** with automatic tab index management
- ✅ **Multiline input** with width and height constraints
- ✅ **Responsive sizing** (percentages, viewport units, character units)
- ✅ **Reactive terminal resizing** - UI adjusts automatically when terminal dimensions change
- ✅ **Custom React renderer** using `react-reconciler`
- ✅ **Multiple rendering modes** (static, interactive, fullscreen)

## Installation

```bash
npm install react-console react@^19.0.0
```

## Quick Start

```tsx
import React from 'react';
import { render, Text, View } from 'react-console';

function App() {
  return (
    <View padding={1}>
      <Text color="cyan" bold>
        Hello, Console!
      </Text>
      <Text>This is React in the terminal.</Text>
    </View>
  );
}

render(<App />);
```

## Components

### `<View>` / `<Box>`

Container component for layout with padding, margin, and responsive sizing.

```tsx
<View padding={2} margin={1}>
  <Text>Content with padding and margin</Text>
</View>

<View width="50%" height="80vh">
  <Text>Responsive sizing</Text>
</View>
```

### `<Text>`

Styled text output with colors and formatting. Supports nested Text components for inline styling.

```tsx
<Text color="green" bold>Success!</Text>
<Text color="#FF0000">Red text using hex color</Text>
<Text underline>Underlined text</Text>

{/* Nested Text for inline styling */}
<Text>
  Normal text with <Text bold color="yellow">highlighted</Text> content
</Text>
```

### `<LineBreak>`

Explicit line break component.

```tsx
<Text>First line</Text>
<LineBreak />
<Text>Second line</Text>
```

### `<Input>`

Text input component with JSX-style event handlers. Supports single-line and multiline input.

```tsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(event) => setValue(event.value)}
  onSubmit={(event) => console.log('Submitted:', event.value)}
  placeholder="Enter text..."
  maxWidth={80}
  multiline
  maxLines={5}
  autoFocus
/>;
```

**Props:**

- `value` / `defaultValue` - Controlled or uncontrolled input
- `placeholder` - Placeholder text
- `maxLength` - Maximum character length
- `maxWidth` - Maximum input width (defaults to terminal width)
- `multiline` - Allow multiline input
- `maxLines` - Maximum number of lines for multiline input
- `mask` - Character to mask input (e.g., '\*' for password)
- `disabled` - Disable input
- `autoFocus` - Auto-focus on mount
- `tabIndex` - Tab order
- `onChange` - Called when value changes
- `onSubmit` - Called when Enter is pressed (single-line) or Ctrl+Enter (multiline)
- `onKeyDown` / `onKeyUp` / `onKeyPress` - Keyboard event handlers
- `onFocus` / `onBlur` - Focus event handlers

### `<Button>`

Clickable button component with keyboard and mouse support.

```tsx
<Button onClick={() => console.log('Clicked!')} label="Click Me" tabIndex={0} />
```

**Props:**

- `onClick` - Click handler
- `onPress` - Press handler (alias for onClick)
- `onMouseDown` / `onMouseUp` / `onMouseMove` - Mouse event handlers
- `onKeyDown` / `onKeyUp` / `onKeyPress` - Keyboard event handlers
- `onFocus` / `onBlur` - Focus event handlers
- `tabIndex` - Tab order
- `disabled` - Disable button

### `<Pressable>`

React Native-like pressable component that can wrap any content.

```tsx
<Pressable onPress={() => console.log('Pressed!')} tabIndex={0}>
  <Text>Pressable content</Text>
</Pressable>
```

### `<Focusable>`

Component to make any content focusable with tab navigation.

```tsx
<Focusable tabIndex={0} onFocus={() => console.log('Focused!')}>
  <Text>Focusable content</Text>
</Focusable>
```

### `<Scrollable>` / `<ScrollView>`

Scrollable container for overflow content.

```tsx
<Scrollable maxHeight={20} maxWidth={80}>
  <View>{/* Long content that will scroll */}</View>
</Scrollable>
```

**Props:**

- `scrollTop` / `scrollLeft` - Scroll position
- `maxHeight` / `maxWidth` - Maximum dimensions
- `horizontal` - Scroll horizontally instead of vertically
- `showsScrollIndicator` - Show scroll indicators (planned)

### `<Overlay>`

Overlay/modal component for layered rendering.

```tsx
<Overlay backdrop backdropColor="black" zIndex={10}>
  <View padding={2}>
    <Text>Modal content</Text>
  </View>
</Overlay>
```

**Props:**

- `backdrop` - Show backdrop
- `backdropColor` - Backdrop color
- `zIndex` - Z-index for layering
- `width` / `height` - Responsive sizing

## Styling

### Colors

- **Named colors**: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray`
- **Hex colors**: `#FF0000`
- **RGB colors**: `rgb(255, 0, 0)`

### Text Styles

- `bold` - Bold text
- `dim` - Dim text
- `italic` - Italic text
- `underline` - Underlined text
- `strikethrough` - Strikethrough text
- `inverse` - Inverse colors

### Background Colors

```tsx
<Text backgroundColor="blue" color="white">
  White text on blue background
</Text>
```

### Responsive Sizing

React Console supports responsive sizing similar to CSS:

```tsx
<View width="50%">50% of terminal width</View>
<View width="80vw">80% of viewport width</View>
<View width="80ch">80 characters wide</View>
<View height="50vh">50% of viewport height</View>
```

The UI automatically adjusts when the terminal is resized, just like React in the browser!

## Layout

### Padding

```tsx
<View padding={2}>Uniform padding</View>
<View padding={{ top: 1, right: 2, bottom: 1, left: 2 }}>
  Custom padding
</View>
```

### Margin

```tsx
<View margin={1}>Content with margin</View>
<View margin={{ top: 2, bottom: 2 }}>Vertical margin</View>
```

## Rendering Modes

### Static Mode (Default)

One-time output, perfect for CLI commands:

```tsx
render(<App />); // or render(<App />, { mode: 'static' });
```

### Interactive Mode

Full terminal application with input handling:

```tsx
render(<App />, { mode: 'interactive' });
```

### Fullscreen Mode

Application takes over the entire terminal:

```tsx
render(<App />, { mode: 'fullscreen' });
```

## React 19 Features

React Console supports all React 19 features:

- **`use()` hook** - For reading resources (promises, context)
- **`useOptimistic()`** - For optimistic updates
- **`useActionState()`** - For form actions
- **`useFormStatus()`** - For form status
- **React Compiler** - Automatic memoization and optimizations
- **Concurrent Features** - Support for concurrent rendering
- **Actions** - Form actions support

## Event Handling

All components support JSX-style event handlers:

```tsx
<Input
  onChange={(event) => {
    console.log('Value:', event.value);
  }}
  onKeyDown={(event) => {
    if (event.key.escape) {
      // Handle Escape key
    }
  }}
  onSubmit={(event) => {
    console.log('Submitted:', event.value);
  }}
/>

<Button
  onClick={(event) => {
    console.log('Clicked at:', event.x, event.y);
  }}
  onMouseDown={(event) => {
    console.log('Mouse down:', event.button);
  }}
/>
```

## Tab Navigation

Components automatically support tab navigation:

```tsx
<Input tabIndex={0} autoFocus />
<Button tabIndex={1} />
<Button tabIndex={2} />
```

Use Tab and Shift+Tab to navigate between focusable components. Tab indexes are automatically assigned if not specified.

## Mouse Support

For terminals that support mouse events:

```tsx
<Button
  onClick={(event) => {
    console.log('Clicked at:', event.x, event.y);
  }}
  onMouseMove={(event) => {
    console.log('Mouse at:', event.x, event.y);
  }}
/>
```

Mouse tracking is automatically enabled in interactive and fullscreen modes.

## Utilities

### Terminal Utilities

```tsx
import { getTerminalDimensions, supportsColor } from 'react-console';

const dims = getTerminalDimensions();
console.log(`Terminal: ${dims.columns}x${dims.rows}`);

if (supportsColor()) {
  // Terminal supports colors
}
```

### Responsive Utilities

```tsx
import { resolveWidth, resolveHeight } from 'react-console';

const width = resolveWidth('50%', 100); // 50
const height = resolveHeight('80vh', 24); // 19 (80% of 24)
```

### Text Measurement

```tsx
import { measureText, wrapText, truncateText } from 'react-console';

const width = measureText('Hello'); // 5
const lines = wrapText('Long text...', 80);
const truncated = truncateText('Very long text...', 20);
```

## Examples

See the `examples/` directory for complete examples:

- `basic.tsx` - Simple text output
- `flexbox.tsx` - Flexbox layout examples
- `forms.tsx` - Form handling with inputs
- `responsive.tsx` - Responsive sizing examples
- `state-hooks.tsx` - State management with hooks
- `stylesheet.tsx` - StyleSheet API usage
- `cli/` - CLI application examples

Run examples with:

```bash
npx tsx examples/basic.tsx
```

## Documentation

- [CLI Framework Guide](./docs/CLI_FRAMEWORK_GUIDE.md) - Building CLI applications
- [Styling Guide](./docs/STYLING_GUIDE.md) - Styling components
- [Layout Guide](./docs/LAYOUT_GUIDE.md) - Flexbox and grid layouts
- [Event Handling Guide](./docs/EVENT_HANDLING_GUIDE.md) - Handling keyboard and mouse events
- [Input Handling Guide](./docs/INPUT_HANDLING_GUIDE.md) - Working with input components
- [Migration Guide](./docs/MIGRATION_GUIDE.md) - Migrating from other libraries
- [API Reference](./docs/api/README.md) - Full API documentation

## License

MIT
