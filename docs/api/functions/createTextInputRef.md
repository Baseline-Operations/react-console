[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / createTextInputRef

# Function: createTextInputRef()

> **createTextInputRef**(`node`): [`TextInputRef`](../interfaces/TextInputRef.md)

Defined in: [src/utils/refs.ts:155](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/refs.ts#L155)

Create a TextInput ref object

## Parameters

### node

`Partial<TextInputNode>`

The underlying node/element to wrap as a TextInput ref. This object may optionally provide the following methods and properties:

- `focus?(): void` - Method to focus the input
- `blur?(): void` - Method to blur the input
- `setValue?(value: string): void` - Method to set the input value
- `getValue?(): string` - Method to get the current value
- `focused?: boolean` - Whether the input is currently focused

## Returns

[`TextInputRef`](../interfaces/TextInputRef.md)

A ref object with standardized TextInput methods.
