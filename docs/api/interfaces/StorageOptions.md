[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / StorageOptions

# Interface: StorageOptions

Defined in: src/utils/storage.ts:55

Storage options (for initialization)

## Properties

### appId?

> `optional` **appId**: `string`

Defined in: src/utils/storage.ts:60

Application ID/namespace (used to isolate storage per application)
If not provided, auto-generated from process.cwd()

***

### encryptionKey?

> `optional` **encryptionKey**: `string`

Defined in: src/utils/storage.ts:66

Encryption key (if not provided, derives from user home)
For production, provide a secure key

***

### clearOnExit?

> `optional` **clearOnExit**: `boolean`

Defined in: src/utils/storage.ts:72

Clear storage on application exit (default: false)
If true, storage is cleared when application exits

***

### persistInterval?

> `optional` **persistInterval**: `number`

Defined in: src/utils/storage.ts:78

Persist interval in milliseconds (default: 5000)
How often to persist changes to disk
