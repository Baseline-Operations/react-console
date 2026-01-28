/**
 * Test Button Click, Hover, and Toggle
 * Run this directly in your terminal to test mouse events
 * 
 * Usage: npx tsx examples/test-button-click.tsx
 * Then hover over and click on the buttons
 * 
 * Button states:
 * - Normal: white background, black text
 * - Hover: cyan background, black text, bold
 * - Pressed: blue background, white text, bold
 */

import React, { useState } from 'react';
import { render, View, Text, Button } from '../src/index';

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [lastEvent, setLastEvent] = useState('none');
  const [color, setColor] = useState('white');
  const [showBox, setShowBox] = useState(true);
  
  return (
    <View style={{ padding: 2 }}>
      <Text bold color="cyan">Button Click, Hover & Toggle Test</Text>
      <Text>Click count: {clickCount}</Text>
      <Text>Last event: {lastEvent}</Text>
      <Text>Current color: {color}</Text>
      
      <View style={{ margin: { top: 1 } }}>
        <Text>Try hovering and clicking these buttons:</Text>
      </View>
      
      <View style={{ margin: { top: 1 }, flexDirection: 'row', gap: 2 }}>
        <Button 
          onClick={() => {
            setClickCount(c => c + 1);
            setLastEvent('click - increment');
          }}
        >
          Click Me!
        </Button>
        
        <Button 
          onClick={() => {
            setLastEvent('click - reset');
            setClickCount(0);
          }}
        >
          Reset
        </Button>
      </View>
      
      <View style={{ margin: { top: 1 } }}>
        <Text>Color buttons:</Text>
      </View>
      
      <View style={{ margin: { top: 1 }, flexDirection: 'row', gap: 1 }}>
        <Button onClick={() => { setColor('red'); setLastEvent('click - red'); }}>Red</Button>
        <Button onClick={() => { setColor('green'); setLastEvent('click - green'); }}>Green</Button>
        <Button onClick={() => { setColor('blue'); setLastEvent('click - blue'); }}>Blue</Button>
      </View>
      
      <View style={{ margin: { top: 1 } }}>
        <Text color={color}>This text should change color</Text>
      </View>
      
      <View style={{ margin: { top: 1 } }}>
        <Text>Toggle test (tests component unmounting):</Text>
      </View>
      
      <View style={{ margin: { top: 1 }, flexDirection: 'row', gap: 2 }}>
        <Button onClick={() => { setShowBox(!showBox); setLastEvent('click - toggle'); }}>
          Toggle Box
        </Button>
      </View>
      
      {showBox && (
        <View style={{ margin: { top: 1 }, padding: 1, backgroundColor: 'blue' }}>
          <Text color="white">This box can be toggled</Text>
        </View>
      )}
      
      <View style={{ margin: { top: 2 } }}>
        <Text dim>Press Ctrl+C to quit</Text>
      </View>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
