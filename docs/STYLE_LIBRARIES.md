# Building Style Libraries

Guide for creating Tailwind-like style libraries for React Console.

## Overview

React Console supports `className` props on all components, allowing you to build style libraries similar to Tailwind CSS. The className system integrates seamlessly with the existing style system and theme support.

## Basic Usage

### Using className

```tsx
import { View, Text } from 'react-console';
import { registerClassNames } from 'react-console';

// Register class names
registerClassNames({
  'container': { padding: 2, margin: 1 },
  'text-primary': { color: 'cyan' },
  'text-bold': { bold: true },
});

// Use in components
function App() {
  return (
    <View className="container">
      <Text className="text-primary text-bold">
        Styled with classes
      </Text>
    </View>
  );
}
```

### Multiple Classes

```tsx
<View className="container flex-row gap-2">
  <Text className="text-primary">Item 1</Text>
  <Text className="text-secondary">Item 2</Text>
</View>
```

### Conditional Classes

Use with `clsx` or `classnames`:

```tsx
import clsx from 'clsx';

<View className={clsx('container', isActive && 'active', 'flex-row')}>
  <Text>Content</Text>
</View>
```

## Creating a Style Library

### Basic Library

```typescript
import { createStyleLibrary, registerClassNames } from 'react-console';
import type { ViewStyle, TextStyle } from 'react-console';

const myLibrary = {
  // Layout
  'container': { padding: 2, margin: 1 } as ViewStyle,
  'flex': { flexDirection: 'row' } as ViewStyle,
  'flex-col': { flexDirection: 'column' } as ViewStyle,
  'gap-1': { gap: 1 } as ViewStyle,
  'gap-2': { gap: 2 } as ViewStyle,
  
  // Colors
  'text-red': { color: 'red' } as TextStyle,
  'text-green': { color: 'green' } as TextStyle,
  'bg-blue': { backgroundColor: 'blue' } as ViewStyle,
  
  // Text styles
  'bold': { bold: true } as TextStyle,
  'italic': { italic: true } as TextStyle,
  'underline': { underline: true } as TextStyle,
};

// Register the library
createStyleLibrary(myLibrary);
```

### Advanced Library with Utilities

```typescript
import { createStyleLibrary } from 'react-console';
import type { ViewStyle, TextStyle } from 'react-console';

function createUtilityClasses() {
  const classes: Record<string, ViewStyle | TextStyle> = {};
  
  // Spacing utilities
  for (let i = 0; i <= 10; i++) {
    classes[`p-${i}`] = { padding: i } as ViewStyle;
    classes[`m-${i}`] = { margin: i } as ViewStyle;
    classes[`px-${i}`] = { paddingLeft: i, paddingRight: i } as ViewStyle;
    classes[`py-${i}`] = { paddingTop: i, paddingBottom: i } as ViewStyle;
  }
  
  // Color utilities
  const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta'];
  for (const color of colors) {
    classes[`text-${color}`] = { color } as TextStyle;
    classes[`bg-${color}`] = { backgroundColor: color } as ViewStyle;
  }
  
  // Flex utilities
  classes['flex'] = { flexDirection: 'row' } as ViewStyle;
  classes['flex-col'] = { flexDirection: 'column' } as ViewStyle;
  classes['items-center'] = { alignItems: 'center' } as ViewStyle;
  classes['justify-center'] = { justifyContent: 'center' } as ViewStyle;
  
  return classes;
}

// Create and register
const utilityClasses = createUtilityClasses();
createStyleLibrary(utilityClasses);
```

## Responsive Classes

The className system recognizes responsive prefixes (structure in place):

```typescript
registerClassNames({
  'text-sm': { fontSize: 12 } as TextStyle,
  'sm:text-lg': { fontSize: 18 } as TextStyle, // Applied at small sizes
  'md:text-xl': { fontSize: 20 } as TextStyle, // Applied at medium sizes
});
```

**Note**: Full responsive handling requires terminal size context integration.

## Pseudo-Classes

The system recognizes pseudo-class prefixes:

```typescript
registerClassNames({
  'button': { padding: 1 } as ViewStyle,
  'hover:bg-blue': { backgroundColor: 'blue' } as ViewStyle, // On hover
  'focus:border-cyan': { borderColor: 'cyan' } as ViewStyle, // On focus
  'disabled:opacity-50': { opacity: 0.5 } as ViewStyle, // When disabled
});
```

**Note**: Pseudo-classes are handled at component level (via `onFocus`, `onHover`, etc.).

## Style Precedence

1. **Inline `style` prop** - Highest priority
2. **className styles** - Merged together
3. **Theme styles** - Applied via theme system

```tsx
// Inline style overrides className
<View 
  className="bg-blue" 
  style={{ backgroundColor: 'red' }} // Red wins
>
  Content
</View>
```

## Integration with Theme

className styles work with the theme system:

