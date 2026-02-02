/**
 * Event Handling Example - Demonstrates all event handling patterns
 * Shows keyboard events, mouse events, focus management, and event propagation
 */

import React, { useState } from 'react';
import {
  render,
  Text,
  View,
  Input,
  Button,
  Radio,
  Checkbox,
  LineBreak,
  Box,
  ScrollView,
} from '../src/index';

// Track which event log is currently shown (only one at a time)
type ActiveLog = 'keyboard' | 'mouse' | 'focus' | null;

function App() {
  const [activeLog, setActiveLog] = useState<ActiveLog>(null);
  const [keyEvents, setKeyEvents] = useState<string[]>([]);
  const [mouseEvents, setMouseEvents] = useState<string[]>([]);
  const [focusEvents, setFocusEvents] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('opt1');
  const [checked, setChecked] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [logLines, setLogLines] = useState<string[]>([
    'Log started...',
    'Click the button to add lines',
  ]);
  const [logCounter, setLogCounter] = useState(0);

  return (
    <View padding={1}>
      <Text color="cyan" bold>
        Event Handling Example
      </Text>
      <Text color="gray" dim>
        Scroll with mouse wheel or Tab through components
      </Text>
      <LineBreak />

      <ScrollView
        maxHeight={18}
        showsVerticalScrollIndicator
        scrollbarStyle={{ thumbColor: 'cyan', trackColor: 'gray' }}
      >
        <Text color="yellow" bold>
          1. Keyboard Events
        </Text>
        <Text>Press keys in the input below to see keyboard events:</Text>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.value as string)}
          onFocus={() => setActiveLog('keyboard')}
          onKeyDown={(e) => {
            setActiveLog('keyboard');
            const eventDesc = `Key: ${e.key.return ? 'Enter' : e.key.escape ? 'Escape' : e.key.char || 'Special'}`;
            setKeyEvents((prev) => [eventDesc, ...prev].slice(0, 5));
          }}
          onKeyPress={(e) => {
            if (e.key.char) {
              setActiveLog('keyboard');
              setKeyEvents((prev) => [`Press: ${e.key.char}`, ...prev].slice(0, 5));
            }
          }}
          placeholder="Type here and see events..."
          autoFocus
        />
        {activeLog === 'keyboard' && keyEvents.length > 0 && (
          <Box style={{ border: 'single', padding: 1, margin: { top: 1 } }}>
            <Text color="gray" dim>
              Recent keyboard events:
            </Text>
            {keyEvents.map((event, i) => (
              <Text key={i} color="gray">
                {event}
              </Text>
            ))}
          </Box>
        )}
        <LineBreak />

        <Text color="yellow" bold>
          2. Mouse Events
        </Text>
        <Text>Click the button below to see mouse events:</Text>
        <Button
          label="Click Me"
          onClick={(e) => {
            setActiveLog('mouse');
            const eventDesc = `Click at (${e.x}, ${e.y}), button: ${e.button || 0}`;
            setMouseEvents((prev) => [eventDesc, ...prev].slice(0, 5));
          }}
          onMouseDown={(e) => {
            setActiveLog('mouse');
            setMouseEvents((prev) => [`Mouse down at (${e.x}, ${e.y})`, ...prev].slice(0, 5));
          }}
          onMouseUp={(e) => {
            setActiveLog('mouse');
            setMouseEvents((prev) => [`Mouse up at (${e.x}, ${e.y})`, ...prev].slice(0, 5));
          }}
        />
        {activeLog === 'mouse' && mouseEvents.length > 0 && (
          <Box style={{ border: 'single', padding: 1, margin: { top: 1 } }}>
            <Text color="gray" dim>
              Recent mouse events:
            </Text>
            {mouseEvents.map((event, i) => (
              <Text key={i} color="gray">
                {event}
              </Text>
            ))}
          </Box>
        )}
        <LineBreak />

        <Text color="yellow" bold>
          3. Focus Management
        </Text>
        <Text>Tab between inputs to see focus events:</Text>
        <Input
          placeholder="Input 1"
          onFocus={() => {
            setActiveLog('focus');
            setFocusEvents((prev) => ['Input 1 focused', ...prev].slice(0, 5));
          }}
          onBlur={() => setFocusEvents((prev) => ['Input 1 blurred', ...prev].slice(0, 5))}
        />
        <Input
          placeholder="Input 2"
          onFocus={() => {
            setActiveLog('focus');
            setFocusEvents((prev) => ['Input 2 focused', ...prev].slice(0, 5));
          }}
          onBlur={() => setFocusEvents((prev) => ['Input 2 blurred', ...prev].slice(0, 5))}
        />
        {activeLog === 'focus' && focusEvents.length > 0 && (
          <Box style={{ border: 'single', padding: 1, margin: { top: 1 } }}>
            <Text color="gray" dim>
              Recent focus events:
            </Text>
            {focusEvents.map((event, i) => (
              <Text key={i} color="gray">
                {event}
              </Text>
            ))}
          </Box>
        )}
        <LineBreak />

        <Text color="yellow" bold>
          4. Selection Component Events
        </Text>
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
            setKeyEvents((prev) => [`Radio selected: ${e.value}`, ...prev].slice(0, 5));
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
            setKeyEvents((prev) =>
              [`Checkbox changed: ${JSON.stringify(e.value)}`, ...prev].slice(0, 5)
            );
          }}
        />
        <LineBreak />

        <Text color="yellow" bold>
          5. Event Propagation
        </Text>
        <Text>Press Escape in input to prevent default behavior:</Text>
        <Input
          placeholder="Press Escape"
          onKeyDown={(e) => {
            if (e.key.escape) {
              e.preventDefault?.();
              setActiveLog('keyboard');
              setKeyEvents((prev) =>
                ['Escape prevented (default behavior stopped)', ...prev].slice(0, 5)
              );
            }
          }}
        />
        <LineBreak />

        <Text color="yellow" bold>
          6. Disabled State
        </Text>
        <Text>Disabled components don&apos;t receive events:</Text>
        <Button
          label="Disabled Button"
          disabled
          onClick={() => setMouseEvents((prev) => ['This should not fire', ...prev])}
        />
        <Input
          disabled
          placeholder="Disabled input"
          onChange={() => setKeyEvents((prev) => ['This should not fire', ...prev])}
        />
        <LineBreak />

        <Text color="cyan" bold>
          7. Auto-Scroll Demo (stickyToBottom)
        </Text>
        <Text color="gray">
          Click the button to add lines - scroll stays at bottom if you&apos;re at the bottom
        </Text>
        <Button
          label="Add Log Line"
          onClick={() => {
            const newCounter = logCounter + 1;
            setLogCounter(newCounter);
            const timestamp = new Date().toLocaleTimeString();
            setLogLines((prev) => [...prev, `[${timestamp}] Log entry #${newCounter}`]);
          }}
        />
        <ScrollView
          maxHeight={6}
          showsVerticalScrollIndicator
          stickyToBottom
          scrollbarStyle={{ thumbColor: 'green', trackColor: 'gray' }}
        >
          {logLines.map((line, i) => (
            <Text key={i} color={i === logLines.length - 1 ? 'green' : 'gray'}>
              {line}
            </Text>
          ))}
        </ScrollView>
        <Text color="gray" dim>
          Try: 1) Click button while at bottom (auto-scrolls) 2) Scroll up, click button (stays
          where you are)
        </Text>
      </ScrollView>

      <LineBreak />
      <Text color="gray" dim>
        Use Tab to navigate, scroll with mouse wheel. Press Ctrl+C to exit.
      </Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
