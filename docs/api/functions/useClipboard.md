[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / useClipboard

# Function: useClipboard()

> **useClipboard**(): \[`string`, (`text`) => `Promise`\<`void`\>\]

Defined in: src/apis/Clipboard.ts:263

Hook: useClipboard
React hook for clipboard access

## Returns

\[`string`, (`text`) => `Promise`\<`void`\>\]

## Example

```tsx
const [clipboardText, setClipboardText] = useClipboard();

// Read clipboard on mount
useEffect(() => {
  Clipboard.getString().then(setClipboardText);
}, []);

// Copy to clipboard
const handleCopy = () => setClipboardText('Copied text!');
```
