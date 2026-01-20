# Layout Guide

This guide covers the layout system in React Console, including flexbox, grid, positioning, and responsive sizing.

## Overview

React Console provides a CSS-like layout system adapted for terminals:
- **Flexbox**: Flexible box layout for one-dimensional layouts
- **Grid**: Two-dimensional grid layout
- **Positioning**: Relative, absolute, and fixed positioning
- **Responsive Sizing**: Percentage, viewport, and character-based units

## Flexbox Layout

### Basic Flexbox

Use `display: 'flex'` to enable flexbox layout:

```tsx
import { View, Text } from 'react-console';

function FlexLayout() {
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
    </View>
  );
}
```

### Flex Direction

Control the main axis direction:

```tsx
// Row (horizontal, left to right)
<View style={{ display: 'flex', flexDirection: 'row' }}>

// Column (vertical, top to bottom)
<View style={{ display: 'flex', flexDirection: 'column' }}>

// Row reverse (horizontal, right to left)
<View style={{ display: 'flex', flexDirection: 'row-reverse' }}>

// Column reverse (vertical, bottom to top)
<View style={{ display: 'flex', flexDirection: 'column-reverse' }}>
```

### Justify Content

Align items along the main axis:

```tsx
// Start (default)
<View style={{ display: 'flex', justifyContent: 'flex-start' }}>

// End
<View style={{ display: 'flex', justifyContent: 'flex-end' }}>

// Center
<View style={{ display: 'flex', justifyContent: 'center' }}>

// Space between
<View style={{ display: 'flex', justifyContent: 'space-between' }}>

// Space around
<View style={{ display: 'flex', justifyContent: 'space-around' }}>

// Space evenly
<View style={{ display: 'flex', justifyContent: 'space-evenly' }}>
```

### Align Items

Align items along the cross axis:

```tsx
// Stretch (default)
<View style={{ display: 'flex', alignItems: 'stretch' }}>

// Start
<View style={{ display: 'flex', alignItems: 'flex-start' }}>

// End
<View style={{ display: 'flex', alignItems: 'flex-end' }}>

// Center
<View style={{ display: 'flex', alignItems: 'center' }}>

// Baseline
<View style={{ display: 'flex', alignItems: 'baseline' }}>
```

### Gap

Add spacing between flex items:

```tsx
// Uniform gap
<View style={{ display: 'flex', gap: 2 }}>

// Different row and column gaps
<View style={{ display: 'flex', gap: { row: 1, column: 2 } }}>

// Or use rowGap and columnGap
<View style={{ display: 'flex', rowGap: 1, columnGap: 2 }}>
```

### Flex Properties

Control how items grow and shrink:

```tsx
// Grow to fill available space
<View style={{ display: 'flex', flex: 1 }}>

// Grow factor
<View style={{ display: 'flex', flexGrow: 2 }}>

// Shrink factor
<View style={{ display: 'flex', flexShrink: 1 }}>

// Initial size
<View style={{ display: 'flex', flexBasis: '50%' }}>
```

### Flex Wrap

Wrap items to multiple lines:

```tsx
// No wrap (default)
<View style={{ display: 'flex', flexWrap: 'nowrap' }}>

// Wrap
<View style={{ display: 'flex', flexWrap: 'wrap' }}>

// Wrap reverse
<View style={{ display: 'flex', flexWrap: 'wrap-reverse' }}>
```

### Align Content

Align wrapped lines:

```tsx
<View style={{
  display: 'flex',
  flexWrap: 'wrap',
  alignContent: 'center', // 'flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'
}}>
```

### Align Self

Override alignment for individual items:

```tsx
<View style={{ display: 'flex' }}>
  <Text>Item 1</Text>
  <Text style={{ alignSelf: 'center' }}>Centered Item</Text>
  <Text>Item 3</Text>
</View>
```

## Grid Layout

### Basic Grid

Use `display: 'grid'` to enable grid layout:

