[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Button

# Variable: Button()

> `const` **Button**: (`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> = `ButtonComponent`

Defined in: [src/components/interactive/Button.tsx:112](https://github.com/Baseline-Operations/react-console/blob/main/src/components/interactive/Button.tsx#L112)

Button component - Clickable action button with keyboard and mouse support

Supports both keyboard activation (Enter/Space when focused) and mouse clicks
(if terminal supports mouse events). Automatically disabled when `disabled` prop is true.

## Parameters

### props

[`ButtonProps`](../interfaces/ButtonProps.md)

Button component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a button

## Example

```tsx
<Button onClick={() => handleSubmit()}>
  Submit
</Button>

<Button
  label="Cancel"
  disabled={isLoading}
  onClick={handleCancel}
  style={{ color: 'red' }}
/>
```
