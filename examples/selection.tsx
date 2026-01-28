/**
 * Selection Components Example - Demonstrates Radio, Checkbox, Dropdown, and List components
 * Shows single/multiple selection, options, and event handling
 */

import React, { useState } from 'react';
import { render, Text, View, Radio, Checkbox, Dropdown, List, LineBreak, Box } from '../src/index';

function App() {
  const [radioValue, setRadioValue] = useState<string | number>('option1');
  const [checkboxValues, setCheckboxValues] = useState<(string | number)[]>([]);
  const [dropdownValue, setDropdownValue] = useState<string | number>('option1');
  const [dropdownMultipleValues, setDropdownMultipleValues] = useState<(string | number)[]>([]);
  const [listValue, setListValue] = useState<string | number>('option1');
  const [listMultipleValues, setListMultipleValues] = useState<(string | number)[]>([]);

  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
    { label: 'Option 5', value: 'option5' },
  ];

  return (
    <View padding={2}>
      <Text color="cyan" bold>Selection Components Example</Text>
      <LineBreak />
      
      <Text color="yellow" bold>1. Radio Buttons (Single Selection)</Text>
      <Text>Select one option:</Text>
      <Radio
        options={options}
        value={radioValue}
        onChange={(event) => {
          setRadioValue(event.value as string | number);
        }}
        name="radio-group"
        autoFocus
      />
      <Text color="gray">Selected: {String(radioValue)}</Text>
      <LineBreak />

      <Text color="yellow" bold>2. Checkboxes (Multiple Selection)</Text>
      <Text>Select multiple options:</Text>
      <Checkbox
        options={options.slice(0, 3)} // Show first 3 options
        value={checkboxValues}
        onChange={(event) => {
          setCheckboxValues(event.value as (string | number)[]);
        }}
        multiple
      />
      <Text color="gray">
        Selected: {checkboxValues.length > 0 ? checkboxValues.join(', ') : '(none)'}
      </Text>
      <LineBreak />

      <Text color="yellow" bold>3. Dropdown (Single Selection)</Text>
      <Text>Select one option from dropdown:</Text>
      <Dropdown
        options={options}
        value={dropdownValue}
        onChange={(event) => {
          setDropdownValue(event.value as string | number);
        }}
        style={{ width: 30 }}
      />
      <Text color="gray">Selected: {String(dropdownValue)}</Text>
      <Text color="dim">Press Space or Enter to open dropdown, arrow keys to navigate</Text>
      <LineBreak />

      <Text color="yellow" bold>4. Dropdown (Multiple Selection)</Text>
      <Text>Select multiple options from dropdown:</Text>
      <Dropdown
        options={options}
        value={dropdownMultipleValues}
        onChange={(event) => {
          setDropdownMultipleValues(event.value as (string | number)[]);
        }}
        multiple
        style={{ width: 30 }}
      />
      <Text color="gray">
        Selected: {dropdownMultipleValues.length > 0 ? dropdownMultipleValues.join(', ') : '(none)'}
      </Text>
      <LineBreak />

      <Text color="yellow" bold>5. List (Single Selection)</Text>
      <Text>Select one option from list:</Text>
      <List
        options={options}
        value={listValue}
        onChange={(event) => {
          setListValue(event.value as string | number);
        }}
        style={{ width: 30, height: 5 }}
      />
      <Text color="gray">Selected: {String(listValue)}</Text>
      <Text color="dim">Use arrow keys to navigate, Enter to select</Text>
      <LineBreak />

      <Text color="yellow" bold>6. List (Multiple Selection)</Text>
      <Text>Select multiple options from list:</Text>
      <List
        options={options}
        value={listMultipleValues}
        onChange={(event) => {
          setListMultipleValues(event.value as (string | number)[]);
        }}
        multiple
        style={{ width: 30, height: 5 }}
      />
      <Text color="gray">
        Selected: {listMultipleValues.length > 0 ? listMultipleValues.join(', ') : '(none)'}
      </Text>
      <Text color="dim">Use Space to toggle selection, arrow keys to navigate</Text>
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
        <Text>Radio: {String(radioValue)}</Text>
        <Text>Checkboxes: {checkboxValues.length > 0 ? checkboxValues.join(', ') : '(none)'}</Text>
        <Text>Dropdown (single): {String(dropdownValue)}</Text>
        <Text>Dropdown (multiple): {dropdownMultipleValues.length > 0 ? dropdownMultipleValues.join(', ') : '(none)'}</Text>
        <Text>List (single): {String(listValue)}</Text>
        <Text>List (multiple): {listMultipleValues.length > 0 ? listMultipleValues.join(', ') : '(none)'}</Text>
      </Box>

      <LineBreak />
      <Text color="gray" dim>Use Tab to navigate between components. Press Ctrl+C to exit.</Text>
    </View>
  );
}

render(<App />, { mode: 'interactive' });
