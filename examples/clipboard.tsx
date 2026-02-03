/**
 * Clipboard API Example
 * Demonstrates copy/paste functionality
 */

import React, { useState } from 'react';
import { render, View, Text, TextInput, Button, Box, Clipboard, useClipboard } from '../src/index';

function ClipboardExample() {
  const [text, setText] = useState('Hello, Terminal!');
  const [clipboardContent] = useClipboard();
  const [status, setStatus] = useState('');

  const handleCopy = async () => {
    try {
      await Clipboard.setString(text);
      setStatus('Copied to clipboard!');
      setTimeout(() => setStatus(''), 2000);
    } catch {
      setStatus('Failed to copy');
    }
  };

  const handlePaste = async () => {
    try {
      const content = await Clipboard.getString();
      setText(content);
      setStatus('Pasted from clipboard!');
      setTimeout(() => setStatus(''), 2000);
    } catch {
      setStatus('Failed to paste');
    }
  };

  const handleCheck = async () => {
    const hasContent = await Clipboard.hasString();
    setStatus(hasContent ? 'Clipboard has content' : 'Clipboard is empty');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <Box style={{ padding: 2 }}>
      <Text style={{ bold: true, marginBottom: 1 }}>Clipboard API Example</Text>

      <View style={{ marginBottom: 2 }}>
        <Text style={{ marginBottom: 1 }}>Text to copy:</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          style={{
            border: 'single',
            padding: 1,
            width: 40,
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 2, marginBottom: 2 }}>
        <Button onPress={handleCopy}>Copy</Button>
        <Button onPress={handlePaste}>Paste</Button>
        <Button onPress={handleCheck}>Check</Button>
      </View>

      {status && <Text style={{ color: 'green', marginBottom: 1 }}>{status}</Text>}

      <View style={{ borderTop: 'single', paddingTop: 1, marginTop: 1 }}>
        <Text style={{ color: 'gray' }}>
          Current clipboard (via hook): {clipboardContent || '(empty)'}
        </Text>
      </View>

      <Text style={{ marginTop: 2, color: 'cyan' }}>
        Uses pbcopy/pbpaste (macOS), xclip (Linux), or clip (Windows)
      </Text>
    </Box>
  );
}

render(<ClipboardExample />);
