/**
 * Interactive example - Input component with JSX-style event handlers
 */

import React, { useState } from 'react';
import { render, Text, View, Input, Button, LineBreak } from '../src/index';

function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <View padding={2}>
      <Text color="cyan" bold>Interactive Console App</Text>
      <LineBreak />
      
      {!submitted ? (
        <>
          <Text>Enter your name:</Text>
          <Input
            value={name}
            onChange={(event) => {
              setName(event.value);
            }}
            onKeyDown={(event) => {
              if (event.key.return) {
                setSubmitted(true);
              }
            }}
            onSubmit={(_event) => {
              setSubmitted(true);
            }}
            placeholder="Type your name and press Enter"
            autoFocus
          />
          <LineBreak />
          <Button
            onClick={() => {
              if (name) {
                setSubmitted(true);
              }
            }}
            label="Submit"
          />
        </>
      ) : (
        <>
          <Text color="green" bold>Hello, {name}!</Text>
          <Text>Thanks for using React Console.</Text>
        </>
      )}
    </View>
  );
}

render(<App />, { mode: 'interactive' });
