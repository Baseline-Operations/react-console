/**
 * Mouse support example - demonstrates mouse click handling
 */

import React, { useState } from 'react';
import { render, Text, View, Button, LineBreak } from '../src/index';

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState<{ x: number; y: number } | null>(null);

  return (
    <View padding={2}>
      <Text color="cyan" bold>Mouse Support Example</Text>
      <LineBreak />
      <Text>Click the button below (if your terminal supports mouse):</Text>
      <LineBreak />
      <Button
        onClick={(event) => {
          setClickCount((c) => c + 1);
          setLastClick({ x: event.x, y: event.y });
        }}
        label={`Click me! (${clickCount} clicks)`}
      />
      <LineBreak />
      {lastClick && (
        <Text color="green">
          Last click at: ({lastClick.x}, {lastClick.y})
        </Text>
      )}
      <LineBreak />
      <Text color="yellow" dim>
        Note: Mouse support requires a terminal that supports mouse events (most modern terminals do)
      </Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
