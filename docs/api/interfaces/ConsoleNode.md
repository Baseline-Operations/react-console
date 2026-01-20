[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / ConsoleNode

# Interface: ConsoleNode

Defined in: src/types/index.ts:169

## Properties

### type

> **type**: `"text"` \| `"box"` \| `"fragment"` \| `"newline"` \| `"linebreak"` \| `"input"` \| `"button"` \| `"scrollable"` \| `"overlay"` \| `"radio"` \| `"checkbox"` \| `"dropdown"` \| `"list"`

Defined in: src/types/index.ts:170

***

### content?

> `optional` **content**: `string`

Defined in: src/types/index.ts:171

***

### styles?

> `optional` **styles**: [`StyleProps`](StyleProps.md)

Defined in: src/types/index.ts:172

***

### style?

> `optional` **style**: `ViewStyle` \| `TextStyle`

Defined in: src/types/index.ts:173

***

### layout?

> `optional` **layout**: [`LayoutProps`](LayoutProps.md)

Defined in: src/types/index.ts:174

***

### children?

> `optional` **children**: `ConsoleNode`[]

Defined in: src/types/index.ts:175

***

### x?

> `optional` **x**: `number`

Defined in: src/types/index.ts:176

***

### y?

> `optional` **y**: `number`

Defined in: src/types/index.ts:177

***

### width?

> `optional` **width**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: src/types/index.ts:178

***

### height?

> `optional` **height**: [`ResponsiveSize`](../type-aliases/ResponsiveSize.md)

Defined in: src/types/index.ts:179

***

### value?

> `optional` **value**: `string` \| `number` \| `boolean` \| `string`[] \| `number`[]

Defined in: src/types/index.ts:181

***

### defaultValue?

> `optional` **defaultValue**: `string` \| `number` \| `boolean` \| `string`[] \| `number`[]

Defined in: src/types/index.ts:182

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: src/types/index.ts:183

***

### focused?

> `optional` **focused**: `boolean`

Defined in: src/types/index.ts:184

***

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/types/index.ts:185

***

### mask?

> `optional` **mask**: `string`

Defined in: src/types/index.ts:186

***

### maxLength?

> `optional` **maxLength**: `number`

Defined in: src/types/index.ts:187

***

### maxWidth?

> `optional` **maxWidth**: `number`

Defined in: src/types/index.ts:188

***

### multiline?

> `optional` **multiline**: `boolean`

Defined in: src/types/index.ts:189

***

### maxLines?

> `optional` **maxLines**: `number`

Defined in: src/types/index.ts:190

***

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/types/index.ts:191

***

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/types/index.ts:192

***

### inputType?

> `optional` **inputType**: [`InputType`](../type-aliases/InputType.md)

Defined in: src/types/index.ts:194

***

### step?

> `optional` **step**: `number`

Defined in: src/types/index.ts:196

***

### min?

> `optional` **min**: `number`

Defined in: src/types/index.ts:197

***

### max?

> `optional` **max**: `number`

Defined in: src/types/index.ts:198

***

### allowDecimals?

> `optional` **allowDecimals**: `boolean`

Defined in: src/types/index.ts:199

***

### decimalPlaces?

> `optional` **decimalPlaces**: `number`

Defined in: src/types/index.ts:200

***

### formatDisplay()?

> `optional` **formatDisplay**: (`value`) => `string`

Defined in: src/types/index.ts:202

#### Parameters

##### value

`string` | `number` | `boolean`

#### Returns

`string`

***

### formatValue()?

> `optional` **formatValue**: (`value`) => `string` \| `number`

Defined in: src/types/index.ts:203

#### Parameters

##### value

`string` | `number` | `boolean`

#### Returns

`string` \| `number`

***

### pattern?

> `optional` **pattern**: `string` \| `RegExp`

Defined in: src/types/index.ts:205

***

### validationError?

> `optional` **validationError**: `string`

Defined in: src/types/index.ts:206

***

### invalid?

> `optional` **invalid**: `boolean`

Defined in: src/types/index.ts:207

***

### options?

> `optional` **options**: `object`[]

Defined in: src/types/index.ts:209

#### label

> **label**: `string`

#### value

> **value**: `string` \| `number`

***

### selected?

> `optional` **selected**: `string` \| `number` \| `string`[]

Defined in: src/types/index.ts:210

***

### multiple?

> `optional` **multiple**: `boolean`

Defined in: src/types/index.ts:211

***

### name?

> `optional` **name**: `string`

Defined in: src/types/index.ts:212

***

### displayFormat?

> `optional` **displayFormat**: `string`

Defined in: src/types/index.ts:214

***

### onClick()?

> `optional` **onClick**: (`event`) => `void`

Defined in: src/types/index.ts:216

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

***

### onPress()?

> `optional` **onPress**: (`event`) => `void`

Defined in: src/types/index.ts:217

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

***

### onMouseDown()?

> `optional` **onMouseDown**: (`event`) => `void`

Defined in: src/types/index.ts:218

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

***

### onMouseUp()?

> `optional` **onMouseUp**: (`event`) => `void`

Defined in: src/types/index.ts:219

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

***

### onMouseMove()?

> `optional` **onMouseMove**: (`event`) => `void`

Defined in: src/types/index.ts:220

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

***

### onMouseDrag()?

> `optional` **onMouseDrag**: (`event`) => `void`

Defined in: src/types/index.ts:221

#### Parameters

##### event

[`MouseEvent`](MouseEvent.md)

#### Returns

`void`

***

### onKeyDown()?

> `optional` **onKeyDown**: (`event`) => `void`

Defined in: src/types/index.ts:222

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

***

### onKeyUp()?

> `optional` **onKeyUp**: (`event`) => `void`

Defined in: src/types/index.ts:223

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

***

### onKeyPress()?

> `optional` **onKeyPress**: (`event`) => `void`

Defined in: src/types/index.ts:224

#### Parameters

##### event

[`KeyboardEvent`](KeyboardEvent.md)

#### Returns

`void`

***

### onChange()?

> `optional` **onChange**: (`event`) => `void`

Defined in: src/types/index.ts:225

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

***

### onSubmit()?

> `optional` **onSubmit**: (`event`) => `void`

Defined in: src/types/index.ts:226

#### Parameters

##### event

[`InputEvent`](InputEvent.md)

#### Returns

`void`

***

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: src/types/index.ts:227

#### Returns

`void`

***

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: src/types/index.ts:228

#### Returns

`void`

***

### scrollTop?

> `optional` **scrollTop**: `number`

Defined in: src/types/index.ts:230

***

### scrollLeft?

> `optional` **scrollLeft**: `number`

Defined in: src/types/index.ts:231

***

### maxHeight?

> `optional` **maxHeight**: `number`

Defined in: src/types/index.ts:232

***

### scrollable?

> `optional` **scrollable**: `boolean`

Defined in: src/types/index.ts:235

***

### scrollbarVisibility?

> `optional` **scrollbarVisibility**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: src/types/index.ts:236

***

### horizontalScrollbar?

> `optional` **horizontalScrollbar**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: src/types/index.ts:237

***

### verticalScrollbar?

> `optional` **verticalScrollbar**: `"auto"` \| `"hidden"` \| `"always"`

Defined in: src/types/index.ts:238

***

### scrollbarChar?

> `optional` **scrollbarChar**: `string`

Defined in: src/types/index.ts:239

***

### scrollbarTrackChar?

> `optional` **scrollbarTrackChar**: `string`

Defined in: src/types/index.ts:240

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: src/types/index.ts:242

***

### backdrop?

> `optional` **backdrop**: `boolean`

Defined in: src/types/index.ts:243

***

### backdropColor?

> `optional` **backdropColor**: `string`

Defined in: src/types/index.ts:244

***

### fullscreen?

> `optional` **fullscreen**: `boolean`

Defined in: src/types/index.ts:246

***

### focusedIndex?

> `optional` **focusedIndex**: `number`

Defined in: src/types/index.ts:249

***

### isOpen?

> `optional` **isOpen**: `boolean`

Defined in: src/types/index.ts:250
