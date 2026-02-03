/**
 * State-Based Styling Example
 * Demonstrates hoveredStyle, focusedStyle, pressedStyle, disabledStyle
 */

import React, { useState } from 'react';
import { render, View, Text, Pressable, Box, Button } from '../src/index';

function StateStylesExample() {
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>State-Based Styling Examples</Text>

      {/* Basic state styles */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ marginBottom: 1 }}>1. Individual state style props:</Text>
        <Pressable
          onPress={() => setCount((c) => c + 1)}
          style={{
            padding: 1,
            border: 'single',
            backgroundColor: 'gray',
          }}
          hoveredStyle={{ backgroundColor: 'blue' }}
          focusedStyle={{ borderColor: 'yellow', border: 'double' }}
          pressedStyle={{ backgroundColor: 'darkblue' }}
        >
          <Text>Press me! Count: {count}</Text>
        </Pressable>
      </View>

      {/* Function-based style (React Native Pressable pattern) */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ marginBottom: 1 }}>2. Function-based style (RN pattern):</Text>
        <Pressable
          onPress={() => setCount((c) => c + 1)}
          style={({ pressed, focused, hovered }) => ({
            padding: 1,
            border: focused ? 'double' : 'single',
            borderColor: focused ? 'yellow' : 'white',
            backgroundColor: pressed ? 'darkgreen' : hovered ? 'green' : 'gray',
          })}
        >
          {({ pressed, focused, hovered }) => (
            <Text>
              {pressed ? 'Pressing...' : hovered ? 'Hovering!' : focused ? 'Focused!' : 'Idle'}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Disabled state */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ marginBottom: 1 }}>3. Disabled state styling:</Text>
        <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          <Pressable
            onPress={() => setCount((c) => c + 1)}
            disabled={disabled}
            style={{
              padding: 1,
              border: 'single',
              backgroundColor: 'blue',
            }}
            disabledStyle={{
              backgroundColor: 'gray',
              borderColor: 'darkgray',
            }}
            hoveredStyle={{ backgroundColor: 'lightblue' }}
          >
            <Text style={{ color: disabled ? 'darkgray' : 'white' }}>
              {disabled ? 'Disabled' : 'Enabled'}
            </Text>
          </Pressable>

          <Button onPress={() => setDisabled((d) => !d)}>Toggle Disabled</Button>
        </View>
      </View>

      {/* Multiple interactive elements */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ marginBottom: 1 }}>4. Multiple interactive items:</Text>
        <View style={{ flexDirection: 'row', gap: 1 }}>
          {['Red', 'Green', 'Blue', 'Yellow'].map((color) => (
            <Pressable
              key={color}
              onPress={() => console.log(`${color} pressed`)}
              style={{
                padding: 1,
                border: 'single',
                minWidth: 8,
              }}
              focusedStyle={{
                borderColor: color.toLowerCase(),
                border: 'double',
              }}
              pressedStyle={{
                backgroundColor: color.toLowerCase(),
              }}
            >
              <Text>{color}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={{ marginTop: 2, color: 'cyan' }}>
        Use Tab to navigate between elements, Enter/Space to press
      </Text>
      <Text style={{ color: 'gray' }}>Hover with mouse (if terminal supports it)</Text>
    </Box>
  );
}

render(<StateStylesExample />);
