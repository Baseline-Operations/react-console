[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ActivityIndicator

# Function: ActivityIndicator()

> **ActivityIndicator**(`props`): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Defined in: [src/components/ui/ActivityIndicator.tsx:75](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ui/ActivityIndicator.tsx#L75)

ActivityIndicator component - Animated loading indicator

React-Native-compatible loading indicator. Displays an animated spinner
with different styles and optional label. Automatically animates when rendered.

## Parameters

### props

[`ActivityIndicatorProps`](../interfaces/ActivityIndicatorProps.md)

ActivityIndicator component props

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

React element representing a loading indicator

## Example

```tsx
// Basic usage
<ActivityIndicator />

// With color and size
<ActivityIndicator color="#00ff00" size="large" />

// With label (terminal-specific)
<ActivityIndicator label="Loading..." color="cyan" />

// Conditional display
<ActivityIndicator animating={isLoading} />
```
