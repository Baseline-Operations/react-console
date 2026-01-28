/**
 * State Hooks Example - Demonstrates React Console state management hooks
 * Shows terminal-specific hooks, React 19 hooks, and state management patterns
 */

import React, { useState, useMemo } from 'react';
import { render, Text, View, Input, Button, LineBreak, Box } from '../src/index';
import {
  useTerminalDimensions,
  useTerminalConfig,
  useOptimisticTerminal,
  useActionStateTerminal,
  useAsyncWithFallback,
} from '../src/hooks';
import { useTheme, ThemeProvider } from '../src/theme';
import { useStorage } from '../src/storage';

function TerminalDimensionsExample() {
  const dimensions = useTerminalDimensions();
  
  return (
    <Box style={{ border: true, borderStyle: 'single', padding: 1 }}>
      <Text color="cyan" bold>Terminal Dimensions Hook</Text>
      <Text>Columns: {dimensions.columns}</Text>
      <Text>Rows: {dimensions.rows}</Text>
      <Text color="gray" dim>Resize terminal to see updates</Text>
    </Box>
  );
}

function TerminalConfigExample() {
  const config = useTerminalConfig();
  
  return (
    <Box style={{ border: true, borderStyle: 'single', padding: 1 }}>
      <Text color="cyan" bold>Terminal Config Hook</Text>
      <Text>Supports Color: {config.supportsColor ? 'Yes' : 'No'}</Text>
      <Text>Supports Mouse: {config.supportsMouse ? 'Yes' : 'No'}</Text>
      <Text>Dimensions: {config.dimensions.columns}x{config.dimensions.rows}</Text>
    </Box>
  );
}

function ThemeExample() {
  const { theme, colors } = useTheme();
  
  return (
    <View>
      <Text color="yellow" bold>Theme Hook</Text>
      <Text>Current theme: {theme.name}</Text>
      <Text style={{ color: colors.primary as string }}>
        Primary color text
      </Text>
    </View>
  );
}

function StorageExample() {
  const [stored, setStored] = useStorage<string>('example-key', 'default');
  
  return (
    <View>
      <Text color="yellow" bold>Storage Hook</Text>
      <Text>Stored value: {stored}</Text>
      <Button onClick={() => setStored('updated')}>Update Storage</Button>
      <Button onClick={() => setStored('default')}>Reset</Button>
    </View>
  );
}

function OptimisticExample() {
  const [count, setCount] = useState(0);
  const [optimisticCount, addOptimistic] = useOptimisticTerminal(
    count,
    (_current, update) => update
  );
  
  const handleIncrement = () => {
    addOptimistic(count + 1);
    // Simulate async operation
    setTimeout(() => {
      setCount(count + 1);
    }, 500);
  };
  
  return (
    <View>
      <Text color="yellow" bold>Optimistic Update Hook</Text>
      <Text>Count: {optimisticCount}</Text>
      <Text color="gray" dim>Actual: {count}</Text>
      <Button onClick={handleIncrement}>Increment (Optimistic)</Button>
    </View>
  );
}

function ActionStateExample() {
  const [state, formAction, isPending] = useActionStateTerminal(
    async (prevState: number, _formData: FormData) => {
      // Simulate async action
      await new Promise(resolve => setTimeout(resolve, 1000));
      return prevState + 1;
    },
    0
  );
  
  return (
    <View>
      <Text color="yellow" bold>Action State Hook</Text>
      <Text>State: {state}</Text>
      <Text color="gray" dim>Pending: {isPending ? 'Yes' : 'No'}</Text>
      <Button 
        onClick={() => formAction(new FormData())}
        disabled={isPending}
      >
        {isPending ? 'Processing...' : 'Increment'}
      </Button>
    </View>
  );
}

function AsyncExample() {
  const dataPromise = useMemo(() => 
    new Promise<{ message: string }>((resolve) => {
      setTimeout(() => resolve({ message: 'Data loaded!' }), 1000);
    }),
    []
  );
  
  const data = useAsyncWithFallback(dataPromise, { message: 'Loading...' });
  
  return (
    <View>
      <Text color="yellow" bold>Async Hook</Text>
      <Text color="green">{data.message}</Text>
    </View>
  );
}

function App() {
  return (
    <ThemeProvider>
      <View padding={2}>
        <Text color="cyan" bold>State Hooks Examples</Text>
        <LineBreak />
        
        <TerminalDimensionsExample />
        <LineBreak />
        
        <TerminalConfigExample />
        <LineBreak />
        
        <ThemeExample />
        <LineBreak />
        
        <StorageExample />
        <LineBreak />
        
        <OptimisticExample />
        <LineBreak />
        
        <ActionStateExample />
        <LineBreak />
        
        <AsyncExample />
        <LineBreak />
        
        <Text color="gray" dim>Use Tab to navigate, press Ctrl+C to exit.</Text>
      </View>
    </ThemeProvider>
  );
}

render(<App />, { mode: 'interactive' });
