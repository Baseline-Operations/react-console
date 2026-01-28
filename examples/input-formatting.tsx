/**
 * Input Formatting Example - Demonstrates number formatting and display formats
 * Shows formatDisplay, formatValue, and different formatting options
 */

import React, { useState } from 'react';
import { render, Text, View, Input, LineBreak, Box } from '../src/index';

function App() {
  const [currencyValue, setCurrencyValue] = useState<number | string>('');
  const [percentageValue, setPercentageValue] = useState<number | string>('');
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [rawNumberValue, setRawNumberValue] = useState<number | string>('');

  // Currency formatting
  const formatCurrency = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num) || num === 0) return '';
    return `$${num.toFixed(2)}`;
  };

  // Percentage formatting
  const formatPercentage = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';
    return `${num.toFixed(1)}%`;
  };

  // Phone number formatting (XXX-XXX-XXXX)
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  return (
    <View padding={2}>
      <Text color="cyan" bold>Input Formatting Example</Text>
      <LineBreak />
      
      <Text color="yellow" bold>1. Currency Formatting (formatDisplay)</Text>
      <Text>Enter amount (display formatted as $X.XX, raw value stored as number):</Text>
      <Input
        type="number"
        value={currencyValue}
        onChange={(event) => {
          setCurrencyValue(event.value);
        }}
        placeholder="0.00"
        min={0}
        max={999999.99}
        allowDecimals
        decimalPlaces={2}
        formatDisplay={formatCurrency}
        style={{ width: 30 }}
        autoFocus
      />
      <Text color="gray">
        Raw value: {String(currencyValue)} | Type: {typeof currencyValue}
      </Text>
      <Text color="dim">Display shows $X.XX format, but actual value is a number</Text>
      <LineBreak />

      <Text color="yellow" bold>2. Percentage Formatting (formatDisplay)</Text>
      <Text>Enter percentage (display formatted as X.X%, raw value stored as number):</Text>
      <Input
        type="number"
        value={percentageValue}
        onChange={(event) => {
          setPercentageValue(event.value);
        }}
        placeholder="0"
        min={0}
        max={100}
        allowDecimals
        decimalPlaces={1}
        formatDisplay={formatPercentage}
        style={{ width: 30 }}
      />
      <Text color="gray">
        Raw value: {String(percentageValue)} | Type: {typeof percentageValue}
      </Text>
      <Text color="dim">Display shows X.X% format, but actual value is a number</Text>
      <LineBreak />

      <Text color="yellow" bold>3. Phone Number Formatting (formatValue)</Text>
      <Text>Enter phone number (formatted as XXX-XXX-XXXX):</Text>
      <Input
        type="text"
        value={phoneValue}
        onChange={(event) => {
          const raw = (event.value as string).replace(/\D/g, '');
          if (raw.length <= 10) {
            setPhoneValue(raw);
          }
        }}
        placeholder="123-456-7890"
        maxLength={12} // XXX-XXX-XXXX = 12 chars with dashes
        formatValue={(value) => {
          const str = String(value);
          return formatPhone(str);
        }}
        style={{ width: 30 }}
      />
      <Text color="gray">
        Raw value: {phoneValue} | Display: {formatPhone(phoneValue)}
      </Text>
      <Text color="dim">Value is formatted on display, but raw digits are stored</Text>
      <LineBreak />

      <Text color="yellow" bold>4. Number with Step and Range</Text>
      <Text>Enter number (step: 5, range: 0-100):</Text>
      <Input
        type="number"
        value={rawNumberValue}
        onChange={(event) => {
          setRawNumberValue(event.value);
        }}
        placeholder="0"
        min={0}
        max={100}
        step={5}
        style={{ width: 30 }}
      />
      <Text color="gray">
        Value: {String(rawNumberValue)} | Type: {typeof rawNumberValue}
      </Text>
      <Text color="dim">Use arrow keys to adjust by step (5), or type directly</Text>
      <LineBreak />

      <Text color="yellow" bold>5. Number with Decimal Places Enforcement</Text>
      <Text>Enter decimal number (enforced to 3 decimal places):</Text>
      <Input
        type="number"
        value={rawNumberValue}
        onChange={(event) => {
          setRawNumberValue(event.value);
        }}
        placeholder="0.000"
        allowDecimals
        decimalPlaces={3}
        style={{ width: 30 }}
      />
      <Text color="gray">
        Value: {String(rawNumberValue)} (rounded to 3 decimals)
      </Text>
      <LineBreak />

      <Box
        style={{
          border: 'single',
          borderColor: 'cyan',
          padding: { top: 1, bottom: 1, left: 2, right: 2 },
          margin: { top: 2 },
        }}
      >
        <Text color="cyan" bold>Formatting Summary:</Text>
        <Text>Currency: ${typeof currencyValue === 'number' ? currencyValue.toFixed(2) : parseFloat(String(currencyValue || '0')).toFixed(2)}</Text>
        <Text>Percentage: {typeof percentageValue === 'number' ? percentageValue.toFixed(1) : parseFloat(String(percentageValue || '0')).toFixed(1)}%</Text>
        <Text>Phone: {formatPhone(phoneValue) || '(empty)'}</Text>
        <Text>Raw Number: {String(rawNumberValue) || '(empty)'}</Text>
      </Box>

      <LineBreak />
      <Box
        style={{
          border: 'single',
          borderColor: 'yellow',
          padding: { top: 1, bottom: 1, left: 2, right: 2 },
          margin: { top: 1 },
        }}
      >
        <Text color="yellow" bold>Notes:</Text>
        <Text color="dim">• formatDisplay: Formats for display only (doesn't change stored value)</Text>
        <Text color="dim">• formatValue: Formats the actual value stored</Text>
        <Text color="dim">• decimalPlaces: Enforces precision on number inputs</Text>
        <Text color="dim">• step: Controls increment/decrement with arrow keys</Text>
      </Box>

      <LineBreak />
      <Text color="gray" dim>Use Tab to navigate between inputs. Press Ctrl+C to exit.</Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
