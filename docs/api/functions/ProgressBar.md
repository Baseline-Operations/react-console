[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / ProgressBar

# Function: ProgressBar()

> **ProgressBar**(`props`): `ReactElement`\<`unknown`\>

Defined in: [src/components/ui/ProgressBar.tsx:47](https://github.com/Baseline-Operations/react-console/blob/main/src/components/ui/ProgressBar.tsx#L47)

ProgressBar component - Visual progress indicator

Displays a horizontal or vertical progress bar with customizable appearance.

## Parameters

### props

[`ProgressBarProps`](../interfaces/ProgressBarProps.md)

ProgressBar component props

## Returns

`ReactElement`\<`unknown`\>

React element representing a progress bar

## Example

```tsx
<ProgressBar value={75} label="Uploading..." />

<ProgressBar
  value={50}
  width={40}
  filledColor="cyan"
  showPercentage
/>
```
