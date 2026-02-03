[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / throttle

# Function: throttle()

> **throttle**\<`T`\>(`fn`, `delay`): (...`args`) => `void`

Defined in: [src/utils/debounce.ts:116](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/debounce.ts#L116)

Throttle a function call
Limits execution to at most once per specified delay period

## Type Parameters

### T

`T` _extends_ (...`args`) => `unknown`

## Parameters

### fn

`T`

Function to throttle

### delay

`number` = `100`

Delay in milliseconds (default: 100)

## Returns

Throttled function

> (...`args`): `void`

### Parameters

#### args

...`Parameters`\<`T`\>

### Returns

`void`

## Example

```ts
const throttled = throttle(() => {
  console.log('Called');
}, 100);

// Rapid calls
throttled(); // Executes
throttled(); // Ignored
throttled(); // Ignored
// After 100ms, next call executes
```
