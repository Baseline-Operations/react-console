/**
 * AppState and BackHandler API Example
 * Demonstrates app lifecycle and escape key handling
 */

import React, { useEffect, useState } from 'react';
import { render, View, Text, Box, AppState, useAppState, useBackHandler } from '../src/index';

function AppStateBackHandlerExample() {
  const appState = useAppState();
  const [stateHistory, setStateHistory] = useState<string[]>([]);
  const [escapeCount, setEscapeCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Track app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setStateHistory((prev) => [
        ...prev.slice(-4),
        `${new Date().toLocaleTimeString()}: ${nextState}`,
      ]);
    });

    return () => subscription.remove();
  }, []);

  // Handle escape key - show confirmation before exit
  useBackHandler(() => {
    if (showModal) {
      setShowModal(false);
      return true; // Handled - don't exit
    }

    setEscapeCount((c) => c + 1);

    if (escapeCount >= 2) {
      // Allow exit on third escape
      return false;
    }

    // Show message and prevent exit
    setShowModal(true);
    return true;
  });

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>AppState & BackHandler Example</Text>

      {/* AppState */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>AppState API:</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text>
            Current state:{' '}
            <Text
              style={{
                color: appState === 'active' ? 'green' : 'yellow',
                bold: true,
              }}
            >
              {appState}
            </Text>
          </Text>
          <Text style={{ color: 'gray', marginTop: 1 }}>
            (Press Ctrl+Z to background, then &apos;fg&apos; to resume)
          </Text>
        </View>
      </View>

      {/* State History */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>State History:</Text>
        <View style={{ paddingLeft: 2 }}>
          {stateHistory.length === 0 ? (
            <Text style={{ color: 'gray' }}>(no state changes yet)</Text>
          ) : (
            stateHistory.map((entry, i) => (
              <Text key={i} style={{ color: 'gray' }}>
                {entry}
              </Text>
            ))
          )}
        </View>
      </View>

      {/* BackHandler */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, color: 'cyan' }}>BackHandler API:</Text>
        <View style={{ paddingLeft: 2 }}>
          <Text>Escape pressed: {escapeCount} times</Text>
          <Text style={{ color: 'gray', marginTop: 1 }}>
            Press Escape 3 times to exit (with confirmation)
          </Text>
        </View>
      </View>

      {/* Exit confirmation modal */}
      {showModal && (
        <View
          style={{
            border: 'double',
            borderColor: 'yellow',
            padding: 2,
            marginTop: 2,
            backgroundColor: 'black',
          }}
        >
          <Text style={{ bold: true, color: 'yellow' }}>Exit Confirmation</Text>
          <Text style={{ marginTop: 1 }}>Press Escape {3 - escapeCount} more time(s) to exit</Text>
          <Text style={{ color: 'gray', marginTop: 1 }}>Or press any other key to cancel</Text>
        </View>
      )}

      <View style={{ borderTop: 'single', paddingTop: 2, marginTop: 2 }}>
        <Text style={{ color: 'gray' }}>Tips:</Text>
        <Text style={{ color: 'gray' }}>
          • Ctrl+Z: Suspend app (triggers &apos;background&apos; state)
        </Text>
        <Text style={{ color: 'gray' }}>• fg: Resume app (triggers &apos;active&apos; state)</Text>
        <Text style={{ color: 'gray' }}>• Escape: Triggers BackHandler callbacks</Text>
      </View>
    </Box>
  );
}

render(<AppStateBackHandlerExample />);
