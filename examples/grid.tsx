/**
 * Grid layout example
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: [20, 20, 20], // 3 columns of 20 chars each
    gap: 1,
    padding: 1,
    margin: { top: 1, bottom: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'yellow',
  },
  gridItem: {
    padding: 1,
    backgroundColor: 'gray',
    color: 'black',
    border: true,
    borderStyle: 'single',
    borderColor: 'white',
    textAlign: 'center',
  },
  fractionalGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr', // Fractional units
    gap: 2,
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'double',
    borderColor: 'green',
  },
  autoGrid: {
    display: 'grid',
    // Auto columns - will calculate based on children
    gap: 1,
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'cyan',
  },
  customPlacement: {
    display: 'grid',
    gridTemplateColumns: [15, 15, 15, 15],
    gridTemplateRows: [5, 5, 5], // Must be at least 5 to fit items with border + padding
    gap: 1,
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'thick',
    borderColor: 'magenta',
  },
  spanItem: {
    gridColumn: '1 / 3', // Span 2 columns
    padding: 1,
    backgroundColor: 'red',
    color: 'white',
    textAlign: 'center',
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grid Layout Examples</Text>
      
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text>Item 1</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Item 2</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Item 3</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Item 4</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Item 5</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Item 6</Text>
        </View>
      </View>

      <View style={styles.fractionalGrid}>
        <View style={styles.gridItem}>
          <Text>1fr</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>2fr (wider)</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>1fr</Text>
        </View>
      </View>

      <View style={styles.autoGrid}>
        <View style={styles.gridItem}>
          <Text>Auto 1</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Auto 2</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Auto 3</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Auto 4</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>Auto 5</Text>
        </View>
      </View>

      <View style={styles.customPlacement}>
        <View style={styles.spanItem}>
          <Text>Spans 2 columns</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>3</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>4</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>5</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>6</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>7</Text>
        </View>
        <View style={styles.gridItem}>
          <Text>8</Text>
        </View>
      </View>
    </View>
  );
}

render(<App />, { mode: 'static' });
exit();
