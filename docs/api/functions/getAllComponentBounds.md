[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / getAllComponentBounds

# Function: getAllComponentBounds()

> **getAllComponentBounds**(): `object`[]

Defined in: [src/utils/layoutDebug.ts:72](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/layoutDebug.ts#L72)

Get all component bounds from registry

Returns an array of bounding box objects for all registered components, useful for debugging layout issues.

## Returns

`object`[]

Array of objects containing component bounds with properties:

- `id: string` - Component identifier
- `x: number` - X position
- `y: number` - Y position
- `width: number` - Component width
- `height: number` - Component height
