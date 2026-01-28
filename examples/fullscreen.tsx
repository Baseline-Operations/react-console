/**
 * Fullscreen example - Full terminal application
 */

import React from 'react';
import { render, Text, Box, View, ScrollView, getTerminalDimensions } from '../src/index';

function App() {
  const dims = getTerminalDimensions();
  
  return (
    <View>
      <Box padding={1} backgroundColor="blue" color="white">
        <Text bold>Full Screen Application</Text>
      </Box>
      
      <ScrollView maxHeight={dims.rows - 5} showsScrollIndicator>
        <Box padding={1}>
          <Text>This is a full-screen console application.</Text>
          <Text>It takes up the entire terminal.</Text>
          <Text>Scrollable content can go here...</Text>
          {/* Add more content to test scrolling */}
        </Box>
      </ScrollView>
      
      <Box padding={1} backgroundColor="gray">
        <Text color="white">Footer - Status bar</Text>
      </Box>
    </View>
  );
}

render(<App />, { mode: 'fullscreen' });
