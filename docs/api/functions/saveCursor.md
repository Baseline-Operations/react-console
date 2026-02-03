[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / saveCursor

# Function: saveCursor()

> **saveCursor**(): `string`

Defined in: [src/utils/console.ts:105](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/console.ts#L105)

Save cursor position

Generates an ANSI escape sequence that saves the current cursor position. Use with `restoreCursor()` to return to this position later.

## Returns

`string`

ANSI escape sequence string.

## Example

```typescript
import { saveCursor, restoreCursor } from 'react-console';

// Save cursor position before drawing
process.stdout.write(saveCursor());
// ... perform drawing operations ...
// Restore cursor position
process.stdout.write(restoreCursor());
```
