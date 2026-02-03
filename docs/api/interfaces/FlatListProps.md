[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / FlatListProps

# Interface: FlatListProps\<T\>

Defined in: src/components/data/FlatList.tsx:62

Props for the FlatList component (React Native compatible)

## Extends

- [`StyleProps`](StyleProps.md)

## Type Parameters

### T

`T`

## Properties

### data

> **data**: `T`[] \| `null` \| `undefined`

Defined in: src/components/data/FlatList.tsx:64

Array of data to render

---

### renderItem()

> **renderItem**: (`info`) => `ReactNode`

Defined in: src/components/data/FlatList.tsx:66

Render function for each item

#### Parameters

##### info

[`ListRenderItemInfo`](ListRenderItemInfo.md)\<`T`\>

#### Returns

`ReactNode`

---

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string`

Defined in: src/components/data/FlatList.tsx:68

Extract key from item (defaults to item.key or index)

#### Parameters

##### item

`T`

##### index

`number`

#### Returns

`string`

---

### ListHeaderComponent?

> `optional` **ListHeaderComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/FlatList.tsx:72

Component to render at the top of the list

---

### ListFooterComponent?

> `optional` **ListFooterComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/FlatList.tsx:74

Component to render at the bottom of the list

---

### ListEmptyComponent?

> `optional` **ListEmptyComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/FlatList.tsx:76

Component to render when the list is empty

---

### ItemSeparatorComponent?

> `optional` **ItemSeparatorComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/FlatList.tsx:78

Component to render between items

---

### horizontal?

> `optional` **horizontal**: `boolean`

Defined in: src/components/data/FlatList.tsx:82

Render list horizontally (default: false)

---

### inverted?

> `optional` **inverted**: `boolean`

Defined in: src/components/data/FlatList.tsx:84

Invert scroll direction (for chat-like interfaces)

---

### initialNumToRender?

> `optional` **initialNumToRender**: `number`

Defined in: src/components/data/FlatList.tsx:86

Number of items to render initially

---

### maxToRenderPerBatch?

> `optional` **maxToRenderPerBatch**: `number`

Defined in: src/components/data/FlatList.tsx:88

Maximum number of items to render

---

### windowSize?

> `optional` **windowSize**: `number`

Defined in: src/components/data/FlatList.tsx:90

Window size multiplier for rendered items

---

### maintainVisibleContentPosition?

> `optional` **maintainVisibleContentPosition**: `object`

Defined in: src/components/data/FlatList.tsx:92

Scroll to end when content size changes

#### minIndexForVisible

> **minIndexForVisible**: `number`

#### autoscrollToTopThreshold?

> `optional` **autoscrollToTopThreshold**: `number`

---

### onEndReached()?

> `optional` **onEndReached**: (`info`) => `void`

Defined in: src/components/data/FlatList.tsx:99

Called when end of list is reached

#### Parameters

##### info

###### distanceFromEnd

`number`

#### Returns

`void`

---

### onEndReachedThreshold?

> `optional` **onEndReachedThreshold**: `number`

Defined in: src/components/data/FlatList.tsx:101

How far from end before calling onEndReached (0-1)

---

### onRefresh()?

> `optional` **onRefresh**: () => `void`

Defined in: src/components/data/FlatList.tsx:103

Called when list is refreshed (pull to refresh)

#### Returns

`void`

---

### refreshing?

> `optional` **refreshing**: `boolean`

Defined in: src/components/data/FlatList.tsx:105

Whether the list is currently refreshing

---

### onScroll()?

> `optional` **onScroll**: (`event`) => `void`

Defined in: src/components/data/FlatList.tsx:107

Called on scroll

#### Parameters

##### event

[`ScrollEvent`](ScrollEvent.md)

#### Returns

`void`

---

### onScrollBeginDrag()?

> `optional` **onScrollBeginDrag**: (`event`) => `void`

Defined in: src/components/data/FlatList.tsx:109

Called when scroll begins

#### Parameters

##### event

[`ScrollEvent`](ScrollEvent.md)

#### Returns

`void`

---

### onScrollEndDrag()?

> `optional` **onScrollEndDrag**: (`event`) => `void`

Defined in: src/components/data/FlatList.tsx:111

Called when scroll ends

#### Parameters

##### event

[`ScrollEvent`](ScrollEvent.md)

#### Returns

`void`

---

### onViewableItemsChanged()?

> `optional` **onViewableItemsChanged**: (`info`) => `void`

Defined in: src/components/data/FlatList.tsx:113

Called when viewable items change

#### Parameters

##### info

###### viewableItems

[`ViewToken`](ViewToken.md)\<`T`\>[]

###### changed

[`ViewToken`](ViewToken.md)\<`T`\>[]

#### Returns

`void`

---

### viewabilityConfig?

> `optional` **viewabilityConfig**: [`ViewabilityConfig`](ViewabilityConfig.md)

Defined in: src/components/data/FlatList.tsx:115

Viewability config

---

### getItemLayout()?

> `optional` **getItemLayout**: (`data`, `index`) => `object`

Defined in: src/components/data/FlatList.tsx:119

Fixed height of items (improves performance)

#### Parameters

##### data

`T`[] | `null` | `undefined`

##### index

`number`

#### Returns

`object`

##### length

> **length**: `number`

##### offset

> **offset**: `number`

##### index

> **index**: `number`

---

### numColumns?

> `optional` **numColumns**: `number`

Defined in: src/components/data/FlatList.tsx:125

Number of columns (for grid layout)

---

### columnWrapperStyle?

> `optional` **columnWrapperStyle**: `ViewStyle`

Defined in: src/components/data/FlatList.tsx:127

Style for each column container (when numColumns > 1)

---

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/data/FlatList.tsx:131

Tab order

---

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/components/data/FlatList.tsx:133

Auto focus on mount

---

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: src/components/data/FlatList.tsx:135

Called when focus received

#### Returns

`void`

---

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: src/components/data/FlatList.tsx:137

Called when focus lost

#### Returns

`void`

---

### contentContainerStyle?

> `optional` **contentContainerStyle**: `ViewStyle`

Defined in: src/components/data/FlatList.tsx:141

Content container style

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: src/components/data/FlatList.tsx:143

CSS-like style

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: src/components/data/FlatList.tsx:145

Class names

#### Overrides

[`StyleProps`](StyleProps.md).[`className`](StyleProps.md#classname)

---

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: src/components/data/FlatList.tsx:149

Maximum visible height (in lines)

---

### showsVerticalScrollIndicator?

> `optional` **showsVerticalScrollIndicator**: `boolean`

Defined in: src/components/data/FlatList.tsx:151

Show scroll indicators

---

### showsHorizontalScrollIndicator?

> `optional` **showsHorizontalScrollIndicator**: `boolean`

Defined in: src/components/data/FlatList.tsx:152

---

### keyboardShouldPersistTaps?

> `optional` **keyboardShouldPersistTaps**: `"always"` \| `"never"` \| `"handled"`

Defined in: src/components/data/FlatList.tsx:154

Keyboard navigation enabled

---

### extraData?

> `optional` **extraData**: `unknown`

Defined in: src/components/data/FlatList.tsx:156

Extra data to trigger re-render

---

### color?

> `optional` **color**: `string`

Defined in: [src/types/styles.ts:9](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L9)

#### Inherited from

[`StyleProps`](StyleProps.md).[`color`](StyleProps.md#color)

---

### backgroundColor?

> `optional` **backgroundColor**: `string`

Defined in: [src/types/styles.ts:10](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L10)

#### Inherited from

[`StyleProps`](StyleProps.md).[`backgroundColor`](StyleProps.md#backgroundcolor)

---

### bold?

> `optional` **bold**: `boolean`

Defined in: [src/types/styles.ts:11](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L11)

#### Inherited from

[`StyleProps`](StyleProps.md).[`bold`](StyleProps.md#bold)

---

### dim?

> `optional` **dim**: `boolean`

Defined in: [src/types/styles.ts:12](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L12)

#### Inherited from

[`StyleProps`](StyleProps.md).[`dim`](StyleProps.md#dim)

---

### italic?

> `optional` **italic**: `boolean`

Defined in: [src/types/styles.ts:13](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L13)

#### Inherited from

[`StyleProps`](StyleProps.md).[`italic`](StyleProps.md#italic)

---

### underline?

> `optional` **underline**: `boolean`

Defined in: [src/types/styles.ts:14](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L14)

#### Inherited from

[`StyleProps`](StyleProps.md).[`underline`](StyleProps.md#underline)

---

### strikethrough?

> `optional` **strikethrough**: `boolean`

Defined in: [src/types/styles.ts:15](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L15)

#### Inherited from

[`StyleProps`](StyleProps.md).[`strikethrough`](StyleProps.md#strikethrough)

---

### inverse?

> `optional` **inverse**: `boolean`

Defined in: [src/types/styles.ts:16](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L16)

#### Inherited from

[`StyleProps`](StyleProps.md).[`inverse`](StyleProps.md#inverse)

---

### fontWeight?

> `optional` **fontWeight**: `number` \| `"bold"` \| `"normal"`

Defined in: [src/types/styles.ts:20](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L20)

#### Inherited from

[`StyleProps`](StyleProps.md).[`fontWeight`](StyleProps.md#fontweight)

---

### fontStyle?

> `optional` **fontStyle**: `"italic"` \| `"normal"`

Defined in: [src/types/styles.ts:21](https://github.com/Baseline-Operations/react-console/blob/main/src/types/styles.ts#L21)

#### Inherited from

[`StyleProps`](StyleProps.md).[`fontStyle`](StyleProps.md#fontstyle)
