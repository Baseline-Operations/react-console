[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / setErrorHandler

# Function: setErrorHandler()

> **setErrorHandler**(`handler`): `void`

Defined in: [src/utils/errors.ts:96](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/errors.ts#L96)

Set custom error handler

Registers a custom error handler that will be invoked when errors occur in the React Console library. The handler receives the error, error type, and optional context data.

## Parameters

### handler

[`ErrorHandler`](../type-aliases/ErrorHandler.md)

The error handler function with signature: `(error: Error, type: ErrorType, context?: Record<string, unknown>) => void`

## Returns

`void`

## Example

```typescript
import { setErrorHandler, ErrorType } from 'react-console';

setErrorHandler((error, type, context) => {
  if (type === ErrorType.RENDER) {
    // Handle render errors
    console.error('Render error:', error.message);
  }
  // Send to monitoring service
  logToService({ error, type, context });
});
```
