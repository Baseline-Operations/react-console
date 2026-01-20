# Animation Guide

Complete guide to using animations in React Console applications.

## Overview

React Console provides a comprehensive animation system for terminal applications, including text animations, layout animations, loading animations, and effect animations.

## Quick Start

### Basic Animation

```tsx
import { Animated, Text } from 'react-console';

<Animated type="fade" duration={1000}>
  <Text>Fading text</Text>
</Animated>
```

### Animation Hooks

```tsx
import { useAnimatedValue, useAnimatedColor } from 'react-console/animations';

const value = useAnimatedValue(100, { duration: 500 });
const color = useAnimatedColor('red', { duration: 300 });
```

## Animation Types

### Text Animations

#### Fade

Fade in/out using color intensity:

```tsx
<Animated type="fade" duration={1000} visible={isVisible}>
  <Text>Fading text</Text>
</Animated>
```

#### Typewriter

Character-by-character reveal:

```tsx
<Animated type="typewriter" duration={2000}>
  <Text>This text types out character by character</Text>
</Animated>
```

#### Blink

Dim/bright toggle:

```tsx
<Animated type="blink" duration={500} iterations="infinite">
  <Text>Blinking text</Text>
</Animated>
```

#### Color Transitions

Smooth color changes:

```tsx
import { useAnimatedColor } from 'react-console/animations';

function ColorText() {
  const color = useAnimatedColor('red', { duration: 500 });
  return <Text color={color}>Color transitions</Text>;
}
```

### Layout Animations

#### Slide

Slide in/out using cursor movement:

```tsx
<Animated type="slide" direction="left" duration={500}>
  <View>Sliding content</View>
</Animated>
```

#### Expand/Collapse

Height/width changes:

```tsx
import { useAnimatedStyle } from 'react-console/animations';

function ExpandableBox() {
  const [expanded, setExpanded] = useState(false);
  const style = useAnimatedStyle(
    { height: expanded ? 10 : 5 },
    { duration: 300 }
  );
  
  return (
    <View style={style}>
      <Text>Expandable content</Text>
    </View>
  );
}
```

### Loading Animations

#### Spinner

Rotating characters:

```tsx
import { Spinner } from 'react-console';

<Spinner />
```

#### Progress Bar

Smooth fill animation:

```tsx
import { ProgressBar, useAnimatedValue } from 'react-console';

function AnimatedProgress() {
  const progress = useAnimatedValue(75, { duration: 1000 });
  return <ProgressBar value={progress} max={100} />;
}
```

#### Pulse

Dim/bright cycle:

```tsx
<Animated type="pulse" duration={500} iterations="infinite">
  <Text>Loading...</Text>
</Animated>
```

### Effect Animations

#### Shake

Rapid position changes:

```tsx
<Animated type="shake" duration={300}>
  <Text>Shaking text</Text>
</Animated>
```

#### Bounce

Position oscillation:

```tsx
<Animated type="bounce" duration={500} iterations={3}>
  <Text>Bouncing text</Text>
</Animated>
```

## Animation Component

### `<Animated>`

Wrapper component for animating any component:

```tsx
<Animated
  type="fade"              // Animation type
  duration={1000}          // Duration in ms
  delay={0}                // Delay before start
  iterations={1}           // Number of iterations ('infinite' for loop)
  easing="ease-in-out"     // Easing function
  visible={true}           // Visibility (for fade)
  direction="left"         // Direction (for slide)
>
  <Text>Animated content</Text>
</Animated>
```

### Props

- `type` - Animation type: `'fade' | 'slide' | 'spin' | 'pulse' | 'bounce' | 'typewriter' | 'blink' | 'shake'`
- `duration` - Animation duration in milliseconds
- `delay` - Delay before animation starts
- `iterations` - Number of iterations (`number` or `'infinite'`)
- `easing` - Easing function name
- `visible` - Visibility state (for fade animations)
- `direction` - Slide direction: `'left' | 'right' | 'up' | 'down'`

## Animation Hooks

### `useAnimatedValue(from, to, config?)`

Animate a numeric value:

