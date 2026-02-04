/**
 * Bell API Example - Terminal audio feedback (beeps/alerts)
 */

import React, { useState } from 'react';
import { render, View, Text, Button, Box, Bell, useBell } from '../src/index';

function BellExample() {
  const [enabled, setEnabled] = useState(Bell.isEnabled());
  const bell = useBell();

  const toggleBell = () => {
    const newState = !enabled;
    Bell.setEnabled(newState);
    setEnabled(newState);
  };

  return (
    <Box style={{ padding: 1 }}>
      <Text style={{ bold: true }}>Bell API Example</Text>
      <Text style={{ color: enabled ? 'green' : 'red', marginBottom: 1 }}>
        Status: {enabled ? 'ON' : 'OFF'}
      </Text>

      <View style={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap', marginBottom: 1 }}>
        <Button onPress={toggleBell}>{enabled ? 'Disable' : 'Enable'}</Button>
        <Button onPress={() => Bell.ring()}>Ring</Button>
        <Button onPress={() => Bell.beep(3)}>Beep x3</Button>
        <Button onPress={() => Bell.alert()}>Alert</Button>
        <Button onPress={() => Bell.success()}>Success</Button>
        <Button onPress={() => Bell.error()}>Error</Button>
      </View>

      <View style={{ flexDirection: 'row', gap: 1, marginBottom: 1 }}>
        <Button onPress={() => bell.ring()}>Hook Ring</Button>
        <Button onPress={() => Bell.beep({ count: 5, interval: 100 })}>Fast x5</Button>
      </View>

      <Text style={{ color: 'gray', dim: true }}>
        Note: Requires terminal bell enabled (check terminal settings)
      </Text>
    </Box>
  );
}

// No need to specify mode: 'interactive' - auto-detected from Button components
render(<BellExample />);
