/**
 * Bell API Example
 * Demonstrates terminal audio feedback (beeps/alerts)
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
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>Bell API Example (Terminal Audio)</Text>

      <View style={{ marginBottom: 2 }}>
        <Text style={{ color: enabled ? 'green' : 'red' }}>
          Bell is {enabled ? 'ENABLED' : 'DISABLED'}
        </Text>
        <Button onPress={toggleBell} style={{ marginTop: 1 }}>
          {enabled ? 'Disable Bell' : 'Enable Bell'}
        </Button>
      </View>

      <View style={{ borderTop: 'single', paddingTop: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Test Bell Sounds:</Text>

        <View style={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          <Button onPress={() => Bell.ring()}>Ring (1x)</Button>

          <Button onPress={() => Bell.beep(3)}>Beep (3x)</Button>

          <Button onPress={() => Bell.alert()}>Alert</Button>

          <Button onPress={() => Bell.success()}>Success</Button>

          <Button onPress={() => Bell.error()}>Error</Button>
        </View>
      </View>

      <View style={{ borderTop: 'single', paddingTop: 2, marginTop: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Using useBell() hook:</Text>

        <View style={{ flexDirection: 'row', gap: 2 }}>
          <Button onPress={() => bell.ring()}>Hook Ring</Button>

          <Button onPress={() => bell.alert()}>Hook Alert</Button>
        </View>
      </View>

      <View style={{ borderTop: 'single', paddingTop: 2, marginTop: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Custom Pattern:</Text>
        <Button onPress={() => Bell.beep(5, { interval: 100 })}>
          Fast Beeps (5x, 100ms interval)
        </Button>
      </View>

      <Text style={{ marginTop: 2, color: 'gray' }}>
        Note: Sound depends on your terminal settings and system volume.
      </Text>
      <Text style={{ color: 'cyan' }}>
        The bell character (\x07) triggers the terminal&apos;s audible alert.
      </Text>
    </Box>
  );
}

render(<BellExample />);
