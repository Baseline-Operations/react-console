# Input Handling Guide

This guide covers all aspects of input handling in React Console, including input types, validation, formatting, and event handling.

## Overview

React Console provides a comprehensive input system with:
- **Multiple input types**: Text, number, multiline
- **Validation**: Pattern matching, number constraints, custom validators
- **Formatting**: Display formatting, value formatting, currency/percentage
- **Event handling**: onChange, onKeyDown, onSubmit, and more
- **Accessibility**: Focus management, keyboard navigation, disabled state

## Input Types

### Text Input

Basic text input for strings:

```tsx
import { Input } from 'react-console';
import { useState } from 'react';

function TextInput() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => setValue(e.value as string)}
      placeholder="Enter text..."
      maxLength={50}
    />
  );
}
```

### Number Input

Number input with validation and constraints:

```tsx
import { Input } from 'react-console';
import { useState } from 'react';

function NumberInput() {
  const [value, setValue] = useState<number | string>('');
  
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => setValue(e.value)}
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
import { Input } from 'react-console';
import { useState } from 'react';

function MultilineInput() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => setValue(e.value as string)}
      multiline
      maxLines={5}
      maxWidth={50}
      placeholder="Enter multiple lines..."
    />
  );
}
```

## Validation

### Pattern Validation

Validate input against a regex pattern:

```tsx
<Input
  type="text"
  value={email}
  onChange={(e) => setEmail(e.value as string)}
  pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
  placeholder="user@example.com"
/>
```

### Number Constraints

```tsx
<Input
  type="number"
  value={age}
  onChange={(e) => setAge(e.value)}
  min={18}
  max={120}
  step={1}
  allowDecimals={false}
/>
```

### Custom Validation

Use `onChange` to implement custom validation:

```tsx
function CustomValidation() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  
  return (
    <View>
      <Input
        value={value}
        onChange={(e) => {
          const newValue = e.value as string;
          setValue(newValue);
          
          // Custom validation
          if (newValue.length < 3) {
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

Input component provides built-in validation feedback:

```tsx
<Input
  type="number"
  value={value}
  onChange={(e) => setValue(e.value)}
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
<Input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.value)}
  formatDisplay={(v) => `$${typeof v === 'number' ? v.toFixed(2) : parseFloat(String(v)).toFixed(2)}`}
/>
```

### Value Formatting

Format the actual value:

```tsx
<Input
  type="text"
  value={value}
  onChange={(e) => setValue(e.value as string)}
  formatValue={(v) => String(v).toUpperCase()}
/>
```

### Display Format Strings

Use predefined format strings:

```tsx
// Currency
<Input
  type="number"
  value={price}
  onChange={(e) => setPrice(e.value)}
  displayFormat="currency"
/>

// Percentage
<Input
  type="number"
  value={rate}
  onChange={(e) => setRate(e.value)}
  displayFormat="percentage"
/>

// Number with locale formatting
<Input
  type="number"
  value={count}
  onChange={(e) => setCount(e.value)}
  displayFormat="number"
/>
```

### Number Formatting Options

```tsx
<Input
  type="number"
  value={value}
  onChange={(e) => setValue(e.value)}
  allowDecimals={true}      // Allow decimal numbers
  decimalPlaces={2}         // Enforce 2 decimal places
  step={0.01}                // Step value for increment/decrement
  min={0}                    // Minimum value
  max={9999.99}             // Maximum value
/>
```

## Event Handling

### onChange Event

Handle value changes:

```tsx
<Input
  value={value}
  onChange={(e) => {
    // e.value is the new value (string or number)
    setValue(e.value);
    
    // e.key contains key press information
    if (e.key.return) {
      handleSubmit();
    }
  }}
/>
```

### onKeyDown Event

Handle keyboard events:

```tsx
<Input
  value={value}
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

### onSubmit Event

Handle form submission:

```tsx
<Input
  value={value}
  onSubmit={(e) => {
    // Triggered on Enter key
    handleSubmit(e.value);
  }}
/>
```

### onFocus / onBlur Events

Handle focus changes:

```tsx
<Input
  value={value}
  onFocus={() => {
    console.log('Input focused');
  }}
  onBlur={() => {
    console.log('Input blurred');
  }}
/>
```

## Input Properties

### Basic Properties

```tsx
<Input
  value={value}              // Controlled value
  defaultValue="default"    // Uncontrolled default value
  placeholder="Hint text"   // Placeholder when empty
  disabled={false}           // Disable input
  autoFocus                  // Auto-focus on mount
  tabIndex={0}              // Tab order
/>
```

### Size Constraints

```tsx
<Input
  value={value}
  maxLength={50}            // Maximum character length
  maxWidth={40}             // Maximum input width
  multiline                 // Allow multiline
  maxLines={5}              // Maximum lines for multiline
/>
```

