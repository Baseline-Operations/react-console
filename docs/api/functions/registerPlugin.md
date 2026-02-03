[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / registerPlugin

# Function: registerPlugin()

> **registerPlugin**(`config`): `void`

Defined in: [src/utils/extensibility.ts:267](https://github.com/Baseline-Operations/react-console/blob/main/src/utils/extensibility.ts#L267)

Register a plugin
Convenience function for the plugin API.

## Parameters

### config

[`PluginConfig`](../interfaces/PluginConfig.md)

Plugin configuration object.

## Returns

`void`

## Example

```typescript
import { registerPlugin } from 'react-console';

registerPlugin({
  name: 'my-plugin',
  version: '1.0.0',
  components: {
    MyCustomComponent: MyCustomComponent,
  },
  hooks: {
    useMyHook: useMyHook,
  },
});
```
