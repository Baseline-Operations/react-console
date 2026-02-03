[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / createScrollViewRef

# Function: createScrollViewRef()

> **createScrollViewRef**(`node`): [`ScrollViewRef`](../interfaces/ScrollViewRef.md)

Defined in: [src/utils/refs.ts:182](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/refs.ts#L182)

Create a ScrollView ref object

## Parameters

### node

The underlying ScrollView node/element that provides scroll functionality.

## Returns

[`ScrollViewRef`](../interfaces/ScrollViewRef.md)

Returns a ScrollViewRef object with the following methods and properties:

- `scrollTo(options)` - Scroll to a specific position
- `scrollTop` - Current scroll position (read-only)
- `setScrollTop(value)` - Set scroll position programmatically
- `contentHeight` - Total content height
- `height` - Visible viewport height
