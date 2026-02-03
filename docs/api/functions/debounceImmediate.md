[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / debounceImmediate

# Function: debounceImmediate()

> **debounceImmediate**\<`T`\>(`fn`, `delay`, `immediate`): (...`args`) => `void`

Defined in: [src/utils/debounce.ts:65](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/debounce.ts#L65)

Debounce with immediate execution option
Can execute immediately on first call, then debounce subsequent calls

## Type Parameters

### T

`T` _extends_ (...`args`) => `unknown`

## Parameters

### fn

`T`

Function to debounce

### delay

`number` = `100`

Delay in milliseconds (default: 100)

### immediate

`boolean` = `false`

Execute immediately on first call (default: false)

## Returns

Debounced function

> (...`args`): `void`

### Parameters

#### args

...`Parameters`\<`T`\>

### Returns

`void`

## Example

```ts
const debounced = debounceImmediate(
  () => {
    console.log('Called');
  },
  100,
  true
);

debounced(); // Executes immediately
debounced(); // Debounced
debounced(); // Debounced
```