```tsx
import { useAnimatedValue } from 'react-console/animations';

function Counter() {
  const [target, setTarget] = useState(0);
  const [value, start] = useAnimatedValue(0, target, {
    duration: 1000,
    easing: easing.easeOut,
  });
  
  useEffect(() => {
    start();
  }, [target, start]);
  
  return (
    <View>
      <Text>Count: {Math.round(value)}</Text>
      <Button onClick={() => setTarget(100)}>Animate to 100</Button>
    </View>
  );
}
```

### `useAnimatedColor(from, to, config?)`

Animate color transitions:

```tsx
import { useAnimatedColor } from 'react-console/animations';

function ColorChanger() {
  const [targetColor, setTargetColor] = useState('red');
  const [color, start] = useAnimatedColor('white', targetColor, { duration: 500 });
  
  useEffect(() => {
    start();
  }, [targetColor, start]);
  
  return (
    <Text color={color}>
      Color transitions smoothly
    </Text>
  );
}
```

### `useAnimatedStyle(from, to, config?)`

Animate style properties:

```tsx
import { useAnimatedStyle } from 'react-console/animations';

function Expandable() {
  const [expanded, setExpanded] = useState(false);
  const [style, start] = useAnimatedStyle(
    { width: 20, height: 5 },
    { width: expanded ? 50 : 20, height: expanded ? 10 : 5 },
    { duration: 500 }
  );
  
  useEffect(() => {
    start();
  }, [expanded, start]);
  
  return (
    <View style={style} border>
      <Text>Animated box</Text>
    </View>
  );
}
```

## Easing Functions

Available easing functions:

- `'linear'` - Constant speed
- `'ease-in'` - Slow start
- `'ease-out'` - Slow end
- `'ease-in-out'` - Slow start and end
- `'cubic-in'`, `'cubic-out'`, `'cubic-in-out'`
- `'quad-in'`, `'quad-out'`, `'quad-in-out'`

```tsx
<Animated
  type="fade"
  duration={1000}
  easing="ease-in-out"
>
  <Text>Smooth animation</Text>
</Animated>
```

## Performance Considerations

### Frame Rate

Animations are optimized for terminal rendering (default: 10 FPS):

```tsx
import { FrameRateController } from 'react-console/animations';

// Custom frame rate
const controller = new FrameRateController({ fps: 15 });
```

### Only Animate Visible Components

Animations automatically pause when components are not visible:

```tsx
<Animated type="pulse" duration={500}>
  {isVisible && <Text>Only animates when visible</Text>}
</Animated>
```

## Examples

### Loading Spinner with Pulse

```tsx
function LoadingScreen() {
  return (
    <View>
      <Animated type="pulse" duration={500} iterations="infinite">
        <Spinner />
      </Animated>
      <Text>Loading...</Text>
    </View>
  );
}
```

### Progress Animation

```tsx
function AnimatedProgress() {
  const [progress, setProgress] = useState(0);
  const animatedProgress = useAnimatedValue(progress, { duration: 1000 });
  
  useEffect(() => {
    setProgress(100);
  }, []);
  
  return <ProgressBar value={animatedProgress} max={100} />;
}
```

### Slide-in Menu

```tsx
function SlideMenu({ isOpen }: { isOpen: boolean }) {
  return (
    <Animated
      type="slide"
      direction="left"
      duration={300}
      visible={isOpen}
    >
      <View style={{ width: 30 }}>
        <Text>Menu Content</Text>
      </View>
    </Animated>
  );
}
```

### Color-coded Status

```tsx
function StatusIndicator({ status }: { status: 'ok' | 'warning' | 'error' }) {
  const colorMap = {
    ok: 'green',
    warning: 'yellow',
    error: 'red',
  };
  
  const color = useAnimatedColor(colorMap[status], { duration: 300 });
  
  return <Text color={color}>● Status: {status}</Text>;
}
```

## Best Practices

1. **Keep durations short** - Terminal animations should be quick (200-1000ms)
2. **Use appropriate types** - Choose animation types that work well in terminals
3. **Limit simultaneous animations** - Too many animations can cause flicker
4. **Test frame rates** - Adjust FPS based on terminal performance
5. **Use hooks for complex animations** - Hooks provide more control
6. **Consider accessibility** - Some users may prefer reduced motion

## API Reference

See the [Animations API Documentation](./api/animations.md) for complete API reference.
