[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / useBell

# Function: useBell()

> **useBell**(): `object`

Defined in: [src/apis/Bell.ts:185](https://github.com/Baseline-Operations/react-console/blob/main/src/apis/Bell.ts#L185)

Hook: useBell
React hook for bell functionality

## Returns

`object`

Bell control functions

### ring()

> **ring**: (`options?`) => `void`

#### Parameters

##### options?

`BellOptions`

#### Returns

`void`

### beep()

> **beep**: (`pattern`) => `void`

#### Parameters

##### pattern

`number` | `BellPattern`

#### Returns

`void`

### alert()

> **alert**: () => `void`

#### Returns

`void`

### success()

> **success**: () => `void`

#### Returns

`void`

### error()

> **error**: () => `void`

#### Returns

`void`

### cancel()

> **cancel**: () => `void`

#### Returns

`void`

### setEnabled()

> **setEnabled**: (`enabled`) => `void`

Enable or disable bell sounds globally.

**Note:** This controls a global singleton Bell instance. All `useBell()` hooks share the same enabled state across the application.

#### Parameters

##### enabled

`boolean`

#### Returns

`void`

### isEnabled()

> **isEnabled**: () => `boolean`

Check if bell sounds are enabled globally.

**Note:** This returns the global Bell enabled state shared by all `useBell()` hooks.

#### Returns

`boolean`

## Example

```tsx
function MyComponent() {
  const bell = useBell();

  const handleSuccess = () => {
    bell.success();
  };

  return <Button onPress={handleSuccess}>Complete</Button>;
}
```
