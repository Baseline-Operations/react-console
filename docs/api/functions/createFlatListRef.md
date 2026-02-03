[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / createFlatListRef

# Function: createFlatListRef()

> **createFlatListRef**\<`T`\>(`node`, `data`): [`FlatListRef`](../interfaces/FlatListRef.md)\<`T`\>

Defined in: [src/utils/refs.ts:217](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/refs.ts#L217)

Create a FlatList ref object

## Type Parameters

### T

`T`

## Parameters

### node

`object`

The underlying node/element with scroll capabilities. Expected shape:

- `scrollTo?(options): void` - Scroll to a specific position
- `scrollTop?: number` - Current scroll position
- `setScrollTop?(value): void` - Set scroll position
- `contentHeight?: number` - Total content height
- `height?: number` - Visible height

### data

`T`[]

The list data array.

## Returns

[`FlatListRef`](../interfaces/FlatListRef.md)\<`T`\>

A ref object with FlatList-specific methods like `scrollToIndex`, `scrollToItem`, etc.
