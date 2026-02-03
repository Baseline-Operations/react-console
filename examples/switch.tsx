/**
 * Switch Component Example
 * Demonstrates the React Native compatible Switch component
 */

import React, { useState } from 'react';
import { render, View, Text, Switch, Box } from '../src/index';

function SwitchExample() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [disabled, setDisabled] = useState(false);

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 1 }}>Switch Component Examples</Text>

      {/* Basic Switch */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
        <Text style={{ width: 20 }}>Notifications:</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
        <Text style={{ marginLeft: 1, color: 'gray' }}>{notifications ? 'ON' : 'OFF'}</Text>
      </View>

      {/* Switch with custom colors */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
        <Text style={{ width: 20 }}>Dark Mode:</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: 'gray', true: 'blue' }}
          thumbColor={darkMode ? 'cyan' : 'white'}
        />
        <Text style={{ marginLeft: 1, color: 'gray' }}>{darkMode ? 'ON' : 'OFF'}</Text>
      </View>

      {/* Switch with custom characters */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
        <Text style={{ width: 20 }}>Auto-save:</Text>
        <Switch
          value={autoSave}
          onValueChange={setAutoSave}
          onChar="✓"
          offChar="✗"
          onLabel="Yes"
          offLabel="No"
        />
      </View>

      {/* Disabled Switch */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
        <Text style={{ width: 20 }}>Disabled:</Text>
        <Switch value={disabled} onValueChange={setDisabled} disabled />
        <Text style={{ marginLeft: 1, color: 'gray' }}>(cannot toggle)</Text>
      </View>

      <Text style={{ marginTop: 2, color: 'cyan' }}>
        Use Tab to navigate, Space/Enter to toggle
      </Text>
    </Box>
  );
}

render(<SwitchExample />);
