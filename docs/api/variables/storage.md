[**React Console API v0.1.0**](../README.md)

***

[React Console API](../globals.md) / storage

# Variable: storage

> `const` **storage**: [`StorageAPI`](../interfaces/StorageAPI.md)

Defined in: src/utils/storage.ts:827

Storage singleton - automatically initialized

Automatically created when first accessed. Uses app ID derived from process.cwd().
Each application gets its own isolated namespace within the shared encrypted file.

## Example

```ts
import { storage } from 'react-console';

// Use storage (automatically initialized)
storage.setItem('username', 'john');
const username = storage.getItem('username');

// Store with optional TTL
storage.setItem('token', 'abc123', { ttl: 3600000 });
```
