[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / createStyleLibrary

# Function: createStyleLibrary()

> **createStyleLibrary**(`baseClasses?`): `object`

Defined in: [src/utils/className.ts:186](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/className.ts#L186)

Create a style library helper for library authors

## Parameters

### baseClasses?

`ClassNameMapping`

## Returns

### register()

> **register**: (`mappings`) => `void` = `registerClassNames`

Register class name mappings

#### Parameters

##### mappings

`ClassNameMapping`

#### Returns

`void`

#### Example

```tsx
registerClassNames({
  'text-red': { color: 'red' },
  'bg-blue': { backgroundColor: 'blue' },
  'p-2': { padding: 2 },
});
```

### registerClass()

> **registerClass**: (`className`, `style`) => `void`

Register a single class name

#### Parameters

##### className

`string`

##### style

`ViewStyle` | `TextStyle`

#### Returns

`void`

### resolve()

> **resolve**: (`classNames`) => `ViewStyle` \| `TextStyle` \| `undefined` = `resolveClassName`

Resolve class names to style object

#### Parameters

##### classNames

`string` | `string`[] | `undefined`

#### Returns

`ViewStyle` \| `TextStyle` \| `undefined`

#### Example

```tsx
const style = resolveClassName('text-red bg-blue p-2');
// Returns: { color: 'red', backgroundColor: 'blue', padding: 2 }
```

### clear()

> **clear**: () => `void`

Clear all registered class names

#### Returns

`void`

### getAll()

> **getAll**: () => `string`[]

Get all registered class names

#### Returns

`string`[]
