[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / SectionListProps

# Interface: SectionListProps\<ItemT, SectionT\>

Defined in: src/components/data/SectionList.tsx:56

SectionList Props - React Native compatible

## Extends

- [`StyleProps`](StyleProps.md)

## Type Parameters

### ItemT

`ItemT`

### SectionT

`SectionT` = [`DefaultSectionT`](DefaultSectionT.md)

## Properties

### sections

> **sections**: readonly [`Section`](Section.md)\<`ItemT`, `SectionT`\>[]

Defined in: src/components/data/SectionList.tsx:61

Array of sections, each with a data array

#### Required

---

### renderItem()

> **renderItem**: (`info`) => `ReactNode`

Defined in: src/components/data/SectionList.tsx:67

Render function for each item

#### Parameters

##### info

[`SectionListRenderItemInfo`](SectionListRenderItemInfo.md)\<`ItemT`, `SectionT`\>

#### Returns

`ReactNode`

#### Required

---

### keyExtractor()?

> `optional` **keyExtractor**: (`item`, `index`) => `string`

Defined in: src/components/data/SectionList.tsx:72

Extract a unique key for each item

#### Parameters

##### item

`ItemT`

##### index

`number`

#### Returns

`string`

---

### renderSectionHeader()?

> `optional` **renderSectionHeader**: (`info`) => `ReactNode`

Defined in: src/components/data/SectionList.tsx:78

Render function for section headers

#### Parameters

##### info

[`SectionListRenderSectionInfo`](SectionListRenderSectionInfo.md)\<`ItemT`, `SectionT`\>

#### Returns

`ReactNode`

---

### renderSectionFooter()?

> `optional` **renderSectionFooter**: (`info`) => `ReactNode`

Defined in: src/components/data/SectionList.tsx:83

Render function for section footers

#### Parameters

##### info

[`SectionListRenderSectionInfo`](SectionListRenderSectionInfo.md)\<`ItemT`, `SectionT`\>

#### Returns

`ReactNode`

---

### ListHeaderComponent?

> `optional` **ListHeaderComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/SectionList.tsx:89

Component to render at the top of the list

---

### ListFooterComponent?

> `optional` **ListFooterComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/SectionList.tsx:94

Component to render at the bottom of the list

---

### ListEmptyComponent?

> `optional` **ListEmptyComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/SectionList.tsx:99

Component to render when list is empty

---

### ItemSeparatorComponent?

> `optional` **ItemSeparatorComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/SectionList.tsx:104

Component to render between items within a section

---

### SectionSeparatorComponent?

> `optional` **SectionSeparatorComponent**: `ReactNode` \| () => `ReactNode`

Defined in: src/components/data/SectionList.tsx:109

Component to render between sections

---

### horizontal?

> `optional` **horizontal**: `boolean`

Defined in: src/components/data/SectionList.tsx:115

Render items horizontally

---

### inverted?

> `optional` **inverted**: `boolean`

Defined in: src/components/data/SectionList.tsx:120

Reverse the order of items

---

### stickySectionHeadersEnabled?

> `optional` **stickySectionHeadersEnabled**: `boolean`

Defined in: src/components/data/SectionList.tsx:125

Keep section headers stuck to the top when scrolling

---

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: src/components/data/SectionList.tsx:131

Maximum visible height (enables scrolling)

---

### showsVerticalScrollIndicator?

> `optional` **showsVerticalScrollIndicator**: `boolean`

Defined in: src/components/data/SectionList.tsx:136

Show vertical scroll indicator

---

### showsHorizontalScrollIndicator?

> `optional` **showsHorizontalScrollIndicator**: `boolean`

Defined in: src/components/data/SectionList.tsx:141

Show horizontal scroll indicator

---

### refreshing?

> `optional` **refreshing**: `boolean`

Defined in: src/components/data/SectionList.tsx:147

Whether currently refreshing

---

### onRefresh()?

> `optional` **onRefresh**: () => `void`

Defined in: src/components/data/SectionList.tsx:152

Called when pull-to-refresh triggered

#### Returns

`void`

---

### onScroll()?

> `optional` **onScroll**: (`event`) => `void`

Defined in: src/components/data/SectionList.tsx:158

Called when scroll position changes

#### Parameters

##### event

###### nativeEvent

\{ `contentOffset`: \{ `x`: `number`; `y`: `number`; \}; \}

###### nativeEvent.contentOffset

\{ `x`: `number`; `y`: `number`; \}

###### nativeEvent.contentOffset.x

`number`

###### nativeEvent.contentOffset.y

`number`

#### Returns

`void`

---

### onEndReached()?

> `optional` **onEndReached**: (`info`) => `void`

Defined in: src/components/data/SectionList.tsx:163

Called when end of list reached

#### Parameters

##### info

###### distanceFromEnd

`number`

#### Returns

`void`

---

### onEndReachedThreshold?

> `optional` **onEndReachedThreshold**: `number`

Defined in: src/components/data/SectionList.tsx:168

How far from end to trigger onEndReached (0-1)

---

### selectable?

> `optional` **selectable**: `boolean`

Defined in: src/components/data/SectionList.tsx:174

Allow keyboard selection of items

---

### selectedSectionIndex?

> `optional` **selectedSectionIndex**: `number`

Defined in: src/components/data/SectionList.tsx:179

Currently selected section index

---

### selectedItemIndex?

> `optional` **selectedItemIndex**: `number`

Defined in: src/components/data/SectionList.tsx:184

Currently selected item index within section

---

### onSelect()?

> `optional` **onSelect**: (`item`, `itemIndex`, `sectionIndex`) => `void`

Defined in: src/components/data/SectionList.tsx:189

Called when item is selected

#### Parameters

##### item

`ItemT`

##### itemIndex

`number`

##### sectionIndex

`number`

#### Returns

`void`

---

### selectedStyle?

> `optional` **selectedStyle**: `ViewStyle`

Defined in: src/components/data/SectionList.tsx:194

Style for selected item

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: src/components/data/SectionList.tsx:197

---

### contentContainerStyle?

> `optional` **contentContainerStyle**: `ViewStyle`

Defined in: src/components/data/SectionList.tsx:198

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: src/components/data/SectionList.tsx:199

#### Overrides

[`StyleProps`](StyleProps.md).[`className`](StyleProps.md#classname)

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
