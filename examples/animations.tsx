/**
 * Animation Examples
 * Demonstrates various animation types and patterns
 */

import { render } from '../src/index';
import { Animated, Text, View, Button } from '../src/index';
import { useAnimatedValue, useAnimatedColor, useAnimatedStyle } from '../src/animations';
import { useState, useEffect } from 'react';

function App() {
  return (
    <View padding={2}>
      <Text bold color="cyan" size="large">Animation Examples</Text>
      <View marginTop={1}>
        <FadeExample />
        <PulseExample />
        <ColorTransitionExample />
        <AnimatedValueExample />
        <AnimatedStyleExample />
      </View>
    </View>
  );
}

// Fade animation
function FadeExample() {
  const [visible, setVisible] = useState(true);
  
  return (
    <View marginTop={1}>
      <Text bold>Fade Animation</Text>
      {visible && (
        <Animated
          type="fade"
          duration={1000}
        >
          <Text>This text fades in</Text>
        </Animated>
      )}
      <Button onClick={() => setVisible(!visible)}>
        Toggle Fade
      </Button>
    </View>
  );
}

// Pulse animation
function PulseExample() {
  return (
    <View marginTop={1}>
      <Text bold>Pulse Animation</Text>
      <Animated
        type="pulse"
        duration={500}
        iterations="infinite"
      >
        <Text color="green">Pulsing text</Text>
      </Animated>
    </View>
  );
}

// Color transition
function ColorTransitionExample() {
  const [targetColor, setTargetColor] = useState('red');
  const [color, start] = useAnimatedColor('white', targetColor, { duration: 500 });
  
  useEffect(() => {
    start();
  }, [targetColor, start]);
  
  return (
    <View marginTop={1}>
      <Text bold>Color Transition</Text>
      <Text color={color}>
        Color transitions smoothly
      </Text>
      <View marginTop={1}>
        <Button onClick={() => setTargetColor('red')}>Red</Button>
        <Button onClick={() => setTargetColor('green')}>Green</Button>
        <Button onClick={() => setTargetColor('blue')}>Blue</Button>
      </View>
    </View>
  );
}

// Animated value
function AnimatedValueExample() {
  const [target, setTarget] = useState(0);
  const [value, start] = useAnimatedValue(0, target, { duration: 1000 });
  
  useEffect(() => {
    start();
  }, [target, start]);
  
  return (
    <View marginTop={1}>
      <Text bold>Animated Value</Text>
      <Text>Value: {Math.round(value)}</Text>
      <View marginTop={1}>
        <Button onClick={() => setTarget(100)}>Animate to 100</Button>
        <Button onClick={() => setTarget(0)}>Reset</Button>
      </View>
    </View>
  );
}

// Animated style
function AnimatedStyleExample() {
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
    <View marginTop={1}>
      <Text bold>Animated Style</Text>
      <View style={style} border>
        <Text>Animated box</Text>
      </View>
      <Button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Collapse' : 'Expand'}
      </Button>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
