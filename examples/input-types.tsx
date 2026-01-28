/**
 * Input Types Example - Demonstrates all Input types (text, number, multiline)
 * Shows validation, formatting, and different input configurations
 */

import React, { useState } from 'react';
import { render, Text, View, Input, Button, LineBreak, Box } from '../src/index';

function App() {
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState<string | number>('');
  const [multilineValue, setMultilineValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState<number | string>('');

  return (
    <View padding={2}>
      <Text color="cyan" bold>Input Types Example</Text>
      <LineBreak />
      
      <Text color="yellow" bold>1. Text Input</Text>
      <Text>Enter your name (max 20 characters):</Text>
      <Input
        type="text"
        value={textValue}
        onChange={(event) => {
          setTextValue(event.value as string);
        }}
        placeholder="Type your name..."
        maxLength={20}
        autoFocus
        style={{ width: 40 }}
      />
      {textValue && <Text color="gray">Value: "{textValue}"</Text>}
      <LineBreak />

      <Text color="yellow" bold>2. Number Input</Text>
      <Text>Enter a number (step: 0.5, range: 0-100):</Text>
      <Input
        type="number"
        value={numberValue}
        onChange={(event) => {
          setNumberValue(event.value);
        }}
        placeholder="0"
        step={0.5}
        min={0}
        max={100}
        allowDecimals
        style={{ width: 30 }}
      />
      {numberValue !== '' && (
        <Text color="gray">
          Value: {numberValue} (type: {typeof numberValue})
        </Text>
      )}
      <LineBreak />

      <Text color="yellow" bold>3. Number Input with Decimal Places</Text>
      <Text>Enter currency amount (2 decimal places):</Text>
      <Input
        type="number"
        value={currencyValue}
        onChange={(event) => {
          setCurrencyValue(event.value);
        }}
        placeholder="0.00"
        min={0}
        max={9999.99}
        allowDecimals
        decimalPlaces={2}
        formatDisplay={(value) => {
          const num = typeof value === 'string' ? parseFloat(value) : value;
          return isNaN(num) ? '' : `$${num.toFixed(2)}`;
        }}
        style={{ width: 30 }}
      />
      {currencyValue !== '' && (
        <Text color="gray">
          Raw Value: {currencyValue} | Display: ${typeof currencyValue === 'string' ? parseFloat(currencyValue || '0').toFixed(2) : currencyValue.toFixed(2)}
        </Text>
      )}
      <LineBreak />

      <Text color="yellow" bold>4. Multiline Input</Text>
      <Text>Enter multiple lines (max 5 lines, 50 chars per line):</Text>
      <Input
        type="text"
        value={multilineValue}
        onChange={(event) => {
          setMultilineValue(event.value as string);
        }}
        placeholder="Type multiple lines..."
        multiline
        maxLines={5}
        maxWidth={50}
        style={{ width: 50, height: 6 }}
      />
      <LineBreak />

      <Text color="yellow" bold>5. Pattern Validation</Text>
      <Text>Enter email (regex pattern validation):</Text>
      <Input
        type="text"
        value={textValue}
        onChange={(event) => {
          setTextValue(event.value as string);
        }}
        placeholder="user@example.com"
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
        style={{ width: 40 }}
      />
      {textValue && (
        <Text color={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue) ? 'green' : 'red'}>
          {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(textValue) ? '✓ Valid email' : '✗ Invalid email format'}
        </Text>
      )}
      <LineBreak />

      <Box
        style={{
          border: 'single',
          borderColor: 'cyan',
          padding: { top: 1, bottom: 1, left: 2, right: 2 },
          margin: { top: 2 },
        }}
      >
        <Text color="cyan" bold>Summary:</Text>
        <Text>Text: "{textValue}"</Text>
        <Text>Number: {numberValue !== '' ? numberValue : '(empty)'}</Text>
        <Text>Currency: {currencyValue !== '' ? `$${typeof currencyValue === 'string' ? parseFloat(currencyValue || '0').toFixed(2) : currencyValue.toFixed(2)}` : '(empty)'}</Text>
        <Text>Multiline: {multilineValue ? `"${multilineValue.replace(/\n/g, '\\n')}"` : '(empty)'}</Text>
      </Box>

      <LineBreak />
      <Text color="gray" dim>Use Tab to navigate between inputs. Press Ctrl+C to exit.</Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
