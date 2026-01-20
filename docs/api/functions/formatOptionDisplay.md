[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / formatOptionDisplay

# Function: formatOptionDisplay()

> **formatOptionDisplay**(`option`, `selected`, `format?`, `index?`): `string`

Defined in: src/components/selection/shared.ts:15

Format display value for selection components
This is a shared utility that can be used by Radio, Checkbox, Dropdown, and List
Also used by the renderer for rendering selection components

## Parameters

### option

#### label

`string`

#### value

`string` \| `number`

### selected

`boolean`

### format?

`string` | (`option`, `selected`, `index?`) => `string`

### index?

`number`

## Returns

`string`
