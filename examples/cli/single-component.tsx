/**
 * Single Component Example
 * Demonstrates an application with no routing, just a single component
 */

import React from 'react';
import { render } from '../../src/index';
import { CLIApp, CommandRouter, Default } from '../../src/cli';
import { Text, View, Input, Button } from '../../src/index';
import { useState } from 'react';

function App() {
  return (
    <CLIApp name="single-cli" version="1.0.0" description="Single component application example">
      <CommandRouter>
        <Default>
          <SimpleAppComponent />
        </Default>
      </CommandRouter>
    </CLIApp>
  );
}

function SimpleAppComponent() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  return (
    <View padding={2}>
      <Text bold color="cyan">
        Simple CLI Application
      </Text>
      <Text>This is a single-component app with no routing.</Text>
      <View style={{ margin: { top: 1 } }}>
        <Text>Enter your name:</Text>
        <Input value={name} onChange={(e) => setName(e.value as string)} placeholder="Your name" style={{ width: 30 }} />
      </View>
      <View style={{ marginTop: 1 }}>
        <Button onClick={() => setGreeting(name ? `Hello, ${name}!` : 'Hello, World!')}>
          Greet
        </Button>
      </View>
      {greeting && (
        <View style={{ margin: { top: 1 } }}>
          <Text bold color="green">
            {greeting}
          </Text>
        </View>
      )}
    </View>
  );
}

// Run the app
if (require.main === module) {
  render(<App />, { mode: 'interactive' });
}

export default App;
