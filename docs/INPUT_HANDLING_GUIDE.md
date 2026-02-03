# Input Handling Guide

This guide covers all aspects of input handling in React Console, including input types, validation, formatting, and event handling.

## Overview

React Console provides a comprehensive input system with:

- **React Native-compatible API**: `TextInput` component with familiar props
- **Multiple input types**: Text, number, multiline via `keyboardType`
- **Validation**: Pattern matching, number constraints, custom validators
- **Formatting**: Display formatting, value formatting, currency/percentage
- **Event handling**: `onChangeText`, `onSubmitEditing`, keyboard events
- **Accessibility**: Focus management, keyboard navigation, disabled state

## TextInput Component

### Basic Text Input

```tsx
import { TextInput } from 'react-console';
import { useState } from 'react';

function BasicInput() {
  const [value, setValue] = useState('');

  return (
    <TextInput value={value} onChangeText={setValue} placeholder="Enter text..." maxLength={50} />
  );
}
```

### Number Input

Number input using `keyboardType`:

```tsx
import { TextInput } from 'react-console';
import { useState } from 'react';

function NumberInput() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      keyboardType="numeric"
      placeholder="0"
      min={0}
      max={100}
      step={1}
      allowDecimals={false}
    />
  );
}
```

### Multiline Input

Multiline text input for longer content:

```tsx
import { TextInput } from 'react-console';
import { useState } from 'react';

function MultilineInput() {
  const [value, setValue] = useState('');

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      multiline
      numberOfLines={5}
      maxWidth={50}
      placeholder="Enter multiple lines..."
    />
  );
}
```

### Password Input

Secure text entry for passwords:

```tsx
import { TextInput } from 'react-console';
import { useState } from 'react';

function PasswordInput() {
  const [password, setPassword] = useState('');

  return (
    <TextInput
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      placeholder="Enter password"
    />
  );
}
```

## Validation

### Pattern Validation

Validate input against a regex pattern:

```tsx
<TextInput
  value={email}
  onChangeText={setEmail}
  pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
  placeholder="user@example.com"
/>
```

### Number Constraints

```tsx
<TextInput
  value={age}
  onChangeText={setAge}
  keyboardType="numeric"
  min={18}
  max={120}
  step={1}
  allowDecimals={false}
/>
```

### Custom Validation

Use `onChangeText` to implement custom validation:

```tsx
function CustomValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={(text) => {
          setValue(text);

          // Custom validation
          if (text.length < 3) {
            setError('Must be at least 3 characters');
          } else {
            setError('');
          }
        }}
      />
      {error && <Text color="red">{error}</Text>}
    </View>
  );
}
```

### Validation Feedback

TextInput component provides built-in validation feedback:

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  keyboardType="numeric"
  min={0}
  max={100}
  // Invalid input shows red color and error message when focused
/>
```

The input automatically:

- Shows red color for invalid input
- Displays error message below input when focused
- Clears error on valid input

## Formatting

### Display Formatting

Format how the value is displayed (doesn't change actual value):

```tsx
<TextInput
  value={price}
  onChangeText={setPrice}
  keyboardType="decimal-pad"
  formatDisplay={(v) =>
    `$${typeof v === 'number' ? v.toFixed(2) : parseFloat(String(v)).toFixed(2)}`
  }
/>
```

### Value Formatting

Format the actual value:

```tsx
<TextInput value={value} onChangeText={setValue} formatValue={(v) => String(v).toUpperCase()} />
```

### Display Format Strings

Use predefined format strings:

```tsx
// Currency
<TextInput
  value={price}
  onChangeText={setPrice}
  keyboardType="decimal-pad"
  displayFormat="currency"
/>

// Percentage
<TextInput
  value={rate}
  onChangeText={setRate}
  keyboardType="decimal-pad"
  displayFormat="percentage"
/>

// Number with locale formatting
<TextInput
  value={count}
  onChangeText={setCount}
  keyboardType="numeric"
  displayFormat="number"
/>
```

### Number Formatting Options

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  keyboardType="decimal-pad"
  allowDecimals={true} // Allow decimal numbers
  decimalPlaces={2} // Enforce 2 decimal places
  step={0.01} // Step value for increment/decrement
  min={0} // Minimum value
  max={9999.99} // Maximum value
/>
```

## Event Handling

