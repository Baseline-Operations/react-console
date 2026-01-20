[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / StorageAPI

# Interface: StorageAPI

Defined in: src/utils/storage.ts:708

Storage API interface with generic support

## Properties

### length

> `readonly` **length**: `number`

Defined in: src/utils/storage.ts:728

## Methods

### getItem()

> **getItem**\<`T`\>(`key`, `defaultValue?`): `T` \| `null`

Defined in: src/utils/storage.ts:715

Get an item from storage

#### Type Parameters

##### T

`T` *extends* [`StorageValue`](../type-aliases/StorageValue.md) = [`StorageValue`](../type-aliases/StorageValue.md)

#### Parameters

##### key

`string`

Storage key

##### defaultValue?

Optional default value if key doesn't exist

`T` | `null`

#### Returns

`T` \| `null`

Stored value, default value, or null if not found

***

### setItem()

> **setItem**\<`T`\>(`key`, `value`, `options?`): `void`

Defined in: src/utils/storage.ts:723

Set an item in storage

#### Type Parameters

##### T

`T` *extends* [`StorageValue`](../type-aliases/StorageValue.md) = [`StorageValue`](../type-aliases/StorageValue.md)

#### Parameters

##### key

`string`

Storage key

##### value

`T`

Value to store

##### options?

Optional storage options (TTL in milliseconds)

###### ttl?

`number`

#### Returns

`void`

***

### removeItem()

> **removeItem**(`key`): `void`

Defined in: src/utils/storage.ts:725

#### Parameters

##### key

`string`

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: src/utils/storage.ts:726

#### Returns

`void`

***

### keys()

> **keys**(): `string`[]

Defined in: src/utils/storage.ts:727

#### Returns

`string`[]

***

### hasItem()

> **hasItem**(`key`): `boolean`

Defined in: src/utils/storage.ts:729

#### Parameters

##### key

`string`

#### Returns

`boolean`

***

### getStoragePath()

> **getStoragePath**(): `string`

Defined in: src/utils/storage.ts:730

#### Returns

`string`

***

### getAppId()

> **getAppId**(): `string`

Defined in: src/utils/storage.ts:731

#### Returns

`string`
