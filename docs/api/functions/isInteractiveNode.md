[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isInteractiveNode

# Function: isInteractiveNode()

> **isInteractiveNode**(`node`): node is ConsoleNode & \{ type: "radio" \| "checkbox" \| "dropdown" \| "list" \| "input" \| "button"; focused?: boolean; disabled?: boolean; tabIndex?: number \}

Defined in: [src/types/guards.ts:78](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L78)

Type guard: Check if node is interactive (supports focus and input)

Interactive nodes are those that can receive focus and handle user input, including radio buttons, checkboxes, dropdowns, lists, text inputs, and buttons.

## Parameters

### node

[`ConsoleNode`](../interfaces/ConsoleNode.md)

The node to check for interactivity.

## Returns

node is ConsoleNode & \{ type: "radio" \| "checkbox" \| "dropdown" \| "list" \| "input" \| "button"; focused?: boolean; disabled?: boolean; tabIndex?: number \}

`true` if the node is interactive, enabling type-safe access to `focused`, `disabled`, and `tabIndex` properties.

## Example

```typescript
if (isInteractiveNode(node)) {
  // TypeScript now knows node has focused, disabled, and tabIndex properties
  if (!node.disabled && node.tabIndex !== undefined) {
    // Safe to interact with the node
  }
}
```
