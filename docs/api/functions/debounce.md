[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / debounce

# Function: debounce()

> **debounce**\<`T`\>(`fn`, `delay`): (...`args`) => `void`

Defined in: src/utils/debounce.ts:27

Debounce a function call
Delays execution until after the specified delay has passed since the last invocation

## Type Parameters

### T

`T` *extends* (...`args`) => `unknown`

## Parameters

### fn

`T`

Function to debounce

### delay

`number` = `100`

Delay in milliseconds (default: 100)

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
const debouncedResize = debounce(() => {
  console.log('Resized');
}, 100);

// Call multiple times rapidly
debouncedResize();
debouncedResize();
debouncedResize();
// Only executes once after 100ms of no calls
```
