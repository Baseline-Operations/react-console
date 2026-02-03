[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / StyleSheet

# Variable: StyleSheet

> `const` **StyleSheet**: `object`

Defined in: [src/utils/StyleSheet.ts:26](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/StyleSheet.ts#L26)

StyleSheet API - React Native-like stylesheets for terminal components

Similar to React Native's StyleSheet API but adapted for terminal constraints.
Provides consistent styling API and style composition utilities.

## Type Declaration

### create()

> **create**\<`T`\>(`styles`): `T`

Create a stylesheet from style definitions
Similar to React Native's StyleSheet.create()

#### Type Parameters

##### T

`T` _extends_ `Record`\<`string`, `TerminalStyle`\>

#### Parameters

##### styles

`T`

Object mapping style names to style objects

#### Returns

`T`

The same styles object (for API consistency)

#### Example

```tsx
const styles = StyleSheet.create({
  box: { padding: 2, backgroundColor: 'blue' },
  text: { color: 'white', bold: true },
});
```

### flatten()

> **flatten**\<`T`\>(`styles`): `T` \| `null`

Flatten an array of styles (similar to React Native)
Merges multiple styles into one, with later styles overriding earlier ones

#### Type Parameters

##### T

`T` _extends_ `TerminalStyle`

#### Parameters

##### styles

(`false` \| `T` \| `null` \| `undefined`)[]

Array of styles to flatten (can include false, null, undefined)

#### Returns

`T` \| `null`

Merged style object or null if no valid styles

#### Example

```tsx
const merged = StyleSheet.flatten([baseStyle, condition && conditionalStyle, overrideStyle]);
```

### compose()

> **compose**\<`T`\>(...`styles`): `T` \| `null`

Compose styles (similar to React Native)
Alias for flatten - merges multiple styles into one

#### Type Parameters

##### T

`T` _extends_ `TerminalStyle`

#### Parameters

##### styles

...(`false` \| `T` \| `null` \| `undefined`)[]

Variadic arguments of styles to compose

#### Returns

`T` \| `null`

Merged style object or null if no valid styles

#### Example

```tsx
const composed = StyleSheet.compose(baseStyle, variantStyle, overrideStyle);
```

### absoluteFillObject

> **absoluteFillObject**: `ViewStyle`

Absolute fill style object (React Native compatible)
Positions element to fill its parent absolutely

#### Example

```tsx
<View style={StyleSheet.absoluteFillObject}>
  <Text>Fills parent</Text>
</View>
```

### absoluteFill

#### Get Signature

> **get** **absoluteFill**(): `ViewStyle`

Absolute fill style (React Native compatible)
Same as absoluteFillObject - positions element to fill parent

##### Returns

`ViewStyle`

### hairlineWidth

> **hairlineWidth**: `number` = `1`

Hairline width - thinnest possible line (React Native compatible)
In terminal context, this is 1 character width

### setHairlineWidth()

> **setHairlineWidth**(`width`): `void`

Set hairline width (for high-DPI terminal simulation)
Typically not needed for terminal but provided for API compatibility

#### Parameters

##### width

`number`

#### Returns

`void`

## Example

```tsx
const styles = StyleSheet.create({
  container: { padding: 2, border: 'single' },
  text: { color: 'cyan', bold: true },
});

<Box style={styles.container}>
  <Text style={styles.text}>Styled Text</Text>
</Box>;
```
