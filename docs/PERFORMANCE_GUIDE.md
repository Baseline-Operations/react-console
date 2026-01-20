# Performance Optimization Guide

This guide covers performance optimization strategies for React Console applications, including best practices, optimization techniques, and common pitfalls.

## Overview

React Console provides a terminal-based UI library that requires careful performance considerations. This guide covers:

- **Render Optimization**: Minimizing re-renders and batching updates
- **Memory Management**: Efficient memory usage patterns
- **Layout Performance**: Optimizing layout calculations
- **Input Handling**: Efficient event handling
- **Large Lists**: Virtual scrolling and pagination
- **Best Practices**: Performance-focused patterns

## Current Optimizations

React Console already includes several performance optimizations:

1. **React Compiler**: Automatic memoization of components
2. **Output Buffering**: Prevents flicker during updates
3. **Layout Calculations**: Pure functions for predictable performance
4. **Component Co-location**: Reduces coupling and improves maintainability

## Render Optimization

### Minimize Re-renders

Use React's optimization features to prevent unnecessary re-renders:

```tsx
import { memo } from 'react';
import { Text, View } from 'react-console';

// Memoize components that don't change often
const StaticContent = memo(() => (
  <View>
    <Text>This content rarely changes</Text>
  </View>
));

function App() {
  const [dynamicValue, setDynamicValue] = useState('');
  
  return (
    <View>
      <StaticContent />
      <Input value={dynamicValue} onChange={(e) => setDynamicValue(e.value as string)} />
    </View>
  );
}
```

### Batch State Updates

Batch multiple state updates to prevent multiple renders:

```tsx
function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // Good: Single state update
  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Avoid: Multiple separate updates
  // setFormData(prev => ({ ...prev, name: value }));
  // setFormData(prev => ({ ...prev, email: value }));
  
  return (
    <View>
      <Input value={formData.name} onChange={(e) => updateForm('name', e.value as string)} />
      <Input value={formData.email} onChange={(e) => updateForm('email', e.value as string)} />
    </View>
  );
}
```

### Use React.useMemo for Expensive Calculations

Memoize expensive calculations:

```tsx
function DataDisplay({ items }: { items: DataItem[] }) {
  // Memoize expensive calculation
  const processedData = useMemo(() => {
    return items.map(item => ({
      ...item,
      processed: expensiveProcessing(item),
    }));
  }, [items]);
  
  return (
    <View>
      {processedData.map(item => (
        <Text key={item.id}>{item.processed}</Text>
      ))}
    </View>
  );
}
```

### Use React.useCallback for Event Handlers

Memoize event handlers passed to child components:

```tsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // Memoize handler to prevent child re-renders
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);
  
  return (
    <View>
      <Child onClick={handleClick} />
      <Text>Count: {count}</Text>
    </View>
  );
}
```

## Layout Performance

### Optimize Style Calculations

Cache style objects when possible:

```tsx
// Good: Memoized style
const staticStyle = useMemo(() => ({
  padding: 2,
  border: 'single',
}), []);

<View style={staticStyle}>
  <Text>Content</Text>
</View>

// Avoid: Creating new object on every render
<View style={{ padding: 2, border: 'single' }}>
  <Text>Content</Text>
</View>
```

### Use StyleSheet API

The `StyleSheet.create` API can optimize style lookups:

```tsx
import { StyleSheet } from 'react-console';

const styles = StyleSheet.create({
  container: {
    padding: 2,
    border: 'single',
  },
  text: {
    color: 'cyan',
    bold: true,
  },
});

<View style={styles.container}>
  <Text style={styles.text}>Styled Text</Text>
</View>
```

### Minimize Nested Layouts

Deeply nested layouts can impact performance:

```tsx
// Good: Flatter structure
<View style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
  <Content1 />
  <Content2 />
</View>

// Avoid: Deep nesting
<View>
  <View>
    <View>
      <Content />
    </View>
  </View>
</View>
```

## Input Handling Performance

### Debounce Rapid Input

Debounce input handlers for rapid typing:

```tsx
import { useMemo, useRef } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout>();
  
  const handleSearch = useCallback((value: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, []);
  
  return (
    <Input
      value={query}
      onChange={(e) => {
        const value = e.value as string;
        setQuery(value);
        handleSearch(value);
      }}
    />
  );
}
```

### Use Controlled Inputs Efficiently

For large forms, use uncontrolled inputs where appropriate:

```tsx
// Good: Controlled input for important fields
<Input
  value={importantField}
  onChange={(e) => setImportantField(e.value as string)}
/>

// Also good: Uncontrolled for less critical fields
<Input
  defaultValue={defaultValue}
  onChange={(e) => {
    // Handle change without state update
    processInput(e.value as string);
  }}
/>
```

## Large Lists Performance

### Use Virtual Scrolling

For large lists, implement virtual scrolling:

```tsx
function VirtualList({ items }: { items: Item[] }) {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleHeight = 10;
  const itemHeight = 1;
  
  // Calculate visible items
  const visibleStart = scrollTop;
  const visibleEnd = Math.min(
    visibleStart + visibleHeight,
    items.length
  );
  const visibleItems = items.slice(visibleStart, visibleEnd);
  
  return (
    <Scrollable
      scrollTop={scrollTop}
      maxHeight={visibleHeight}
      onScroll={(scrollTop) => setScrollTop(scrollTop)}
    >
      {visibleItems.map((item, index) => (
        <Text key={item.id}>
          {items[visibleStart + index]?.label}
        </Text>
      ))}
    </Scrollable>
  );
}
```

### Paginate Large Data

