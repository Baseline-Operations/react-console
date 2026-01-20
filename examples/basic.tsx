/**
 * Basic example - simple text output
 */

import React from 'react';
import { render, Text, Box } from '../src/index';

function App() {
  return (
    <Box padding={1}>
      <Text color="cyan" bold>Welcome to React Console!</Text>
      <Text>This is a simple example using React 19+ in the terminal.</Text>
      <Text color="green">✓ React</Text>
      <Text color="green">✓ TypeScript</Text>
      <Text color="green">✓ ESLint 9+</Text>
      <Text color="green">✓ React Compiler</Text>
    </Box>
  );
}

render(<App />);
