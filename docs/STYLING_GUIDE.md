# Styling Guide

This guide covers all aspects of styling in React Console, including the StyleSheet API, inline styles, responsive sizing, and theme integration.

## Overview

React Console provides multiple ways to style components:
- **StyleSheet API**: React Native-like stylesheets for reusable styles
- **Inline styles**: CSS-like style objects
- **Legacy props**: Direct style props for backward compatibility
- **Theme system**: Theme-aware styling with automatic color resolution

## StyleSheet API

### Creating Stylesheets

Use `StyleSheet.create()` to define reusable styles:

```tsx
import { StyleSheet, View, Text } from 'react-console';

const styles = StyleSheet.create({
  container: {
    padding: 2,
    border: 'single',
    backgroundColor: 'blue',
  },
  title: {
    color: 'white',
    bold: true,
    underline: true,
  },
  body: {
    color: 'cyan',
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.body}>Body text</Text>
    </View>
  );
}
```

### Flattening Styles

Use `StyleSheet.flatten()` to merge multiple styles:

```tsx
import { StyleSheet, View } from 'react-console';

const baseStyle = { padding: 1 };
const conditionalStyle = condition ? { backgroundColor: 'red' } : null;
const overrideStyle = { padding: 2 };

const merged = StyleSheet.flatten([baseStyle, conditionalStyle, overrideStyle]);

<View style={merged} />
```

### Composing Styles

Use `StyleSheet.compose()` as an alias for `flatten()`:

```tsx
import { StyleSheet, Text } from 'react-console';

const base = { color: 'white' };
const variant = { bold: true };
const override = { color: 'yellow' };

const composed = StyleSheet.compose(base, variant, override);

<Text style={composed}>Composed text</Text>
```

## Inline Styles

### View Styles

View/Box components support CSS-like style objects:

```tsx
import { View, Text } from 'react-console';

function StyledView() {
  return (
    <View
      style={{
        padding: 2,
        margin: 1,
        border: 'single',
        borderColor: 'cyan',
        backgroundColor: 'blue',
        width: 50,
        height: 10,
      }}
    >
      <Text>Styled content</Text>
    </View>
  );
}
```

### Text Styles

Text components support text-specific styles:

```tsx
import { Text } from 'react-console';

function StyledText() {
  return (
    <Text
      style={{
        color: 'red',
        backgroundColor: 'yellow',
        bold: true,
        underline: true,
        italic: true,
      }}
    >
      Styled text
    </Text>
  );
}
```

### Style Arrays

You can pass arrays of styles (merged left to right):

```tsx
import { View } from 'react-console';

const baseStyle = { padding: 1, backgroundColor: 'blue' };
const overrideStyle = { padding: 2 };

<View style={[baseStyle, overrideStyle]} />
// Result: { padding: 2, backgroundColor: 'blue' }
```

## Legacy Props

For backward compatibility, you can use direct style props:

```tsx
import { View, Text } from 'react-console';

// These are equivalent:
<View style={{ padding: 2, backgroundColor: 'blue' }} />
<View padding={2} backgroundColor="blue" />

<Text style={{ color: 'red', bold: true }} />
<Text color="red" bold />
```

**Note**: Legacy props are merged with the `style` prop, with `style` taking precedence.

## Color System

### Named Colors

React Console supports standard terminal colors:

```tsx
const colors = [
  'black', 'red', 'green', 'yellow',
  'blue', 'magenta', 'cyan', 'white',
  'gray', 'grey'
];
```

### Custom Colors

You can use hex colors or RGB values:

```tsx
<Text color="#FF0000">Red text</Text>
<Text color="rgb(255, 0, 0)">Red text</Text>
```

### Theme Colors

Use theme color references for theme-aware styling:

```tsx
import { useThemeColors } from 'react-console';

function ThemedComponent() {
  const colors = useThemeColors();
  
  return (
    <Text color={colors.text}>
      This text uses the theme's text color
    </Text>
  );
}
```

Or use theme color keys directly:

```tsx
// In a theme-aware component
<Text color="text">Theme text color</Text>
<View style={{ backgroundColor: 'background' }} />
```

## Text Styles

