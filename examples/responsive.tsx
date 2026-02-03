/**
 * Responsive sizing example - demonstrates dynamic terminal dimension usage
 * Shows both legacy getTerminalDimensions and new Dimensions/useWindowDimensions APIs
 */

import React from 'react';
import {
  render,
  exit,
  Text,
  View,
  LineBreak,
  getTerminalDimensions,
  Dimensions,
  useWindowDimensions,
} from '../src/index';

function App() {
  // Legacy API
  const dims = getTerminalDimensions();

  // New React Native compatible APIs
  const windowDims = useWindowDimensions();
  const screenDims = Dimensions.get('screen');

  return (
    <View padding={1}>
      <Text color="cyan" bold>
        Responsive Sizing Example
      </Text>
      <LineBreak />

      <Text color="yellow" bold>
        Dimension APIs:
      </Text>
      <Text>
        getTerminalDimensions(): {dims.columns} x {dims.rows}
      </Text>
      <Text>
        useWindowDimensions(): {windowDims.width} x {windowDims.height}
      </Text>
      <Text>
        Dimensions.get(&apos;screen&apos;): {screenDims.width} x {screenDims.height}
      </Text>
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
      <LineBreak />

      <Text color="gray" dim>
        Note: Dimensions API and useWindowDimensions are React Native compatible.
      </Text>
    </View>
  );
}

render(<App />, { mode: 'static' });
exit();
