[**React Console API v0.1.0**](../README.md)

---

[React Console API](../globals.md) / AlertOptions

# Interface: AlertOptions

Defined in: src/apis/Alert.ts:31

Alert options (React Native compatible)

## Properties

### cancelable?

> `optional` **cancelable**: `boolean`

Defined in: src/apis/Alert.ts:33

Whether alert can be dismissed by tapping outside (default: true)

---

### onDismiss()?

> `optional` **onDismiss**: () => `void`

Defined in: src/apis/Alert.ts:35

Callback when alert is dismissed without button press

#### Returns

`void`

---

### userInterfaceStyle?

> `optional` **userInterfaceStyle**: `"unspecified"` \| `"light"` \| `"dark"`

Defined in: src/apis/Alert.ts:37

User interface style (not applicable in terminal)