### Text Decorations

```tsx
<Text bold>Bold text</Text>
<Text italic>Italic text</Text>
<Text underline>Underlined text</Text>
<Text strikethrough>Strikethrough text</Text>
<Text dim>Dimmed text</Text>
<Text inverse>Inverse colors</Text>
```

### Combining Text Styles

```tsx
<Text bold underline italic>
  Bold, underlined, italic text
</Text>
```

## Layout Styles

### Padding

```tsx
// Uniform padding
<View style={{ padding: 2 }} />

// Individual padding
<View style={{
  padding: {
    top: 1,
    right: 2,
    bottom: 1,
    left: 2,
  },
}} />
```

### Margin

```tsx
// Uniform margin
<View style={{ margin: 1 }} />

// Individual margin
<View style={{
  margin: {
    top: 0,
    right: 1,
    bottom: 0,
    left: 1,
  },
}} />
```

### Borders

```tsx
// Simple border
<View style={{ border: true }} />

// Border with style
<View style={{
  border: true,
  borderStyle: 'double',
  borderColor: 'cyan',
}} />

// Individual borders
<View style={{
  border: {
    top: true,
    bottom: true,
  },
  borderStyle: 'thick',
}} />
```

Border styles:
- `'single'` - Single line (default)
- `'double'` - Double line
- `'thick'` - Thick line
- `'dashed'` - Dashed line
- `'dotted'` - Dotted line

## Responsive Sizing

### Fixed Sizes

```tsx
<View style={{ width: 50, height: 20 }} />
```

### Percentage Sizes

```tsx
<View style={{ width: '50%', height: '25%' }} />
```

### Viewport Units

```tsx
<View style={{ width: '80vw', height: '50vh' }} />
```

### Character Units

```tsx
<View style={{ width: '80ch' }} />
```

### Responsive Width/Height

```tsx
import { View } from 'react-console';

function ResponsiveComponent() {
  return (
    <View style={{ width: '50%', height: '25%' }}>
      {/* Adapts to terminal size */}
    </View>
  );
}
```

## Positioning

### Relative Positioning

```tsx
<View style={{
  position: 'relative',
  left: 5,
  top: 2,
}}>
  Positioned content
</View>
```

### Absolute Positioning

```tsx
<View style={{
  position: 'absolute',
  left: 10,
  top: 5,
}}>
  Absolutely positioned
</View>
```

### Fixed Positioning

```tsx
<View style={{
  position: 'fixed',
  right: 0,
  bottom: 0,
}}>
  Fixed to bottom-right
</View>
```

## Flexbox Styles

### Flex Direction

```tsx
<View style={{
  display: 'flex',
  flexDirection: 'row', // or 'column', 'row-reverse', 'column-reverse'
}}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

### Justify Content

```tsx
<View style={{
  display: 'flex',
  justifyContent: 'center', // 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'
}}>
  <Text>Centered</Text>
</View>
```

### Align Items

```tsx
<View style={{
  display: 'flex',
  alignItems: 'center', // 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'
}}>
  <Text>Aligned</Text>
</View>
```

### Flex Properties

```tsx
<View style={{
  display: 'flex',
  flex: 1, // Grow and shrink
  flexGrow: 2, // Grow factor
  flexShrink: 1, // Shrink factor
  flexBasis: '50%', // Initial size
}}>
  Flexible item
</View>
```

## Grid Styles

### Grid Template

```tsx
<View style={{
  display: 'grid',
  gridTemplateColumns: [1, 2, 1], // Fractional units
  gridTemplateRows: ['auto', '50%'],
  gap: 1,
}}>
  <Text>Cell 1</Text>
  <Text>Cell 2</Text>
  <Text>Cell 3</Text>
</View>
```

### Grid Placement

```tsx
<View style={{
  display: 'grid',
  gridColumn: '1 / 3', // Span columns
  gridRow: 1,
}}>
  Spans 2 columns
</View>
```

## Component-Specific Styles

### Input Styles

```tsx
<Input
  style={{
    color: 'white',
    backgroundColor: 'blue',
    bold: true,
  }}
