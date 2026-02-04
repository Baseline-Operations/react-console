/**
 * Animation Examples
 * Demonstrates various animation types and patterns
 */

import React, { useState, useEffect } from 'react';
import { render, Text, View, Button } from '../src/index';
import { Animated } from '../src/components/Animated';
import { useAnimatedValue, useAnimatedColor, useAnimatedStyle } from '../src/animations';

function App() {
  return (
    <View padding={2}>
      <Text bold color="cyan">
        Animation Examples
      </Text>
      <View style={{ margin: { top: 1 } }}>
        <FadeExample />
        <PulseExample />
        <ColorTransitionExample />
        <AnimatedValueExample />
        <AnimatedStyleExample />
      </View>
    </View>
  );
}

// Fade animation - keeps component mounted and toggles direction
function FadeExample() {
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [key, setKey] = useState(0); // Key to restart animation

  const toggle = () => {
    setDirection((prev) => (prev === 'in' ? 'out' : 'in'));
    setKey((k) => k + 1); // Restart animation with new direction
  };

  return (
    <View style={{ margin: { top: 1 } }}>
      <Text bold>Fade Animation</Text>
      <Animated key={key} type="fade" direction={direction} duration={1000}>
        <Text>This text fades {direction}</Text>
      </Animated>
      <Button onClick={toggle}>Fade {direction === 'in' ? 'Out' : 'In'}</Button>
    </View>
  );
}

// Pulse animation
function PulseExample() {
  return (
    <View style={{ margin: { top: 1 } }}>
      <Text bold>Pulse Animation</Text>
      <Animated type="pulse" duration={500} iterations={Infinity}>
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
    <View style={{ margin: { top: 1 } }}>
      <Text bold>Color Transition</Text>
      <Text color={color}>Color transitions smoothly</Text>
      <View style={{ margin: { top: 1 } }}>
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
    <View style={{ margin: { top: 1 } }}>
      <Text bold>Animated Value</Text>
      <Text>Value: {Math.round(value)}</Text>
      <View style={{ margin: { top: 1 } }}>
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
    <View style={{ margin: { top: 1 } }}>
      <Text bold>Animated Style</Text>
      <View style={{ ...style, border: true }}>
        <Text>Animated box</Text>
      </View>
      <Button onClick={() => setExpanded(!expanded)}>{expanded ? 'Collapse' : 'Expand'}</Button>
    </View>
  );
}

// Run the app
render(<App />, { mode: 'interactive' });

export default App;
