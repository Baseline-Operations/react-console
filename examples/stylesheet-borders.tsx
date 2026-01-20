/**
 * StyleSheet with borders example - demonstrates border styles
 */

import React from 'react';
import { render, Text, View, StyleSheet } from '../src/index';

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
  borderedBox: {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    border: true,
    borderStyle: 'single',
    borderColor: 'yellow',
    backgroundColor: 'gray',
    color: 'black',
  },
  doubleBorder: {
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'double',
    borderColor: 'green',
  },
  thickBorder: {
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'thick',
    borderColor: 'red',
  },
  dashedBorder: {
    padding: 1,
    margin: { top: 1 },
    border: true,
    borderStyle: 'dashed',
    borderColor: 'magenta',
  },
  partialBorder: {
    padding: 1,
    margin: { top: 1 },
    border: {
      top: true,
      bottom: true,
    },
    borderStyle: 'single',
    borderColor: 'cyan',
  },
  textWithStyles: {
    color: 'green',
    bold: true,
  },
  textItalic: {
    color: 'yellow',
    italic: true,
  },
  textUnderline: {
    color: 'red',
    underline: true,
  },
  textCombined: {
    color: 'magenta',
    bold: true,
    italic: true,
    underline: true,
  },
});

function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StyleSheet with Borders & Text Styles</Text>
      
      <View style={styles.borderedBox}>
        <Text>Single Border (Yellow)</Text>
        <Text>All sides with border</Text>
      </View>

      <View style={styles.doubleBorder}>
        <Text>Double Border (Green)</Text>
        <Text>Elegant double-line border</Text>
      </View>

      <View style={styles.thickBorder}>
        <Text>Thick Border (Red)</Text>
        <Text>Bold thick border style</Text>
      </View>

      <View style={styles.dashedBorder}>
        <Text>Dashed Border (Magenta)</Text>
        <Text>Dashed line border</Text>
      </View>

      <View style={styles.partialBorder}>
        <Text>Partial Border (Cyan)</Text>
        <Text>Only top and bottom borders</Text>
      </View>

      <View style={{ margin: { top: 2 } }}>
        <Text style={styles.textWithStyles}>Bold Green Text</Text>
        <Text style={styles.textItalic}>Italic Yellow Text</Text>
        <Text style={styles.textUnderline}>Underlined Red Text</Text>
        <Text style={styles.textCombined}>Bold + Italic + Underline (Magenta)</Text>
        <Text>
          Mixed: <Text style={{ bold: true, color: 'cyan' }}>Bold Cyan</Text> and{' '}
          <Text style={{ italic: true, color: 'yellow' }}>Italic Yellow</Text>
        </Text>
      </View>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