/>
```

### Button Styles

```tsx
<Button
  style={{
    color: 'white',
    backgroundColor: 'green',
    bold: true,
  }}
>
  Click me
</Button>
```

### Selection Component Styles

```tsx
<Radio
  style={{
    color: 'cyan',
    bold: true,
  }}
  options={['Option 1', 'Option 2']}
/>
```

## Theme Integration

### Using Theme Colors

```tsx
import { useThemeStyle } from 'react-console';

function ThemedComponent() {
  const style = useThemeStyle({
    color: 'text',
    backgroundColor: 'background',
  });
  
  return <Text style={style}>Themed text</Text>;
}
```

### Component Themes

```tsx
import { useComponentTheme } from 'react-console';

function ThemedButton() {
  const style = useComponentTheme('button', {
    bold: true,
  });
  
  return <Button style={style}>Themed Button</Button>;
}
```

## Best Practices

### 1. Use StyleSheet for Reusable Styles

```tsx
const styles = StyleSheet.create({
  card: { padding: 2, border: 'single' },
  title: { bold: true, color: 'white' },
});
```

### 2. Combine Styles with flatten()

```tsx
const merged = StyleSheet.flatten([
  styles.base,
  condition && styles.conditional,
  styles.override,
]);
```

### 3. Use Theme Colors for Consistency

```tsx
// Good: Theme-aware
<Text color="text">Content</Text>

// Avoid: Hard-coded colors (unless intentional)
<Text color="white">Content</Text>
```

### 4. Prefer Style Prop Over Legacy Props

```tsx
// Good: Modern API
<View style={{ padding: 2 }} />

// Works but legacy
<View padding={2} />
```

### 5. Use Responsive Sizes for Adaptability

```tsx
// Good: Adapts to terminal size
<View style={{ width: '50%' }} />

// Less flexible: Fixed size
<View style={{ width: 40 }} />
```

### 6. Organize Styles by Component

```tsx
// styles.ts
export const componentStyles = StyleSheet.create({
  container: { /* ... */ },
  header: { /* ... */ },
  body: { /* ... */ },
});
```

## Common Patterns

### Card Component

```tsx
const cardStyles = StyleSheet.create({
  card: {
    padding: 2,
    border: 'single',
    borderColor: 'cyan',
    backgroundColor: 'blue',
  },
  title: {
    bold: true,
    color: 'white',
    underline: true,
  },
});

function Card({ title, children }) {
  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>{title}</Text>
      {children}
    </View>
  );
}
```

### Button Variants

```tsx
const buttonStyles = StyleSheet.create({
  base: {
    padding: { top: 0, right: 1, bottom: 0, left: 1 },
  },
  primary: {
    backgroundColor: 'green',
    color: 'white',
    bold: true,
  },
  secondary: {
    backgroundColor: 'blue',
    color: 'white',
  },
  danger: {
    backgroundColor: 'red',
    color: 'white',
    bold: true,
  },
});

function Button({ variant = 'primary', children, ...props }) {
  const style = StyleSheet.flatten([
    buttonStyles.base,
    buttonStyles[variant],
  ]);
  
  return <Button style={style} {...props}>{children}</Button>;
}
```

### Responsive Layout

```tsx
function ResponsiveLayout() {
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={{ flex: 1, width: '30%' }}>
        <Text>Sidebar</Text>
      </View>
      <View style={{ flex: 2, width: '70%' }}>
        <Text>Main content</Text>
      </View>
    </View>
  );
}
```

## Troubleshooting

### Styles Not Applying

1. Check that style prop is passed correctly
2. Verify style object structure matches component type
3. Check for style conflicts (later styles override earlier ones)

### Colors Not Showing

1. Verify terminal supports colors: `supportsColor()`
2. Check FORCE_COLOR environment variable
3. Use theme colors for automatic fallback

### Responsive Sizes Not Working

1. Ensure parent has defined width/height
2. Check percentage calculations
3. Verify terminal dimensions are available

## Further Reading

- [Layout Guide](./LAYOUT_GUIDE.md) - Detailed layout system documentation
- [Theme System](../src/theme/README.md) - Theme system documentation
- [State Management Guide](./STATE_MANAGEMENT.md) - State management patterns
