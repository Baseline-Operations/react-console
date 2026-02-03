[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / decodeHtmlEntities

# Function: decodeHtmlEntities()

> **decodeHtmlEntities**(`text`): `string`

Defined in: [src/utils/measure.ts:381](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/measure.ts#L381)

Decode HTML entities in text

Converts HTML entities (named and numeric) to their corresponding characters.
Supports common named entities and numeric entities (decimal and hex).

## Parameters

### text

`string`

Text containing HTML entities

## Returns

`string`

Text with entities decoded to characters

## Example

```ts
decodeHtmlEntities('Hello &amp; World'); // "Hello & World"
decodeHtmlEntities('It&apos;s great!'); // "It's great!"
decodeHtmlEntities('&quot;quoted&quot;'); // '"quoted"'
decodeHtmlEntities('&#65;BC'); // "ABC"
decodeHtmlEntities('&#x41;BC'); // "ABC"
```
