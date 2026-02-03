[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / useBackHandler

# Function: useBackHandler()

> **useBackHandler**(`_handler`): `void`

Defined in: src/apis/BackHandler.ts:147

Hook: useBackHandler
React hook for handling back button presses

## Parameters

### \_handler

`BackHandlerCallback`

## Returns

`void`

## Example

```tsx
import { useBackHandler } from 'react-console/apis';

function MyComponent() {
  useBackHandler(() => {
    if (modalVisible) {
      closeModal();
      return true;
    }
    return false;
  });

  // ...
}
```