### onChangeText Event (React Native-compatible)

Handle value changes with simple string callback:

```tsx
<TextInput
  value={value}
  onChangeText={(text) => {
    // text is the new string value
    setValue(text);
  }}
/>
```

### onSubmitEditing Event (React Native-compatible)

Handle submission (Enter key):

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  onSubmitEditing={(event) => {
    // Triggered on Enter key
    console.log('Submitted:', event.nativeEvent.text);
    handleSubmit(event.nativeEvent.text);
  }}
  returnKeyType="done"
/>
```

### onEndEditing Event

Handle when editing ends (blur):

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  onEndEditing={(event) => {
    console.log('Editing ended:', event.nativeEvent.text);
  }}
/>
```

### onKeyDown Event

Handle keyboard events:

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  onKeyDown={(e) => {
    // e.key contains key information
    if (e.key.escape) {
      handleCancel();
    } else if (e.key.ctrl && e.key.char === 's') {
      e.preventDefault(); // Prevent default behavior
      handleSave();
    }
  }}
/>
```

### onFocus / onBlur Events

Handle focus changes:

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  onFocus={() => {
    console.log('Input focused');
  }}
  onBlur={() => {
    console.log('Input blurred');
  }}
/>
```

## TextInput Properties

### Basic Properties

```tsx
<TextInput
  value={value} // Controlled value
  defaultValue="default" // Uncontrolled default value
  placeholder="Hint text" // Placeholder when empty
  placeholderTextColor="gray" // Placeholder text color
  editable={true} // Enable/disable editing
  disabled={false} // Disable input (alias for !editable)
  autoFocus // Auto-focus on mount
  tabIndex={0} // Tab order
/>
```

### Size Constraints

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  maxLength={50} // Maximum character length
  maxWidth={40} // Maximum input width
  multiline // Allow multiline
  numberOfLines={5} // Maximum lines for multiline (RN-compatible)
/>
```

### Secure Entry (Password)

Mask input for passwords:

```tsx
<TextInput
  value={password}
  onChangeText={setPassword}
  secureTextEntry // Hide characters with mask
/>
```

### Keyboard Types

Specify input type for validation:

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  keyboardType="default" // 'default' | 'numeric' | 'decimal-pad' | 'number-pad'
/>
```

## Number Input Specifics

### Step Value

Control increment/decrement step:

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  keyboardType="decimal-pad"
  step={0.1} // Step by 0.1
/>
```

### Min/Max Constraints

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  keyboardType="numeric"
  min={0} // Minimum value
  max={100} // Maximum value
/>
```

### Decimal Handling

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  keyboardType="decimal-pad"
  allowDecimals={true} // Allow decimals
  decimalPlaces={2} // Enforce decimal places
/>
```

## Multiline Input

### Basic Multiline

```tsx
<TextInput value={value} onChangeText={setValue} multiline />
```

### Multiline with Constraints

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  multiline
  numberOfLines={10} // Maximum number of lines
  maxWidth={60} // Maximum width per line
/>
```

## Form Integration

### Controlled Input

```tsx
function ControlledInput() {
  const [value, setValue] = useState('');

  return <TextInput value={value} onChangeText={setValue} />;
}
```

### Uncontrolled Input

```tsx
function UncontrolledInput() {
  return (
    <TextInput
      defaultValue="initial"
      onChangeText={(text) => {
        // Handle change but don't control value
        console.log('Changed to:', text);
      }}
    />
  );
}
```

### Form with Validation

```tsx
function Form() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <View>
      <TextInput
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        placeholder="Name"
      />
      {errors.name && <Text color="red">{errors.name}</Text>}

      <TextInput
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        placeholder="Email"
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
      />
      {errors.email && <Text color="red">{errors.email}</Text>}

      <Button onClick={validate}>Submit</Button>
    </View>
  );
}
```

## Keyboard Navigation

### Special Keys

TextInput component handles special keys:

- **Enter**: Triggers `onSubmitEditing` event
- **Escape**: Can be handled via `onKeyDown`
- **Tab**: Navigates to next component (handled by renderer)
- **Arrow Keys**: Move cursor (in multiline) or can be handled via `onKeyDown`
- **Backspace/Delete**: Delete characters
- **Page Up/Down/Home/End**: Ignored for text input (used by selection components)

### Custom Keyboard Handling

