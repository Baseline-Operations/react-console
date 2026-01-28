/**
 * Flex wrap example - demonstrates flexWrap functionality
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
    margin: { bottom: 1 },
  },
  sectionTitle: {
    color: 'yellow',
    margin: { top: 1, bottom: 1 },
  },
  // No wrap (default) - items overflow
  noWrap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    padding: 1,
    border: true,
    borderStyle: 'single',
    borderColor: 'red',
    margin: { bottom: 1 },
  },
  // Wrap - items wrap to next line
  wrap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 1,
    border: true,
    borderStyle: 'single',
    borderColor: 'green',
    margin: { bottom: 1 },
  },
  // Wrap reverse - items wrap in reverse order
  wrapReverse: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap-reverse',
    padding: 1,
    border: true,
    borderStyle: 'single',
    borderColor: 'magenta',
    margin: { bottom: 1 },
  },
  // Wrap with gap
  wrapWithGap: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    padding: 1,
    border: true,
    borderStyle: 'double',
    borderColor: 'cyan',
    margin: { bottom: 1 },
  },
  // Wrap with justify-content: center
  wrapCentered: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 1,
    padding: 1,
    border: true,
    borderStyle: 'single',
    borderColor: 'yellow',
    margin: { bottom: 1 },
  },
  // Small item
  item: {
    padding: 1,
    backgroundColor: 'gray',
    color: 'black',
    border: true,
    borderStyle: 'single',
    borderColor: 'white',
  },
  // Wide item - 30 content width = 34 total (2 fit per line in 76 wide container)
  wideItem: {
    width: 30,
    padding: 1,
    backgroundColor: 'gray',
    color: 'black',
    border: true,
    borderStyle: 'single',
    borderColor: 'white',
  },
  // Medium item - 15 content width = 19 total (3-4 fit per line)
  mediumItem: {
    width: 15,
    padding: 1,
    backgroundColor: 'gray',
    color: 'black',
    border: true,
    borderStyle: 'single',
    borderColor: 'white',
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flex Wrap Examples</Text>
      
      <Text style={styles.sectionTitle}>1. No Wrap (default) - items may shrink or overflow</Text>
      <View style={styles.noWrap}>
        <View style={styles.wideItem}>
          <Text>Item 1</Text>
        </View>
        <View style={styles.wideItem}>
          <Text>Item 2</Text>
        </View>
        <View style={styles.wideItem}>
          <Text>Item 3</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>2. Wrap - items wrap to next line</Text>
      <View style={styles.wrap}>
        <View style={styles.wideItem}>
          <Text>Item 1</Text>
        </View>
        <View style={styles.wideItem}>
          <Text>Item 2</Text>
        </View>
        <View style={styles.wideItem}>
          <Text>Item 3</Text>
        </View>
        <View style={styles.wideItem}>
          <Text>Item 4</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>3. Wrap Reverse - lines are reversed (Line 2 appears first)</Text>
      <View style={styles.wrapReverse}>
        <View style={styles.mediumItem}>
          <Text>Line1-A</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Line1-B</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Line1-C</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Line1-D</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Line2-E</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Line2-F</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>4. Wrap with Gap (1 char gap between items and lines)</Text>
      <View style={styles.wrapWithGap}>
        <View style={styles.mediumItem}>
          <Text>One</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Two</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Three</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Four</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Five</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Six</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Seven</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Eight</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>5. Wrap with Centered Justify (each line centered)</Text>
      <View style={styles.wrapCentered}>
        <View style={styles.mediumItem}>
          <Text>Alpha</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Beta</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Gamma</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Delta</Text>
        </View>
        <View style={styles.mediumItem}>
          <Text>Epsilon</Text>
        </View>
      </View>
    </View>
  );
}

render(<App />, { mode: 'static' });
exit();
