/**
 * Slide Animation Examples
 * Demonstrates slide animations from different directions
 */

import React, { useState } from 'react';
import { render, View, Text, Button } from '../src/index';
import { Animated } from '../src/components/Animated';

// Slide In from Left
function SlideInFromLeft() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginTop: 1, marginBottom: 1 }}>
      <Text bold color="cyan">
        Slide In from Left
      </Text>
      {visible && (
        <Animated type="slide" direction="in" from="left" distance={30} duration={600}>
          <Text>← I slid in from the left!</Text>
        </Animated>
      )}
      <Button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</Button>
    </View>
  );
}

// Slide In from Right
function SlideInFromRight() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginTop: 1, marginBottom: 1 }}>
      <Text bold color="green">
        Slide In from Right
      </Text>
      {visible && (
        <Animated type="slide" direction="in" from="right" distance={30} duration={600}>
          <Text>I slid in from the right! →</Text>
        </Animated>
      )}
      <Button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</Button>
    </View>
  );
}

// Slide In from Top
function SlideInFromTop() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginTop: 1, marginBottom: 1 }}>
      <Text bold color="yellow">
        Slide In from Top
      </Text>
      {visible && (
        <Animated type="slide" direction="in" from="top" distance={3} duration={600}>
          <Text>↓ I slid in from the top!</Text>
        </Animated>
      )}
      <Button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</Button>
    </View>
  );
}

// Slide In from Bottom
function SlideInFromBottom() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginTop: 1, marginBottom: 1 }}>
      <Text bold color="magenta">
        Slide In from Bottom
      </Text>
      {visible && (
        <Animated type="slide" direction="in" from="bottom" distance={3} duration={600}>
          <Text>↑ I slid in from the bottom!</Text>
        </Animated>
      )}
      <Button onClick={() => setVisible(!visible)}>{visible ? 'Hide' : 'Show'}</Button>
    </View>
  );
}

// Slide Out to Left (keeps component mounted, toggles direction)
function SlideOutToLeft() {
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [key, setKey] = useState(0);

  const toggle = () => {
    setDirection((prev) => (prev === 'in' ? 'out' : 'in'));
    setKey((k) => k + 1);
  };

  return (
    <View style={{ marginTop: 1, marginBottom: 1 }}>
      <Text bold color="red">
        Slide to Left
      </Text>
      <Animated key={key} type="slide" direction={direction} from="left" distance={30} duration={600}>
        <Text>← Sliding {direction}...</Text>
      </Animated>
      <Button onClick={toggle}>Slide {direction === 'in' ? 'Out' : 'In'}</Button>
    </View>
  );
}

// Slide Out to Right (keeps component mounted, toggles direction)
function SlideOutToRight() {
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const [key, setKey] = useState(0);

  const toggle = () => {
    setDirection((prev) => (prev === 'in' ? 'out' : 'in'));
    setKey((k) => k + 1);
  };

  return (
    <View style={{ marginTop: 1, marginBottom: 1 }}>
      <Text bold color="blue">
        Slide to Right
      </Text>
      <Animated key={key} type="slide" direction={direction} from="right" distance={30} duration={600}>
        <Text>Sliding {direction}... →</Text>
      </Animated>
      <Button onClick={toggle}>Slide {direction === 'in' ? 'Out' : 'In'}</Button>
    </View>
  );
}

// Main App
function App() {
  return (
    <View style={{ padding: 1 }}>
      <Text bold underline>
        Slide Animation Examples
      </Text>
      <Text dim>Click buttons to trigger slide animations from different directions</Text>

      <View style={{ marginTop: 1 }}>
        <Text bold color="white">
          SLIDE IN:
        </Text>
        <SlideInFromLeft />
        <SlideInFromRight />
        <SlideInFromTop />
        <SlideInFromBottom />
      </View>

      <View style={{ marginTop: 1 }}>
        <Text bold color="white">
          SLIDE IN/OUT (Toggle):
        </Text>
        <SlideOutToLeft />
        <SlideOutToRight />
      </View>

      <View style={{ marginTop: 2 }}>
        <Text dim>Press Ctrl+C to exit</Text>
      </View>
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
