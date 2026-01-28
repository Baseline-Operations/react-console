/**
 * Flexbox layout example
 */

import React from 'react';
import { render, exit, View, Text, StyleSheet } from '../src/index';

const styles = StyleSheet.create({
  container: {
    padding: 1,
    backgroundColor: 'blue',
    color: 'white',
  },
  title: {
    color: 'cyan',
    bold: true,
    textAlign: 'center',
  },
  rowContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    padding: 1,
    margin: { top: 1, bottom: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'yellow',
  },
  columnContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'green',
  },
  item: {
    padding: 1,
    backgroundColor: 'gray',
    color: 'black',
    border: true,
    borderStyle: 'single',
    borderColor: 'white',
  },
  centeredRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'double',
    borderColor: 'cyan',
  },
  spaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'magenta',
  },
  spaceAround: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'red',
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flexbox Layout Examples</Text>
      
      <View style={styles.rowContainer}>
        <View style={styles.item}>
          <Text>Item 1</Text>
        </View>
        <View style={styles.item}>
          <Text>Item 2</Text>
        </View>
        <View style={styles.item}>
          <Text>Item 3</Text>
        </View>
      </View>

      <View style={styles.columnContainer}>
        <View style={styles.item}>
          <Text>Column Item 1</Text>
        </View>
        <View style={styles.item}>
          <Text>Column Item 2</Text>
        </View>
        <View style={styles.item}>
          <Text>Column Item 3</Text>
        </View>
      </View>

      <View style={styles.centeredRow}>
        <View style={styles.item}>
          <Text>Centered</Text>
        </View>
        <View style={styles.item}>
          <Text>Items</Text>
        </View>
      </View>

      <View style={styles.spaceBetween}>
        <View style={styles.item}>
          <Text>Space</Text>
        </View>
        <View style={styles.item}>
          <Text>Between</Text>
        </View>
        <View style={styles.item}>
          <Text>Items</Text>
        </View>
      </View>

      <View style={styles.spaceAround}>
        <View style={styles.item}>
          <Text>Space</Text>
        </View>
        <View style={styles.item}>
          <Text>Around</Text>
        </View>
        <View style={styles.item}>
          <Text>Items</Text>
        </View>
      </View>
    </View>
  );
}

render(<App />, { mode: 'static' });
exit();
