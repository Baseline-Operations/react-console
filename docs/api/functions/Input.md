[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / Input

# Function: Input()

> **Input**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: src/components/interactive/Input.tsx:123

Input component - Text input field with validation and formatting support

Provides controlled/uncontrolled input similar to React Native's TextInput.
Supports text and number types with validation, formatting, multiline input,
and all standard event handlers (onChange, onKeyDown, onSubmit, etc.).

## Parameters

### props

[`InputProps`](../interfaces/InputProps.md)

Input component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing an input field

## Example

```tsx
const [value, setValue] = useState('');

<Input
  value={value}
  onChange={(event) => setValue(event.value)}
  onKeyDown={(event) => {
    if (event.key.return) {
      handleSubmit();
    }
  }}
  placeholder="Type here..."
  autoFocus
/>
```