```typescript
import { useTheme } from 'react-console';

registerClassNames({
  'text-primary': (theme) => ({ 
    color: theme.colors.primary 
  } as TextStyle),
});
```

## Building a Complete Library

### Example: React Console Tailwind

```typescript
// react-console-tailwind.ts
import { createStyleLibrary } from 'react-console';
import type { ViewStyle, TextStyle } from 'react-console';

export function createTailwindClasses() {
  const classes: Record<string, ViewStyle | TextStyle> = {};
  
  // Spacing scale (0-10)
  const spacing = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  spacing.forEach(i => {
    classes[`p-${i}`] = { padding: i } as ViewStyle;
    classes[`m-${i}`] = { margin: i } as ViewStyle;
    classes[`px-${i}`] = { paddingLeft: i, paddingRight: i } as ViewStyle;
    classes[`py-${i}`] = { paddingTop: i, paddingBottom: i } as ViewStyle;
    classes[`pt-${i}`] = { paddingTop: i } as ViewStyle;
    classes[`pb-${i}`] = { paddingBottom: i } as ViewStyle;
    classes[`pl-${i}`] = { paddingLeft: i } as ViewStyle;
    classes[`pr-${i}`] = { paddingRight: i } as ViewStyle;
  });
  
  // Colors
  const colors = {
    red: 'red',
    green: 'green',
    blue: 'blue',
    yellow: 'yellow',
    cyan: 'cyan',
    magenta: 'magenta',
    white: 'white',
    black: 'black',
    gray: 'gray',
  };
  
  Object.entries(colors).forEach(([name, color]) => {
    classes[`text-${name}`] = { color } as TextStyle;
    classes[`bg-${name}`] = { backgroundColor: color } as ViewStyle;
    classes[`border-${name}`] = { borderColor: color } as ViewStyle;
  });
  
  // Flexbox
  classes['flex'] = { flexDirection: 'row' } as ViewStyle;
  classes['flex-col'] = { flexDirection: 'column' } as ViewStyle;
  classes['flex-row'] = { flexDirection: 'row' } as ViewStyle;
  classes['items-start'] = { alignItems: 'flex-start' } as ViewStyle;
  classes['items-center'] = { alignItems: 'center' } as ViewStyle;
  classes['items-end'] = { alignItems: 'flex-end' } as ViewStyle;
  classes['justify-start'] = { justifyContent: 'flex-start' } as ViewStyle;
  classes['justify-center'] = { justifyContent: 'center' } as ViewStyle;
  classes['justify-end'] = { justifyContent: 'flex-end' } as ViewStyle;
  classes['justify-between'] = { justifyContent: 'space-between' } as ViewStyle;
  
  // Text styles
  classes['font-bold'] = { bold: true } as TextStyle;
  classes['font-italic'] = { italic: true } as TextStyle;
  classes['underline'] = { underline: true } as TextStyle;
  
  // Borders
  classes['border'] = { borderWidth: 1 } as ViewStyle;
  classes['border-2'] = { borderWidth: 2 } as ViewStyle;
  classes['rounded'] = { borderRadius: 1 } as ViewStyle;
  
  return classes;
}

// Initialize
createStyleLibrary(createTailwindClasses());
```

### Usage

```tsx
import 'react-console-tailwind';
import { View, Text } from 'react-console';

function App() {
  return (
    <View className="flex flex-col p-4 gap-2">
      <Text className="text-cyan font-bold">
        Title
      </Text>
      <View className="flex flex-row gap-2">
        <View className="bg-blue p-2 rounded">
          <Text className="text-white">Card 1</Text>
        </View>
        <View className="bg-green p-2 rounded">
          <Text className="text-white">Card 2</Text>
        </View>
      </View>
    </View>
  );
}
```

## Best Practices

1. **Use consistent naming** - Follow a naming convention (e.g., Tailwind-style)
2. **Group related classes** - Organize by category (layout, colors, typography)
3. **Document your classes** - Provide documentation for your library
4. **Support common patterns** - Include utilities for common use cases
5. **Keep it lightweight** - Only include classes you need
6. **Test with themes** - Ensure your classes work with different themes

## API Reference

### `registerClassNames(mappings)`

Register class name to style mappings:

```typescript
registerClassNames({
  'my-class': { color: 'red', padding: 2 },
});
```

### `registerClass(className, style)`

Register a single class:

```typescript
registerClass('container', { padding: 2, margin: 1 });
```

### `resolveClassName(classNames)`

Resolve class names to style object:

```typescript
const style = resolveClassName('container text-red');
// Returns merged style object
```

### `mergeClassNameWithStyle(className, inlineStyle)`

Merge className styles with inline style (inline takes precedence):

```typescript
const merged = mergeClassNameWithStyle(
  'container',
  { padding: 4 } // Overrides className padding
);
```

### `createStyleLibrary(baseClasses?)`

Helper for library authors:

```typescript
const library = createStyleLibrary({
  'container': { padding: 2 },
});
```

## Examples

See the `examples/` directory for complete style library examples.