### Masking

Mask input for passwords or sensitive data:

```tsx
<Input
  type="text"
  value={password}
  onChange={(e) => setPassword(e.value as string)}
  mask="*"                  // Show '*' instead of actual characters
/>
```

## Number Input Specifics

### Step Value

Control increment/decrement step:

```tsx
<Input
  type="number"
  value={value}
  onChange={(e) => setValue(e.value)}
  step={0.1}                // Step by 0.1
/>
```

### Min/Max Constraints

```tsx
<Input
  type="number"
  value={value}
  onChange={(e) => setValue(e.value)}
  min={0}                   // Minimum value
  max={100}                 // Maximum value
/>
```

### Decimal Handling

```tsx
<Input
  type="number"
  value={value}
  onChange={(e) => setValue(e.value)}
  allowDecimals={true}      // Allow decimals
  decimalPlaces={2}         // Enforce decimal places
/>
```

## Multiline Input

### Basic Multiline

```tsx
<Input
  type="text"
  value={value}
  onChange={(e) => setValue(e.value as string)}
  multiline
/>
```

### Multiline with Constraints

```tsx
<Input
  type="text"
  value={value}
  onChange={(e) => setValue(e.value as string)}
  multiline
  maxLines={10}             // Maximum number of lines
  maxWidth={60}             // Maximum width per line
/>
```

## Form Integration

### Controlled Input

```tsx
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.value as string)}
    />
  );
}
```

### Uncontrolled Input

```tsx
function UncontrolledInput() {
  return (
    <Input
      defaultValue="initial"
      onChange={(e) => {
        // Handle change but don't control value
        console.log('Changed to:', e.value);
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
  const [errors, setErrors] = useState({});
  
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
      <Input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.value as string })}
        placeholder="Name"
      />
      {errors.name && <Text color="red">{errors.name}</Text>}
      
      <Input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.value as string })}
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

Input component handles special keys:

- **Enter**: Triggers `onSubmit` event
- **Escape**: Can be handled via `onKeyDown`
- **Tab**: Navigates to next component (handled by renderer)
- **Arrow Keys**: Move cursor (in multiline) or can be handled via `onKeyDown`
- **Backspace/Delete**: Delete characters
- **Page Up/Down/Home/End**: Ignored for text input (used by selection components)

### Custom Keyboard Handling

```tsx
<Input
  value={value}
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
// Good: Controlled
const [value, setValue] = useState('');
<Input value={value} onChange={(e) => setValue(e.value as string)} />
```

### 2. Validate on Change

```tsx
<Input
  value={value}
  onChange={(e) => {
    setValue(e.value as string);
    validate(e.value as string);
  }}
/>
```

### 3. Use Pattern for Simple Validation

```tsx
// Good: Use pattern prop for regex validation
<Input pattern={/^[a-z]+$/i} />

// Also works: Custom validation in onChange
<Input onChange={(e) => validate(e.value)} />
```

### 4. Format Display, Not Value

```tsx
// Good: Format display, keep raw value
<Input
  formatDisplay={(v) => `$${v.toFixed(2)}`}
  onChange={(e) => setRawValue(e.value)}
/>

// Avoid: Formatting value directly (loses precision)
```

### 5. Use Appropriate Input Types

```tsx
// Good: Use number type for numeric input
<Input type="number" min={0} max={100} />

// Avoid: Using text type and parsing manually
<Input type="text" onChange={(e) => parseFloat(e.value)} />
```

### 6. Handle Multiline Appropriately

```tsx
// Good: Set maxLines for multiline
<Input multiline maxLines={10} />

// Avoid: Unlimited multiline (can cause issues)
<Input multiline />
```

## Common Patterns

### Currency Input

```tsx
function CurrencyInput() {
  const [price, setPrice] = useState<number | string>('');
  
  return (
    <Input
      type="number"
      value={price}
      onChange={(e) => setPrice(e.value)}
      min={0}
      allowDecimals
      decimalPlaces={2}
      formatDisplay={(v) => {
        const num = typeof v === 'number' ? v : parseFloat(String(v));
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
      <Input
        type="text"
        value={email}
        onChange={(e) => {
          const newEmail = e.value as string;
          setEmail(newEmail);
          setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail));
        }}
        placeholder="user@example.com"
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
      />
      {!isValid && email && (
        <Text color="red">Invalid email format</Text>
      )}
    </View>
  );
}
```

### Search Input with Debouncing

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.value as string)}
      placeholder="Search..."
    />
  );
}
```

### Password Input

```tsx
function PasswordInput() {
  const [password, setPassword] = useState('');
  
  return (
    <Input
      type="text"
      value={password}
      onChange={(e) => setPassword(e.value as string)}
      mask="*"
      placeholder="Enter password"
    />
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
