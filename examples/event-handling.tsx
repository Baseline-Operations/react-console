/**
 * Event Handling Example - Demonstrates all event handling patterns
 * Shows keyboard events, mouse events, focus management, and event propagation
 */

import React, { useState } from 'react';
import { render, Text, View, Input, Button, Radio, Checkbox, List, LineBreak, Box } from '../src/index';

function App() {
  const [keyEvents, setKeyEvents] = useState<string[]>([]);
  const [mouseEvents, setMouseEvents] = useState<string[]>([]);
  const [focusEvents, setFocusEvents] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('opt1');
  const [checked, setChecked] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  return (
    <View padding={2}>
      <Text color="cyan" bold>Event Handling Example</Text>
      <LineBreak />
      
      <Text color="yellow" bold>1. Keyboard Events</Text>
      <Text>Press keys in the input below to see keyboard events:</Text>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.value as string)}
        onKeyDown={(e) => {
          const eventDesc = `Key: ${e.key.return ? 'Enter' : e.key.escape ? 'Escape' : e.key.char || 'Special'}`;
          setKeyEvents(prev => [eventDesc, ...prev].slice(0, 5));
        }}
        onKeyPress={(e) => {
          if (e.key.char) {
            setKeyEvents(prev => [`Press: ${e.key.char}`, ...prev].slice(0, 5));
          }
        }}
        placeholder="Type here and see events..."
        autoFocus
      />
      {keyEvents.length > 0 && (
        <Box style={{ border: 'single', padding: 1, marginTop: 1 } as any}>
          <Text color="gray" dim>Recent keyboard events:</Text>
          {keyEvents.map((event, i) => (
            <Text key={i} color="gray">{event}</Text>
          ))}
        </Box>
      )}
      <LineBreak />

      <Text color="yellow" bold>2. Mouse Events</Text>
      <Text>Click the button below to see mouse events:</Text>
      <Button
        onClick={(e) => {
          const eventDesc = `Click at (${e.x}, ${e.y}), button: ${e.button || 0}`;
          setMouseEvents(prev => [eventDesc, ...prev].slice(0, 5));
        }}
        onMouseDown={(e) => {
          setMouseEvents(prev => [`Mouse down at (${e.x}, ${e.y})`, ...prev].slice(0, 5));
        }}
        onMouseUp={(e) => {
          setMouseEvents(prev => [`Mouse up at (${e.x}, ${e.y})`, ...prev].slice(0, 5));
        }}
      >
        Click Me
      </Button>
      {mouseEvents.length > 0 && (
        <Box style={{ border: 'single', padding: 1, marginTop: 1 } as any}>
          <Text color="gray" dim>Recent mouse events:</Text>
          {mouseEvents.map((event, i) => (
            <Text key={i} color="gray">{event}</Text>
          ))}
        </Box>
      )}
      <LineBreak />

      <Text color="yellow" bold>3. Focus Management</Text>
      <Text>Tab between inputs to see focus events:</Text>
      <Input
        placeholder="Input 1"
        onFocus={() => setFocusEvents(prev => ['Input 1 focused', ...prev].slice(0, 5))}
        onBlur={() => setFocusEvents(prev => ['Input 1 blurred', ...prev].slice(0, 5))}
      />
      <Input
        placeholder="Input 2"
        onFocus={() => setFocusEvents(prev => ['Input 2 focused', ...prev].slice(0, 5))}
        onBlur={() => setFocusEvents(prev => ['Input 2 blurred', ...prev].slice(0, 5))}
      />
      {focusEvents.length > 0 && (
        <Box style={{ border: 'single', padding: 1, marginTop: 1 } as any}>
          <Text color="gray" dim>Recent focus events:</Text>
          {focusEvents.map((event, i) => (
            <Text key={i} color="gray">{event}</Text>
          ))}
        </Box>
      )}
      <LineBreak />

      <Text color="yellow" bold>4. Selection Component Events</Text>
      <Text>Radio selection:</Text>
      <Radio
        options={[
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
          { label: 'Option 3', value: 'opt3' },
        ]}
        value={selected}
        onChange={(e) => {
          setSelected(e.value as string);
          setKeyEvents(prev => [`Radio selected: ${e.value}`, ...prev].slice(0, 5));
        }}
      />
      <Text>Checkbox selection:</Text>
      <Checkbox
        options={[
          { label: 'Check 1', value: 'check1' },
          { label: 'Check 2', value: 'check2' },
        ]}
        value={checked}
        onChange={(e) => {
          setChecked(e.value as string[]);
          setKeyEvents(prev => [`Checkbox changed: ${JSON.stringify(e.value)}`, ...prev].slice(0, 5));
        }}
      />
      <LineBreak />

      <Text color="yellow" bold>5. Event Propagation</Text>
      <Text>Press Escape in input to prevent default behavior:</Text>
      <Input
        placeholder="Press Escape"
        onKeyDown={(e) => {
          if (e.key.escape) {
            e.preventDefault?.();
            setKeyEvents(prev => ['Escape prevented (default behavior stopped)', ...prev].slice(0, 5));
          }
        }}
      />
      <LineBreak />

      <Text color="yellow" bold>6. Disabled State</Text>
      <Text>Disabled components don't receive events:</Text>
      <Button disabled onClick={() => setMouseEvents(prev => ['This should not fire', ...prev])}>
        Disabled Button
      </Button>
      <Input
        disabled
        placeholder="Disabled input"
        onChange={() => setKeyEvents(prev => ['This should not fire', ...prev])}
      />
      <LineBreak />

      <Text color="gray" dim>Use Tab to navigate, click buttons, type in inputs. Press Ctrl+C to exit.</Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
