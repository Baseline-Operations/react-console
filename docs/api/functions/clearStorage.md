[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / clearStorage

# Function: clearStorage()

> **clearStorage**(): `void`

Defined in: src/hooks/storage.ts:265

Clear all storage

Clears all storage for the current application and triggers re-renders
in all components using storage hooks.

## Returns

`void`

## Example

```tsx
function SettingsComponent() {
  return (
    <View>
      <Button onClick={() => clearStorage()}>
        Clear All Data
      </Button>
    </View>
  );
}
```
