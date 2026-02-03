[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / TextInput

# Function: TextInput()

> **TextInput**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/interactive/TextInput.tsx:181

TextInput component - Text input field with validation and formatting support

Provides controlled/uncontrolled input similar to React Native's TextInput.
Supports text and number types with validation, formatting, multiline input,
and all standard event handlers (onChangeText, onSubmitEditing, etc.).

## Parameters

### props

[`TextInputProps`](../interfaces/TextInputProps.md)

TextInput component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing an input field

## Example

```tsx
const [value, setValue] = useState('');

<TextInput
  value={value}
  onChangeText={setValue}
  onSubmitEditing={() => handleSubmit()}
  placeholder="Type here..."
  autoFocus
/>;
```
