/**
 * Interactive example - Input component with JSX-style event handlers
 * Demonstrates: focus/blur events, validation, disabled button, submitButtonId
 */

import React, { useState, useMemo } from 'react';
import { render, Text, View, TextInput, Button, LineBreak, debug } from '../src/index';

function App() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Determine if button should be disabled
  const isButtonDisabled = useMemo(() => !name.trim(), [name]);

  debug('[App] render', { name, isButtonDisabled });

  // Validate name
  const validateName = (value: string): string | null => {
    if (!value.trim()) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  };

  // Handle input focus
  const handleFocus = () => {
    // Mark as touched when focused
    setTouched(true);
  };

  // Handle input blur - validate when leaving the field
  const handleBlur = () => {
    const validationError = validateName(name);
    setError(validationError);
  };

  // Handle form submission
  const handleSubmit = () => {
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitted(true);
  };

  return (
    <View padding={2}>
      <Text color="cyan" bold>
        Interactive Console App
      </Text>
      <LineBreak />

      {!submitted ? (
        <>
          <Text>Enter your name:</Text>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              // Clear error when user types
              if (touched && error) {
                const validationError = validateName(text);
                setError(validationError);
              }
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Type your name and press Enter"
            autoFocus
            submitButtonId="submit-btn"
          />

          {/* Show error message if validation failed */}
          {error && touched && (
            <>
              <Text color="red">{error}</Text>
            </>
          )}

          <LineBreak />
          <Button
            id="submit-btn"
            onClick={handleSubmit}
            label="Submit"
            disabled={isButtonDisabled}
            disabledStyle={{ color: '#666666', backgroundColor: '#333333' }}
          />

          {/* Help text */}
          <LineBreak />
          <Text color="gray" dim>
            Press Tab to switch between input and button. Press Enter to submit.
          </Text>
        </>
      ) : (
        <>
          <Text color="green" bold>
            Hello, {name}!
          </Text>
          <Text>Thanks for using React Console.</Text>
        </>
      )}
    </View>
  );
}

render(<App />, {
  mode: 'interactive',
  navigation: {
    // Enable arrow key navigation between focusable elements
    arrowKeyNavigation: true,
    // Or configure separately:
    // verticalArrowNavigation: true,  // up/down arrows
    // horizontalArrowNavigation: false, // left/right arrows (disabled)
  },
});