```tsx
import { View, Text } from 'react-console';

function GridLayout() {
  return (
    <View style={{
      display: 'grid',
      gridTemplateColumns: [1, 2, 1], // Fractional units
      gap: 1,
    }}>
      <Text>Cell 1</Text>
      <Text>Cell 2</Text>
      <Text>Cell 3</Text>
      <Text>Cell 4</Text>
    </View>
  );
}
```

### Grid Template Columns

Define column sizes:

```tsx
// Fractional units (1fr, 2fr, etc.)
<View style={{
  display: 'grid',
  gridTemplateColumns: [1, 2, 1], // 1:2:1 ratio
}}>

// Fixed sizes
<View style={{
  display: 'grid',
  gridTemplateColumns: [20, 40, 20], // Fixed character widths
}}>

// Mixed
<View style={{
  display: 'grid',
  gridTemplateColumns: [1, '50%', 20], // Fraction, percentage, fixed
}}>

// Template string
<View style={{
  display: 'grid',
  gridTemplateColumns: '1fr 2fr 1fr',
}}>
```

### Grid Template Rows

Define row sizes:

```tsx
<View style={{
  display: 'grid',
  gridTemplateRows: ['auto', '50%', 'auto'],
}}>
```

### Grid Placement

Place items in specific grid cells:

```tsx
// Column span
<View style={{
  display: 'grid',
  gridColumn: '1 / 3', // Span from column 1 to 3
}}>

// Row span
<View style={{
  display: 'grid',
  gridRow: '1 / 3', // Span from row 1 to 3
}}>

// Specific start/end
<View style={{
  display: 'grid',
  gridColumnStart: 1,
  gridColumnEnd: 3,
  gridRowStart: 1,
  gridRowEnd: 2,
}}>
```

### Grid Area

Use named grid areas:

```tsx
<View style={{
  display: 'grid',
  gridTemplateColumns: [1, 2, 1],
  gridTemplateRows: ['auto', 'auto'],
  gridArea: 'header', // Named area
}}>
```

### Grid Gap

Add spacing between grid items:

```tsx
// Uniform gap
<View style={{ display: 'grid', gap: 1 }}>

// Different row and column gaps
<View style={{ display: 'grid', gap: { row: 1, column: 2 } }}>

// Or use gridGap, rowGap, columnGap
<View style={{ display: 'grid', gridGap: 1, gridRowGap: 1, gridColumnGap: 2 }}>
```

## Positioning

### Relative Positioning

Position relative to normal flow:

```tsx
<View style={{
  position: 'relative',
  left: 5,
  top: 2,
}}>
  Offset content
</View>
```

### Absolute Positioning

Position relative to nearest positioned ancestor:

```tsx
<View style={{ position: 'relative' }}>
  <View style={{
    position: 'absolute',
    left: 10,
    top: 5,
  }}>
    Absolutely positioned
  </View>
</View>
```

### Fixed Positioning

Position relative to terminal viewport:

```tsx
<View style={{
  position: 'fixed',
  right: 0,
  bottom: 0,
}}>
  Fixed to bottom-right corner
</View>
```

### Positioning Properties

```tsx
<View style={{
  position: 'absolute',
  top: 5,        // Distance from top
  right: 10,     // Distance from right
  bottom: 5,     // Distance from bottom
  left: 10,      // Distance from left
  zIndex: 100,   // Stacking order
}}>
```

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

### Responsive Size Resolution

Sizes are resolved based on:
- **Percentage**: Relative to parent size
- **Viewport units (vw/vh)**: Relative to terminal dimensions
- **Character units (ch)**: Based on character width
- **Fixed numbers**: Character count

## Common Layout Patterns

### Centered Content

```tsx
<View style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}}>
  <Text>Centered</Text>
</View>
```

### Sidebar Layout

```tsx
<View style={{ display: 'flex', flexDirection: 'row' }}>
  <View style={{ width: '30%' }}>
    <Text>Sidebar</Text>
  </View>
  <View style={{ flex: 1 }}>
    <Text>Main content</Text>
  </View>
</View>
```

### Card Grid

```tsx
<View style={{
  display: 'grid',
  gridTemplateColumns: [1, 1, 1], // 3 columns
  gap: 1,
}}>
  <View style={{ border: 'single' }}><Text>Card 1</Text></View>
  <View style={{ border: 'single' }}><Text>Card 2</Text></View>
  <View style={{ border: 'single' }}><Text>Card 3</Text></View>
</View>
```

