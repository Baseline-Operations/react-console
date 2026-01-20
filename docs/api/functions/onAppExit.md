[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / onAppExit

# Function: onAppExit()

> **onAppExit**(`callback`): () => `void`

Defined in: src/hooks/lifecycle.ts:148

Register a callback to be called when the application exits

This can be called outside of React components. The callback is called when
exit() is called or the process receives exit signals.

## Parameters

### callback

() => `void`

Callback function called on application exit

## Returns

Unsubscribe function to remove the listener

> (): `void`

### Returns

`void`

## Examples

```ts
// Outside of components
import { onAppExit } from 'react-console';

onAppExit(() => {
  console.log('Application exiting...');
  // Save state, close connections, cleanup resources
});
```

```tsx
// Can also be used in components
function App() {
  useEffect(() => {
    const unsubscribe = onAppExit(() => {
      console.log('Application exiting...');
    });
    return unsubscribe;
  }, []);
  
  return <View>My App</View>;
}
```
