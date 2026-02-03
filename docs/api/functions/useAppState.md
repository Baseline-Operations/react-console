[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / useAppState

# Function: useAppState()

> **useAppState**(): [`AppStateStatus`](../type-aliases/AppStateStatus.md)

Defined in: src/apis/AppState.ts:174

Hook: useAppState
React hook for subscribing to app state changes

## Returns

[`AppStateStatus`](../type-aliases/AppStateStatus.md)

## Example

```tsx
import { useAppState } from 'react-console/apis';

function MyComponent() {
  const appState = useAppState();

  return <Text>App is {appState}</Text>;
}
```
