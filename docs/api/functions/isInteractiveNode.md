[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / isInteractiveNode

# Function: isInteractiveNode()

> **isInteractiveNode**(`node`): node is ConsoleNode & \{ type: "radio" \| "checkbox" \| "dropdown" \| "list" \| "input" \| "button"; focused?: boolean; disabled?: boolean; tabIndex?: number \}

Defined in: [src/types/guards.ts:78](https://github.com/Baseline-Operations/react-console/blob/main/src/types/guards.ts#L78)

Type guard: Check if node is interactive (supports focus and input)

## Parameters

### node

[`ConsoleNode`](../interfaces/ConsoleNode.md)

## Returns

node is ConsoleNode & \{ type: "radio" \| "checkbox" \| "dropdown" \| "list" \| "input" \| "button"; focused?: boolean; disabled?: boolean; tabIndex?: number \}
