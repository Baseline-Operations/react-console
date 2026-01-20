[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / onAppStart

# Function: onAppStart()

> **onAppStart**(`callback`): () => `void`

Defined in: src/hooks/lifecycle.ts:109

Register a callback to be called when the application starts

This can be called outside of React components. The callback is called once
when the application is first rendered.

## Parameters

### callback

() => `void`

Callback function called on application start

## Returns

Unsubscribe function to remove the listener

> (): `void`

### Returns

`void`

## Examples

```ts
// Outside of components
import { onAppStart } from 'react-console';

onAppStart(() => {
  console.log('Application started!');
  // Load saved preferences, initialize services, etc.
});
```

```tsx
// Can also be used in components
function App() {
  useEffect(() => {
    const unsubscribe = onAppStart(() => {
      console.log('Application started!');
    });
    return unsubscribe;
  }, []);
  
  return <View>My App</View>;
}
```
