[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / Newline

# ~~Function: Newline()~~

> **Newline**(): `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

Defined in: [src/components/primitives/Newline.tsx:26](https://github.com/Baseline-Operations/react-console/blob/main/src/components/primitives/Newline.tsx#L26)

Newline component - Explicit line break (legacy)

Provides explicit line break functionality. This is a legacy component
kept for backward compatibility. Use `LineBreak` instead for better naming.

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\>

React element representing a line break

## Deprecated

Use `LineBreak` component instead. Functionally identical.

## Example

```tsx
<Text>Line 1</Text>
<Newline /> // Use LineBreak instead
<Text>Line 2</Text>
```
