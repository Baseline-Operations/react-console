[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Switch

# Function: Switch()

> **Switch**(`props`): `ReactElement`\<`unknown`\>

Defined in: src/components/interactive/Switch.tsx:114

Switch component - Toggle switch (React Native compatible)

A toggle switch that can be switched between on and off states.
Supports both controlled (value + onValueChange) and uncontrolled (defaultValue) modes.

## Parameters

### props

[`SwitchProps`](../interfaces/SwitchProps.md)

Switch component props

## Returns

`ReactElement`\<`unknown`\>

React element representing a toggle switch

## Example

```tsx
// Controlled
const [isEnabled, setIsEnabled] = useState(false);
<Switch value={isEnabled} onValueChange={setIsEnabled} />

// With colors
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: 'gray', true: 'green' }}
  thumbColor={isEnabled ? 'white' : 'lightgray'}
/>

// With labels
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  onLabel="ON"
  offLabel="OFF"
/>
```