### Header-Body-Footer

```tsx
<View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  <View style={{ height: 'auto' }}>
    <Text>Header</Text>
  </View>
  <View style={{ flex: 1 }}>
    <Text>Body</Text>
  </View>
  <View style={{ height: 'auto' }}>
    <Text>Footer</Text>
  </View>
</View>
```

### Responsive Columns

```tsx
function ResponsiveColumns() {
  return (
    <View style={{ display: 'flex', flexDirection: 'row' }}>
      <View style={{ width: '25%' }}><Text>25%</Text></View>
      <View style={{ width: '50%' }}><Text>50%</Text></View>
      <View style={{ width: '25%' }}><Text>25%</Text></View>
    </View>
  );
}
```

## Padding and Margins

### Padding

```tsx
// Uniform
<View style={{ padding: 2 }} />

// Individual
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
// Uniform
<View style={{ margin: 1 }} />

// Individual
<View style={{
  margin: {
    top: 0,
    right: 1,
    bottom: 0,
    left: 1,
  },
}} />
```

## Borders

### Simple Border

```tsx
<View style={{ border: true }} />
```

### Border Styles

```tsx
<View style={{
  border: true,
  borderStyle: 'double', // 'single', 'double', 'thick', 'dashed', 'dotted'
  borderColor: 'cyan',
}} />
```

### Individual Borders

```tsx
<View style={{
  border: {
    top: true,
    bottom: true,
  },
  borderStyle: 'thick',
}} />
```

## Overflow Handling

### Overflow Options

```tsx
// Visible (default)
<View style={{ overflow: 'visible' }} />

// Hidden
<View style={{ overflow: 'hidden' }} />

// Scroll (requires scrollable prop)
<View style={{ overflow: 'scroll', scrollable: true }} />

// Individual axes
<View style={{ overflowX: 'hidden', overflowY: 'scroll' }} />
```

## Best Practices

### 1. Use Flexbox for One-Dimensional Layouts

```tsx
// Good: Simple row/column layout
<View style={{ display: 'flex', flexDirection: 'row' }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>
```

### 2. Use Grid for Two-Dimensional Layouts

```tsx
// Good: Complex grid layout
<View style={{
  display: 'grid',
  gridTemplateColumns: [1, 2, 1],
  gridTemplateRows: ['auto', 'auto'],
}}>
```

### 3. Prefer Responsive Sizes

```tsx
// Good: Adapts to terminal size
<View style={{ width: '50%' }} />

// Less flexible: Fixed size
<View style={{ width: 40 }} />
```

### 4. Use Flex Properties for Flexible Items

```tsx
<View style={{ display: 'flex' }}>
  <View style={{ flex: 1 }}>Flexible</View>
  <View style={{ width: 20 }}>Fixed</View>
</View>
```

### 5. Combine Layout Systems

```tsx
<View style={{ display: 'flex', flexDirection: 'column' }}>
  <View style={{ display: 'grid', gridTemplateColumns: [1, 1] }}>
    <Text>Grid item 1</Text>
    <Text>Grid item 2</Text>
  </View>
</View>
```

## Troubleshooting

### Items Not Aligning

1. Check flex direction matches your intent
2. Verify justifyContent and alignItems values
3. Ensure parent has defined dimensions

### Grid Not Working

1. Verify `display: 'grid'` is set
2. Check gridTemplateColumns/Rows are defined
3. Ensure children are placed correctly

### Responsive Sizes Not Working

1. Check parent has defined width/height
2. Verify percentage calculations
3. Ensure terminal dimensions are available

### Positioning Issues

1. Verify position type (relative/absolute/fixed)
2. Check z-index for overlapping elements
3. Ensure parent is positioned for absolute children

## Further Reading

- [Styling Guide](./STYLING_GUIDE.md) - Detailed styling documentation
- [State Management Guide](./STATE_MANAGEMENT.md) - State management patterns
- [Architecture Guide](./ARCHITECTURE.md) - System architecture
