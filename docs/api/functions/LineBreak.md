[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / LineBreak

# Function: LineBreak()

> **LineBreak**(): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/primitives/LineBreak.tsx:27](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/LineBreak.tsx#L27)

LineBreak component - Explicit line break for terminal rendering

Provides explicit line break functionality similar to React Native's `<br />`.
Terminal-aware: handles differently in static, interactive, and fullscreen modes.

- Static mode: Simple newline output
- Interactive mode: May trigger scroll or buffer management
- Fullscreen mode: May affect layout calculations

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a line break

## Example

```tsx
<Text>Line 1</Text>
<LineBreak />
<Text>Line 2</Text>
```