```tsx
<TextInput
  value={value}
  onChangeText={setValue}
  onKeyDown={(e) => {
    // Handle custom keyboard shortcuts
    if (e.key.ctrl && e.key.char === 'a') {
      e.preventDefault();
      selectAll();
    }
  }}
/>
```

## Best Practices

### 1. Use Controlled Inputs for Forms

```tsx
// Good: Controlled with onChangeText
const [value, setValue] = useState('');
<TextInput value={value} onChangeText={setValue} />;
```

### 2. Validate on Change

```tsx
<TextInput
  value={value}
  onChangeText={(text) => {
    setValue(text);
    validate(text);
  }}
/>
```

### 3. Use Pattern for Simple Validation

```tsx
// Good: Use pattern prop for regex validation
<TextInput pattern={/^[a-z]+$/i} />

// Also works: Custom validation in onChangeText
<TextInput onChangeText={(text) => validate(text)} />
```

### 4. Format Display, Not Value

```tsx
// Good: Format display, keep raw value
<TextInput formatDisplay={(v) => `$${parseFloat(v).toFixed(2)}`} onChangeText={setRawValue} />

// Avoid: Formatting value directly (loses precision)
```

### 5. Use Appropriate Keyboard Types

```tsx
// Good: Use keyboardType for numeric input
<TextInput keyboardType="numeric" min={0} max={100} />

// Avoid: Using default type and parsing manually
<TextInput onChangeText={(text) => parseFloat(text)} />
```

### 6. Handle Multiline Appropriately

```tsx
// Good: Set numberOfLines for multiline
<TextInput multiline numberOfLines={10} />

// Avoid: Unlimited multiline (can cause issues)
<TextInput multiline />
```

## Common Patterns

### Currency Input

```tsx
function CurrencyInput() {
  const [price, setPrice] = useState('');

  return (
    <TextInput
      value={price}
      onChangeText={setPrice}
      keyboardType="decimal-pad"
      min={0}
      allowDecimals
      decimalPlaces={2}
      formatDisplay={(v) => {
        const num = parseFloat(String(v));
        return isNaN(num) ? '' : `$${num.toFixed(2)}`;
      }}
      placeholder="$0.00"
    />
  );
}
```

### Email Input with Validation

```tsx
function EmailInput() {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(true);

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text));
        }}
        placeholder="user@example.com"
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
      />
      {!isValid && email && <Text color="red">Invalid email format</Text>}
    </View>
  );
}
```

### Search Input with Debouncing

Using the `useDebounce` hook:

```tsx
import { TextInput, useDebounce } from 'react-console';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <TextInput value={query} onChangeText={setQuery} placeholder="Search..." />;
}
```

### Password Input

```tsx
function PasswordInput() {
  const [password, setPassword] = useState('');

  return (
    <TextInput
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      placeholder="Enter password"
    />
  );
}
```

### TextInput with Ref

Control input programmatically using refs:

```tsx
import { TextInput, useRef } from 'react-console';
import type { TextInputRef } from 'react-console';

function InputWithRef() {
  const inputRef = useRef<TextInputRef>(null);

  const focusInput = () => inputRef.current?.focus();
  const clearInput = () => inputRef.current?.clear();

  return (
    <View>
      <TextInput ref={inputRef} placeholder="Type here..." />
      <Button onPress={focusInput}>Focus</Button>
      <Button onPress={clearInput}>Clear</Button>
    </View>
  );
}
```

## Troubleshooting

### Input Not Updating

1. Check that `onChange` is provided
2. Verify value is being set in state
3. Ensure component is not disabled

### Validation Not Working

1. Check pattern regex is correct
2. Verify min/max constraints for numbers
3. Ensure validation runs in `onChange`

### Formatting Issues

1. Check `formatDisplay` returns string
2. Verify `formatValue` doesn't break type
3. Ensure decimal places are set for currency

### Multiline Not Working

1. Verify `multiline={true}` is set
2. Check `maxLines` is appropriate
3. Ensure `maxWidth` allows wrapping

## Further Reading

- [Event Handling Guide](./EVENT_HANDLING_GUIDE.md) - Detailed event handling documentation
- [State Management Guide](./STATE_MANAGEMENT.md) - State management patterns
- [Styling Guide](./STYLING_GUIDE.md) - Input styling options
