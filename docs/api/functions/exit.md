[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / exit

# Function: exit()

> **exit**(`exitCode`): `void`

Defined in: src/renderer/render.ts:486

Exit the application after rendering

Unmounts the rendered tree, cleans up all resources, persists storage to disk,
and exits the Node.js process with the specified exit code.

This is the recommended way to exit a terminal application after initial render.
Ensures proper cleanup of resources (input listeners, resize handlers, etc.)
and persistence of storage data before exiting.

## Parameters

### exitCode

`number` = `0`

Exit code for the process (default: 0 for success, non-zero for error)

## Returns

`void`

## Examples

```tsx
// Static CLI application - render and exit
import { render, exit } from 'react-console';

function App() {
  return <Text>Hello, World!</Text>;
}

render(<App />, { mode: 'static' });
exit(); // Clean exit after render

// Exit with error code
render(<App />, { mode: 'static' });
exit(1); // Exit with error code 1
```

```tsx
// Exit from event handler
import { render, exit } from 'react-console';
import { Button } from 'react-console';

function App() {
  return (
    <Button onClick={() => exit()}>
      Exit Application
    </Button>
  );
}

render(<App />, { mode: 'interactive' });
```
