[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / GlobalTerminal

# Interface: GlobalTerminal

Defined in: [src/utils/globalTerminal.ts:28](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L28)

Global terminal object interface

Similar to `window` in browsers, provides global access to terminal state and utilities.
Available without imports via `terminal` or `globalThis.terminal`.

## Example

```ts
// Access terminal dimensions globally
const { columns, rows } = terminal.dimensions;

// Access currently focused component
const focused = terminal.focusedComponent;

// Update focused component
terminal.setFocusedComponent(myComponent);
```

## Properties

### dimensions

> **dimensions**: [`TerminalDimensions`](TerminalDimensions.md)

Defined in: [src/utils/globalTerminal.ts:33](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L33)

Current terminal dimensions (columns, rows)
Automatically updated on resize

---

### focusedComponent

> **focusedComponent**: [`ConsoleNode`](ConsoleNode.md) \| `null`

Defined in: [src/utils/globalTerminal.ts:38](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L38)

Currently focused component (if any)

---

### focusedNodeId

> **focusedNodeId**: `string` \| `null`

Defined in: [src/utils/globalTerminal.ts:43](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L43)

ID of the currently focused node (survives across re-renders)

## Methods

### getDimensions()

> **getDimensions**(): [`TerminalDimensions`](TerminalDimensions.md)

Defined in: [src/utils/globalTerminal.ts:49](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L49)

Get current terminal dimensions

#### Returns

[`TerminalDimensions`](TerminalDimensions.md)

Terminal dimensions (columns, rows)

---

### setFocusedComponent()

> **setFocusedComponent**(`component`): `void`

Defined in: [src/utils/globalTerminal.ts:55](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L55)

Set the currently focused component

#### Parameters

##### component

Component to focus (or null to unfocus)

[`ConsoleNode`](ConsoleNode.md) | `null`

#### Returns

`void`

---

### getFocusedComponent()

> **getFocusedComponent**(): [`ConsoleNode`](ConsoleNode.md) \| `null`

Defined in: [src/utils/globalTerminal.ts:61](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/globalTerminal.ts#L61)

Get the currently focused component

#### Returns

[`ConsoleNode`](ConsoleNode.md) \| `null`

Currently focused component or null
