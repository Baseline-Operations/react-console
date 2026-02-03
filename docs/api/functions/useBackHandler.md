[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / useBackHandler

# Function: useBackHandler()

> **useBackHandler**(`handler`): `void`

Defined in: [src/apis/BackHandler.ts:147](https://github.com/Baseline-Operations/react-console/blob/main/src/apis/BackHandler.ts#L147)

Hook: useBackHandler
React hook for handling back button presses (Escape key in terminal).

## Parameters

### handler

`BackHandlerCallback`

Callback function invoked when the back button (Escape) is pressed.
Should return `true` if the event was handled (consumed), or `false` to allow the event to propagate to other handlers.

**Callback signature:** `() => boolean`

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
