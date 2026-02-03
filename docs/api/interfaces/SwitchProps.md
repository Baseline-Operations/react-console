[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / SwitchProps

# Interface: SwitchProps

Defined in: src/components/interactive/Switch.tsx:33

Props for the Switch component (React Native compatible)

## Example

```tsx
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: '#767577', true: '#81b0ff' }}
  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
/>
```

## Extends

- [`StyleProps`](StyleProps.md)

## Properties

### value?

> `optional` **value**: `boolean`

Defined in: src/components/interactive/Switch.tsx:35

Whether the switch is on (controlled)

---

### defaultValue?

> `optional` **defaultValue**: `boolean`

Defined in: src/components/interactive/Switch.tsx:37

Default value (uncontrolled)

---

### onValueChange()?

> `optional` **onValueChange**: (`value`) => `void`

Defined in: src/components/interactive/Switch.tsx:39

Callback when the value changes

#### Parameters

##### value

`boolean`

#### Returns

`void`

---

### disabled?

> `optional` **disabled**: `boolean`

Defined in: src/components/interactive/Switch.tsx:41

Whether the switch is disabled

---

### ios_backgroundColor?

> `optional` **ios_backgroundColor**: `string`

Defined in: src/components/interactive/Switch.tsx:43

iOS-specific: color of the background when switch is off

---

### trackColor?

> `optional` **trackColor**: `string` \| \{ `false?`: `string`; `true?`: `string`; \}

Defined in: src/components/interactive/Switch.tsx:45

Color of the track (React Native compatible)

---

### thumbColor?

> `optional` **thumbColor**: `string`

Defined in: src/components/interactive/Switch.tsx:47

Color of the thumb (React Native compatible)

---

### tabIndex?

> `optional` **tabIndex**: `number`

Defined in: src/components/interactive/Switch.tsx:49

Tab order for keyboard navigation

---

### autoFocus?

> `optional` **autoFocus**: `boolean`

Defined in: src/components/interactive/Switch.tsx:51

Auto focus on mount

---

### onFocus()?

> `optional` **onFocus**: () => `void`

Defined in: src/components/interactive/Switch.tsx:53

Called when focus is received

#### Returns

`void`

---

### onBlur()?

> `optional` **onBlur**: () => `void`

Defined in: src/components/interactive/Switch.tsx:55

Called when focus is lost

#### Returns

`void`

---

### style?

> `optional` **style**: `ViewStyle` \| `ViewStyle`[]

Defined in: src/components/interactive/Switch.tsx:57

CSS-like style

---

### className?

> `optional` **className**: `string` \| `string`[]

Defined in: src/components/interactive/Switch.tsx:59

Class names for style libraries

#### Overrides

[`StyleProps`](StyleProps.md).[`className`](StyleProps.md#classname)

---

### onChar?

> `optional` **onChar**: `string`

Defined in: src/components/interactive/Switch.tsx:63

Character for on state (default: '●')

---

### offChar?

> `optional` **offChar**: `string`

Defined in: src/components/interactive/Switch.tsx:65

Character for off state (default: '○')

---

### trackOnChar?

> `optional` **trackOnChar**: `string`

Defined in: src/components/interactive/Switch.tsx:67

Track character when on (default: '━')

---

### trackOffChar?

> `optional` **trackOffChar**: `string`

Defined in: src/components/interactive/Switch.tsx:69

Track character when off (default: '─')

---

### onLabel?

> `optional` **onLabel**: `string`

Defined in: src/components/interactive/Switch.tsx:71

Label to show when on

---

### offLabel?

> `optional` **offLabel**: `string`

Defined in: src/components/interactive/Switch.tsx:73

Label to show when off

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
