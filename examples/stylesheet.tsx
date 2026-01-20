/**
 * StyleSheet example - demonstrates CSS-like styling with StyleSheet API
 * Similar to React Native StyleSheet but for terminals
 */

import React, { useState } from 'react';
import { render, Text, View, StyleSheet, getTerminalDimensions } from '../src/index';

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: 'blue',
    color: 'white',
  },
  title: {
    color: 'cyan',
    bold: true,
    textAlign: 'center',
  },
  box: {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    backgroundColor: 'gray',
    color: 'black',
    width: '50%',
  },
  absoluteBox: {
    position: 'absolute',
    top: 5,
    right: 10,
    padding: 1,
    backgroundColor: 'yellow',
    color: 'black',
    width: 30,
  },
  relativeBox: {
    position: 'relative',
    left: 10,
    top: 2,
    padding: 1,
    backgroundColor: 'green',
    color: 'white',
  },
  dynamicBox: {
    padding: 1,
    margin: 1,
  },
});

function App() {
  const [highlighted, setHighlighted] = useState(false);
  const dims = getTerminalDimensions();

  // Dynamic styles based on state
  const dynamicStyle = {
    ...styles.dynamicBox,
    backgroundColor: highlighted ? 'red' : 'blue',
    color: highlighted ? 'white' : 'yellow',
    bold: highlighted,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StyleSheet Example</Text>
      <Text>Terminal Size: {dims.columns} x {dims.rows}</Text>
      
      <View style={styles.box}>
        <Text>50% Width Box with StyleSheet</Text>
        <Text>This box uses responsive sizing</Text>
      </View>

      <View style={styles.relativeBox}>
        <Text>Relative Positioned Box</Text>
        <Text>Positioned 10 chars left, 2 lines down</Text>
      </View>

      <View style={dynamicStyle}>
        <Text>Dynamic Style Box (click to toggle)</Text>
        <Text>Background changes based on state!</Text>
      </View>

      <View style={styles.absoluteBox}>
        <Text>Absolute Positioned</Text>
        <Text>Top: 5, Right: 10</Text>
      </View>

      <Text style={{ color: 'green', bold: true, margin: { top: 2 } }}>
        Multiple styles can be combined:
      </Text>
      <View style={StyleSheet.flatten([
        styles.box,
        { backgroundColor: 'magenta', color: 'white' },
      ])}>
        <Text>Flattened styles example</Text>
      </View>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
