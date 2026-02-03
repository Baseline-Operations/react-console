/**
 * TextInput Ref Example
 * Demonstrates programmatic control of TextInput using refs
 */

import React, { useRef, useState } from 'react';
import { render, View, Text, TextInput, Button, Box } from '../src/index';
import type { TextInputRef } from '../src/index';

function TextInputRefExample() {
  const inputRef = useRef<TextInputRef>(null);
  const [status, setStatus] = useState('');
  const [focusState, setFocusState] = useState(false);

  const handleFocus = () => {
    inputRef.current?.focus();
    setStatus('Called focus()');
  };

  const handleBlur = () => {
    inputRef.current?.blur();
    setStatus('Called blur()');
  };

  const handleClear = () => {
    inputRef.current?.clear();
    setStatus('Called clear()');
  };

  const handleCheckFocus = () => {
    const focused = inputRef.current?.isFocused() ?? false;
    setFocusState(focused);
    setStatus(`isFocused() = ${focused}`);
  };

  const handleSetValue = () => {
    inputRef.current?.setValue('Hello from ref!');
    setStatus('Called setValue()');
  };

  const handleGetValue = () => {
    const value = inputRef.current?.getValue() ?? '';
    setStatus(`getValue() = "${value}"`);
  };

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 2 }}>TextInput Ref Example</Text>

      <View style={{ marginBottom: 2 }}>
        <Text style={{ marginBottom: 1 }}>Input with ref:</Text>
        <TextInput
          ref={inputRef}
          placeholder="Type something..."
          style={{
            border: 'single',
            padding: 1,
            width: 40,
          }}
          onFocus={() => setFocusState(true)}
          onBlur={() => setFocusState(false)}
        />
      </View>

      <View style={{ marginBottom: 2 }}>
        <Text style={{ color: focusState ? 'green' : 'gray' }}>
          Focus state: {focusState ? 'FOCUSED' : 'NOT FOCUSED'}
        </Text>
      </View>

      <View style={{ marginBottom: 2 }}>
        <Text style={{ bold: true, marginBottom: 1 }}>Ref Methods:</Text>
        <View style={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          <Button onPress={handleFocus}>focus()</Button>
          <Button onPress={handleBlur}>blur()</Button>
          <Button onPress={handleClear}>clear()</Button>
          <Button onPress={handleCheckFocus}>isFocused()</Button>
          <Button onPress={handleSetValue}>setValue()</Button>
          <Button onPress={handleGetValue}>getValue()</Button>
        </View>
      </View>

      {status && (
        <View style={{ borderTop: 'single', paddingTop: 1, marginTop: 1 }}>
          <Text style={{ color: 'cyan' }}>Last action: {status}</Text>
        </View>
      )}

      <Text style={{ marginTop: 2, color: 'gray' }}>
        Use Tab to navigate, buttons call ref methods on the input
      </Text>
    </Box>
  );
}

render(<TextInputRefExample />);
