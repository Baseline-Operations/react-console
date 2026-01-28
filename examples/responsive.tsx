/**
 * Responsive sizing example - demonstrates dynamic terminal dimension usage
 */

import React from 'react';
import { render, exit, Text, View, LineBreak, getTerminalDimensions } from '../src/index';

function App() {
  const dims = getTerminalDimensions();

  return (
    <View padding={1}>
      <Text color="cyan" bold>Responsive Sizing Example</Text>
      <LineBreak />
      
      <Text>Terminal Size: {dims.columns} x {dims.rows}</Text>
      <LineBreak />
      
      <Text color="green">50% Width Box:</Text>
      <View width="50%" padding={1} color="gray">
        <Text>This box is 50% of terminal width</Text>
        <Text>Dynamic sizing based on terminal dimensions!</Text>
      </View>
      <LineBreak />
      
      <Text color="yellow">80 Character Width Box:</Text>
      <View width="80ch" padding={1} color="blue">
        <Text>This box is 80 characters wide</Text>
      </View>
      <LineBreak />
      
      <Text color="magenta">Fixed 40 Character Width:</Text>
      <View width={40} padding={1} color="red">
        <Text>This box is exactly 40 characters wide</Text>
      </View>
    </View>
  );
}

render(<App />, { mode: 'static' });
exit();
