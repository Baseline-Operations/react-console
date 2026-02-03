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

Returns a tuple:

- `clipboardText` - The current clipboard text (initially empty string)
- `setClipboardText` - Async function to copy text to clipboard

**Note:** The hook does NOT auto-populate `clipboardText` on mount. To read the current clipboard content, you must manually fetch it using `Clipboard.getString()`.

## Example

```tsx
import { useClipboard, Clipboard } from 'react-console';
import { useEffect } from 'react';

function MyComponent() {
  const [clipboardText, setClipboardText] = useClipboard();

  // Manually read clipboard on mount (hook does not auto-load)
  useEffect(() => {
    Clipboard.getString().then((text) => {
      // Note: setClipboardText copies TO clipboard, not just sets state
      // Use local state if you just want to display clipboard content
      console.log('Current clipboard:', text);
    });
  }, []);

  // Copy to clipboard
  const handleCopy = async () => {
    await setClipboardText('Copied text!');
  };

  return <Button onPress={handleCopy}>Copy</Button>;
}
```
