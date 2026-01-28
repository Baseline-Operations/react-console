/**
 * StyleSheet example - demonstrates CSS-like styling with StyleSheet API
 * Similar to React Native StyleSheet but for terminals
 */

import React from 'react';
import { render, exit, Text, View, StyleSheet, getTerminalDimensions } from '../src/index';

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: 'blue',
    color: 'white',
  },
  title: {
    color: 'cyan',
    bold: true,
    underline: true,
    textAlign: 'center',
  },
  terminalBox: {
    color: 'red',
    italic: true,
    textAlign: 'right',
  },
  strikethroughText: {
    strikethrough: true,
    textDecoration: 'line-through',
    color: 'green',
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
    width: 50,
    backgroundColor: 'green',
    color: 'white',
  },
  dynamicBox: {
    margin: 1,
  },
  // Card with badge - demonstrates absolute positioning within a container
  card: {
    position: 'relative', // Creates positioning context for absolute children
    padding: 1,
    margin: { top: 1 },
    backgroundColor: 'gray',
    color: 'black',
    width: 40,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    color: 'white',
  },
});

function App() {
  const dims = getTerminalDimensions();

  // Dynamic styles example (in a real app, this could be based on state)
  const dynamicStyle = {
    ...styles.dynamicBox,
    backgroundColor: 'blue',
    color: 'yellow',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StyleSheet Example</Text>
      <Text style={styles.terminalBox}>
        Terminal Size: {dims.columns} x {dims.rows}
      </Text>
      <Text style={styles.strikethroughText}>This text is strikethrough</Text>

      <View style={styles.box}>
        <Text>50% Width Box with StyleSheet</Text>
        <Text>This box uses responsive sizing</Text>
      </View>

      <View style={styles.relativeBox}>
        <Text>Relative Positioned Box</Text>
        <Text>Positioned 10 chars left, 2 lines down</Text>
      </View>

      <View style={dynamicStyle}>
        <Text>Dynamic Style Box</Text>
        <Text>Styles can be computed at runtime</Text>
      </View>

      <View style={styles.absoluteBox}>
        <Text>Absolute Positioned</Text>
        <Text>Top: 5, Right: 10</Text>
      </View>

      <View style={{ margin: { top: 2 } }}>
        <Text style={{ color: 'green', bold: true }}>Multiple styles can be combined:</Text>
      </View>
      <View
        style={
          StyleSheet.flatten([styles.box, { backgroundColor: 'magenta', color: 'white' }]) ??
          undefined
        }
      >
        <Text>Flattened styles example</Text>
      </View>

      <View style={{ margin: { top: 2 } }}>
        <Text style={{ color: 'green', bold: true }}>Absolute positioning within container:</Text>
      </View>
      <View style={styles.card}>
        <Text>Card Title</Text>
        <Text>Card content goes here</Text>
        <View style={styles.badge}>
          <Text>NEW</Text>
        </View>
      </View>
    </View>
  );
}

render(<App />, { mode: 'static' });
exit();