For very large datasets, use pagination:

```tsx
function PaginatedList({ items }: { items: Item[] }) {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  
  const currentPageItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);
  
  return (
    <View>
      <List
        options={currentPageItems.map(item => ({
          label: item.name,
          value: item.id,
        }))}
      />
      <Button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
        Previous
      </Button>
      <Button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * pageSize >= items.length}>
        Next
      </Button>
    </View>
  );
}
```

### Limit List Size

Use `maxHeight` to limit visible items:

```tsx
// Good: Constrained list height
<List
  options={options}
  maxHeight={10}
/>

// Avoid: Rendering all items at once
<List options={options} />
```

## Memory Management

### Clean Up Event Listeners

Remove event listeners on unmount:

```tsx
function Component() {
  useEffect(() => {
    const handleResize = () => {
      // Handle resize
    };
    
    // Add listener
    process.on('SIGWINCH', handleResize);
    
    // Cleanup
    return () => {
      process.removeListener('SIGWINCH', handleResize);
    };
  }, []);
  
  return <View>Content</View>;
}
```

### Avoid Memory Leaks in Closures

Be careful with closures in event handlers:

```tsx
// Good: Use refs for values that don't need to trigger re-renders
function Component() {
  const valueRef = useRef(0);
  
  const handleClick = useCallback(() => {
    valueRef.current += 1;
  }, []);
  
  return <Button onClick={handleClick}>Click</Button>;
}

// Avoid: Creating new functions on every render
function Component() {
  const [value, setValue] = useState(0);
  
  // This creates a new function on every render
  return <Button onClick={() => setValue(v => v + 1)}>Click</Button>;
}
```

## Terminal Resize Optimization

### Debounce Resize Events

Terminal resize events can fire rapidly. Debounce them:

```tsx
function ResponsiveApp() {
  const [dimensions, setDimensions] = useState(getTerminalDimensions());
  const resizeTimer = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
      
      resizeTimer.current = setTimeout(() => {
        setDimensions(getTerminalDimensions());
      }, 100);
    };
    
    process.on('SIGWINCH', handleResize);
    
    return () => {
      process.removeListener('SIGWINCH', handleResize);
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
    };
  }, []);
  
  return (
    <View>
      <Text>Size: {dimensions.columns}x{dimensions.rows}</Text>
    </View>
  );
}
```

### Use Responsive Sizing

Use responsive sizing units to avoid recalculations:

```tsx
// Good: Percentage-based sizing adapts to resize
<View style={{ width: '50%', height: '25%' }}>
  <Text>Responsive</Text>
</View>

// Also good: Fixed sizes when appropriate
<View style={{ width: 80, height: 20 }}>
  <Text>Fixed</Text>
</View>
```

## Performance Monitoring

### Measure Render Times

Use performance timing to identify slow components:

```tsx
function PerformanceMonitor() {
  useEffect(() => {
    const start = performance.now();
    
    // Render component
    
    const end = performance.now();
    console.log(`Render took ${end - start}ms`);
  }, []);
  
  return <View>Content</View>;
}
```

### Profile Component Renders

Use React DevTools Profiler (when available) or custom profiling:

```tsx
function ProfiledComponent({ data }: { data: Data[] }) {
  const renderCount = useRef(0);
  renderCount.current++;
  
  console.log(`Component rendered ${renderCount.current} times`);
  
  return <View>{/* Content */}</View>;
}
```

## Best Practices Summary

1. **Memoize Expensive Calculations**: Use `useMemo` for expensive operations
2. **Memoize Event Handlers**: Use `useCallback` for handlers passed to children
3. **Batch State Updates**: Group related state updates
4. **Use Virtual Scrolling**: For large lists
5. **Debounce Input**: For rapid input events
6. **Debounce Resize**: For terminal resize events
7. **Clean Up Listeners**: Remove event listeners on unmount
8. **Limit Re-renders**: Use `memo` for static components
9. **Optimize Styles**: Cache style objects
10. **Use StyleSheet API**: For optimized style lookups

## Common Pitfalls

### 1. Creating Objects in Render

```tsx
// Bad: New object on every render
<View style={{ padding: 2 }} />

// Good: Memoized or constant
const style = { padding: 2 };
<View style={style} />
```

### 2. Inline Functions in Props

```tsx
// Bad: New function on every render
<Button onClick={() => handleClick()} />

// Good: Memoized function
const handleClick = useCallback(() => { /* ... */ }, []);
<Button onClick={handleClick} />
```

### 3. Unnecessary State Updates

```tsx
// Bad: Updating state with same value
if (value !== newValue) {
  setValue(newValue);
}

// Good: React handles this automatically
setValue(newValue);
```

### 4. Rendering All Items

```tsx
// Bad: Rendering all items
{items.map(item => <Item key={item.id} item={item} />)}

// Good: Virtual scrolling for large lists
{visibleItems.map(item => <Item key={item.id} item={item} />)}
```

## Future Optimizations

The following optimizations are planned for future releases:

1. **Render Batching**: Automatic batching of rapid state changes
2. **Layout Caching**: Cache layout calculations when props haven't changed
3. **Virtual Scrolling**: Built-in virtual scrolling for List component
4. **Style Merging**: Optimized style merging with caching
5. **Component Lazy Loading**: Lazy load components when needed

## Further Reading

- [State Management Guide](./STATE_MANAGEMENT.md) - State management patterns
- [Layout Guide](./LAYOUT_GUIDE.md) - Layout optimization
- [Event Handling Guide](./EVENT_HANDLING_GUIDE.md) - Event handling performance
